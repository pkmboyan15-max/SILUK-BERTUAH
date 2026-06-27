import { Employee, LetterTemplate, AppSettings, SuratTugas, SPPD } from "../types";

export const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Ahmad Faisal, S.Kep., Ners",
    nip: "19820512 200501 1 004",
    pangkatGol: "Penata Tk. I - III/d",
    jabatan: "Kepala UPTD Puskesmas Boyan Tanjung"
  },
  {
    id: "emp-2",
    name: "dr. Hendra Wijaya",
    nip: "19901115 201801 1 001",
    pangkatGol: "Penata Muda Tk. I - III/b",
    jabatan: "Dokter Ahli Pertama"
  },
  {
    id: "emp-3",
    name: "Maria Ulfah, A.Md.Keb",
    nip: "19850403 200804 2 002",
    pangkatGol: "Penata - III/c",
    jabatan: "Bidan Penyelia"
  },
  {
    id: "emp-4",
    name: "Supardi, A.Md.Kep",
    nip: "19880720 201101 1 003",
    pangkatGol: "Penata Muda - III/a",
    jabatan: "Perawat Pelaksana Lanjutan"
  },
  {
    id: "emp-5",
    name: "Sri Wahyuni, A.Md.Keb",
    nip: "-",
    pangkatGol: "-",
    jabatan: "Bidan Desa Nanga Boyan"
  },
  {
    id: "emp-6",
    name: "Rian Hidayat, A.Md.Kep",
    nip: "-",
    pangkatGol: "-",
    jabatan: "Perawat Honorer Puskesmas"
  },
  {
    id: "emp-7",
    name: "Yulia Fitri, A.Md.Far",
    nip: "19940218 202012 2 005",
    pangkatGol: "Penata Muda - III/a",
    jabatan: "Asisten Apoteker Pelaksana"
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  namaPuskesmas: "UPTD Puskesmas Boyan Tanjung",
  namaKepala: "Ahmad Faisal, S.Kep., Ners",
  nipKepala: "19820512 200501 1 004",
  pangkatKepala: "Penata Tk. I - III/d",
  jabatanKepala: "Kepala UPTD Puskesmas Boyan Tanjung",
  singkatanApp: "SILUK BERTUAH",
  namaPemerintah: "PEMERINTAH KABUPATEN KAPUAS HULU",
  namaDinas: "DINAS KESEHATAN"
};

export const DEFAULT_TEMPLATE: LetterTemplate = {
  kop: {
    pemerintah: "PEMERINTAH KABUPATEN KAPUAS HULU",
    dinas: "DINAS KESEHATAN",
    puskesmas: "UPTD PUSKESMAS BOYAN TANJUNG",
    alamat: "Jl. Lintas Selatan, Kecamatan Boyan Tanjung, Kabupaten Kapuas Hulu",
    telepon: "0812-3456-7890",
    email: "pkmboyantanjung@gmail.com",
    kodePos: "78757"
  },
  suratTugasDefaults: {
    dasarUmum: [
      "Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan",
      "Peraturan Menteri Kesehatan Nomor 43 Tahun 2019 tentang Pusat Kesehatan Masyarakat",
      "Dokumen Pelaksanaan Anggaran (DPA) UPTD Puskesmas Boyan Tanjung Tahun Anggaran 2026"
    ],
    pembebananAnggaran: "DPA-BOK UPTD Puskesmas Boyan Tanjung Tahun Anggaran 2026"
  },
  sppdDefaults: {
    pejabatPemberiPerintah: "Kepala UPTD Puskesmas Boyan Tanjung",
    tingkatBiaya: "Tingkat C",
    alatAngkutan: "Kendaraan Roda Dua / Air",
    tempatBerangkat: "Puskesmas Boyan Tanjung",
    instansi: "UPTD Puskesmas Boyan Tanjung",
    mataAnggaran: "DPA-BOK 1.02.02.2.02.0033"
  }
};

