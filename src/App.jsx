import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Building2, FileText, Shield, Clock, Users, DollarSign, Plus, Trash2, MapPin, Mail, User, X, School, Copy, Sparkles, PartyPopper, HelpCircle, AlertCircle, Crown, Save, Eye, Layers, Church, Landmark, Building, Home, Upload, File, Camera, Image } from 'lucide-react';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// Tooltip component
const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();
  
  // Close tooltip when clicking outside
  useEffect(() => {
    if (show) {
      const handleClose = () => setShow(false);
      // Small delay to prevent immediate close on same tap
      const timer = setTimeout(() => {
        document.addEventListener('touchstart', handleClose);
        document.addEventListener('click', handleClose);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('touchstart', handleClose);
        document.removeEventListener('click', handleClose);
      };
    }
  }, [show]);
  
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(!show);
  };
  
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {children}
      <button
        type="button"
        onTouchEnd={handleToggle}
        onClick={handleToggle}
        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: '#94a3b8', WebkitTapHighlightColor: 'transparent' }}
      >
        <HelpCircle size={16} />
      </button>
      {show && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '12px 16px',
            background: '#1e293b',
            color: 'white',
            fontSize: '13px',
            borderRadius: '10px',
            whiteSpace: 'normal',
            width: 'max-content',
            maxWidth: isMobile ? '240px' : '280px',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            lineHeight: 1.5,
          }}>
          {text}
          {isMobile && (
            <button 
              onClick={() => setShow(false)}
              style={{ 
                display: 'block',
                width: '100%',
                marginTop: '10px', 
                padding: '8px',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px', 
                color: 'white', 
                textAlign: 'center',
                cursor: 'pointer',
              }}>
              Got it
            </button>
          )}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            border: '6px solid transparent',
            borderTopColor: '#1e293b',
          }} />
        </div>
      )}
    </div>
  );
};

// Validation error message
const ErrorMessage = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#dc2626', fontSize: '13px' }}>
    <AlertCircle size={14} />
    <span>{message}</span>
  </div>
);

const emptyApprover = { name: '', email: '' };
const emptyNotification = { name: '', email: '' };
const emptyAmenity = { name: '', price: '', isCustom: true };

const createEmptyAsset = (type = '', locationType = '') => {
  // Get default add-ons based on location type
  const defaultIds = defaultAddOnsByType[locationType] || [];
  const defaultAmenities = defaultIds.map(id => {
    const addon = allAmenities.find(a => a.id === id);
    return addon ? { id: addon.id, name: addon.name, price: '', isCustom: false } : null;
  }).filter(Boolean);
  
  return {
    type,
    name: '',
    weekdayAvailability: { start: '15:00', end: '22:00' },
    weekendAvailability: { start: '08:00', end: '22:00' },
    blackoutOption: 'none',
    blackoutDates: '',
    approvers: [{ ...emptyApprover }],
    notifications: [{ ...emptyNotification }],
    pricing: '',
    amenities: defaultAmenities.length > 0 ? defaultAmenities : [{ ...emptyAmenity }],
    photos: [],
  };
};

const duplicateAsset = (asset) => ({
  ...JSON.parse(JSON.stringify(asset)),
  name: asset.name ? `${asset.name} (Copy)` : '',
});

const createEmptyLocation = (type, name = '') => ({
  id: Date.now() + Math.random(),
  type,
  name: name,
  address: '',
  contactName: '',
  contactEmail: '',
  photos: [],
  assets: [createEmptyAsset('', type)],
});

const duplicateLocation = (location) => ({
  ...JSON.parse(JSON.stringify(location)),
  id: Date.now() + Math.random(),
  name: location.name ? `${location.name} (Copy)` : '',
});

const locationTypes = [
  { value: 'school', label: 'School', icon: School },
  { value: 'recreation', label: 'Recreation Center', icon: Users },
  { value: 'church', label: 'Church / Place of Worship', icon: Church },
  { value: 'municipal', label: 'Municipal / Government', icon: Landmark },
  { value: 'private', label: 'Private Facility', icon: Building },
  { value: 'other', label: 'Other', icon: Home },
];

const spaceTypes = [
  { value: 'gymnasium', label: 'Gymnasium', icon: 'gymnasium' },
  { value: 'field', label: 'Field / Turf', icon: 'field' },
  { value: 'court', label: 'Court (Tennis, Pickleball)', icon: 'court' },
  { value: 'pool', label: 'Pool / Aquatic', icon: 'pool' },
  { value: 'auditorium', label: 'Auditorium / Theater', icon: 'auditorium' },
  { value: 'meeting', label: 'Meeting Room', icon: 'meeting' },
  { value: 'classroom', label: 'Classroom', icon: 'classroom' },
  { value: 'kitchen', label: 'Kitchen / Cafeteria', icon: 'kitchen' },
  { value: 'outdoor', label: 'Outdoor / Pavilion', icon: 'outdoor' },
  { value: 'track', label: 'Track', icon: 'track' },
  { value: 'weight', label: 'Weight Room / Fitness', icon: 'weight' },
  { value: 'other', label: 'Other', icon: 'other' },
];

// SVG icons for space types
const SpaceTypeIcon = ({ type, size = 24, color = '#0076bb' }) => {
  const icons = {
    gymnasium: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="3" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="21" y2="12" />
      </svg>
    ),
    field: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="12" y1="4" x2="12" y2="20" />
        <circle cx="12" cy="12" r="3" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
    court: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M7 8h10" />
        <line x1="12" y1="13" x2="12" y2="21" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
    pool: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M2 16c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" />
        <path d="M2 20c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" />
        <path d="M8 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
      </svg>
    ),
    auditorium: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
        <path d="M4 11l8-7 8 7" />
        <rect x="8" y="14" width="8" height="6" />
      </svg>
    ),
    meeting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    classroom: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
      </svg>
    ),
    kitchen: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
    outdoor: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    track: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <ellipse cx="12" cy="12" rx="6" ry="3" />
        <line x1="12" y1="6" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="18" />
      </svg>
    ),
    weight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M6 12h12" />
        <rect x="2" y="7" width="4" height="10" rx="1" />
        <rect x="18" y="7" width="4" height="10" rx="1" />
      </svg>
    ),
    other: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  };
  return icons[type] || icons.other;
};

// Categorized amenities list
const amenityCategories = [
  {
    name: 'AV & Tech',
    items: [
      { id: 'audio_system', name: 'Audio / Sound System', description: 'Portable or venue sound system' },
      { id: 'jumbotron', name: 'Jumbotron / Video Board', description: 'Video display board for replays and info' },
      { id: 'livestream', name: 'Livestream Setup', description: 'Camera, encoder, and streaming for online broadcast' },
      { id: 'scoreboard_op', name: 'Scoreboard Operation', description: 'Dedicated scoreboard operator for the event' },
      { id: 'ticket_scanning', name: 'Ticket Scanning', description: 'Digital ticket scanning at entry gates' },
      { id: 'wifi', name: 'WiFi Access', description: 'Venue WiFi access for staff and guests' },
      { id: 'projector', name: 'Projector & Screen', description: 'Portable projector and screen setup' },
      { id: 'wireless_mics', name: 'Wireless Microphones', description: 'Handheld or lapel wireless mic system' },
    ]
  },
  {
    name: 'Equipment',
    items: [
      { id: 'floor_covers', name: 'Gym Floor Covers', description: 'Protective floor covering for non-sport events' },
      { id: 'nets_goals', name: 'Nets / Goals Setup', description: 'Sport-specific net or goal installation' },
      { id: 'stage', name: 'Stage / Platform', description: 'Portable stage or raised platform setup' },
      { id: 'tables_chairs', name: 'Tables & Chairs (50+)', description: 'Folding tables and chairs for events' },
      { id: 'tarps', name: 'Tarps / Field Protection', description: 'Protective tarps for field surface' },
      { id: 'tents', name: 'Pop-Up Tents / Canopies', description: 'Portable shade canopies for outdoor events' },
      { id: 'crash_pads', name: 'Crash Pads / Mats', description: 'Gymnastics or wrestling mats and padding' },
      { id: 'ball_racks', name: 'Ball Racks / Carts', description: 'Portable ball racks and equipment carts' },
      { id: 'line_marking', name: 'Line Marking / Paint', description: 'Field or court line painting and marking' },
      { id: 'podium', name: 'Podium / Lectern', description: 'Portable podium for presentations and ceremonies' },
    ]
  },
  {
    name: 'Event Staff',
    items: [
      { id: 'announcer', name: 'Announcer (PA System)', description: 'Live PA announcer for games and events' },
      { id: 'athletic_trainer', name: 'Athletic Trainer On-Site', description: 'Certified athletic trainer present during event' },
      { id: 'clock_operator', name: 'Clock Operator', description: 'Dedicated operator for game and shot clocks' },
      { id: 'emt', name: 'EMT / First Aid', description: 'Emergency medical technician on standby' },
      { id: 'parking', name: 'Parking Management', description: 'Directed parking and traffic control' },
      { id: 'security', name: 'Security Officer', description: 'Licensed security officer on-site' },
      { id: 'referees', name: 'Referees / Officials', description: 'Certified game officials for competitive events' },
      { id: 'event_coordinator', name: 'Event Coordinator', description: 'Dedicated on-site coordinator for event logistics' },
      { id: 'janitorial', name: 'Janitorial Mid-Event', description: 'Custodial staff on standby during event' },
    ]
  },
  {
    name: 'Facility',
    items: [
      { id: 'hvac', name: 'AC / Climate Control', description: 'Indoor HVAC and temperature regulation' },
      { id: 'bleachers', name: 'Bleacher Setup (1000+)', description: 'Extended seating for large events' },
      { id: 'custodial', name: 'Custodial / Cleanup', description: 'Post-event custodial and cleanup crew' },
      { id: 'field_lights', name: 'Field Lights', description: 'Outdoor field and stadium lighting' },
      { id: 'generator', name: 'Generator / Backup Power', description: 'Portable generator for power backup' },
      { id: 'locker_rooms', name: 'Locker Rooms', description: 'Access to team locker rooms and showers' },
      { id: 'press_box', name: 'Press Box Access', description: 'Press box for media and game operations' },
      { id: 'portable_restrooms', name: 'Portable Restrooms', description: 'Additional portable restroom units for large events' },
      { id: 'track', name: 'Track Usage', description: 'Access to running track surface' },
      { id: 'warmup_area', name: 'Warm-Up Area Access', description: 'Dedicated warm-up or stretching space' },
      { id: 'equipment_storage', name: 'Equipment Storage', description: 'Secure on-site storage for renter equipment' },
      { id: 'ada', name: 'ADA Accessibility Setup', description: 'Wheelchair ramps, accessible seating, and pathways' },
    ]
  },
  {
    name: 'Food & Beverage',
    items: [
      { id: 'concessions', name: 'Concessions', description: 'Food and drink service for spectators' },
      { id: 'water_station', name: 'Water / Hydration Station', description: 'Water coolers and hydration for participants' },
      { id: 'catering', name: 'Catering Allowed', description: 'Permission for outside catering services' },
      { id: 'vending', name: 'Vending Machine Access', description: 'Unlocked vending machines during event' },
      { id: 'ice_cooler', name: 'Ice / Cooler Station', description: 'Ice bins and cooler stations for teams' },
    ]
  },
];

// Flatten for easy lookup
const allAmenities = amenityCategories.flatMap(cat => cat.items);

// Smart defaults for add-ons based on location type
const defaultAddOnsByType = {
  school: ['audio_system', 'scoreboard_op', 'field_lights', 'locker_rooms', 'bleachers'],
  recreation: ['tables_chairs', 'projector', 'hvac', 'custodial'],
  church: ['tables_chairs', 'projector', 'wireless_mics', 'hvac'],
  municipal: ['tables_chairs', 'projector', 'audio_system', 'parking'],
  private: ['projector', 'tables_chairs', 'wifi'],
  other: [],
};

const colors = {
  blue: '#0076bb',
  blueLight: '#0088d4',
  blueDark: '#005a8f',
  green: '#00a84f',
  greenLight: '#00c45c',
  greenDark: '#008a40',
  orange: '#f15a29',
  red: '#dc2626',
};

