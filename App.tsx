
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
  ChevronsRight
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
  Line
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
    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800 break-words">
        {value === undefined || value === null ? '-' : (typeof value === 'boolean' ? (value ? 'Aktif' : 'Tidak Aktif') : value)}
      </p>
    </div>
  </div>
);

const SidePanel = ({ packet, onClose }: { packet: RUPData | null, onClose: () => void }) => {
  if (!packet) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Detail Paket RUP</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">{packet.kd_rup}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          <div className="p-6 bg-indigo-50/50 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${packet.status_aktif_rup ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {packet.status_umumkan_rup}
              </span>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                T.A {packet.tahun_anggaran}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded uppercase tracking-tighter">
                RUP {packet.jenis_paket}
              </span>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Nama Paket</p>
              <h4 className="text-xl font-black text-slate-900 leading-tight">
                {packet.nama_paket}
              </h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Satuan Kerja</p>
              <h4 className="text-sm font-bold text-slate-700 leading-tight">
                {packet.nama_satker}
              </h4>
            </div>
          </div>

          <div className="space-y-1">
            <h5 className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-y border-slate-100">Informasi Teknis</h5>
            <DetailRow label="Volume Pekerjaan" value={packet.volume_pekerjaan} icon={Boxes} />
            <DetailRow label="Metode Pemilihan" value={packet.metode_pengadaan} icon={ClipboardList} />
            <DetailRow label="Spesifikasi" value={packet.spesifikasi_pekerjaan} icon={FileText} />
            <DetailRow label="Jenis Pengadaan" value={packet.jenis_pengadaan} icon={Tag} />
            <DetailRow label="MAK" value={packet.mak} icon={Hash} />
            
            <h5 className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-y border-slate-100 mt-4">Anggaran & Dana</h5>
            <DetailRow label="Pagu Anggaran" value={formatCurrency(packet.pagu)} icon={Coins} />
            <DetailRow label="Sumber Dana" value={packet.sumber_dana} icon={CheckCircle2} />
            <DetailRow label="Asal Dana" value={packet.asal_dana} icon={CheckCircle2} />

            <h5 className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-y border-slate-100 mt-4">Identitas</h5>
            <DetailRow label="Kode RUP" value={packet.kd_rup} icon={Tag} />
            <DetailRow label="Satker String" value={packet.kd_satker_str} icon={Hash} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 flex items-center justify-center gap-2">
            <Download size={18} />
            Cetak Detail
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

const PENYEDIA_PIE_COLORS = ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
const SWAKELOLA_PIE_COLORS = ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'];
const MONTHS_ORDER = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const App: React.FC = () => {
  const [data] = useState<RUPData[]>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'analysis'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSatker, setSelectedSatker] = useState('All');
  const [selectedJenisPaket, setSelectedJenisPaket] = useState('All');
  const [selectedMetode, setSelectedMetode] = useState('All');
  const [minPagu, setMinPagu] = useState<string>('');
  const [maxPagu, setMaxPagu] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<RUPData | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof RUPData | null, direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSatker, selectedJenisPaket, selectedMetode, minPagu, maxPagu]);

  // Derived data with filtering AND sorting
  const filteredAndSortedData = useMemo(() => {
    let result = data.filter(item => {
      const matchesSearch = item.nama_satker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kd_rup.toString().includes(searchTerm);
      const matchesSatker = selectedSatker === 'All' || item.nama_satker === selectedSatker;
      const matchesJenisPaket = selectedJenisPaket === 'All' || item.jenis_paket === selectedJenisPaket;
      const matchesMetode = selectedMetode === 'All' || item.metode_pengadaan === selectedMetode;
      const matchesMinPagu = minPagu === '' || item.pagu >= Number(minPagu);
      const matchesMaxPagu = maxPagu === '' || item.pagu <= Number(maxPagu);
      
      return matchesSearch && matchesSatker && matchesJenisPaket && matchesMetode && matchesMinPagu && matchesMaxPagu;
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
  }, [data, searchTerm, selectedSatker, selectedJenisPaket, selectedMetode, minPagu, maxPagu, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  const stats = useMemo(() => {
    if (data.length === 0) return { 
      totalPagu: 'Rp0', 
      totalPenyedia: 'Rp0',
      totalSwakelola: 'Rp0', 
      totalPaket: 0, 
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
    };
  }, [data]);

  const monthlyTrendData = useMemo(() => {
    const trend: Record<string, { pagu: number, paket: number }> = {};
    MONTHS_ORDER.forEach(m => trend[m] = { pagu: 0, paket: 0 });

    data.forEach(item => {
      if (trend[item.bulan_pengadaan]) {
        trend[item.bulan_pengadaan].pagu += item.pagu;
        trend[item.bulan_pengadaan].paket += 1;
      }
    });

    return MONTHS_ORDER.map(month => ({
      name: month,
      pagu: trend[month].pagu,
      paket: trend[month].paket
    }));
  }, [data]);

  const getAsalDanaDistribution = (items: RUPData[]) => {
    const distribution: Record<string, number> = {};
    items.forEach(item => {
      const label = item.asal_dana || 'Tidak Terdefinisi';
      distribution[label] = (distribution[label] || 0) + item.pagu;
    });
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0'
    }));
  };

  const asalDanaPenyediaData = useMemo(() => 
    getAsalDanaDistribution(data.filter(i => i.jenis_paket === "Penyedia")), 
  [data]);

  const asalDanaSwakelolaData = useMemo(() => 
    getAsalDanaDistribution(data.filter(i => i.jenis_paket === "Swakelola")), 
  [data]);

  const jenisPaketDistribution = useMemo(() => {
    const dist: Record<string, number> = { "Penyedia": 0, "Swakelola": 0 };
    data.forEach(item => {
      if (dist[item.jenis_paket] !== undefined) {
        dist[item.jenis_paket] += item.pagu;
      }
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [data]);

  const metodePengadaanData = useMemo(() => {
    const dist: Record<string, number> = {};
    data.forEach(item => {
      const method = item.metode_pengadaan || 'Lainnya';
      dist[method] = (dist[method] || 0) + item.pagu;
    });
    return Object.entries(dist).map(([name, pagu]) => ({ name, pagu }))
      .sort((a, b) => b.pagu - a.pagu);
  }, [data]);

  const jenisPengadaanData = useMemo(() => {
    const dist: Record<string, number> = {};
    data.forEach(item => {
      const category = item.jenis_pengadaan || 'Lainnya';
      dist[category] = (dist[category] || 0) + item.pagu;
    });
    return Object.entries(dist).map(([name, pagu]) => ({ name, pagu }))
      .sort((a, b) => b.pagu - a.pagu);
  }, [data]);

  const swakelolaPackages = useMemo(() => {
    return data.filter(item => item.jenis_paket === "Swakelola");
  }, [data]);

  const penyediaPackages = useMemo(() => {
    return data.filter(item => item.jenis_paket === "Penyedia");
  }, [data]);

  // Percentage summary of procurement types for provider packages
  const penyediaCategoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    penyediaPackages.forEach(pkg => {
      const cat = pkg.jenis_pengadaan || 'Lainnya';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const total = penyediaPackages.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0'
    })).sort((a, b) => Number(b.percentage) - Number(a.percentage));
  }, [penyediaPackages]);

  // Percentage summary of procurement types for swakelola packages
  const swakelolaCategoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    swakelolaPackages.forEach(pkg => {
      const cat = pkg.jenis_pengadaan || 'Lainnya';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const total = swakelolaPackages.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0'
    })).sort((a, b) => Number(b.percentage) - Number(a.percentage));
  }, [swakelolaPackages]);

  const satkerList = useMemo(() => ['All', ...Array.from(new Set(data.map(item => item.nama_satker)))], [data]);
  const metodeList = useMemo(() => ['All', ...Array.from(new Set(data.map(item => item.metode_pengadaan).filter(Boolean)))], [data]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analisa data RUP berikut dan berikan ringkasan eksekutif dalam Bahasa Indonesia. 
      Fokus pada total anggaran, sebaran paket antar Satker, dan identifikasi paket dengan pagu tertinggi secara kritis. 
      Gunakan format Markdown yang rapi.
      
      Data: ${JSON.stringify(data.map(d => ({ satker: d.nama_satker, pagu: d.pagu, paket: d.nama_paket, asal_dana: d.asal_dana })))}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text || "Tidak dapat menghasilkan analisis.");
      setNotification({ message: "Analisis AI selesai dibuat.", type: 'info' });
    } catch (error) {
      setAiAnalysis("Terjadi kesalahan saat menghubungi asisten AI. Pastikan API Key tersedia.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateData = () => {
    setNotification({ message: "Data RUP berhasil disinkronisasi.", type: 'success' });
  };

  const handleSort = (key: keyof RUPData) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
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
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} />
          <span className="font-bold tracking-tight">RUP MONITOR</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition-transform duration-300 ease-in-out z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">RUP Monitor</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            Ringkasan
          </button>
          <button 
            onClick={() => { setActiveTab('table'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'table' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TableIcon size={20} />
            Data Detail
          </button>
          <button 
            onClick={() => { setActiveTab('analysis'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'analysis' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Sparkles size={20} />
            Analisis AI
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Info Sistem</span>
            </div>
            <p className="text-xs text-slate-600">Versi 1.2.0-Alpha</p>
            <p className="text-xs text-slate-400 mt-1">TA 2026 - Muko Muko</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 hidden md:flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' ? 'Dashboard Monitoring' : activeTab === 'table' ? 'Tabel Data RUP' : 'Analisis Cerdas'}
            </h1>
            <p className="text-sm text-slate-500">Pemantauan Rencana Umum Pengadaan Kabupaten Muko Muko</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={18} />
              Export
            </button>
            <button 
              onClick={handleUpdateData}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              Update Data
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid Simplified to 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Pagu" 
                  value={stats.totalPagu} 
                  icon={BarChart3} 
                  color="bg-indigo-600" 
                  subValue="Seluruh Anggaran RUP"
                />
                <StatCard 
                  title="Total RUP Penyedia" 
                  value={stats.totalPenyedia} 
                  icon={Package} 
                  color="bg-blue-600" 
                  subValue="Skema Pengadaan Penyedia"
                />
                <StatCard 
                  title="Total RUP Swakelola" 
                  value={stats.totalSwakelola} 
                  icon={Briefcase} 
                  color="bg-amber-500" 
                  subValue="Skema Pengadaan Swakelola"
                />
                <StatCard 
                  title="Total Paket" 
                  value={stats.totalPaket} 
                  icon={FileText} 
                  color="bg-emerald-600" 
                  subValue="Jumlah Keseluruhan Paket"
                />
              </div>

              {/* Grouped PROCUREMENT TYPE Distribution (Side-by-Side) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PENYEDIA Group */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <Package size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Distribusi Jenis Pengadaan (Penyedia)</h3>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {penyediaPackages.length} Paket Penyedia
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    {penyediaCategoryStats.length > 0 ? penyediaCategoryStats.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="font-black text-blue-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Kategori Terdaftar</span>
                           <span className="text-blue-400">{item.count} Paket</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 flex flex-col items-center gap-3">
                         <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                           <AlertCircle size={24} />
                         </div>
                         <p className="text-sm font-medium text-slate-400 italic">Data Penyedia belum tersedia</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SWAKELOLA Group */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg text-white">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Distribusi Jenis Pengadaan (Swakelola)</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      {swakelolaPackages.length} Paket Swakelola
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    {swakelolaCategoryStats.length > 0 ? swakelolaCategoryStats.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="font-black text-amber-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Kategori Terdaftar</span>
                           <span className="text-amber-400">{item.count} Paket</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 flex flex-col items-center gap-3">
                         <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                           <AlertCircle size={24} />
                         </div>
                         <p className="text-sm font-medium text-slate-400 italic">Data Swakelola belum tersedia</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tren Pengadaan Bulanan */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Tren Pengadaan Bulanan</h3>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded bg-indigo-500 opacity-20 border border-indigo-500"></div>
                       Pagu Anggaran
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-0.5 bg-emerald-500"></div>
                       Jumlah Paket
                     </div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorPagu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={11} 
                        fontWeight={600}
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(val) => val.substring(0, 3)} 
                        stroke="#94a3b8"
                      />
                      <YAxis 
                        yId="left"
                        orientation="left"
                        tickFormatter={(val) => `Rp${val/1000000}jt`} 
                        fontSize={10} 
                        fontWeight={500}
                        axisLine={false} 
                        tickLine={false} 
                        stroke="#6366f1"
                        label={{ value: 'Total Pagu', angle: -90, position: 'insideLeft', offset: -10, fontSize: 10, fill: '#6366f1', fontWeight: 700 }}
                      />
                      <YAxis 
                        yId="right"
                        orientation="right"
                        fontSize={10} 
                        fontWeight={500}
                        axisLine={false} 
                        tickLine={false} 
                        stroke="#10b981"
                        label={{ value: 'Jml Paket', angle: 90, position: 'insideRight', offset: 10, fontSize: 10, fill: '#10b981', fontWeight: 700 }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === 'pagu') return [formatCurrency(value), 'Total Pagu'];
                          if (name === 'paket') return [value, 'Jumlah Paket'];
                          return [value, name];
                        }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
                        labelStyle={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}
                      />
                      <Area 
                        yId="left"
                        type="monotone" 
                        dataKey="pagu" 
                        name="pagu" 
                        stroke="#4f46e5" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorPagu)" 
                      />
                      <Line 
                        yId="right"
                        type="stepAfter" 
                        dataKey="paket" 
                        name="paket" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* NEW: Grafik Batang Baru Pagu per Metode Pengadaan */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                      <Gavel size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Analisis Pagu per Metode Pengadaan</h3>
                      <p className="text-xs text-slate-400 font-medium">Distribusi anggaran berdasarkan mekanisme pengadaan yang digunakan</p>
                    </div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metodePengadaanData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        fontWeight={700}
                        axisLine={false} 
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                        stroke="#64748b"
                      />
                      <YAxis 
                        tickFormatter={(val) => `Rp${val/1000000}jt`} 
                        fontSize={10} 
                        fontWeight={600}
                        axisLine={false} 
                        tickLine={false}
                        stroke="#64748b"
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Total Pagu']}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backgroundColor: '#1e293b',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                        cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                      />
                      <Bar 
                        dataKey="pagu" 
                        fill="#6366f1" 
                        radius={[6, 6, 0, 0]} 
                        barSize={50}
                        animationDuration={1500}
                      >
                         {metodePengadaanData.map((entry, index) => (
                          <Cell key={`cell-metode-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pagu Distribution Charts (Pie) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <Layers size={20} className="text-amber-500" />
                    Pagu per Jenis Paket
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={jenisPaketDistribution} 
                          innerRadius={60} 
                          outerRadius={80} 
                          paddingAngle={5} 
                          dataKey="value"
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {jenisPaketDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#f59e0b'} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {jenisPaketDistribution.map((item, index) => (
                      <div key={item.name} className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                          {index === 0 ? <Package size={16} className="text-indigo-600" /> : <Briefcase size={16} className="text-amber-600" />}
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <Tag size={20} className="text-indigo-600" />
                    Pagu per Jenis Pengadaan
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jenisPengadaanData} layout="vertical" margin={{ left: 20, right: 40, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" fontSize={10} axisLine={false} tickLine={false} width={120} />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="pagu" fill="#6366f1" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* COMPARATIVE FUND SOURCE DISTRIBUTION */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <PieIcon size={20} className="text-emerald-600" />
                    Distribusi Asal Anggaran: Penyedia vs Swakelola
                  </h3>
                  <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>Penyedia</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Swakelola</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Penyedia Fund Source */}
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-100">PENYEDIA</div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={asalDanaPenyediaData} 
                            cx="50%" cy="50%" 
                            labelLine={true} 
                            label={({ percentage }: any) => `${percentage}%`} 
                            outerRadius={80} 
                            dataKey="value"
                          >
                            {asalDanaPenyediaData.map((entry, index) => (
                              <Cell key={`cell-p-${index}`} fill={PENYEDIA_PIE_COLORS[index % PENYEDIA_PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {asalDanaPenyediaData.map((item, index) => (
                        <div key={item.name} className="flex flex-col p-2 rounded-lg border border-slate-50 bg-slate-50/50">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PENYEDIA_PIE_COLORS[index % PENYEDIA_PIE_COLORS.length] }}></div>
                            <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-black text-slate-900">{item.percentage}%</span>
                            <span className="text-[9px] text-slate-400">{formatCurrency(item.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Swakelola Fund Source */}
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-100">SWAKELOLA</div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={asalDanaSwakelolaData} 
                            cx="50%" cy="50%" 
                            labelLine={true} 
                            label={({ percentage }: any) => `${percentage}%`} 
                            outerRadius={80} 
                            dataKey="value"
                          >
                            {asalDanaSwakelolaData.map((entry, index) => (
                              <Cell key={`cell-s-${index}`} fill={SWAKELOLA_PIE_COLORS[index % SWAKELOLA_PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {asalDanaSwakelolaData.map((item, index) => (
                        <div key={item.name} className="flex flex-col p-2 rounded-lg border border-slate-50 bg-slate-50/50">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: SWAKELOLA_PIE_COLORS[index % SWAKELOLA_PIE_COLORS.length] }}></div>
                            <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-black text-slate-900">{item.percentage}%</span>
                            <span className="text-[9px] text-slate-400">{formatCurrency(item.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'table' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
              <div className="p-6 border-b border-slate-100 flex flex-col space-y-4 bg-white z-30">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Cari Nama Paket, Satker, atau Kode RUP..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Building2 className="text-slate-400" size={18} />
                      <select className="flex-1 lg:w-64 bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={selectedSatker} onChange={(e) => setSelectedSatker(e.target.value)}>
                        {satkerList.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Package className="text-slate-400" size={18} />
                      <select className="flex-1 lg:w-48 bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={selectedJenisPaket} onChange={(e) => setSelectedJenisPaket(e.target.value)}>
                        <option value="All">Semua Jenis Paket</option>
                        <option value="Penyedia">Penyedia</option>
                        <option value="Swakelola">Swakelola</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Gavel className="text-slate-400" size={18} />
                      <select className="flex-1 lg:w-48 bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={selectedMetode} onChange={(e) => setSelectedMetode(e.target.value)}>
                        {metodeList.map(m => <option key={m} value={m}>{m === 'All' ? 'Semua Metode' : m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto relative custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-800 text-white sticky top-0 z-20 shadow-md">
                    <tr>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700 first:rounded-tl-none last:rounded-tr-none" onClick={() => handleSort('kd_rup')}>
                        <div className="flex items-center gap-2">Kode RUP <SortIcon columnKey="kd_rup" isDark /></div>
                      </th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700" onClick={() => handleSort('nama_paket')}>
                        <div className="flex items-center gap-2">Nama Paket <SortIcon columnKey="nama_paket" isDark /></div>
                      </th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700" onClick={() => handleSort('nama_satker')}>
                        <div className="flex items-center gap-2">Satuan Kerja <SortIcon columnKey="nama_satker" isDark /></div>
                      </th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700" onClick={() => handleSort('pagu')}>
                        <div className="flex items-center gap-2">Pagu <SortIcon columnKey="pagu" isDark /></div>
                      </th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700" onClick={() => handleSort('metode_pengadaan')}>
                        <div className="flex items-center gap-2">Metode <SortIcon columnKey="metode_pengadaan" isDark /></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {paginatedData.map((item, index) => (
                      <tr 
                        key={item.kd_rup} 
                        className={`hover:bg-indigo-50/90 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`} 
                        onClick={() => setSelectedPacket(item)}
                      >
                        <td className="px-8 py-7 border-b border-slate-100">
                          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-200 group-hover:bg-indigo-200 group-hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-colors">{item.kd_rup}</span>
                        </td>
                        <td className="px-8 py-7 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition-colors line-clamp-2 max-w-md">{item.nama_paket}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1.5">{item.kd_satker_str}</p>
                        </td>
                        <td className="px-8 py-7 border-b border-slate-100">
                          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{item.nama_satker}</p>
                        </td>
                        <td className="px-8 py-7 border-b border-slate-100">
                          <span className="text-sm font-black text-indigo-700 bg-indigo-50/50 px-3 py-1 rounded-md">{formatCurrency(item.pagu)}</span>
                        </td>
                        <td className="px-8 py-7 border-b border-slate-100">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border tracking-widest ${item.jenis_paket === 'Swakelola' ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200 shadow-sm'}`}>
                            {item.metode_pengadaan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                    Menampilkan <span className="font-bold text-slate-900">{filteredAndSortedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> - <span className="font-bold text-slate-900">{Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)}</span> dari <span className="font-bold text-slate-900">{filteredAndSortedData.length}</span> data
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Baris:</span>
                    <select 
                      className="bg-slate-50 border border-slate-200 py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Pertama"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center px-4">
                    <span className="text-sm font-bold text-slate-700">
                      Halaman <span className="text-indigo-600">{currentPage}</span> / <span className="text-slate-400">{totalPages || 1}</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Berikutnya"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Terakhir"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg"><Sparkles className="text-white" /></div>
                  <h2 className="text-2xl font-bold">Wawasan Cerdas (AI Insights)</h2>
                </div>
                <p className="text-indigo-100 max-w-2xl mb-6">Analisis pintar khusus untuk paket Penyedia & Swakelola di Kabupaten Muko Muko.</p>
                <button onClick={handleAiAnalysis} disabled={isAnalyzing} className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isAnalyzing ? 'Menganalisis...' : 'Mulai Analisis Sekarang'}
                  {!isAnalyzing && <Sparkles size={18} />}
                </button>
              </div>
              {aiAnalysis && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
                   <div className="prose prose-slate max-w-none">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Hasil Analisis Strategis</h3>
                        <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-slate-600">Hapus</button>
                      </div>
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</div>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
