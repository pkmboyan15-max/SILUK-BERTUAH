import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  UserPlus, 
  X, 
  UserCheck, 
  AlertCircle 
} from "lucide-react";
import { Employee } from "../types";
import { generateId } from "../utils";

interface EmployeeManagerProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onResetToDefault: () => void;
}

export default function EmployeeManager({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onResetToDefault
}: EmployeeManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [pangkatGol, setPangkatGol] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [isPns, setIsPns] = useState(true);

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.nip.toLowerCase().includes(searchLower) ||
      emp.pangkatGol.toLowerCase().includes(searchLower) ||
      emp.jabatan.toLowerCase().includes(searchLower)
    );
  });

  const openAddModal = () => {
    setEditingEmployee(null);
    setName("");
    setNip("");
    setPangkatGol("");
    setJabatan("");
    setIsPns(true);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setNip(emp.nip === "-" ? "" : emp.nip);
    setPangkatGol(emp.pangkatGol === "-" ? "" : emp.pangkatGol);
    setJabatan(emp.jabatan);
    setIsPns(emp.nip !== "-");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !jabatan.trim()) {
      alert("Nama Pegawai dan Jabatan wajib diisi!");
      return;
    }

    const finalNip = isPns ? (nip.trim() || "-") : "-";
    const finalPangkat = isPns ? (pangkatGol.trim() || "-") : "-";

    const employeeData: Employee = {
      id: editingEmployee ? editingEmployee.id : generateId("emp"),
      name: name.trim(),
      nip: finalNip,
      pangkatGol: finalPangkat,
      jabatan: jabatan.trim()
    };

    if (editingEmployee) {
      onUpdateEmployee(employeeData);
    } else {
      onAddEmployee(employeeData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Data Pegawai
          </h2>
          <p className="text-sm text-slate-500">
            Kelola database pegawai, NIP, pangkat/golongan, dan jabatan untuk format penomoran surat otomatis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {employees.length === 0 && (
            <button
              onClick={onResetToDefault}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer"
            >
              Muat Pegawai Bawaan
            </button>
          )}
          <button
            onClick={openAddModal}
            id="btn-add-employee-trigger"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Tambah Pegawai Baru</span>
          </button>
        </div>
      </div>

      {/* Database Stats Card & Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Terdaftar</span>
            <p className="text-sm font-bold text-slate-700">{employees.length} Pegawai</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative rounded-xl max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NIP, pangkat, atau jabatan..."
            className="block w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                <th className="py-4 px-5 w-16">No</th>
                <th className="py-4 px-5">Nama Pegawai</th>
                <th className="py-4 px-5">NIP / Identitas</th>
                <th className="py-4 px-5">Pangkat / Golongan</th>
                <th className="py-4 px-5">Jabatan Pokok</th>
                <th className="py-4 px-5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-5 font-medium text-slate-400">{index + 1}</td>
                  <td className="py-4 px-5 font-semibold text-slate-800">
                    {emp.name}
                  </td>
                  <td className="py-4 px-5">
                    {emp.nip === "-" ? (
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-400 text-xs font-medium">
                        Non-PNS / Honorer
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        {emp.nip}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {emp.pangkatGol === "-" ? (
                      <span className="text-slate-400 text-xs">-</span>
                    ) : (
                      <span className="font-medium text-slate-700">{emp.pangkatGol}</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-slate-700 font-medium">{emp.jabatan}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(emp)}
                        title="Edit Pegawai"
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus data pegawai "${emp.name}"?`)) {
                            onDeleteEmployee(emp.id);
                          }
                        }}
                        title="Hapus Pegawai"
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users size={32} className="mx-auto text-slate-300" />
                      <p className="font-medium text-sm text-slate-600">Tidak ada pegawai ditemukan</p>
                      <p className="text-xs">Silakan tambahkan pegawai baru atau periksa filter pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-800">
                <UserCheck size={18} />
                <h3 className="font-bold text-sm tracking-tight">
                  {editingEmployee ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Status PNS vs Honorer */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Status Kepegawaian</span>
                  <span className="text-[10px] text-slate-400">Pilih status PNS untuk memunculkan NIP & Golongan</span>
                </div>
                <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsPns(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      isPns 
                        ? "bg-white text-indigo-800 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    PNS / ASN
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPns(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      !isPns 
                        ? "bg-white text-indigo-800 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Honorer / Non-PNS
                  </button>
                </div>
              </div>

              {/* Nama Pegawai */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pegawai <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Faisal, S.Kep., Ners"
                  className="block w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Conditionally render NIP and Pangkat if PNS */}
              {isPns && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NIP */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Induk Pegawai (NIP)
                    </label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Contoh: 19820512 200501 1 004"
                      className="block w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  {/* Pangkat / Golongan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pangkat / Golongan
                    </label>
                    <input
                      type="text"
                      value={pangkatGol}
                      onChange={(e) => setPangkatGol(e.target.value)}
                      placeholder="Contoh: Penata Tk. I - III/d"
                      className="block w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Jabatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Pokok <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Kepala UPTD Puskesmas Boyan Tanjung"
                  className="block w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-employee"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/15 cursor-pointer"
                >
                  {editingEmployee ? "Simpan Perubahan" : "Simpan Pegawai"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
