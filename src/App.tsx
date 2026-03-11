import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Search, 
  UserPlus, 
  LayoutDashboard, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Trophy, 
  Info, 
  Menu, 
  X,
  ChevronRight,
  Heart,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  MessageSquare,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn, BLOOD_GROUPS, type User, type CMSData } from './lib/utils';

// --- Components ---

const Navbar = ({ cms }: { cms: CMSData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Droplets className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{cms.site_name}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-slate-600 hover:text-red-500 font-medium transition-colors">রক্ত খুঁজুন</Link>
            <Link to="/register" className="text-slate-600 hover:text-red-500 font-medium transition-colors">দাতা হোন</Link>
            <Link to="/leaderboard" className="text-slate-600 hover:text-red-500 font-medium transition-colors">লিডারবোর্ড</Link>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-slate-600 hover:text-red-500 font-medium transition-colors"
            >
              অ্যাডমিনকে মেসেজ
            </button>
            <Link to="/admin" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-colors">অ্যাডমিন</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
            >
              <Link to="/search" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-900">রক্ত খুঁজুন</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-900">দাতা হোন</Link>
              <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-900">লিডারবোর্ড</Link>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="text-left text-lg font-medium text-slate-900"
              >
                অ্যাডমিনকে মেসেজ
              </button>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-red-500 text-white p-3 rounded-xl text-center font-bold">অ্যাডমিন ড্যাশবোর্ড</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <ContactAdminModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
};

const ContactAdminModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        onClose();
        setPhone('');
        setMessage('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">অ্যাডমিনকে মেসেজ</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">আপনার ফোন নম্বর (নিবন্ধিত)</label>
                <input 
                  required
                  type="tel" 
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">আপনার মেসেজ</label>
                <textarea 
                  required
                  placeholder="আপনার সমস্যা বা অনুরোধ এখানে লিখুন..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" /> {loading ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-16 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Droplets className="text-red-500 w-8 h-8" />
          <span className="text-2xl font-bold text-white">ব্লাড লাগবে?</span>
        </div>
        <p className="max-w-md leading-relaxed">
          রক্তদান একটি মহৎ কাজ। আপনার সামান্য রক্তদান বাঁচাতে পারে একটি মূল্যবান জীবন। 
          আমাদের লক্ষ্য হলো রক্তদাতা এবং গ্রহীতার মধ্যে একটি সহজ ও দ্রুত সেতুবন্ধন তৈরি করা।
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">লিঙ্কসমূহ</h4>
        <ul className="space-y-4">
          <li><Link to="/search" className="hover:text-red-500 transition-colors">রক্ত খুঁজুন</Link></li>
          <li><Link to="/register" className="hover:text-red-500 transition-colors">দাতা হিসেবে নিবন্ধন</Link></li>
          <li><Link to="/about" className="hover:text-red-500 transition-colors">আমাদের সম্পর্কে</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">যোগাযোগ</h4>
        <p className="mb-4">ইমেইল: info@bloodlagbe.com</p>
        <p>ফোন: +৮৮০ ১২৩৪৫৬৭৮৯০</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 flex flex-col md:row justify-between items-center gap-4">
      <p>© ২০২৪ ব্লাড লাগবে? সর্বস্বত্ব সংরক্ষিত।</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">ফেসবুক</a>
        <a href="#" className="hover:text-white transition-colors">টুইটার</a>
        <a href="#" className="hover:text-white transition-colors">ইনস্টাগ্রাম</a>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = ({ cms }: { cms: CMSData }) => {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [searchGroup, setSearchGroup] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
    fetch('/api/leaderboard').then(res => res.json()).then(setLeaderboard);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?group=${searchGroup}&location=${searchLocation}`);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-red-50/50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Heart className="w-4 h-4" /> রক্তদান মহৎ দান
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight">
              {cms.hero_title}
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              {cms.hero_subtitle}. আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ। আজই রক্তদাতা হিসেবে নিবন্ধন করুন।
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center gap-2">
                <Search className="w-5 h-5" /> রক্ত খুঁজুন
              </Link>
              <Link to="/register" className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> দাতা হোন
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
            <img 
              src="https://picsum.photos/seed/blood-donation/800/600" 
              alt="Blood Donation Illustration" 
              className="relative rounded-3xl shadow-2xl border-8 border-white"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-5xl mx-auto -mt-12 relative z-10 px-6">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />
            <select 
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 appearance-none"
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="আপনার এলাকা লিখুন (উদা: ঢাকা)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> সার্চ করুন
          </button>
        </form>
      </section>

      {/* Blood Group Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">রক্তের গ্রুপ অনুযায়ী খুঁজুন</h2>
          <p className="text-slate-500">আপনার প্রয়োজনীয় রক্তের গ্রুপটি নির্বাচন করুন এবং দাতা খুঁজে নিন</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BLOOD_GROUPS.map((group) => {
            const count = stats?.bloodDist?.find((d: any) => d.blood_group === group)?.count || 0;
            return (
              <Link 
                key={group} 
                to={`/search?group=${group}`}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-red-200 transition-all text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500 transition-colors">
                  <span className="text-2xl font-black text-red-500 group-hover:text-white">{group}</span>
                </div>
                <div className="text-slate-400 text-sm mb-1">মোট দাতা</div>
                <div className="text-2xl font-bold text-slate-900">{count} জন</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <Trophy className="text-yellow-500 w-10 h-10" /> সেরা রক্তদাতা
              </h2>
              <p className="text-slate-500">যারা সবচেয়ে বেশিবার রক্তদান করে জীবন বাঁচাতে সাহায্য করেছেন</p>
            </div>
            <Link to="/leaderboard" className="text-red-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              সবাইকে দেখুন <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaderboard.slice(0, 3).map((donor, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden"
              >
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10",
                  idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                )} />
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                    idx === 0 ? "bg-yellow-100 text-yellow-700" : idx === 1 ? "bg-slate-100 text-slate-700" : "bg-orange-100 text-orange-700"
                  )}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{donor.name}</h3>
                    <span className="text-red-500 font-bold">{donor.blood_group}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-slate-500">মোট দান</span>
                  <span className="text-2xl font-black text-slate-900">{donor.donation_count} বার</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">কিভাবে কাজ করে?</h2>
          <p className="text-slate-500">সহজ ৩টি ধাপে আপনিও হতে পারেন একজন জীবন রক্ষাকারী</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: UserPlus, title: "নিবন্ধন করুন", desc: "আপনার সঠিক তথ্য দিয়ে দাতা হিসেবে নিবন্ধন করুন।" },
            { icon: ShieldCheck, title: "ভেরিফিকেশন", desc: "অ্যাডমিন আপনার তথ্য যাচাই করে আপনাকে ভেরিফাইড করবেন।" },
            { icon: Heart, title: "জীবন বাঁচান", desc: "জরুরী প্রয়োজনে রক্তদান করে মানুষের জীবন বাঁচাতে সাহায্য করুন।" }
          ].map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                <step.icon className="text-red-500 w-10 h-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Donors */}
      <section className="py-24 px-6 bg-red-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">সম্প্রতি যুক্ত হওয়া দাতা</h2>
            <p className="text-red-100">আমাদের সাথে নতুন যুক্ত হওয়া জীবন রক্ষাকারীরা</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats?.recentDonors?.map((donor: any, idx: number) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-black text-xl">
                    {donor.blood_group}
                  </div>
                  <Clock className="w-5 h-5 opacity-50" />
                </div>
                <h3 className="text-lg font-bold mb-1">{donor.name}</h3>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <MapPin className="w-4 h-4" /> {donor.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const SearchPage = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  
  const searchParams = new URLSearchParams(window.location.search);
  const group = searchParams.get('group') || '';
  const location = searchParams.get('location') || '';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/donors?blood_group=${group}&location=${location}`)
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      });
  }, [group, location]);

  const fetchFullDetails = (id: number) => {
    fetch(`/api/donors/${id}`)
      .then(res => res.json())
      .then(setSelectedDonor);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">রক্তদাতা খুঁজুন</h1>
        <p className="text-slate-500">
          {group ? `গ্রুপ: ${group}` : 'সকল গ্রুপ'} {location && `| এলাকা: ${location}`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
        </div>
      ) : donors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {donors.map((donor) => (
            <motion.div 
              key={donor.id}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[64px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              
              <div className="flex justify-between items-start mb-6 relative">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-xl font-black text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  {donor.blood_group}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{donor.name}</h3>
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" /> {donor.location}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Donations</div>
                  <div className="text-sm font-black text-slate-900">{donor.donation_count} Times</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Last Donate</div>
                  <div className="text-[11px] font-bold text-slate-900">
                    {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString('bn-BD') : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                <a 
                  href={`tel:${donor.phone}`}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-lg shadow-slate-100"
                >
                  <Phone className="w-4 h-4" /> CALL NOW
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-3xl">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">কোন দাতা পাওয়া যায়নি</h3>
          <p className="text-slate-500">অনুগ্রহ করে অন্য কোন গ্রুপ বা এলাকা দিয়ে চেষ্টা করুন</p>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDonor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDonor(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            {/* Ambient Glow behind the card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[500px] h-[300px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none"
            />

            <motion.div 
              layoutId={`donor-${selectedDonor.id}`}
              initial={{ scale: 0.8, opacity: 0, rotateY: 30, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateY: 0, 
                y: [0, -8, 0],
              }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -30, y: 20 }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                default: { type: "spring", damping: 20, stiffness: 200 }
              }}
              className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-[24px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/20 group perspective-1000"
            >
              {/* Premium Background with Depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-950 to-black" />
              
              {/* Animated Shine/Glare */}
              <motion.div 
                animate={{ 
                  left: ['-100%', '200%'],
                  top: ['-100%', '200%']
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                className="absolute w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-45 pointer-events-none"
              />
              
              {/* Micro-texture */}
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] pointer-events-none" />

              <div className="relative h-full p-8 flex flex-col justify-between text-white select-none">
                {/* Header: Brand & Close */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-600 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      <Droplets className="text-white w-5 h-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500 leading-none mb-1">Premium Donor</span>
                      <span className="text-[8px] font-bold tracking-widest uppercase opacity-40">Identity Card</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDonor(null)}
                    className="p-2 bg-white/5 hover:bg-white/20 rounded-full transition-all active:scale-90 border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Center: Chip & Blood Group */}
                <div className="flex justify-between items-center px-2">
                  <div className="relative group/chip">
                    <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-600 rounded-lg shadow-lg overflow-hidden border border-black/10">
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                        {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-black" />)}
                      </div>
                    </div>
                    {/* Chip Glow */}
                    <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded-lg opacity-0 group-hover/chip:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="relative">
                    <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                      {selectedDonor.blood_group}
                    </div>
                    {/* Hologram Sticker */}
                    <div className="absolute -top-2 -right-4 w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-400 to-yellow-400 opacity-40 blur-[1px] animate-spin-slow" />
                  </div>
                </div>

                {/* Footer: Info & Actions */}
                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[9px] uppercase tracking-[0.25em] text-red-500 font-black">Member Name</div>
                      <div className="text-xl font-bold tracking-wider uppercase font-mono drop-shadow-md">
                        {selectedDonor.name}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[9px] uppercase tracking-[0.25em] text-red-500 font-black">Location</div>
                      <div className="text-xs font-bold tracking-wide flex items-center justify-end gap-1.5 opacity-80">
                        <MapPin className="w-3.5 h-3.5" /> {selectedDonor.location}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Call Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex gap-6">
                      <div className="group/stat">
                        <div className="text-[8px] uppercase tracking-widest opacity-40 mb-0.5">Donations</div>
                        <div className="text-base font-black text-white group-hover/stat:text-red-500 transition-colors">{selectedDonor.donation_count}</div>
                      </div>
                      <div className="group/stat">
                        <div className="text-[8px] uppercase tracking-widest opacity-40 mb-0.5">Status</div>
                        <div className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                        </div>
                      </div>
                    </div>
                    
                    <motion.a 
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      href={`tel:${selectedDonor.phone}`}
                      className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 shadow-lg transition-colors hover:bg-red-500"
                    >
                      <Phone className="w-3.5 h-3.5" /> CALL NOW
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    blood_group: '',
    phone: '',
    location: '',
    donation_count: 0,
    last_donation_date: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', blood_group: '', phone: '', location: '', donation_count: 0, last_donation_date: '' });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong' });
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h1 className="text-5xl font-black text-slate-900 mb-6">রক্তদাতা হিসেবে নিবন্ধন করুন</h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed">
          আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ। আমাদের প্ল্যাটফর্মে যুক্ত হয়ে মানুষের বিপদে পাশে দাঁড়ান। 
          নিবন্ধনের পর অ্যাডমিন আপনার তথ্য যাচাই করবেন।
        </p>
        
        <div className="space-y-8">
          {[
            { icon: CheckCircle2, title: "সঠিক তথ্য দিন", desc: "আপনার রক্তের গ্রুপ এবং ফোন নম্বর সঠিকভাবে প্রদান করুন।" },
            { icon: Clock, title: "অপেক্ষা করুন", desc: "অ্যাডমিন আপনার তথ্য যাচাই করতে ২৪-৪৮ ঘণ্টা সময় নিতে পারেন।" },
            { icon: ShieldCheck, title: "নিরাপদ থাকুন", desc: "আপনার তথ্য আমাদের কাছে সুরক্ষিত থাকবে।" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                <item.icon className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {status && (
            <div className={cn(
              "p-4 rounded-2xl text-sm font-bold",
              status.type === 'success' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {status.message}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">পূর্ণ নাম</label>
            <input 
              required
              type="text" 
              placeholder="আপনার নাম লিখুন"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2">রক্তের গ্রুপ</label>
              <select 
                required
                value={formData.blood_group}
                onChange={e => setFormData({...formData, blood_group: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 appearance-none"
              >
                <option value="">নির্বাচন করুন</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2">ফোন নম্বর</label>
              <input 
                required
                type="tel" 
                placeholder="০১৭XXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">ইমেইল (Gmail)</label>
            <input 
              required
              type="email" 
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">বর্তমান এলাকা</label>
            <input 
              required
              type="text" 
              placeholder="উদা: ধানমন্ডি, ঢাকা"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2">মোট কতবার রক্ত দিয়েছেন?</label>
              <input 
                type="number" 
                min="0"
                placeholder="০"
                value={formData.donation_count}
                onChange={e => setFormData({...formData, donation_count: parseInt(e.target.value) || 0})}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2">শেষ রক্তদানের তারিখ</label>
              <input 
                type="date" 
                value={formData.last_donation_date}
                onChange={e => setFormData({...formData, last_donation_date: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
          >
            {loading ? "প্রসেসিং হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ cms, onUpdateCMS }: { cms: CMSData, onUpdateCMS: (key: string, val: string) => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'cms' | 'messages'>('stats');
  
  // Edit & Message States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [messagingUser, setMessagingUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
    fetch('/api/stats').then(res => res.json()).then(setStats);
    fetch('/api/admin/messages').then(res => res.json()).then(setMessages);
  }, []);

  const handleVerify = async (id: number, verify: boolean) => {
    await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, verify })
    });
    setUsers(users.map(u => u.id === id ? { ...u, is_verified: verify } : u));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingUser || !messageText) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: messagingUser.id, message: messageText })
      });
      if (res.ok) {
        alert('Message sent successfully!');
        setMessagingUser(null);
        setMessageText('');
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Donor List - Blood Lagbe?", 14, 15);
    autoTable(doc, {
      head: [['Name', 'Blood Group', 'Phone', 'Location', 'Verified']],
      body: users.map(u => [u.name, u.blood_group, u.phone, u.location, u.is_verified ? 'Yes' : 'No']),
      startY: 20,
    });
    doc.save('donors_report.pdf');
  };

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-slate-500">প্ল্যাটফর্মের সকল কার্যক্রম এখান থেকে পরিচালনা করুন</p>
        </div>
        <button 
          onClick={exportPDF}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <FileText className="w-5 h-5" /> রিপোর্ট ডাউনলোড (PDF)
        </button>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
        {[
          { id: 'stats', label: 'পরিসংখ্যান', icon: BarChart3 },
          { id: 'users', label: 'দাতা ব্যবস্থাপনা', icon: UserPlus },
          { id: 'messages', label: 'মেসেজ বক্স', icon: MessageSquare },
          { id: 'cms', label: 'ওয়েবসাইট সেটিংস', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
              activeTab === tab.id ? "bg-red-500 text-white shadow-lg shadow-red-100" : "bg-white text-slate-500 hover:bg-slate-50"
            )}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && stats && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="text-slate-400 text-sm mb-2">মোট দাতা</div>
              <div className="text-4xl font-black text-slate-900">{stats.totalDonors}</div>
            </div>
            {/* More stat cards could go here */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-8">রক্তের গ্রুপ ডিস্ট্রিবিউশন</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.bloodDist}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="blood_group" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-8">দাতা অনুপাত</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.bloodDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="blood_group"
                    >
                      {stats.bloodDist.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 font-bold text-slate-900">নাম</th>
                  <th className="px-8 py-6 font-bold text-slate-900">গ্রুপ</th>
                  <th className="px-8 py-6 font-bold text-slate-900">ফোন</th>
                  <th className="px-8 py-6 font-bold text-slate-900">এলাকা</th>
                  <th className="px-8 py-6 font-bold text-slate-900">দান (বার)</th>
                  <th className="px-8 py-6 font-bold text-slate-900">শেষ দান</th>
                  <th className="px-8 py-6 font-bold text-slate-900">স্ট্যাটাস</th>
                  <th className="px-8 py-6 font-bold text-slate-900">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-medium text-slate-900">{user.name}</td>
                    <td className="px-8 py-6"><span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold">{user.blood_group}</span></td>
                    <td className="px-8 py-6 text-slate-500">{user.phone}</td>
                    <td className="px-8 py-6 text-slate-500">{user.location}</td>
                    <td className="px-8 py-6 text-slate-500 font-bold">{user.donation_count}</td>
                    <td className="px-8 py-6 text-slate-500 text-sm">
                      {user.last_donation_date ? new Date(user.last_donation_date).toLocaleDateString('bn-BD') : '-'}
                    </td>
                    <td className="px-8 py-6">
                      {user.is_verified ? (
                        <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4" /> ভেরিফাইড</span>
                      ) : (
                        <span className="text-orange-500 flex items-center gap-1 font-bold"><Clock className="w-4 h-4" /> পেন্ডিং</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleVerify(user.id, !user.is_verified)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            user.is_verified ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                          )}
                        >
                          {user.is_verified ? "রিজেক্ট" : "ভেরিফাই"}
                        </button>
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                          title="Edit Info"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setMessagingUser(user)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                          title="Send Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">ইনকামিং মেসেজ (ইউজার থেকে)</h3>
              <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-sm font-bold">
                {messages.filter(m => m.sender_type === 'user').length} টি মেসেজ
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-slate-400">কোনো মেসেজ পাওয়া যায়নি</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "p-8 flex gap-6 transition-colors",
                    msg.sender_type === 'admin' ? "bg-slate-50/30" : "hover:bg-slate-50/50"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      msg.sender_type === 'admin' ? "bg-slate-200 text-slate-600" : "bg-red-100 text-red-600"
                    )}>
                      {msg.sender_type === 'admin' ? <Settings className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-900">{msg.user_name}</span>
                          <span className="text-slate-400 text-sm ml-2">({msg.user_phone})</span>
                          {msg.sender_type === 'admin' && (
                            <span className="ml-3 bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">অ্যাডমিন থেকে</span>
                          )}
                        </div>
                        <span className="text-slate-400 text-xs">
                          {new Date(msg.sent_at).toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{msg.message}</p>
                      {msg.sender_type === 'user' && (
                        <button 
                          onClick={() => {
                            setMessagingUser({ id: msg.user_id, name: msg.user_name, phone: msg.user_phone } as any);
                            setMessageText(`আপনার মেসেজের উত্তর: `);
                          }}
                          className="mt-4 text-red-500 text-sm font-bold hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" /> উত্তর দিন
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cms' && (
        <div className="max-w-2xl space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-4">ওয়েবসাইট কন্টেন্ট</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ওয়েবসাইটের নাম</label>
                <input 
                  type="text" 
                  defaultValue={cms.site_name}
                  onBlur={(e) => onUpdateCMS('site_name', e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">হিরো টাইটেল</label>
                <input 
                  type="text" 
                  defaultValue={cms.hero_title}
                  onBlur={(e) => onUpdateCMS('hero_title', e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">হিরো সাবটাইটেল</label>
                <textarea 
                  defaultValue={cms.hero_subtitle}
                  onBlur={(e) => onUpdateCMS('hero_subtitle', e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-4">জরুরী নোটিশ</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">নোটিশ টেক্সট</label>
              <textarea 
                defaultValue={cms.important_notice}
                onBlur={(e) => onUpdateCMS('important_notice', e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">তথ্য আপডেট করুন</h3>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">নাম</label>
                  <input 
                    type="text" 
                    value={editingUser.name}
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">রক্তের গ্রুপ</label>
                    <select 
                      value={editingUser.blood_group}
                      onChange={e => setEditingUser({...editingUser, blood_group: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    >
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">ফোন</label>
                    <input 
                      type="text" 
                      value={editingUser.phone}
                      onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">এলাকা</label>
                  <input 
                    type="text" 
                    value={editingUser.location}
                    onChange={e => setEditingUser({...editingUser, location: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">দান (বার)</label>
                    <input 
                      type="number" 
                      value={editingUser.donation_count}
                      onChange={e => setEditingUser({...editingUser, donation_count: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">শেষ দান</label>
                    <input 
                      type="date" 
                      value={editingUser.last_donation_date || ''}
                      onChange={e => setEditingUser({...editingUser, last_donation_date: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "আপডেট হচ্ছে..." : "তথ্য সংরক্ষণ করুন"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message User Modal */}
      <AnimatePresence>
        {messagingUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMessagingUser(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">মেসেজ পাঠান</h3>
                <button onClick={() => setMessagingUser(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Recipient</div>
                <div className="text-blue-900 font-bold">{messagingUser.name} ({messagingUser.phone})</div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">আপনার মেসেজ</label>
                  <textarea 
                    required
                    placeholder="আপনার তথ্য আপডেট করার জন্য অনুরোধ করা হচ্ছে..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" /> {isSubmitting ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [cms, setCms] = useState<CMSData>({
    site_name: 'ব্লাড লাগবে?',
    hero_title: 'ব্লাড লাগবে?',
    hero_subtitle: 'রক্ত খুঁজুন, জীবন বাঁচান',
    important_notice: 'জরুরী প্রয়োজনে আমাদের হটলাইনে কল করুন: +৮৮০ ১২৩৪৫৬৭৮৯০'
  });

  useEffect(() => {
    fetch('/api/cms').then(res => res.json()).then(data => {
      if (Object.keys(data).length > 0) setCms(data as CMSData);
    });
  }, []);

  const updateCMS = async (key: string, value: string) => {
    await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    setCms(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-red-100 selection:text-red-600">
        <Navbar cms={cms} />
        
        {/* Important Notice Ticker */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-900 text-white py-3 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">জরুরী</div>
            <div className="text-sm font-medium whitespace-nowrap animate-marquee">
              {cms.important_notice}
            </div>
          </div>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home cms={cms} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard cms={cms} onUpdateCMS={updateCMS} />} />
            <Route path="/leaderboard" element={<div className="pt-32 pb-24 px-6 text-center">লিডারবোর্ড পেজ শীঘ্রই আসছে...</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
