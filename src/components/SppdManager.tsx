import React, { useState } from "react";
import { 
  Car, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  User, 
  Printer, 
  X, 
  PlusCircle,
  FileText,
  UserPlus,
  Compass
} from "lucide-react";
import { Employee, SPPD, LetterTemplate, SuratTugas, Companion } from "../types";
import { formatIndonesianDate, generateId, getNextLetterNumber } from "../utils";

interface SppdManagerProps {
  employees: Employee[];
  sppdList: SPPD[];
  suratTugasList: SuratTugas[];
  template: LetterTemplate;
  onAddSppd: (sppd: SPPD) => void;
  onDeleteSppd: (id: string) => void;
  onSelectPrintLetter: (type: "surattugas" | "sppd", id: string) => void;
}

export default function SppdManager({
  employees,
  sppdList,
  suratTugasList,
  template,
  onAddSppd,
  onDeleteSppd,
  onSelectPrintLetter
}: SppdManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [nomorSppd, setNomorSppd] = useState("");
  const [pegawaiId, setPegawaiId] = useState("");
  const [pejabatPemberiPerintah, setPejabatPemberiPerintah] = useState("");
  const [tingkatBiaya, setTingkatBiaya] = useState("");
  const [maksudPerjalanan, setMaksudPerjalanan] = useState("");
  const [alatAngkutan, setAlatAngkutan] = useState("");
  const [tempatBerangkat, setTempatBerangkat] = useState("");
  const [tempatTujuan, setTempatTujuan] = useState("");
  const [lamaPerjalanan, setLamaPerjalanan] = useState(1);
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  
  // Companions (Pengikut)
  const [pengikutList, setPengikutList] = useState<Companion[]>([]);
  const [companionName, setCompanionName] = useState("");
  const [companionBirth, setCompanionBirth] = useState("");
  const [companionNote, setCompanionNote] = useState("");

  const [instansi, setInstansi] = useState("");
  const [mataAnggaran, setMataAnggaran] = useState("");
  const [keteranganLain, setKeteranganLain] = useState("");
  const [tanggalSppd, setTanggalSppd] = useState("");
  const [suratTugasId, setSuratTugasId] = useState<string>("");

  // Signatory
  const [penandatanganNama, setPenandatanganNama] = useState("");
  const [penandatanganNip, setPenandatanganNip] = useState("");
  const [penandatanganPangkat, setPenandatanganPangkat] = useState("");
  const [penandatanganJabatan, setPenandatanganJabatan] = useState("");

  const filteredSPPD = sppdList.filter((sppd) => {
    const searchLower = searchTerm.toLowerCase();
    const empName = employees.find(e => e.id === sppd.pegawaiId)?.name || "";
    return (
      sppd.nomorSppd.toLowerCase().includes(searchLower) ||
      sppd.maksudPerjalanan.toLowerCase().includes(searchLower) ||
      sppd.tempatTujuan.toLowerCase().includes(searchLower) ||
      empName.toLowerCase().includes(searchLower)
    );
  });

  const openAddModal = () => {
    const curDate = new Date();
    
    // Calculate the next sequence number correctly based on maximum among existing SPPD records
    const result = getNextLetterNumber(
      sppdList.map(s => s.nomorSppd),
      "090",
      "SPPD / PKM-BT",
      232
    );

    setNomorSppd(result.nextNumber);
    setPegawaiId(employees[0]?.id || "");
    setPejabatPemberiPerintah(template.sppdDefaults.pejabatPemberiPerintah);
    setTingkatBiaya(template.sppdDefaults.tingkatBiaya);
    setMaksudPerjalanan("");
    setAlatAngkutan(template.sppdDefaults.alatAngkutan);
    setTempatBerangkat(template.sppdDefaults.tempatBerangkat);
    setTempatTujuan("");
    setLamaPerjalanan(1);
    
    const todayStr = curDate.toISOString().split("T")[0];
    setTanggalBerangkat(todayStr);
    setTanggalKembali(todayStr);
    setTanggalSppd(todayStr);
    
    setPengikutList([]);
    setCompanionName("");
    setCompanionBirth("");
    setCompanionNote("");

    setInstansi(template.sppdDefaults.instansi);
    setMataAnggaran(template.sppdDefaults.mataAnggaran);
    setKeteranganLain("-");
    setSuratTugasId("");

    // Signatory Defaults
    const boss = employees.find(e => e.jabatan.toLowerCase().includes("kepala"));
    if (boss) {
      setPenandatanganNama(boss.name);
      setPenandatanganNip(boss.nip);
      setPenandatanganPangkat(boss.pangkatGol);
      setPenandatanganJabatan(boss.jabatan);
    } else {
      setPenandatanganNama("");
      setPenandatanganNip("");
      setPenandatanganPangkat("");
      setPenandatanganJabatan("Kepala UPTD Puskesmas Boyan Tanjung");
    }

    setIsModalOpen(true);
  };

  const addCompanion = () => {
    if (companionName.trim()) {
      const newCompanion: Companion = {
        nama: companionName.trim(),
        tanggalLahir: companionBirth || "-",
        keterangan: companionNote.trim() || "Anggota"
      };
      setPengikutList([...pengikutList, newCompanion]);
      setCompanionName("");
      setCompanionBirth("");
      setCompanionNote("");
    }
  };

  const removeCompanion = (idx: number) => {
    setPengikutList(pengikutList.filter((_, i) => i !== idx));
  };

  const handleLinkSuratTugasChange = (stId: string) => {
    setSuratTugasId(stId);
    if (!stId) return;

    const selectedSt = suratTugasList.find(st => st.id === stId);
    if (selectedSt) {
      setMaksudPerjalanan(selectedSt.maksud);
      setTempatTujuan(selectedSt.tempatTujuan);
      setTanggalBerangkat(selectedSt.tanggalMulai);
      setTanggalKembali(selectedSt.tanggalSelesai);
      
      // Calculate duration
      const d1 = new Date(selectedSt.tanggalMulai);
      const d2 = new Date(selectedSt.tanggalSelesai);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setLamaPerjalanan(diffDays);

      // Pre-select first employee from Surat Tugas
      if (selectedSt.pegawaiIds.length > 0) {
        setPegawaiId(selectedSt.pegawaiIds[0]);
        
        // Add others as companions! (Very smart!)
        if (selectedSt.pegawaiIds.length > 1) {
          const companions = selectedSt.pegawaiIds.slice(1).map(empId => {
            const empObj = employees.find(e => e.id === empId);
            return {
              nama: empObj?.name || "Pegawai",
              tanggalLahir: "-",
              keterangan: empObj?.jabatan || "Pelaksana"
            };
          });
          setPengikutList(companions);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pegawaiId) {
      alert("Silakan pilih pegawai pelaksana perjalanan!");
      return;
    }

    const newSppd: SPPD = {
      id: generateId("sppd"),
      suratTugasId: suratTugasId || undefined,
      nomorSppd,
      pegawaiId,
      pejabatPemberiPerintah,
      tingkatBiaya,
      maksudPerjalanan,
      alatAngkutan,
      tempatBerangkat,
      tempatTujuan,
      lamaPerjalanan,
      tanggalBerangkat,
      tanggalKembali,
      pengikut: pengikutList,
      instansi,
      mataAnggaran,
      keteranganLain,
      tanggalSppd,
      penandatanganNama,
      penandatanganNip,
      penandatanganPangkat,
      penandatanganJabatan
    };

    onAddSppd(newSppd);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Surat Perintah Perjalanan Dinas (SPPD)
          </h2>
          <p className="text-sm text-slate-500">
            Penerbitan lembar SPPD formal pendamping Surat Tugas dinas pegawai
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            id="btn-add-sppd-trigger"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Plus size={14} />
            <span>Buat SPPD Baru</span>
          </button>
        </div>
      </div>

      {/* Stats and Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Car size={18} className="text-slate-400" />
          <span>Total Lembar SPPD: <strong className="text-slate-700">{sppdList.length}</strong></span>
        </div>

        <div className="relative rounded-xl max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor SPPD, maksud, pelaksana..."
            className="block w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid of SPPD sheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSPPD.map((sppd) => {
          const emp = employees.find((e) => e.id === sppd.pegawaiId);
          return (
            <div 
              key={sppd.id} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative"
            >
              <div className="h-1 bg-indigo-600 w-full"></div>

              <div className="p-5 space-y-4 flex-1">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                      Lembar SPPD
                    </span>
                    <h3 className="font-mono text-[11px] font-bold text-slate-700 mt-2 truncate" title={sppd.nomorSppd}>
                      No: {sppd.nomorSppd}
                    </h3>
                  </div>
                </div>

                {/* Main Employee details */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Nama Pelaksana</span>
                    <span className="text-xs font-bold text-slate-800 block truncate" title={emp?.name}>
                      {emp?.name || "Pegawai Terhapus"}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{emp?.jabatan}</span>
                  </div>
                </div>

                {/* Maksud Perjalanan */}
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Maksud Perjalanan</span>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-0.5" title={sppd.maksudPerjalanan}>
                    {sppd.maksudPerjalanan}
                  </p>
                </div>

                {/* Route & Schedule */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Tujuan</span>
                    <div className="flex items-center gap-1 text-slate-600 mt-0.5 truncate">
                      <MapPin size={12} className="shrink-0 text-slate-400" />
                      <span className="text-xs font-semibold truncate" title={sppd.tempatTujuan}>{sppd.tempatTujuan}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Lama Perjalanan</span>
                    <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                      <Calendar size={12} className="shrink-0 text-slate-400" />
                      <span className="text-xs font-semibold">
                        {sppd.lamaPerjalanan} Hari ({sppd.tanggalBerangkat.split("-")[2]} s/d {sppd.tanggalKembali.split("-")[2]})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Companion check */}
                {sppd.pengikut.length > 0 && (
                  <div className="pt-2 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                      Pengikut ({sppd.pengikut.length} Orang)
                    </span>
                    <p className="text-[11px] text-slate-500 italic truncate" title={sppd.pengikut.map(p => p.nama).join(", ")}>
                      {sppd.pengikut.map(p => p.nama).join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {/* Print SPPD Button */}
                <button
                  onClick={() => onSelectPrintLetter("sppd", sppd.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Cetak SPPD</span>
                </button>

                {/* Delete SPPD */}
                <button
                  onClick={() => {
                    if (confirm("Apakah Anda yakin ingin menghapus SPPD ini?")) {
                      onDeleteSppd(sppd.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Hapus SPPD"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredSPPD.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="max-w-xs mx-auto space-y-2">
              <Car size={40} className="mx-auto text-slate-300" />
              <p className="font-semibold text-sm text-slate-700">Tidak ada SPPD</p>
              <p className="text-xs text-slate-400 font-normal">Buat lembar SPPD baru secara manual atau langsung dari daftar Surat Tugas.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add SPPD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-800">
                <Compass size={18} />
                <h3 className="font-bold text-sm tracking-tight">Buat SPPD Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-700">
              {/* ST Reference link */}
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-amber-800">Hubungkan dengan Surat Tugas (Opsional)</label>
                <span className="text-[10px] text-amber-700/80 block mb-1">Menghubungkan Surat Tugas akan secara otomatis menyalin rincian maksud, tujuan, tanggal, dan pengikut.</span>
                <select
                  value={suratTugasId}
                  onChange={(e) => handleLinkSuratTugasChange(e.target.value)}
                  className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">-- Buat Secara Mandiri (Tanpa Surat Tugas) --</option>
                  {suratTugasList.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.nomorSurat}] - {st.maksud.slice(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 1: Nomor SPPD & Pegawai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor SPPD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorSppd}
                    onChange={(e) => setNomorSppd(e.target.value)}
                    placeholder="Contoh: 090 / 232 / SPPD / PKM-BT / VI / 2026"
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  {sppdList.length > 0 ? (
                    <div className="mt-1.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex flex-col gap-2 text-[10px] text-slate-600">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-indigo-950 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          Nomor SPPD Sebelumnya (Klik untuk Urutan +1):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {sppdList.slice(0, 3).map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                const parts = s.nomorSppd.split("/").map(p => p.trim());
                                if (parts.length >= 2) {
                                  const currentSeq = parseInt(parts[1], 10);
                                  if (!isNaN(currentSeq)) {
                                    parts[1] = String(currentSeq + 1);
                                    setNomorSppd(parts.join(" / "));
                                  } else {
                                    setNomorSppd(s.nomorSppd);
                                  }
                                } else {
                                  setNomorSppd(s.nomorSppd);
                                }
                              }}
                              className="px-2 py-0.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-200 rounded transition-all cursor-pointer font-mono font-bold truncate max-w-[200px]"
                              title="Klik untuk membuat nomor urut berikutnya (+1) dari format SPPD ini"
                            >
                              {s.nomorSppd}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-indigo-100/30 pt-1.5 mt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const result = getNextLetterNumber(
                              sppdList.map(s => s.nomorSppd),
                              "090",
                              "SPPD / PKM-BT",
                              232
                            );
                            setNomorSppd(result.nextNumber);
                          }}
                          className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          ⚡ Gunakan Rekomendasi Nomor Otomatis (+1 Terbesar)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1 italic">Belum ada SPPD tercatat sebelumnya.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pegawai yang Diperintah <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={pegawaiId}
                    onChange={(e) => setPegawaiId(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.jabatan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Pejabat Pemberi Perintah & Tingkat Biaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pejabat Pemberi Perintah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pejabatPemberiPerintah}
                    onChange={(e) => setPejabatPemberiPerintah(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Biaya Perjalanan Dinas
                  </label>
                  <input
                    type="text"
                    value={tingkatBiaya}
                    onChange={(e) => setTingkatBiaya(e.target.value)}
                    placeholder="Contoh: Tingkat C"
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Maksud & Alat Angkutan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maksud Perjalanan Dinas <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={maksudPerjalanan}
                    onChange={(e) => setMaksudPerjalanan(e.target.value)}
                    placeholder="Maksud kegiatan dinas..."
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alat Angkutan yang Dipergunakan
                  </label>
                  <textarea
                    rows={2}
                    value={alatAngkutan}
                    onChange={(e) => setAlatAngkutan(e.target.value)}
                    placeholder="Contoh: Kendaraan Roda Dua / Air"
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Tempat Berangkat & Tempat Tujuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Berangkat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tempatBerangkat}
                    onChange={(e) => setTempatBerangkat(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Tujuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tempatTujuan}
                    onChange={(e) => setTempatTujuan(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Tanggal & Durasi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Berangkat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalBerangkat}
                    onChange={(e) => setTanggalBerangkat(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Harus Kembali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalKembali}
                    onChange={(e) => setTanggalKembali(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lama Perjalanan (Hari)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={lamaPerjalanan}
                    onChange={(e) => setLamaPerjalanan(parseInt(e.target.value, 10) || 1)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Companions Sub-Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Daftar Pengikut (Companions)
                </span>

                {/* Companions table */}
                {pengikutList.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
                          <th className="p-2 w-10">No</th>
                          <th className="p-2">Nama Pengikut</th>
                          <th className="p-2">Tgl Lahir / Umur</th>
                          <th className="p-2">Keterangan / Jabatan</th>
                          <th className="p-2 text-center w-12">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {pengikutList.map((cp, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-semibold text-slate-400">{idx + 1}</td>
                            <td className="p-2 font-semibold">{cp.nama}</td>
                            <td className="p-2">{cp.tanggalLahir}</td>
                            <td className="p-2">{cp.keterangan}</td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeCompanion(idx)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Sub-form inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder="Nama Pengikut..."
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={companionBirth}
                      onChange={(e) => setCompanionBirth(e.target.value)}
                      placeholder="Tgl Lahir / Umur (opsional)..."
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={companionNote}
                      onChange={(e) => setCompanionNote(e.target.value)}
                      placeholder="Jabatan / Keterangan..."
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCompanion}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 6: Instansi, Mata Anggaran, Tgl Surat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi Pembayar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Anggaran / Kode Rekening
                  </label>
                  <input
                    type="text"
                    value={mataAnggaran}
                    onChange={(e) => setMataAnggaran(e.target.value)}
                    placeholder="Contoh: DPA-BOK 1.02.02.2.02.0033"
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Terbit SPPD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSppd}
                    onChange={(e) => setTanggalSppd(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Signatory Frame */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Pejabat Penandatangan SPPD</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Nama Pejabat</label>
                    <input
                      type="text"
                      required
                      value={penandatanganNama}
                      onChange={(e) => setPenandatanganNama(e.target.value)}
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">NIP Pejabat</label>
                    <input
                      type="text"
                      required
                      value={penandatanganNip}
                      onChange={(e) => setPenandatanganNip(e.target.value)}
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Pangkat / Golongan</label>
                    <input
                      type="text"
                      required
                      value={penandatanganPangkat}
                      onChange={(e) => setPenandatanganPangkat(e.target.value)}
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Jabatan Pejabat</label>
                    <input
                      type="text"
                      required
                      value={penandatanganJabatan}
                      onChange={(e) => setPenandatanganJabatan(e.target.value)}
                      className="block w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                id="btn-save-sppd"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/15 cursor-pointer"
              >
                Simpan & Terbitkan SPPD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
