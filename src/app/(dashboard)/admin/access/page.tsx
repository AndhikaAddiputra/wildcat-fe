"use client";

import { useState, useEffect } from "react";
import { Button, Badge, Navbar, Footer } from "@/components/ui";
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";
import { Plus, RotateCw, Funnel, Pencil, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

export default function AccessControlPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [committee, setCommittee] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 STATE UNTUK MODAL COMMITTEE (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "Committee",
    division: "",
    isActive: true
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, committeeRes] = await Promise.all([
        fetchWithAuth("/api/admin/teams", { cache: "no-store" }),
        fetchWithAuth("/api/admin/committee", { cache: "no-store" })
      ]);
      if (teamsRes.ok) {
        const tData = await teamsRes.json();
        setTeams(tData.data?.teams || []);
      }
      if (committeeRes.ok) {
        const cData = await committeeRes.json();
        setCommittee(cData.data?.members || []);
      }
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(/\./g, ':');
  };

  // 🌟 FUNGSI: Buka Modal (New / Edit)
  const handleOpenModal = (member?: any) => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name,
        role: member.role,
        division: member.division || "",
        isActive: member.isActive
      });
    } else {
      setFormData({ id: "", name: "", role: "Committee", division: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  // 🌟 FUNGSI: Submit Form (Upsert POST)
  const handleSubmitCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Jika ID kosong, jangan kirim properti ID (biar backend bikin UUID baru)
    const payload: any = { ...formData };
    if (!payload.id) delete payload.id;

    try {
      const res = await fetchWithAuth("/api/admin/committee", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Data panitia berhasil disimpan!");
        setIsModalOpen(false);
        loadData();
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.error || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🌟 FUNGSI: Delete Committee
  const handleDeleteCommittee = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus panitia "${name}" secara permanen?`)) return;

    try {
      const res = await fetchWithAuth(`/api/admin/committee?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Panitia berhasil dihapus!");
        loadData();
      } else {
        const errData = await res.json();
        alert(`Gagal menghapus: ${errData.error || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white font-['Poppins']">
      <div className="relative min-h-screen flex-1 bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar logo={LOGO} links={ADMIN_NAV_LINKS} activeLink="/admin/access" action={ADMIN_NAV_ACTION} mobileAction={ADMIN_NAV_ACTION} />

        <section className="relative flex pt-32 mx-auto w-[80%] items-center">
          <div className="text-left">
            <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
              Access Control
            </h3>
            <p className="text-2xl font-semibold text-[#F1E1B4]">
              Grant access and control accounts limitation here
            </p>
          </div>
        </section>

        <main className="flex flex-1 justify-center mx-auto py-12 min-h-[55vw]">
          <section className="w-[80%]">
            
            {/* ==================================================================================== */}
            {/* COMMITTEE ACCOUNTS TABLE */}
            {/* ==================================================================================== */}
            <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
              <div className="flex justify-between items-center w-full">
                <h4 className="font-semibold text-[36px] text-cream">Committee's Accounts</h4>
                <div className="flex justify-between w-[560px]">
                  <Button variant="primary" size="lg" className="min-w-[180px]" onClick={() => handleOpenModal()}>
                    <Plus size={16} strokeWidth={3} /> New
                  </Button>
                  <Button variant="primary" size="lg" className="min-w-[180px]" onClick={loadData}>
                    <RotateCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh
                  </Button>
                  <Button variant="primary" size="lg" className="min-w-[180px]">
                    <Funnel fill="#0b2e6f" size={16} /> Filter
                  </Button>
                </div>
              </div>
              <div className="w-full pt-8 app-table-wrapper">
                <table className="app-table">
                  <colgroup>
                    <col style={{ width: "20%" }} /><col style={{ width: "28%" }} /><col style={{ width: "18%" }} /><col style={{ width: "17%" }} /><col style={{ width: "17%" }} />
                  </colgroup>
                  <thead>
                    <tr className="text-white">
                      <th>Account Created</th><th>Name / Division</th><th>Role</th><th>Edit</th><th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={5} className="text-center py-10 text-orange-400 animate-pulse font-bold">Loading Data...</td></tr>
                    ) : committee.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-10 text-white/50">Belum ada akun panitia.</td></tr>
                    ) : (
                      committee.map((member) => (
                        <tr key={member.id} className="border-t">
                          <td>{formatDate(member.createdAt)}</td>
                          <td>
                            <div className="font-semibold text-orange-400">{member.name}</div>
                            <div className="text-xs text-white/60">{member.division || "-"}</div>
                          </td>
                          <td className="action">
                            <Badge variant="verified" className={`${member.isActive ? "border-green-400 text-green-400" : "border-gray-500 text-gray-500"} bg-transparent`}>
                              {member.role} {member.isActive ? "" : "(Inactive)"}
                            </Badge>
                          </td>
                          <td className="action">
                            <Button variant="secondary" onClick={() => handleOpenModal(member)}>
                              Edit <Pencil size={16} />
                            </Button>
                          </td>
                          <td className="action">
                            <Button variant="secondary" className="bg-red" onClick={() => handleDeleteCommittee(member.id, member.name)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                  <div className="flex items-center gap-4">
                    <span className="text-cream font-semibold">Show data per page: </span>
                    <input type="number" min={1} defaultValue={10} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  </div>
                  <div className="w-[400px] min-w-fit flex justify-between items-center">
                    <Button variant="secondary" size="md" className="w-[125px] min-w-fit"><ChevronLeft /> Previous</Button>
                    <input type="number" min={1} defaultValue={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                    <Button variant="secondary" size="md" className="w-[125px] min-w-fit">Next <ChevronRight /></Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================================================== */}
            {/* PARTICIPANT ACCOUNTS TABLE */}
            {/* ==================================================================================== */}
            <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 mt-8">
              <div className="flex justify-between items-center w-full">
                <div className="">
                  <h4 className="font-semibold text-[36px] text-cream">
                    Participant's Accounts
                  </h4>
                </div>
                <div className="flex justify-between w-[560px]">
                  <Button variant="primary" size="lg" className="min-w-[180px]">
                    <Plus size={16} strokeWidth={3} />
                    New
                  </Button>
                  <Button variant="primary" size="lg" className="min-w-[180px]" onClick={loadData}>
                    <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                  </Button>
                  <Button variant="primary" size="lg" className="min-w-[180px]">
                    <Funnel fill="#0b2e6f" size={16} />
                    Filter
                  </Button>
                </div>
              </div>
              <div className="w-full pt-8 app-table-wrapper">
                <table className="app-table">
                  <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "17%" }} />
                  </colgroup>
                  <thead>
                    <tr className="text-white">
                      <th>Account Created</th>
                      <th>Team Name</th>
                      <th>Payment Status</th>
                      <th>Phone Number</th>
                      <th>Line ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={5} className="text-center py-10 text-orange-400 animate-pulse font-bold">Loading Data...</td></tr>
                    ) : teams.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-10 text-white/50">Belum ada akun peserta.</td></tr>
                    ) : (
                      teams.map((team) => (
                        <tr key={team.id} className="border-t">
                          <td>{formatDate(team.createdAt)}</td>
                          <td className="font-semibold">{team.teamName}</td>
                          <td className="action">
                            {team.status?.paymentStatus === 'Verified' ? (
                               <Badge variant="complete">Verified</Badge>
                            ) : team.status?.paymentStatus === 'Rejected' ? (
                               <Badge variant="destructive" className="bg-red-500">Rejected</Badge>
                            ) : (
                               <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>
                            )}
                          </td>
                          <td className="action">{team.phoneNumber || "-"}</td>
                          <td className="action">{team.lineId || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                  <div className="flex items-center gap-4">
                    <span className="text-cream font-semibold">Show data per page: </span>
                    <input type="number" min={1} defaultValue={10} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  </div>
                  <div className="w-[400px] min-w-fit flex justify-between items-center">
                    <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                      <ChevronLeft /> Previous
                    </Button>
                    <input type="number" min={1} defaultValue={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                    <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                      Next <ChevronRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>
      <Footer />

      {/* 🌟 MODAL FORM COMMITTEE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A2D6E] border-2 border-[#F6911E] rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
            <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="absolute top-6 right-6 text-[#F1E1B4] hover:text-[#F6911E]">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-[#F6911E] text-2xl font-bold mb-6">
              {formData.id ? "Edit Committee" : "New Committee"}
            </h3>
            
            <form onSubmit={handleSubmitCommittee} className="space-y-4">
              <div>
                <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E]" placeholder="Nama panitia" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E]">
                    <option value="Committee">Committee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Division</label>
                  <input required type="text" value={formData.division} onChange={(e) => setFormData({...formData, division: e.target.value})} className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E]" placeholder="Contoh: IT" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-[#F6911E]" />
                <label htmlFor="isActive" className="text-white font-semibold cursor-pointer">Account is Active</label>
              </div>

              <div className="flex gap-4 justify-end pt-6">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="border-[#F1E1B4] text-[#F1E1B4] hover:bg-[#F1E1B4] hover:text-[#0A2D6E] px-8" disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" className="bg-[#F6911E] text-[#0A2D6E] hover:bg-orange-500 font-bold px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}