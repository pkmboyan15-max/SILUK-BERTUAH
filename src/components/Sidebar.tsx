import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Car, 
  Settings, 
  Layout, 
  LogOut, 
  UserCircle 
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onLogout: () => void;
  userEmail: string;
}

export default function Sidebar({ currentTab, onChangeTab, onLogout, userEmail }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pegawai", label: "Data Pegawai", icon: Users },
    { id: "surattugas", label: "Surat Tugas", icon: FileText },
    { id: "sppd", label: "SPPD", icon: Car },
    { id: "template", label: "Edit Template", icon: Layout },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col border-r border-slate-700 shrink-0 print:hidden">
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <IconComponent size={18} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/30">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-3 bg-slate-700/30">
          <UserCircle size={32} className="text-slate-400 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">Operator PKM</p>
            <p className="text-[10px] text-slate-400 truncate" title={userEmail}>
              {userEmail || "pkmboyantanjung15@gmail.com"}
            </p>
          </div>
        </div>

        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-900/20 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
