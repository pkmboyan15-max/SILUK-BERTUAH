import { useState, useEffect } from "react";
import { 
  DEFAULT_EMPLOYEES, 
  DEFAULT_SETTINGS, 
  DEFAULT_TEMPLATE, 
  DEFAULT_SURAT_TUGAS, 
  DEFAULT_SPPD 
} from "./data/defaults";
import { Employee, SuratTugas, SPPD, LetterTemplate, AppSettings } from "./types";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeeManager from "./components/EmployeeManager";
import SuratTugasManager from "./components/SuratTugasManager";
import SppdManager from "./components/SppdManager";
import TemplateEditor from "./components/TemplateEditor";
import SettingsManager from "./components/SettingsManager";
import PrintView from "./components/PrintView";
import { generateId } from "./utils";
import { 
  pullDataFromSupabase, 
  testSupabaseConnection, 
  supabaseUpsertEmployee, 
  supabaseDeleteEmployee,
  supabaseUpsertSuratTugas, 
  supabaseDeleteSuratTugas, 
  supabaseUpsertSppd, 
  supabaseDeleteSppd, 
  supabaseUpsertTemplate, 
  supabaseUpsertSettings, 
  supabaseUpdatePassword,
  SupabaseSyncStatus
} from "./supabaseClient";

export default function App() {
  // Session Security State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("boyantanjung123");

  // Core App states loaded from LocalStorage
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suratTugasList, setSuratTugasList] = useState<SuratTugas[]>([]);
  const [sppdList, setSppdList] = useState<SPPD[]>([]);
  const [template, setTemplate] = useState<LetterTemplate>(DEFAULT_TEMPLATE);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Supabase Database Connection & Sync Status
  const [dbStatus, setDbStatus] = useState<SupabaseSyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>("");

  // UI Navigation states
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [printDocument, setPrintDocument] = useState<{ type: "surattugas" | "sppd"; id: string } | null>(null);

  // Initial Load from LocalStorage & Supabase Sync
  useEffect(() => {
    // 1. Load from LocalStorage first to guarantee instant start
    try {
      // Password
      const storedPassword = localStorage.getItem("siluk_password");
      if (storedPassword) {
        setPassword(storedPassword);
      } else {
        localStorage.setItem("siluk_password", "boyantanjung123");
      }

      // Login Session check
      const sessionAuth = sessionStorage.getItem("siluk_auth");
      if (sessionAuth === "true") {
        setIsLoggedIn(true);
      }

      // Employees
      const storedEmployees = localStorage.getItem("siluk_employees");
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        setEmployees(DEFAULT_EMPLOYEES);
        localStorage.setItem("siluk_employees", JSON.stringify(DEFAULT_EMPLOYEES));
      }

      // Surat Tugas
      const storedST = localStorage.getItem("siluk_surat_tugas");
      if (storedST) {
        setSuratTugasList(JSON.parse(storedST));
      } else {
        setSuratTugasList(DEFAULT_SURAT_TUGAS);
        localStorage.setItem("siluk_surat_tugas", JSON.stringify(DEFAULT_SURAT_TUGAS));
      }

      // SPPD
      const storedSPPD = localStorage.getItem("siluk_sppd");
      if (storedSPPD) {
        setSppdList(JSON.parse(storedSPPD));
      } else {
        setSppdList(DEFAULT_SPPD);
        localStorage.setItem("siluk_sppd", JSON.stringify(DEFAULT_SPPD));
      }

      // Template
      const storedTemplate = localStorage.getItem("siluk_template");
      if (storedTemplate) {
        setTemplate(JSON.parse(storedTemplate));
      } else {
        setTemplate(DEFAULT_TEMPLATE);
        localStorage.setItem("siluk_template", JSON.stringify(DEFAULT_TEMPLATE));
      }

      // Settings
      const storedSettings = localStorage.getItem("siluk_settings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem("siluk_settings", JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      console.error("Gagal memuat database lokal", e);
    }

    // 2. Perform background sync with Supabase
    syncSupabaseData();
  }, []);

  const syncSupabaseData = async () => {
    setIsSyncing(true);
    setSyncMessage("Sinkronisasi database online...");
    try {
      const status = await testSupabaseConnection();
      setDbStatus(status);

      if (status.connected) {
        const pulled = await pullDataFromSupabase();
        
        if (pulled.password !== null) {
          setPassword(pulled.password);
          localStorage.setItem("siluk_password", pulled.password);
        }
        if (pulled.employees !== null) {
          setEmployees(pulled.employees);
          localStorage.setItem("siluk_employees", JSON.stringify(pulled.employees));
        }
        if (pulled.suratTugas !== null) {
          setSuratTugasList(pulled.suratTugas);
          localStorage.setItem("siluk_surat_tugas", JSON.stringify(pulled.suratTugas));
        }
        if (pulled.sppd !== null) {
          setSppdList(pulled.sppd);
          localStorage.setItem("siluk_sppd", JSON.stringify(pulled.sppd));
        }
        if (pulled.template !== null) {
          setTemplate(pulled.template);
          localStorage.setItem("siluk_template", JSON.stringify(pulled.template));
        }
        if (pulled.settings !== null) {
          setSettings(pulled.settings);
          localStorage.setItem("siluk_settings", JSON.stringify(pulled.settings));
        }
        setSyncMessage("Sinkronisasi Supabase berhasil!");
      } else {
        setSyncMessage("Gagal terhubung ke Supabase. Menggunakan data offline.");
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data online:", err);
      setSyncMessage("Supabase offline.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(""), 4000);
    }
  };

  // Save triggers helper
  const saveEmployees = (data: Employee[]) => {
    setEmployees(data);
    localStorage.setItem("siluk_employees", JSON.stringify(data));
  };

  const saveSuratTugas = (data: SuratTugas[]) => {
    setSuratTugasList(data);
    localStorage.setItem("siluk_surat_tugas", JSON.stringify(data));
  };

  const saveSppdList = (data: SPPD[]) => {
    setSppdList(data);
    localStorage.setItem("siluk_sppd", JSON.stringify(data));
  };

  const saveTemplate = async (data: LetterTemplate) => {
    setTemplate(data);
    localStorage.setItem("siluk_template", JSON.stringify(data));
    try {
      await supabaseUpsertTemplate(data);
    } catch (e) {
      console.warn("Gagal menyimpan template ke Supabase:", e);
    }
  };

  const saveSettings = async (data: AppSettings) => {
    setSettings(data);
    localStorage.setItem("siluk_settings", JSON.stringify(data));
    try {
      await supabaseUpsertSettings(data);
    } catch (e) {
      console.warn("Gagal menyimpan settings ke Supabase:", e);
    }
  };

  // Login handler
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("siluk_auth", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("siluk_auth");
  };

  const handleUpdatePassword = async (newPass: string) => {
    setPassword(newPass);
    localStorage.setItem("siluk_password", newPass);
    try {
      await supabaseUpdatePassword(newPass);
    } catch (e) {
      console.warn("Gagal mengubah password di Supabase:", e);
    }
  };

  // CRUD handlers - Employee
  const handleAddEmployee = async (emp: Employee) => {
    const updated = [...employees, emp];
    saveEmployees(updated);
    try {
      await supabaseUpsertEmployee(emp);
    } catch (e) {
      console.warn("Gagal menyimpan pegawai ke Supabase:", e);
    }
  };

  const handleUpdateEmployee = async (emp: Employee) => {
    const updated = employees.map(e => e.id === emp.id ? emp : e);
    saveEmployees(updated);
    try {
      await supabaseUpsertEmployee(emp);
    } catch (e) {
      console.warn("Gagal memperbarui pegawai di Supabase:", e);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    saveEmployees(updated);
    try {
      await supabaseDeleteEmployee(id);
    } catch (e) {
      console.warn("Gagal menghapus pegawai di Supabase:", e);
    }
  };

  // CRUD handlers - Surat Tugas
  const handleAddSuratTugas = async (st: SuratTugas) => {
    const updated = [st, ...suratTugasList];
    saveSuratTugas(updated);
    try {
      await supabaseUpsertSuratTugas(st);
    } catch (e) {
      console.warn("Gagal menyimpan surat tugas ke Supabase:", e);
    }
  };

  const handleDeleteSuratTugas = async (id: string) => {
    const updated = suratTugasList.filter(st => st.id !== id);
    saveSuratTugas(updated);
    try {
      await supabaseDeleteSuratTugas(id);
    } catch (e) {
      console.warn("Gagal menghapus surat tugas di Supabase:", e);
    }
  };

  // CRUD handlers - SPPD
  const handleAddSppd = async (sppd: SPPD) => {
    const updated = [sppd, ...sppdList];
    saveSppdList(updated);
    try {
      await supabaseUpsertSppd(sppd);
    } catch (e) {
      console.warn("Gagal menyimpan SPPD ke Supabase:", e);
    }
  };

  const handleDeleteSppd = async (id: string) => {
    const updated = sppdList.filter(s => s.id !== id);
    saveSppdList(updated);
    try {
      await supabaseDeleteSppd(id);
    } catch (e) {
      console.warn("Gagal menghapus SPPD di Supabase:", e);
    }
  };

  // Dynamic 1-Click SPPD generation from Surat Tugas
  const handleGenerateSppdFromSt = (st: SuratTugas, selectedEmpId: string) => {
    // Determine details
    const selectedEmp = employees.find(e => e.id === selectedEmpId);
    if (!selectedEmp) return;

    // Calculate duration in days
    const d1 = new Date(st.tanggalMulai);
    const d2 = new Date(st.tanggalSelesai);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Filter other employees to add as companions
    const companions = st.pegawaiIds
      .filter(id => id !== selectedEmpId)
      .map(id => {
        const otherEmp = employees.find(e => e.id === id);
        return {
          nama: otherEmp?.name || "Pegawai",
          tanggalLahir: "-",
          keterangan: otherEmp?.jabatan || "Pelaksana"
        };
      });

    // Structure automatic roman numerals & serial number sequence
    const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const curDate = new Date();
    const curMonthRoman = romanMonths[curDate.getMonth()];
    
    let nextSppdNo = `090 / ${sppdList.length + 232} / SPPD / PKM-BT / ${curMonthRoman} / ${curDate.getFullYear()}`;
    if (sppdList.length > 0) {
      const lastNomor = sppdList[0].nomorSppd;
      const parts = lastNomor.split("/");
      if (parts.length >= 2) {
        const numPart = parts[1].trim();
        const parsedNum = parseInt(numPart, 10);
        if (!isNaN(parsedNum)) {
          const nextNum = parsedNum + 1;
          parts[1] = ` ${nextNum} `;
          nextSppdNo = parts.join("/");
        }
      }
    }

    const autoSppd: SPPD = {
      id: generateId("sppd"),
      suratTugasId: st.id,
      nomorSppd: nextSppdNo,
      pegawaiId: selectedEmpId,
      pejabatPemberiPerintah: template.sppdDefaults.pejabatPemberiPerintah,
      tingkatBiaya: template.sppdDefaults.tingkatBiaya,
      maksudPerjalanan: st.maksud,
      alatAngkutan: template.sppdDefaults.alatAngkutan,
      tempatBerangkat: template.sppdDefaults.tempatBerangkat,
      tempatTujuan: st.tempatTujuan,
      lamaPerjalanan: diffDays,
      tanggalBerangkat: st.tanggalMulai,
      tanggalKembali: st.tanggalSelesai,
      pengikut: companions,
      instansi: template.sppdDefaults.instansi,
      mataAnggaran: template.sppdDefaults.mataAnggaran,
      keteranganLain: "-",
      tanggalSppd: st.tanggalSurat,
      penandatanganNama: st.penandatanganNama,
      penandatanganNip: st.penandatanganNip,
      penandatanganPangkat: st.penandatanganPangkat,
      penandatanganJabatan: st.penandatanganJabatan
    };

    const updated = [autoSppd, ...sppdList];
    saveSppdList(updated);
    
    // Jump to SPPD list and open notification
    setCurrentTab("sppd");
    alert(`SPPD berhasil dibuat otomatis untuk "${selectedEmp.name}" berdasarkan Surat Tugas! Silakan tinjau dan cetak langsung.`);
  };

  // Maintenance Handlers
  const handleClearAllData = () => {
    localStorage.clear();
    setEmployees([]);
    setSuratTugasList([]);
    setSppdList([]);
    setTemplate(DEFAULT_TEMPLATE);
    setSettings(DEFAULT_SETTINGS);
    setPassword("boyantanjung123");
    setIsLoggedIn(false);
    sessionStorage.clear();
  };

  const handleLoadDemoData = () => {
    saveEmployees(DEFAULT_EMPLOYEES);
    saveSuratTugas(DEFAULT_SURAT_TUGAS);
    saveSppdList(DEFAULT_SPPD);
    saveTemplate(DEFAULT_TEMPLATE);
    saveSettings(DEFAULT_SETTINGS);
  };

  // Render Section
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} correctPasswordHash={password} />;
  }

  // If printable is active, render print-only viewport
  if (printDocument) {
    return (
      <PrintView
        type={printDocument.type}
        id={printDocument.id}
        employees={employees}
        suratTugasList={suratTugasList}
        sppdList={sppdList}
        template={template}
        onClose={() => setPrintDocument(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Header Section */}
      <header className="h-16 bg-indigo-900 text-white flex items-center justify-between px-8 shrink-0 shadow-lg print:hidden z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">SILUK BERTUAH</h1>
              {isSyncing && (
                <span className="px-2 py-0.5 text-[9px] bg-indigo-500 text-white rounded-full animate-pulse font-mono font-bold">
                  🔄 Sinkronisasi...
                </span>
              )}
              {dbStatus?.connected && !isSyncing && (
                <span className="px-2 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Supabase Connected
                </span>
              )}
              {dbStatus && !dbStatus.connected && !isSyncing && (
                <span className="px-2 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                  Mode Lokal (Offline)
                </span>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold">UPT Puskesmas Boyan Tanjung</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Administrator Utama</p>
            <p className="text-[10px] text-indigo-300">pkmboyantanjung15@gmail.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-400 flex items-center justify-center shadow">
            <span className="font-bold text-sm">AD</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          onChangeTab={setCurrentTab} 
          onLogout={handleLogout} 
          userEmail="pkmboyantanjung15@gmail.com"
        />

        {/* Main Viewport Content */}
        <main className="flex-1 p-8 overflow-y-auto pb-16 bg-slate-50 print:p-0 print:m-0">
          <div className="max-w-6xl mx-auto space-y-8">
            {currentTab === "dashboard" && (
              <Dashboard 
                employees={employees}
                suratTugasList={suratTugasList}
                sppdList={sppdList}
                onNavigateToTab={setCurrentTab}
                onSelectPrintLetter={(type, id) => setPrintDocument({ type, id })}
              />
            )}

            {currentTab === "pegawai" && (
              <EmployeeManager 
                employees={employees}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onResetToDefault={handleLoadDemoData}
              />
            )}

            {currentTab === "surattugas" && (
              <SuratTugasManager 
                employees={employees}
                suratTugasList={suratTugasList}
                template={template}
                onAddSuratTugas={handleAddSuratTugas}
                onDeleteSuratTugas={handleDeleteSuratTugas}
                onSelectPrintLetter={(type, id) => setPrintDocument({ type, id })}
                onGenerateSppdFromSt={handleGenerateSppdFromSt}
              />
            )}

            {currentTab === "sppd" && (
              <SppdManager 
                employees={employees}
                sppdList={sppdList}
                suratTugasList={suratTugasList}
                template={template}
                onAddSppd={handleAddSppd}
                onDeleteSppd={handleDeleteSppd}
                onSelectPrintLetter={(type, id) => setPrintDocument({ type, id })}
              />
            )}

            {currentTab === "template" && (
              <TemplateEditor 
                template={template}
                onUpdateTemplate={saveTemplate}
                onResetToDefault={() => saveTemplate(DEFAULT_TEMPLATE)}
              />
            )}

            {currentTab === "settings" && (
              <SettingsManager 
                settings={settings}
                onUpdateSettings={saveSettings}
                onUpdatePassword={handleUpdatePassword}
                onClearAllData={handleClearAllData}
                onLoadDemoData={handleLoadDemoData}
                dbStatus={dbStatus}
                isSyncing={isSyncing}
                syncMessage={syncMessage}
                onManualSync={() => syncSupabaseData()}
              />
            )}
          </div>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 text-[10px] text-slate-500 font-medium print:hidden z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {dbStatus?.connected ? 'Koneksi Supabase Online' : 'Database Offline (Lokal)'}
          </div>
          <span>Versi 1.2.0-stable</span>
          {syncMessage && <span className="text-indigo-600 font-bold ml-2 animate-bounce">{syncMessage}</span>}
        </div>
        <div>
          © 2026 SILUK BERTUAH - Pemerintah Kabupaten Kapuas Hulu
        </div>
      </footer>
    </div>
  );
}
