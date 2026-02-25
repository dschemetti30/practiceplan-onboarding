import React, { useState, useRef } from 'react';
import { Check, ChevronRight, ChevronLeft, Building2, FileText, Shield, Clock, Users, DollarSign, Plus, Trash2, MapPin, Mail, User, Upload, X, School, Copy, Sparkles, PartyPopper } from 'lucide-react';

const emptyApprover = { name: '', email: '' };
const emptyNotification = { name: '', email: '' };
const emptyAmenity = { name: '', price: '' };

const createEmptyAsset = () => ({
  name: '',
  weekdayAvailability: { start: '15:00', end: '22:00' },
  weekendAvailability: { start: '08:00', end: '22:00' },
  approvers: [{ ...emptyApprover }, { ...emptyApprover }, { ...emptyApprover }, { ...emptyApprover }],
  notifications: [{ ...emptyNotification }],
  pricing: '',
  amenities: [{ ...emptyAmenity }],
});

const duplicateAsset = (asset) => ({
  ...JSON.parse(JSON.stringify(asset)),
  name: asset.name ? `${asset.name} (Copy)` : '',
});

const createEmptyLocation = (type, name = '') => ({
  id: Date.now() + Math.random(),
  type,
  name: name,
  address: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  assets: [createEmptyAsset()],
});

const duplicateLocation = (location) => ({
  ...JSON.parse(JSON.stringify(location)),
  id: Date.now() + Math.random(),
  name: location.name ? `${location.name} (Copy)` : '',
});

const locationTypes = [
  { value: 'school', label: 'School', icon: School },
  { value: 'recreation', label: 'Recreation Center', icon: Building2 },
  { value: 'church', label: 'Church / Place of Worship', icon: Building2 },
  { value: 'municipal', label: 'Municipal / Government', icon: Building2 },
  { value: 'private', label: 'Private Facility', icon: Building2 },
  { value: 'other', label: 'Other', icon: Building2 },
];

const colors = {
  blue: '#0076bb',
  blueLight: '#0088d4',
  blueDark: '#005a8f',
  green: '#00a84f',
  greenLight: '#00c45c',
  greenDark: '#008a40',
};

const PracticePlanLogo = ({ width = 220 }) => (
  <svg viewBox="0 0 396.37 66.7" width={width} style={{ display: 'block' }}>
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
  background: 'white', color: '#1e293b', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%230076bb' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '40px',
};

const textareaStyle = { ...inputStyle, minHeight: '120px', resize: 'vertical' };

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
      {Icon && (
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, rgba(0, 118, 187, 0.1) 0%, rgba(0, 168, 79, 0.1) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={colors.blue} />
        </div>
      )}
      <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>{title}</h2>
    </div>
    {subtitle && <p style={{ margin: 0, color: '#64748b', fontSize: '15px', paddingLeft: Icon ? '58px' : '0' }}>{subtitle}</p>}
  </div>
);

