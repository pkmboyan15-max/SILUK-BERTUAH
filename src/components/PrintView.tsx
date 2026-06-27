import { ArrowLeft, Printer, Info, Compass } from "lucide-react";
import { Employee, SuratTugas, SPPD, LetterTemplate } from "../types";
import { formatIndonesianDate } from "../utils";

interface PrintViewProps {
  type: "surattugas" | "sppd";
  id: string;
  employees: Employee[];
  suratTugasList: SuratTugas[];
  sppdList: SPPD[];
  template: LetterTemplate;
  onClose: () => void;
}

export default function PrintView({
  type,
  id,
  employees,
  suratTugasList,
  sppdList,
  template,
  onClose
}: PrintViewProps) {
  
  // Find active document
  let activeST: SuratTugas | undefined;
  let activeSPPD: SPPD | undefined;
  let employeeList: Employee[] = [];
  let mainEmployee: Employee | undefined;

  if (type === "surattugas") {
    activeST = suratTugasList.find(st => st.id === id);
    if (activeST) {
      employeeList = activeST.pegawaiIds.map(pid => employees.find(e => e.id === pid)).filter(Boolean) as Employee[];
    }
  } else {
    activeSPPD = sppdList.find(s => s.id === id);
    if (activeSPPD) {
      mainEmployee = employees.find(e => e.id === activeSPPD?.pegawaiId);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  if (type === "surattugas" && !activeST) {
    return (
      <div className="p-8 text-center text-slate-500">
        Data Surat Tugas tidak ditemukan.
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg">Kembali</button>
      </div>
    );
  }

  if (type === "sppd" && !activeSPPD) {
    return (
      <div className="p-8 text-center text-slate-500">
        Data SPPD tidak ditemukan.
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg">Kembali</button>
      </div>
    );
  }

  const kop = template.kop;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:bg-white print:p-0 print:m-0">
      {/* Upper Navigation and Printing Tools - HIDDEN DURING PRINTING */}
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-200"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Pengelolaan</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Info size={14} /> Ukuran kertas rekomendasi: <strong>A4</strong> atau <strong>F4 (Folio)</strong>
          </span>
          <button
            onClick={handlePrint}
            id="btn-print-action"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Dokumen Sekarang</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-[2cm] shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 font-sans text-black leading-relaxed">
        
        {/* =========================================================================
            1. COPF SURAT (OFFICIAL LETTERHEAD) - RENDERED IN SAME PATTERN FOR BOTH
            ========================================================================= */}
        <div className="text-center relative pb-3 border-b-4 border-double border-black select-none">
          {/* Logo Kabupaten Kapuas Hulu di sebelah kiri */}
          <div className="absolute left-1 top-0 w-16 h-20 flex items-center justify-center select-none">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Lambang_Kabupaten_Kapuas_Hulu.png" 
              alt="Logo Kabupaten Kapuas Hulu"
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="space-y-0.5 pl-20 pr-20">
            <h4 className="text-xs font-bold tracking-wider uppercase leading-none">
              {kop.pemerintah}
            </h4>
            <h3 className="text-sm font-bold tracking-wide uppercase leading-none">
              {kop.dinas}
            </h3>
            <h2 className="text-base font-extrabold tracking-tight uppercase leading-tight font-sans">
              {kop.puskesmas}
            </h2>
            <p className="text-[10px] leading-normal font-medium italic mt-1 font-sans">
              Alamat: {kop.alamat}
            </p>
            <p className="text-[9px] font-medium leading-none font-sans">
              Telp: {kop.telepon} | Email: {kop.email} | Kode Pos: {kop.kodePos}
            </p>
          </div>
        </div>

        {/* =========================================================================
            2. BODY RENDERER FOR SURAT TUGAS
            ========================================================================= */}
        {type === "surattugas" && activeST && (
          <div className="pt-6 space-y-6 text-xs text-justify">
            {/* Title */}
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold underline tracking-wide font-sans">SURAT TUGAS</h3>
              <p className="font-mono text-[10px] text-slate-800 font-medium">
                Nomor: {activeST.nomorSurat}
              </p>
            </div>

            {/* Dasar (References) */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-2 font-bold font-sans">Dasar :</div>
              <div className="col-span-10 space-y-1.5 font-sans">
                {activeST.dasar.map((ds, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="shrink-0">{idx + 1}.</span>
                    <p className="flex-1 text-justify">{ds}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Command title */}
            <div className="text-center font-extrabold py-1 font-sans tracking-widest text-[13px] uppercase">
              MEMERINTAHKAN :
            </div>

            {/* Kepada (Assigned Personnel) */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-2 font-bold font-sans">Kepada :</div>
              <div className="col-span-10 space-y-4 font-sans">
                {employeeList.map((emp, index) => (
                  <div key={emp.id} className="grid grid-cols-12 gap-1">
                    <div className="col-span-1 font-bold">{index + 1}.</div>
                    <div className="col-span-11 space-y-0.5">
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Nama / Golongan</span>
                        <span className="col-span-8">: <strong>{emp.name}</strong> {emp.pangkatGol !== "-" ? `(${emp.pangkatGol})` : ""}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">NIP</span>
                        <span className="col-span-8">: {emp.nip}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Jabatan</span>
                        <span className="col-span-8">: {emp.jabatan}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Untuk (Destination & Purpose) */}
            <div className="grid grid-cols-12 gap-2 items-start pt-2">
              <div className="col-span-2 font-bold font-sans">Untuk :</div>
              <div className="col-span-10 space-y-1.5 font-sans text-justify">
                <div className="flex gap-2">
                  <span className="shrink-0">1.</span>
                  <p className="flex-1">
                    {activeST.maksud}.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0">2.</span>
                  <p className="flex-1">
                    Tempat Tujuan adalah di **{activeST.tempatTujuan}**.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0">3.</span>
                  <p className="flex-1">
                    Pelaksanaan tugas terhitung mulai tanggal <strong>{formatIndonesianDate(activeST.tanggalMulai)}</strong> s/d <strong>{formatIndonesianDate(activeST.tanggalSelesai)}</strong>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0">4.</span>
                  <p className="flex-1">
                    Melaporkan hasil pelaksanaan tugas kepada Kepala UPTD Puskesmas Boyan Tanjung setelah selesai melaksanakan kegiatan.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0">5.</span>
                  <p className="flex-1">
                    Melaksanakan Surat Tugas ini dengan seksama dan penuh rasa tanggung jawab.
                  </p>
                </div>
              </div>
            </div>

            {/* Budget Charging statement */}
            {activeST.pembebananAnggaran && (
              <p className="text-[11px] leading-relaxed italic border-t border-slate-100 pt-2 font-sans select-none">
                Biaya pelaksanaan tugas ini dibebankan pada anggaran {activeST.pembebananAnggaran}.
              </p>
            )}

            {/* Signature Block Right */}
            <div className="pt-8 flex justify-end">
              <div className="w-80 text-left space-y-12 font-sans">
                <div className="space-y-1">
                  <p>Dikeluarkan di : Boyan Tanjung</p>
                  <p className="border-b border-black pb-1">Pada Tanggal : {formatIndonesianDate(activeST.tanggalSurat)}</p>
                  <p className="font-bold pt-1 uppercase">{activeST.penandatanganJabatan}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="font-bold underline text-xs">{activeST.penandatanganNama}</p>
                  {activeST.penandatanganNip !== "-" && (
                    <p className="text-[11px]">NIP. {activeST.penandatanganNip}</p>
                  )}
                  {activeST.penandatanganPangkat !== "-" && (
                    <p className="text-[10px] italic text-slate-500 font-sans">{activeST.penandatanganPangkat}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. BODY RENDERER FOR SPPD (SURAT PERINTAH PERJALANAN DINAS)
            ========================================================================= */}
        {type === "sppd" && activeSPPD && (
          <div className="pt-4 space-y-4 text-[10px] font-sans leading-tight">
            {/* Title */}
            <div className="text-center space-y-0.5">
              <h3 className="text-xs font-extrabold underline tracking-wide">SURAT PERINTAH PERJALANAN DINAS (SPPD)</h3>
              <p className="font-mono text-[9px] text-slate-800">
                Nomor: {activeSPPD.nomorSppd}
              </p>
            </div>

            {/* 10 Items formal grid table */}
            <table className="w-full border-collapse border border-black font-sans text-[10px]">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold w-8">1</td>
                  <td className="p-1.5 border-r border-black w-48">Pejabat Pemberi Perintah</td>
                  <td className="p-1.5 font-semibold" colSpan={2}>{activeSPPD.pejabatPemberiPerintah}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold">2</td>
                  <td className="p-1.5 border-r border-black">Nama Pegawai yang Diperintah</td>
                  <td className="p-1.5 font-bold" colSpan={2}>{mainEmployee?.name || "Pegawai Terhapus"}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold" rowSpan={3}>3</td>
                  <td className="p-1.5 border-r border-black">a. Pangkat dan Golongan</td>
                  <td className="p-1.5" colSpan={2}>a. {mainEmployee?.pangkatGol || "-"}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black">b. Jabatan</td>
                  <td className="p-1.5" colSpan={2}>b. {mainEmployee?.jabatan || "-"}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black">c. Tingkat Biaya Perjalanan Dinas</td>
                  <td className="p-1.5" colSpan={2}>c. {activeSPPD.tingkatBiaya}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold">4</td>
                  <td className="p-1.5 border-r border-black">Maksud Perjalanan Dinas</td>
                  <td className="p-1.5 text-justify leading-relaxed" colSpan={2}>{activeSPPD.maksudPerjalanan}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold">5</td>
                  <td className="p-1.5 border-r border-black">Alat Angkutan yang Dipergunakan</td>
                  <td className="p-1.5" colSpan={2}>{activeSPPD.alatAngkutan}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold" rowSpan={2}>6</td>
                  <td className="p-1.5 border-r border-black">a. Tempat Berangkat</td>
                  <td className="p-1.5" colSpan={2}>a. {activeSPPD.tempatBerangkat}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black">b. Tempat Tujuan</td>
                  <td className="p-1.5" colSpan={2}>b. {activeSPPD.tempatTujuan}</td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold" rowSpan={3}>7</td>
                  <td className="p-1.5 border-r border-black">a. Lamanya Perjalanan Dinas</td>
                  <td className="p-1.5" colSpan={2}>a. {activeSPPD.lamaPerjalanan} Hari</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black">b. Tanggal Berangkat</td>
                  <td className="p-1.5" colSpan={2}>b. {formatIndonesianDate(activeSPPD.tanggalBerangkat)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black">c. Tanggal Harus Kembali</td>
                  <td className="p-1.5" colSpan={2}>c. {formatIndonesianDate(activeSPPD.tanggalKembali)}</td>
                </tr>

                {/* Companions */}
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold">8</td>
                  <td className="p-1.5 border-r border-black">Pengikut (Companions)</td>
                  <td className="p-0" colSpan={2}>
                    {activeSPPD.pengikut.length > 0 ? (
                      <table className="w-full text-[9px] border-none">
                        <thead>
                          <tr className="border-b border-black bg-slate-50 font-bold">
                            <th className="p-1 w-8 border-r border-black text-center">No</th>
                            <th className="p-1 border-r border-black">Nama Lengkap</th>
                            <th className="p-1 border-r border-black">Tgl Lahir / Umur</th>
                            <th className="p-1">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/40">
                          {activeSPPD.pengikut.map((p, i) => (
                            <tr key={i}>
                              <td className="p-1 border-r border-black text-center font-semibold">{i + 1}</td>
                              <td className="p-1 border-r border-black font-semibold">{p.nama}</td>
                              <td className="p-1 border-r border-black">{p.tanggalLahir}</td>
                              <td className="p-1">{p.keterangan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span className="p-1.5 block text-slate-400 italic">Tidak ada pengikut</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black text-center font-bold" rowSpan={2}>9</td>
                  <td className="p-1.5 border-r border-black">Pembebanan Anggaran:</td>
                  <td className="p-1.5 border-r border-black w-48">a. Instansi</td>
                  <td className="p-1.5">a. {activeSPPD.instansi}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black"></td>
                  <td className="p-1.5 border-r border-black">b. Mata Anggaran / Rekening</td>
                  <td className="p-1.5 font-mono">b. {activeSPPD.mataAnggaran}</td>
                </tr>

                <tr>
                  <td className="p-1.5 border-r border-black text-center font-bold">10</td>
                  <td className="p-1.5 border-r border-black">Keterangan Lain-lain</td>
                  <td className="p-1.5 text-justify" colSpan={2}>{activeSPPD.keteranganLain}</td>
                </tr>
              </tbody>
            </table>

            {/* Signature Frame SPPD */}
            <div className="pt-4 flex justify-end">
              <div className="w-80 text-left space-y-12 font-sans">
                <div className="space-y-0.5">
                  <p>Dikeluarkan di : Boyan Tanjung</p>
                  <p className="border-b border-black pb-1">Pada Tanggal : {formatIndonesianDate(activeSPPD.tanggalSppd)}</p>
                  <p className="font-bold pt-1 uppercase text-[9px]">{activeSPPD.penandatanganJabatan}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="font-bold underline">{activeSPPD.penandatanganNama}</p>
                  {activeSPPD.penandatanganNip !== "-" && (
                    <p>NIP. {activeSPPD.penandatanganNip}</p>
                  )}
                  {activeSPPD.penandatanganPangkat !== "-" && (
                    <p className="text-[9px] italic text-slate-500 font-sans">{activeSPPD.penandatanganPangkat}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footnote stamp box for physical validation */}
        <div className="mt-12 pt-6 border-t border-dashed border-slate-300 text-[8px] text-slate-400 flex justify-between items-center select-none print:hidden">
          <span>SILUK BERTUAH - UPTD Puskesmas Boyan Tanjung</span>
          <span>Dicetak otomatis &bull; Validasi fisik stempel dinas diperlukan</span>
        </div>
      </div>
    </div>
  );
}
