"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  Footer,
} from "@/components/ui";
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";
import {
  Plus,
  RotateCw,
  Funnel,
  Pencil,
  SquareSlash,
  Trash2,
  X
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
// Import Enum Audience dari konstanta milikmu
import { ANNOUNCEMENT_AUDIENCE } from "@/lib/constants/announcement-audience";

export default function AnnouncementPage() {
  const [groupedAnnouncements, setGroupedAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Data
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    targetAudience: "ALL", // Default value
    attachmentUrl: "",
  });

  // Ambil Data Announcement
  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth("/api/admin/announcements", { cache: "no-store" });
      if (res.ok) {
        const result = await res.json();
        // Backend mengembalikan { success: true, data: [...] }
        if (result.success && result.data) {
          setGroupedAnnouncements(result.data);
        } else {
          setGroupedAnnouncements([]);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data pengumuman:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Buka Modal untuk Membuat Baru
  const handleOpenNew = () => {
    setFormData({ id: "", title: "", content: "", targetAudience: Object.values(ANNOUNCEMENT_AUDIENCE)[0] as string, attachmentUrl: "" });
    setIsModalOpen(true);
  };

  // Buka Modal untuk Edit
  const handleOpenEdit = (item: any) => {
    setFormData({
      id: item.id,
      title: item.title,
      content: item.content,
      targetAudience: item.targetAudience,
      attachmentUrl: item.attachmentUrl || "",
    });
    setIsModalOpen(true);
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditMode = !!formData.id;
    const announcementId = isEditMode ? formData.id : crypto.randomUUID();

    // 🌟 BERSIHKAN DATA (SANITIZATION) SEBELUM DIKIRIM
    const payload: any = {
      id: announcementId,
      title: formData.title,
      content: formData.content,
      // Pastikan target audience yang terkirim selalu valid dari dropdown
      targetAudience: formData.targetAudience,
    };

    // 🌟 KUNCI FIX: Jika URL tidak kosong, baru masukkan ke payload
    // Jika kosong, abaikan saja agar Zod di backend tidak marah
    if (formData.attachmentUrl && formData.attachmentUrl.trim() !== "") {
      payload.attachmentUrl = formData.attachmentUrl;
    }

    try {
      const res = await fetchWithAuth("/api/admin/announcements", {
        method: "PUT", 
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEditMode ? "Pengumuman berhasil diubah!" : "Pengumuman baru berhasil dibuat!");
        setIsModalOpen(false);
        loadAnnouncements(); // Refresh data
      } else {
        const errData = await res.json();
        // Menangkap error spesifik dari Zod agar tampil di alert browser
        const errorMsg = 
          errData.details?.fieldErrors?.attachmentUrl?.[0] || 
          errData.details?.fieldErrors?.targetAudience?.[0] || 
          errData.error || 
          "Terjadi kesalahan validasi";
          
        alert(`Gagal menyimpan: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan sistem saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hapus Announcement
  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus pengumuman ini?")) return;

    try {
      const res = await fetchWithAuth(`/api/admin/announcements?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Pengumuman dihapus!");
        loadAnnouncements();
      } else {
        alert("Gagal menghapus pengumuman.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="relative flex-1 bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar
          logo={LOGO}
          links={ADMIN_NAV_LINKS}
          activeLink="/admin/announcement"
          action={ADMIN_NAV_ACTION}
          mobileAction={ADMIN_NAV_ACTION}
        />

        {/* Hero Section */}
        <section className="relative flex pt-32 mx-auto w-[80%] items-center z-10">
          <div className="text-left">
            <h3 className="text-[48px] font-extrabold text-[#F6911E]">
              Announcement
            </h3>
            <p className="text-2xl font-semibold text-[#F1E1B4]">
              Make & Control Announcement here!
            </p>
          </div>
        </section>

        <main className="relative z-10 flex flex-col mx-auto pt-8 pb-20 w-[80%]">
          
          {/* Header Action */}
          <section className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#1E3A8A]/90 backdrop-blur-md rounded-[20px] p-8 md:p-12 border border-[#F6911E]/30 shadow-lg">
              <h4 className="font-semibold text-[32px] md:text-[36px] text-[#F1E1B4] mb-6 md:mb-0">
                Make Announcement
              </h4>
              <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                <Button onClick={handleOpenNew} className="min-w-[140px] bg-[#F6911E] text-[#0A2D6E] hover:bg-orange-500 font-bold flex gap-2">
                  <Plus size={20} strokeWidth={3} /> New
                </Button>
                <Button onClick={loadAnnouncements} variant="outline" className="min-w-[140px] border-[#F1E1B4] text-[#F1E1B4] hover:bg-[#F1E1B4] hover:text-[#0A2D6E] flex gap-2">
                  <RotateCw size={18} className={isLoading ? "animate-spin" : ""} /> Refresh
                </Button>
                <Button variant="outline" className="min-w-[140px] border-[#F1E1B4] text-[#F1E1B4] hover:bg-[#F1E1B4] hover:text-[#0A2D6E] flex gap-2">
                  <Funnel size={18} /> Filter
                </Button>
              </div>
            </div>
          </section>

          {/* List Section Grouped by Category */}
          <section className="w-full mt-8 space-y-10">
            {isLoading ? (
              <div className="text-center py-10 text-[#F6911E] animate-pulse font-bold text-xl">
                Loading Announcements...
              </div>
            ) : groupedAnnouncements.length === 0 ? (
              <div className="text-center py-10 text-[#F1E1B4]/70 bg-[#1E3A8A]/50 rounded-[20px] border border-white/10">
                Belum ada pengumuman. Klik "New" untuk membuat satu.
              </div>
            ) : (
              groupedAnnouncements.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-[#0A2D6E]/50 rounded-[24px] p-6 md:p-8 border border-[#F6911E]/20">
                  {/* Judul Kategori */}
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-[#F6911E] uppercase tracking-wider">
                      {group.category}
                    </h3>
                    <span className="bg-[#F1E1B4] text-[#0A2D6E] text-xs font-black px-3 py-1 rounded-full">
                      {group.count}
                    </span>
                  </div>

                  {/* List Pengumuman di dalam Kategori */}
                  <div className="space-y-4">
                    {group.announcements.map((item: any) => (
                      <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1E3A8A]/90 backdrop-blur-md rounded-[20px] p-6 border border-white/10 hover:border-[#F6911E]/50 transition-colors">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="hidden md:flex bg-[#0A2D6E] p-4 rounded-xl border border-[#F6911E]/30">
                            <SquareSlash size={32} className="text-[#F6911E]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="text-[20px] font-bold text-[#F1E1B4]">{item.title}</span>
                              <span className="text-white/40 text-xs">
                                {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-white/80 line-clamp-2 text-sm leading-relaxed">
                              {item.content}
                            </p>
                            {/* Jika ada lampiran */}
                            {item.attachmentUrl && (
                              <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[#F6911E] text-xs font-semibold hover:underline">
                                📎 Lihat Lampiran
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6 md:mt-0 md:ml-8 w-full md:w-auto justify-end">
                          <Button onClick={() => handleOpenEdit(item)} variant="outline" size="sm" className="border-[#F6911E] text-[#F6911E] hover:bg-[#F6911E] hover:text-white flex gap-2">
                            <Pencil size={16} /> Edit
                          </Button>
                          <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white flex gap-2">
                            <Trash2 size={16} /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

        </main>
      </div>
      <Footer />

      {/* 🌟 MODAL FORM (NEW / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A2D6E] border-2 border-[#F6911E] rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative">
            <button 
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#F1E1B4] hover:text-[#F6911E] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-[#F6911E] text-2xl font-bold mb-6">
              {formData.id ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                  placeholder="Judul pengumuman..."
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Target Audience</label>
                <select 
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E] transition-colors appearance-none"
                >
                  {Object.entries(ANNOUNCEMENT_AUDIENCE).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Content</label>
                <textarea 
                  required rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E] transition-colors resize-none"
                  placeholder="Isi pengumuman..."
                />
              </div>

              {/* Attachment URL (Optional) */}
              <div>
                <label className="block text-[#F1E1B4] text-sm font-semibold mb-2">Attachment URL (Optional)</label>
                <input 
                  type="url"
                  value={formData.attachmentUrl}
                  onChange={(e) => setFormData({...formData, attachmentUrl: e.target.value})}
                  className="w-full bg-[#1E3A8A] border border-[#F6911E]/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                  placeholder="https://link-dokumen.com"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end pt-4">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="border-[#F1E1B4] text-[#F1E1B4] hover:bg-[#F1E1B4] hover:text-[#0A2D6E] px-8" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#F6911E] text-[#0A2D6E] hover:bg-orange-500 font-bold px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Save Announcement"}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}