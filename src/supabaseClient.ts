import { createClient } from "@supabase/supabase-js";
import { Employee, SuratTugas, SPPD, LetterTemplate, AppSettings } from "./types";

// Supabase Configuration using Environment Variables or direct user fallback credentials
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://lqkgpjsijpokfbtucccd.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxa2dwanNpanBva2ZidHVjY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDAzNzMsImV4cCI6MjA5ODExNjM3M30.Bml0vunJpcGZXMbgM1UGZjJzZq6wz7no_USvBazQBuE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper state to track connection details
export interface SupabaseSyncStatus {
  connected: boolean;
  errorMsg: string | null;
  tablesStatus: {
    employees: boolean;
    suratTugas: boolean;
    sppd: boolean;
    template: boolean;
    settings: boolean;
    password: boolean;
  };
}

// SQL helper script to bootstrap user's Supabase instance
export const SUPABASE_SQL_SETUP = `-- SQL SCHEMA UNTUK SILUK BERTUAH (SUPABASE)
-- Copy & Paste script ini ke "SQL Editor" di dashboard Supabase Anda dan klik "Run"

-- 1. Tabel Password
CREATE TABLE IF NOT EXISTS siluk_password (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT INTO siluk_password (key, value) 
VALUES ('admin_password', 'boyantanjung123') 
ON CONFLICT (key) DO NOTHING;

-- 2. Tabel Settings
CREATE TABLE IF NOT EXISTS siluk_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 3. Tabel Template
CREATE TABLE IF NOT EXISTS siluk_template (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 4. Tabel Pegawai / Employees
CREATE TABLE IF NOT EXISTS siluk_employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nip TEXT NOT NULL,
  "pangkatGol" TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Surat Tugas
CREATE TABLE IF NOT EXISTS siluk_surat_tugas (
  id TEXT PRIMARY KEY,
  "nomorSurat" TEXT NOT NULL,
  dasar JSONB NOT NULL,
  "pegawaiIds" JSONB NOT NULL,
  maksud TEXT NOT NULL,
  "tempatTujuan" TEXT NOT NULL,
  "tanggalSurat" TEXT NOT NULL,
  "tanggalMulai" TEXT NOT NULL,
  "tanggalSelesai" TEXT NOT NULL,
  "pembebananAnggaran" TEXT NOT NULL,
  "penandatanganNama" TEXT NOT NULL,
  "penandatanganNip" TEXT NOT NULL,
  "penandatanganPangkat" TEXT NOT NULL,
  "penandatanganJabatan" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel SPPD
CREATE TABLE IF NOT EXISTS siluk_sppd (
  id TEXT PRIMARY KEY,
  "suratTugasId" TEXT,
  "nomorSppd" TEXT NOT NULL,
  "pegawaiId" TEXT NOT NULL,
  "pejabatPemberiPerintah" TEXT NOT NULL,
  "tingkatBiaya" TEXT NOT NULL,
  "maksudPerjalanan" TEXT NOT NULL,
  "alatAngkutan" TEXT NOT NULL,
  "tempatBerangkat" TEXT NOT NULL,
  "tempatTujuan" TEXT NOT NULL,
  "lamaPerjalanan" INTEGER NOT NULL,
  "tanggalBerangkat" TEXT NOT NULL,
  "tanggalKembali" TEXT NOT NULL,
  pengikut JSONB NOT NULL,
  instansi TEXT NOT NULL,
  "mataAnggaran" TEXT NOT NULL,
  "keteranganLain" TEXT NOT NULL,
  "tanggalSppd" TEXT NOT NULL,
  "penandatanganNama" TEXT NOT NULL,
  "penandatanganNip" TEXT NOT NULL,
  "penandatanganPangkat" TEXT NOT NULL,
  "penandatanganJabatan" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS) bypass atau aturan baca/tulis jika diperlukan.
-- Secara default, jika RLS dinonaktifkan di tabel Supabase, Anda dapat langsung melakukan operasi CRUD.
-- Jika ingin mengaktifkan akses publik anonim tanpa otentikasi login Supabase, pastikan RLS dinonaktifkan atau buat policy berikut:
ALTER TABLE siluk_password DISABLE ROW LEVEL SECURITY;
ALTER TABLE siluk_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE siluk_template DISABLE ROW LEVEL SECURITY;
ALTER TABLE siluk_employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE siluk_surat_tugas DISABLE ROW LEVEL SECURITY;
ALTER TABLE siluk_sppd DISABLE ROW LEVEL SECURITY;
`;

/**
 * Checks which tables are available on Supabase
 */
