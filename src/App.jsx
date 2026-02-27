import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Building2, FileText, Shield, Clock, Users, DollarSign, Plus, Trash2, MapPin, Mail, User, X, School, Copy, Sparkles, PartyPopper, HelpCircle, AlertCircle, Crown, Save, Eye, Layers, Church, Landmark, Building, Home, Upload, File, Camera, Image, RotateCcw, CloudRain, Zap, RefreshCw, Lock, SkipForward, Sun, Ruler, Tag, ListChecks, Calendar, Bell, Rocket, Globe, TrendingUp, Headphones, ClipboardList, ArrowRight, Table, BarChart3 } from 'lucide-react';

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

// Reservation types organized by category
const reservationTypeCategories = [
  {
    name: 'Basketball',
    types: [
      { id: 'basketball_game_full', name: 'Game - Full Court', spaces: ['gymnasium', 'court'] },
      { id: 'basketball_game_half', name: 'Game - Half Court', spaces: ['gymnasium', 'court'] },
      { id: 'basketball_practice_full', name: 'Practice - Full Court', spaces: ['gymnasium', 'court'] },
      { id: 'basketball_practice_half', name: 'Practice - Half Court', spaces: ['gymnasium', 'court'] },
    ]
  },
  {
    name: 'Soccer',
    types: [
      { id: 'soccer', name: 'Game', spaces: ['field'] },
      { id: 'soccer_practice_full', name: 'Practice - Full Field', spaces: ['field'] },
      { id: 'soccer_practice_half', name: 'Practice - Half Field', spaces: ['field'] },
    ]
  },
  {
    name: 'Football',
    types: [
      { id: 'football', name: 'Game', spaces: ['field'] },
      { id: 'football_practice_full', name: 'Practice - Full Field', spaces: ['field'] },
      { id: 'football_practice_half', name: 'Practice - Half Field', spaces: ['field'] },
      { id: 'flag_football', name: 'Flag Football', spaces: ['field'] },
    ]
  },
  {
    name: 'Court Sports',
    types: [
      { id: 'volleyball', name: 'Volleyball', spaces: ['gymnasium', 'court'] },
      { id: 'sand_volleyball', name: 'Sand Volleyball', spaces: ['field', 'court'] },
      { id: 'pickleball', name: 'Pickleball', spaces: ['gymnasium', 'court'] },
      { id: 'tennis', name: 'Tennis', spaces: ['court'] },
      { id: 'spikeball', name: 'Spikeball', spaces: ['gymnasium', 'field'] },
      { id: 'futsal', name: 'Futsal', spaces: ['gymnasium'] },
    ]
  },
  {
    name: 'Field Sports',
    types: [
      { id: 'lacrosse', name: 'Lacrosse', spaces: ['field'] },
      { id: 'field_hockey', name: 'Field Hockey', spaces: ['field'] },
      { id: 'baseball', name: 'Baseball', spaces: ['field'] },
      { id: 'softball', name: 'Softball', spaces: ['field'] },
      { id: 'cricket', name: 'Cricket', spaces: ['field'] },
    ]
  },
  {
    name: 'Aquatic',
    types: [
      { id: 'swimming', name: 'Swimming', spaces: ['pool'] },
      { id: 'lap_swimming', name: 'Lap Swimming', spaces: ['pool'] },
      { id: 'diving', name: 'Diving', spaces: ['pool'] },
    ]
  },
  {
    name: 'Track & Field',
    types: [
      { id: 'running', name: 'Running', spaces: ['field', 'track'] },
      { id: 'throwing', name: 'Throwing', spaces: ['field'] },
    ]
  },
  {
    name: 'Training & Cages',
    types: [
      { id: 'hitting', name: 'Hitting', spaces: ['field', 'gymnasium'] },
      { id: 'hitting_cage', name: 'Hitting Cage', spaces: ['field', 'gymnasium'] },
      { id: 'pitching_cage', name: 'Pitching Cage', spaces: ['field', 'gymnasium'] },
    ]
  },
  {
    name: 'Fitness & Dance',
    types: [
      { id: 'fitness', name: 'Fitness', spaces: ['gymnasium', 'weight'] },
      { id: 'exercise_class', name: 'Exercise Class', spaces: ['gymnasium', 'weight', 'meeting'] },
      { id: 'wrestling', name: 'Wrestling', spaces: ['gymnasium'] },
      { id: 'cheerleading_dance', name: 'Cheerleading / Dance', spaces: ['gymnasium', 'auditorium'] },
    ]
  },
  {
    name: 'Performing Arts',
    types: [
      { id: 'theater', name: 'Theater', spaces: ['auditorium'] },
      { id: 'band_practice', name: 'Band Practice', spaces: ['auditorium'] },
    ]
  },
  {
    name: 'Meetings & Classes',
    types: [
      { id: 'meetings', name: 'Meetings', spaces: ['meeting', 'classroom', 'auditorium'] },
      { id: 'class', name: 'Class', spaces: ['classroom', 'meeting'] },
      { id: 'lessons', name: 'Lessons', spaces: ['gymnasium', 'meeting', 'classroom'] },
    ]
  },
  {
    name: 'Events & Gatherings',
    types: [
      { id: 'banquet', name: 'Banquet', spaces: ['auditorium', 'kitchen'] },
      { id: 'birthday_party', name: 'Birthday Party', spaces: ['meeting', 'pavilion'] },
      { id: 'family_outing', name: 'Family Outing', spaces: ['pavilion', 'field'] },
    ]
  },
  {
    name: 'Other',
    types: [
      { id: 'ice_hockey', name: 'Ice Hockey', spaces: ['other'] },
      { id: 'rv_space', name: 'RV Space Rental', spaces: ['other'] },
      { id: 'horse_stall', name: 'Horse Stall Rental', spaces: ['other'] },
    ]
  },
];

// Flatten for easy lookup
const allReservationTypes = reservationTypeCategories.flatMap(cat => 
  cat.types.map(t => ({ ...t, category: cat.name }))
);

// Facility features organized by category
const facilityFeatureCategories = [
  {
    name: 'Surface Type',
    features: [
      { id: 'turf', name: 'Turf' },
      { id: 'grass', name: 'Grass' },
      { id: 'concrete', name: 'Concrete/Paved' },
      { id: 'clay', name: 'Clay' },
      { id: 'sand', name: 'Sand' },
    ]
  },
  {
    name: 'Infield & Outfield',
    features: [
      { id: 'dirt_infield', name: 'Dirt Infield' },
      { id: 'grass_infield', name: 'Grass Infield' },
      { id: 'turf_infield', name: 'Turf Infield' },
      { id: 'grass_outfield', name: 'Grass Outfield' },
      { id: 'turf_outfield', name: 'Turf Outfield' },
    ]
  },
  {
    name: 'Lines & Markings',
    features: [
      { id: 'court_lines', name: 'Court Lines' },
      { id: 'field_lines', name: 'Field Lines' },
    ]
  },
  {
    name: 'Goals & Nets',
    features: [
      { id: 'goals', name: 'Goals' },
      { id: 'adjustable_goals', name: 'Adjustable Height Goals' },
      { id: 'goal_posts', name: 'Goal Posts' },
      { id: 'net', name: 'Net' },
    ]
  },
  {
    name: 'Baseball/Softball',
    features: [
      { id: 'bases', name: 'Bases' },
      { id: 'mound', name: 'Mound' },
      { id: 'removable_mound', name: 'Removable Mound' },
      { id: 'dugouts', name: 'Dugouts' },
      { id: 'l_screens', name: 'L-Screens' },
      { id: 'pitching_machine', name: 'Permanent Pitching Machine' },
    ]
  },
  {
    name: 'Equipment',
    features: [
      { id: 'balls', name: 'Balls' },
      { id: 'scoreboard', name: 'Scoreboard' },
    ]
  },
  {
    name: 'Seating & Furniture',
    features: [
      { id: 'bleachers', name: 'Bleachers' },
      { id: 'chairs', name: 'Chairs' },
      { id: 'dining_tables', name: 'Dining Tables' },
    ]
  },
  {
    name: 'Amenities',
    features: [
      { id: 'covered', name: 'Covered' },
      { id: 'parking', name: 'Parking' },
      { id: 'restrooms', name: 'Accessible Restrooms' },
      { id: 'electricity', name: 'Access To Electricity' },
      { id: 'water', name: 'Access to Water' },
      { id: 'wifi', name: 'Free WiFi' },
    ]
  },
];

// Flatten for easy lookup  
const allFacilityFeatures = facilityFeatureCategories.flatMap(cat => 
  cat.features.map(f => ({ ...f, category: cat.name }))
);

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
    indoorOutdoor: '', // 'indoor', 'outdoor', 'both'
    squareFootage: '',
    maxCapacity: '',
    reservationTypes: [],
    features: [],
    weekdayAvailability: { start: '15:00', end: '22:00' },
    weekendAvailability: { start: '08:00', end: '22:00' },
    availabilityNotes: '',
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
  assets: [],
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
  { value: 'pavilion', label: 'Pavilion / Shelter', icon: 'outdoor' },
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
  school: [],
  recreation: [],
  church: [],
  municipal: [],
  private: [],
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
const PhotoUpload = ({ photos = [], onAdd, onRemove, maxPhotos = 5, isMobile, hideLabel = false }) => {
  const fileInputRef = useRef(null);
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    files.forEach(file => {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert(`"${file.name}" is not a supported format. Please use JPG, PNG, or WebP.`);
        return;
      }
      
      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB per image.`);
        return;
      }
      
      if (photos.length < maxPhotos) {
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
      {!hideLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Camera size={16} color={colors.blue} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Photos</span>
          <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
        </div>
      )}
      
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
              accept=".jpg,.jpeg,.png,.webp"
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
        {photos.length}/{maxPhotos} photos • JPG, PNG, or WebP • Max 5MB each
      </p>
    </div>
  );
};

const CardSection = ({ children, style = {}, isMobile }) => (
  <div style={{ background: 'rgba(248, 250, 252, 0.6)', borderRadius: isMobile ? '12px' : '16px', border: '1px solid rgba(0, 118, 187, 0.08)', padding: isMobile ? '16px' : '24px', marginBottom: isMobile ? '16px' : '24px', ...style }}>{children}</div>
);

// Progress indicator for mobile - with integrated actions
const MobileProgressBar = ({ currentStep, totalSteps, onViewProgress, showViewProgress, isSaving, lastSaved }) => (
  <div style={{ padding: '12px 20px', background: 'white', borderBottom: '1px solid rgba(0, 118, 187, 0.08)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Progress section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Step {currentStep} of {totalSteps}</span>
          {lastSaved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isSaving ? (
                <div style={{ width: '10px', height: '10px', border: '2px solid rgba(0, 118, 187, 0.3)', borderTopColor: colors.blue, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Check size={12} color={colors.green} />
              )}
              <span style={{ fontSize: '11px', color: isSaving ? colors.blue : colors.green }}>{isSaving ? 'Saving' : 'Saved'}</span>
            </div>
          )}
        </div>
        <div style={{ height: '6px', background: 'rgba(0, 118, 187, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(currentStep / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${colors.blue}, ${colors.green})`, borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>
      </div>
      
      {/* View Progress button */}
      {showViewProgress && (
        <button
          onClick={onViewProgress}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0, 118, 187, 0.25)',
            flexShrink: 0
          }}
        >
          <ClipboardList size={14} />
          <span>Progress</span>
        </button>
      )}
    </div>
  </div>
);

