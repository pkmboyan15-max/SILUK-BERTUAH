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
  HardDriveDownload 
} from "lucide-react";
import { AppSettings } from "../types";

interface SettingsManagerProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdatePassword: (newPass: string) => void;
  onClearAllData: () => void;
  onLoadDemoData: () => void;
}

export default function SettingsManager({
  settings,
  onUpdateSettings,
  onUpdatePassword,
  onClearAllData,
  onLoadDemoData
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
