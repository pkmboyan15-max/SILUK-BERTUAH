import { useState } from "react";
import { 
  FileText, 
  Car, 
  Users, 
  Calendar, 
  Download, 
  Search, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { Employee, SuratTugas, SPPD } from "../types";
import { formatIndonesianDate, exportToCSV } from "../utils";

interface DashboardProps {
  employees: Employee[];
  suratTugasList: SuratTugas[];
  sppdList: SPPD[];
  onNavigateToTab: (tab: string) => void;
  onSelectPrintLetter: (type: "surattugas" | "sppd", id: string) => void;
}

export default function Dashboard({ 
  employees, 
  suratTugasList, 
  sppdList, 
  onNavigateToTab,
  onSelectPrintLetter 
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Stats Calculations
  const totalEmployees = employees.length;
  const totalSuratTugas = suratTugasList.length;
  const totalSPPD = sppdList.length;

  // Active trips currently (where date range covers today)
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const activeTrips = suratTugasList.filter(st => {
    return st.tanggalMulai <= todayStr && st.tanggalSelesai >= todayStr;
  }).length;

  // Employee Travel Distribution (how many times each employee is assigned)
  const employeeTravelCounts = employees.map(emp => {
    // Count in Surat Tugas
    const countST = suratTugasList.filter(st => st.pegawaiIds.includes(emp.id)).length;
    // Count in SPPD
    const countSPPD = sppdList.filter(sppd => sppd.pegawaiId === emp.id).length;
    return {
      name: emp.name,
      nip: emp.nip,
      jabatan: emp.jabatan,
      count: countST + countSPPD
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // top 5 most traveled

  // Recent Letters Log
  const allLetters = [
    ...suratTugasList.map(st => ({
      id: st.id,
      type: "Surat Tugas" as const,
      number: st.nomorSurat,
      purpose: st.maksud,
      destination: st.tempatTujuan,
      date: st.tanggalSurat,
      dateRange: `${st.tanggalMulai} s/d ${st.tanggalSelesai}`,
      personCount: st.pegawaiIds.length,
      people: st.pegawaiIds.map(id => employees.find(e => e.id === id)?.name || "Pegawai").join(", ")
    })),
    ...sppdList.map(sppd => {
      const empName = employees.find(e => e.id === sppd.pegawaiId)?.name || "Pegawai";
      return {
        id: sppd.id,
        type: "SPPD" as const,
        number: sppd.nomorSppd,
        purpose: sppd.maksudPerjalanan,
        destination: sppd.tempatTujuan,
        date: sppd.tanggalSppd,
        dateRange: `${sppd.tanggalBerangkat} s/d ${sppd.tanggalKembali}`,
        personCount: 1,
        people: empName
      };
    })
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Filtered recent letters
  const filteredLetters = allLetters.filter(letter => {
    const searchLower = searchTerm.toLowerCase();
    return (
      letter.number.toLowerCase().includes(searchLower) ||
      letter.purpose.toLowerCase().includes(searchLower) ||
      letter.destination.toLowerCase().includes(searchLower) ||
      letter.people.toLowerCase().includes(searchLower)
    );
  });

  // Export Recapitulation
  const handleExportRecap = () => {
    const headers = ["ID Surat", "Tipe Surat", "Nomor Surat", "Tanggal Surat", "Maksud / Kegiatan", "Tujuan", "Periode", "Pegawai Terlibat"];
    const rows = allLetters.map(letter => [
      letter.id,
      letter.type,
      letter.number,
      formatIndonesianDate(letter.date),
      letter.purpose,
      letter.destination,
      letter.dateRange,
      letter.people
    ]);
    exportToCSV(`REKAP_SURAT_SILUK_BERTUAH_${todayStr}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Rekapitulasi Data
          </h2>
          <p className="text-sm text-slate-500">
            Monitoring dan data analitis pengeluaran Surat Tugas & SPPD Puskesmas Boyan Tanjung
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-rekap-export"
            onClick={handleExportRecap}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer animate-fade-in"
          >
            <Download size={14} />
            <span>Ekspor Rekap CSV</span>
          </button>
          <button
            id="btn-create-st-quick"
            onClick={() => onNavigateToTab("surattugas")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Buat Surat Tugas</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <FileText size={24} className="stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surat Tugas</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{totalSuratTugas}</h3>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={10} /> +12 Bulan Ini
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-xl text-slate-800">
            <Car size={24} className="stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SPPD Terbit</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalSPPD}</h3>
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 size={10} /> Verifikasi Selesai
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-xl text-slate-800">
            <Users size={24} className="stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pegawai</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalEmployees}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-bold">Aktif & Terdaftar</span>
          </div>
        </div>

        {/* Stat 4 - Indigo accent bento box */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-600 rounded-xl text-white">
            <Calendar size={24} className="stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Menunggu Cetak</p>
            <h3 className="text-2xl font-black text-indigo-700 mt-1">05</h3>
            <span className="text-[10px] text-indigo-500 font-bold mt-0.5 block">Dokumen Draft</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Travelled Employees Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-1">
              Top Frekuensi Perjalanan Dinas
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              5 pegawai dengan akumulasi penugasan (Surat Tugas + SPPD) terbanyak
            </p>

            <div className="space-y-4">
              {employeeTravelCounts.map((item, idx) => {
                const maxCount = Math.max(...employeeTravelCounts.map(i => i.count), 1);
                const percent = (item.count / maxCount) * 100;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={item.name}>
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px]">
                        {item.count} Kali
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-slate-400 block truncate">{item.jabatan}</span>
                  </div>
                );
              })}

              {employeeTravelCounts.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  Belum ada data perjalanan dinas yang tercatat.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[11px] text-slate-400">
            <span>Dihitung dari seluruh rekap aktif</span>
            <button 
              onClick={() => onNavigateToTab("pegawai")} 
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Lihat Semua <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

        {/* Right Column: History of Letters Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                Log Surat yang Telah Diterbitkan
              </h3>
              <p className="text-xs text-slate-400">
                Daftar kronologis Surat Tugas dan Surat Perintah Perjalanan Dinas
              </p>
            </div>

            {/* Search filter within dashboard */}
            <div className="relative rounded-xl max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor, nama, tujuan..."
                className="block w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                  <th className="py-3 px-3 rounded-l-xl">Tipe</th>
                  <th className="py-3 px-3">Nomor Surat</th>
                  <th className="py-3 px-3">Pegawai / Pelaksana</th>
                  <th className="py-3 px-3">Tujuan</th>
                  <th className="py-3 px-3">Tanggal Terbit</th>
                  <th className="py-3 px-3 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLetters.slice(0, 8).map((letter, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        letter.type === "Surat Tugas" 
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50" 
                          : "bg-slate-100 text-slate-700 border border-slate-200/50"
                      }`}>
                        {letter.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 font-mono text-[11px] max-w-[150px] truncate" title={letter.number}>
                      {letter.number}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={letter.people}>
                      {letter.people}
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[120px]" title={letter.destination}>
                      {letter.destination}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatIndonesianDate(letter.date)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectPrintLetter(letter.type === "Surat Tugas" ? "surattugas" : "sppd", letter.id)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline cursor-pointer"
                      >
                        Cetak Surat
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLetters.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Tidak ada data surat yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[11px] text-slate-400">
            <span>Menampilkan maksimal 8 surat terbaru</span>
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigateToTab("surattugas")} 
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Kelola Surat Tugas
              </button>
              <button 
                onClick={() => onNavigateToTab("sppd")} 
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Kelola SPPD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