// Overview Panel Component
// Completion Score Calculator
const calculateCompletionScore = (location) => {
  if (!location) return { score: 0, required: 0, optional: 0, details: {} };
  
  let requiredPoints = 0;
  let requiredMax = 0;
  let optionalPoints = 0;
  let optionalMax = 0;
  const details = {};
  
  // Location-level required: name (10 points)
  requiredMax += 10;
  if (location.name?.trim()) {
    requiredPoints += 10;
    details.name = true;
  } else {
    details.name = false;
  }
  
  // Location-level optional: photos (5 points)
  optionalMax += 5;
  if (location.photos && location.photos.length > 0) {
    optionalPoints += 5;
    details.locationPhotos = true;
  } else {
    details.locationPhotos = false;
  }
  
  // Must have at least one space
  if (!location.assets || location.assets.length === 0) {
    return { 
      score: Math.round((requiredPoints / (requiredMax + 40)) * 100), // 40 = min space points
      required: Math.round((requiredPoints / (requiredMax + 40)) * 100),
      optional: 0,
      details,
      hasSpaces: false
    };
  }
  
  // Per-space scoring
  location.assets.forEach((space, idx) => {
    const spaceKey = `space_${idx}`;
    details[spaceKey] = {};
    
    // Required fields per space (40 points total per space)
    requiredMax += 40;
    
    // Name (8 points)
    if (space.name?.trim()) {
      requiredPoints += 8;
      details[spaceKey].name = true;
    } else {
      details[spaceKey].name = false;
    }
    
    // Type (8 points)
    if (space.type) {
      requiredPoints += 8;
      details[spaceKey].type = true;
    } else {
      details[spaceKey].type = false;
    }
    
    // Indoor/Outdoor (8 points)
    if (space.indoorOutdoor) {
      requiredPoints += 8;
      details[spaceKey].indoorOutdoor = true;
    } else {
      details[spaceKey].indoorOutdoor = false;
    }
    
    // Pricing (8 points)
    if (space.pricing?.trim()) {
      requiredPoints += 8;
      details[spaceKey].pricing = true;
    } else {
      details[spaceKey].pricing = false;
    }
    
    // Approver (8 points)
    if (space.approvers && space.approvers.length > 0 && space.approvers[0]?.email?.trim()) {
      requiredPoints += 8;
      details[spaceKey].approver = true;
    } else {
      details[spaceKey].approver = false;
    }
    
    // Optional fields per space (35 points total per space)
    optionalMax += 35;
    
    // Photos (5 points)
    if (space.photos && space.photos.length > 0) {
      optionalPoints += 5;
      details[spaceKey].photos = true;
    } else {
      details[spaceKey].photos = false;
    }
    
    // Square footage (5 points)
    if (space.squareFootage?.trim()) {
      optionalPoints += 5;
      details[spaceKey].squareFootage = true;
    } else {
      details[spaceKey].squareFootage = false;
    }
    
    // Max capacity (5 points)
    if (space.maxCapacity?.trim()) {
      optionalPoints += 5;
      details[spaceKey].maxCapacity = true;
    } else {
      details[spaceKey].maxCapacity = false;
    }
    
    // Amenities (5 points)
    if (space.amenities && space.amenities.length > 0) {
      optionalPoints += 5;
      details[spaceKey].amenities = true;
    } else {
      details[spaceKey].amenities = false;
    }
    
    // Features (5 points)
    if (space.features && space.features.length > 0) {
      optionalPoints += 5;
      details[spaceKey].features = true;
    } else {
      details[spaceKey].features = false;
    }
    
    // Reservation types (5 points)
    if (space.reservationTypes && space.reservationTypes.length > 0) {
      optionalPoints += 5;
      details[spaceKey].reservationTypes = true;
    } else {
      details[spaceKey].reservationTypes = false;
    }
    
    // Multiple approvers (5 points)
    if (space.approvers && space.approvers.length > 1) {
      optionalPoints += 5;
      details[spaceKey].multipleApprovers = true;
    } else {
      details[spaceKey].multipleApprovers = false;
    }
  });
  
  const totalMax = requiredMax + optionalMax;
  const totalPoints = requiredPoints + optionalPoints;
  
  return {
    score: totalMax > 0 ? Math.round((totalPoints / totalMax) * 100) : 0,
    required: requiredMax > 0 ? Math.round((requiredPoints / requiredMax) * 100) : 0,
    optional: optionalMax > 0 ? Math.round((optionalPoints / optionalMax) * 100) : 0,
    details,
    hasSpaces: true
  };
};

// Status dot component
const StatusDot = ({ status, size = 10 }) => {
  const color = status === 'complete' ? colors.green : status === 'partial' ? '#f59e0b' : '#ef4444';
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      flexShrink: 0
    }} />
  );
};

// Edge Tab Trigger for Desktop
const ProgressEdgeTab = ({ onClick, incompleteCount, overallScore }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '48px',
      height: '120px',
      background: `linear-gradient(180deg, ${colors.blue} 0%, ${colors.green} 100%)`,
      border: 'none',
      borderRadius: '12px 0 0 12px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
      zIndex: 100,
      transition: 'width 0.2s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.width = '56px'}
    onMouseLeave={(e) => e.currentTarget.style.width = '48px'}
  >
    <ClipboardList size={22} color="white" />
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 700,
      color: 'white'
    }}>
      {overallScore}%
    </div>
    {incompleteCount > 0 && (
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#ef4444',
        color: 'white',
        fontSize: '10px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {incompleteCount}
      </div>
    )}
  </button>
);

// Editable Table Cell Component
const EditableCell = ({ value, onChange, type = 'text', options = [], placeholder = '', isRequired = false, isEmpty = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text' || type === 'number' || type === 'email') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);
  
  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value || '');
      setIsEditing(false);
    } else if (e.key === 'Tab') {
      handleBlur();
    }
  };
  
  const cellStyle = {
    padding: '8px 10px',
    fontSize: '13px',
    color: isEmpty && isRequired ? '#94a3b8' : '#1e293b',
    background: isEmpty && isRequired ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
    cursor: 'pointer',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    transition: 'all 0.15s',
    fontStyle: isEmpty ? 'italic' : 'normal'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    fontSize: '13px',
    border: `2px solid ${colors.blue}`,
    borderRadius: '4px',
    outline: 'none',
    background: 'white'
  };
  
  if (type === 'select') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          border: isEmpty && isRequired ? '1px solid #f59e0b' : '1px solid rgba(0,0,0,0.1)',
          background: isEmpty && isRequired ? 'rgba(245, 158, 11, 0.08)' : 'white',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        placeholder={placeholder}
      />
    );
  }
  
  return (
    <div 
      onClick={() => setIsEditing(true)}
      style={cellStyle}
      onMouseEnter={(e) => e.currentTarget.style.background = isEmpty && isRequired ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 118, 187, 0.05)'}
      onMouseLeave={(e) => e.currentTarget.style.background = isEmpty && isRequired ? 'rgba(245, 158, 11, 0.08)' : 'transparent'}
    >
      {value || <span style={{ color: '#94a3b8' }}>{placeholder || '—'}</span>}
    </div>
  );
};

