// PracticePlan Onboarding - Google Apps Script
// This receives form submissions, saves files to Drive, and logs data to Sheets

const SPREADSHEET_ID = '11MRrgeobPxRrWGbWEwWrNMA3XCPjCHa251Zkvw-Y2u0';
const DRIVE_FOLDER_ID = '1MNFEfZeOUeLKC3w4RBhFy0qEwQMNgZmz';
const DRAFTS_SHEET_NAME = 'Drafts';

function doPost(e) {
  try {
    // Handle various content types
    let data;
    
    // Try postData.contents first (works with text/plain and application/json)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        // Try URL decoding in case it's encoded
        try {
          data = JSON.parse(decodeURIComponent(e.postData.contents));
        } catch (decodeError) {
          // Last resort: check form parameter
          if (e.parameter && e.parameter.data) {
            data = JSON.parse(e.parameter.data);
          }
        }
      }
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    }
    
    if (!data) {
      throw new Error('No data received. PostData: ' + JSON.stringify(e.postData) + ', Parameter: ' + JSON.stringify(e.parameter));
    }
    
    // Check if this is a draft save request
    if (data.action === 'saveDraft') {
      return saveDraft(data);
    }
    
    // Otherwise, it's a full submission
    // Create a subfolder for this submission
    const parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const timestamp = new Date().toISOString().split('T')[0];
    const orgName = (data.contactInfo?.organization || 'Unknown').replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50);
    const submissionFolder = parentFolder.createFolder(`${orgName} - ${timestamp}`);
    
    // Process and upload files
    const uploadedFiles = {};
    
    // Handle policy document uploads
    try {
      if (data.policies?.waiverFile?.data) {
        const file = uploadBase64File(
          submissionFolder, 
          data.policies.waiverFile.name || 'waiver.pdf', 
          data.policies.waiverFile.data,
          data.policies.waiverFile.type || 'application/pdf'
        );
        uploadedFiles.waiverFile = file.getUrl();
      }
    } catch (fileError) {
      uploadedFiles.waiverFile = 'Upload failed: ' + fileError.toString();
    }
    
    try {
      if (data.policies?.facilityAgreementFile?.data) {
        const file = uploadBase64File(
          submissionFolder, 
          data.policies.facilityAgreementFile.name || 'agreement.pdf', 
          data.policies.facilityAgreementFile.data,
          data.policies.facilityAgreementFile.type || 'application/pdf'
        );
        uploadedFiles.facilityAgreementFile = file.getUrl();
      }
    } catch (fileError) {
      uploadedFiles.facilityAgreementFile = 'Upload failed: ' + fileError.toString();
    }
    
    // Handle location and space photos
    if (data.locations && data.locations.length > 0) {
      data.locations.forEach((location, locIndex) => {
        const hasPhotos = (location.photos && location.photos.length > 0 && location.photos.some(p => p.data)) || 
          (location.assets && location.assets.some(a => a.photos && a.photos.length > 0 && a.photos.some(p => p.data)));
        
        if (hasPhotos) {
          const locName = (location.name || 'Unnamed').replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30);
          const locationFolder = submissionFolder.createFolder(`${locIndex + 1}. ${locName}`);
          
          // Upload location photos
          if (location.photos && location.photos.length > 0) {
            location.photos.forEach((photo, photoIndex) => {
              if (photo.data) {
                try {
                  uploadBase64File(
                    locationFolder,
                    `location-${photoIndex + 1}-${photo.name || 'image.jpg'}`,
                    photo.data,
                    photo.type || 'image/jpeg'
                  );
                } catch (photoError) {
                  // Continue even if one photo fails
                }
              }
            });
          }
          
          // Upload space photos
          if (location.assets && location.assets.length > 0) {
            location.assets.forEach((asset, assetIndex) => {
              if (asset.photos && asset.photos.length > 0 && asset.photos.some(p => p.data)) {
                const assetName = (asset.name || 'Unnamed').replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30);
                const spaceFolder = locationFolder.createFolder(`${assetIndex + 1}. ${assetName}`);
                asset.photos.forEach((photo, photoIndex) => {
                  if (photo.data) {
                    try {
                      uploadBase64File(
                        spaceFolder,
                        `space-${photoIndex + 1}-${photo.name || 'image.jpg'}`,
                        photo.data,
                        photo.type || 'image/jpeg'
                      );
                    } catch (photoError) {
                      // Continue even if one photo fails
                    }
                  }
                });
              }
            });
          }
        }
      });
    }
    
    // Log to spreadsheet
    logToSheet(data, submissionFolder.getUrl(), uploadedFiles);
    
    // Mark draft as submitted (if exists)
    markDraftSubmitted(data.contactInfo?.email);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        folderId: submissionFolder.getId(),
        folderUrl: submissionFolder.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error to sheet for debugging
    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
      sheet.appendRow([new Date().toISOString(), 'ERROR', error.toString(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    } catch (logError) {
      // Can't even log the error
    }
    
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Save draft to Drafts sheet
function saveDraft(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let draftsSheet = ss.getSheetByName(DRAFTS_SHEET_NAME);
    
    // Create Drafts sheet if it doesn't exist
    if (!draftsSheet) {
      draftsSheet = ss.insertSheet(DRAFTS_SHEET_NAME);
      draftsSheet.appendRow([
        'Email',
        'Last Updated',
        'Current Step',
        'Contact Name',
        'Organization',
        'Phone',
        '# Locations',
        '# Spaces',
        'Completion %',
        'Status',
        'Form Data (JSON)'
      ]);
      draftsSheet.setFrozenRows(1);
      
      // Set column widths for readability
      draftsSheet.setColumnWidth(1, 200); // Email
      draftsSheet.setColumnWidth(2, 150); // Last Updated
      draftsSheet.setColumnWidth(11, 400); // JSON
    }
    
    const email = data.email?.toLowerCase().trim();
    if (!email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Email required for draft save' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Calculate stats
    const numLocations = data.formData?.locations?.length || 0;
    const numSpaces = data.formData?.locations?.reduce((sum, loc) => sum + (loc.assets?.length || 0), 0) || 0;
    const completionPct = data.completionPct || 0;
    
    // Check if draft already exists for this email
    const dataRange = draftsSheet.getDataRange();
    const values = dataRange.getValues();
    let existingRow = -1;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0]?.toLowerCase().trim() === email && values[i][9] !== 'Submitted') {
        existingRow = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    const rowData = [
      email,
      new Date().toISOString(),
      data.currentStep || 0,
      data.formData?.contactInfo?.fullName || '',
      data.formData?.contactInfo?.organization || '',
      data.formData?.contactInfo?.phone || '',
      numLocations,
      numSpaces,
      completionPct,
      'In Progress',
      JSON.stringify(data.formData || {})
    ];
    
    if (existingRow > 0) {
      // Update existing row
      draftsSheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Append new row
      draftsSheet.appendRow(rowData);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Draft saved' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get draft by email
function getDraft(email) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const draftsSheet = ss.getSheetByName(DRAFTS_SHEET_NAME);
    
    if (!draftsSheet) {
      return null;
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    const dataRange = draftsSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0]?.toLowerCase().trim() === normalizedEmail && values[i][9] !== 'Submitted') {
        // Found a draft
        const jsonData = values[i][10];
        try {
          return {
            email: values[i][0],
            lastUpdated: values[i][1],
            currentStep: values[i][2],
            formData: JSON.parse(jsonData || '{}')
          };
        } catch (parseError) {
          return null;
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Mark draft as submitted
function markDraftSubmitted(email) {
  if (!email) return;
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const draftsSheet = ss.getSheetByName(DRAFTS_SHEET_NAME);
    
    if (!draftsSheet) return;
    
    const normalizedEmail = email.toLowerCase().trim();
    const dataRange = draftsSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0]?.toLowerCase().trim() === normalizedEmail && values[i][9] !== 'Submitted') {
        // Mark as submitted
        draftsSheet.getRange(i + 1, 10).setValue('Submitted');
        break;
      }
    }
  } catch (error) {
    // Silently fail - not critical
  }
}

function uploadBase64File(folder, filename, base64Data, mimeType) {
  // Remove data URL prefix if present
  const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Clean), 
    mimeType, 
    filename
  );
  return folder.createFile(blob);
}