export const DEFAULT_SURAT_TUGAS: SuratTugas[] = [
  {
    id: "st-1",
    nomorSurat: "800 / 124 / PKM-BT / VI / 2026",
    dasar: [
      "Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan",
      "Surat Undangan Dinas Kesehatan Pengendalian Penduduk dan Keluarga Berencana Kabupaten Kapuas Hulu Nomor 005/112/DKKB/2026 tanggal 15 Juni 2026 perihal Pertemuan Evaluasi KIA.",
      "Dokumen Pelaksanaan Anggaran (DPA) UPTD Puskesmas Boyan Tanjung Tahun Anggaran 2026"
    ],
    pegawaiIds: ["emp-3", "emp-5"],
    maksud: "Melaksanakan Pertemuan Evaluasi Pelayanan KIA dan KB Tingkat Kabupaten Kapuas Hulu",
    tempatTujuan: "Dinas Kesehatan, Putussibau",
    tanggalMulai: "2026-06-25",
    tanggalSelesai: "2026-06-27",
    pembebananAnggaran: "DPA-BOK UPTD Puskesmas Boyan Tanjung Tahun Anggaran 2026",
    tanggalSurat: "2026-06-23",
    penandatanganNama: "Ahmad Faisal, S.Kep., Ners",
    penandatanganNip: "19820512 200501 1 004",
    penandatanganPangkat: "Penata Tk. I - III/d",
    penandatanganJabatan: "Kepala UPTD Puskesmas Boyan Tanjung"
  },
  {
    id: "st-2",
    nomorSurat: "800 / 125 / PKM-BT / VI / 2026",
    dasar: [
      "Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan",
      "Rencana Kerja Puskesmas Boyan Tanjung Tahun 2026 perihal Pelayanan Imunisasi Rutin di Posyandu"
    ],
    pegawaiIds: ["emp-4", "emp-6"],
    maksud: "Melaksanakan kegiatan Pelayanan Posyandu Bayi/Balita dan Imunisasi Rutin",
    tempatTujuan: "Desa Nanga Boyan, Kecamatan Boyan Tanjung",
    tanggalMulai: "2026-06-28",
    tanggalSelesai: "2026-06-28",
    pembebananAnggaran: "DPA-BOK UPTD Puskesmas Boyan Tanjung Tahun Anggaran 2026",
    tanggalSurat: "2026-06-24",
    penandatanganNama: "Ahmad Faisal, S.Kep., Ners",
    penandatanganNip: "19820512 200501 1 004",
    penandatanganPangkat: "Penata Tk. I - III/d",
    penandatanganJabatan: "Kepala UPTD Puskesmas Boyan Tanjung"
  }
];

export const DEFAULT_SPPD: SPPD[] = [
  {
    id: "sppd-1",
    suratTugasId: "st-1",
    nomorSppd: "090 / 231 / SPPD / PKM-BT / VI / 2026",
    pegawaiId: "emp-3",
    pejabatPemberiPerintah: "Kepala UPTD Puskesmas Boyan Tanjung",
    tingkatBiaya: "Tingkat C",
    maksudPerjalanan: "Melaksanakan Pertemuan Evaluasi Pelayanan KIA dan KB Tingkat Kabupaten Kapuas Hulu",
    alatAngkutan: "Kendaraan Roda Dua / Air",
    tempatBerangkat: "Puskesmas Boyan Tanjung",
    tempatTujuan: "Dinas Kesehatan, Putussibau",
    lamaPerjalanan: 3,
    tanggalBerangkat: "2026-06-25",
    tanggalKembali: "2026-06-27",
    pengikut: [
      {
        nama: "Sri Wahyuni, A.Md.Keb",
        tanggalLahir: "1992-08-14",
        keterangan: "Bidan Pendamping"
      }
    ],
    instansi: "UPTD Puskesmas Boyan Tanjung",
    mataAnggaran: "DPA-BOK 1.02.02.2.02.0033",
    keteranganLain: "-",
    tanggalSppd: "2026-06-23",
    penandatanganNama: "Ahmad Faisal, S.Kep., Ners",
    penandatanganNip: "19820512 200501 1 004",
    penandatanganPangkat: "Penata Tk. I - III/d",
    penandatanganJabatan: "Kepala UPTD Puskesmas Boyan Tanjung"
  }
];
