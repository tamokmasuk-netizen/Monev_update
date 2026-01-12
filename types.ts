
export interface RUPData {
  asal_dana: string;
  asal_dana_klpd: string;
  asal_dana_satker: string;
  jenis_klpd: string;
  kd_kegiatan?: number;
  kd_rup: number;
  kd_satker: number;
  kd_satker_str: string;
  kd_subkegiatan?: number;
  mak: string;
  nama_paket: string;
  nama_klpd: string;
  nama_satker: string;
  pagu: number;
  status_aktif_rup: boolean;
  status_delete_rup: boolean;
  status_umumkan_rup: string;
  sumber_dana: string;
  tahun_anggaran: number;
  tahun_anggaran_dana: number;
  bulan_pengadaan: string; 
  jenis_paket: "Penyedia" | "Swakelola";
  metode_pengadaan?: string;
  volume_pekerjaan?: string;
  spesifikasi_pekerjaan?: string;
  jenis_pengadaan?: string; // New field for procurement category
}

export interface DashboardStats {
  totalPagu: number;
  totalPaket: number;
  uniqueSatkers: number;
  avgPagu: number;
}