const FormGroup = ({ label, hint, children, required }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
    </label>
    {hint && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b' }}>{hint}</p>}
    {children}
  </div>
);

const CardSection = ({ children, style = {} }) => (
  <div style={{ background: 'rgba(248, 250, 252, 0.6)', borderRadius: '16px', border: '1px solid rgba(0, 118, 187, 0.08)', padding: '24px', marginBottom: '24px', ...style }}>{children}</div>
);

const DocumentInput = ({ mode, setMode, text, onTextChange, file, onFileChange, onFileRemove, label }) => {
  const inputRef = useRef(null);
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setMode('text')} style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: mode === 'text' ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', background: mode === 'text' ? 'rgba(0, 118, 187, 0.08)' : 'white', color: mode === 'text' ? colors.blue : '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FileText size={18} />Type or Paste Text
        </button>
        <button onClick={() => setMode('file')} style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: mode === 'file' ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', background: mode === 'file' ? 'rgba(0, 118, 187, 0.08)' : 'white', color: mode === 'file' ? colors.blue : '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Upload size={18} />Upload Document
        </button>
      </div>
      {mode === 'text' ? (
        <textarea value={text} onChange={(e) => onTextChange(e.target.value)} style={textareaStyle} placeholder={`Paste or type your ${label.toLowerCase()} here...`} />
      ) : (
        <div>
          {!file ? (
            <div onClick={() => inputRef.current?.click()} style={{ border: '2px dashed rgba(0, 118, 187, 0.25)', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(0, 118, 187, 0.02)' }}>
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => onFileChange(e.target.files[0])} style={{ display: 'none' }} />
              <Upload size={36} color={colors.blue} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#334155' }}>Click to upload your document</p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>Supports PDF, DOC, DOCX</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'rgba(0, 168, 79, 0.06)', borderRadius: '12px', border: '1px solid rgba(0, 168, 79, 0.2)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 168, 79, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={22} color={colors.green} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={onFileRemove} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function WelcomeStep({ onContinue }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 12px 40px rgba(0, 118, 187, 0.3)' }}>
        <Sparkles size={40} color="white" />
      </div>
      <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '36px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a', lineHeight: 1.2 }}>
        Welcome to PracticePlan! 🎉
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 40px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
        We're thrilled to have you on board. Let's get your facilities set up so your community can start booking in no time.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', maxWidth: '600px', margin: '0 auto 48px' }}>
        {[
          { icon: '⚡', title: 'Quick Setup', desc: 'Just 5-10 minutes' },
          { icon: '🔄', title: 'Easy Duplicating', desc: 'Copy settings across facilities' },
          { icon: '✨', title: 'We Handle the Rest', desc: 'Our team sets everything up' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '24px 16px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '16px', border: '1px solid rgba(0, 118, 187, 0.08)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.title}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <button onClick={onContinue} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '18px 40px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 30px rgba(0, 118, 187, 0.35)', transition: 'all 0.2s' }}>
        Let's Get Started
        <ChevronRight size={22} />
      </button>
      
      <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '20px' }}>
        This usually takes about 5-10 minutes
      </p>
    </div>
  );
}

function PoliciesStep({ data, update }) {
  const [waiverMode, setWaiverMode] = useState(data.waiverFile ? 'file' : 'text');
  const [policyMode, setPolicyMode] = useState(data.policyFile ? 'file' : 'text');

  return (
    <div>
      <SectionTitle icon={FileText} title="Set Your Ground Rules" subtitle="These policies will apply across all your locations - you can always change them later!" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <CardSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Clock size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Cancellation Policy</h3>
          </div>
          <FormGroup label="Cancellation Window" hint="How much notice do renters need to cancel for a refund?">
            <select value={data.cancellationDays} onChange={(e) => update('cancellationDays', e.target.value)} style={selectStyle}>
              <option value="3">3 days before</option><option value="5">5 days before</option><option value="7">7 days before</option>
              <option value="14">14 days before</option><option value="30">30 days before</option>
            </select>
          </FormGroup>
        </CardSection>
        <CardSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '18px' }}>🌧️</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Weather Policy</h3>
          </div>
          <FormGroup label="Weather Cancellations" hint="If bad weather cancels an event, do renters get their money back?">
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{v: 'yes', l: 'Yes, refund them'}, {v: 'no', l: 'No refunds'}].map(opt => (
                <button key={opt.v} onClick={() => update('weatherRefund', opt.v)} style={{ flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', border: data.weatherRefund === opt.v ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', background: data.weatherRefund === opt.v ? `rgba(0, 118, 187, 0.08)` : 'white', color: data.weatherRefund === opt.v ? colors.blue : '#64748b', fontSize: '14px', fontWeight: 600 }}>{opt.l}</button>
              ))}
            </div>
          </FormGroup>
        </CardSection>
        <CardSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Shield size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Liability Insurance</h3>
          </div>
          <FormGroup label="Require Insurance?" hint="Should renters provide proof of liability insurance?">
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{v: 'yes', l: 'Yes, require it'}, {v: 'no', l: 'Not required'}].map(opt => (
                <button key={opt.v} onClick={() => update('requireInsurance', opt.v)} style={{ flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', border: data.requireInsurance === opt.v ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', background: data.requireInsurance === opt.v ? `rgba(0, 118, 187, 0.08)` : 'white', color: data.requireInsurance === opt.v ? colors.blue : '#64748b', fontSize: '14px', fontWeight: 600 }}>{opt.l}</button>
              ))}
            </div>
          </FormGroup>
        </CardSection>
        <CardSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Clock size={18} color={colors.blue} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Booking Increments</h3>
          </div>
          <FormGroup label="Time Slots" hint="How should rental time be broken up?">
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{ value: '30', label: '30-minute slots' }, { value: '60', label: '1-hour slots' }].map(opt => (
                <button key={opt.value} onClick={() => update('timeIncrement', opt.value)} style={{ flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', border: data.timeIncrement === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', background: data.timeIncrement === opt.value ? `rgba(0, 118, 187, 0.08)` : 'white', color: data.timeIncrement === opt.value ? colors.blue : '#64748b', fontSize: '14px', fontWeight: 600 }}>{opt.label}</button>
              ))}
            </div>
          </FormGroup>
        </CardSection>
      </div>
      <CardSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <FileText size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Waivers & Agreements</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, background: 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: '6px' }}>Optional</span>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b' }}>Got a waiver renters need to sign? Add it here and we'll make sure they see it before booking.</p>
        <DocumentInput mode={waiverMode} setMode={setWaiverMode} text={data.waiverText} onTextChange={(v) => update('waiverText', v)} file={data.waiverFile} onFileChange={(f) => update('waiverFile', f)} onFileRemove={() => update('waiverFile', null)} label="waiver terms" />
      </CardSection>
      <CardSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <FileText size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Rental Policy Document</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, background: 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: '6px' }}>Optional</span>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b' }}>Have a facility use policy or rental agreement? Include it here so renters know the rules.</p>
        <DocumentInput mode={policyMode} setMode={setPolicyMode} text={data.facilityAgreement} onTextChange={(v) => update('facilityAgreement', v)} file={data.policyFile} onFileChange={(f) => update('policyFile', f)} onFileRemove={() => update('policyFile', null)} label="rental policy" />
      </CardSection>
    </div>
  );
}