// Email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone validation (loose - just needs some digits)
const isValidPhone = (phone) => /\d{7,}/.test(phone.replace(/\D/g, ''));

const PracticePlanLogo = ({ width = 220 }) => (
  <svg viewBox="0 0 396.37 66.7" width={width} style={{ display: 'block', maxWidth: '100%', height: 'auto' }}>
    <g>
      <path fill="#f15a29" d="M.72,49.7c-.24-.04-.48-.09-.72-.14.24.05.48.09.72.14Z"/>
      <g>
        <path fill="#00a84f" stroke="#fff" strokeMiterlimit="10" strokeWidth="1.4" d="M38.52,31.97l-18.72-7.88c-1.03-.43-1.86-1.68-1.86-2.8v-8.53c0-1.11.83-1.67,1.86-1.23l20.95,8.82c3.5,1.47,5.25,3.41,5.25,5.34,0,1.93-1.75,3.87-5.25,5.34l-2.23.94Z"/>
        <path fill="#00a84f" stroke="#fff" strokeMiterlimit="10" strokeWidth="1.4" d="M29.74,48.22v11.43c0,1.11-.83,2.37-1.86,2.8l-8.08,3.4c-1.03.43-1.86-.12-1.86-1.23v-21.97c0-1.11.83-2.37,1.86-2.8l20.95-8.82c3.5-1.47,5.25-3.41,5.25-5.34v10.81c0,3.03-1.75,5.61-5.25,7.09l-11.01,4.64Z"/>
      </g>
      <g>
        <path fill="#0076bb" stroke="#fff" strokeMiterlimit="10" strokeWidth="1.4" d="M24.43,21.29L5.71,13.41c-1.03-.43-1.86-1.68-1.86-2.8V2.08c0-1.11.83-1.67,1.86-1.23l20.95,8.82c3.5,1.47,5.25,3.41,5.25,5.34,0,1.93-1.75,3.87-5.25,5.34l-2.23.94Z"/>
        <path fill="#0076bb" stroke="#fff" strokeMiterlimit="10" strokeWidth="1.4" d="M15.65,37.54v11.43c0,1.11-.83,2.37-1.86,2.8l-8.08,3.4c-1.03.43-1.86-.12-1.86-1.23v-21.97c0-1.11.83-2.37,1.86-2.8l20.95-8.82c3.5-1.47,5.25-3.41,5.25-5.34v10.81c0,3.03-1.75,5.61-5.25,7.09l-11.01,4.64Z"/>
      </g>
      <g fill="#0076bb">
        <path d="M87.8,38.08h-11.64l-1,5.69h-6.85l2-11.38h19.16c2.39,0,3.86-1.23,3.86-2.96,0-1.3-1.03-2.13-2.96-2.13h-19.16l1.32-5.79h18.24c6.19,0,9.58,2.89,9.58,7.15,0,5.52-4.82,9.41-12.54,9.41Z"/>
        <path d="M130.29,43.77h-9.21l-3.92-5.89h-10.58l-1.03,5.89h-6.88l2-11.38h19.36c2.29,0,4.29-1.1,4.29-2.89,0-1.46-1.26-2.2-3.39-2.2h-19.36l1.33-5.79h18.5c4.66,0,10.18,1.43,10.18,6.75,0,4.02-2.89,7.42-7.18,8.25.63.57,1.33,1.36,2.56,2.93l3.36,4.32Z"/>
        <path d="M138,43.77l5.19-5.72h5.55c1.36,0,2.89,0,3.96.07-.47-.8-1.16-2.16-1.7-3.23l-2.96-5.89-13.04,14.77h-8.15l17.83-20.12c1.16-1.3,2.73-2.49,4.89-2.49s3.23,1.1,3.96,2.49l10.34,20.12h-25.88Z"/>
        <path d="M190.18,38.05l-5.42,5.72h-11.18c-6.95,0-11.57-4.19-11.57-9.81,0-7.32,6.98-12.44,15.5-12.44h15.6l-5.45,5.79h-11.18c-4.09,0-7.55,2.63-7.55,6.15,0,2.76,2.29,4.59,5.65,4.59h15.6Z"/>
        <path d="M216.65,21.52l-1.08,5.79h-8l-2.93,16.46h-6.88l2.89-16.46h-10.44l5.52-5.79h20.93Z"/>
        <path d="M221.18,43.77h-6.88l3.96-22.25h6.85l-3.93,22.25Z"/>
        <path d="M251.47,38.05l-1.64,5.72h-14.05c-6.95,0-11.57-4.19-11.57-9.81,0-7.32,6.98-12.44,15.5-12.44h14.93l-1.83,5.79h-14.14c-4.09,0-7.55,2.63-7.55,6.15,0,2.76,2.29,4.59,5.65,4.59h14.69Z"/>
        <path d="M278.35,38.05l-4.59,5.72h-21.42l3.96-22.25h24.88l-4.62,5.79h-14.4l-.47,2.66h16.73l-3.92,5.06h-13.7l-.53,3.03h18.09Z"/>
        <path d="M298.05,38.08h-11.64l-1,5.69h-6.85l2-11.38h19.16c2.39,0,3.86-1.23,3.86-2.96,0-1.3-1.03-2.13-2.96-2.13h-19.16l4.14-5.79h15.42c6.19,0,9.58,2.89,9.58,7.15,0,5.52-4.82,9.41-12.54,9.41Z"/>
        <path d="M334.61,38.05l-5.49,5.72h-19.66l3.96-22.25h6.85l-2.93,16.53h17.26Z"/>
        <path d="M342.3,43.77l5.19-5.72h5.55c1.36,0,2.89,0,3.96.07-.47-.8-1.16-2.16-1.7-3.23l-2.96-5.89-13.04,14.77h-8.15l17.83-20.12c1.16-1.3,2.73-2.49,4.89-2.49s3.23,1.1,3.96,2.49l10.34,20.12h-25.88Z"/>
        <path d="M386.02,42.94l-11.47-12.24-2.3,13.07h-6.25l3.23-18.46c.5-2.96,2.46-4.16,4.52-4.16.83,0,1.66.2,2.56,1.2l11.47,12.24,2.33-13.07h6.25l-3.29,18.43c-.53,2.96-2.49,4.19-4.49,4.19-.93,0-1.63-.2-2.56-1.2Z"/>
      </g>
    </g>
  </svg>
);

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.15)',
  background: 'white', color: '#1e293b', fontSize: '16px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
  WebkitAppearance: 'none',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: colors.red,
  background: 'rgba(220, 38, 38, 0.02)',
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%230076bb' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '40px',
};

const textareaStyle = { ...inputStyle, minHeight: '120px', resize: 'vertical' };

// Animated success checkmark
const AnimatedCheck = ({ size = 20, color = '#00a84f', delay = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: `scaleIn 0.3s ease-out ${delay}s both` }}>
    <circle cx="12" cy="12" r="10" fill={color} style={{ animation: `scaleIn 0.3s ease-out ${delay}s both` }} />
    <path 
      d="M8 12l3 3 5-6" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ 
        strokeDasharray: 24, 
        strokeDashoffset: 24,
        animation: `checkmark 0.4s ease-out ${delay + 0.2}s forwards`
      }}
    />
  </svg>
);

// Success flash wrapper - wraps content and flashes green when triggered
const SuccessFlash = ({ children, flash, style = {} }) => (
  <div style={{ 
    ...style, 
    borderRadius: '12px',
    animation: flash ? 'greenFlash 0.8s ease-out' : 'none'
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle, isMobile }) => (
  <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '14px', marginBottom: '8px' }}>
      {Icon && (
        <div style={{ width: isMobile ? '40px' : '44px', height: isMobile ? '40px' : '44px', borderRadius: '12px', background: `linear-gradient(135deg, rgba(0, 118, 187, 0.1) 0%, rgba(0, 168, 79, 0.1) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={isMobile ? 20 : 22} color={colors.blue} />
        </div>
      )}
      <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: isMobile ? '20px' : '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>{title}</h2>
    </div>
    {subtitle && <p style={{ margin: 0, color: '#64748b', fontSize: isMobile ? '14px' : '15px', paddingLeft: Icon ? (isMobile ? '52px' : '58px') : '0' }}>{subtitle}</p>}
  </div>
);

const FormGroup = ({ label, hint, children, required, error, tooltip }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
      {label}{required && <span style={{ color: colors.red, marginLeft: '2px' }}>*</span>}
      {tooltip && <Tooltip text={tooltip}><span /></Tooltip>}
    </label>
    {hint && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b' }}>{hint}</p>}
    {children}
    {error && <ErrorMessage message={error} />}
  </div>
);

// Photo upload component
const PhotoUpload = ({ photos = [], onAdd, onRemove, maxPhotos = 5, isMobile }) => {
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') && photos.length < maxPhotos) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onAdd({
            id: Date.now() + Math.random(),
            name: file.name,
            data: event.target.result,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    });
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Camera size={16} color={colors.blue} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Photos</span>
        <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div 
            key={photo.id || index} 
            style={{ 
              position: 'relative', 
              width: isMobile ? '80px' : '100px', 
              height: isMobile ? '80px' : '100px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '1px solid rgba(0, 118, 187, 0.15)'
            }}
          >
            <img 
              src={photo.data} 
              alt={photo.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => onRemove(photo.id || index)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Add photo button */}
        {photos.length < maxPhotos && (
          <label 
            style={{ 
              width: isMobile ? '80px' : '100px', 
              height: isMobile ? '80px' : '100px', 
              borderRadius: '12px', 
              border: '2px dashed rgba(0, 118, 187, 0.25)',
              background: 'rgba(0, 118, 187, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'rgba(0, 118, 187, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Plus size={18} color={colors.blue} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>Add Photo</span>
          </label>
        )}
      </div>
      
      <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#94a3b8' }}>
        {photos.length}/{maxPhotos} photos • JPG, PNG, or HEIC
      </p>
    </div>
  );
};

const CardSection = ({ children, style = {}, isMobile }) => (
  <div style={{ background: 'rgba(248, 250, 252, 0.6)', borderRadius: isMobile ? '12px' : '16px', border: '1px solid rgba(0, 118, 187, 0.08)', padding: isMobile ? '16px' : '24px', marginBottom: isMobile ? '16px' : '24px', ...style }}>{children}</div>
);

// Progress indicator for mobile
const MobileProgressBar = ({ currentStep, totalSteps }) => (
  <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid rgba(0, 118, 187, 0.08)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Step {currentStep} of {totalSteps}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.blue }}>{Math.round((currentStep / totalSteps) * 100)}%</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(0, 118, 187, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(currentStep / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${colors.blue}, ${colors.green})`, borderRadius: '3px', transition: 'width 0.3s ease' }} />
    </div>
  </div>
);

function WelcomeStep({ onContinue, isMobile }) {
  return (
    <div style={{ textAlign: 'center', padding: isMobile ? '10px 0' : '20px 0' }}>
      <div style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: isMobile ? '16px' : '20px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(0, 118, 187, 0.3)' }}>
        <Sparkles size={isMobile ? 32 : 40} color="white" />
      </div>
      <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: isMobile ? '28px' : '36px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a', lineHeight: 1.2 }}>
        Welcome to PracticePlan!
      </h1>
      <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#64748b', margin: '0 0 32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, padding: isMobile ? '0 10px' : 0 }}>
        We're thrilled to have you on board. Let's get your facilities set up so your community can start booking.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? '12px' : '20px', maxWidth: '600px', margin: '0 auto 32px' }}>
        {[
          { icon: '⚡', title: 'Quick Setup', desc: 'Just 5-10 minutes' },
          { icon: '🔄', title: 'Easy Duplicating', desc: 'Copy settings across facilities' },
          { icon: '✨', title: 'We Handle the Rest', desc: 'Our team sets everything up' },
        ].map((item, i) => (
          <div key={i} style={{ padding: isMobile ? '16px' : '24px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '16px', border: '1px solid rgba(0, 118, 187, 0.08)', display: isMobile ? 'flex' : 'block', alignItems: 'center', gap: '16px', textAlign: isMobile ? 'left' : 'center' }}>
            <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? 0 : '12px' }}>{item.icon}</div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onContinue} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: isMobile ? '16px 32px' : '18px 40px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: isMobile ? '16px' : '17px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 30px rgba(0, 118, 187, 0.35)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
        Let's Get Started
        <ChevronRight size={22} />
      </button>
      
      <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
        This usually takes about 5-10 minutes
      </p>
    </div>
  );
}

