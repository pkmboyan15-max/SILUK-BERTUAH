import React, { useState } from "react";
import { 
  Settings, 
  Key, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  User, 
  Award, 
  FileLock2, 
  HardDriveDownload,
  Database,
  RefreshCw,
  Copy,
  Check,
  Info
} from "lucide-react";
import { AppSettings } from "../types";
import { SupabaseSyncStatus, SUPABASE_SQL_SETUP } from "../supabaseClient";

interface SettingsManagerProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdatePassword: (newPass: string) => void;
  onClearAllData: () => void;
  onLoadDemoData: () => void;
  dbStatus: SupabaseSyncStatus | null;
  isSyncing: boolean;
  syncMessage: string;
  onManualSync: () => void;
}

export default function SettingsManager({
  settings,
  onUpdateSettings,
  onUpdatePassword,
  onClearAllData,
  onLoadDemoData,
  dbStatus,
  isSyncing,
  syncMessage,
  onManualSync
}: SettingsManagerProps) {
  // Profile settings
  const [namaPuskesmas, setNamaPuskesmas] = useState(settings.namaPuskesmas);
  const [namaKepala, setNamaKepala] = useState(settings.namaKepala);
  const [nipKepala, setNipKepala] = useState(settings.nipKepala);
  const [pangkatKepala, setPangkatKepala] = useState(settings.pangkatKepala);
  const [jabatanKepala, setJabatanKepala] = useState(settings.jabatanKepala);

  // Security password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // SQL Copy state
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: AppSettings = {
      ...settings,
      namaPuskesmas: namaPuskesmas.trim(),
      namaKepala: namaKepala.trim(),
      nipKepala: nipKepala.trim(),
      pangkatKepala: pangkatKepala.trim(),
      jabatanKepala: jabatanKepala.trim()
    };
    onUpdateSettings(updatedSettings);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    // Fetch actual password from localStorage
    const storedPassword = localStorage.getItem("siluk_password") || "boyantanjung123";

    if (currentPassword !== storedPassword) {
      setPasswordError("Password lama yang Anda masukkan tidak cocok.");
      return;
    }

    if (newPassword.length < 5) {
      setPasswordError("Password baru harus minimal 5 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak sesuai.");
      return;
    }

    onUpdatePassword(newPassword);
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Pengaturan Sistem & Kredensial
        </h2>
        <p className="text-sm text-slate-500">
          Ubah konfigurasi profil Puskesmas Boyan Tanjung dan kata sandi akses pengamanan data
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Database size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">Backend Database: Supabase</h3>
                  <span className="px-2 py-0.5 text-[9.5px] font-bold tracking-wider rounded-md bg-indigo-600 text-white font-mono">
                    SILUK BERTUAH
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Project ID: <span className="font-mono text-slate-300">lqkgpjsijpokfbtucccd</span> • Region: AP-Southeast (Singapore)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Sinkronisasi..." : "Sinkronkan Sekarang"}</span>
              </button>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{dbStatus?.connected ? "ONLINE" : "OFFLINE"}</span>
              </div>
            </div>
          </div>

          {/* Table status pills */}
          {dbStatus?.connected && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} />
                Status Tabel di Database Supabase Anda:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries({
                  "siluk_password": dbStatus.tablesStatus.password,
                  "siluk_settings": dbStatus.tablesStatus.settings,
                  "siluk_template": dbStatus.tablesStatus.template,
                  "siluk_employees": dbStatus.tablesStatus.employees,
                  "siluk_surat_tugas": dbStatus.tablesStatus.suratTugas,
                  "siluk_sppd": dbStatus.tablesStatus.sppd
                }).map(([tblName, exist]) => (
                  <div 
                    key={tblName}
                    className={`p-2 rounded-xl border text-[11px] font-semibold text-center flex flex-col items-center justify-center gap-1 transition-all ${
                      exist 
                        ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400" 
                        : "bg-red-950/20 border-red-900/30 text-red-400"
                    }`}
                  >
                    <span className="font-mono truncate w-full">{tblName}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-90 font-bold">
                      {exist ? "✅ Terbuat" : "❌ Belum Ada"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action schema script instruction */}
        {dbStatus?.connected && Object.values(dbStatus.tablesStatus).some(val => !val) && (
          <div className="p-6 bg-amber-50 border-t border-amber-100 text-amber-900 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={14} className="text-amber-600" />
                Beberapa Tabel Belum Dibuat di Supabase Anda!
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
                Untuk mengaktifkan sinkronisasi database online, silakan salin script SQL di bawah ini, buka tab <strong>"SQL Editor"</strong> di dashboard Supabase Anda, buat query baru, lalu jalankan (Run) untuk membuat tabel secara otomatis.
              </p>
            </div>
            <button
              onClick={handleCopySQL}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-amber-600/10 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Berhasil Disalin!" : "Salin SQL Schema"}</span>
            </button>
          </div>
        )}

        {/* Database setup SQL panel */}
        {dbStatus?.connected && Object.values(dbStatus.tablesStatus).some(val => !val) && (
          <div className="border-t border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Script SQL Bootstrap (Supabase Console):</span>
              <button
                onClick={handleCopySQL}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? "Disalin!" : "Salin Cepat"}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-[180px] border border-slate-800 shadow-inner leading-relaxed">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        )}

        {dbStatus?.connected && Object.values(dbStatus.tablesStatus).every(val => val) && (
          <div className="p-4 bg-indigo-50 border-t border-indigo-100 text-indigo-900 text-xs font-semibold flex items-center gap-2 justify-center">
            <CheckCircle size={15} className="text-indigo-600" />
            <span>Database Terhubung & Sinkron Sempurna! Seluruh data pegawai, surat tugas, dan SPPD tersimpan aman di Cloud Supabase.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings Left */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50 uppercase tracking-wider">
              <User size={16} className="text-indigo-600" />
              <span>Profil Kepala & Penandatangan Utama</span>
            </h3>

            {profileSuccess && (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-indigo-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>Profil Kepala Puskesmas berhasil disimpan!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Puskesmas</label>
              <input
                type="text"
                required
                value={namaPuskesmas}
                onChange={(e) => setNamaPuskesmas(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Puskesmas</label>
              <input
                type="text"
                required
                value={namaKepala}
                onChange={(e) => setNamaKepala(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Puskesmas</label>
                <input
                  type="text"
                  required
                  value={nipKepala}
                  onChange={(e) => setNipKepala(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  required
                  value={pangkatKepala}
                  onChange={(e) => setPangkatKepala(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Resmi Penandatangan</label>
              <input
                type="text"
                required
                value={jabatanKepala}
                onChange={(e) => setJabatanKepala(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="submit"
              id="btn-save-settings-profile"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              Simpan Identitas Kepala
            </button>
          </form>
        </div>

        {/* Security Password Settings Right */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <form onSubmit={handlePasswordSubmit} className="space-y-4" id="password-form">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50 uppercase tracking-wider">
              <Key size={16} className="text-indigo-600" />
              <span>Ganti Password Keamanan Sistem</span>
            </h3>

            {passwordSuccess && (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-indigo-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>Password login berhasil diperbarui!</span>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-800 text-xs font-medium flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-red-500 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password Sekarang</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password lama..."
                className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 5 karakter..."
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-change-password"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              Perbarui Password Akses
            </button>
          </form>
        </div>

        {/* Database maintenance & Danger Zone */}
        <div className="lg:col-span-2 bg-red-50/50 p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert size={16} className="text-red-600" />
              <span>Zona Pemeliharaan & Pembersihan Data</span>
            </h4>
            <p className="text-xs text-red-700/80 leading-relaxed max-w-xl">
              Menghapus semua data akan mengembalikan aplikasi ke kondisi bersih total. Semua data pegawai, Surat Tugas, SPPD, dan modifikasi template yang telah Anda simpan di perangkat ini akan lenyap permanen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => {
                if (confirm("Muat ulang seluruh data contoh? Seluruh surat Anda saat ini akan ditimpa.")) {
                  onLoadDemoData();
                  alert("Data demo berhasil dimuat!");
                }
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <HardDriveDownload size={14} />
              <span>Muat Ulang Demo</span>
            </button>
            
            <button
              onClick={() => {
                if (confirm("APAKAH ANDA YAKIN? Tindakan ini akan menghapus semua pegawai, surat tugas, SPPD, dan menyetel ulang password akses ke 'boyantanjung123'!")) {
                  onClearAllData();
                  alert("Seluruh database lokal berhasil dibersihkan.");
                }
              }}
              id="btn-purge-database"
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Bersihkan Seluruh Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
