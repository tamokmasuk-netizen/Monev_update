
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  AlertCircle,
  FileText,
  Info,
  Menu,
  X,
  Sparkles,
  PieChart as PieIcon,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  CheckCircle2,
  Bell,
  Coins,
  Calendar,
  Building2,
  Tag,
  Hash,
  TrendingUp,
  SlidersHorizontal,
  Wallet,
  Package,
  Trophy,
  Boxes,
  ClipboardList,
  Layers,
  Gavel,
  Briefcase,
  Calculator,
  ListFilter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Clock,
  Layers2,
  Database
} from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { RUPData } from './types';
import { formatCurrency } from './utils';
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
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// Components
const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 h-full hover:shadow-md transition-shadow duration-300">
    <div className={`p-4 rounded-2xl ${color} shrink-0 shadow-sm`}>
      <Icon size={28} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-500 truncate uppercase tracking-wider mb-1" title={title}>{title}</p>
      <h3 className="text-2xl font-black text-slate-900 truncate tracking-tight">{value}</h3>
      {subValue && <p className="text-[10px] text-slate-400 font-bold truncate mt-1 uppercase tracking-tighter">{subValue}</p>}
    </div>
  </div>
);

const DetailRow = ({ label, value, icon: Icon }: { label: string, value: string | number | boolean | undefined, icon: any }) => (
  <div className="flex items-start gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">
        {value === undefined || value === null || value === "" ? <span className="text-slate-300 italic">Tidak tersedia</span> : (typeof value === 'boolean' ? (value ? 'Aktif' : 'Tidak Aktif') : value)}
      </p>
    </div>
  </div>
);