function AssetCard({ asset, assetIndex, locationId, isExpanded, onToggle, updateAsset, updateApprover, updateNotification, addNotification, removeNotification, updateAmenity, addAmenity, removeAmenity, removeAsset, duplicateAsset: onDuplicate, canRemove }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', marginBottom: '16px', overflow: 'hidden', transition: 'all 0.3s', border: isExpanded ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.1)', boxShadow: isExpanded ? '0 8px 32px rgba(0, 118, 187, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
      <div onClick={onToggle} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? `rgba(0, 118, 187, 0.03)` : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: asset.name ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : 'rgba(0, 118, 187, 0.08)', fontSize: '16px', fontWeight: 700, color: asset.name ? '#fff' : '#64748b' }}>{assetIndex + 1}</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>{asset.name || `Facility ${assetIndex + 1}`}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{asset.pricing ? `$${asset.pricing}/hour` : 'Pricing not set'} • {asset.amenities.filter(a => a.name).length} add-ons</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(locationId, assetIndex); }} title="Duplicate this facility" style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Copy size={18} /></button>
          {canRemove && <button onClick={(e) => { e.stopPropagation(); removeAsset(locationId, assetIndex); }} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={18} /></button>}
          <ChevronRight size={20} color={colors.blue} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: '4px' }} />
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <FormGroup label="What's this space called?" required><input type="text" value={asset.name} onChange={(e) => updateAsset(locationId, assetIndex, 'name', e.target.value)} style={inputStyle} placeholder="e.g., Main Gymnasium, Auditorium, Field #1" /></FormGroup>
            <FormGroup label="Hourly Rate" required><input type="number" value={asset.pricing} onChange={(e) => updateAsset(locationId, assetIndex, 'pricing', e.target.value)} style={inputStyle} placeholder="$ per hour" /></FormGroup>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}><Clock size={16} color={colors.blue} /><h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>When can people book?</h5></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Weekdays (Mon-Fri)</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="time" value={asset.weekdayAvailability.start} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...asset.weekdayAvailability, start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekdayAvailability.end} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...asset.weekdayAvailability, end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Weekends (Sat-Sun)</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="time" value={asset.weekendAvailability.start} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...asset.weekendAvailability, start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekendAvailability.end} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...asset.weekendAvailability, end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}><Users size={16} color={colors.blue} /><h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Who approves bookings?</h5><span style={{ fontSize: '12px', color: '#94a3b8' }}>Up to 4 people</span></div>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>Requests go to the 1st approver first, then down the chain if needed.</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {['1st', '2nd', '3rd', 'Final'].map((label, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                  <span style={{ padding: '6px 12px', borderRadius: '6px', background: `linear-gradient(135deg, rgba(0, 118, 187, 0.1) 0%, rgba(0, 168, 79, 0.1) 100%)`, color: colors.blue, fontSize: '12px', fontWeight: 600, minWidth: '50px', textAlign: 'center' }}>{label}</span>
                  <input type="text" value={asset.approvers[i].name} onChange={(e) => updateApprover(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                  <input type="email" value={asset.approvers[i].email} onChange={(e) => updateApprover(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={16} color={colors.blue} /><h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Keep others in the loop</h5></div>
              <button onClick={() => addNotification(locationId, assetIndex)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: `rgba(0, 168, 79, 0.1)`, color: colors.green, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><Plus size={14} />Add person</button>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>These folks get notified about bookings but don't need to approve them.</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {asset.notifications.map((notif, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                  <input type="text" value={notif.name} onChange={(e) => updateNotification(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                  <input type="email" value={notif.email} onChange={(e) => updateNotification(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" />
                  {asset.notifications.length > 1 && <button onClick={() => removeNotification(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><DollarSign size={16} color={colors.blue} /><h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Optional Add-ons</h5></div>
              <button onClick={() => addAmenity(locationId, assetIndex)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: `rgba(0, 168, 79, 0.1)`, color: colors.green, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><Plus size={14} />Add item</button>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>Extra equipment or services renters can add to their booking.</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {asset.amenities.map((amenity, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                  <input type="text" value={amenity.name} onChange={(e) => updateAmenity(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="e.g., Scoreboard, PA System, Chairs" />
                  <input type="number" value={amenity.price} onChange={(e) => updateAmenity(locationId, assetIndex, i, 'price', e.target.value)} style={inputStyle} placeholder="$ extra" />
                  {asset.amenities.length > 1 && <button onClick={() => removeAmenity(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location, handlers, canRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedAsset, setExpandedAsset] = useState(0);
  const typeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[3];
  const Icon = typeInfo.icon;

  return (
    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0, 118, 187, 0.1)', marginBottom: '24px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
      <div onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: `linear-gradient(135deg, rgba(0, 118, 187, 0.03) 0%, rgba(0, 168, 79, 0.03) 100%)`, borderBottom: isExpanded ? '1px solid rgba(0, 118, 187, 0.08)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={26} color="white" /></div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{location.name || 'New Location'}</h3>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 118, 187, 0.1)', color: colors.blue, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{typeInfo.label}</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{location.address || 'Address not set'} • {location.assets.length} {location.assets.length === 1 ? 'facility' : 'facilities'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={(e) => { e.stopPropagation(); handlers.duplicateLocation(location.id); }} title="Duplicate this entire location" style={{ padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(0, 118, 187, 0.06)', color: colors.blue, cursor: 'pointer' }}><Copy size={18} /></button>
          {canRemove && <button onClick={(e) => { e.stopPropagation(); handlers.removeLocation(location.id); }} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>}
          <ChevronRight size={24} color={colors.blue} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: '4px' }} />
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding: '24px' }}>
          <CardSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}><MapPin size={18} color={colors.blue} /><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Location Details</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup label="Location Name" required><input type="text" value={location.name} onChange={(e) => handlers.updateLocation(location.id, 'name', e.target.value)} style={inputStyle} placeholder="e.g., Main Building, North Campus, Downtown Center" /></FormGroup>
              <FormGroup label="Address" required><input type="text" value={location.address} onChange={(e) => handlers.updateLocation(location.id, 'address', e.target.value)} style={inputStyle} placeholder="123 Main St, City, State ZIP" /></FormGroup>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0, 118, 187, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><User size={18} color={colors.blue} /><h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Who manages rentals at this location?</h4></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup label="First Name" required><input type="text" value={location.contactFirstName} onChange={(e) => handlers.updateLocation(location.id, 'contactFirstName', e.target.value)} style={inputStyle} placeholder="First name" /></FormGroup>
                <FormGroup label="Last Name" required><input type="text" value={location.contactLastName} onChange={(e) => handlers.updateLocation(location.id, 'contactLastName', e.target.value)} style={inputStyle} placeholder="Last name" /></FormGroup>
                <FormGroup label="Email" required><input type="email" value={location.contactEmail} onChange={(e) => handlers.updateLocation(location.id, 'contactEmail', e.target.value)} style={inputStyle} placeholder="contact@example.org" /></FormGroup>
                <FormGroup label="Phone" required><input type="tel" value={location.contactPhone} onChange={(e) => handlers.updateLocation(location.id, 'contactPhone', e.target.value)} style={inputStyle} placeholder="(555) 123-4567" /></FormGroup>
              </div>
            </div>
          </CardSection>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={18} color={colors.blue} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Rentable Spaces</h3>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: `rgba(0, 118, 187, 0.1)`, color: colors.blue, fontSize: '12px', fontWeight: 600 }}>{location.assets.length}</span>
              </div>
              <button onClick={() => handlers.addAsset(location.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: `1px solid rgba(0, 168, 79, 0.3)`, background: `rgba(0, 168, 79, 0.08)`, color: colors.green, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus size={16} />Add Space</button>
            </div>
            {location.assets.map((asset, assetIndex) => (
              <AssetCard key={assetIndex} asset={asset} assetIndex={assetIndex} locationId={location.id} isExpanded={expandedAsset === assetIndex} onToggle={() => setExpandedAsset(expandedAsset === assetIndex ? -1 : assetIndex)} updateAsset={handlers.updateAsset} updateApprover={handlers.updateApprover} updateNotification={handlers.updateNotification} addNotification={handlers.addNotification} removeNotification={handlers.removeNotification} updateAmenity={handlers.updateAmenity} addAmenity={handlers.addAmenity} removeAmenity={handlers.removeAmenity} removeAsset={handlers.removeAsset} duplicateAsset={handlers.duplicateAsset} canRemove={location.assets.length > 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationsStep({ locations, setLocations }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handlers = {
    addLocation: (type) => { setLocations(prev => [...prev, createEmptyLocation(type)]); setShowAddModal(false); },
    removeLocation: (id) => setLocations(prev => prev.filter(c => c.id !== id)),
    duplicateLocation: (id) => { const location = locations.find(c => c.id === id); if (location) setLocations(prev => [...prev, duplicateLocation(location)]); },
    updateLocation: (id, field, value) => setLocations(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c)),
    updateAsset: (locationId, assetIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; newAssets[assetIndex] = { ...newAssets[assetIndex], [field]: value }; return { ...c, assets: newAssets }; }));
    },
    updateApprover: (locationId, assetIndex, approverIndex, field, value) => {
      setLocations(prev => prev.map(c => { if (c.id !== locationId) return c; const newAssets = [...c.assets]; const newApprovers = [...newAssets[assetIndex].approvers]; newApprovers[approverIndex] = { ...newApprovers[approverIndex], [field]: value }; newAssets[assetIndex] = { ...newAssets[assetIndex], approvers: newApprovers }; return { ...c, assets: newAssets }; }));
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
      setLocations(prev => prev.map(c => c.id === locationId ? { ...c, assets: [...c.assets, createEmptyAsset()] } : c));
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
      <SectionTitle icon={Building2} title="Add Your Locations" subtitle="Tell us about each location and the spaces available for rent. Pro tip: Set up one location fully, then duplicate it!" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '20px 24px', background: 'linear-gradient(135deg, rgba(0, 118, 187, 0.04) 0%, rgba(0, 168, 79, 0.04) 100%)', borderRadius: '14px', border: '1px solid rgba(0, 118, 187, 0.1)' }}>
        <div>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{locations.length} {locations.length === 1 ? 'Location' : 'Locations'} • {locations.reduce((sum, c) => sum + c.assets.length, 0)} Spaces</p>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Click <Copy size={12} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> to duplicate and save time!</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 118, 187, 0.25)' }}><Plus size={18} />Add Location</button>
      </div>
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>What type of location?</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>Select the option that best describes this location.</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {locationTypes.map(type => {
                const TypeIcon = type.icon;
                return (
                  <button key={type.value} onClick={() => handlers.addLocation(type.value)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.15)', background: 'white', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `linear-gradient(135deg, rgba(0, 118, 187, 0.1) 0%, rgba(0, 168, 79, 0.1) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TypeIcon size={22} color={colors.blue} /></div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{type.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowAddModal(false)} style={{ marginTop: '20px', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.1)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {locations.map(location => (
        <LocationCard key={location.id} location={location} handlers={handlers} canRemove={locations.length > 1} />
      ))}
    </div>
  );
}

function ReviewStep({ policies, locations, contactInfo }) {
  const ReviewSection = ({ title, children }) => (<div style={{ background: 'rgba(248, 250, 252, 0.6)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.08)', padding: '24px', marginBottom: '16px' }}><h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>{children}</div>);
  const ReviewItem = ({ label, value }) => (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0, 118, 187, 0.06)' }}><span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span><span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>{value || '—'}</span></div>);
  const typeLabels = { school: 'School', recreation: 'Recreation Center', church: 'Church / Place of Worship', municipal: 'Municipal / Government', private: 'Private Facility', other: 'Other' };

  return (
    <div>
      <SectionTitle icon={Check} title="You're Almost There!" subtitle="Take a quick look to make sure everything's right. You can always update things later." />
      <ReviewSection title="Your Information">
        <ReviewItem label="Name" value={contactInfo.fullName} />
        <ReviewItem label="Title" value={contactInfo.jobTitle} />
        <ReviewItem label="Organization" value={contactInfo.organization} />
        <ReviewItem label="Email" value={contactInfo.email} />
        <ReviewItem label="Phone" value={contactInfo.phone} />
      </ReviewSection>
      <ReviewSection title="Your Policies">
        <ReviewItem label="Cancellation Window" value={`${policies.cancellationDays} days notice`} />
        <ReviewItem label="Weather Refunds" value={policies.weatherRefund === 'yes' ? 'Yes, refunds issued' : 'No refunds'} />
        <ReviewItem label="Insurance Required" value={policies.requireInsurance === 'yes' ? 'Yes' : 'No'} />
        <ReviewItem label="Time Slots" value={policies.timeIncrement === '30' ? '30-minute slots' : '1-hour slots'} />
        <ReviewItem label="Waiver" value={policies.waiverText || policies.waiverFile ? (policies.waiverFile ? `📎 ${policies.waiverFile.name}` : '✓ Text provided') : 'None'} />
        <ReviewItem label="Rental Policy" value={policies.facilityAgreement || policies.policyFile ? (policies.policyFile ? `📎 ${policies.policyFile.name}` : '✓ Text provided') : 'None'} />
      </ReviewSection>
      {locations.map((location, idx) => (
        <ReviewSection key={location.id} title={`${typeLabels[location.type] || 'Location'}: ${location.name || `Location ${idx + 1}`}`}>
          <ReviewItem label="Address" value={location.address} />
          <ReviewItem label="Contact" value={location.contactFirstName ? `${location.contactFirstName} ${location.contactLastName}` : null} />
          <ReviewItem label="Email" value={location.contactEmail} />
          <ReviewItem label="Phone" value={location.contactPhone} />
          <div style={{ marginTop: '16px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Rentable Spaces ({location.assets.length})</p>
            {location.assets.map((asset, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '14px 18px', marginBottom: '8px', border: '1px solid rgba(0, 118, 187, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>{asset.name || `Space ${i + 1}`}</span>
                  <span style={{ color: colors.green, fontSize: '13px', fontWeight: 600 }}>{asset.pricing ? `$${asset.pricing}/hr` : 'No price set'}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>{asset.approvers.filter(a => a.name).length} approvers • {asset.amenities.filter(a => a.name).length} add-ons</p>
              </div>
            ))}
          </div>
        </ReviewSection>
      ))}
      <div style={{ marginTop: '24px', padding: '28px', borderRadius: '16px', background: `linear-gradient(135deg, rgba(0, 168, 79, 0.1) 0%, rgba(0, 168, 79, 0.05) 100%)`, border: `1px solid rgba(0, 168, 79, 0.25)`, display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `rgba(0, 168, 79, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PartyPopper size={30} color={colors.green} /></div>
        <div>
          <h4 style={{ margin: 0, color: colors.greenDark, fontSize: '18px', fontWeight: 700 }}>Looking good! Ready to submit?</h4>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '15px' }}>Our team will review your info and get your facilities set up shortly.</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// GOOGLE FORM CONFIGURATION
// ===========================================
// To connect to your Google Form:
// 1. Replace GOOGLE_FORM_URL with your form's URL (change 'viewform' to 'formResponse')
// 2. Replace the entry.XXXXXX values with your actual field IDs from Google Forms
//
// To find your field IDs:
// - Open your Google Form → Three dots menu → Get pre-filled link
// - Fill in dummy data → Get link → Copy the URL
// - The entry.XXXXXX numbers in the URL are your field IDs

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse';

const GOOGLE_FORM_FIELDS = {
  fullName: 'entry.XXXXXXXXXX',             // Replace with your field ID
  jobTitle: 'entry.XXXXXXXXXX',             // Replace with your field ID
  organization: 'entry.XXXXXXXXXX',         // Replace with your field ID
  email: 'entry.XXXXXXXXXX',                // Replace with your field ID
  phone: 'entry.XXXXXXXXXX',                // Replace with your field ID
  cancellationDays: 'entry.XXXXXXXXXX',     // Replace with your field ID
  weatherRefund: 'entry.XXXXXXXXXX',        // Replace with your field ID
  requireInsurance: 'entry.XXXXXXXXXX',     // Replace with your field ID
  timeIncrement: 'entry.XXXXXXXXXX',        // Replace with your field ID
  waiverText: 'entry.XXXXXXXXXX',           // Replace with your field ID
  facilityAgreement: 'entry.XXXXXXXXXX',    // Replace with your field ID
  allData: 'entry.XXXXXXXXXX',              // Replace with your field ID (for full JSON data)
};
// ===========================================

function ContactInfoStep({ data, update }) {
  return (
    <div>
      <SectionTitle icon={User} title="Let's Start With You" subtitle="Tell us a bit about yourself so we can keep you updated on your setup." />
      <CardSection>
        <div style={{ maxWidth: '500px' }}>
          <FormGroup label="Full Name" required hint="Who should we reach out to?">
            <input type="text" value={data.fullName} onChange={(e) => update('fullName', e.target.value)} style={inputStyle} placeholder="e.g., John Smith" />
          </FormGroup>
          <FormGroup label="Job Title" required hint="What's your role?">
            <input type="text" value={data.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} style={inputStyle} placeholder="e.g., Athletic Director, Facilities Manager" />
          </FormGroup>
          <FormGroup label="Organization Name" required hint="The school, district, church, city, or organization we're setting up">
            <input type="text" value={data.organization} onChange={(e) => update('organization', e.target.value)} style={inputStyle} placeholder="e.g., Springfield School District, First Baptist Church, City of Riverside" />
          </FormGroup>
          <FormGroup label="Email Address" required hint="We'll send setup confirmations and updates here">
            <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} style={inputStyle} placeholder="you@example.org" />
          </FormGroup>
          <FormGroup label="Mobile Phone" required hint="In case we need to reach you quickly">
            <input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} style={inputStyle} placeholder="(555) 123-4567" />
          </FormGroup>
        </div>
      </CardSection>
      <div style={{ padding: '20px 24px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '24px' }}>🔒</div>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Your information is secure and will only be used to communicate about your PracticePlan setup.</p>
      </div>
    </div>
  );
}

export default function PracticePlanOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({ fullName: '', jobTitle: '', organization: '', email: '', phone: '' });
  const [policies, setPolicies] = useState({ cancellationDays: '7', weatherRefund: 'yes', requireInsurance: 'yes', waiverText: '', waiverFile: null, facilityAgreement: '', policyFile: null, timeIncrement: '60' });
  const [locations, setLocations] = useState([createEmptyLocation('school')]);
  const updateContactInfo = (field, value) => setContactInfo(prev => ({ ...prev, [field]: value }));
  const updatePolicies = (field, value) => setPolicies(prev => ({ ...prev, [field]: value }));
  const steps = [{ id: 'welcome', title: 'Welcome', icon: Sparkles }, { id: 'contact', title: 'Your Info', icon: User }, { id: 'policies', title: 'Policies', icon: FileText }, { id: 'locations', title: 'Locations', icon: Building2 }, { id: 'review', title: 'Review', icon: Check }];
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const submitToGoogleForm = async () => {
    setIsSubmitting(true);
    
    // Prepare the full data object
    const fullData = {
      contactInfo: contactInfo,
      policies: {
        ...policies,
        waiverFile: policies.waiverFile ? policies.waiverFile.name : null,
        policyFile: policies.policyFile ? policies.policyFile.name : null,
      },
      locations: locations,
      submittedAt: new Date().toISOString(),
    };

    // Build form data
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
      // Google Forms doesn't return proper CORS headers, so we use no-cors mode
      // This means we won't get a response, but the data will be submitted
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue submitting. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8fafb 0%, #eef3f6 50%, #e8f0f4 100%)', fontFamily: '"DM Sans", system-ui, sans-serif', color: '#1e293b', position: 'relative' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 20% 20%, rgba(0, 118, 187, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 168, 79, 0.03) 0%, transparent 50%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ padding: '24px 48px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 118, 187, 0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PracticePlanLogo width={240} />
          </div>
        </header>
        {currentStep > 0 && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {steps.slice(1).map((step, index) => {
                const actualIndex = index + 1;
                const Icon = step.icon; const isActive = actualIndex === currentStep; const isComplete = actualIndex < currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <button onClick={() => setCurrentStep(actualIndex)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: isActive ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : isComplete ? 'rgba(0, 168, 79, 0.1)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isActive ? '0 8px 32px rgba(0, 118, 187, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : isComplete ? 'rgba(0, 168, 79, 0.15)' : 'rgba(0, 118, 187, 0.08)' }}>{isComplete ? <Check size={16} color={colors.green} /> : <Icon size={16} color={isActive ? '#fff' : colors.blue} />}</div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#fff' : isComplete ? colors.green : '#64748b' }}>{step.title}</span>
                    </button>
                    {index < steps.length - 2 && <div style={{ width: '48px', height: '3px', background: actualIndex < currentStep ? `linear-gradient(90deg, ${colors.green}, ${colors.green})` : 'rgba(0, 118, 187, 0.1)', borderRadius: '3px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: currentStep === 0 ? '60px 48px 100px' : '0 48px 100px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(40px)', borderRadius: '24px', border: '1px solid rgba(0, 118, 187, 0.08)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 12px 48px rgba(0, 118, 187, 0.06)', overflow: 'hidden' }}>
            <div style={{ padding: currentStep === 0 ? '60px 48px' : '48px' }}>
              {currentStep === 0 && <WelcomeStep onContinue={nextStep} />}
              {currentStep === 1 && <ContactInfoStep data={contactInfo} update={updateContactInfo} />}
              {currentStep === 2 && <PoliciesStep data={policies} update={updatePolicies} />}
              {currentStep === 3 && <LocationsStep locations={locations} setLocations={setLocations} />}
              {currentStep === 4 && !submitSuccess && <ReviewStep policies={policies} locations={locations} contactInfo={contactInfo} />}
              {currentStep === 4 && submitSuccess && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 12px 40px rgba(0, 168, 79, 0.3)' }}>
                    <Check size={40} color="white" />
                  </div>
                  <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '32px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>You're All Set!</h2>
                  <p style={{ fontSize: '17px', color: '#64748b', margin: '0 0 12px', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                    Thanks for submitting your facility information. Our team will review everything and reach out soon to finalize your setup.
                  </p>
                  <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>
                    Questions? Email us at <a href="mailto:support@practiceplan.com" style={{ color: colors.blue, textDecoration: 'none', fontWeight: 600 }}>support@practiceplan.com</a>
                  </p>
                </div>
              )}
            </div>
            {currentStep > 0 && !submitSuccess && (
              <div style={{ padding: '24px 48px', borderTop: '1px solid rgba(0, 118, 187, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(248, 250, 252, 0.8)' }}>
                <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', border: `1px solid rgba(0, 118, 187, 0.2)`, background: 'white', color: colors.blue, fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}><ChevronLeft size={18} />{currentStep === 1 ? 'Back to Welcome' : 'Previous'}</button>
                <button onClick={currentStep === steps.length - 1 ? submitToGoogleForm : nextStep} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: 'none', background: currentStep === steps.length - 1 ? `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenLight} 100%)` : `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueLight} 100%)`, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: currentStep === steps.length - 1 ? '0 8px 24px rgba(0, 168, 79, 0.3)' : '0 8px 24px rgba(0, 118, 187, 0.3)', transition: 'all 0.2s' }}>{currentStep === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit to PracticePlan") : 'Continue'}{currentStep !== steps.length - 1 && <ChevronRight size={18} />}</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
