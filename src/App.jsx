import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays, AlignJustify,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Trash2
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const SC = {
  name: "YOGA",
  subtitle: "REFUGE",
  tagline: "Find your refuge.",
  logoMark: "Y",
  description: "A welcoming Portland community with two homes: the Montavilla loft and historic NW chapel.",
  heroLine1: "YOGA",
  heroLine2: "REFUGE",
  address: { street: "7831 SE Stark St, Ste 300", city: "Portland", state: "OR", zip: "97215" },
  phone: "(702) 907-7831",
  email: "info@yogarefugepdx.com",
  website: "https://yogarefugepdx.com",
  social: { instagram: "@yogarefugepdx" },
  locations: [
    { id: "se", name: "SE Montavilla", short: "SE", address: "7831 SE Stark St, Ste 300", desc: "Spacious 3rd-floor loft with plants, hardwood floors, and natural light" },
    { id: "nw", name: "NW Chapel", short: "NW", address: "210 NW 17th Ave", desc: "Historic chapel next to St. Mary's Cathedral with stained glass windows" },
  ],
  theme: {
    accent:     { h: 155, s: 35, l: 40 },
    accentAlt:  { h: 18,  s: 50, l: 55 },
    warning:    { h: 38,  s: 55, l: 50 },
    primary:    { h: 160, s: 18, l: 10 },
    surface:    { h: 150, s: 12, l: 96 },
    surfaceDim: { h: 150, s: 8,  l: 92 },
  },
  classCapacity: 20,
  specialtyCapacity: 12,
};

const IMG = {
  home: "https://images.squarespace-cdn.com/content/v1/619a8b644bcdab2f25b15650/ecce67fd-681f-4ea5-903e-cd0fffabb3c6/YR_main_01a.jpg?format=1500w",
  classes: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1500&auto=format&fit=crop",
  schedule: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1500&auto=format&fit=crop",
  practice: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1500&auto=format&fit=crop",
  community: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1500&auto=format&fit=crop",
  teachers: "https://images.squarespace-cdn.com/content/v1/619a8b644bcdab2f25b15650/296d91a0-bfd9-4be4-8c7a-ef4c5f2424ce/YR_About.jpg?format=1500w",
  events: "https://images.squarespace-cdn.com/content/v1/619a8b644bcdab2f25b15650/501eab91-9b09-41c6-9112-94dedf512e76/SUNSET_YOGA.webp?format=1500w",
  membership: "https://images.squarespace-cdn.com/content/v1/619a8b644bcdab2f25b15650/c264515e-53c6-464b-b4b4-dd6f66a1c7e9/TERRACE.webp?format=1500w",
};