// ===========================================
// GOOGLE FORM CONFIGURATION
// ===========================================
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse';

const GOOGLE_FORM_FIELDS = {
  fullName: 'entry.XXXXXXXXXX',
  jobTitle: 'entry.XXXXXXXXXX',
  organization: 'entry.XXXXXXXXXX',
  email: 'entry.XXXXXXXXXX',
  phone: 'entry.XXXXXXXXXX',
  cancellationDays: 'entry.XXXXXXXXXX',
  weatherRefund: 'entry.XXXXXXXXXX',
  requireInsurance: 'entry.XXXXXXXXXX',
  timeIncrement: 'entry.XXXXXXXXXX',
  waiverText: 'entry.XXXXXXXXXX',
  facilityAgreement: 'entry.XXXXXXXXXX',
  allData: 'entry.XXXXXXXXXX',
};
// ===========================================

function ContactInfoStep({ data, update, errors, isMobile }) {
  return (
    <div>
      <SectionTitle icon={User} title="Let's Start With You" subtitle="Tell us a bit about yourself so we can keep you updated on your setup." isMobile={isMobile} />
      <CardSection isMobile={isMobile}>
        <div style={{ maxWidth: '500px' }}>
          <FormGroup label="Full Name" required error={errors.fullName}>
            <input type="text" value={data.fullName} onChange={(e) => update('fullName', e.target.value)} style={errors.fullName ? inputErrorStyle : inputStyle} placeholder="e.g., John Smith" />
          </FormGroup>
          <FormGroup label="Job Title" required error={errors.jobTitle}>
            <input type="text" value={data.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} style={errors.jobTitle ? inputErrorStyle : inputStyle} placeholder="e.g., Athletic Director, Facilities Manager" />
          </FormGroup>
          <FormGroup label="Organization Name" required error={errors.organization}>
            <input type="text" value={data.organization} onChange={(e) => update('organization', e.target.value)} style={errors.organization ? inputErrorStyle : inputStyle} placeholder="e.g., Springfield School District, First Baptist Church" />
          </FormGroup>
          <FormGroup label="Email Address" required error={errors.email}>
            <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} style={errors.email ? inputErrorStyle : inputStyle} placeholder="you@example.org" autoCapitalize="none" />
          </FormGroup>
          <FormGroup label="Mobile Phone" required error={errors.phone}>
            <input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} style={errors.phone ? inputErrorStyle : inputStyle} placeholder="(555) 123-4567" />
          </FormGroup>
        </div>
      </CardSection>
      <div style={{ padding: isMobile ? '16px' : '20px 24px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '24px', flexShrink: 0 }}>🔒</div>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Your information is secure and will only be used to communicate about your PracticePlan setup.</p>
      </div>
    </div>
  );
}

function PoliciesStep({ data, update, isMobile }) {
  const [showCustomCancellation, setShowCustomCancellation] = useState(data.cancellationDays === 'custom');
  const [showCustomIncrement, setShowCustomIncrement] = useState(data.timeIncrement === 'custom');
  
  const handleCancellationChange = (value) => {
    update('cancellationDays', value);
    setShowCustomCancellation(value === 'custom');
  };
  
  const handleIncrementChange = (value) => {
    update('timeIncrement', value);
    setShowCustomIncrement(value === 'custom');
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      // Store file name and create a data URL for the file
      const reader = new FileReader();
      reader.onload = (e) => {
        update(field, { name: file.name, data: e.target.result, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field) => {
    update(field, null);
  };

  const FileUploadBox = ({ field, value, label }) => (
    <div>
      {value && value.name ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(0, 168, 79, 0.06)', borderRadius: '12px', border: '1px solid rgba(0, 168, 79, 0.2)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 168, 79, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <File size={20} color={colors.green} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: colors.green }}>Uploaded successfully</p>
          </div>
          <button onClick={() => removeFile(field)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
      ) : (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: 'rgba(0, 118, 187, 0.03)', borderRadius: '12px', border: '2px dashed rgba(0, 118, 187, 0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileUpload(field, e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={24} color={colors.blue} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.blue }}>Click to upload {label}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>PDF, DOC, DOCX, or TXT</p>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <div>
      <SectionTitle icon={FileText} title="Set Your Ground Rules" subtitle="These policies will apply across all your locations - you can always change them later!" isMobile={isMobile} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px' }}>
        <CardSection isMobile={isMobile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Clock size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Cancellation Policy</h3>
            <Tooltip text="This is how far in advance renters must cancel to receive a refund. After this window, their payment is non-refundable."><span /></Tooltip>
          </div>
          <FormGroup label="Cancellation Window">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: showCustomCancellation ? '12px' : 0 }}>
              {[
                { value: '3', label: '3 days' },
                { value: '7', label: '7 days' },
                { value: '14', label: '14 days' },
                { value: '30', label: '30 days' },
                { value: 'custom', label: 'Custom' },
                { value: 'unsure', label: 'Not sure yet' },
              ].map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => handleCancellationChange(opt.value)} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    border: (data.cancellationDays === opt.value || (showCustomCancellation && opt.value === 'custom')) ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                    background: (data.cancellationDays === opt.value || (showCustomCancellation && opt.value === 'custom')) ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: (data.cancellationDays === opt.value || (showCustomCancellation && opt.value === 'custom')) ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {showCustomCancellation && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  value={data.customCancellationDays || ''} 
                  onChange={(e) => update('customCancellationDays', e.target.value)}
                  style={{ ...inputStyle, width: '80px' }}
                  placeholder="0"
                  min="1"
                />
                <span style={{ fontSize: '14px', color: '#64748b' }}>days before booking</span>
              </div>
            )}
          </FormGroup>
        </CardSection>
        <CardSection isMobile={isMobile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>🌧️</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Weather Policy</h3>
            <Tooltip text="If you cancel a rental due to weather (rain, lightning, etc.), should the renter receive a refund or credit?"><span /></Tooltip>
          </div>
          <FormGroup label="Weather Cancellations">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'yes', label: 'Yes, refund' },
                { value: 'credit', label: 'Credit only' },
                { value: 'no', label: 'No refunds' },
                { value: 'unsure', label: 'Not sure yet' },
              ].map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => update('weatherRefund', opt.value)} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    border: data.weatherRefund === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                    background: data.weatherRefund === opt.value ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: data.weatherRefund === opt.value ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FormGroup>
        </CardSection>
        <CardSection isMobile={isMobile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Shield size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Liability Insurance</h3>
            <Tooltip text="Many organizations require renters to provide a Certificate of Insurance (COI) naming your organization as additionally insured."><span /></Tooltip>
          </div>
          <FormGroup label="Require Insurance?">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'yes', label: 'Yes, require it' },
                { value: 'sometimes', label: 'Case by case' },
                { value: 'no', label: 'Not required' },
                { value: 'unsure', label: 'Not sure yet' },
              ].map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => update('requireInsurance', opt.value)} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    border: data.requireInsurance === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                    background: data.requireInsurance === opt.value ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: data.requireInsurance === opt.value ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FormGroup>
        </CardSection>
        <CardSection isMobile={isMobile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Clock size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Booking Increments</h3>
            <Tooltip text="This determines the minimum booking length and how time slots appear to renters. 1-hour slots are most common."><span /></Tooltip>
          </div>
          <FormGroup label="Time Slots">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: showCustomIncrement ? '12px' : 0 }}>
              {[
                { value: '30', label: '30 min' },
                { value: '60', label: '1 hour' },
                { value: '90', label: '90 min' },
                { value: '120', label: '2 hours' },
                { value: 'custom', label: 'Custom' },
                { value: 'unsure', label: 'Not sure yet' },
              ].map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => handleIncrementChange(opt.value)} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    border: (data.timeIncrement === opt.value || (showCustomIncrement && opt.value === 'custom')) ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                    background: (data.timeIncrement === opt.value || (showCustomIncrement && opt.value === 'custom')) ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: (data.timeIncrement === opt.value || (showCustomIncrement && opt.value === 'custom')) ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {showCustomIncrement && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  value={data.customTimeIncrement || ''} 
                  onChange={(e) => update('customTimeIncrement', e.target.value)}
                  style={{ ...inputStyle, width: '80px' }}
                  placeholder="0"
                  min="15"
                  step="15"
                />
                <span style={{ fontSize: '14px', color: '#64748b' }}>minutes</span>
              </div>
            )}
          </FormGroup>
        </CardSection>
      </div>
      <CardSection isMobile={isMobile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <FileText size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Waivers & Agreements</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, background: 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: '6px' }}>Optional</span>
          <Tooltip text="If you have waiver language that renters must agree to, upload it or paste it here. They'll see this during the booking process."><span /></Tooltip>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b' }}>Got a waiver renters need to sign? Upload a document or paste the text below.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Upload Document</p>
            <FileUploadBox field="waiverFile" value={data.waiverFile} label="waiver" />
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Or Paste Text</p>
            <textarea value={data.waiverText || ''} onChange={(e) => update('waiverText', e.target.value)} style={{ ...textareaStyle, minHeight: '140px' }} placeholder="Paste your waiver or liability release language here..." />
          </div>
        </div>
      </CardSection>
      <CardSection isMobile={isMobile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <FileText size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Rental Policy Document</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, background: 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: '6px' }}>Optional</span>
          <Tooltip text="Any facility use policies, rules, or rental agreements you want renters to acknowledge before booking."><span /></Tooltip>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b' }}>Have a facility use policy or rental agreement? Upload a document or paste the text below.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Upload Document</p>
            <FileUploadBox field="facilityAgreementFile" value={data.facilityAgreementFile} label="policy" />
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Or Paste Text</p>
            <textarea value={data.facilityAgreement || ''} onChange={(e) => update('facilityAgreement', e.target.value)} style={{ ...textareaStyle, minHeight: '140px' }} placeholder="Paste your facility use policy or rental agreement here..." />
          </div>
        </div>
      </CardSection>
    </div>
  );
}

