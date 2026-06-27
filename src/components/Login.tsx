import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, FileText } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLoginSuccess: () => void;
  correctPasswordHash: string;
}

export default function Login({ onLoginSuccess, correctPasswordHash }: LoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPasswordHash) {
      setError("");
      onLoginSuccess();
    } else {
      setError("Password salah. Silakan coba lagi atau hubungi Administrator.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-35 translate-x-12 translate-y-12"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-200 text-white flex items-center justify-center">
            <FileText size={40} className="stroke-[1.8]" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mt-6"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            SILUK BERTUAH
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
            Sistem Informasi Layanan Surat Tugas & Perjalanan Dinas <br />
            <span className="font-semibold text-indigo-700">UPTD Puskesmas Boyan Tanjung</span>
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit} id="login-form">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password Akses Sistem
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-50 p-3 border border-red-100"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldAlert className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                id="btn-login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer font-semibold shadow-indigo-100"
              >
                Masuk ke Aplikasi
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400">Petunjuk Akses</span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-slate-400 leading-relaxed">
              Gunakan password standar <code className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-indigo-700 font-mono font-semibold">boyantanjung123</code> untuk login pertama kali. Password dapat disesuaikan di menu Pengaturan.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 z-10">
        &copy; 2026 UPTD Puskesmas Boyan Tanjung. All rights reserved.
      </div>
    </div>
  );
}
