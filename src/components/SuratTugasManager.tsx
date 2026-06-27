import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  Printer, 
  Car, 
  X, 
  FileSpreadsheet,
  Settings,
  ListPlus
} from "lucide-react";
import { Employee, SuratTugas, LetterTemplate } from "../types";
import { formatIndonesianDate, generateId, getNextLetterNumber } from "../utils";

interface SuratTugasManagerProps {
  employees: Employee[];
  suratTugasList: SuratTugas[];
  template: LetterTemplate;
  onAddSuratTugas: (st: SuratTugas) => void;
  onDeleteSuratTugas: (id: string) => void;
  onSelectPrintLetter: (type: "surattugas" | "sppd", id: string) => void;
  onGenerateSppdFromSt: (st: SuratTugas, selectedEmpId: string) => void;
}

export default function SuratTugasManager({
  employees,
  suratTugasList,
  template,
  onAddSuratTugas,
  onDeleteSuratTugas,
  onSelectPrintLetter,
  onGenerateSppdFromSt
}: SuratTugasManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [nomorSurat, setNomorSurat] = useState("");
  const [dasarList, setDasarList] = useState<string[]>([]);
  const [newDasarItem, setNewDasarItem] = useState("");
  const [selectedPegawaiIds, setSelectedPegawaiIds] = useState<string[]>([]);
  const [maksud, setMaksud] = useState("");
  const [tempatTujuan, setTempatTujuan] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [pembebananAnggaran, setPembebananAnggaran] = useState("");
  const [tanggalSurat, setTanggalSurat] = useState("");

  // Signatory
  const [penandatanganNama, setPenandatanganNama] = useState("");
  const [penandatanganNip, setPenandatanganNip] = useState("");
  const [penandatanganPangkat, setPenandatanganPangkat] = useState("");
  const [penandatanganJabatan, setPenandatanganJabatan] = useState("");

  const filteredST = suratTugasList.filter((st) => {
    const searchLower = searchTerm.toLowerCase();
    const names = st.pegawaiIds.map(id => employees.find(e => e.id === id)?.name || "").join(" ").toLowerCase();
    return (
      st.nomorSurat.toLowerCase().includes(searchLower) ||
      st.maksud.toLowerCase().includes(searchLower) ||
      st.tempatTujuan.toLowerCase().includes(searchLower) ||
      names.includes(searchLower)
    );
  });

  const openAddModal = () => {
    const curDate = new Date();
    
    // Calculate the next sequence number correctly based on maximum among existing records
    const result = getNextLetterNumber(
      suratTugasList.map(st => st.nomorSurat),
      "800",
      "PKM-BT",
      126
    );
    
    setNomorSurat(result.nextNumber);
    setDasarList([...template.suratTugasDefaults.dasarUmum]);
    setSelectedPegawaiIds([]);
    setMaksud("");
    setTempatTujuan("");
    
    const todayStr = curDate.toISOString().split("T")[0];
    setTanggalMulai(todayStr);
    setTanggalSelesai(todayStr);
    setTanggalSurat(todayStr);
    setPembebananAnggaran(template.suratTugasDefaults.pembebananAnggaran);

    // Default signatory (from Kopf/first employee with Kepala title)
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

  const addDasarItem = () => {
    if (newDasarItem.trim()) {
      setDasarList([...dasarList, newDasarItem.trim()]);
      setNewDasarItem("");
    }
  };

  const removeDasarItem = (idx: number) => {
    setDasarList(dasarList.filter((_, i) => i !== idx));
  };

  const togglePegawaiSelection = (id: string) => {
    if (selectedPegawaiIds.includes(id)) {
      setSelectedPegawaiIds(selectedPegawaiIds.filter(pid => pid !== id));
    } else {
      setSelectedPegawaiIds([...selectedPegawaiIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPegawaiIds.length === 0) {
      alert("Pilih minimal satu pegawai pelaksana tugas!");
      return;
    }
    if (dasarList.length === 0) {
      alert("Masukkan minimal satu poin dasar surat!");
      return;
    }

    const newST: SuratTugas = {
      id: generateId("st"),
      nomorSurat,
      dasar: dasarList,
      pegawaiIds: selectedPegawaiIds,
      maksud,
      tempatTujuan,
      tanggalMulai,
      tanggalSelesai,
      pembebananAnggaran,
      tanggalSurat,
      penandatanganNama,
      penandatanganNip,
      penandatanganPangkat,
      penandatanganJabatan
    };

    onAddSuratTugas(newST);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Surat Tugas (ST)
          </h2>
          <p className="text-sm text-slate-500">
            Penerbitan, pencatatan, dan manajemen Surat Tugas dinas pegawai
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            id="btn-add-st-trigger"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Plus size={14} />
            <span>Buat Surat Tugas</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <FileText size={18} className="text-slate-400" />
          <span>Total Surat Tugas: <strong className="text-slate-700">{suratTugasList.length}</strong></span>
        </div>

        <div className="relative rounded-xl max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor, maksud, atau pegawai..."
            className="block w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Surat Tugas Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredST.map((st) => (
          <div 
            key={st.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Top Bar Accent */}
            <div className="h-1 bg-indigo-600 w-full"></div>

            {/* Content */}
            <div className="p-5 space-y-4 flex-1">
              {/* Card Title & Number */}
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                  Surat Tugas
                </span>
                <h3 className="font-mono text-[11px] font-bold text-slate-700 mt-2 truncate" title={st.nomorSurat}>
                  No: {st.nomorSurat}
                </h3>
              </div>

              {/* Maksud Tugas */}
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Maksud Tugas</span>
                <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-0.5" title={st.maksud}>
                  {st.maksud}
                </p>
              </div>

              {/* Destination & Dates */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Tujuan</span>
                  <div className="flex items-center gap-1 text-slate-600 mt-0.5 truncate">
                    <MapPin size={12} className="shrink-0 text-slate-400" />
                    <span className="text-xs font-semibold truncate" title={st.tempatTujuan}>{st.tempatTujuan}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Pelaksanaan</span>
                  <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                    <Calendar size={12} className="shrink-0 text-slate-400" />
                    <span className="text-xs font-semibold">
                      {st.tanggalMulai === st.tanggalSelesai 
                        ? formatIndonesianDate(st.tanggalMulai)
                        : `${st.tanggalMulai.split("-")[2]} - ${formatIndonesianDate(st.tanggalSelesai)}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Employees List */}
              <div className="pt-2 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider mb-1.5">
                  Pegawai Pelaksana ({st.pegawaiIds.length} Orang)
                </span>
                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-1">
                  {st.pegawaiIds.map(id => {
                    const emp = employees.find(e => e.id === id);
                    return (
                      <div key={id} className="text-xs font-medium text-slate-700 flex items-center justify-between">
                        <span className="truncate max-w-[170px]" title={emp?.name}>
                          &bull; {emp?.name || "Pegawai Terhapus"}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate max-w-[100px] font-normal italic">
                          ({emp?.jabatan})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {/* Print ST */}
              <button
                onClick={() => onSelectPrintLetter("surattugas", st.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
              >
                <Printer size={13} />
                <span>Cetak ST</span>
              </button>

              {/* Generate SPPD Dropdown Actions */}
              <div className="flex items-center gap-2">
                <div className="relative group/sppd">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all cursor-pointer shadow-sm"
                  >
                    <Car size={13} />
                    <span>Buat SPPD</span>
                  </button>
                  {/* Dropdown list of employees in this ST to make SPPD for */}
                  <div className="absolute right-0 bottom-full mb-1 bg-white border border-slate-100 rounded-xl shadow-xl w-48 hidden group-hover/sppd:block z-30 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 border-b border-slate-100">
                      Pilih Pelaksana Perjalanan:
                    </div>
                    {st.pegawaiIds.map(id => {
                      const emp = employees.find(e => e.id === id);
                      return (
                        <button
                          key={id}
                          onClick={() => onGenerateSppdFromSt(st, id)}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 font-semibold border-b border-slate-50 last:border-0 block truncate cursor-pointer"
                          title={emp?.name}
                        >
                          {emp?.name || "Pegawai"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm("Hapus Surat Tugas ini? Data SPPD terkait tidak akan terhapus otomatis.")) {
                      onDeleteSuratTugas(st.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Hapus Surat Tugas"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredST.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="max-w-xs mx-auto space-y-2">
              <FileText size={40} className="mx-auto text-slate-300" />
              <p className="font-semibold text-sm text-slate-700">Tidak ada Surat Tugas</p>
              <p className="text-xs text-slate-400">Silakan tambahkan surat baru atau ubah kata kunci pencarian Anda.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Surat Tugas Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-800">
                <FileText size={18} />
                <h3 className="font-bold text-sm tracking-tight">Buat Surat Tugas Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Row 1: Nomor Surat & Tanggal Terbit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Surat Tugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    placeholder="Contoh: 800 / 126 / PKM-BT / VI / 2026"
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                  />
                  {suratTugasList.length > 0 && (
                    <div className="mt-1.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] text-slate-600">
                      <div>
                        Nomor Sebelumnya: <strong className="font-mono text-indigo-900">{suratTugasList[0].nomorSurat}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const lastNomor = suratTugasList[0].nomorSurat;
                          const parts = lastNomor.split("/");
                          if (parts.length >= 2) {
                            const numPart = parts[1].trim();
                            const parsedNum = parseInt(numPart, 10);
                            if (!isNaN(parsedNum)) {
                              const nextNum = parsedNum + 1;
                              parts[1] = ` ${nextNum} `;
                              setNomorSurat(parts.join("/"));
                              return;
                            }
                          }
                          const match = lastNomor.match(/(\d+)/g);
                          if (match && match.length >= 2) {
                            const lastNumStr = match[1];
                            const nextNum = parseInt(lastNumStr, 10) + 1;
                            setNomorSurat(lastNomor.replace(lastNumStr, String(nextNum)));
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer text-left sm:text-right"
                      >
                        Gunakan Nomor Berikutnya (+1)
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Terbit Surat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Maksud & Lokasi Tujuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maksud / Kegiatan Penugasan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={maksud}
                    onChange={(e) => setMaksud(e.target.value)}
                    placeholder="Contoh: Melakukan Pendampingan Pelayanan Imunisasi Dasar di Posyandu Melati..."
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat / Desa Tujuan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={tempatTujuan}
                    onChange={(e) => setTempatTujuan(e.target.value)}
                    placeholder="Contoh: Desa Nanga Boyan, Kecamatan Boyan Tanjung..."
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3: Tanggal Mulai & Tanggal Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai Tugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai Tugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4: Pegawai yang ditugaskan (Multi-Select) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Pegawai Pelaksana Tugas (Bisa pilih lebih dari satu) <span className="text-red-500">*</span>
                </label>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-44 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {employees.map((emp) => {
                    const isChecked = selectedPegawaiIds.includes(emp.id);
                    return (
                      <label 
                        key={emp.id} 
                        className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                          isChecked 
                            ? "bg-white border-indigo-500 text-slate-800 shadow-sm" 
                            : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePegawaiSelection(emp.id)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="overflow-hidden">
                          <span className="font-semibold block truncate">{emp.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{emp.jabatan}</span>
                        </div>
                      </label>
                    );
                  })}

                  {employees.length === 0 && (
                    <div className="col-span-full text-center py-4 text-xs text-slate-400 font-medium">
                      Belum ada data pegawai. Silakan input data pegawai terlebih dahulu.
                    </div>
                  )}
                </div>
              </div>

              {/* Row 5: Dasar Hukum Surat Tugas (Dynamic input) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Dasar Hukum / Referensi Surat <span className="text-red-500">*</span>
                </label>
                <div className="space-y-1.5">
                  {dasarList.map((dasar, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 text-xs text-slate-600">
                      <span className="font-bold text-slate-400 shrink-0">{idx + 1}.</span>
                      <span className="flex-1 truncate">{dasar}</span>
                      <button
                        type="button"
                        onClick={() => removeDasarItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDasarItem}
                    onChange={(e) => setNewDasarItem(e.target.value)}
                    placeholder="Contoh: Undang-Undang RI Nomor 17 Tahun 2023..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addDasarItem}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
                  >
                    <ListPlus size={14} />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Row 6: Pembebanan Anggaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sumber / Pembebanan Anggaran
                </label>
                <input
                  type="text"
                  value={pembebananAnggaran}
                  onChange={(e) => setPembebananAnggaran(e.target.value)}
                  placeholder="Contoh: DPA-BOK UPTD Puskesmas Boyan Tanjung..."
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Row 7: Penandatangan Surat (Default from first Kepala) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Pejabat Penandatangan</span>
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
                id="btn-save-st"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/15 cursor-pointer"
              >
                Simpan & Terbitkan Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