const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslS = (c, ls) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + ls))}%)`;
const T = {
  accent: hsl(SC.theme.accent), accentDark: hslS(SC.theme.accent, -14), accentLight: hslS(SC.theme.accent, 28),
  accentGhost: hsl(SC.theme.accent, 0.08), accentBorder: hsl(SC.theme.accent, 0.2),
  success: hsl(SC.theme.accentAlt), successGhost: hsl(SC.theme.accentAlt, 0.08), successBorder: hsl(SC.theme.accentAlt, 0.18),
  warning: hsl(SC.theme.warning), warningGhost: hsl(SC.theme.warning, 0.08), warningBorder: hsl(SC.theme.warning, 0.2),
  bg: hsl(SC.theme.primary), bgCard: hsl(SC.theme.surface), bgDim: hsl(SC.theme.surfaceDim),
  text: "#1e2a22", textMuted: "#607060", textFaint: "#8a9a8e", border: "#ccd8ce", borderLight: "#dce8de",
};
const DF = "'Lora', serif";

const today = new Date().toISOString().split("T")[0];
const offD = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const fmtDS = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtT = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

const TEACHERS = [
  { id: "t1", firstName: "Danielle", lastName: "C.", role: "Owner & Teacher", certs: ["200-hr YTT", "Yoga Conservatory"], specialties: ["Restorative", "Gentle Yoga", "Community Stewardship"], yearsTeaching: 7, bio: "Danielle is the owner and steward of Yoga Refuge, taking over in October 2020. Her approach is anchored in five core values: Integrity, Accessibility, Empowerment, Community, and Co-creation." },
  { id: "t2", firstName: "Heather", lastName: "Shaw", role: "Lead Teacher & Trainer", certs: ["E-RYT-500", "Trauma-Informed", "Contemplative Psychotherapy"], specialties: ["Hatha", "Somatics", "Breathwork", "Meditation"], yearsTeaching: 20, bio: "Heather is a highly experienced, trauma-informed yoga teacher with a background in dance and choreography, steeped in Tibetan Buddhism and Western psychotherapy." },
  { id: "t3", firstName: "Kat", lastName: "M.", role: "Teacher & Certified Rolfer", certs: ["200-hr YTT", "Certified Rolfer"], specialties: ["Hatha Flow", "Embodied Movement", "1-on-1 Instruction"], yearsTeaching: 8, bio: "Kat has been a yoga teacher and movement instructor since 2017. A Certified Rolfer, she helps clients move better and feel better in their bodies." },
  { id: "t4", firstName: "Richelle", lastName: "D.", role: "Teacher & Anatomy Specialist", certs: ["E-RYT-500", "Anatomy & Kinesiology"], specialties: ["Vinyasa Flow", "Alignment", "Teacher Training"], yearsTeaching: 20, bio: "Richelle is an educator, bodyworker, and movement specialist who has been teaching yoga teachers about anatomy and kinesiology since 2008." },
  { id: "t5", firstName: "Emily", lastName: "Light", role: "Teacher", certs: ["RYT-200", "Ceremonial Arts"], specialties: ["Vinyasa Flow", "Hatha", "Ceremony"], yearsTeaching: 10, bio: "Emily is a musician, ceremonialist, and yoga instructor. She guides with playful curiosity and a trauma-informed approach." },
  { id: "t6", firstName: "Jenna", lastName: "Darfler", role: "Teacher", certs: ["RYT-200"], specialties: ["Gentle Yoga", "Yin", "Meditation"], yearsTeaching: 5, bio: "Jenna brings a gentle, grounded presence to her teaching. Her classes create space for quiet reflection and deep release." },
  { id: "t7", firstName: "Amanda", lastName: "Jensen", role: "Teacher", certs: ["RYT-200", "Prenatal/Postnatal"], specialties: ["Prenatal", "Postnatal", "Hatha Flow"], yearsTeaching: 6, bio: "Amanda specializes in supporting students through the journey of pregnancy and early parenthood." },
  { id: "t8", firstName: "Laura", lastName: "Li Fong Yee", role: "Sound Healing Practitioner", certs: ["Gong Practitioner", "Sound Healing"], specialties: ["Gong Sound Bath", "Sound Healing", "Meditation"], yearsTeaching: 8, bio: "Laura leads Yoga Refuge's immersive Gong Sound Baths, creating meditative experiences through gong vibrations and complementary healing instruments." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hatha Flow", type: "HATHA", style: "SE Montavilla", duration: 60, location: "se",
  description: "A balanced practice linking breath with mindful movement. Standing and floor poses with emphasis on alignment, strength, and presence.",
  intention: "We provide the space. You provide the presence. Together, we find refuge.",
  teacherTip: "All classes are offered at room temperature. Beginners always welcome.",
};

const PAST_PRACTICES = [
  { id: "p1", date: offD(-1), name: "Vinyasa Flow", type: "VINYASA", style: "NW Chapel", duration: 60, location: "nw", description: "Breath-linked flowing sequences building heat, strength, and focus. The stained glass light of the chapel creates a one-of-a-kind practice atmosphere.", intention: "Move with your breath. Let the light move through you." },
  { id: "p2", date: offD(-2), name: "Yin Yoga", type: "YIN", style: "SE Montavilla", duration: 75, location: "se", description: "Long-held, passive poses targeting deep connective tissues. Supported by props, held in stillness.", intention: "Stillness is not the absence of movement. It is the presence of peace." },
  { id: "p3", date: offD(-3), name: "Gentle Yoga", type: "GENTLE", style: "NW Chapel", duration: 60, location: "nw", description: "Slow, accessible movement with emphasis on breath awareness and stress relief. Perfect for beginners.", intention: "There is no wrong way to be here. Your body knows what it needs." },
];

const UPCOMING_PRACTICE = { id: "p-next", date: offD(1), name: "Restorative", type: "RESTORATIVE", style: "SE Montavilla", duration: 75, location: "se", description: "Fully supported poses held for extended periods using bolsters, blankets, and blocks. A practice of complete surrender.", intention: "Rest is not a reward. It is a practice. It is medicine.", teacherTip: "Grab every prop you can. More is more in restorative." };

const CLASSES_TODAY = [
  { id: "cl1", time: "09:15", type: "Hatha Flow", coach: "Kat M.", capacity: 20, registered: 16, waitlist: 0, location: "se" },
  { id: "cl2", time: "10:15", type: "Gentle Yoga", coach: "Danielle C.", capacity: 20, registered: 14, waitlist: 0, location: "nw" },
  { id: "cl3", time: "12:00", type: "Vinyasa Flow", coach: "Emily Light", capacity: 20, registered: 18, waitlist: 0, location: "se" },
  { id: "cl4", time: "16:00", type: "Prenatal Yoga", coach: "Amanda Jensen", capacity: 12, registered: 8, waitlist: 0, location: "se" },
  { id: "cl5", time: "17:30", type: "Hatha", coach: "Heather Shaw", capacity: 20, registered: 20, waitlist: 4, location: "nw" },
  { id: "cl6", time: "19:00", type: "Yin Yoga", coach: "Jenna Darfler", capacity: 20, registered: 15, waitlist: 0, location: "se" },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "09:15", type: "Hatha Flow", coach: "Kat", loc: "SE" }, { time: "10:15", type: "Gentle Yoga", coach: "Danielle", loc: "NW" }, { time: "12:00", type: "Vinyasa Flow", coach: "Emily", loc: "SE" }, { time: "16:00", type: "Prenatal", coach: "Amanda", loc: "SE" }, { time: "17:30", type: "Hatha", coach: "Heather", loc: "NW" }, { time: "19:00", type: "Yin", coach: "Jenna", loc: "SE" }] },
  { day: "Tuesday", classes: [{ time: "10:15", type: "Hatha", coach: "Heather", loc: "SE" }, { time: "12:00", type: "Gentle Yoga", coach: "Danielle", loc: "NW" }, { time: "17:30", type: "Vinyasa Flow", coach: "Richelle", loc: "SE" }, { time: "19:00", type: "Restorative", coach: "Danielle", loc: "SE" }] },
  { day: "Wednesday", classes: [{ time: "09:15", type: "Hatha Flow", coach: "Kat", loc: "SE" }, { time: "10:15", type: "Vinyasa Flow", coach: "Emily", loc: "NW" }, { time: "12:00", type: "Gentle Yoga", coach: "Jenna", loc: "SE" }, { time: "17:30", type: "Hatha", coach: "Richelle", loc: "NW" }, { time: "19:00", type: "Meditation", coach: "Heather", loc: "SE" }] },
  { day: "Thursday", classes: [{ time: "10:15", type: "Hatha Flow", coach: "Kat", loc: "SE" }, { time: "12:00", type: "Vinyasa Flow", coach: "Emily", loc: "NW" }, { time: "16:00", type: "Postnatal", coach: "Amanda", loc: "SE" }, { time: "17:30", type: "Yin", coach: "Jenna", loc: "SE" }, { time: "19:00", type: "Gentle Yoga", coach: "Danielle", loc: "NW" }] },
  { day: "Friday", classes: [{ time: "11:45", type: "Hatha", coach: "Heather", loc: "SE" }, { time: "16:00", type: "Restorative", coach: "Danielle", loc: "NW" }] },
  { day: "Saturday", classes: [{ time: "09:30", type: "Vinyasa Flow", coach: "Richelle", loc: "SE" }, { time: "10:00", type: "Hatha Flow", coach: "Kat", loc: "NW" }] },
  { day: "Sunday", classes: [{ time: "10:15", type: "Gentle Yoga", coach: "Danielle", loc: "SE" }, { time: "12:00", type: "Hatha", coach: "Heather", loc: "NW" }, { time: "15:00", type: "Yoga 101", coach: "Kat", loc: "SE" }, { time: "17:00", type: "Yin", coach: "Jenna", loc: "SE" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Maya R.", milestone: "100 Classes", message: "One hundred classes between the Montavilla loft and the NW chapel. Both spaces feel like home now.", date: today, celebrations: 38 },
  { id: "cf2", user: "James T.", milestone: "30-Day Streak", message: "30 consecutive days. Heather's Hatha on Thursday evenings in the chapel with the stained glass light -- that's the one that changed everything.", date: today, celebrations: 24 },
  { id: "cf3", user: "Sofia M.", milestone: "First Sound Bath!", message: "Laura's Gong Sound Bath was transcendent. I didn't know vibrations could move through you like that.", date: offD(-1), celebrations: 31 },
  { id: "cf4", user: "Rachel K.", milestone: "Yoga 101 Graduate", message: "Finished the Yoga 101 series with Kat and I finally feel at home on my mat.", date: offD(-2), celebrations: 45 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent }, "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent }, "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning }, "30-Day Streak": { icon: Sparkles, color: T.warning },
  "Both Studios": { icon: MapPin, color: "#6b7eab" }, "Sound Bath": { icon: Music, color: "#7c6eab" },
  "Yoga 101 Grad": { icon: Award, color: T.success }, "1 Year Member": { icon: Star, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Gong Sound Bath with Laura", date: offD(6), startTime: "18:30", type: "Sound Bath", location: "se", description: "A meditative immersion in the sounds and vibrations of Gong, complemented by other healing instruments.", fee: 35, maxParticipants: 18, registered: 14, status: "Almost Full" },
  { id: "ev2", name: "Yoga 101: 6-Week Beginner Series", date: offD(10), startTime: "15:00", type: "Series", location: "se", description: "A comprehensive introduction to yoga for complete beginners. Learn foundational poses, breathing techniques, and meditation practices.", fee: 120, maxParticipants: 12, registered: 8, status: "Registration Open" },
  { id: "ev3", name: "Mar de Jade Retreat -- Mexico", date: "2026-06-15", startTime: "00:00", type: "Retreat", location: "offsite", description: "Spring 2026 retreat at Mar de Jade on the Pacific coast of Mexico. Daily yoga, meditation, oceanside restoration.", fee: 2200, maxParticipants: 16, registered: 10, status: "6 Spots Left" },
  { id: "ev4", name: "Take Root: 200-Hour Teacher Training", date: "2026-09-01", startTime: "18:00", type: "Training", location: "se", description: "Led by Danielle, Heather, Kat, and Richelle with guest teachers. A deeply intentional program meeting Yoga Alliance standards.", fee: 3200, maxParticipants: 14, registered: 6, status: "Applications Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m0", name: "New Student Special", type: "intro", price: 59, period: "30 days", features: ["Unlimited classes for 30 days", "Both studio locations + Zoom", "New students only"], popular: false },
  { id: "m1", name: "Drop-In", type: "drop-in", price: 25, period: "per class", features: ["Single studio class", "Online drop-in: $15", "Any class, any location"], popular: false },
  { id: "m2", name: "5 Class Card", type: "pack", price: 110, period: "5 classes", features: ["5 class credits", "Valid for 3 months", "Both locations + Zoom"], popular: false },
  { id: "m3", name: "10 Class Card", type: "pack", price: 185, period: "10 classes", features: ["10 class credits", "Valid for 6 months", "Best per-class value"], popular: false },
  { id: "m4", name: "Root", type: "monthly", price: 75, period: "/month", features: ["5 classes per month", "Guest pass option (use 1 of 5)", "10% off workshops + retail"], popular: false },
  { id: "m5", name: "Bloom", type: "unlimited", price: 108, period: "/month", features: ["Unlimited studio classes", "Free guest pass monthly", "10% off workshops + retail", "Both locations + Zoom", "Cancel anytime after 1 month"], popular: true },
  { id: "m6", name: "Annual", type: "annual", price: 1080, period: "/year", features: ["Unlimited studio classes", "Free guest pass monthly", "10% off workshops + retail", "Best annual value"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Mar de Jade Retreat -- Spring 2026", message: "Pacific coast of Mexico. Daily yoga, meditation, oceanside restoration. 6 spots remaining.", type: "celebration", pinned: true },
  { id: "a2", title: "Partial Scholarships Available", message: "20% discount for students, seniors 65+, BIPOC, working artists, and teachers. Yoga should be accessible to everyone.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "m1", name: "Maya Rodriguez", email: "maya@email.com", membership: "Bloom", status: "active", joined: "2022-08-01", checkIns: 242, lastVisit: today, location: "Both" },
  { id: "m2", name: "James Tran", email: "james@email.com", membership: "Bloom", status: "active", joined: "2023-11-01", checkIns: 168, lastVisit: offD(-1), location: "NW" },
  { id: "m3", name: "Sofia Morales", email: "sofia@email.com", membership: "Bloom", status: "active", joined: "2024-06-01", checkIns: 94, lastVisit: today, location: "SE" },
  { id: "m4", name: "Rachel Kim", email: "rachel@email.com", membership: "Root", status: "active", joined: "2025-02-01", checkIns: 32, lastVisit: offD(-3), location: "SE" },
  { id: "m5", name: "David Chen", email: "david@email.com", membership: "10 Class", status: "active", joined: "2025-10-01", checkIns: 6, lastVisit: offD(-7), location: "NW" },
  { id: "m6", name: "Anna Wells", email: "anna@email.com", membership: "Annual", status: "active", joined: "2024-01-01", checkIns: 188, lastVisit: today, location: "Both" },
  { id: "m7", name: "Tom Park", email: "tom@email.com", membership: "Bloom", status: "frozen", joined: "2024-04-01", checkIns: 78, lastVisit: offD(-28), location: "SE" },
];

const ADMIN_METRICS = { activeMembers: 156, memberChange: 11, todayCheckIns: 52, weekCheckIns: 298, monthlyRevenue: 18600, revenueChange: 7.4, workshopRevenue: 2400, scholarships: 12 };
const ADMIN_CHARTS = {
  attendance: [{ day: "Mon", SE: 32, NW: 20 }, { day: "Tue", SE: 24, NW: 14 }, { day: "Wed", SE: 28, NW: 18 }, { day: "Thu", SE: 26, NW: 16 }, { day: "Fri", SE: 14, NW: 10 }, { day: "Sat", SE: 16, NW: 12 }, { day: "Sun", SE: 22, NW: 14 }],
  revenue: [{ month: "Oct", revenue: 15200 }, { month: "Nov", revenue: 16100 }, { month: "Dec", revenue: 15800 }, { month: "Jan", revenue: 17200 }, { month: "Feb", revenue: 17800 }, { month: "Mar", revenue: 18600 }],
  membershipBreakdown: [{ name: "Bloom", value: 82, color: T.accent }, { name: "Root", value: 28, color: T.success }, { name: "Annual", value: 16, color: "#6b7eab" }, { name: "10 Pack", value: 14, color: T.warning }, { name: "Scholarship", value: 12, color: "#7c6eab" }, { name: "Drop-In", value: 4, color: T.textMuted }],
  classPopularity: [{ name: "Hatha Flow", pct: 92 }, { name: "Vinyasa Flow", pct: 88 }, { name: "Gentle Yoga", pct: 82 }, { name: "Yin Yoga", pct: 78 }, { name: "Hatha", pct: 76 }, { name: "Restorative", pct: 72 }],
};

// === CONTEXT ===
const AppContext = createContext();

// === HERO ===
function PageHero({ title, subtitle, img, gradient, tall }) {
  const [imgOk, setImgOk] = useState(Boolean(img));
  useEffect(() => {
    if (!img) { setImgOk(false); return; }
    const i = new Image();
    i.onload = () => setImgOk(true);
    i.onerror = () => setImgOk(false);
    i.src = img;
  }, [img]);
  const fallback = gradient || `linear-gradient(135deg, ${T.bg}, hsl(155,22%,22%), hsl(18,25%,24%))`;
  const useImg = imgOk && img;
  const minH = tall ? 300 : 220;
  const padTop = tall ? 48 : 32;
  const headlineSize = tall ? 64 : 56;
  return (
    <div style={{ position: "relative", minHeight: minH, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `${padTop}px 20px 24px`, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: useImg ? `url(${useImg})` : fallback, backgroundSize: "cover", backgroundPosition: "center", filter: useImg ? "brightness(0.75)" : "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.35) 100%)" }} />
      <div style={{ position: "relative", zIndex: 1, color: "#fff" }}>
        <h1 style={{ fontFamily: DF, fontSize: headlineSize, margin: "0 0 8px", lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.45, maxWidth: "90%", textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function SH({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h2 style={{ fontFamily: DF, fontSize: 22, color: T.text, margin: 0, fontWeight: 600 }}>{title}</h2>{linkText && <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{linkText} <ChevronRight size={14} /></button>}</div>);
}
function SB({ label, value }) {
  return (<div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}><div style={{ fontFamily: DF, fontSize: 22, color: T.text, fontWeight: 700 }}>{value}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{label}</div></div>);
}
function LocBadge({ loc }) {
  const colors = { SE: T.accent, NW: "#6b7eab" }; const c = colors[(loc || "").toUpperCase()] || T.textMuted;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${c}15`, color: c }}>{(loc || "").toUpperCase()}</span>;
}
function IF({ label, value, onChange, placeholder, multiline }) {
  const s = { width: "100%", padding: "10px 14px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", boxSizing: "border-box", resize: "none" };
  return (<div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>{multiline ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}</div>);
}

