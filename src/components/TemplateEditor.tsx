import React, { useState } from "react";
import { 
  Layout, 
  Save, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Building, 
  RefreshCw,
  Eye
} from "lucide-react";
import { LetterTemplate } from "../types";

interface TemplateEditorProps {
  template: LetterTemplate;
  onUpdateTemplate: (newTemplate: LetterTemplate) => void;
  onResetToDefault: () => void;
}

export default function TemplateEditor({
  template,
  onUpdateTemplate,
  onResetToDefault
}: TemplateEditorProps) {
  // Kop Surat States
  const [pemerintah, setPemerintah] = useState(template.kop.pemerintah);
  const [dinas, setDinas] = useState(template.kop.dinas);
  const [puskesmas, setPuskesmas] = useState(template.kop.puskesmas);
  const [alamat, setAlamat] = useState(template.kop.alamat);
  const [telepon, setTelepon] = useState(template.kop.telepon);
  const [email, setEmail] = useState(template.kop.email);
  const [kodePos, setKodePos] = useState(template.kop.kodePos);

  // Defaults States
  const [dasarUmum, setDasarUmum] = useState<string[]>(template.suratTugasDefaults.dasarUmum);
  const [newDasarText, setNewDasarText] = useState("");
  const [pembebananSt, setPembebananSt] = useState(template.suratTugasDefaults.pembebananAnggaran);

  const [sppdPejabat, setSppdPejabat] = useState(template.sppdDefaults.pejabatPemberiPerintah);
  const [sppdTingkat, setSppdTingkat] = useState(template.sppdDefaults.tingkatBiaya);
  const [sppdAlat, setSppdAlat] = useState(template.sppdDefaults.alatAngkutan);
  const [sppdBerangkat, setSppdBerangkat] = useState(template.sppdDefaults.tempatBerangkat);
  const [sppdInstansi, setSppdInstansi] = useState(template.sppdDefaults.instansi);
  const [sppdMataAnggaran, setSppdMataAnggaran] = useState(template.sppdDefaults.mataAnggaran);

  const [showNotification, setShowNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTemplate: LetterTemplate = {
      kop: {
        pemerintah: pemerintah.trim().toUpperCase(),
        dinas: dinas.trim().toUpperCase(),
        puskesmas: puskesmas.trim().toUpperCase(),
        alamat: alamat.trim(),
        telepon: telepon.trim(),
        email: email.trim(),
        kodePos: kodePos.trim()
      },
      suratTugasDefaults: {
        dasarUmum,
        pembebananAnggaran: pembebananSt.trim()
      },
      sppdDefaults: {
        pejabatPemberiPerintah: sppdPejabat.trim(),
        tingkatBiaya: sppdTingkat.trim(),
        alatAngkutan: sppdAlat.trim(),
        tempatBerangkat: sppdBerangkat.trim(),
        instansi: sppdInstansi.trim(),
        mataAnggaran: sppdMataAnggaran.trim()
      }
    };

    onUpdateTemplate(updatedTemplate);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset template ke setelan standar Puskesmas Boyan Tanjung?")) {
      onResetToDefault();
      // Reload states
      setPemerintah(template.kop.pemerintah);
      setDinas(template.kop.dinas);
      setPuskesmas(template.kop.puskesmas);
      setAlamat(template.kop.alamat);
      setTelepon(template.kop.telepon);
      setEmail(template.kop.email);
      setKodePos(template.kop.kodePos);
      setDasarUmum(template.suratTugasDefaults.dasarUmum);
      setPembebananSt(template.suratTugasDefaults.pembebananAnggaran);
      setSppdPejabat(template.sppdDefaults.pejabatPemberiPerintah);
      setSppdTingkat(template.sppdDefaults.tingkatBiaya);
      setSppdAlat(template.sppdDefaults.alatAngkutan);
      setSppdBerangkat(template.sppdDefaults.tempatBerangkat);
      setSppdInstansi(template.sppdDefaults.instansi);
      setSppdMataAnggaran(template.sppdDefaults.mataAnggaran);
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const addDasar = () => {
    if (newDasarText.trim()) {
      setDasarUmum([...dasarUmum, newDasarText.trim()]);
      setNewDasarText("");
    }
  };

  const deleteDasar = (idx: number) => {
    setDasarUmum(dasarUmum.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Editor Template Surat Dinas
          </h2>
          <p className="text-sm text-slate-500">
            Sesuaikan kop surat dinas, instansi, dasar hukum penugasan, dan logistik default SPPD
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Kembalikan Standar</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Save size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {showNotification && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle size={16} />
          <span>Template berhasil disimpan dan diterapkan pada seluruh cetakan surat dinas!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Section 1: Kop Surat */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50 uppercase tracking-wider">
              <Building size={16} className="text-indigo-600" />
              <span>Struktur Kepala KOP Surat</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pemerintah Daerah / Instansi Tingkat Atas
                </label>
                <input
                  type="text"
                  required
                  value={pemerintah}
                  onChange={(e) => setPemerintah(e.target.value)}
                  placeholder="PEMERINTAH KABUPATEN KAPUAS HULU"
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Dinas Pengampu
                </label>
                <input
                  type="text"
                  required
                  value={dinas}
                  onChange={(e) => setDinas(e.target.value)}
                  placeholder="DINAS KESEHATAN"
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Unit Pelaksana Teknis (UPTD) Puskesmas
                </label>
                <input
                  type="text"
                  required
                  value={puskesmas}
                  onChange={(e) => setPuskesmas(e.target.value)}
                  placeholder="UPTD PUSKESMAS BOYAN TANJUNG"
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Kantor
                </label>
                <input
                  type="text"
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. Telepon/HP</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={kodePos}
                    onChange={(e) => setKodePos(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Default Surat Tugas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50 uppercase tracking-wider">
              <FileText size={16} className="text-indigo-600" />
              <span>Konten Default Surat Tugas</span>
            </h3>

            <div className="space-y-4">
              {/* Dasar Hukum */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Konsideran / Dasar Hukum Bawaan
                </label>
                <div className="space-y-1.5">
                  {dasarUmum.map((dasar, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/50 text-xs text-slate-600">
                      <span className="font-bold text-slate-400 mt-0.5">{i + 1}.</span>
                      <span className="flex-1 leading-relaxed">{dasar}</span>
                      <button
                        type="button"
                        onClick={() => deleteDasar(i)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer shrink-0"
                      >
                        <RefreshCw size={12} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDasarText}
                    onChange={(e) => setNewDasarText(e.target.value)}
                    placeholder="Masukkan dasar hukum baru..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addDasar}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Pembebanan Anggaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Pembebanan Anggaran
                </label>
                <input
                  type="text"
                  value={pembebananSt}
                  onChange={(e) => setPembebananSt(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Default SPPD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50 uppercase tracking-wider">
              <Layout size={16} className="text-indigo-600" />
              <span>Logistik Default SPPD</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pejabat Pemberi Perintah
                </label>
                <input
                  type="text"
                  value={sppdPejabat}
                  onChange={(e) => setSppdPejabat(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Tingkat Biaya
                </label>
                <input
                  type="text"
                  value={sppdTingkat}
                  onChange={(e) => setSppdTingkat(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Alat Transportasi
                </label>
                <input
                  type="text"
                  value={sppdAlat}
                  onChange={(e) => setSppdAlat(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Tempat Berangkat
                </label>
                <input
                  type="text"
                  value={sppdBerangkat}
                  onChange={(e) => setSppdBerangkat(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instansi Pembayar SPPD
                </label>
                <input
                  type="text"
                  value={sppdInstansi}
                  onChange={(e) => setSppdInstansi(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Anggaran / Kode Rekening SPPD
                </label>
                <input
                  type="text"
                  value={sppdMataAnggaran}
                  onChange={(e) => setSppdMataAnggaran(e.target.value)}
                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Kop Surat */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 shadow-xl sticky top-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest border-b border-slate-800 pb-2">
              <Eye size={14} className="text-indigo-500 animate-pulse" />
              <span>Visualisasi Kop Surat Formal (Live)</span>
            </div>

            {/* Simulated Sheet head */}
            <div className="bg-white text-slate-900 p-6 rounded-xl border border-slate-200/20 font-sans shadow-md space-y-2 text-center relative overflow-hidden select-none">
              {/* Logo Kabupaten Kapuas Hulu di sebelah kiri */}
              <div className="absolute top-2 left-3 w-10 h-12 flex items-center justify-center select-none">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Lambang_Kabupaten_Kapuas_Hulu.png" 
                  alt="Logo Kabupaten Kapuas Hulu"
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-2 right-3 w-10 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[8px] text-slate-300 font-bold">
                LOGO
              </div>

              <div className="space-y-0.5 max-w-[80%] mx-auto">
                <h4 className="text-[10px] font-semibold text-slate-500 tracking-wider leading-none">
                  {pemerintah || "PEMERINTAH KABUPATEN KAPUAS HULU"}
                </h4>
                <h3 className="text-xs font-bold text-slate-800 tracking-wide leading-none">
                  {dinas || "DINAS KESEHATAN"}
                </h3>
                <h2 className="text-sm font-extrabold text-indigo-800 leading-tight">
                  {puskesmas || "UPTD PUSKESMAS BOYAN TANJUNG"}
                </h2>
                <p className="text-[8px] text-slate-500 font-medium leading-normal italic mt-1">
                  Alamat: {alamat || "Jl. Lintas Selatan, Boyan Tanjung"}
                </p>
                <p className="text-[7px] text-slate-400 font-medium leading-none">
                  Telp: {telepon || "-"} | Email: {email || "-"} | Kode Pos: {kodePos || "-"}
                </p>
              </div>

              {/* Formal Double lines */}
              <div className="pt-2">
                <div className="h-[2px] bg-slate-800 w-full"></div>
                <div className="h-[1px] bg-slate-800 w-full mt-[1px]"></div>
              </div>

              <div className="pt-4 text-center">
                <span className="font-sans font-bold text-xs underline block">SURAT TUGAS</span>
                <span className="font-mono text-[8px] text-slate-400 block mt-0.5">Nomor: 800 / XXX / PKM-BT / VI / 2026</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800/60 rounded-xl flex gap-2 text-xs text-slate-400 leading-relaxed border border-slate-800">
              <HelpCircle size={20} className="shrink-0 text-indigo-500 mt-0.5" />
              <p>
                Preview di atas menggambarkan tata letak formal **Kepala Surat** dinas Puskesmas Boyan Tanjung yang akan diaplikasikan langsung saat Anda mencetak Surat Tugas atau SPPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