// Table Editor Component - Clean spreadsheet-style editing
const TableEditor = ({ locations, setLocations, onClose, onEditDetails, isMobile, onDone }) => {
  const [saveMessage, setSaveMessage] = useState(null);
  
  const updateLocation = (locationId, field, value) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId ? { ...loc, [field]: value } : loc
    ));
  };
  
  const updateSpace = (locationId, spaceIndex, field, value) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id !== locationId) return loc;
      const newAssets = [...loc.assets];
      newAssets[spaceIndex] = { ...newAssets[spaceIndex], [field]: value };
      return { ...loc, assets: newAssets };
    }));
  };
  
  const updateApprover = (locationId, spaceIndex, field, value) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id !== locationId) return loc;
      const newAssets = [...loc.assets];
      const space = newAssets[spaceIndex];
      const approvers = space.approvers && space.approvers.length > 0 
        ? [...space.approvers] 
        : [{ name: '', email: '', title: '' }];
      approvers[0] = { ...approvers[0], [field]: value };
      newAssets[spaceIndex] = { ...space, approvers };
      return { ...loc, assets: newAssets };
    }));
  };
  
  const addLocation = () => {
    const newLocation = {
      id: Date.now(),
      name: '',
      type: 'school',
      address: '',
      assets: [],
      photos: [],
      documents: []
    };
    setLocations(prev => [...prev, newLocation]);
  };
  
  const addSpace = (locationId) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id !== locationId) return loc;
      const newSpace = {
        id: Date.now(),
        type: '',
        name: '',
        indoorOutdoor: '',
        squareFootage: '',
        maxCapacity: '',
        reservationTypes: [],
        features: [],
        weekdayAvailability: { start: '15:00', end: '22:00' },
        weekendAvailability: { start: '08:00', end: '22:00' },
        availabilityNotes: '',
        blackoutOption: 'none',
        blackoutDates: '',
        approvers: [{ name: '', email: '' }],
        notifications: [{ name: '', email: '' }],
        pricing: '',
        amenities: [],
        photos: []
      };
      return { ...loc, assets: [...loc.assets, newSpace] };
    }));
  };
  
  const deleteSpace = (locationId, spaceIndex) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id !== locationId) return loc;
      const newAssets = loc.assets.filter((_, idx) => idx !== spaceIndex);
      return { ...loc, assets: newAssets };
    }));
  };
  
  const deleteLocation = (locationId) => {
    if (window.confirm('Delete this location and all its spaces?')) {
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    }
  };
  
  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('practiceplan_draft') || '{}');
      localStorage.setItem('practiceplan_draft', JSON.stringify({ ...existing, locations, savedAt: new Date().toISOString() }));
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (e) {
      setSaveMessage('Save failed');
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };
  
  const indoorOutdoorOptions = [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' }
  ];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Instructions */}
      <div style={{ padding: '12px 24px', background: 'rgba(0, 118, 187, 0.04)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span><strong>Click</strong> cell to edit</span>
        <span><strong>Tab</strong> to move</span>
        <span><strong>Enter</strong> to save</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: 'rgba(245, 158, 11, 0.3)', borderRadius: '2px' }} />
          Required empty
        </span>
      </div>
      
      {/* Table Container */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        {locations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 118, 187, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MapPin size={28} color={colors.blue} />
            </div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: '0 0 8px' }}>No locations yet</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>Add your first location to get started</p>
            <button onClick={addLocation} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} />
              Add Location
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '800px' : '1200px' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.02)', borderBottom: '2px solid rgba(0, 0, 0, 0.08)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '140px' }}>Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '140px' }}>Space Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '130px' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>In/Out</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '80px' }}>$/Hr</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '70px' }}>Cap</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '70px' }}>SqFt</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '180px' }}>Approver Email</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '70px' }}>Amenities</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '70px' }}>Features</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '70px' }}>More</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, locIndex) => (
                    <React.Fragment key={location.id}>
                      {location.assets.length === 0 ? (
                        <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                          <td style={{ padding: '4px 8px', verticalAlign: 'middle' }}>
                            <EditableCell value={location.name} onChange={(val) => updateLocation(location.id, 'name', val)} placeholder="Location name" isRequired={true} isEmpty={!location.name?.trim()} />
                          </td>
                          <td colSpan={10} style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No spaces added yet</td>
                          <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                            <button onClick={() => deleteLocation(location.id)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} title="Delete location"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ) : (
                        location.assets.map((space, spaceIndex) => (
                          <tr key={space.id || spaceIndex} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', background: spaceIndex % 2 === 1 ? 'rgba(0, 0, 0, 0.01)' : 'transparent' }}>
                            {spaceIndex === 0 ? (
                              <td rowSpan={location.assets.length} style={{ padding: '4px 8px', verticalAlign: 'top', borderRight: '2px solid rgba(0, 118, 187, 0.1)', background: 'rgba(0, 118, 187, 0.02)' }}>
                                <EditableCell value={location.name} onChange={(val) => updateLocation(location.id, 'name', val)} placeholder="Location name" isRequired={true} isEmpty={!location.name?.trim()} />
                                <button onClick={() => deleteLocation(location.id)} style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} title="Delete location"><Trash2 size={10} />Delete</button>
                              </td>
                            ) : null}
                            <td style={{ padding: '4px 8px' }}><EditableCell value={space.name} onChange={(val) => updateSpace(location.id, spaceIndex, 'name', val)} placeholder="Space name" isRequired={true} isEmpty={!space.name?.trim()} /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="select" value={space.type} onChange={(val) => updateSpace(location.id, spaceIndex, 'type', val)} options={spaceTypes} placeholder="Select type" isRequired={true} isEmpty={!space.type} /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="select" value={space.indoorOutdoor} onChange={(val) => updateSpace(location.id, spaceIndex, 'indoorOutdoor', val)} options={indoorOutdoorOptions} placeholder="Select" isRequired={true} isEmpty={!space.indoorOutdoor} /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="number" value={space.pricing} onChange={(val) => updateSpace(location.id, spaceIndex, 'pricing', val)} placeholder="$0" isRequired={true} isEmpty={!space.pricing?.trim()} /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="number" value={space.maxCapacity} onChange={(val) => updateSpace(location.id, spaceIndex, 'maxCapacity', val)} placeholder="—" /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="number" value={space.squareFootage} onChange={(val) => updateSpace(location.id, spaceIndex, 'squareFootage', val)} placeholder="—" /></td>
                            <td style={{ padding: '4px 8px' }}><EditableCell type="email" value={space.approvers?.[0]?.email || ''} onChange={(val) => updateApprover(location.id, spaceIndex, 'email', val)} placeholder="email@..." isRequired={true} isEmpty={!space.approvers?.[0]?.email?.trim()} /></td>
                            <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                background: space.amenities?.length > 0 ? 'rgba(0, 168, 79, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                color: space.amenities?.length > 0 ? colors.green : '#94a3b8'
                              }}>
                                {space.amenities?.length || 0}
                              </span>
                            </td>
                            <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                background: space.features?.length > 0 ? 'rgba(0, 168, 79, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                color: space.features?.length > 0 ? colors.green : '#94a3b8'
                              }}>
                                {space.features?.length || 0}
                              </span>
                            </td>
                            <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                              <button onClick={() => onEditDetails(location.id, spaceIndex)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'rgba(0, 118, 187, 0.08)', color: colors.blue, cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }} title="Edit additional details in form view">
                                <ArrowRight size={10} />Details
                              </button>
                            </td>
                            <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                              <button onClick={() => deleteSpace(location.id, spaceIndex)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} title="Delete space"><X size={14} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                      <tr style={{ borderBottom: locIndex < locations.length - 1 ? '3px solid rgba(0, 118, 187, 0.15)' : 'none', background: 'rgba(0, 168, 79, 0.03)' }}>
                        <td></td>
                        <td colSpan={11} style={{ padding: '8px 16px' }}>
                          <button onClick={() => addSpace(location.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px dashed rgba(0, 168, 79, 0.4)', background: 'transparent', color: colors.green, cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Plus size={14} />Add Space to {location.name || 'this location'}
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', background: 'rgba(0, 118, 187, 0.02)' }}>
              <button onClick={addLocation} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px dashed rgba(0, 118, 187, 0.4)', background: 'transparent', color: colors.blue, cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} />Add New Location
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid rgba(0, 0, 0, 0.08)', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Changes auto-save</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveMessage && <span style={{ fontSize: '12px', fontWeight: 600, color: saveMessage === 'Saved!' ? colors.green : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>{saveMessage === 'Saved!' && <Check size={14} />}{saveMessage}</span>}
          <button onClick={handleSave} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.1)', background: 'white', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Save size={14} />Save</button>
          <button onClick={onDone} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>Done<Check size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const OverviewPanel = ({ isOpen, onClose, locations, setLocations, onLocationClick, isMobile, onClearForm, policies, contactInfo }) => {
  const [filter, setFilter] = useState('all'); // 'all' or 'incomplete'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'status'
  
  // Calculate completion for each location
  const locationScores = locations.map(loc => ({
    ...loc,
    completion: calculateCompletionScore(loc)
  }));
  
  // Overall stats
  const overallScore = locations.length > 0 
    ? Math.round(locationScores.reduce((sum, l) => sum + l.completion.score, 0) / locations.length)
    : 0;
  
  const stats = {
    totalLocations: locations.length,
    totalSpaces: locations.reduce((sum, l) => sum + (l.assets?.length || 0), 0),
    completeLocations: locationScores.filter(l => l.completion.required === 100).length,
    incompleteCount: locationScores.filter(l => l.completion.required < 100).length,
    indoorSpaces: locations.reduce((sum, l) => sum + (l.assets?.filter(a => a.indoorOutdoor === 'indoor').length || 0), 0),
    outdoorSpaces: locations.reduce((sum, l) => sum + (l.assets?.filter(a => a.indoorOutdoor === 'outdoor').length || 0), 0),
    totalAmenities: locations.reduce((sum, l) => sum + (l.assets?.reduce((s, a) => s + (a.amenities?.length || 0), 0) || 0), 0),
    totalFeatures: locations.reduce((sum, l) => sum + (l.assets?.reduce((s, a) => s + (a.features?.length || 0), 0) || 0), 0),
    spacesWithPhotos: locations.reduce((sum, l) => sum + (l.assets?.filter(a => a.photos?.length > 0).length || 0), 0),
    avgPrice: (() => {
      const prices = locations.flatMap(l => l.assets?.map(a => parseFloat(a.pricing) || 0) || []).filter(p => p > 0);
      return prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    })()
  };
  
  // Format go-live date
  const formatGoLiveDate = () => {
    if (!policies?.goLiveDate) return 'Not set';
    const date = new Date(policies.goLiveDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Get booking window text
  const getBookingWindow = () => {
    if (!policies?.bookingWindowMonths) return 'Not set';
    if (policies.bookingWindowMonths === 'other') return policies.customBookingWindow || 'Custom';
    return `${policies.bookingWindowMonths} months`;
  };
  
  // Filter locations
  const filteredLocations = filter === 'all' 
    ? locationScores 
    : locationScores.filter(l => l.completion.required < 100);
  
  // Get status for a field
  const getFieldStatus = (value, isArray = false) => {
    if (isArray) return value && value.length > 0 ? 'complete' : 'incomplete';
    return value ? 'complete' : 'incomplete';
  };
  
  // Get pricing range
  const getPricingRange = (location) => {
    if (!location.assets || location.assets.length === 0) return '—';
    const prices = location.assets.map(a => parseFloat(a.pricing) || 0).filter(p => p > 0);
    if (prices.length === 0) return '—';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min}`;
    return `$${min}-${max}`;
  };
  
  // Count indoor/outdoor
  const getIndoorOutdoorCount = (location) => {
    if (!location.assets) return { indoor: 0, outdoor: 0 };
    const indoor = location.assets.filter(a => a.indoorOutdoor === 'indoor').length;
    const outdoor = location.assets.filter(a => a.indoorOutdoor === 'outdoor').length;
    return { indoor, outdoor };
  };
  
  // Check if location has specific field filled
  const hasPhotos = (location) => {
    if (location.photos?.length > 0) return true;
    return location.assets?.some(a => a.photos?.length > 0) || false;
  };
  
  const hasCapacity = (location) => location.assets?.some(a => a.maxCapacity?.trim()) || false;
  const hasSize = (location) => location.assets?.some(a => a.squareFootage?.trim()) || false;
  const hasAmenities = (location) => location.assets?.some(a => a.amenities?.length > 0) || false;
  const hasFeatures = (location) => location.assets?.some(a => a.features?.length > 0) || false;
  const hasReservationTypes = (location) => location.assets?.some(a => a.reservationTypes?.length > 0) || false;
  const hasApprovalChain = (location) => location.assets?.some(a => a.approvers?.length > 1) || false;
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: isMobile ? '100%' : 'calc(100% - 60px)',
        maxWidth: isMobile ? '100%' : '1400px',
        background: '#f8fafc',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          background: 'white',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `conic-gradient(${colors.green} ${overallScore * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: overallScore === 100 ? colors.green : overallScore >= 70 ? '#f59e0b' : '#64748b'
              }}>
                {overallScore}%
              </div>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {viewMode === 'status' ? 'Setup Progress' : 'Table Editor'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
                {stats.totalLocations} location{stats.totalLocations !== 1 ? 's' : ''} · {stats.totalSpaces} space{stats.totalSpaces !== 1 ? 's' : ''}
                {stats.incompleteCount > 0 && ` · ${stats.incompleteCount} need attention`}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              padding: '3px'
            }}>
              <button
                onClick={() => setViewMode('status')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'status' ? 'white' : 'transparent',
                  color: viewMode === 'status' ? colors.blue : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: viewMode === 'status' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                title="View status"
              >
                <BarChart3 size={14} />
                Status
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'table' ? 'white' : 'transparent',
                  color: viewMode === 'table' ? colors.blue : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                title="Edit in table"
              >
                <Table size={14} />
                Edit
              </button>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} color="#64748b" />
            </button>
          </div>
        </div>
        
        {/* Conditional Content based on viewMode */}
        {viewMode === 'table' ? (
          <TableEditor 
            locations={locations}
            setLocations={setLocations}
            onClose={onClose}
            onEditDetails={(locationId, spaceIndex) => {
              // Close panel and jump to location/space in form
              onClose();
              onLocationClick(locationId, spaceIndex);
            }}
            isMobile={isMobile}
            onDone={() => setViewMode('status')}
          />
        ) : (
        <>
        {/* Dashboard Summary */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Top Row - Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            {/* Go-Live Date */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${colors.blue}15 0%, ${colors.green}15 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Rocket size={18} color={colors.blue} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Go-Live</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: policies?.goLiveDate ? '#1e293b' : '#94a3b8' }}>
                {formatGoLiveDate()}
              </span>
            </div>
            
            {/* Booking Window */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 118, 187, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} color={colors.blue} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Book Ahead</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: policies?.bookingWindowMonths ? '#1e293b' : '#94a3b8' }}>
                {getBookingWindow()}
              </span>
            </div>
            
            {/* Approval Required */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: policies?.requireApproval === 'yes' ? 'rgba(0, 168, 79, 0.08)' : 'rgba(0, 118, 187, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color={policies?.requireApproval === 'yes' ? colors.green : colors.blue} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approval</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                {policies?.requireApproval === 'yes' ? 'Required' : 'Auto-approve'}
              </span>
            </div>
            
            {/* Overall Completion */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  background: `conic-gradient(${overallScore === 100 ? colors.green : overallScore >= 70 ? '#f59e0b' : colors.blue} ${overallScore * 3.6}deg, rgba(0,0,0,0.06) 0deg)`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: overallScore === 100 ? colors.green : overallScore >= 70 ? '#f59e0b' : colors.blue }}>{overallScore}%</span>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complete</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: overallScore === 100 ? colors.green : '#1e293b' }}>
                {stats.completeLocations}/{stats.totalLocations} Ready
              </span>
            </div>
          </div>
          
          {/* Second Row - Inventory Summary */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            {/* Locations & Spaces */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '24px', 
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color={colors.blue} /> Inventory
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: colors.blue }}>{stats.totalLocations}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Locations</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 168, 79, 0.04)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: colors.green }}>{stats.totalSpaces}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Spaces</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{stats.indoorSpaces}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Indoor</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{stats.outdoorSpaces}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Outdoor</div>
                </div>
              </div>
            </div>
            
            {/* Pricing & Content */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '24px', 
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color={colors.green} /> Pricing & Content
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 168, 79, 0.04)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: colors.green }}>${stats.avgPrice || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Avg $/Hour</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: colors.blue }}>{stats.spacesWithPhotos}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>With Photos</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{stats.totalAmenities}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Amenities</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{stats.totalFeatures}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Features</div>
                </div>
              </div>
            </div>
            
            {/* Ground Rules Summary */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '24px', 
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color={colors.blue} /> Policies
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Cancellation</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {policies?.cancellationDays === 'unsure' ? 'TBD' : `${policies?.cancellationDays || '7'} days`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Insurance</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {policies?.requireInsurance === 'yes' ? 'Required' : policies?.requireInsurance === 'sometimes' ? 'Sometimes' : 'Not required'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Weather Refund</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {policies?.weatherRefund === 'yes' ? 'Yes' : policies?.weatherRefund === 'credit' ? 'Credit' : 'No'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Time Slots</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {policies?.timeIncrement === '60' ? '1 hour' : policies?.timeIncrement === '30' ? '30 min' : `${policies?.timeIncrement || '60'} min`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Locations Table - Compact */}
          {locations.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={colors.blue} /> Location Status
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setFilter('all')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: filter === 'all' ? colors.blue : 'rgba(0, 0, 0, 0.04)',
                      color: filter === 'all' ? 'white' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    All ({locations.length})
                  </button>
                  {stats.incompleteCount > 0 && (
                    <button
                      onClick={() => setFilter('incomplete')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: filter === 'incomplete' ? '#f59e0b' : 'rgba(0, 0, 0, 0.04)',
                        color: filter === 'incomplete' ? 'white' : '#64748b',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Needs Attention ({stats.incompleteCount})
                    </button>
                  )}
                </div>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredLocations.map((location, index) => {
                  const typeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[5];
                  const completion = location.completion;
                  return (
                    <div 
                      key={location.id}
                      onClick={() => onLocationClick(location.id, index)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                        borderBottom: index < filteredLocations.length - 1 ? '1px solid rgba(0, 0, 0, 0.04)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 118, 187, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: `linear-gradient(135deg, ${colors.blue}15 0%, ${colors.green}15 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {React.createElement(typeInfo.icon, { size: 16, color: colors.blue })}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {location.name || 'Unnamed'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {location.assets?.length || 0} space{location.assets?.length !== 1 ? 's' : ''} · {getPricingRange(location)}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '60px',
                          height: '6px',
                          background: 'rgba(0,0,0,0.08)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${completion.score}%`,
                            height: '100%',
                            background: completion.score === 100 ? colors.green : completion.score >= 70 ? '#f59e0b' : '#ef4444',
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: completion.score === 100 ? colors.green : '#64748b', minWidth: '35px' }}>
                          {completion.score}%
                        </span>
                        <ChevronRight size={16} color="#94a3b8" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Contact Info */}
          {contactInfo?.fullName && (
            <div style={{ 
              marginTop: '16px',
              background: 'white', 
              borderRadius: '16px', 
              padding: '16px 20px', 
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{contactInfo.fullName}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{contactInfo.jobTitle}{contactInfo.organization ? ` · ${contactInfo.organization}` : ''}</div>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{contactInfo.email}</div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ 
          padding: '16px 24px', 
          background: 'white',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between'
        }}>
          {!isMobile && (
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Click any location to jump to it in the form
            </p>
          )}
          {isMobile && (
            <button
              onClick={() => {
                onClearForm();
                onClose();
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'white',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              Clear & Restart
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`,
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Continue Editing
            <ArrowRight size={14} />
          </button>
        </div>
        </>
        )}
        )}
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

// Resume Draft Modal
const ResumeDraftModal = ({ savedDate, onResume, onStartFresh, isMobile }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  }}>
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: isMobile ? '32px 24px' : '40px',
      maxWidth: '440px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      animation: 'scaleIn 0.3s ease-out'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: `linear-gradient(135deg, ${colors.blue}20 0%, ${colors.green}20 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
      }}>
        <Save size={28} color={colors.blue} />
      </div>
      
      <h3 style={{ 
        margin: '0 0 8px', 
        fontSize: '22px', 
        fontWeight: 700, 
        color: '#0f172a' 
      }}>
        Welcome Back!
      </h3>
      
      <p style={{ 
        margin: '0 0 24px', 
        fontSize: '15px', 
        color: '#64748b',
        lineHeight: 1.6
      }}>
        You have a saved draft from<br />
        <strong style={{ color: '#334155' }}>{savedDate}</strong>
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onResume}
          style={{
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`,
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0, 118, 187, 0.3)'
          }}
        >
          <RefreshCw size={18} />
          Resume Draft
        </button>
        
        <button
          onClick={onStartFresh}
          style={{
            padding: '14px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'white',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Start Fresh
        </button>
      </div>
    </div>
  </div>
);

function WelcomeStep({ onContinue, isMobile }) {
  // Calendar with checkmark icon - gradient
  const CalendarCheckIcon = () => (
    <svg width={isMobile ? 36 : 44} height={isMobile ? 36 : 44} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradCalendar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077bc" />
          <stop offset="100%" stopColor="#00a84f" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="url(#gradCalendar)" strokeWidth="2" fill="none" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="url(#gradCalendar)" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="url(#gradCalendar)" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="url(#gradCalendar)" strokeWidth="2" />
      <path d="M9 16l2 2 4-4" stroke="url(#gradCalendar)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // Gradient outline icons for cards
  const QuickSetupIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradQuick" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077bc" />
          <stop offset="100%" stopColor="#00a84f" />
        </linearGradient>
      </defs>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="url(#gradQuick)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  const DuplicateIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradDupe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077bc" />
          <stop offset="100%" stopColor="#00a84f" />
        </linearGradient>
      </defs>
      <path d="M17 1l4 4-4 4" stroke="url(#gradDupe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="url(#gradDupe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M7 23l-4-4 4-4" stroke="url(#gradDupe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="url(#gradDupe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  const TeamIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradTeam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077bc" />
          <stop offset="100%" stopColor="#00a84f" />
        </linearGradient>
      </defs>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#gradTeam)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="9" cy="7" r="4" stroke="url(#gradTeam)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#gradTeam)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#gradTeam)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  return (
    <div style={{ textAlign: 'center', padding: isMobile ? '10px 0' : '20px 0' }}>
      {/* Calendar with checkmark icon in gradient rounded square */}
      <div style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: isMobile ? '16px' : '20px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(0, 118, 187, 0.3)' }}>
        <svg width={isMobile ? 32 : 40} height={isMobile ? 32 : 40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" strokeWidth="2" fill="none" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
          <path d="M9 16l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      
      <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: isMobile ? '28px' : '36px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a', lineHeight: 1.2 }}>
        Welcome to PracticePlan!
      </h1>
      <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#64748b', margin: '0 0 32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, padding: isMobile ? '0 10px' : 0 }}>
        We're thrilled to have you on board. Let's get your facilities set up so your community can start booking.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? '12px' : '20px', maxWidth: '600px', margin: '0 auto 32px' }}>
        {[
          { icon: QuickSetupIcon, title: 'Quick Setup', desc: 'Just 5-10 minutes' },
          { icon: DuplicateIcon, title: 'Easy Duplicating', desc: 'Copy settings to quickly add facilities' },
          { icon: TeamIcon, title: 'We Handle the Rest', desc: 'Our team will finalize everything from here' },
        ].map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div key={i} style={{ padding: isMobile ? '16px' : '24px 16px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.06)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', display: isMobile ? 'flex' : 'block', alignItems: 'center', gap: '16px', textAlign: isMobile ? 'left' : 'center' }}>
              <div style={{ marginBottom: isMobile ? 0 : '12px', marginLeft: isMobile ? 0 : 'auto', marginRight: isMobile ? 0 : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
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
// ===========================================
// GOOGLE APPS SCRIPT CONFIGURATION
// ===========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxY4cTJeIBwjbCV77vSDpn1OiP2mrs5h6phU4rJazR9rAYbrQLYJF37W8d7l_QndcMB/exec';
// ===========================================

function ContactInfoStep({ data, update, errors, isMobile }) {
  return (
    <div>
      <SectionTitle icon={User} title="Let's Start With You" subtitle="Tell us a bit about yourself so we can keep you updated on your setup." isMobile={isMobile} />
      <CardSection isMobile={isMobile}>
        <div style={{ maxWidth: '600px' }}>
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
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lock size={20} color={colors.blue} />
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Your information is secure and will only be used to communicate about your PracticePlan setup.</p>
      </div>
    </div>
  );
}

function PoliciesStep({ data, update, isMobile }) {
  const [showCustomCancellation, setShowCustomCancellation] = useState(data.cancellationDays === 'custom');
  const [showCustomIncrement, setShowCustomIncrement] = useState(data.timeIncrement === 'custom');
  const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB per document
  
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
      // Validate file type
      const allowedTypes = ['application/pdf'];
      const allowedExtensions = ['.pdf'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
        alert(`"${file.name}" is not a supported format. Please upload a PDF file.`);
        return;
      }
      
      // Validate file size
      if (file.size > MAX_DOC_SIZE) {
        alert(`"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
        return;
      }
      
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
            accept=".pdf"
            onChange={(e) => handleFileUpload(field, e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 118, 187, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={24} color={colors.blue} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.blue }}>Click to upload {label}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>PDF only • Max 5MB</p>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <div>
      <SectionTitle icon={FileText} title="Set Your Ground Rules" subtitle="These policies will apply across all your locations - you can always change them later!" isMobile={isMobile} />
      
      {/* Booking Period Section - Full Width */}
      <CardSection isMobile={isMobile} style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Calendar size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Booking Period</h3>
          <Tooltip text="When do you want to start accepting bookings, and how far in advance can people book?"><span /></Tooltip>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <FormGroup label="When do you want to go live?" tooltip="The date you want to start allowing the public to make bookings on PracticePlan.">
            <input 
              type="date" 
              value={data.goLiveDate || ''} 
              onChange={(e) => update('goLiveDate', e.target.value)}
              style={inputStyle}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormGroup>
          <FormGroup label="How far in advance can people book?" tooltip="The maximum number of months into the future that renters can reserve your spaces.">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: '1', label: '1 month' },
                { value: '3', label: '3 months' },
                { value: '6', label: '6 months' },
                { value: '12', label: '12 months' },
                { value: 'other', label: 'Other' },
              ].map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => update('bookingWindowMonths', opt.value)} 
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    border: data.bookingWindowMonths === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)', 
                    background: data.bookingWindowMonths === opt.value ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: data.bookingWindowMonths === opt.value ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {data.bookingWindowMonths === 'other' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <input 
                  type="number" 
                  value={data.customBookingWindowMonths || ''} 
                  onChange={(e) => update('customBookingWindowMonths', e.target.value)}
                  style={{ ...inputStyle, width: '80px' }}
                  placeholder="0"
                  min="1"
                  max="24"
                />
                <span style={{ fontSize: '14px', color: '#64748b' }}>months</span>
              </div>
            )}
          </FormGroup>
        </div>
      </CardSection>
      
      {/* Approval & Notifications Section - Full Width */}
      <CardSection isMobile={isMobile} style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Crown size={18} color={colors.blue} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Approvals & Notifications</h3>
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Require Approval Toggle */}
          <div style={{ padding: '16px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Require approval before reservations are confirmed?</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  If yes, an approver must approve each reservation within 7 days, or it will be automatically rejected.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button 
                  onClick={() => update('requireApproval', 'yes')} 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: data.requireApproval === 'yes' ? `2px solid ${colors.green}` : '1px solid rgba(0, 0, 0, 0.1)', 
                    background: data.requireApproval === 'yes' ? `rgba(0, 168, 79, 0.08)` : 'white', 
                    color: data.requireApproval === 'yes' ? colors.green : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  Yes
                </button>
                <button 
                  onClick={() => update('requireApproval', 'no')} 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: data.requireApproval === 'no' ? `2px solid ${colors.blue}` : '1px solid rgba(0, 0, 0, 0.1)', 
                    background: data.requireApproval === 'no' ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: data.requireApproval === 'no' ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          
          {/* Notification Toggle */}
          <div style={{ padding: '16px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color={colors.blue} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Receive notifications when a reservation is submitted?</p>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Get notified when someone submits a reservation for approval. This is separate from confirmation notifications.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button 
                  onClick={() => update('notifyOnBooking', 'yes')} 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: data.notifyOnBooking === 'yes' ? `2px solid ${colors.green}` : '1px solid rgba(0, 0, 0, 0.1)', 
                    background: data.notifyOnBooking === 'yes' ? `rgba(0, 168, 79, 0.08)` : 'white', 
                    color: data.notifyOnBooking === 'yes' ? colors.green : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  Yes
                </button>
                <button 
                  onClick={() => update('notifyOnBooking', 'no')} 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: data.notifyOnBooking === 'no' ? `2px solid ${colors.blue}` : '1px solid rgba(0, 0, 0, 0.1)', 
                    background: data.notifyOnBooking === 'no' ? `rgba(0, 118, 187, 0.08)` : 'white', 
                    color: data.notifyOnBooking === 'no' ? colors.blue : '#64748b', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardSection>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px' }}>
        {/* 1. Booking Increments - First */}
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
        
        {/* 2. Liability Insurance - Second */}
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
        
        {/* 3. Cancellation Policy - Third */}
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
        
        {/* 4. Weather Policy - Fourth */}
        <CardSection isMobile={isMobile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CloudRain size={18} color={colors.blue} />
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
      </div>
      
      {/* Waivers & Agreements */}
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Or Paste Text</p>
            <textarea value={data.waiverText || ''} onChange={(e) => update('waiverText', e.target.value)} style={{ ...textareaStyle, flex: 1, minHeight: '134px' }} placeholder="Paste your waiver or liability release language here..." />
          </div>
        </div>
      </CardSection>
      
      {/* Rental Policy Document */}
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Or Paste Text</p>
            <textarea value={data.facilityAgreement || ''} onChange={(e) => update('facilityAgreement', e.target.value)} style={{ ...textareaStyle, flex: 1, minHeight: '134px' }} placeholder="Paste your facility use policy or rental agreement here..." />
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
    <div id={`space-${locationId}-${assetIndex}`} className="animate-fade-in-up" style={{ background: 'white', borderRadius: '16px', marginBottom: '16px', overflow: 'hidden', transition: 'all 0.3s ease', border: isExpanded ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.1)', boxShadow: isExpanded ? '0 8px 32px rgba(0, 118, 187, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.02)', scrollMarginTop: '120px' }}>
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
          
          {/* Indoor/Outdoor, Square Footage, and Max Capacity */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sun size={16} color={colors.blue} />
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Indoor or Outdoor?</label>
                <span style={{ fontSize: '11px', color: '#ef4444' }}>*</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', height: '46px' }}>
                {[
                  { value: 'indoor', label: 'Indoor' },
                  { value: 'outdoor', label: 'Outdoor' },
                  { value: 'both', label: 'Both' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateAsset(locationId, assetIndex, 'indoorOutdoor', opt.value)}
                    style={{
                      flex: 1,
                      height: '100%',
                      borderRadius: '10px',
                      border: asset.indoorOutdoor === opt.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)',
                      background: asset.indoorOutdoor === opt.value ? 'rgba(0, 118, 187, 0.08)' : 'white',
                      color: asset.indoorOutdoor === opt.value ? colors.blue : '#64748b',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Ruler size={16} color={colors.blue} />
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Estimated Size</label>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '46px' }}>
                <input
                  type="number"
                  value={asset.squareFootage || ''}
                  onChange={(e) => updateAsset(locationId, assetIndex, 'squareFootage', e.target.value)}
                  style={{ ...inputStyle, flex: 1, height: '100%' }}
                  placeholder="e.g., 5000"
                  inputMode="numeric"
                  min="0"
                />
                <span style={{ fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>sq ft</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={16} color={colors.blue} />
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Max Capacity</label>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '46px' }}>
                <input
                  type="number"
                  value={asset.maxCapacity || ''}
                  onChange={(e) => updateAsset(locationId, assetIndex, 'maxCapacity', e.target.value)}
                  style={{ ...inputStyle, flex: 1, height: '100%' }}
                  placeholder="e.g., 100"
                  inputMode="numeric"
                  min="0"
                />
                <span style={{ fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>people</span>
              </div>
            </div>
          </div>
          
          {/* Reservation Types - Add-ons style UI */}
          <div style={{ marginBottom: '20px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.06)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '16px' : '20px', borderBottom: (asset.reservationTypes || []).length > 0 ? '1px solid rgba(0, 118, 187, 0.08)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Tag size={16} color={colors.blue} />
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>Types of Reservations</h5>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>What activities can this space be used for?</p>
            </div>
            
            {/* Selected reservation types summary */}
            {(asset.reservationTypes || []).length > 0 && (
              <div style={{ padding: '12px 16px', background: 'rgba(0, 168, 79, 0.06)', borderBottom: '1px solid rgba(0, 168, 79, 0.1)' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: colors.green }}>
                  {(asset.reservationTypes || []).length} selected
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(asset.reservationTypes || []).map(typeId => {
                    const resType = allReservationTypes.find(t => t.id === typeId);
                    return resType ? (
                      <span key={typeId} style={{ 
                        padding: '4px 8px 4px 10px', 
                        borderRadius: '6px', 
                        background: 'white', 
                        border: '1px solid rgba(0, 168, 79, 0.2)', 
                        fontSize: '12px', 
                        color: '#1e293b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {resType.category}: {resType.name}
                        <button
                          onClick={() => {
                            const newTypes = (asset.reservationTypes || []).filter(t => t !== typeId);
                            updateAsset(locationId, assetIndex, 'reservationTypes', newTypes);
                          }}
                          style={{ width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: 'rgba(0, 0, 0, 0.08)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {/* Categorized reservation types */}
            <div style={{ padding: '0' }}>
              {reservationTypeCategories.map(category => {
                const selectedInCategory = category.types.filter(t => 
                  (asset.reservationTypes || []).includes(t.id)
                ).length;
                const [isOpen, setIsOpen] = React.useState(false);
                
                return (
                  <div key={category.name} style={{ borderBottom: '1px solid rgba(0, 118, 187, 0.06)' }}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{category.name}</span>
                        {selectedInCategory > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(0, 168, 79, 0.1)', color: colors.green, fontSize: '11px', fontWeight: 600 }}>
                            {selectedInCategory}
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {category.types.map(type => {
                          const isSelected = (asset.reservationTypes || []).includes(type.id);
                          return (
                            <label key={type.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: isSelected ? `2px solid ${colors.green}` : '1px solid rgba(0, 0, 0, 0.1)', background: isSelected ? 'rgba(0, 168, 79, 0.06)' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  const newTypes = isSelected 
                                    ? (asset.reservationTypes || []).filter(t => t !== type.id)
                                    : [...(asset.reservationTypes || []), type.id];
                                  updateAsset(locationId, assetIndex, 'reservationTypes', newTypes);
                                }}
                                style={{ width: '16px', height: '16px', accentColor: colors.green }}
                              />
                              <span style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? colors.green : '#334155' }}>{type.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Facility Features - Add-ons style UI */}
          <div style={{ marginBottom: '20px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.06)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '16px' : '20px', borderBottom: (asset.features || []).length > 0 ? '1px solid rgba(0, 118, 187, 0.08)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ListChecks size={16} color={colors.blue} />
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>Facility Features</h5>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>What features does this space have?</p>
            </div>
            
            {/* Selected features summary */}
            {(asset.features || []).length > 0 && (
              <div style={{ padding: '12px 16px', background: 'rgba(0, 118, 187, 0.06)', borderBottom: '1px solid rgba(0, 118, 187, 0.1)' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: colors.blue }}>
                  {(asset.features || []).length} selected
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(asset.features || []).map(featureId => {
                    const feature = allFacilityFeatures.find(f => f.id === featureId);
                    return feature ? (
                      <span key={featureId} style={{ 
                        padding: '4px 8px 4px 10px', 
                        borderRadius: '6px', 
                        background: 'white', 
                        border: '1px solid rgba(0, 118, 187, 0.2)', 
                        fontSize: '12px', 
                        color: '#1e293b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {feature.name}
                        <button
                          onClick={() => {
                            const newFeatures = (asset.features || []).filter(f => f !== featureId);
                            updateAsset(locationId, assetIndex, 'features', newFeatures);
                          }}
                          style={{ width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: 'rgba(0, 0, 0, 0.08)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {/* Categorized features */}
            <div style={{ padding: '0' }}>
              {facilityFeatureCategories.map(category => {
                const selectedInCategory = category.features.filter(f => 
                  (asset.features || []).includes(f.id)
                ).length;
                const [isOpen, setIsOpen] = React.useState(false);
                
                return (
                  <div key={category.name} style={{ borderBottom: '1px solid rgba(0, 118, 187, 0.06)' }}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{category.name}</span>
                        {selectedInCategory > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(0, 118, 187, 0.1)', color: colors.blue, fontSize: '11px', fontWeight: 600 }}>
                            {selectedInCategory}
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {category.features.map(feature => {
                          const isSelected = (asset.features || []).includes(feature.id);
                          return (
                            <label key={feature.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: isSelected ? `2px solid ${colors.blue}` : '1px solid rgba(0, 0, 0, 0.1)', background: isSelected ? 'rgba(0, 118, 187, 0.06)' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  const newFeatures = isSelected 
                                    ? (asset.features || []).filter(f => f !== feature.id)
                                    : [...(asset.features || []), feature.id];
                                  updateAsset(locationId, assetIndex, 'features', newFeatures);
                                }}
                                style={{ width: '16px', height: '16px', accentColor: colors.blue }}
                              />
                              <span style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? colors.blue : '#334155' }}>{feature.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Space Photos */}
          <div style={{ marginBottom: '20px', padding: isMobile ? '16px' : '20px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Camera size={16} color={colors.blue} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                {asset.name ? `Photos of ${asset.name}` : 'Space Photos'}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
            </div>
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
              hideLabel={true}
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
                  <input type="time" value={asset.weekdayAvailability?.start || '15:00'} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...(asset.weekdayAvailability || {}), start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekdayAvailability?.end || '22:00'} onChange={(e) => updateAsset(locationId, assetIndex, 'weekdayAvailability', { ...(asset.weekdayAvailability || {}), end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Weekends (Sat-Sun)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="time" value={asset.weekendAvailability?.start || '08:00'} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...(asset.weekendAvailability || {}), start: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>to</span>
                  <input type="time" value={asset.weekendAvailability?.end || '22:00'} onChange={(e) => updateAsset(locationId, assetIndex, 'weekendAvailability', { ...(asset.weekendAvailability || {}), end: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
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
            
            {/* Additional Availability Notes */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed rgba(0, 118, 187, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Additional Details</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
              <textarea 
                value={asset.availabilityNotes || ''} 
                onChange={(e) => updateAsset(locationId, assetIndex, 'availabilityNotes', e.target.value)}
                style={{ ...inputStyle, minHeight: '70px', resize: 'vertical', fontSize: '13px' }}
                placeholder="Any additional details about availability, seasonal hours, or special scheduling notes for this space..."
              />
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
              {(asset.notifications || []).map((notif, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  {isMobile ? (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="text" value={notif.name} onChange={(e) => updateNotification(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                        <input type="email" value={notif.email} onChange={(e) => updateNotification(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" autoCapitalize="none" />
                      </div>
                      {(asset.notifications || []).length > 1 && <button onClick={() => removeNotification(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', alignSelf: 'start', marginTop: '8px' }}><Trash2 size={16} /></button>}
                    </>
                  ) : (
                    <>
                      <input type="text" value={notif.name} onChange={(e) => updateNotification(locationId, assetIndex, i, 'name', e.target.value)} style={inputStyle} placeholder="Name" />
                      <input type="email" value={notif.email} onChange={(e) => updateNotification(locationId, assetIndex, i, 'email', e.target.value)} style={inputStyle} placeholder="Email" autoCapitalize="none" />
                      {(asset.notifications || []).length > 1 && <button onClick={() => removeNotification(locationId, assetIndex, i)} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={16} /></button>}
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
                    <span 
                      key={a.id} 
                      style={{ 
                        padding: '4px 8px 4px 10px', 
                        borderRadius: '6px', 
                        background: 'white', 
                        border: '1px solid rgba(0, 168, 79, 0.2)', 
                        fontSize: '12px', 
                        color: '#1e293b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {a.name} {a.price && <span style={{ color: colors.green }}>+${a.price}</span>}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newAmenities = asset.amenities.filter(am => am.id !== a.id);
                          updateAsset(locationId, assetIndex, 'amenities', newAmenities.length > 0 ? newAmenities : [{ name: '', price: '', isCustom: true }]);
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(0, 0, 0, 0.08)',
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          marginLeft: '2px',
                          transition: 'all 0.15s'
                        }}
                        title={`Remove ${a.name}`}
                      >
                        <X size={10} />
                      </button>
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

function LocationCard({ location, handlers, canRemove, isMobile, errors, contactInfo, allLocations, onCopySettings, initiallyCollapsed = false, isFirstLocation = false, isHighlighted = false, expandSpaceIndex = null }) {
  const [isExpanded, setIsExpanded] = useState(!initiallyCollapsed || isHighlighted);
  // Start with no space expanded if any spaces were bulk added, otherwise expand first one
  const hasBulkAddedSpaces = location.assets.some(a => a.bulkAdded);
  const [expandedAsset, setExpandedAsset] = useState(hasBulkAddedSpaces ? -1 : (location.assets.length > 0 ? 0 : -1));
  const [contactMode, setContactMode] = useState(null); // null = choosing, 'self' = use own info, 'other' = new contact
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(!initiallyCollapsed);
  const typeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[5];
  const Icon = typeInfo.icon;
  const locationErrors = errors || {};
  
  // Auto-expand when highlighted and expand specific space
  useEffect(() => {
    if (isHighlighted) {
      setIsExpanded(true);
      if (expandSpaceIndex !== null && expandSpaceIndex >= 0) {
        setExpandedAsset(expandSpaceIndex);
        // Scroll to the specific space after a brief delay for expansion animation
        setTimeout(() => {
          const spaceElement = document.getElementById(`space-${location.id}-${expandSpaceIndex}`);
          if (spaceElement) {
            spaceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  }, [isHighlighted, expandSpaceIndex, location.id]);
  
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
      newAsset.bulkAdded = true; // Mark as bulk added to keep collapsed
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
    <div 
      id={`location-${location.id}`}
      className="animate-fade-in-up" 
      style={{ 
        background: 'white', 
        borderRadius: isMobile ? '16px' : '20px', 
        border: isHighlighted ? `3px solid ${colors.blue}` : isLocationComplete ? `2px solid ${colors.green}` : '1px solid rgba(0, 118, 187, 0.1)', 
        marginBottom: isMobile ? '16px' : '24px', 
        overflow: 'hidden', 
        boxShadow: isHighlighted ? `0 0 0 4px rgba(0, 118, 187, 0.15), 0 8px 32px rgba(0, 118, 187, 0.2)` : '0 4px 16px rgba(0, 0, 0, 0.04)', 
        transition: 'all 0.3s ease',
        animation: isHighlighted ? 'highlightPulse 1s ease-out' : undefined
      }}
    >
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Camera size={16} color={colors.blue} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                  {location.name ? `Photos of ${location.name}` : 'Location Photos'}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>Optional</span>
              </div>
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
                hideLabel={true}
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
                {location.assets.length > 0 && (
                  <span style={{ padding: '4px 12px', borderRadius: '100px', background: `rgba(0, 118, 187, 0.1)`, color: colors.blue, fontSize: '12px', fontWeight: 600 }}>{location.assets.length}</span>
                )}
              </div>
              {location.assets.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowBulkAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Layers size={16} />Bulk Add</button>
                  <button onClick={() => handlers.addAsset(location.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: `1px solid rgba(0, 168, 79, 0.3)`, background: `rgba(0, 168, 79, 0.08)`, color: colors.green, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus size={16} />Add Space</button>
                </div>
              )}
            </div>
            
            {/* Empty state for spaces */}
            {location.assets.length === 0 && !showBulkAdd && (
              <div style={{ textAlign: 'center', padding: isMobile ? '32px 20px' : '48px 40px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: '2px dashed rgba(0, 118, 187, 0.2)', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0, 118, 187, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Building2 size={28} color={colors.blue} />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Add your rentable spaces</h4>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
                  What spaces can people rent here? Gyms, fields, meeting rooms, auditoriums, etc.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => handlers.addAsset(location.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 118, 187, 0.25)' }}>
                    <Plus size={18} />
                    Add a Space
                  </button>
                  <button onClick={() => setShowBulkAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    <Layers size={18} />
                    Bulk Add
                  </button>
                </div>
              </div>
            )}
            
            {/* Copy settings from another location */}
            {otherLocations.length > 0 && location.assets.length > 0 && (
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

function LocationsStep({ locations, setLocations, isMobile, errors, contactInfo, highlightedLocationId, expandSpaceIndex, onOpenTableEditor }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddLocations, setShowBulkAddLocations] = useState(false);
  const [bulkLocationNames, setBulkLocationNames] = useState('');
  const [bulkLocationType, setBulkLocationType] = useState('school');

  const handleBulkAddLocations = () => {
    const names = bulkLocationNames.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length === 0) return;
    
    const newLocations = names.map(name => ({
      ...createEmptyLocation(bulkLocationType),
      name: name,
      bulkAdded: true, // Mark as bulk added to keep collapsed
    }));
    
    setLocations(prev => [...prev, ...newLocations]);
    setBulkLocationNames('');
    setShowBulkAddLocations(false);
  };

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
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={onOpenTableEditor} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 118, 187, 0.25)' }}>
              <Table size={16} />
              Quick Edit All
            </button>
            <button onClick={() => setShowBulkAddLocations(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0, 118, 187, 0.2)', background: 'white', color: colors.blue, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}><Layers size={16} />Bulk Add</button>
            <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: '1px solid rgba(0, 168, 79, 0.3)', background: 'rgba(0, 168, 79, 0.08)', color: colors.green, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}><Plus size={18} />Add Location</button>
          </div>
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
      
      {/* Bulk Add Locations Modal */}
      {showBulkAddLocations && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 1000, padding: isMobile ? 0 : '20px' }} onClick={() => setShowBulkAddLocations(false)}>
          <div onClick={(e) => e.stopPropagation()} className={isMobile ? 'animate-fade-in-up' : 'animate-scale-in'} style={{ 
            background: 'white', 
            borderRadius: isMobile ? '20px 20px 0 0' : '20px', 
            padding: isMobile ? '20px 20px 32px' : '32px', 
            width: isMobile ? '100%' : '480px',
            maxHeight: isMobile ? '85vh' : '90vh', 
            overflow: 'auto',
            boxShadow: isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {isMobile && (
              <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? '20px' : '22px', fontWeight: 700, color: '#0f172a' }}>Add Multiple Locations</h3>
              <button onClick={() => setShowBulkAddLocations(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} color="#64748b" /></button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b' }}>Enter one location name per line. You can add spaces and details to each location after.</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Location Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {locationTypes.map(type => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setBulkLocationType(type.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: bulkLocationType === type.value ? `2px solid ${colors.blue}` : '1px solid rgba(0, 118, 187, 0.15)',
                        background: bulkLocationType === type.value ? 'rgba(0, 118, 187, 0.08)' : 'white',
                        color: bulkLocationType === type.value ? colors.blue : '#64748b',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <TypeIcon size={14} />
                      {type.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Location Names</label>
              <textarea 
                value={bulkLocationNames}
                onChange={(e) => setBulkLocationNames(e.target.value)}
                placeholder={"Lincoln High School\nWashington Middle School\nJefferson Elementary\nCommunity Center"}
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94a3b8' }}>One location per line</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowBulkAddLocations(false)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={handleBulkAddLocations} 
                disabled={!bulkLocationNames.trim()} 
                style={{ 
                  flex: 1, 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: bulkLocationNames.trim() ? `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)` : '#e2e8f0', 
                  color: bulkLocationNames.trim() ? 'white' : '#94a3b8', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  cursor: bulkLocationNames.trim() ? 'pointer' : 'default',
                  boxShadow: bulkLocationNames.trim() ? '0 4px 16px rgba(0, 118, 187, 0.25)' : 'none'
                }}
              >
                Add {bulkLocationNames.split('\n').filter(n => n.trim()).length || 0} Locations
              </button>
            </div>
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
          initiallyCollapsed={location.bulkAdded === true}
          isFirstLocation={idx === 0}
          isHighlighted={highlightedLocationId === location.id}
          expandSpaceIndex={highlightedLocationId === location.id ? expandSpaceIndex : null}
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
  const [policies, setPolicies] = useState({ 
    goLiveDate: '', 
    bookingWindowMonths: '3', 
    requireApproval: 'yes', 
    notifyOnBooking: 'yes',
    cancellationDays: '7', 
    weatherRefund: 'yes', 
    requireInsurance: 'yes', 
    waiverText: '', 
    facilityAgreement: '', 
    timeIncrement: '60' 
  });
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [highlightedLocationId, setHighlightedLocationId] = useState(null);
  const [expandSpaceIndex, setExpandSpaceIndex] = useState(null);
  const [showResumeDraftModal, setShowResumeDraftModal] = useState(false);
  const [savedDraftDate, setSavedDraftDate] = useState(null);
  const [pendingDraftData, setPendingDraftData] = useState(null);
  
  // Calculate overall completion score
  const overallScore = locations.length > 0 
    ? Math.round(locations.reduce((sum, loc) => sum + calculateCompletionScore(loc).score, 0) / locations.length)
    : 0;
  
  const incompleteCount = locations.filter(loc => calculateCompletionScore(loc).required < 100).length;
  
  // Auto-save to localStorage with interval backup
  useEffect(() => {
    if (currentStep === 0) return; // Don't save on welcome screen
    
    const saveData = () => {
      setIsSaving(true);
      const now = new Date();
      const data = { contactInfo, policies, locations, currentStep, savedAt: now.toISOString() };
      try {
        localStorage.setItem('practiceplan_draft', JSON.stringify(data));
        setLastSaved(now);
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
      setTimeout(() => setIsSaving(false), 500);
    };
    
    // Debounced save on changes
    const timer = setTimeout(saveData, 1000);
    
    // Also save every 30 seconds as backup
    const intervalTimer = setInterval(saveData, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(intervalTimer);
    };
  }, [contactInfo, policies, locations, currentStep]);
  
  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep > 0 && !submitSuccess) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, submitSuccess]);
  
  // Check for saved draft on mount and show resume modal
  useEffect(() => {
    try {
      const saved = localStorage.getItem('practiceplan_draft');
      if (saved) {
        const data = JSON.parse(saved);
        // Only show modal if there's meaningful data
        const hasData = data.contactInfo?.fullName || data.locations?.length > 0;
        if (hasData && data.savedAt) {
          const savedDate = new Date(data.savedAt);
          setSavedDraftDate(savedDate.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }));
          setPendingDraftData(data);
          setShowResumeDraftModal(true);
        } else if (hasData) {
          // Legacy draft without date - just load it
          if (data.contactInfo) setContactInfo(data.contactInfo);
          if (data.policies) setPolicies(data.policies);
          if (data.locations) setLocations(data.locations);
          if (data.currentStep) setCurrentStep(data.currentStep);
          setLastSaved(new Date());
        }
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);
  
  const handleResumeDraft = () => {
    if (pendingDraftData) {
      if (pendingDraftData.contactInfo) setContactInfo(pendingDraftData.contactInfo);
      if (pendingDraftData.policies) setPolicies(pendingDraftData.policies);
      if (pendingDraftData.locations) setLocations(pendingDraftData.locations);
      if (pendingDraftData.currentStep) setCurrentStep(pendingDraftData.currentStep);
      setLastSaved(new Date());
    }
    setShowResumeDraftModal(false);
    setPendingDraftData(null);
  };
  
  const handleStartFresh = () => {
    localStorage.removeItem('practiceplan_draft');
    setShowResumeDraftModal(false);
    setPendingDraftData(null);
  };
  
  const updateContactInfo = (field, value) => { setContactInfo(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, contact: { ...prev.contact, [field]: undefined } })); };
  const updatePolicies = (field, value) => setPolicies(prev => ({ ...prev, [field]: value }));
  
  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear the form? All entered data will be lost.')) {
      setContactInfo({ fullName: '', jobTitle: '', organization: '', email: '', phone: '' });
      setPolicies({ 
        goLiveDate: '', 
        bookingWindowMonths: '3', 
        requireApproval: 'yes', 
        notifyOnBooking: 'yes',
        cancellationDays: '7', 
        weatherRefund: 'yes', 
        requireInsurance: 'yes', 
        waiverText: '', 
        facilityAgreement: '', 
        timeIncrement: '60' 
      });
      setLocations([]);
      setErrors({});
      setCurrentStep(0);
      setLastSaved(null);
      localStorage.removeItem('practiceplan_draft');
    }
  };
  
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

  // Handle clicking a location from the overview panel
  const handleOverviewLocationClick = (locationId, spaceIndex = null) => {
    setOverviewOpen(false);
    
    // Navigate to Locations step if not already there
    if (currentStep !== 3) {
      setCurrentStep(3);
    }
    
    // Set the space to expand (can be null for just location, or a number for specific space)
    setExpandSpaceIndex(spaceIndex);
    
    // Highlight the location and scroll to it after a brief delay
    setTimeout(() => {
      setHighlightedLocationId(locationId);
      const locationElement = document.getElementById(`location-${locationId}`);
      if (locationElement) {
        locationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedLocationId(null);
        setExpandSpaceIndex(null);
      }, 2000);
    }, 100);
  };

  // File upload constraints
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const ALLOWED_DOC_TYPES = ['application/pdf'];

  const compressImage = async (base64Data, maxWidth = 1600, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = base64Data;
    });
  };

  const submitToGoogleForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Build the full data payload WITH file data
      const fullData = { 
        contactInfo, 
        policies, 
        locations, 
        submittedAt: new Date().toISOString()
      };
      
      // Check payload size
      const payloadStr = JSON.stringify(fullData);
      const payloadSize = new Blob([payloadStr]).size;
      const payloadMB = (payloadSize / 1024 / 1024).toFixed(1);
      
      console.log('Payload size:', payloadMB, 'MB');
      
      if (payloadSize > MAX_TOTAL_SIZE) {
        alert(`Your uploaded files are too large (${payloadMB}MB). Please reduce file sizes or upload fewer files. Maximum total is 20MB.`);
        setIsSubmitting(false);
        return;
      }
      
      // Use form POST method
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = APPS_SCRIPT_URL;
      form.target = 'hidden_iframe';
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'data';
      input.value = payloadStr;
      form.appendChild(input);
      
      // Create hidden iframe to receive response
      let iframe = document.getElementById('hidden_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.id = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      // Wait for submission to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      localStorage.removeItem('practiceplan_draft');
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
        @keyframes highlightPulse { 0% { box-shadow: 0 0 0 4px rgba(0, 118, 187, 0.4), 0 8px 32px rgba(0, 118, 187, 0.3); } 100% { box-shadow: 0 0 0 4px rgba(0, 118, 187, 0.15), 0 8px 32px rgba(0, 118, 187, 0.2); } }
        
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
        <header style={{ padding: isMobile ? '12px 20px' : '20px 48px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PracticePlanLogo width={isMobile ? 160 : 220} />
          </div>
        </header>
        {currentStep > 0 && isMobile && !submitSuccess && (
          <MobileProgressBar 
            currentStep={currentStep} 
            totalSteps={steps.length - 1} 
            onViewProgress={() => setOverviewOpen(true)}
            showViewProgress={currentStep >= 2 && currentStep <= 4}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
        )}
        {currentStep > 0 && !isMobile && !submitSuccess && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 48px 32px' }}>
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
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(40px)', borderRadius: isMobile ? '20px' : '24px', border: '1px solid rgba(0, 118, 187, 0.08)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 12px 48px rgba(0, 118, 187, 0.06)', overflow: 'hidden', position: 'relative' }}>
            {/* Desktop Actions Bar - top right of card (Saved indicator and Clear only - Progress is in edge tab) */}
            {!isMobile && currentStep > 0 && !submitSuccess && (
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                zIndex: 10
              }}>
                {lastSaved && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    padding: '6px 10px', 
                    borderRadius: '6px', 
                    background: isSaving ? 'rgba(0, 118, 187, 0.08)' : 'rgba(0, 168, 79, 0.08)', 
                    transition: 'all 0.3s', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {isSaving ? (
                      <div style={{ width: '10px', height: '10px', border: '2px solid rgba(0, 118, 187, 0.3)', borderTopColor: colors.blue, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Check size={12} color={colors.green} />
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 500, color: isSaving ? colors.blue : colors.green }}>{isSaving ? 'Saving' : 'Saved'}</span>
                  </div>
                )}
                <button 
                  onClick={clearForm}
                  title="Clear form and start over"
                  style={{ 
                    padding: '6px 8px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(0, 0, 0, 0.08)', 
                    background: 'white', 
                    color: '#94a3b8', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
            <div key={currentStep} className="animate-fade-in-up" style={{ padding: isMobile ? (currentStep === 0 ? '32px 20px' : '24px 20px') : (currentStep === 0 ? '60px 48px' : '48px') }}>
              {currentStep === 0 && <WelcomeStep onContinue={nextStep} isMobile={isMobile} />}
              {currentStep === 1 && <ContactInfoStep data={contactInfo} update={updateContactInfo} errors={errors.contact || {}} isMobile={isMobile} />}
              {currentStep === 2 && <PoliciesStep data={policies} update={updatePolicies} isMobile={isMobile} />}
              {currentStep === 3 && <LocationsStep locations={locations} setLocations={setLocations} isMobile={isMobile} errors={errors.locations} contactInfo={contactInfo} highlightedLocationId={highlightedLocationId} expandSpaceIndex={expandSpaceIndex} onOpenTableEditor={() => setOverviewOpen(true)} />}
              {currentStep === 4 && !submitSuccess && <ReviewStep policies={policies} locations={locations} contactInfo={contactInfo} isMobile={isMobile} />}
              {currentStep === 4 && submitSuccess && (
                <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 40px' }}>
                  {/* Confetti-like decorative elements */}
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}>
                    <div style={{ position: 'absolute', top: '-20px', left: '-30px', width: '12px', height: '12px', borderRadius: '50%', background: colors.blue, opacity: 0.6, animation: 'fadeInUp 0.6s ease-out' }} />
                    <div style={{ position: 'absolute', top: '10px', right: '-25px', width: '8px', height: '8px', borderRadius: '50%', background: colors.green, opacity: 0.7, animation: 'fadeInUp 0.8s ease-out' }} />
                    <div style={{ position: 'absolute', bottom: '-10px', left: '-20px', width: '10px', height: '10px', borderRadius: '2px', background: colors.greenLight, opacity: 0.5, transform: 'rotate(45deg)', animation: 'fadeInUp 0.7s ease-out' }} />
                    <div style={{ position: 'absolute', bottom: '20px', right: '-35px', width: '14px', height: '14px', borderRadius: '3px', background: colors.blueLight, opacity: 0.5, transform: 'rotate(30deg)', animation: 'fadeInUp 0.9s ease-out' }} />
                    <div className="animate-success-pulse" style={{ width: isMobile ? '80px' : '100px', height: isMobile ? '80px' : '100px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 48px rgba(0, 168, 79, 0.35)' }}>
                      <AnimatedCheck size={isMobile ? 40 : 50} color="white" />
                    </div>
                  </div>
                  
                  <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: isMobile ? '28px' : '36px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.green} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>You're All Set!</h2>
                  
                  <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#64748b', margin: '0 0 32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
                    Thanks for submitting your facility information, {contactInfo.fullName?.split(' ')[0] || 'there'}! Our team will review everything and get your dashboard ready.
                  </p>
                  
                  {/* Summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
                    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: colors.blue }}>{locations.length}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Location{locations.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0, 168, 79, 0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: colors.green }}>{locations.reduce((sum, loc) => sum + loc.assets.length, 0)}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Rentable Space{locations.reduce((sum, loc) => sum + loc.assets.length, 0) !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0, 118, 187, 0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: colors.blue }}>
                        <Check size={28} style={{ verticalAlign: 'middle' }} />
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Ready to Go</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '20px', background: 'rgba(0, 118, 187, 0.04)', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px' }}>
                      <strong style={{ color: '#334155' }}>What happens next?</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                      We'll reach out to you at <strong style={{ color: colors.blue }}>{contactInfo.email}</strong> about next steps once your dashboard is ready.
                    </p>
                  </div>
                  
                  <div style={{ marginTop: '24px', padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.06)', maxWidth: '500px', margin: '24px auto 0' }}>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Questions? Contact</p>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: '0 0 4px' }}>Jessica DiFiore</p>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>Client Success</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      <a href="mailto:jessica.difiore@practiceplan.io" style={{ color: colors.blue, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>jessica.difiore@practiceplan.io</a>
                      <a href="tel:9725040255" style={{ color: colors.blue, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>972.504.0255</a>
                    </div>
                  </div>
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
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      Skip for now
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
                {/* Skip option for Policies step */}
                {currentStep === 2 && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <button 
                      onClick={() => { setCurrentStep(3); window.scrollTo(0, 0); }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      Skip for now
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
                {/* Skip option for Locations step */}
                {currentStep === 3 && (
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <button 
                      onClick={() => { setCurrentStep(4); window.scrollTo(0, 0); }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      Skip for now
                      <ChevronRight size={14} />
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
      
      {/* Desktop Edge Tab - only show on steps 2-4, not mobile */}
      {!isMobile && currentStep >= 2 && currentStep <= 4 && !submitSuccess && (
        <ProgressEdgeTab 
          onClick={() => setOverviewOpen(true)}
          incompleteCount={incompleteCount}
          overallScore={overallScore}
        />
      )}
      
      {/* Overview Panel */}
      <OverviewPanel 
        isOpen={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        locations={locations}
        setLocations={setLocations}
        onLocationClick={handleOverviewLocationClick}
        isMobile={isMobile}
        onClearForm={clearForm}
        policies={policies}
        contactInfo={contactInfo}
      />
      
      {/* Resume Draft Modal */}
      {showResumeDraftModal && (
        <ResumeDraftModal 
          savedDate={savedDraftDate}
          onResume={handleResumeDraft}
          onStartFresh={handleStartFresh}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