function PCard({ practice: p, expanded, onToggle }) {
  const isToday = p.date === today, isFuture = p.date > today;
  return (<div style={{ background: T.bgCard, border: `1px solid ${isToday ? T.accentBorder : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={onToggle}><div style={{ padding: "16px 18px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}><div><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>{isToday && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>Today</span>}{isFuture && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.successGhost, color: T.success }}>Upcoming</span>}<span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.bgDim, color: T.textMuted }}>{p.type}</span>{p.location && <LocBadge loc={p.location} />}</div><h3 style={{ fontFamily: DF, fontSize: 20, margin: 0, color: T.text, fontWeight: 600 }}>{p.name}</h3></div><ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 4 }} /></div><div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: T.textMuted }}><span>{fmtDS(p.date)}</span><span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {p.duration} min</span><span>{p.style}</span></div></div>{expanded && (<div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}><p style={{ fontSize: 13, color: "#3a4a3e", lineHeight: 1.6, margin: "0 0 12px" }}>{p.description}</p>{p.intention && <div style={{ padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, marginBottom: 10 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.accent, margin: "0 0 4px", letterSpacing: "0.05em" }}>Intention</p><p style={{ fontSize: 13, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{p.intention}</p></div>}{p.teacherTip && <div style={{ padding: "10px 14px", borderRadius: 10, background: T.bgDim }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.textMuted, margin: "0 0 4px", letterSpacing: "0.05em" }}>Teacher Tip</p><p style={{ fontSize: 13, color: "#3a4a3e", margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p></div>}</div>)}</div>);
}

function CTACard() {
  return (<div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(155,18%,16%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${T.accent}15` }} /><Leaf size={28} color={T.accent} style={{ marginBottom: 12 }} /><h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>30 Days for $59</h3><p style={{ fontSize: 13, color: "#8aaa8e", margin: "0 0 16px", lineHeight: 1.5 }}>New to Yoga Refuge? Unlimited classes at both studios plus Zoom.</p><button style={{ padding: "12px 24px", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Start Your Journey</button></div>);
}

// Consumer page standard padding
const PAGE_PAD = { padding: "20px 16px 0" };

// === MODALS ===
function SettingsModal({ onClose }) {
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}><div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80%", overflow: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Settings</h2><button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button></div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{SC.locations.map(loc => (<div key={loc.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}><MapPin size={20} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} /><div><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{loc.name}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{loc.address}</p><p style={{ fontSize: 11, color: T.textFaint, margin: "2px 0 0", fontStyle: "italic" }}>{loc.desc}</p></div></div>))}{[{ icon: Share2, label: SC.social.instagram, sub: "Follow us on Instagram" }, { icon: Gift, label: "Refuge Points", sub: "Earn points with every class" }, { icon: Heart, label: "Partial Scholarships", sub: "20% off for students, seniors, BIPOC, artists, teachers" }].map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}><item.icon size={20} color={T.accent} /><div><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{item.label}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{item.sub}</p></div></div>))}</div></div></div>);
}

function NotificationsModal({ onClose }) {
  const ns = [{ id: "n1", title: "Class Confirmed", message: "Hatha Flow at 9:15 AM tomorrow at SE Montavilla with Kat.", time: "2h ago", read: false }, { id: "n2", title: "Refuge Points Earned", message: "You earned 15 Refuge Points. 25 points to your next guest pass.", time: "1d ago", read: false }, { id: "n3", title: "Sound Bath Almost Full", message: "Laura's Gong Sound Bath next Friday -- only 4 spots left.", time: "2d ago", read: true }, { id: "n4", title: "Mar de Jade Retreat", message: "Spring 2026 retreat in Mexico. 6 spots remaining.", time: "4d ago", read: true }];
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}><div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80%", overflow: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Notifications</h2><button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{ns.map(n => (<div key={n.id} style={{ padding: "14px 16px", borderRadius: 12, background: n.read ? T.bgDim : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: T.text }}>{n.title}</h4>{!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0, marginTop: 4 }} />}</div><p style={{ fontSize: 13, color: "#3a4a3e", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p><p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>{n.time}</p></div>))}</div></div></div>);
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false); const isFull = classData.registered >= classData.capacity;
  const doConfirm = () => { onConfirm(classData.id); setConfirmed(true); setTimeout(onClose, 1500); };
  return (<div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}><div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 340, background: T.bgCard, borderRadius: 18, padding: "24px 22px", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>{confirmed ? (<div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Check size={28} color={T.accent} /></div><h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>{isFull ? "Added to Waitlist" : "You're In!"}</h3><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>See you on the mat</p></div>) : (<><h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>Reserve Your Spot</h3><p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 16px" }}>{classData.dayLabel || fmtDS(today)}</p><div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>{[["Class", classData.type], ["Time", fmtT(classData.time)], ["Teacher", classData.coach], ["Spots", isFull ? `Full -- ${classData.waitlist || 0} waitlisted` : `${classData.capacity - classData.registered} open`]].map(([l, v], i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.borderLight}` : "none" }}><span style={{ fontSize: 13, color: T.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: l === "Spots" ? (isFull ? T.warning : T.accent) : T.text }}>{v}</span></div>))}</div><div style={{ display: "flex", gap: 10 }}><button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button><button onClick={doConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>{isFull ? "Join Waitlist" : "Confirm"}</button></div></>)}</div></div>);
}

// === CONSUMER PAGES ===
function HomePage() {
  const { openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date(); const cm = now.getHours() * 60 + now.getMinutes();
  const upcoming = CLASSES_TODAY.filter(c => { const [h, m] = c.time.split(":").map(Number); return h * 60 + m > cm; });
  return (<div style={{ width: "100%" }}>
    <PageHero tall title={<>{SC.heroLine1} <span style={{ color: T.accent }}>{SC.heroLine2}</span></>} subtitle={SC.description} img={IMG.home} />
    <section style={PAGE_PAD}><SH title="Today's Practice" linkText="All Classes" linkPage="classes" /><PCard practice={TODAYS_FOCUS} expanded={true} onToggle={() => {}} /></section>
    <section style={{ padding: "0 16px", marginTop: 24 }}><SH title="Up Next" linkText="Full Schedule" linkPage="schedule" />{upcoming.length > 0 ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{upcoming.slice(0, 4).map(c => (<div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}><div style={{ textAlign: "center", minWidth: 54 }}><span style={{ fontFamily: DF, fontSize: 16, color: T.text, fontWeight: 600 }}>{fmtT(c.time)}</span></div><div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><p style={{ fontWeight: 600, fontSize: 13, color: T.text, margin: 0 }}>{c.type}</p><LocBadge loc={c.location} /></div><p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{c.coach} -- {c.registered}/{c.capacity}</p></div><button onClick={() => openReservation(c)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: c.registered >= c.capacity ? T.warningGhost : T.accent, color: c.registered >= c.capacity ? T.warning : "#fff" }}>{c.registered >= c.capacity ? "Waitlist" : "Reserve"}</button></div>))}</div> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", color: T.textFaint }}><Moon size={28} style={{ marginBottom: 8 }} /><p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No more classes today</p></div>}</section>
    <section style={{ padding: "0 16px", marginTop: 28 }}><SH title="Community" linkText="View All" linkPage="community" /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{COMMUNITY_FEED.slice(0, 3).map(item => { const myC = feedCelebrations[item.id] || 0; return (<div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, borderRadius: 12 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={18} color="#fff" /></div><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{item.user} <span style={{ color: T.accent }}>{item.milestone}</span></p><p style={{ fontSize: 12, color: "#4a5a4e", margin: "2px 0 0", lineHeight: 1.4 }}>{item.message.length > 55 ? item.message.slice(0, 55) + "..." : item.message}</p></div><button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Heart size={18} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span></button></div>); })}</div></section>
    <section style={{ padding: "0 16px", marginTop: 28 }}><SH title="Announcements" /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{ANNOUNCEMENTS.map(a => (<div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}><div><h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3><p style={{ fontSize: 13, color: "#4a5a4e", margin: "4px 0 0" }}>{a.message}</p></div>{a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}</div></div>))}</div></section>
    <section style={{ padding: "0 16px", margin: "28px 0 24px" }}><CTACard /></section>
  </div>);
}