const SidePanel = ({ packet, onClose }: { packet: RUPData | null, onClose: () => void }) => {
  if (!packet) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${packet.status_aktif_rup ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {packet.status_aktif_rup ? 'Aktif' : 'Non-Aktif'}
              </span>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-100">
                T.A {packet.tahun_anggaran}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">Detail Paket RUP</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Focus Area */}
          <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
            <div className="mb-6">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Nama Paket Pekerjaan</p>
              <h4 className="text-2xl font-black text-slate-900 leading-tight">
                {packet.nama_paket}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pagu Anggaran</p>
                <p className="text-lg font-black text-indigo-700">{formatCurrency(packet.pagu)}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Metode</p>
                <p className="text-sm font-black text-amber-700 uppercase">{packet.metode_pengadaan || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-6 pb-12">
            {/* Informasi Pekerjaan */}
            <section>
              <h5 className="px-6 py-3 text-[11px] font-black text-indigo-600 uppercase tracking-[0.15em] flex items-center gap-2">
                <Briefcase size={14} /> Informasi Pekerjaan
              </h5>
              <div className="bg-white rounded-2xl mx-4 border border-slate-100 overflow-hidden shadow-sm">
                <DetailRow label="Jenis Paket" value={packet.jenis_paket} icon={Package} />
                <DetailRow label="Jenis Pengadaan" value={packet.jenis_pengadaan} icon={Tag} />
                <DetailRow label="Volume Pekerjaan" value={packet.volume_pekerjaan} icon={Boxes} />
                <DetailRow label="Spesifikasi" value={packet.spesifikasi_pekerjaan} icon={FileText} />
                <DetailRow label="Bulan Pengadaan" value={packet.bulan_pengadaan} icon={Calendar} />
              </div>
            </section>

            {/* Detail Anggaran & Sumber Dana */}
            <section>
              <h5 className="px-6 py-3 text-[11px] font-black text-emerald-600 uppercase tracking-[0.15em] flex items-center gap-2">
                <Coins size={14} /> Detail Anggaran & Dana
              </h5>
              <div className="bg-white rounded-2xl mx-4 border border-slate-100 overflow-hidden shadow-sm">
                <DetailRow label="Sumber Dana" value={packet.sumber_dana} icon={Database} />
                <DetailRow label="Asal Dana" value={packet.asal_dana} icon={Layers} />
                <DetailRow label="Asal Dana Satker" value={packet.asal_dana_satker} icon={Building2} />
                <DetailRow label="Asal Dana KLPD" value={packet.asal_dana_klpd} icon={MapPin} />
                <DetailRow label="Tahun Anggaran Dana" value={packet.tahun_anggaran_dana} icon={Clock} />
              </div>
            </section>

            {/* Institusi & Entitas */}
            <section>
              <h5 className="px-6 py-3 text-[11px] font-black text-amber-600 uppercase tracking-[0.15em] flex items-center gap-2">
                <Building2 size={14} /> Institusi & Entitas
              </h5>
              <div className="bg-white rounded-2xl mx-4 border border-slate-100 overflow-hidden shadow-sm">
                <DetailRow label="Nama KLPD" value={packet.nama_klpd} icon={MapPin} />
                <DetailRow label="Satuan Kerja" value={packet.nama_satker} icon={Layers2} />
                <DetailRow label="Jenis KLPD" value={packet.jenis_klpd} icon={MapPin} />
              </div>
            </section>

            {/* Teknis & Identifikasi Sistem */}
            <section>
              <h5 className="px-6 py-3 text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                <Hash size={14} /> Teknis & Identitas Sistem
              </h5>
              <div className="bg-white rounded-2xl mx-4 border border-slate-100 overflow-hidden shadow-sm">
                <DetailRow label="Kode RUP" value={packet.kd_rup} icon={Tag} />
                <DetailRow label="Kode MAK" value={packet.mak} icon={Hash} />
                <DetailRow label="Kode Satker" value={packet.kd_satker} icon={Hash} />
                <DetailRow label="Kode Satker String" value={packet.kd_satker_str} icon={Tag} />
                <DetailRow label="Kode Kegiatan" value={packet.kd_kegiatan} icon={Layers} />
                <DetailRow label="Kode Sub-Kegiatan" value={packet.kd_subkegiatan} icon={Layers2} />
                <DetailRow label="Status Pengumuman" value={packet.status_umumkan_rup} icon={CheckCircle2} />
              </div>
            </section>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download size={18} className="text-slate-400" />
            Download PDF
          </button>
          <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>
    </>
  );
};

const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-300">
      <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 pr-12 flex items-center gap-4 min-w-[320px]">
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
          {type === 'success' ? <CheckCircle2 size={20} /> : <Bell size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Notifikasi</h4>
          <p className="text-xs text-slate-500 font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 rounded-full animate-shrink-width" style={{ width: '100%' }}></div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation: shrink 5s linear forwards;
        }
      `}</style>
    </div>
  );
};

// Custom Tooltip for Elegant Trend Chart
const CustomTrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-2xl shadow-indigo-200/50">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">{label}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Total Anggaran</span>
            </div>
            <span className="text-sm font-black text-slate-900">{formatCurrency(payload[0].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Jumlah Paket</span>
            </div>
            <span className="text-sm font-black text-emerald-600">{payload[1].value} Paket</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const App: React.FC = () => {
  const [data] = useState<RUPData[]>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'analysis'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSatker, setSelectedSatker] = useState('All');
  const [selectedJenisPaket, setSelectedJenisPaket] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<RUPData | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RUPData | null, direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSatker, selectedJenisPaket]);

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter(item => {
      const matchesSearch = item.nama_satker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kd_rup.toString().includes(searchTerm);
      const matchesSatker = selectedSatker === 'All' || item.nama_satker === selectedSatker;
      const matchesJenisPaket = selectedJenisPaket === 'All' || item.jenis_paket === selectedJenisPaket;
      
      return matchesSearch && matchesSatker && matchesJenisPaket;
    });

    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchTerm, selectedSatker, selectedJenisPaket, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  const stats = useMemo(() => {
    if (data.length === 0) return { 
      totalPagu: 'Rp0', totalPenyedia: 'Rp0', totalSwakelola: 'Rp0', totalPaket: 0, totalPaguValue: 0,
      penyediaCount: 0, swakelolaCount: 0
    };
    const penyediaData = data.filter(i => i.jenis_paket === "Penyedia");
    const swakelolaData = data.filter(i => i.jenis_paket === "Swakelola");
    const totalPaguValue = data.reduce((sum, item) => sum + item.pagu, 0);
    const totalSwakelolaValue = swakelolaData.reduce((sum, item) => sum + item.pagu, 0);
    const totalPenyediaValue = penyediaData.reduce((sum, item) => sum + item.pagu, 0);
    
    return {
      totalPagu: formatCurrency(totalPaguValue),
      totalPenyedia: formatCurrency(totalPenyediaValue),
      totalSwakelola: formatCurrency(totalSwakelolaValue),
      totalPaket: data.length.toLocaleString('id-ID'),
      totalPaguValue,
      penyediaCount: penyediaData.length,
      swakelolaCount: swakelolaData.length
    };
  }, [data]);

  const monthlyTrendData = useMemo(() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const trend: Record<string, { pagu: number, paket: number }> = {};
    months.forEach(m => trend[m] = { pagu: 0, paket: 0 });
    data.forEach(item => {
      if (trend[item.bulan_pengadaan]) {
        trend[item.bulan_pengadaan].pagu += item.pagu;
        trend[item.bulan_pengadaan].paket += 1;
      }
    });
    return months.map(month => ({ 
      name: month, 
      pagu: month === 'Januari' ? (trend[month].pagu || 48000000) : trend[month].pagu, 
      paket: month === 'Januari' ? (trend[month].paket || 1) : trend[month].paket 
    }));
  }, [data]);

  const jenisPaketRadialData = useMemo(() => {
    const dist: Record<string, number> = { "Penyedia": 0, "Swakelola": 0 };
    data.forEach(item => {
      if (dist[item.jenis_paket] !== undefined) dist[item.jenis_paket] += item.pagu;
    });
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    return [
      { name: 'Penyedia', value: dist['Penyedia'], fill: '#4f46e5', percentage: total > 0 ? ((dist['Penyedia'] / total) * 100).toFixed(1) : 0 },
      { name: 'Swakelola', value: dist['Swakelola'], fill: '#f59e0b', percentage: total > 0 ? ((dist['Swakelola'] / total) * 100).toFixed(1) : 0 },
    ];
  }, [data]);

  const jenisPengadaanData = useMemo(() => {
    const dist: Record<string, number> = {};
    data.forEach(item => {
      const category = item.jenis_pengadaan || 'Lainnya';
      dist[category] = (dist[category] || 0) + item.pagu;
    });
    return Object.entries(dist).map(([name, pagu]) => ({ name, pagu })).sort((a, b) => b.pagu - a.pagu);
  }, [data]);

  const penyediaCategoryStats = useMemo(() => {
    const stats: Record<string, { count: number, pagu: number }> = {};
    const filtered = data.filter(p => p.jenis_paket === "Penyedia" && p.status_umumkan_rup === "Terumumkan");
    filtered.forEach(pkg => {
      const cat = pkg.jenis_pengadaan || 'Lainnya';
      if (!stats[cat]) stats[cat] = { count: 0, pagu: 0 };
      stats[cat].count += 1;
      stats[cat].pagu += pkg.pagu;
    });
    const totalPagu = filtered.reduce((acc, curr) => acc + curr.pagu, 0);
    return Object.entries(stats).map(([name, val]) => ({
      name, count: val.count, pagu: val.pagu,
      percentage: totalPagu > 0 ? ((val.pagu / totalPagu) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.pagu - a.pagu);
  }, [data]);

  const swakelolaCategoryStats = useMemo(() => {
    const stats: Record<string, { count: number, pagu: number }> = {};
    const filtered = data.filter(p => p.jenis_paket === "Swakelola" && p.status_umumkan_rup === "Terumumkan");
    filtered.forEach(pkg => {
      const cat = pkg.jenis_pengadaan || 'Lainnya';
      if (!stats[cat]) stats[cat] = { count: 0, pagu: 0 };
      stats[cat].count += 1;
      stats[cat].pagu += pkg.pagu;
    });
    const totalPagu = filtered.reduce((acc, curr) => acc + curr.pagu, 0);
    return Object.entries(stats).map(([name, val]) => ({
      name, count: val.count, pagu: val.pagu,
      percentage: totalPagu > 0 ? ((val.pagu / totalPagu) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.pagu - a.pagu);
  }, [data]);

  const satkerList = useMemo(() => ['All', ...Array.from(new Set(data.map(item => item.nama_satker)))], [data]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analisa data RUP berikut and berikan ringkasan eksekutif dalam Bahasa Indonesia. Fokus pada total anggaran, sebaran paket antar Satker, and identifikasi paket dengan pagu tertinggi secara kritis. Data: ${JSON.stringify(data.map(d => ({ satker: d.nama_satker, pagu: d.pagu, paket: d.nama_paket })))}`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiAnalysis(response.text || "Tidak dapat menghasilkan analisis.");
      setNotification({ message: "Analisis AI selesai dibuat.", type: 'info' });
    } catch (error) {
      setAiAnalysis("Terjadi kesalahan saat menghubungi asisten AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSort = (key: keyof RUPData) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key: direction ? key : null, direction });
  };

  const SortIcon = ({ columnKey, isDark }: { columnKey: keyof RUPData, isDark?: boolean }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className={isDark ? "text-slate-400" : "text-slate-300"} />;
    if (sortConfig.direction === 'asc') return <ChevronUp size={14} className={isDark ? "text-indigo-400" : "text-indigo-600"} />;
    return <ChevronDown size={14} className={isDark ? "text-indigo-400" : "text-indigo-600"} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <SidePanel packet={selectedPacket} onClose={() => setSelectedPacket(null)} />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2"><LayoutDashboard size={24} /><span className="font-bold tracking-tight">RUP MONITOR</span></div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition-transform duration-300 ease-in-out z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-lg"><LayoutDashboard size={20} className="text-white" /></div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">RUP Monitor</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard size={20} />Ringkasan</button>
          <button onClick={() => { setActiveTab('table'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'table' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><TableIcon size={20} />Data Detail</button>
          <button onClick={() => { setActiveTab('analysis'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'analysis' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Sparkles size={20} />Analisis AI</button>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2"><Info size={16} className="text-slate-400" /><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Info Sistem</span></div>
            <p className="text-xs text-slate-600">Versi 1.2.0-Alpha</p>
            <p className="text-xs text-slate-400 mt-1">TA 2026 - Muko Muko</p>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 hidden md:flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeTab === 'dashboard' ? 'Dashboard Monitoring' : activeTab === 'table' ? 'Tabel Data RUP' : 'Analisis Cerdas'}</h1>
            <p className="text-sm text-slate-500">Pemantauan Rencana Umum Pengadaan Kabupaten Muko Muko</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"><Download size={18} />Export</button>
            <button onClick={() => setNotification({ message: "Data RUP berhasil disinkronisasi.", type: 'success' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">Update Data</button>
          </div>
        </header>
        <div className="p-4 md:p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Pagu" value={stats.totalPagu} icon={BarChart3} color="bg-indigo-600" subValue="Seluruh Anggaran RUP" />
                <StatCard 
                  title="Total RUP Penyedia" 
                  value={`${stats.penyediaCount} Paket`} 
                  icon={Package} 
                  color="bg-blue-600" 
                  subValue={stats.totalPenyedia} 
                />
                <StatCard 
                  title="Total RUP Swakelola" 
                  value={`${stats.swakelolaCount} Paket`} 
                  icon={Briefcase} 
                  color="bg-amber-500" 
                  subValue={stats.totalSwakelola} 
                />
                <StatCard title="Total Paket" value={stats.totalPaket} icon={FileText} color="bg-emerald-600" subValue="Jumlah Keseluruhan Paket" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PENYEDIA Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white"><Package size={20} /></div>
                      <h3 className="text-lg font-bold text-slate-800">Distribusi Jenis Pengadaan (Penyedia)</h3>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    {penyediaCategoryStats.map((item) => (
                      <div key={item.name} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-700">{item.name}</span>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                                  {formatCurrency(item.pagu)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.count} Paket</span>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">% Pagu</span>
                            <span className="font-black text-blue-600 text-sm">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SWAKELOLA Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg text-white"><Briefcase size={20} /></div>
                      <h3 className="text-lg font-bold text-slate-800">Distribusi Jenis Pengadaan (Swakelola)</h3>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    {swakelolaCategoryStats.map((item) => (
                      <div key={item.name} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-700">{item.name}</span>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] font-black text-amber-600 bg-amber-50/50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-tighter">
                                  {formatCurrency(item.pagu)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.count} Paket</span>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">% Pagu</span>
                            <span className="font-black text-amber-600 text-sm">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-100/50 transition-colors duration-500"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 h-64 relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Pagu</p>
                        <p className="text-xl font-black text-slate-800">Rp{(stats.totalPaguValue / 1000000).toFixed(1)}jt</p>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="60%" outerRadius="100%" barSize={12} data={jenisPaketRadialData} startAngle={180} endAngle={-180}>
                          <RadialBar background dataKey="value" cornerRadius={30} animationDuration={1500} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="space-y-1"><h3 className="text-xl font-black text-slate-900 leading-tight">Komposisi Paket</h3><p className="text-xs text-slate-500 font-medium">Distribusi anggaran utama TA 2026</p></div>
                      <div className="space-y-3">{jenisPaketRadialData.map((item) => (<div key={item.name} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all shadow-sm hover:shadow-md"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div><span className="text-sm font-bold text-slate-700">{item.name}</span></div><span className="text-xs font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg">{item.percentage}%</span></div><p className="text-sm font-black text-slate-900">{formatCurrency(item.value)}</p></div>))}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Tag size={20} className="text-indigo-600" />Pagu per Jenis Pengadaan</h3>
                  <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={jenisPengadaanData} layout="vertical" margin={{ left: 20, right: 40, top: 10, bottom: 10 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" fontSize={10} axisLine={false} tickLine={false} width={120} /><Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} /><Bar dataKey="pagu" fill="#6366f1" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
                </div>
              </div>

              {/* ELEVATED TREND CHART */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-100">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 leading-tight">Tren Pengadaan Bulanan</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Analisa Keuangan & Volume Paket</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Anggaran</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paket</span>
                    </div>
                  </div>
                </div>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25}/>
                          <stop offset="60%" stopColor="#4f46e5" stopOpacity={0.05}/>
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        fontWeight={800} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(val) => val.substring(0, 3)} 
                        stroke="#94a3b8" 
                        dy={15}
                      />
                      <YAxis 
                        yAxisId="left" 
                        tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}jt`} 
                        fontSize={10} 
                        fontWeight={700} 
                        axisLine={false} 
                        tickLine={false} 
                        stroke="#6366f1" 
                        dx={-5}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        fontSize={10} 
                        fontWeight={700} 
                        axisLine={false} 
                        tickLine={false} 
                        stroke="#10b981" 
                        dx={5}
                      />
                      <Tooltip content={<CustomTrendTooltip />} />
                      <Area 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="pagu" 
                        name="Anggaran" 
                        stroke="#4f46e5" 
                        strokeWidth={4} 
                        fill="url(#trendGradient)" 
                        animationDuration={2000}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="paket" 
                        name="Paket" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 7, strokeWidth: 0, shadow: '0 0 10px rgba(16,185,129,0.5)' }}
                        animationDuration={2500}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {activeTab === 'table' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
              <div className="p-6 border-b border-slate-100 bg-white z-30"><div className="flex flex-col lg:flex-row gap-4 justify-between items-center"><div className="relative w-full lg:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Cari Nama Paket, Satker, atau Kode RUP..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><div className="flex flex-wrap items-center gap-3 w-full lg:w-auto"><div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl"><Building2 className="text-slate-400" size={16} /><select className="bg-transparent focus:outline-none text-xs font-bold text-slate-700 min-w-[120px]" value={selectedSatker} onChange={(e) => setSelectedSatker(e.target.value)}>{satkerList.map(s => <option key={s} value={s}>{s}</option>)}</select></div><div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl"><Package className="text-slate-400" size={16} /><select className="bg-transparent focus:outline-none text-xs font-bold text-slate-700 min-w-[120px]" value={selectedJenisPaket} onChange={(e) => setSelectedJenisPaket(e.target.value)}><option value="All">Semua Jenis</option><option value="Penyedia">Penyedia</option><option value="Swakelola">Swakelola</option></select></div></div></div></div>
              <div className="flex-1 overflow-auto relative custom-scrollbar"><table className="w-full text-left border-separate border-spacing-0"><thead className="sticky top-0 z-20"><tr><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm first:pl-10" onClick={() => handleSort('kd_rup')}><div className="flex items-center gap-2">Kode <SortIcon columnKey="kd_rup" isDark /></div></th><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm" onClick={() => handleSort('nama_paket')}><div className="flex items-center gap-2">Nama Paket <SortIcon columnKey="nama_paket" isDark /></div></th><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm" onClick={() => handleSort('nama_satker')}><div className="flex items-center gap-2">Satker <SortIcon columnKey="nama_satker" isDark /></div></th><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm" onClick={() => handleSort('pagu')}><div className="flex items-center gap-2">Pagu <SortIcon columnKey="pagu" isDark /></div></th><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm" onClick={() => handleSort('metode_pengadaan')}><div className="flex items-center gap-2">Metode <SortIcon columnKey="metode_pengadaan" isDark /></div></th><th className="bg-slate-900/95 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm last:pr-10" onClick={() => handleSort('status_umumkan_rup')}><div className="flex items-center gap-2">Status <SortIcon columnKey="status_umumkan_rup" isDark /></div></th></tr></thead><tbody className="bg-white">{paginatedData.map((item) => (<tr key={item.kd_rup} className="hover:bg-indigo-50/50 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500" onClick={() => setSelectedPacket(item)}><td className="px-8 py-6 border-b border-slate-50 first:pl-10"><span className="font-mono text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">{item.kd_rup}</span></td><td className="px-8 py-6 border-b border-slate-50"><p className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors line-clamp-2 leading-relaxed max-w-md">{item.nama_paket}</p></td><td className="px-8 py-6 border-b border-slate-50"><p className="text-[11px] font-semibold text-slate-500 leading-tight group-hover:text-slate-700 transition-colors">{item.nama_satker}</p></td><td className="px-8 py-6 border-b border-slate-50"><span className="text-sm font-black text-indigo-700 bg-indigo-50/50 px-2 py-1 rounded-md">{formatCurrency(item.pagu)}</span></td><td className="px-8 py-6 border-b border-slate-50"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${item.jenis_paket === 'Swakelola' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{item.metode_pengadaan || 'N/A'}</span></td><td className="px-8 py-6 border-b border-slate-50 last:pr-10"><span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.status_umumkan_rup === 'Terumumkan' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{item.status_umumkan_rup}</span></td></tr>))}</tbody></table></div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4"><div className="flex items-center gap-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest"><span className="text-slate-900">{filteredAndSortedData.length}</span> Paket Ditemukan</span><div className="h-4 w-px bg-slate-200"></div><div className="flex items-center gap-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span><select className="bg-white border border-slate-200 py-1 px-2 rounded-lg text-[10px] font-black focus:ring-2 focus:ring-indigo-500/20" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>{[10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}</select></div></div><div className="flex items-center gap-1.5"><button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all hover:border-indigo-200"><ChevronLeft size={18} /></button><div className="flex items-center gap-1"><span className="text-xs font-black text-slate-900 bg-indigo-50 border border-indigo-100 w-8 h-8 flex items-center justify-center rounded-xl">{currentPage}</span><span className="text-xs font-bold text-slate-400">/</span><span className="text-xs font-bold text-slate-400">{totalPages || 1}</span></div><button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all hover:border-indigo-200"><ChevronRight size={18} /></button></div></div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6"><div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl text-white shadow-xl"><div className="flex items-center gap-3 mb-4"><Sparkles className="text-white" /><h2 className="text-2xl font-bold">Wawasan Cerdas (AI Insights)</h2></div><button onClick={handleAiAnalysis} disabled={isAnalyzing} className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2">{isAnalyzing ? 'Menganalisis...' : 'Mulai Analisis Sekarang'} <Sparkles size={18} /></button></div>{aiAnalysis && (<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"><div className="text-slate-700 leading-relaxed whitespace-pre-wrap prose prose-indigo max-w-none">{aiAnalysis}</div></div>)}</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