function logToSheet(data, folderUrl, uploadedFiles) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  
  // Create headers if this is the first entry
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Status',
      'Organization',
      'Contact Name',
      'Email',
      'Phone',
      'Go Live Date',
      'Booking Window (months)',
      'Require Approval',
      'Notify on Booking',
      'Cancellation (days)',
      'Weather Refund',
      'Require Insurance',
      'Time Increment (min)',
      'Waiver Text',
      'Facility Policy Text',
      '# Locations',
      '# Total Spaces',
      'Locations Summary',
      'Spaces Summary',
      'Drive Folder',
      'Waiver File',
      'Agreement File'
    ]);
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }
  
  // Count total spaces
  const totalSpaces = data.locations ? 
    data.locations.reduce((sum, loc) => sum + (loc.assets ? loc.assets.length : 0), 0) : 0;
  
  // Create human-readable location summary
  const locationsSummary = data.locations ? 
    data.locations.map((loc, i) => `${i + 1}. ${loc.name || 'Unnamed'} (${loc.type || 'unknown'})`).join('\n') : '';
  
  // Create human-readable spaces summary
  let spacesSummary = '';
  if (data.locations) {
    const spacesArr = [];
    data.locations.forEach((loc) => {
      if (loc.assets && loc.assets.length > 0) {
        loc.assets.forEach((asset) => {
          const types = asset.reservationTypes ? asset.reservationTypes.slice(0, 3).join(', ') : '';
          spacesArr.push(`${asset.name || 'Unnamed'} @ ${loc.name || 'Unnamed'} - $${asset.pricing || '?'}/hr - ${asset.indoorOutdoor || '?'} ${asset.type || ''} ${types ? '(' + types + ')' : ''}`);
        });
      }
    });
    spacesSummary = spacesArr.join('\n');
  }
  
  // Append the row (removed Job Title column)
  sheet.appendRow([
    new Date().toISOString(),
    'New Submission',
    data.contactInfo?.organization || '',
    data.contactInfo?.fullName || '',
    data.contactInfo?.email || '',
    data.contactInfo?.phone || '',
    data.policies?.goLiveDate || '',
    data.policies?.bookingWindowMonths || '',
    data.policies?.requireApproval || '',
    data.policies?.notifyOnBooking || '',
    data.policies?.cancellationDays || '',
    data.policies?.weatherRefund || '',
    data.policies?.requireInsurance || '',
    data.policies?.timeIncrement || '',
    data.policies?.waiverText || '',
    data.policies?.facilityAgreement || '',
    data.locations ? data.locations.length : 0,
    totalSpaces,
    locationsSummary,
    spacesSummary,
    folderUrl,
    uploadedFiles.waiverFile || '',
    uploadedFiles.facilityAgreementFile || ''
  ]);
}

// Handle CORS preflight requests and GET requests (including draft lookup)
function doGet(e) {
  // Check if this is a draft lookup request
  if (e.parameter && e.parameter.action === 'getDraft' && e.parameter.email) {
    const draft = getDraft(e.parameter.email);
    
    if (draft) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          found: true,
          draft: draft
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          found: false
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Default health check response
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'PracticePlan API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