export async function testSupabaseConnection(): Promise<SupabaseSyncStatus> {
  const status: SupabaseSyncStatus = {
    connected: false,
    errorMsg: null,
    tablesStatus: {
      employees: false,
      suratTugas: false,
      sppd: false,
      template: false,
      settings: false,
      password: false
    }
  };

  try {
    // Test a basic call to check reachability
    const { error: pingError } = await supabase.from("siluk_password").select("key").limit(1);
    
    // If we can connect to the project (even if table is missing), we mark it as reachable
    status.connected = true;

    if (pingError) {
      if (pingError.code !== "PGRST116" && pingError.code !== "PGRST100" && pingError.code !== "42P01") {
        status.connected = false;
        status.errorMsg = pingError.message;
        return status;
      }
    }

    // Checking each individual table existence by selecting 1 row
    const checkTable = async (tableName: string) => {
      const { error } = await supabase.from(tableName).select("*").limit(1);
      return !error || error.code !== "42P01"; // 42P01 is "relation does not exist" in postgres
    };

    status.tablesStatus.password = await checkTable("siluk_password");
    status.tablesStatus.settings = await checkTable("siluk_settings");
    status.tablesStatus.template = await checkTable("siluk_template");
    status.tablesStatus.employees = await checkTable("siluk_employees");
    status.tablesStatus.suratTugas = await checkTable("siluk_surat_tugas");
    status.tablesStatus.sppd = await checkTable("siluk_sppd");

  } catch (err: any) {
    status.connected = false;
    status.errorMsg = err.message || "Gagal menghubungi server Supabase.";
  }

  return status;
}

/**
 * Sync LocalStorage with Supabase Database (Push & Pull logic)
 */
export async function pullDataFromSupabase() {
  const data = {
    employees: null as Employee[] | null,
    suratTugas: null as SuratTugas[] | null,
    sppd: null as SPPD[] | null,
    template: null as LetterTemplate | null,
    settings: null as AppSettings | null,
    password: null as string | null
  };

  try {
    // 1. Employees
    const { data: emps, error: empErr } = await supabase.from("siluk_employees").select("*").order("name", { ascending: true });
    if (!empErr && emps) {
      data.employees = emps.map(e => ({
        id: e.id,
        name: e.name,
        nip: e.nip,
        pangkatGol: e.pangkatGol,
        jabatan: e.jabatan
      }));
    }

    // 2. Surat Tugas
    const { data: sts, error: stErr } = await supabase.from("siluk_surat_tugas").select("*").order("created_at", { ascending: false });
    if (!stErr && sts) {
      data.suratTugas = sts.map(st => ({
        id: st.id,
        nomorSurat: st.nomorSurat,
        dasar: Array.isArray(st.dasar) ? st.dasar : [],
        pegawaiIds: Array.isArray(st.pegawaiIds) ? st.pegawaiIds : [],
        maksud: st.maksud,
        tempatTujuan: st.tempatTujuan,
        tanggalMulai: st.tanggalMulai,
        tanggalSelesai: st.tanggalSelesai,
        pembebananAnggaran: st.pembebananAnggaran,
        tanggalSurat: st.tanggalSurat,
        penandatanganNama: st.penandatanganNama,
        penandatanganNip: st.penandatanganNip,
        penandatanganPangkat: st.penandatanganPangkat,
        penandatanganJabatan: st.penandatanganJabatan
      }));
    }

    // 3. SPPD
    const { data: sppds, error: sppdErr } = await supabase.from("siluk_sppd").select("*").order("created_at", { ascending: false });
    if (!sppdErr && sppds) {
      data.sppd = sppds.map(s => ({
        id: s.id,
        suratTugasId: s.suratTugasId,
        nomorSppd: s.nomorSppd,
        pegawaiId: s.pegawaiId,
        pejabatPemberiPerintah: s.pejabatPemberiPerintah,
        tingkatBiaya: s.tingkatBiaya,
        maksudPerjalanan: s.maksudPerjalanan,
        alatAngkutan: s.alatAngkutan,
        tempatBerangkat: s.tempatBerangkat,
        tempatTujuan: s.tempatTujuan,
        lamaPerjalanan: s.lamaPerjalanan,
        tanggalBerangkat: s.tanggalBerangkat,
        tanggalKembali: s.tanggalKembali,
        pengikut: Array.isArray(s.pengikut) ? s.pengikut : [],
        instansi: s.instansi,
        mataAnggaran: s.mataAnggaran,
        keteranganLain: s.keteranganLain,
        tanggalSppd: s.tanggalSppd,
        penandatanganNama: s.penandatanganNama,
        penandatanganNip: s.penandatanganNip,
        penandatanganPangkat: s.penandatanganPangkat,
        penandatanganJabatan: s.penandatanganJabatan
      }));
    }

    // 4. Template
    const { data: tpls, error: tplErr } = await supabase.from("siluk_template").select("value").eq("id", "default").maybeSingle();
    if (!tplErr && tpls && tpls.value) {
      data.template = tpls.value as LetterTemplate;
    }

    // 5. Settings
    const { data: setts, error: settErr } = await supabase.from("siluk_settings").select("value").eq("id", "default").maybeSingle();
    if (!settErr && setts && setts.value) {
      data.settings = setts.value as AppSettings;
    }

    // 6. Password
    const { data: pw, error: pwErr } = await supabase.from("siluk_password").select("value").eq("key", "admin_password").maybeSingle();
    if (!pwErr && pw) {
      data.password = pw.value;
    }

  } catch (err) {
    console.warn("Gagal menarik data dari Supabase (beberapa tabel mungkin belum ada):", err);
  }

  return data;
}