function AssetCard({ asset, assetIndex, locationId, isExpanded, onToggle, updateAsset, updateApprover, addApprover, removeApprover, moveApprover, updateNotification, addNotification, removeNotification, updateAmenity, addAmenity, removeAmenity, removeAsset, duplicateAsset: onDuplicate, canRemove, isMobile, errors, isFirstSpace = false }) {
  const assetErrors = errors || {};
  const spaceTypeInfo = spaceTypes.find(t => t.value === asset.type) || null;
  const approverCount = asset.approvers.length;
  
  // Check if space is complete
  const isComplete = asset.name && asset.pricing && asset.type;
  
  return (
    <div className="animate-fade-in-up" style={{ background: 'white', borderRadius: '16px', marginBottom: '16px', overflow: 'hidden', transition: 'all 0.3s ease', border: isExpanded ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.1)', boxShadow: isExpanded ? '0 8px 32px rgba(0, 118, 187, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
      <div onClick={onToggle} style={{ padding: isMobile ? '16px' : '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? `rgba(0, 118, 187, 0.03)` : 'transparent', transition: 'background 0.2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', flex: 1, minWidth: 0 }}>
          <div style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: spaceTypeInfo ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : 'rgba(0, 118, 187, 0.08)', flexShrink: 0, transition: 'all 0.3s ease' }}>
            {spaceTypeInfo ? <SpaceTypeIcon type={spaceTypeInfo.icon} size={isMobile ? 20 : 24} color="white" /> : <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700, color: '#64748b' }}>{assetIndex + 1}</span>}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: isMobile ? '15px' : '16px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{asset.name || `Space ${assetIndex + 1}`}</h4>
              {isComplete && !isExpanded && <AnimatedCheck size={18} color={colors.green} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {spaceTypeInfo && <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(0, 118, 187, 0.08)', color: colors.blue, fontSize: '11px', fontWeight: 600 }}>{spaceTypeInfo.label}</span>}
              <span style={{ fontSize: '13px', color: '#64748b' }}>{asset.pricing ? `$${asset.pricing}/hour` : 'Pricing not set'}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px', flexShrink: 0 }}>
          {!isMobile && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDuplicate(locationId, assetIndex); }} 
              title="Duplicate this space" 
              style={{ 
                padding: '6px 10px', 
                borderRadius: '6px', 
                border: '1px solid rgba(0, 118, 187, 0.15)', 
                background: 'white', 
                color: '#64748b', 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              <Copy size={14} />
              <span>Copy</span>
            </button>
          )}
          {!isMobile && canRemove && (
            <button 
              onClick={(e) => { e.stopPropagation(); removeAsset(locationId, assetIndex); }} 
              style={{ 
                padding: '6px', 
                borderRadius: '6px', 
                border: 'none', 
                background: 'transparent', 
                color: '#94a3b8', 
                cursor: 'pointer', 
                transition: 'color 0.2s' 
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            marginLeft: isMobile ? '4px' : '8px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: isExpanded ? 'rgba(0, 118, 187, 0.08)' : 'rgba(0, 118, 187, 0.04)',
            border: `1px solid ${isExpanded ? colors.blue : 'rgba(0, 118, 187, 0.15)'}`,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isExpanded ? colors.blue : '#64748b' }}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            <ChevronRight size={16} color={isExpanded ? colors.blue : '#64748b'} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="animate-fade-in" style={{ padding: isMobile ? '0 16px 16px' : '0 24px 24px' }}>
          {isMobile && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => onDuplicate(locationId, assetIndex)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}><Copy size={16} />Copy Space</button>
              {canRemove && <button onClick={() => removeAsset(locationId, assetIndex)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'white', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}><Trash2 size={16} />Remove</button>}
            </div>
          )}
          
          {/* Space Type Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>What type of space is this?</label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: '8px' }}>
              {spaceTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => updateAsset(locationId, assetIndex, 'type', type.value)}
                  style={{
                    padding: isMobile ? '12px 6px' : '14px 8px',
                    borderRadius: '10px',
                    border: asset.type === type.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.12)',
                    background: asset.type === type.value ? 'rgba(0, 118, 187, 0.06)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    transition: 'all 0.15s',
                  }}
                >
                  <SpaceTypeIcon type={type.icon} size={isMobile ? 22 : 26} color={asset.type === type.value ? colors.blue : '#64748b'} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: asset.type === type.value ? colors.blue : '#64748b', textAlign: 'center', lineHeight: 1.2 }}>{type.label.split(' / ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <FormGroup label="What's this space called?" required error={assetErrors.name} tooltip="The name renters will see when booking, like 'Main Gym' or 'Conference Room A'.">
              <input type="text" value={asset.name} onChange={(e) => updateAsset(locationId, assetIndex, 'name', e.target.value)} style={assetErrors.name ? inputErrorStyle : inputStyle} placeholder="e.g., Main Gymnasium, Auditorium" />
            </FormGroup>
            <FormGroup label="Hourly Rate" required error={assetErrors.pricing} tooltip="The base price per hour for renting this space. You can set different rates for different renter types later.">
              <input type="number" value={asset.pricing} onChange={(e) => updateAsset(locationId, assetIndex, 'pricing', e.target.value)} style={assetErrors.pricing ? inputErrorStyle : inputStyle} placeholder="$ per hour" inputMode="decimal" />
            </FormGroup>
          </div>
          
          {/* Space Photos */}
          <div style={{ marginBottom: '20px', padding: isMobile ? '16px' : '20px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <PhotoUpload
              photos={asset.photos || []}
              onAdd={(photo) => {
                const newPhotos = [...(asset.photos || []), photo];
                updateAsset(locationId, assetIndex, 'photos', newPhotos);
              }}
              onRemove={(photoId) => {
                const newPhotos = (asset.photos || []).filter((p, i) => (p.id || i) !== photoId);
                updateAsset(locationId, assetIndex, 'photos', newPhotos);
              }}
              maxPhotos={8}
              isMobile={isMobile}
            />
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
              Show renters what this space looks like - courts, fields, seating, equipment, etc.
            </p>
          </div>
          
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: isMobile ? '16px' : '20px', marginBottom: '20px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Clock size={16} color={colors.blue} />
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>When can people book?</h5>
              <Tooltip text="Set the hours this space is available for rental. Renters can only book within these windows."><span /></Tooltip>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Weekdays (Mon-Fri)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="time" value={asset.weekdayAvailability.start} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...asset.weekdayAvailability, start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekdayAvailability.end} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...asset.weekdayAvailability, end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Weekends (Sat-Sun)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="time" value={asset.weekendAvailability.start} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...asset.weekendAvailability, start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekendAvailability.end} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...asset.weekendAvailability, end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </div>
            
            {/* Blackout Dates Section */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed rgba(0, 118, 187, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Blackout Dates</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
                <Tooltip text="Dates when this space is unavailable (holidays, school events, maintenance, etc.)"><span /></Tooltip>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {[
                  { value: 'none', label: 'None yet' },
                  { value: 'holidays', label: 'Major holidays' },
                  { value: 'custom', label: 'I have specific dates' },
                  { value: 'later', label: "I'll provide later" },
                ].map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => updateAsset(locationId, assetIndex, 'blackoutOption', opt.value)} 
                    style={{ 
                      padding: '8px 14px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s', 
                      border: asset.blackoutOption === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                      background: asset.blackoutOption === opt.value ? `rgba(0, 118, 187, 0.08)` : 'white', 
                      color: asset.blackoutOption === opt.value ? colors.blue : '#64748b', 
                      fontSize: '12px', 
                      fontWeight: 600 
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {asset.blackoutOption === 'custom' && (
                <textarea 
                  value={asset.blackoutDates || ''} 
                  onChange={(e) => updateAsset(locationId, assetIndex, 'blackoutDates', e.target.value)}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontSize: '13px' }}
                  placeholder="Enter dates or date ranges, e.g.:&#10;Dec 20 - Jan 3 (Winter Break)&#10;March 15-22 (Spring Break)&#10;July 4, Memorial Day, Labor Day"
                />
              )}
              {asset.blackoutOption === 'holidays' && (
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                  We'll block standard US holidays (New Year's, Memorial Day, July 4th, Labor Day, Thanksgiving, Christmas). You can customize this later.
                </p>
              )}
            </div>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: isMobile ? '16px' : '20px', marginBottom: '20px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={16} color={colors.blue} />
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Approval Chain</h5>
              </div>
              {approverCount < 4 && (
                <button onClick={() => addApprover(locationId, assetIndex)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: `rgba(0, 168, 79, 0.1)`, color: colors.green, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><Plus size={14} />Add Step</button>
              )}
            </div>
            
            {approverCount === 1 ? (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.1)' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  <strong style={{ color: '#334155' }}>One person handles it all.</strong> This person will receive all booking requests and make the final call.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.1)' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  <strong style={{ color: '#334155' }}>Multi-step approval.</strong> Requests start at step 1, then move down. The person with the <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><Crown size={14} color={colors.orange} style={{ margin: '0 3px' }} /></span> makes the final decision.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
              {asset.approvers.map((approver, i) => {
                const isLast = i === approverCount - 1;
                const stepNumber = i + 1;
                return (
                  <div key={i} style={{ 
                    background: 'white', 
                    borderRadius: '10px', 
                    border: isLast ? `2px solid ${colors.orange}` : '1px solid rgba(0, 118, 187, 0.1)',
                    padding: isMobile ? '12px' : '14px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      {isLast ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: `linear-gradient(135deg, ${colors.orange}15 0%, ${colors.orange}25 100%)`, color: colors.orange }}>
                          <Crown size={14} />
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>Final Approver</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 118, 187, 0.08)', color: colors.blue }}>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>Step {stepNumber}</span>
                        </div>
                      )}
                      
                      {/* Reorder and delete buttons */}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {approverCount > 1 && (
                          <>
                            <button 
                              onClick={() => moveApprover(locationId, assetIndex, i, -1)} 
                              disabled={i === 0}
                              style={{ padding: '4px', borderRadius: '4px', border: 'none', background: i === 0 ? 'transparent' : 'rgba(0,0,0,0.04)', color: i === 0 ? '#ddd' : '#64748b', cursor: i === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button 
                              onClick={() => moveApprover(locationId, assetIndex, i, 1)} 
                              disabled={isLast}
                              style={{ padding: '4px', borderRadius: '4px', border: 'none', background: isLast ? 'transparent' : 'rgba(0,0,0,0.04)', color: isLast ? '#ddd' : '#64748b', cursor: isLast ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                            <button 
                              onClick={() => removeApprover(locationId, assetIndex, i)} 
                              style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                      <input type="text" value={approver.name} onChange={(e) => updateApprover(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                      <input type="email" value={approver.email} onChange={(e) => updateApprover(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" autoCapitalize="none" />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {approverCount < 4 && (
              <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Need more review steps? <button onClick={() => addApprover(locationId, assetIndex)} style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Add another approver</button> (up to 4 total)
              </p>
            )}
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: isMobile ? '16px' : '20px', marginBottom: '20px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={16} color={colors.blue} />
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Keep others in the loop</h5>
                <Tooltip text="These people receive booking notifications but don't need to approve anything. Great for custodians, admins, or coaches."><span /></Tooltip>
              </div>
              <button onClick={() => addNotification(locationId, assetIndex)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: `rgba(0, 168, 79, 0.1)`, color: colors.green, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><Plus size={14} />Add</button>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>Get notified about bookings but don't need to approve.</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {asset.notifications.map((notif, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  {isMobile ? (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="text" value={notif.name} onChange={(e) => updateNotification(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                        <input type="email" value={notif.email} onChange={(e) => updateNotification(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" autoCapitalize="none" />
                      </div>
                      {asset.notifications.length > 1 && <button onClick={() => removeNotification(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', alignSelf: 'start', marginTop: '8px' }}><Trash2 size={16} /></button>}
                    </>
                  ) : (
                    <>
                      <input type="text" value={notif.name} onChange={(e) => updateNotification(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                      <input type="email" value={notif.email} onChange={(e) => updateNotification(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" autoCapitalize="none" />
                      {asset.notifications.length > 1 && <button onClick={() => removeNotification(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: isMobile ? '16px' : '20px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <DollarSign size={16} color={colors.blue} />
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Optional Add-ons</h5>
              <Tooltip text="Extra items or services renters can add to their booking for an additional fee."><span /></Tooltip>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>Check any extras you offer and set your price. Select from categories below or add custom items.</p>
            
            {/* Selected add-ons summary */}
            {asset.amenities.filter(a => a.name && !a.isCustom).length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 168, 79, 0.06)', borderRadius: '10px', border: '1px solid rgba(0, 168, 79, 0.15)' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: colors.green }}>
                  {asset.amenities.filter(a => a.name && !a.isCustom).length} add-ons selected
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {asset.amenities.filter(a => a.name && !a.isCustom).map(a => (
                    <span key={a.id} style={{ padding: '4px 10px', borderRadius: '6px', background: 'white', border: '1px solid rgba(0, 168, 79, 0.2)', fontSize: '12px', color: '#1e293b' }}>
                      {a.name} {a.price && <span style={{ color: colors.green }}>+${a.price}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Categorized add-ons */}
            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
              {amenityCategories.map(category => {
                const selectedInCategory = category.items.filter(item => 
                  asset.amenities.some(a => a.id === item.id)
                ).length;
                const [isOpen, setIsOpen] = React.useState(selectedInCategory > 0);
                
                return (
                  <div key={category.name} style={{ border: '1px solid rgba(0, 118, 187, 0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isOpen ? 'rgba(0, 118, 187, 0.04)' : 'white',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{category.name}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>({category.items.length} items)</span>
                        {selectedInCategory > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: '10px', background: colors.green, color: 'white', fontSize: '11px', fontWeight: 600 }}>
                            {selectedInCategory} selected
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '8px', borderTop: '1px solid rgba(0, 118, 187, 0.08)', background: 'white' }}>
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {category.items.map(addon => {
                            const isSelected = asset.amenities.some(a => a.id === addon.id);
                            const selectedAmenity = asset.amenities.find(a => a.id === addon.id);
                            return (
                              <div key={addon.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: isSelected ? `1px solid ${colors.blue}` : '1px solid transparent',
                                background: isSelected ? 'rgba(0, 118, 187, 0.04)' : 'rgba(248, 250, 252, 0.5)',
                                transition: 'all 0.15s'
                              }}>
                                <button
                                  onClick={() => {
                                    if (isSelected) {
                                      const newAmenities = asset.amenities.filter(a => a.id !== addon.id);
                                      updateAsset(locationId, assetIndex, 'amenities', newAmenities.length > 0 ? newAmenities : [{ name: '', price: '', isCustom: true }]);
                                    } else {
                                      const newAmenity = { id: addon.id, name: addon.name, price: '', isCustom: false };
                                      const filtered = asset.amenities.filter(a => a.name || a.price);
                                      updateAsset(locationId, assetIndex, 'amenities', [...filtered, newAmenity]);
                                    }
                                  }}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '5px',
                                    border: isSelected ? 'none' : '2px solid #cbd5e1',
                                    background: isSelected ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    padding: 0
                                  }}
                                >
                                  {isSelected && <Check size={12} color="white" />}
                                </button>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>{addon.name}</span>
                                  {!isMobile && <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>{addon.description}</p>}
                                </div>
                                {isSelected && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>$</span>
                                    <input
                                      type="number"
                                      value={selectedAmenity?.price || ''}
                                      onChange={(e) => {
                                        const newAmenities = asset.amenities.map(a => 
                                          a.id === addon.id ? { ...a, price: e.target.value } : a
                                        );
                                        updateAsset(locationId, assetIndex, 'amenities', newAmenities);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ 
                                        ...inputStyle, 
                                        width: '70px', 
                                        padding: '6px 8px',
                                        textAlign: 'right',
                                        fontSize: '13px'
                                      }}
                                      placeholder="0"
                                      inputMode="decimal"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom add-ons */}
            <div style={{ borderTop: '1px dashed rgba(0, 118, 187, 0.15)', paddingTop: '16px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Custom Add-ons</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {asset.amenities.filter(a => a.isCustom).map((amenity, i) => {
                  const customIndex = asset.amenities.findIndex(a => a === amenity);
                  return (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={amenity.name} 
                        onChange={(e) => {
                          const newAmenities = [...asset.amenities];
                          newAmenities[customIndex] = { ...amenity, name: e.target.value };
                          updateAsset(locationId, assetIndex, 'amenities', newAmenities);
                        }} 
                        style={{ ...inputStyle, flex: 1 }} 
                        placeholder="Add-on name" 
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>$</span>
                        <input 
                          type="number" 
                          value={amenity.price} 
                          onChange={(e) => {
                            const newAmenities = [...asset.amenities];
                            newAmenities[customIndex] = { ...amenity, price: e.target.value };
                            updateAsset(locationId, assetIndex, 'amenities', newAmenities);
                          }} 
                          style={{ ...inputStyle, width: '80px', padding: '8px 10px', textAlign: 'right' }} 
                          placeholder="0" 
                          inputMode="decimal" 
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newAmenities = asset.amenities.filter((_, idx) => idx !== customIndex);
                          updateAsset(locationId, assetIndex, 'amenities', newAmenities.length > 0 ? newAmenities : [{ name: '', price: '', isCustom: true }]);
                        }} 
                        style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => {
                  const newAmenities = [...asset.amenities, { name: '', price: '', isCustom: true }];
                  updateAsset(locationId, assetIndex, 'amenities', newAmenities);
                }} 
                style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px dashed rgba(0, 118, 187, 0.3)', background: 'transparent', color: colors.blue, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                <Plus size={14} />
                Add custom option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location, handlers, canRemove, isMobile, errors, contactInfo, allLocations, onCopySettings, initiallyCollapsed = false, isFirstLocation = false }) {
  const [isExpanded, setIsExpanded] = useState(!initiallyCollapsed);
  const [expandedAsset, setExpandedAsset] = useState(0);
  const [contactMode, setContactMode] = useState(null); // null = choosing, 'self' = use own info, 'other' = new contact
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(!initiallyCollapsed);
  const typeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[5];
  const Icon = typeInfo.icon;
  const locationErrors = errors || {};
  
  // Track when user expands for the first time
  const handleToggle = () => {
    if (!isExpanded) {
      setHasBeenExpanded(true);
    }
    setIsExpanded(!isExpanded);
  };
  
  // Check if contact info is filled
  const hasContactInfo = location.contactName || location.contactEmail;
  
  // Other locations to copy from
  const otherLocations = allLocations?.filter(l => l.id !== location.id) || [];
  
  // Auto-set mode if contact info exists
  useEffect(() => {
    if (hasContactInfo && contactMode === null) {
      setContactMode('other');
    }
  }, [hasContactInfo, contactMode]);

  const fillWithMyInfo = () => {
    handlers.updateLocation(location.id, 'contactName', contactInfo.fullName);
    handlers.updateLocation(location.id, 'contactEmail', contactInfo.email);
    // Set this person as the default final approver for all spaces
    handlers.setLocationApprover(location.id, contactInfo.fullName, contactInfo.email);
    setContactMode('self');
  };

  const resetContactMode = () => {
    handlers.updateLocation(location.id, 'contactName', '');
    handlers.updateLocation(location.id, 'contactEmail', '');
    // Clear approvers back to empty
    handlers.clearLocationApprovers(location.id);
    setContactMode(null);
  };

  // When "someone else" contact info changes, update the approver
  const handleContactChange = (field, value) => {
    handlers.updateLocation(location.id, field, value);
    // If both name and email are filled, update the approver
    const newName = field === 'contactName' ? value : location.contactName;
    const newEmail = field === 'contactEmail' ? value : location.contactEmail;
    if (newName && newEmail) {
      handlers.setLocationApprover(location.id, newName, newEmail);
    }
  };

  const handleBulkAdd = () => {
    const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length === 0) return;
    
    names.forEach(name => {
      const newAsset = createEmptyAsset('', location.type);
      newAsset.name = name;
      newAsset.pricing = bulkPrice;
      handlers.addAssetWithData(location.id, newAsset);
    });
    
    setShowBulkAdd(false);
    setBulkNames('');
    setBulkPrice('');
  };

  // Check if location is complete
  const allSpacesComplete = location.assets.every(a => a.name && a.pricing && a.type);
  const isLocationComplete = location.name && location.address && 
    (location.contactName || contactMode === 'self') && allSpacesComplete;

  return (
    <div className="animate-fade-in-up" style={{ background: 'white', borderRadius: isMobile ? '16px' : '20px', border: isLocationComplete ? `2px solid ${colors.green}` : '1px solid rgba(0, 118, 187, 0.1)', marginBottom: isMobile ? '16px' : '24px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)', transition: 'all 0.3s ease' }}>
      <div onClick={handleToggle} style={{ padding: isMobile ? '16px' : '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isLocationComplete ? 'rgba(0, 168, 79, 0.04)' : `linear-gradient(135deg, rgba(0, 118, 187, 0.03) 0%, rgba(0, 168, 79, 0.03) 100%)`, borderBottom: isExpanded ? '1px solid rgba(0, 118, 187, 0.08)' : 'none', transition: 'background 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', flex: 1, minWidth: 0 }}>
          <div style={{ width: isMobile ? '44px' : '52px', height: isMobile ? '44px' : '52px', borderRadius: '14px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.2s' }}><Icon size={isMobile ? 22 : 26} color="white" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap', maxWidth: isMobile ? '100%' : 'none' }}>{location.name || 'New Location'}</h3>
              {isLocationComplete && !isExpanded && <AnimatedCheck size={20} color={colors.green} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 8px', borderRadius: '5px', background: 'rgba(0, 118, 187, 0.1)', color: colors.blue, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{typeInfo.label}</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{location.assets.length} {location.assets.length === 1 ? 'space' : 'spaces'}</span>
              {!isExpanded && !isLocationComplete && (
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 500 }}>• Incomplete</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px', flexShrink: 0 }}>
          {!isMobile && (
            <button 
              onClick={(e) => { e.stopPropagation(); handlers.duplicateLocation(location.id); }} 
              title="Duplicate this entire location" 
              style={{ 
                padding: '8px 12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(0, 118, 187, 0.2)', 
                background: 'white', 
                color: colors.blue, 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
          )}
          {!isMobile && canRemove && (
            <button 
              onClick={(e) => { e.stopPropagation(); handlers.removeLocation(location.id); }} 
              style={{ 
                padding: '8px', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'rgba(239, 68, 68, 0.08)', 
                color: '#ef4444', 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            marginLeft: isMobile ? '4px' : '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: isExpanded ? 'rgba(0, 118, 187, 0.1)' : 'rgba(0, 118, 187, 0.04)',
            border: `1px solid ${isExpanded ? colors.blue : 'rgba(0, 118, 187, 0.15)'}`,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isExpanded ? colors.blue : '#64748b' }}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            <ChevronRight size={18} color={isExpanded ? colors.blue : '#64748b'} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
          </div>
        </div>
      </div>
      
      {/* Collapsed state prompt - shows when collapsed and not yet configured */}
      {!isExpanded && !hasBeenExpanded && isFirstLocation && (
        <div 
          onClick={handleToggle}
          style={{ 
            padding: '16px 24px', 
            background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.08) 0%, rgba(0, 168, 79, 0.08) 100%)', 
            borderTop: '1px dashed rgba(0, 118, 187, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0, 118, 187, 0.15)' }}>
            <ChevronDown size={20} color={colors.blue} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.blue }}>Click to expand and configure this location</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Add location details, rentable spaces, pricing, and availability</p>
          </div>
        </div>
      )}
      
      {isExpanded && (
        <div className="animate-fade-in" style={{ padding: isMobile ? '16px' : '24px' }}>
          {isMobile && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => handlers.duplicateLocation(location.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Copy size={16} />Copy Location</button>
              {canRemove && <button onClick={() => handlers.removeLocation(location.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'white', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={16} />Remove</button>}
            </div>
          )}
          <CardSection isMobile={isMobile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><MapPin size={18} color={colors.blue} /><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Location Details</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <FormGroup label="Location Name" required error={locationErrors.name} tooltip="A friendly name for this location that helps you identify it, like 'Main Campus' or 'Downtown Center'.">
                <input type="text" value={location.name} onChange={(e) => handlers.updateLocation(location.id, 'name', e.target.value)} style={locationErrors.name ? inputErrorStyle : inputStyle} placeholder="e.g., Main Building, North Campus" />
              </FormGroup>
              <FormGroup label="Address" required error={locationErrors.address} tooltip="The full street address. This helps renters find the location.">
                <input type="text" value={location.address} onChange={(e) => handlers.updateLocation(location.id, 'address', e.target.value)} style={locationErrors.address ? inputErrorStyle : inputStyle} placeholder="123 Main St, City, State ZIP" />
              </FormGroup>
            </div>
            
            {/* Location Photos */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0, 118, 187, 0.08)' }}>
              <PhotoUpload
                photos={location.photos || []}
                onAdd={(photo) => {
                  const newPhotos = [...(location.photos || []), photo];
                  handlers.updateLocation(location.id, 'photos', newPhotos);
                }}
                onRemove={(photoId) => {
                  const newPhotos = (location.photos || []).filter((p, i) => (p.id || i) !== photoId);
                  handlers.updateLocation(location.id, 'photos', newPhotos);
                }}
                maxPhotos={5}
                isMobile={isMobile}
              />
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                Add photos of the building exterior, parking, or general facility. These help renters know they're in the right place.
              </p>
            </div>
            
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0, 118, 187, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <User size={18} color={colors.blue} />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Who manages rentals at this location?</h4>
              </div>
              
              {contactMode === null && !hasContactInfo ? (
                <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                  <button onClick={fillWithMyInfo} style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: `2px solid ${colors.blue}`, background: 'rgba(0, 118, 187, 0.04)', color: colors.blue, fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <User size={20} />
                    I manage this location
                  </button>
                  <button onClick={() => setContactMode('other')} style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: '#64748b', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Plus size={20} />
                    Someone else manages it
                  </button>
                </div>
              ) : contactMode === 'self' ? (
                <div style={{ padding: '16px 20px', background: 'rgba(0, 168, 79, 0.06)', borderRadius: '12px', border: '1px solid rgba(0, 168, 79, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 168, 79, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={20} color={colors.green} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{contactInfo.fullName || 'You'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>{contactInfo.email || 'Your email'}</p>
                      </div>
                    </div>
                    <button onClick={resetContactMode} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.06)', color: '#64748b', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Change</button>
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: '12px', color: colors.greenDark }}>You'll be the default final approver for bookings at this location.</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Enter the contact person's details</span>
                    <button onClick={resetContactMode} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.06)', color: '#64748b', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <FormGroup label="Full Name" required error={locationErrors.contactName}>
                      <input type="text" value={location.contactName || ''} onChange={(e) => handleContactChange('contactName', e.target.value)} style={locationErrors.contactName ? inputErrorStyle : inputStyle} placeholder="e.g., John Smith" />
                    </FormGroup>
                    <FormGroup label="Email" required error={locationErrors.contactEmail}>
                      <input type="email" value={location.contactEmail} onChange={(e) => handleContactChange('contactEmail', e.target.value)} style={locationErrors.contactEmail ? inputErrorStyle : inputStyle} placeholder="contact@example.org" autoCapitalize="none" />
                    </FormGroup>
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' }}>This person will be the default final approver for bookings at this location.</p>
                  <button onClick={fillWithMyInfo} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0, 118, 187, 0.06)', color: colors.blue, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Use my info instead
                  </button>
                </>
              )}
            </div>
          </CardSection>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={18} color={colors.blue} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                  Rentable Spaces{location.name ? ` at ${location.name}` : ''}
                </h3>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: `rgba(0, 118, 187, 0.1)`, color: colors.blue, fontSize: '12px', fontWeight: 600 }}>{location.assets.length}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowBulkAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Layers size={16} />Bulk Add</button>
                <button onClick={() => handlers.addAsset(location.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: `1px solid rgba(0, 168, 79, 0.3)`, background: `rgba(0, 168, 79, 0.08)`, color: colors.green, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus size={16} />Add Space</button>
              </div>
            </div>
            
            {/* Copy settings from another location */}
            {otherLocations.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Copy approvers, hours & add-ons from another location?</span>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowCopyMenu(!showCopyMenu)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(0, 118, 187, 0.1)', color: colors.blue, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Copy size={14} />Copy from...
                    </button>
                    {showCopyMenu && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)', zIndex: 100, minWidth: '180px', overflow: 'hidden' }}>
                        {otherLocations.map(loc => (
                          <button 
                            key={loc.id}
                            onClick={() => { handlers.copySettingsFrom(location.id, loc.id); setShowCopyMenu(false); }}
                            style={{ display: 'block', width: '100%', padding: '10px 14px', border: 'none', background: 'white', textAlign: 'left', fontSize: '13px', color: '#1e293b', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            {loc.name || 'Unnamed Location'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Add Modal */}
            {showBulkAdd && (
              <div style={{ marginBottom: '16px', padding: '20px', background: 'white', borderRadius: '12px', border: `2px solid ${colors.blue}`, boxShadow: '0 4px 20px rgba(0, 118, 187, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Add Multiple Spaces</h4>
                  <button onClick={() => setShowBulkAdd(false)} style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748b' }}>Enter one space name per line (e.g., "Gym A", "Gym B", "Gym C")</p>
                <textarea 
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder={"Main Gymnasium\nAuxiliary Gym\nWeight Room\nConference Room A"}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>Set same price for all:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>$</span>
                    <input 
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      style={{ ...inputStyle, width: '100px' }}
                      placeholder="0"
                      inputMode="decimal"
                    />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>/hour</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowBulkAdd(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleBulkAdd} disabled={!bulkNames.trim()} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: bulkNames.trim() ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : '#e2e8f0', color: bulkNames.trim() ? 'white' : '#94a3b8', fontSize: '13px', fontWeight: 600, cursor: bulkNames.trim() ? 'pointer' : 'default' }}>Add {bulkNames.split('\n').filter(n => n.trim()).length || 0} Spaces</button>
                </div>
              </div>
            )}
            
            {location.assets.map((asset, assetIndex) => (
              <AssetCard key={assetIndex} asset={asset} assetIndex={assetIndex} locationId={location.id} isExpanded={expandedAsset === assetIndex} onToggle={() => setExpandedAsset(expandedAsset === assetIndex ? -1 : assetIndex)} updateAsset={handlers.updateAsset} updateApprover={handlers.updateApprover} addApprover={handlers.addApprover} removeApprover={handlers.removeApprover} moveApprover={handlers.moveApprover} updateNotification={handlers.updateNotification} addNotification={handlers.addNotification} removeNotification={handlers.removeNotification} updateAmenity={handlers.updateAmenity} addAmenity={handlers.addAmenity} removeAmenity={handlers.removeAmenity} removeAsset={handlers.removeAsset} duplicateAsset={handlers.duplicateAsset} canRemove={location.assets.length > 1} isMobile={isMobile} errors={locationErrors.assets?.[assetIndex]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationsStep({ locations, setLocations, isMobile, errors, contactInfo }) {
  const [showAddModal, setShowAddModal] = useState(locations.length === 0); // Auto-show if no locations

  const handlers = {
    addLocation: (type) => { setLocations(prev => [...prev, createEmptyLocation(type)]); setShowAddModal(false); },
    removeLocation: (id) => setLocations(prev => prev.filter(c => c.id !== id)),
    duplicateLocation: (id) => { const loc = locations.find(c => c.id === id); if (loc) setLocations(prev => [...prev, duplicateLocation(loc)]); },
    updateLocation: (id, field, value) => setLocations(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c)),
    updateAsset: (locationId, assetIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], [field]: value }; return { ...c, assets: newAssets }; }));
    },
    updateApprover: (locationId, assetIndex, approverIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; const newApprovers = [...newAssets[assetIndex].approvers]; newApprovers[approverIndex] = { ...newApprovers[approverIndex], [field]: value }; newAssets[assetIndex] = { ...newAssets[assetIndex], approvers: newApprovers }; return { ...c, assets: newAssets }; }));
    },
    addApprover: (locationId, assetIndex) => {
      setLocations(prev => prev.map(c => { 
        if (c.id !== locationId) return c; 
        const newAssets = [...c.assets]; 
        if (newAssets[assetIndex].approvers.length < 4) {
          // Insert new approver at the beginning (before current final approver)
          const newApprovers = [{ ...emptyApprover }, ...newAssets[assetIndex].approvers];
          newAssets[assetIndex] = { ...newAssets[assetIndex], approvers: newApprovers }; 
        }
        return { ...c, assets: newAssets }; 
      }));
    },
    removeApprover: (locationId, assetIndex, approverIndex) => {
      setLocations(prev => prev.map(c => { 
        if (c.id !== locationId) return c; 
        const newAssets = [...c.assets]; 
        if (newAssets[assetIndex].approvers.length > 1) {
          newAssets[assetIndex] = { ...newAssets[assetIndex], approvers: newAssets[assetIndex].approvers.filter((_, i) => i !== approverIndex) }; 
        }
        return { ...c, assets: newAssets }; 
      }));
    },
    moveApprover: (locationId, assetIndex, approverIndex, direction) => {
      setLocations(prev => prev.map(c => { 
        if (c.id !== locationId) return c; 
        const newAssets = [...c.assets]; 
        const approvers = [...newAssets[assetIndex].approvers];
        const newIndex = approverIndex + direction;
        if (newIndex >= 0 && newIndex < approvers.length) {
          [approvers[approverIndex], approvers[newIndex]] = [approvers[newIndex], approvers[approverIndex]];
          newAssets[assetIndex] = { ...newAssets[assetIndex], approvers }; 
        }
        return { ...c, assets: newAssets }; 
      }));
    },
    setLocationApprover: (locationId, name, email) => {
      // Set the location manager as the final approver for all assets at this location
      setLocations(prev => prev.map(c => {
        if (c.id !== locationId) return c;
        const newAssets = c.assets.map(asset => {
          // Update the final approver (last in the array) with the location manager's info
          const newApprovers = [...asset.approvers];
          const lastIndex = newApprovers.length - 1;
          newApprovers[lastIndex] = { ...newApprovers[lastIndex], name, email };
          return { ...asset, approvers: newApprovers };
        });
        return { ...c, assets: newAssets };
      }));
    },
    clearLocationApprovers: (locationId) => {
      // Reset approvers to empty for all assets at this location
      setLocations(prev => prev.map(c => {
        if (c.id !== locationId) return c;
        const newAssets = c.assets.map(asset => ({
          ...asset,
          approvers: [{ ...emptyApprover }]
        }));
        return { ...c, assets: newAssets };
      }));
    },
    updateNotification: (locationId, assetIndex, notifIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; const newNotifs = [...newAssets[assetIndex].notifications]; newNotifs[notifIndex] = { ...newNotifs[notifIndex], [field]: value }; newAssets[assetIndex] = { ...newAssets[assetIndex], notifications: newNotifs }; return { ...c, assets: newAssets }; }));
    },
    addNotification: (locationId, assetIndex) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], notifications: [...newAssets[assetIndex].notifications, { ...emptyNotification }] }; return { ...c, assets: newAssets }; }));
    },
    removeNotification: (locationId, assetIndex, notifIndex) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], notifications: newAssets[assetIndex].notifications.filter((_, i) => i !== notifIndex) }; return { ...c, assets: newAssets }; }));
    },
    updateAmenity: (locationId, assetIndex, amenityIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; const newAmenities = [...newAssets[assetIndex].amenities]; newAmenities[amenityIndex] = { ...newAmenities[amenityIndex], [field]: value }; newAssets[assetIndex] = { ...newAssets[assetIndex], amenities: newAmenities }; return { ...c, assets: newAssets }; }));
    },
    addAmenity: (locationId, assetIndex) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], amenities: [...newAssets[assetIndex].amenities, { ...emptyAmenity }] }; return { ...c, assets: newAssets }; }));
    },
    removeAmenity: (locationId, assetIndex, amenityIndex) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], amenities: newAssets[assetIndex].amenities.filter((_, i) => i !== amenityIndex) }; return { ...c, assets: newAssets }; }));
    },
    addAsset: (locationId) => {
      setLocations(prev => prev.map(c => {
        if (c.id !== locationId) return c;
        const newAsset = createEmptyAsset('', c.type);
        // If location has a contact, set them as the default approver
        if (c.contactName && c.contactEmail) {
          newAsset.approvers = [{ name: c.contactName, email: c.contactEmail }];
        }
        return { ...c, assets: [...c.assets, newAsset] };
      }));
    },
    addAssetWithData: (locationId, assetData) => {
      setLocations(prev => prev.map(c => {
        if (c.id !== locationId) return c;
        // If location has a contact, set them as the default approver
        if (c.contactName && c.contactEmail) {
          assetData.approvers = [{ name: c.contactName, email: c.contactEmail }];
        }
        return { ...c, assets: [...c.assets, assetData] };
      }));
    },
    copySettingsFrom: (targetLocationId, sourceLocationId) => {
      setLocations(prev => {
        const source = prev.find(l => l.id === sourceLocationId);
        if (!source) return prev;
        return prev.map(loc => {
          if (loc.id !== targetLocationId) return loc;
          // Copy approvers, notifications, and amenities from first asset
          const sourceAsset = source.assets[0];
          const newAssets = loc.assets.map(asset => ({
            ...asset,
            approvers: JSON.parse(JSON.stringify(sourceAsset.approvers)),
            notifications: JSON.parse(JSON.stringify(sourceAsset.notifications)),
            amenities: JSON.parse(JSON.stringify(sourceAsset.amenities)),
            weekdayAvailability: { ...sourceAsset.weekdayAvailability },
            weekendAvailability: { ...sourceAsset.weekendAvailability },
          }));
          return { ...loc, assets: newAssets };
        });
      });
    },
    removeAsset: (locationId, assetIndex) => {
      setLocations(prev => prev.map(c => c.id === locationId ? { ...c, assets: c.assets.filter((_, i) => i !== assetIndex) } : c));
    },
    duplicateAsset: (locationId, assetIndex) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAsset = duplicateAsset(c.assets[assetIndex]); return { ...c, assets: [...c.assets.slice(0, assetIndex + 1), newAsset, ...c.assets.slice(assetIndex + 1)] }; }));
    },
  };

  return (
    <div>
      <SectionTitle icon={Building2} title="Add Your Locations" subtitle="Tell us about each location and the spaces available for rent." isMobile={isMobile} />
      
      {/* First-time guidance */}
      {locations.length === 1 && !locations[0].name && (
        <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.06) 0%, rgba(0, 168, 79, 0.06) 100%)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.15)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0, 118, 187, 0.1)' }}>
            <Sparkles size={18} color={colors.blue} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>How this works</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
              We've created your first location below. Click to expand it and add your details - location name, address, and the spaces you want to rent out (gyms, fields, rooms, etc.). Once you've set one up, you can easily duplicate it for other locations.
            </p>
          </div>
        </div>
      )}
      
      {locations.length === 0 ? (
        /* Empty state - prompt to add first location */
        <div style={{ textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 40px', background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.04) 0%, rgba(0, 168, 79, 0.04) 100%)', borderRadius: '16px', border: '2px dashed rgba(0, 118, 187, 0.2)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Building2 size={32} color={colors.blue} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Let's add your first location</h3>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            A location is a building or property with rentable spaces - like a school, rec center, or community building.
          </p>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 118, 187, 0.25)' }}>
            <Plus size={20} />
            Add Your First Location
          </button>
        </div>
      ) : (
        /* Locations exist - show summary bar */
        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: isMobile ? '16px' : '24px', padding: isMobile ? '16px' : '20px 24px', background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.04) 0%, rgba(0, 168, 79, 0.04) 100%)', borderRadius: '14px', border: '1px solid rgba(0, 118, 187, 0.1)', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '0' }}>
          <div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{locations.length} {locations.length === 1 ? 'Location' : 'Locations'} • {locations.reduce((sum, c) => sum + c.assets.length, 0)} Spaces</p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Set up one location fully, then duplicate it!</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 118, 187, 0.25)' }}><Plus size={18} />Add Location</button>
        </div>
      )}
      
      {showAddModal && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 1000, padding: isMobile ? 0 : '20px' }} onClick={() => setShowAddModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className={isMobile ? 'animate-fade-in-up' : 'animate-scale-in'} style={{ 
            background: 'white', 
            borderRadius: isMobile ? '20px 20px 0 0' : '20px', 
            padding: isMobile ? '20px 20px 32px' : '32px', 
            width: isMobile ? '100%' : '520px',
            maxHeight: isMobile ? '85vh' : '90vh', 
            overflow: 'auto',
            boxShadow: isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {isMobile && (
              <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? '20px' : '22px', fontWeight: 700, color: '#0f172a' }}>What type of location?</h3>
              <button onClick={() => setShowAddModal(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}><X size={20} color="#64748b" /></button>
            </div>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>Select the option that best describes this location.</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
              {locationTypes.map((type, i) => {
                const TypeIcon = type.icon;
                return (
                  <button key={type.value} onClick={() => handlers.addLocation(type.value)} className="hover-lift" style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'row' : 'column',
                    alignItems: 'center', 
                    gap: isMobile ? '14px' : '10px', 
                    padding: isMobile ? '14px 16px' : '20px 12px', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0, 118, 187, 0.15)', 
                    background: 'white', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    textAlign: isMobile ? 'left' : 'center', 
                    width: '100%', 
                    animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` 
                  }}>
                    <div style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '12px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TypeIcon size={isMobile ? 20 : 24} color="white" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{type.label}</span>
                  </button>
                );
              })}
            </div>
            {!isMobile && <button onClick={() => setShowAddModal(false)} style={{ marginTop: '24px', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.1)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>}
          </div>
        </div>
      )}
      {locations.map((location, idx) => (
        <LocationCard 
          key={location.id} 
          location={location} 
          handlers={handlers} 
          canRemove={locations.length > 1} 
          isMobile={isMobile} 
          errors={errors?.[idx]} 
          contactInfo={contactInfo} 
          allLocations={locations}
          initiallyCollapsed={idx === 0 && locations.length === 1}
          isFirstLocation={idx === 0}
        />
      ))}
    </div>
  );
}

function ReviewStep({ policies, locations, contactInfo, isMobile }) {
  const ReviewSection = ({ title, children }) => (<div style={{ background: 'rgba(248, 250, 252, 0.6)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.08)', padding: isMobile ? '16px' : '24px', marginBottom: '16px' }}><h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>{children}</div>);
  const ReviewItem = ({ label, value }) => (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0, 118, 187, 0.06)', flexWrap: 'wrap', gap: '8px' }}><span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span><span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500, textAlign: 'right' }}>{value || '—'}</span></div>);
  const typeLabels = { school: 'School', recreation: 'Recreation Center', church: 'Church / Place of Worship', municipal: 'Municipal / Government', private: 'Private Facility', other: 'Other' };
  const spaceTypeLabels = Object.fromEntries(spaceTypes.map(t => [t.value, t.label]));

  return (
    <div>
      <SectionTitle icon={Check} title="You're Almost There!" subtitle="Take a quick look to make sure everything's right." isMobile={isMobile} />
      
      {/* Visual Preview */}
      <div style={{ marginBottom: '24px', padding: '20px', background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.06) 0%, rgba(0, 168, 79, 0.06) 100%)', borderRadius: '16px', border: '1px solid rgba(0, 118, 187, 0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Eye size={18} color={colors.blue} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Preview: How renters will see your spaces</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {locations.slice(0, 3).flatMap(loc => loc.assets.slice(0, 2).map((asset, i) => {
            const spaceType = spaceTypes.find(t => t.value === asset.type);
            return (
              <div key={`${loc.id}-${i}`} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {spaceType ? <SpaceTypeIcon type={spaceType.icon} size={22} color="white" /> : <Building2 size={22} color="white" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{asset.name || 'Unnamed Space'}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{loc.name || 'Location'}</p>
                    {spaceType && <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0, 118, 187, 0.08)', color: colors.blue, fontSize: '11px', fontWeight: 600 }}>{spaceType.label}</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: colors.green }}>${asset.pricing || '0'}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>/hr</span>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
        {locations.reduce((sum, loc) => sum + loc.assets.length, 0) > 6 && (
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            + {locations.reduce((sum, loc) => sum + loc.assets.length, 0) - 6} more spaces
          </p>
        )}
      </div>

      <ReviewSection title="Your Information">
        <ReviewItem label="Name" value={contactInfo.fullName} />
        <ReviewItem label="Title" value={contactInfo.jobTitle} />
        <ReviewItem label="Organization" value={contactInfo.organization} />
        <ReviewItem label="Email" value={contactInfo.email} />
        <ReviewItem label="Phone" value={contactInfo.phone} />
      </ReviewSection>
      <ReviewSection title="Your Policies">
        <ReviewItem label="Cancellation Window" value={
          policies.cancellationDays === 'custom' ? `${policies.customCancellationDays || '?'} days notice` :
          policies.cancellationDays === 'unsure' ? 'To be discussed' :
          `${policies.cancellationDays} days notice`
        } />
        <ReviewItem label="Weather Refunds" value={
          policies.weatherRefund === 'yes' ? 'Yes, refund' :
          policies.weatherRefund === 'credit' ? 'Credit only' :
          policies.weatherRefund === 'unsure' ? 'To be discussed' :
          'No refunds'
        } />
        <ReviewItem label="Insurance Required" value={
          policies.requireInsurance === 'yes' ? 'Yes, required' :
          policies.requireInsurance === 'sometimes' ? 'Case by case' :
          policies.requireInsurance === 'unsure' ? 'To be discussed' :
          'Not required'
        } />
        <ReviewItem label="Time Slots" value={
          policies.timeIncrement === 'custom' ? `${policies.customTimeIncrement || '?'} minutes` :
          policies.timeIncrement === 'unsure' ? 'To be discussed' :
          policies.timeIncrement === '30' ? '30 minutes' :
          policies.timeIncrement === '60' ? '1 hour' :
          policies.timeIncrement === '90' ? '90 minutes' :
          policies.timeIncrement === '120' ? '2 hours' :
          `${policies.timeIncrement} minutes`
        } />
        {(policies.waiverFile || policies.waiverText) && (
          <ReviewItem label="Waiver" value={policies.waiverFile?.name || 'Text provided'} />
        )}
        {(policies.facilityAgreementFile || policies.facilityAgreement) && (
          <ReviewItem label="Rental Policy" value={policies.facilityAgreementFile?.name || 'Text provided'} />
        )}
      </ReviewSection>
      {locations.map((location, idx) => (
        <ReviewSection key={location.id} title={`${typeLabels[location.type] || 'Location'}: ${location.name || `Location ${idx + 1}`}`}>
          <ReviewItem label="Address" value={location.address} />
          <ReviewItem label="Contact" value={location.contactName} />
          <ReviewItem label="Contact Email" value={location.contactEmail} />
          <div style={{ marginTop: '12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Spaces ({location.assets.length})</p>
            {location.assets.map((asset, i) => {
              const spaceType = spaceTypes.find(t => t.value === asset.type);
              const selectedAddons = asset.amenities.filter(a => a.name && a.price);
              return (
                <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '12px', marginBottom: '8px', border: '1px solid rgba(0, 118, 187, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>{asset.name || `Space ${i + 1}`}</span>
                      {spaceType && <span style={{ marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 118, 187, 0.08)', color: colors.blue, fontSize: '10px', fontWeight: 600 }}>{spaceType.label}</span>}
                    </div>
                    <span style={{ color: colors.green, fontSize: '13px', fontWeight: 600 }}>{asset.pricing ? `$${asset.pricing}/hr` : 'No price'}</span>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(0,0,0,0.08)' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Add-ons: </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{selectedAddons.map(a => `${a.name} (+$${a.price})`).join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ReviewSection>
      ))}
      <div style={{ marginTop: '24px', padding: isMobile ? '20px' : '28px', borderRadius: '16px', background: `linear-gradient(135deg, rgba(0, 168, 79, 0.1) 0%, rgba(0, 168, 79, 0.05) 100%)`, border: `1px solid rgba(0, 168, 79, 0.25)`, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '24px', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `rgba(0, 168, 79, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><PartyPopper size={26} color={colors.green} /></div>
        <div>
          <h4 style={{ margin: 0, color: colors.greenDark, fontSize: '17px', fontWeight: 700 }}>Looking good! Ready to submit?</h4>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>Our team will review your info and get your facilities set up shortly.</p>
        </div>
      </div>
    </div>
  );
}

export default function PracticePlanOnboarding() {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({ fullName: '', jobTitle: '', organization: '', email: '', phone: '' });
  const [policies, setPolicies] = useState({ cancellationDays: '7', weatherRefund: 'yes', requireInsurance: 'yes', waiverText: '', facilityAgreement: '', timeIncrement: '60' });
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Auto-save to localStorage
  useEffect(() => {
    if (currentStep === 0) return; // Don't save on welcome screen
    
    const saveData = () => {
      setIsSaving(true);
      const data = { contactInfo, policies, locations, currentStep };
      try {
        localStorage.setItem('practiceplan_draft', JSON.stringify(data));
        setLastSaved(new Date());
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
      setTimeout(() => setIsSaving(false), 500);
    };
    
    const timer = setTimeout(saveData, 1000); // Debounce saves
    return () => clearTimeout(timer);
  }, [contactInfo, policies, locations, currentStep]);
  
  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('practiceplan_draft');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.policies) setPolicies(data.policies);
        if (data.locations) setLocations(data.locations);
        if (data.currentStep) setCurrentStep(data.currentStep);
        setLastSaved(new Date());
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);
  
  const updateContactInfo = (field, value) => { setContactInfo(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, contact: { ...prev.contact, [field]: undefined } })); };
  const updatePolicies = (field, value) => setPolicies(prev => ({ ...prev, [field]: value }));
  
  const steps = [{ id: 'welcome', title: 'Welcome', icon: Sparkles }, { id: 'contact', title: 'Your Info', icon: User }, { id: 'policies', title: 'Policies', icon: FileText }, { id: 'locations', title: 'Locations', icon: Building2 }, { id: 'review', title: 'Review', icon: Check }];

  // Validation functions
  const validateContactInfo = () => {
    const errs = {};
    if (!contactInfo.fullName.trim()) errs.fullName = 'Please enter your name';
    if (!contactInfo.jobTitle.trim()) errs.jobTitle = 'Please enter your job title';
    if (!contactInfo.organization.trim()) errs.organization = 'Please enter your organization';
    if (!contactInfo.email.trim()) errs.email = 'Please enter your email';
    else if (!isValidEmail(contactInfo.email)) errs.email = 'Please enter a valid email address';
    if (!contactInfo.phone.trim()) errs.phone = 'Please enter your phone number';
    else if (!isValidPhone(contactInfo.phone)) errs.phone = 'Please enter a valid phone number';
    return errs;
  };

  const validateLocations = () => {
    const locationErrors = [];
    locations.forEach((loc, locIdx) => {
      const locErr = {};
      if (!loc.name.trim()) locErr.name = 'Please enter a location name';
      if (!loc.address.trim()) locErr.address = 'Please enter an address';
      if (!loc.contactName || !loc.contactName.trim()) locErr.contactName = 'Required';
      if (!loc.contactEmail || !loc.contactEmail.trim()) locErr.contactEmail = 'Required';
      else if (!isValidEmail(loc.contactEmail)) locErr.contactEmail = 'Invalid email';
      
      const assetErrors = [];
      loc.assets.forEach((asset, assetIdx) => {
        const assetErr = {};
        if (!asset.name.trim()) assetErr.name = 'Please enter a space name';
        if (!asset.pricing) assetErr.pricing = 'Please enter a rate';
        if (Object.keys(assetErr).length > 0) assetErrors[assetIdx] = assetErr;
      });
      if (Object.keys(assetErrors).length > 0) locErr.assets = assetErrors;
      
      if (Object.keys(locErr).length > 0) locationErrors[locIdx] = locErr;
    });
    return locationErrors;
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      const contactErrors = validateContactInfo();
      if (Object.keys(contactErrors).length > 0) {
        setErrors(prev => ({ ...prev, contact: contactErrors }));
        return;
      }
    }
    if (currentStep === 3) {
      const locationErrors = validateLocations();
      if (Object.keys(locationErrors).length > 0) {
        setErrors(prev => ({ ...prev, locations: locationErrors }));
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => { setCurrentStep(prev => Math.max(prev - 1, 0)); window.scrollTo(0, 0); };

  const submitToGoogleForm = async () => {
    setIsSubmitting(true);
    const fullData = { contactInfo, policies, locations, submittedAt: new Date().toISOString() };
    const formData = new URLSearchParams();
    formData.append(GOOGLE_FORM_FIELDS.fullName, contactInfo.fullName);
    formData.append(GOOGLE_FORM_FIELDS.jobTitle, contactInfo.jobTitle);
    formData.append(GOOGLE_FORM_FIELDS.organization, contactInfo.organization);
    formData.append(GOOGLE_FORM_FIELDS.email, contactInfo.email);
    formData.append(GOOGLE_FORM_FIELDS.phone, contactInfo.phone);
    formData.append(GOOGLE_FORM_FIELDS.cancellationDays, policies.cancellationDays);
    formData.append(GOOGLE_FORM_FIELDS.weatherRefund, policies.weatherRefund);
    formData.append(GOOGLE_FORM_FIELDS.requireInsurance, policies.requireInsurance);
    formData.append(GOOGLE_FORM_FIELDS.timeIncrement, policies.timeIncrement);
    formData.append(GOOGLE_FORM_FIELDS.waiverText, policies.waiverText || '(none)');
    formData.append(GOOGLE_FORM_FIELDS.facilityAgreement, policies.facilityAgreement || '(none)');
    formData.append(GOOGLE_FORM_FIELDS.allData, JSON.stringify(fullData, null, 2));
    try {
      await fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
      localStorage.removeItem('practiceplan_draft'); // Clear saved draft
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue submitting. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8fafb 0%, #eef3f6 50%, #e8f0f4 100%)', fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif', color: '#1e293b', position: 'relative' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input, select, textarea, button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: ${colors.blue} !important; box-shadow: 0 0 0 3px rgba(0, 118, 187, 0.1) !important; }
        
        /* Smooth animations */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
        @keyframes successPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes checkmark { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
        @keyframes greenFlash { 0% { background-color: rgba(0, 168, 79, 0.15); } 100% { background-color: transparent; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-slide-down { animation: slideDown 0.4s ease-out; overflow: hidden; }
        .animate-success-pulse { animation: successPulse 0.4s ease-out; }
        .animate-green-flash { animation: greenFlash 0.8s ease-out; }
        
        /* Hover effects */
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
        
        /* Button press effect */
        button:active { transform: scale(0.98); }
        
        /* Card expansion */
        .card-content { transition: all 0.3s ease-out; }
        
        /* Input transitions */
        input, select, textarea { transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; }
      `}</style>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 20% 20%, rgba(0, 118, 187, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 168, 79, 0.03) 0%, transparent 50%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ padding: isMobile ? '16px 20px' : '24px 48px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 118, 187, 0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: isMobile ? '60px' : '100px' }} /> {/* Spacer for centering */}
            <PracticePlanLogo width={isMobile ? 180 : 240} />
            <div style={{ width: isMobile ? '60px' : '100px', display: 'flex', justifyContent: 'flex-end' }}>
              {currentStep > 0 && !submitSuccess && lastSaved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: isSaving ? 'rgba(0, 118, 187, 0.08)' : 'rgba(0, 168, 79, 0.08)', transition: 'all 0.3s' }}>
                  {isSaving ? (
                    <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0, 118, 187, 0.3)', borderTopColor: colors.blue, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Check size={12} color={colors.green} />
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 500, color: isSaving ? colors.blue : colors.green }}>{isSaving ? 'Saving...' : 'Draft saved'}</span>
                </div>
              )}
            </div>
          </div>
        </header>
        {currentStep > 0 && isMobile && <MobileProgressBar currentStep={currentStep} totalSteps={steps.length - 1} />}
        {currentStep > 0 && !isMobile && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {steps.slice(1).map((step, index) => {
                const actualIndex = index + 1;
                const Icon = step.icon; const isActive = actualIndex === currentStep; const isComplete = actualIndex < currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <button onClick={() => { if (isComplete) setCurrentStep(actualIndex); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '100px', border: 'none', cursor: isComplete ? 'pointer' : 'default', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: isActive ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : isComplete ? 'rgba(0, 168, 79, 0.1)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isActive ? '0 8px 32px rgba(0, 118, 187, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : isComplete ? 'rgba(0, 168, 79, 0.15)' : 'rgba(0, 118, 187, 0.08)' }}>{isComplete ? <Check size={16} color={colors.green} /> : <Icon size={16} color={isActive ? '#fff' : colors.blue} />}</div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#fff' : isComplete ? colors.green : '#64748b' }}>{step.title}</span>
                    </button>
                    {index < steps.length - 2 && <div style={{ width: '32px', height: '3px', background: actualIndex < currentStep ? colors.green : 'rgba(0, 118, 187, 0.1)', borderRadius: '3px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? (currentStep === 0 ? '24px 16px 100px' : '16px 16px 100px') : (currentStep === 0 ? '60px 48px 100px' : '0 48px 100px') }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(40px)', borderRadius: isMobile ? '20px' : '24px', border: '1px solid rgba(0, 118, 187, 0.08)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 12px 48px rgba(0, 118, 187, 0.06)', overflow: 'hidden' }}>
            <div key={currentStep} className="animate-fade-in-up" style={{ padding: isMobile ? (currentStep === 0 ? '32px 20px' : '24px 20px') : (currentStep === 0 ? '60px 48px' : '48px') }}>
              {currentStep === 0 && <WelcomeStep onContinue={nextStep} isMobile={isMobile} />}
              {currentStep === 1 && <ContactInfoStep data={contactInfo} update={updateContactInfo} errors={errors.contact || {}} isMobile={isMobile} />}
              {currentStep === 2 && <PoliciesStep data={policies} update={updatePolicies} isMobile={isMobile} />}
              {currentStep === 3 && <LocationsStep locations={locations} setLocations={setLocations} isMobile={isMobile} errors={errors.locations} contactInfo={contactInfo} />}
              {currentStep === 4 && !submitSuccess && <ReviewStep policies={policies} locations={locations} contactInfo={contactInfo} isMobile={isMobile} />}
              {currentStep === 4 && submitSuccess && (
                <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: isMobile ? '20px 0' : '40px 0' }}>
                  <div className="animate-success-pulse" style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(0, 168, 79, 0.3)' }}>
                    <AnimatedCheck size={isMobile ? 32 : 40} color="white" />
                  </div>
                  <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>You're All Set!</h2>
                  <p style={{ fontSize: isMobile ? '15px' : '17px', color: '#64748b', margin: '0 0 12px', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                    Thanks for submitting your facility information. Our team will review everything and reach out soon to finalize your setup.
                  </p>
                  <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>
                    Questions? Email us at <a href="mailto:support@practiceplan.com" style={{ color: colors.blue, textDecoration: 'none', fontWeight: 600 }}>support@practiceplan.com</a>
                  </p>
                </div>
              )}
            </div>
            {currentStep > 0 && !submitSuccess && (
              <div style={{ padding: isMobile ? '16px 20px' : '24px 48px', borderTop: '1px solid rgba(0, 118, 187, 0.08)', background: 'rgba(248, 250, 252, 0.8)' }}>
                {/* Skip option for Contact Info step */}
                {currentStep === 1 && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <button 
                      onClick={() => { setCurrentStep(2); window.scrollTo(0, 0); }}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px dashed rgba(0, 118, 187, 0.3)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <ChevronRight size={16} />
                      Skip for now - I'll add my info later
                    </button>
                  </div>
                )}
                {/* Skip option for Policies step */}
                {currentStep === 2 && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <button 
                      onClick={() => { setCurrentStep(3); window.scrollTo(0, 0); }}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px dashed rgba(0, 118, 187, 0.3)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <ChevronRight size={16} />
                      Skip policies for now - use defaults
                    </button>
                  </div>
                )}
                {/* Skip option for Locations step */}
                {currentStep === 3 && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <button 
                      onClick={() => { setCurrentStep(4); window.scrollTo(0, 0); }}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px dashed rgba(0, 118, 187, 0.3)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <ChevronRight size={16} />
                      Skip for now - I'll add locations later
                    </button>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 16px' : '14px 24px', borderRadius: '12px', border: `1px solid rgba(0, 118, 187, 0.2)`, background: 'white', color: colors.blue, fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}><ChevronLeft size={18} />{isMobile ? '' : 'Previous'}</button>
                  <button onClick={currentStep === steps.length - 1 ? submitToGoogleForm : nextStep} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '12px', border: 'none', background: currentStep === steps.length - 1 ? `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenLight} 100%)` : `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueLight} 100%)`, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: currentStep === steps.length - 1 ? '0 8px 24px rgba(0, 168, 79, 0.3)' : '0 8px 24px rgba(0, 118, 187, 0.3)', transition: 'all 0.2s', flex: isMobile ? 1 : 'none' }}>{currentStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Continue'}{currentStep !== steps.length - 1 && <ChevronRight size={18} />}</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
