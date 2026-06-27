export interface Employee {
  id: string;
  name: string;
  nip: string; // NIP or '-' if Non-PNS/Contract
  pangkatGol: string; // Pangkat and Golongan (e.g., 'Penata - III/c')
  jabatan: string; // Position/Job title
}

export interface SuratTugas {
  id: string;
  nomorSurat: string;
  dasar: string[]; // List of references/legal bases
  pegawaiIds: string[]; // Employees assigned
  maksud: string; // Purpose of duty
  tempatTujuan: string; // Destination
  tanggalMulai: string; // Format: YYYY-MM-DD
  tanggalSelesai: string; // Format: YYYY-MM-DD
  pembebananAnggaran: string; // Budget source (e.g., DPA BOK Puskesmas Boyan Tanjung)
  tanggalSurat: string; // Date the letter is issued
  penandatanganNama: string;
  penandatanganNip: string;
  penandatanganPangkat: string;
  penandatanganJabatan: string;
}

export interface Companion {
  nama: string;
  tanggalLahir: string;
  keterangan: string;
}

export interface SPPD {
  id: string;
  suratTugasId?: string; // Optional link to Surat Tugas
  nomorSppd: string;
  pegawaiId: string; // Main employee traveling
  pejabatPemberiPerintah: string; // e.g. Kepala Puskesmas Boyan Tanjung
  tingkatBiaya: string; // e.g. A, B, C, or standard
  maksudPerjalanan: string;
  alatAngkutan: string; // e.g. Kendaraan Dinas, Speedboat, Motor
  tempatBerangkat: string; // e.g. Boyan Tanjung
  tempatTujuan: string;
  lamaPerjalanan: number; // in days
  tanggalBerangkat: string;
  tanggalKembali: string;
  pengikut: Companion[];
  instansi: string; // Puskesmas Boyan Tanjung
  mataAnggaran: string; // Budget code/source
  keteranganLain: string;
  tanggalSppd: string;
  penandatanganNama: string;
  penandatanganNip: string;
  penandatanganPangkat: string;
  penandatanganJabatan: string;
}

export interface KopSurat {
  pemerintah: string; // PEMERINTAH KABUPATEN KAPUAS HULU
  dinas: string; // DINAS KESEHATAN
  puskesmas: string; // UPTD PUSKESMAS BOYAN TANJUNG
  alamat: string;
  telepon: string;
  email: string;
  kodePos: string;
}

export interface LetterTemplate {
  kop: KopSurat;
  suratTugasDefaults: {
    dasarUmum: string[];
    pembebananAnggaran: string;
  };
  sppdDefaults: {
    pejabatPemberiPerintah: string;
    tingkatBiaya: string;
    alatAngkutan: string;
    tempatBerangkat: string;
    instansi: string;
    mataAnggaran: string;
  };
}

export interface AppSettings {
  namaPuskesmas: string;
  namaKepala: string;
  nipKepala: string;
  pangkatKepala: string;
  jabatanKepala: string;
  singkatanApp: string;
  namaPemerintah: string;
  namaDinas: string;
}