/**
 * Upsert dynamic single employee
 */
export async function supabaseUpsertEmployee(emp: Employee) {
  return supabase.from("siluk_employees").upsert({
    id: emp.id,
    name: emp.name,
    nip: emp.nip,
    pangkatGol: emp.pangkatGol,
    jabatan: emp.jabatan
  });
}

/**
 * Delete single employee
 */
export async function supabaseDeleteEmployee(id: string) {
  return supabase.from("siluk_employees").delete().eq("id", id);
}

/**
 * Upsert dynamic single Surat Tugas
 */
export async function supabaseUpsertSuratTugas(st: SuratTugas) {
  return supabase.from("siluk_surat_tugas").upsert({
    id: st.id,
    nomorSurat: st.nomorSurat,
    dasar: st.dasar,
    pegawaiIds: st.pegawaiIds,
    maksud: st.maksud,
    tempatTujuan: st.tempatTujuan,
    tanggalMulai: st.tanggalMulai,
    tanggalSelesai: st.tanggalSelesai,
    pembebananAnggaran: st.pembebananAnggaran,
    tanggalSurat: st.tanggalSurat,
    penandatanganNama: st.penandatanganNama,
    penandatanganNip: st.penandatanganNip,
    penandatanganPangkat: st.penandatanganPangkat,
    penandatanganJabatan: st.penandatanganJabatan
  });
}

/**
 * Delete single Surat Tugas
 */
export async function supabaseDeleteSuratTugas(id: string) {
  return supabase.from("siluk_surat_tugas").delete().eq("id", id);
}

/**
 * Upsert dynamic single SPPD
 */
export async function supabaseUpsertSppd(sppd: SPPD) {
  return supabase.from("siluk_sppd").upsert({
    id: sppd.id,
    suratTugasId: sppd.suratTugasId || null,
    nomorSppd: sppd.nomorSppd,
    pegawaiId: sppd.pegawaiId,
    pejabatPemberiPerintah: sppd.pejabatPemberiPerintah,
    tingkatBiaya: sppd.tingkatBiaya,
    maksudPerjalanan: sppd.maksudPerjalanan,
    alatAngkutan: sppd.alatAngkutan,
    tempatBerangkat: sppd.tempatBerangkat,
    tempatTujuan: sppd.tempatTujuan,
    lamaPerjalanan: sppd.lamaPerjalanan,
    tanggalBerangkat: sppd.tanggalBerangkat,
    tanggalKembali: sppd.tanggalKembali,
    pengikut: sppd.pengikut,
    instansi: sppd.instansi,
    mataAnggaran: sppd.mataAnggaran,
    keteranganLain: sppd.keteranganLain,
    tanggalSppd: sppd.tanggalSppd,
    penandatanganNama: sppd.penandatanganNama,
    penandatanganNip: sppd.penandatanganNip,
    penandatanganPangkat: sppd.penandatanganPangkat,
    penandatanganJabatan: sppd.penandatanganJabatan
  });
}

/**
 * Delete single SPPD
 */
export async function supabaseDeleteSppd(id: string) {
  return supabase.from("siluk_sppd").delete().eq("id", id);
}

/**
 * Upsert Template
 */
export async function supabaseUpsertTemplate(tpl: LetterTemplate) {
  return supabase.from("siluk_template").upsert({
    id: "default",
    value: tpl
  });
}

/**
 * Upsert Settings
 */
export async function supabaseUpsertSettings(settings: AppSettings) {
  return supabase.from("siluk_settings").upsert({
    id: "default",
    value: settings
  });
}

/**
 * Update Admin Password
 */
export async function supabaseUpdatePassword(newPass: string) {
  return supabase.from("siluk_password").upsert({
    key: "admin_password",
    value: newPass
  });
}