function ClassesPage() {
  const [exp, setExp] = useState(null);
  const all = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));
  return (<div style={{ width: "100%" }}><PageHero title="Classes" subtitle="Past, present, and upcoming practice" img={IMG.classes} /><div style={{ ...PAGE_PAD, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>{all.map(p => <PCard key={p.id} practice={p} expanded={exp === p.id} onToggle={() => setExp(exp === p.id ? null : p.id)} />)}</div></div>);
}

function SchedulePage() {
  const [selDay, setSelDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [locFilter, setLocFilter] = useState("all");
  const { openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const filtered = (WEEKLY_SCHEDULE[selDay]?.classes || []).filter(c => locFilter === "all" || c.loc.toLowerCase() === locFilter);
  return (<div style={{ width: "100%" }}><PageHero title="Schedule" subtitle="Reserve across both studios" img={IMG.schedule} /><div style={{ ...PAGE_PAD, paddingBottom: 24 }}><div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>{days.map((d, i) => <button key={d} onClick={() => setSelDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selDay === i ? T.accent : T.bgDim, color: selDay === i ? "#fff" : T.textMuted }}>{d}</button>)}</div><div style={{ display: "flex", gap: 4, marginBottom: 16 }}>{["all", "se", "nw"].map(f => <button key={f} onClick={() => setLocFilter(f)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", background: locFilter === f ? T.accent : T.bgCard, color: locFilter === f ? "#fff" : T.textMuted }}>{f === "all" ? "All" : f === "se" ? "Montavilla" : "NW Chapel"}</button>)}</div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{filtered.map((cls, i) => { const isSpecial = cls.type.includes("Yin") || cls.type.includes("Restorative") || cls.type.includes("Meditation") || cls.type.includes("Prenatal") || cls.type.includes("Postnatal"); return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}><div style={{ textAlign: "center", minWidth: 56 }}><span style={{ fontFamily: DF, fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtT(cls.time)}</span></div><div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p><LocBadge loc={cls.loc} /></div>{cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}</div><button onClick={() => openReservation({ id: `s-${selDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? SC.specialtyCapacity : SC.classCapacity, registered: Math.floor(Math.random() * 6) + 10, waitlist: 0, dayLabel: dayNames[selDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>Reserve</button></div>); })}</div></div></div>);
}

function PracticePage() {
  const [tab, setTab] = useState("log");
  const [ref, setRef] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  return (<div style={{ width: "100%" }}><PageHero title="My Practice" subtitle="Track your journey and celebrate growth" img={IMG.practice} /><div style={{ ...PAGE_PAD, paddingBottom: 24 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>{[{ icon: Flame, val: 8, label: "Day Streak", c: T.accent, bg: T.accentGhost, bd: T.accentBorder }, { icon: Star, val: 62, label: "Total Classes", c: T.success, bg: T.successGhost, bd: T.successBorder }, { icon: Mountain, val: 5, label: "Milestones", c: T.warning, bg: T.warningGhost, bd: T.warningBorder }].map((s, i) => (<div key={i} style={{ background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}><s.icon size={20} color={s.c} style={{ margin: "0 auto 4px" }} /><div style={{ fontFamily: DF, fontSize: 28, fontWeight: 700, color: T.text }}>{s.val}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div></div>))}</div><div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>{[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t.id ? T.bgCard : "transparent", color: tab === t.id ? T.text : T.textMuted, boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>{t.label}</button>)}</div>{tab === "log" && (<div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Leaf size={18} color={T.accent} /><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3></div><div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{[{ label: "Energy Level", key: "energy", icons: [Moon, Moon, Sun, Sun, Sparkles], c: T.accent }, { label: "Focus & Presence", key: "focus", icons: [Wind, Wind, Heart, Heart, Sparkles], c: T.success }].map(row => (<div key={row.key}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</label><div style={{ display: "flex", gap: 6 }}>{[1,2,3,4,5].map(n => { const I = row.icons[n-1]; return <button key={n} onClick={() => setRef({...ref, [row.key]: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${ref[row.key] >= n ? row.c : T.border}`, background: ref[row.key] >= n ? `${row.c}12` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={18} color={ref[row.key] >= n ? row.c : T.textFaint} /></button>; })}</div></div>))}<IF label="Notes / Gratitude" value={ref.notes} onChange={v => setRef({...ref, notes: v})} placeholder="What came up for you on the mat today?" multiline /><button onClick={() => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setRef({ energy: 4, focus: 4, notes: "" }); }} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: DF, fontSize: 17 }}>{saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}</button></div></div>)}{tab === "milestones" && (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{Object.entries(MILESTONE_BADGES).map(([name, badge]) => { const earned = ["First Class", "10 Classes", "50 Classes", "7-Day Streak", "Both Studios"].includes(name); const Icon = badge.icon; return (<div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : "transparent"}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.45 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Icon size={22} color={earned ? badge.color : T.textFaint} /></div><p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p><p style={{ fontSize: 11, color: T.textFaint, margin: "2px 0 0" }}>{earned ? "Earned" : "Keep going"}</p></div>); })}</div>)}</div></div>);
}

function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (<div style={{ width: "100%" }}><PageHero title="Community" subtitle="Celebrate each other's practice" img={IMG.community} /><div style={{ ...PAGE_PAD, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 24 }}>{COMMUNITY_FEED.map(item => { const myC = feedCelebrations[item.id] || 0; return (<div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{item.user[0]}</div><div><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{fmtDS(item.date)}</p></div><span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{item.milestone}</span></div><p style={{ fontSize: 14, color: "#2a3a2e", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p><button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.accentBorder : T.border}`, background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer" }}><Heart size={16} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span></button></div>); })}</div></div>);
}

function TeachersPage() {
  const [exp, setExp] = useState(null);
  return (<div style={{ width: "100%" }}><PageHero title="Teachers" subtitle="Knowledgeable, skillful, and passionate" img={IMG.teachers} /><div style={{ ...PAGE_PAD, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>{TEACHERS.map(t => { const expanded = exp === t.id; return (<div key={t.id} onClick={() => setExp(expanded ? null : t.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}><div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div><div style={{ flex: 1 }}><h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{t.yearsTeaching} years teaching</p></div><ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></div>{expanded && <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}><p style={{ fontSize: 13, color: "#3a4a3e", lineHeight: 1.6, margin: "0 0 12px" }}>{t.bio}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{t.specialties.map(s => <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>)}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>)}</div></div>}</div>); })}</div></div>);
}

function MembershipPage() {
  return (<div style={{ width: "100%" }}><PageHero title="Pricing" subtitle="Find your path to practice" img={IMG.membership} gradient={`linear-gradient(135deg, hsl(155,30%,28%), hsl(18,30%,28%))`} /><div style={{ ...PAGE_PAD, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>{MEMBERSHIP_TIERS.map(tier => (<div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>{tier.popular && <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>}<h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>{tier.name}</h3><div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}><span style={{ fontFamily: DF, fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span><span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span></div><ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>{tier.features.map((f, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#3a4a3e" }}><CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>)}</ul><button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: tier.popular ? T.accent : T.bg, color: "#fff" }}>Get Started</button></div>))}</div></div>);
}

function EventsPage() {
  return (<div style={{ width: "100%" }}><PageHero title="Events" subtitle="Workshops, sound baths, retreats, and training" img={IMG.events} gradient={`linear-gradient(135deg, hsl(155,28%,24%), hsl(18,32%,30%))`} /><div style={{ ...PAGE_PAD, paddingBottom: 24 }}>{EVENTS.map(ev => (<div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}><div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(155,18%,16%))`, padding: "20px 18px", color: "#fff" }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>{ev.location !== "offsite" && <LocBadge loc={ev.location} />}</div><h3 style={{ fontFamily: DF, fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>{ev.startTime !== "00:00" && <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#8aaa8e" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {fmtDS(ev.date)}</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtT(ev.startTime)}</span></div>}</div><div style={{ padding: "16px 18px" }}><p style={{ fontSize: 13, color: "#3a4a3e", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}><SB label="Price" value={`$${ev.fee}`} /><SB label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} /></div><button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Register Now</button></div></div>))}</div></div>);
}

function RewardsPage() {
  return (<div style={{ width: "100%" }}><PageHero title="Refuge Points" subtitle="Earn points, deepen your practice" gradient={`linear-gradient(135deg, hsl(155,25%,22%), hsl(18,25%,22%))`} /><div style={{ padding: "20px 16px 24px" }}><div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(155,18%,16%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", marginBottom: 16 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 8px" }}>Your Points</p><div style={{ fontFamily: DF, fontSize: 48, fontWeight: 700 }}>620</div><p style={{ fontSize: 13, color: "#8aaa8e", margin: "4px 0 0" }}>30 points to next reward</p></div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[{ pts: 500, reward: "Free Guest Pass", icon: UserPlus }, { pts: 650, reward: "10% Off Workshop", icon: Award }, { pts: 1000, reward: "Free Private Session Upgrade", icon: Gift }, { pts: 1500, reward: "Scholarship Donation in Your Name", icon: Heart }].map((r, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}><r.icon size={20} color={T.accent} /></div><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{r.reward}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{r.pts} points</p></div><button style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: r.pts <= 620 ? "pointer" : "default", background: r.pts <= 620 ? T.accent : T.bgDim, color: r.pts <= 620 ? "#fff" : T.textFaint }}>{r.pts <= 620 ? "Redeem" : "Locked"}</button></div>))}</div></div></div>);
}

// === ADMIN (LIGHT SCHEME) ===
const AC_LIGHT = ({ title, children }) => (<div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>{title}</h3>{children}</div>);
const adminH1 = { fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 };
const adminBtnPrimary = { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" };
const adminBtnGhost = { padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#4b5563", cursor: "pointer" };

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns}/wk`, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, icon: DollarSign, color: T.warning },
    { label: "Scholarships Active", value: ADMIN_METRICS.scholarships, change: "20% discount", icon: Heart, color: "#7c6eab" },
  ];
  return (<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div><h1 style={adminH1}>Dashboard</h1><p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>SE Montavilla + NW Chapel</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>{metrics.map((m, i) => (<div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><m.icon size={18} color={m.color} /></div><div style={{ fontFamily: DF, fontSize: 30, color: "#111827", fontWeight: 700 }}>{m.value}</div><span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: "#059669", marginTop: 4 }}><ArrowUpRight size={12} /> {m.change}</span><p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{m.label}</p></div>))}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
      <AC_LIGHT title="Attendance by Location"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={ADMIN_CHARTS.attendance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /><Bar dataKey="SE" fill={T.accent} radius={[4, 4, 0, 0]} /><Bar dataKey="NW" fill="#6b7eab" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>{[{ l: "Montavilla", c: T.accent }, { l: "NW Chapel", c: "#6b7eab" }].map((x, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} /><span style={{ fontSize: 11, color: "#6b7280" }}>{x.l}</span></div>)}</div></AC_LIGHT>
      <AC_LIGHT title="Revenue Trend"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADMIN_CHARTS.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} tickFormatter={v => `$${v / 1000}k`} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} /><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#rg)" /></AreaChart></ResponsiveContainer></div></AC_LIGHT>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <AC_LIGHT title="Membership Breakdown"><div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /></PieChart></ResponsiveContainer></div><div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /><span style={{ fontSize: 11, color: "#6b7280" }}>{e.name} ({e.value})</span></div>)}</div></AC_LIGHT>
      <AC_LIGHT title="Class Fill Rate"><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{ADMIN_CHARTS.classPopularity.map((c, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{c.name}</span><span style={{ fontSize: 11, color: "#6b7280" }}>{c.pct}%</span></div><div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.pct}%`, background: T.accent, borderRadius: 3 }} /></div></div>)}</div></AC_LIGHT>
    </div>
  </div>);
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || m.status === filter));
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={adminH1}>Members</h1><button style={adminBtnPrimary}><UserPlus size={16} /> Add Member</button></div>
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1, position: "relative" }}><Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none", boxSizing: "border-box" }} /></div>
      <div style={{ display: "flex", gap: 4 }}>{["all", "active", "frozen"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#fff", color: filter === f ? "#fff" : "#6b7280", borderColor: filter === f ? T.accent : "#e5e7eb" }}>{f}</button>)}</div>
    </div>
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>{["Member", "Plan", "Status", "Classes", ""].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(m => <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
          <td style={{ padding: "12px 16px" }}><p style={{ color: "#111827", fontWeight: 600, margin: 0 }}>{m.name}</p><p style={{ color: "#9ca3af", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p></td>
          <td style={{ padding: "12px 16px", color: "#374151" }}>{m.membership}</td>
          <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span></td>
          <td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{m.checkIns}</td>
          <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}><button style={adminBtnGhost}><Edit3 size={12} /></button><button style={adminBtnGhost}><Trash2 size={12} /></button></div></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>);
}

function AdminSchedulePage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={adminH1}>Schedule</h1><button style={adminBtnPrimary}><Plus size={16} /> Add Class</button></div>
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>{["Time", "Class", "Teacher", "Studio", "Spots", ""].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{CLASSES_TODAY.map(c => <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
          <td style={{ padding: "12px 16px", color: "#111827", fontFamily: "monospace" }}>{fmtT(c.time)}</td>
          <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600 }}>{c.type}</td>
          <td style={{ padding: "12px 16px", color: "#374151" }}>{c.coach}</td>
          <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.location.toUpperCase()}</td>
          <td style={{ padding: "12px 16px" }}><span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span></td>
          <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}><button style={adminBtnGhost}><Edit3 size={12} /></button><button style={adminBtnGhost}><Trash2 size={12} /></button></div></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>);
}

function AdminTeachersPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={adminH1}>Teachers</h1><button style={adminBtnPrimary}><UserPlus size={16} /> Add Teacher</button></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>{TEACHERS.map(t => (<div key={t.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 20, color: "#fff", fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div><div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p></div></div><div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280" }}>{c}</span>)}</div><div style={{ display: "flex", gap: 6 }}><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button><button style={adminBtnGhost}><Trash2 size={14} /></button></div></div>))}</div>
  </div>);
}

function AdminEventsPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={adminH1}>Events</h1><button style={adminBtnPrimary}><Plus size={16} /> Add Event</button></div>
    {EVENTS.map(ev => (<div key={ev.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{ev.name}</h3><p style={{ color: "#6b7280", fontSize: 12 }}>{fmtDS(ev.date)} -- {ev.type}</p></div><div style={{ display: "flex", gap: 4 }}><button style={adminBtnGhost}><Edit3 size={14} /></button><button style={adminBtnGhost}><Trash2 size={14} /></button></div></div><div style={{ display: "flex", gap: 16, marginTop: 8 }}><span style={{ fontSize: 12, color: "#6b7280" }}>${ev.fee}</span><span style={{ fontSize: 12, color: "#6b7280" }}>{ev.registered}/{ev.maxParticipants}</span><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{ev.status}</span></div></div>))}
  </div>);
}

function AdminPricingPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={adminH1}>Pricing</h1><button style={adminBtnPrimary}><Plus size={16} /> Add Tier</button></div>
    {MEMBERSHIP_TIERS.map(tier => (<div key={tier.id} style={{ background: "#fff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: 0 }}>{tier.name}</h3><p style={{ color: T.accent, fontSize: 22, fontFamily: DF, fontWeight: 700, margin: "4px 0 0" }}>${tier.price} <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans'" }}>{tier.period}</span></p></div><div style={{ display: "flex", gap: 4 }}><button style={adminBtnGhost}><Edit3 size={14} /></button><button style={adminBtnGhost}><Trash2 size={14} /></button></div></div></div>))}
  </div>);
}

function AdminCommsPage() {
  const [msg, setMsg] = useState(""); const [sent, setSent] = useState(false);
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h1 style={adminH1}>Broadcast</h1>
    <AC_LIGHT title="New Announcement">
      <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Broadcast to all members..." rows={4} style={{ width: "100%", padding: 12, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
      <button onClick={() => { setSent(true); setTimeout(() => { setSent(false); setMsg(""); }, 2000); }} disabled={!msg.trim()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: msg.trim() ? T.accent : "#e5e7eb", color: msg.trim() ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 13, cursor: msg.trim() ? "pointer" : "default" }}>{sent ? <><Check size={14} /> Sent</> : <><Send size={14} /> Broadcast to All</>}</button>
    </AC_LIGHT>
    <AC_LIGHT title="Recent Broadcasts">{ANNOUNCEMENTS.map(a => <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{a.title}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "4px 0 0" }}>{a.message}</p></div>)}</AC_LIGHT>
  </div>);
}

function AdminSettingsPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h1 style={adminH1}>Settings</h1>
    <AC_LIGHT title="Studio Locations"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{SC.locations.map(loc => <div key={loc.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, borderRadius: 8, background: "#f9fafb" }}><MapPin size={18} color={T.accent} style={{ marginTop: 2 }} /><div><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{loc.name}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{loc.address}</p><p style={{ color: "#9ca3af", fontSize: 11, margin: "2px 0 0", fontStyle: "italic" }}>{loc.desc}</p></div><button style={{ marginLeft: "auto", ...adminBtnGhost }}><Edit3 size={14} /></button></div>)}</div></AC_LIGHT>
    <AC_LIGHT title="Integrations">{["Booking System", "Payment Processor", "Email Marketing", "Zoom (Online Classes)"].map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}><span style={{ color: "#374151", fontSize: 13 }}>{item}</span><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>Connected</span></div>)}</AC_LIGHT>
  </div>);
}

// === MAIN APP ===
export default function App({ onEnterAdmin, startInAdmin = false, onExitAdmin }) {
  const [page, setPage] = useState(startInAdmin ? "admin-dashboard" : "home");
  const [isAdmin, setIsAdmin] = useState(startInAdmin);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classReg, setClassReg] = useState({});
  const [resClass, setResClass] = useState(null);
  const [feedCel, setFeedCel] = useState({});
  const contentRef = useRef(null);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo(0, 0); }, [page]);

  const regClass = useCallback((id) => setClassReg(p => ({ ...p, [id]: true })), []);
  const openRes = useCallback((d) => setResClass(d), []);
  const celFeed = useCallback((id) => setFeedCel(p => ({ ...p, [id]: (p[id] || 0) + 1 })), []);

  const handleEnterAdmin = () => {
    if (onEnterAdmin) { onEnterAdmin(); return; }
    setIsAdmin(true); setPage("admin-dashboard");
  };
  const handleExitAdmin = () => {
    if (onExitAdmin) { onExitAdmin(); return; }
    setIsAdmin(false); setPage("home");
  };

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "community", label: "Community", icon: Heart },
    { id: "more", label: "More", icon: Menu },
  ];
  const moreItems = [
    { id: "classes", label: "Classes", icon: AlignJustify },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: CalendarDays },
  ];
  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-schedule", label: "Schedule", icon: CalendarDays },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: PartyPopper },
    { id: "admin-pricing", label: "Pricing", icon: CreditCard },
    { id: "admin-comms", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];
  const isMoreActive = moreItems.some(item => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "rewards": return <RewardsPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-comms": return <AdminCommsPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  // === ADMIN FULL-SCREEN LAYOUT ===
  if (isAdmin) {
    return (<AppContext.Provider value={{ page, setPage, classRegistrations: classReg, registerForClass: regClass, openReservation: openRes, feedCelebrations: feedCel, celebrateFeed: celFeed }}>
      <div style={{ display: "flex", width: "100vw", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f5f6f8", color: "#111827" }}>
        <aside style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0 }}>
          <div style={{ padding: "16px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700 }}>{SC.logoMark}</div>
            <div><span style={{ fontFamily: DF, fontSize: 14, color: "#111827", display: "block", lineHeight: 1, fontWeight: 600 }}>{SC.name} {SC.subtitle}</span><span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin</span></div>
          </div>
          <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
            {adminTabs.map(tab => { const active = page === tab.id; return <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#4b5563", fontSize: 13, fontWeight: active ? 600 : 500, cursor: "pointer", marginBottom: 2, textAlign: "left" }}><tab.icon size={18} /><span>{tab.label}</span>{active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.8 }} />}</button>; })}
          </nav>
          <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}>
            <button onClick={handleExitAdmin} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#4b5563", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: 600 }}><LogOut size={18} /><span>Exit Admin</span></button>
          </div>
        </aside>
        <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto", minHeight: "100vh" }}>{renderPage()}</main>
      </div>
    </AppContext.Provider>);
  }

  // === CONSUMER PHONE LAYOUT ===
  return (<AppContext.Provider value={{ page, setPage, classRegistrations: classReg, registerForClass: regClass, openReservation: openRes, feedCelebrations: feedCel, celebrateFeed: celFeed }}>
    <div style={{ width: "100%", height: "100%", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", display: "flex", flexDirection: "column" }}>
      <header style={{ flexShrink: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 18, color: "#fff", fontWeight: 700 }}>{SC.logoMark}</div>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}><span style={{ fontFamily: DF, fontSize: 18, lineHeight: 1, letterSpacing: "0.01em" }}>{SC.name}</span><span style={{ fontSize: 9, color: "#9caaa0", textTransform: "uppercase", letterSpacing: "0.15em" }}>{SC.subtitle}</span></div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button onClick={handleEnterAdmin} title="Admin" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}><Shield size={20} /></button>
          <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}><Bell size={20} /><span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>2</span></button>
          <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}><Settings size={20} /></button>
        </div>
      </header>
      <main ref={contentRef} style={{ position: "absolute", top: 58, left: 0, right: 0, bottom: 60, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }} className="yr-scroll">{renderPage()}</main>
      {showMore && (<div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50 }}><div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}><span style={{ fontFamily: DF, fontSize: 20, fontWeight: 600 }}>More</span><button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{moreItems.map(item => { const active = page === item.id; return <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}><item.icon size={22} /><span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span></button>; })}</div></div></div>)}
      <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, zIndex: 40, background: "#ffffff", borderTop: "1px solid #eeeeee", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {mainTabs.map(tab => { const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id; return <button key={tab.id} onClick={tab.id === "more" ? () => setShowMore(true) : () => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 6px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}><tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span></button>; })}
      </nav>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {resClass && <ReservationModal classData={resClass} onConfirm={regClass} onClose={() => setResClass(null)} />}
      <style>{`
        .yr-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  </AppContext.Provider>);
}
