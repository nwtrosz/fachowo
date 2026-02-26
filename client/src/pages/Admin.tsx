import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Loader2, 
  LayoutDashboard, 
  MessageSquare, 
  LogOut, 
  User, 
  Lock,
  Menu,
  X,
  Search,
  Briefcase,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Edit,
  ArrowLeft,
  CheckCircle,
  GripVertical,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  id: string;
  img: string;
  onDelete: (url: string) => void;
  isThumbnail?: boolean;
}

function SortableImage({ id, img, onDelete, isThumbnail }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative aspect-square group rounded-lg overflow-hidden border-2",
        isThumbnail ? "border-accent ring-2 ring-accent/20" : "border-white"
      )}
    >
      <img src={img} className="w-full h-full object-cover shadow-sm" alt="" />
      
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-1 left-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </div>

      <button 
        type="button"
        onClick={() => onDelete(img)}
        className="absolute top-1 right-1 w-6 h-6 bg-destructive text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
      >
        <X size={14} strokeWidth={3} />
      </button>

      {isThumbnail && (
        <div className="absolute bottom-0 left-0 right-0 bg-accent text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-tighter">
          Główne
        </div>
      )}
    </div>
  );
}

interface Reply {
  id: number;
  message: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch?: string;
  message: string;
  ip: string;
  country: string;
  city: string;
  created_at: string;
  archived?: boolean;
  replies?: Reply[];
}

interface Stats {
  totalLeads: number;
  uniqueVisitors: number;
}

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  created_at: string;
  archived?: boolean;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'portfolio'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);
  const [deleteClickCount, setDeleteClickCount] = useState<{ [key: number]: number }>({});
  const [selectedLeadHistory, setSelectedLeadHistory] = useState<Lead | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [portfolioView, setPortfolioView] = useState<'list' | 'add' | 'edit'>('list');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({ title: '', category: 'Komercyjne', description: '' });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const API_BASE = "";

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (editingProject) {
      setNewProject({
        title: editingProject.title,
        category: editingProject.category,
        description: editingProject.description
      });
      setSelectedFiles(null);
    } else {
      setNewProject({ title: '', category: 'Komercyjne', description: '' });
      setSelectedFiles(null);
    }
  }, [editingProject]);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [leadsRes, statsRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/leads`, { headers }),
        fetch(`${API_BASE}/api/admin/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/projects`, { headers })
      ]);
      
      if (leadsRes.status === 401) {
        handleLogout();
        return;
      }

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setLoggedInUser(data.user);
        setAuthError("");
        fetchData();
      } else {
        setAuthError(data.error || "Błąd logowania");
      }
    } catch (error) {
      setAuthError("Błąd połączenia z serwerem");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setLoggedInUser("");
    setLeads([]);
    setStats(null);
  };

  const handleArchiveProject = async (id: number) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, archived: true } : p));
      }
    } catch (error) { console.error("Failed to archive", error); }
  };

  const handleRestoreProject = async (id: number) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}/restore`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, archived: false } : p));
      }
    } catch (error) { console.error("Failed to restore", error); }
  };

  const handleDeleteImage = async (projectId: number, imageUrl: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${projectId}/images/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ imageUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(projects.map(p => p.id === projectId ? { ...p, images: data.images, image: data.images[0] || "" } : p));
        if (editingProject && editingProject.id === projectId) {
          setEditingProject({ ...editingProject, images: data.images, image: data.images[0] || "" });
        }
      }
    } catch (error) { console.error("Failed to delete image", error); }
  };

  const handlePermanentDeleteProject = async (id: number) => {
    const currentCount = deleteClickCount[id] || 0;
    if (currentCount < 2) {
      setDeleteClickCount({ ...deleteClickCount, [id]: currentCount + 1 });
      return;
    }
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}/permanent`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        setDeleteClickCount({ ...deleteClickCount, [id]: 0 });
      }
    } catch (error) { console.error("Failed to delete permanently", error); }
  };

  const handleArchiveLead = async (id: number) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/leads/${id}/archive`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, archived: !l.archived } : l));
      }
    } catch (error) { console.error("Failed to archive lead", error); }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm("TRWAŁE USUNIĘCIE?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
        if (selectedLeadHistory?.id === id) setSelectedLeadHistory(null);
      }
    } catch (error) { console.error("Failed to delete lead", error); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !editingProject || !editingProject.images) return;
    const oldIndex = editingProject.images.indexOf(active.id as string);
    const newIndex = editingProject.images.indexOf(over.id as string);
    const newImages = arrayMove(editingProject.images, oldIndex, newIndex);
    const updatedProject = { ...editingProject, images: newImages, image: newImages[0] };
    setEditingProject(updatedProject);
    setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_BASE}/api/admin/projects/${editingProject.id}/images/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ imageUrls: newImages })
      });
    } catch (error) { console.error("Failed to save order", error); }
  };

    const handleSendReply = async (id: number) => {
      if (!replyMessage.trim()) return;
      setIsSendingReply(true);
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`${API_BASE}/api/admin/leads/${id}/reply`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message: replyMessage })
        });
        if (res.ok) {
          const newReply: Reply = { id: Date.now(), message: replyMessage, created_at: new Date().toISOString() };
          setLeads(leads.map(l => l.id === id ? { ...l, replies: [...(l.replies || []), newReply] } : l));
          setReplyMessage("");
          toast.success("Odpowiedź została wysłana e-mailem!");
        } else {
          toast.error("Błąd podczas wysyłania odpowiedzi.");
        }
      } catch (error) { 
        console.error("Failed to reply", error);
        toast.error("Błąd połączenia.");
      }
      finally { setIsSendingReply(false); }
    };
  
    const handleProjectSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProject && (!selectedFiles || selectedFiles.length === 0)) {
          toast.error("Proszę wybrać co najmniej jedno zdjęcie.");
          return;
      }
      setUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('category', newProject.category);
      formData.append('description', newProject.description);
      if (selectedFiles) { for (let i = 0; i < selectedFiles.length; i++) formData.append('images', selectedFiles[i]); }
      const url = editingProject ? `${API_BASE}/api/admin/projects/${editingProject.id}` : `${API_BASE}/api/admin/projects`;
      const token = localStorage.getItem('adminToken');
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => { if (e.lengthComputable) setUploadProgress(Math.round((e.loaded * 100) / e.total)); });
      xhr.addEventListener('load', async () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          setEditingProject(null);
          setFormKey(prev => prev + 1);
          setPortfolioView('list');
          fetchData();
          toast.success(editingProject ? "Zmiany zostały zapisane!" : "Nowy projekt został dodany do portfolio!");
        } else { 
          toast.error("Wystąpił błąd podczas zapisu projektu."); 
        }
      });
      xhr.open(editingProject ? 'PUT' : 'POST', url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/20 p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center mb-4"><Lock className="text-white w-6 h-6" /></div>
            <CardTitle className="text-2xl font-bold text-primary">Panel Administratora</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="text" placeholder="Użytkownik" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <Input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full h-12 text-lg font-bold">Zaloguj się</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 bg-primary text-white transition-transform duration-300 transform md:relative md:translate-x-0 shadow-2xl",
        !sidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-display text-xl font-bold">F</div>
          <span className="font-display text-xl font-bold tracking-tighter">Fachowo.eu</span>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Pulpit', icon: LayoutDashboard },
            { id: 'messages', label: 'Wiadomości', icon: MessageSquare, count: leads.filter(l => !l.archived).length },
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); if (window.innerWidth < 768) setSidebarOpen(false); }} className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left",
              activeTab === item.id ? "bg-accent text-white font-bold shadow-md" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}>
              <item.icon size={20} />
              <span className="flex-1">{item.label}</span>
              {item.count ? <span className="bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{item.count}</span> : null}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/5 justify-start gap-3" onClick={handleLogout}>
            <LogOut size={20} /> Wyloguj się
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu size={24} /></Button>
          <div className="flex-1 flex justify-end items-center gap-4">
             <div className="text-xs text-muted-foreground hidden md:block">Zalogowany jako <span className="font-bold text-primary uppercase">{loggedInUser}</span></div>
             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold uppercase text-xs">{loggedInUser.charAt(0) || 'A'}</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Pulpit Zarządzania</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-primary"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Wszystkie Zapytania</CardHeader><CardContent><div className="text-3xl font-bold">{stats?.totalLeads || 0}</div></CardContent></Card>
                      <Card className="border-l-4 border-l-green-500"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Dzisiejsze Goście</CardHeader><CardContent><div className="text-3xl font-bold">{stats?.uniqueVisitors || 0}</div></CardContent></Card>
                      <Card className="border-l-4 border-l-accent"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Projekty</CardHeader><CardContent><div className="text-3xl font-bold">{projects.length}</div></CardContent></Card>
                    </div>
                    <Card className="shadow-md overflow-hidden rounded-2xl">
                      <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Ostatnie Wiadomości</CardTitle>
                        <Button variant="ghost" size="sm" className="text-accent font-bold" onClick={() => setActiveTab('messages')}>WSZYSTKIE</Button>
                      </CardHeader>
                      <Table>
                        <TableHeader><TableRow className="bg-slate-50"><TableHead>Data</TableHead><TableHead>Klient</TableHead><TableHead className="text-right">Akcja</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {leads.filter(l => !l.archived).slice(0, 5).map(lead => (
                            <TableRow key={lead.id} className="hover:bg-slate-50/50">
                              <TableCell className="text-xs text-gray-400 font-bold uppercase">{format(new Date(lead.created_at), "d MMM", { locale: pl })}</TableCell>
                              <TableCell><div className="font-bold text-primary">{lead.name}</div><div className="text-[10px] text-muted-foreground">{lead.email}</div></TableCell>
                              <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => { setSelectedLeadHistory(lead); setActiveTab('messages'); }}><MessageSquare size={14} /></Button></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">Zarządzanie Wiadomościami</h1>
                      <div className="flex gap-1 bg-white p-1 rounded-xl border shadow-sm">
                        <Button variant={!showArchived ? "default" : "ghost"} size="sm" onClick={() => setShowArchived(false)} className="rounded-lg h-8">Aktywne</Button>
                        <Button variant={showArchived ? "default" : "ghost"} size="sm" onClick={() => setShowArchived(true)} className="rounded-lg h-8">Archiwum</Button>
                      </div>
                    </div>

                    {selectedLeadHistory ? (
                      <Card className="border-accent shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                          <div><CardTitle>{selectedLeadHistory.name}</CardTitle><CardDescription>{selectedLeadHistory.email} | {selectedLeadHistory.phone}</CardDescription></div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedLeadHistory(null)}><X className="mr-2 h-4 w-4" /> Zamknij</Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                          <div className="space-y-4">
                            {[...leads.filter(l => l.email === selectedLeadHistory.email || l.phone === selectedLeadHistory.phone).map(h => ({ ...h, type: 'inquiry' })), ...(leads.find(l => l.id === selectedLeadHistory.id)?.replies || []).map(r => ({ ...r, type: 'reply' }))].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((item: any) => (
                              <div key={`${item.type}-${item.id}`} className={cn("p-4 rounded-2xl border-l-4", item.type === 'inquiry' ? "bg-white border border-slate-100 border-l-accent shadow-sm" : "bg-primary/5 border border-primary/10 border-l-primary border-dashed ml-8")}>
                                <div className="flex justify-between mb-2"><Badge variant={item.type === 'inquiry' ? "outline" : "default"} className="text-[9px] uppercase">{item.type === 'inquiry' ? "KLIENT" : "Ty"}</Badge><span className="text-[10px] text-muted-foreground">{format(new Date(item.created_at), "dd.MM HH:mm", { locale: pl })}</span></div>
                                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                              </div>
                            ))}
                          </div>
                          <div className="pt-6 border-t"><Textarea placeholder="Treść Twojej odpowiedzi..." className="mb-4 min-h-[120px] rounded-2xl bg-slate-50" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setReplyMessage("")}>Wyczyść</Button><Button disabled={isSendingReply || !replyMessage.trim()} onClick={() => handleSendReply(selectedLeadHistory.id)} className="rounded-xl px-8 h-12 font-bold">{isSendingReply ? <Loader2 className="animate-spin" /> : "Wyślij E-mail"}</Button></div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="rounded-2xl overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              <TableHead className="w-[80px]">Data</TableHead>
                              <TableHead>Klient</TableHead>
                              <TableHead>Kontakt</TableHead>
                              <TableHead>Filia</TableHead>
                              <TableHead className="hidden lg:table-cell">Lokalizacja</TableHead>
                              <TableHead className="text-right">Akcja</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leads.filter(l => !!l.archived === showArchived).map(lead => (
                              <TableRow key={lead.id} className="cursor-pointer hover:bg-slate-50/50" onClick={() => setSelectedLeadHistory(lead)}>
                                <TableCell className="text-[10px] font-bold text-gray-400 uppercase">
                                  {format(new Date(lead.created_at), "dd.MM", { locale: pl })}
                                </TableCell>
                                <TableCell>
                                  <div className="font-bold text-sm text-primary">{lead.name}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-xs font-medium text-slate-600">{lead.email}</div>
                                  <div className="text-[10px] text-muted-foreground">{lead.phone || 'Brak tel.'}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] font-bold uppercase",
                                    lead.branch === 'Poznań' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                  )}>
                                    {lead.branch || 'Brak'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-500">📍 {lead.city || 'Nieznane'}</span>
                                  </div>
                                  <div className="text-[8px] text-muted-foreground font-mono">{lead.ip}</div>
                                </TableCell>
                                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                  <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleArchiveLead(lead.id)} title={showArchived ? "Przywróć" : "Archiwizuj"}>
                                      <Briefcase size={14} className={cn(showArchived ? "text-primary" : "text-slate-400")} />
                                    </Button>
                                    {loggedInUser === 'admin' && (
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)} className="text-destructive hover:bg-destructive/10">
                                        <Trash2 size={14} />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">{portfolioView === 'list' ? "Realizacje" : "Edytor Projektu"}</h1>
                      {portfolioView === 'list' ? (
                        <div className="flex gap-2">
                          <div className="bg-white p-1 rounded-xl border flex shadow-sm mr-2">
                            <Button variant={!showArchivedProjects ? "default" : "ghost"} size="sm" onClick={() => setShowArchivedProjects(false)} className="h-8 text-xs">Aktywne</Button>
                            <Button variant={showArchivedProjects ? "default" : "ghost"} size="sm" onClick={() => setShowArchivedProjects(true)} className="h-8 text-xs">Archiwum</Button>
                          </div>
                          <Button onClick={() => setPortfolioView('add')} className="rounded-xl font-bold shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4" /> Dodaj</Button>
                        </div>
                      ) : <Button variant="ghost" onClick={() => { setPortfolioView('list'); setEditingProject(null); }}><ArrowLeft className="mr-2 h-4 w-4" /> Wróć</Button>}
                    </div>

                    {portfolioView === 'list' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.filter(p => !!p.archived === showArchivedProjects).map(p => (
                          <Card key={p.id} className="overflow-hidden rounded-2xl shadow-sm border-none group hover:shadow-xl transition-all">
                            <div className="relative h-40 bg-slate-100">
                              <img src={p.image} className="w-full h-full object-cover" />
                              <Badge className="absolute top-2 left-2 bg-white/95 text-primary shadow-sm">{p.category}</Badge>
                            </div>
                            <CardHeader className="p-4 pb-2"><CardTitle className="text-base truncate">{p.title}</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                              <p className="text-xs text-muted-foreground line-clamp-2 h-8 italic">"{p.description}"</p>
                              <div className="flex gap-2">
                                {!showArchivedProjects ? (
                                  <>
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={() => { setEditingProject(p); setPortfolioView('edit'); }}><Edit size={14} className="mr-2" /> Edytuj</Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleArchiveProject(p.id)} className="hover:text-amber-600"><Briefcase size={14} /></Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg text-emerald-600" onClick={() => handleRestoreProject(p.id)}><Plus size={14} className="mr-2" /> Przywróć</Button>
                                    <Button variant={ (deleteClickCount[p.id] || 0) === 0 ? "ghost" : "destructive" } size="sm" className="flex-1 rounded-lg" onClick={() => handlePermanentDeleteProject(p.id)}><Trash2 size={14} className="mr-2" /> {(deleteClickCount[p.id] || 0) === 0 ? "Usuń" : `Confirm (${deleteClickCount[p.id]}/2)`}</Button>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="max-w-2xl mx-auto rounded-3xl shadow-2xl border-none">
                        <CardHeader><CardTitle>{portfolioView === 'add' ? "Nowa realizacja" : "Edycja projektu"}</CardTitle></CardHeader>
                        <CardContent>
                          <form key={formKey} onSubmit={handleProjectSubmit} className="space-y-6">
                            <div className="space-y-4">
                              <Input placeholder="Tytuł projektu" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none shadow-inner" />
                              <select className="w-full h-12 rounded-xl bg-slate-50 border-none shadow-inner px-4 text-sm" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}>
                                <option value="Komercyjne">Komercyjne</option><option value="Mieszkaniowe">Mieszkaniowe</option><option value="Podłogi">Podłogi</option><option value="Inne">Inne</option>
                              </select>
                              <Textarea placeholder="Opis realizacji..." required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="min-h-[120px] rounded-2xl bg-slate-50 border-none shadow-inner p-4" />
                              
                              <div className="space-y-3">
                                {portfolioView === 'edit' && editingProject?.images && (
                                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={editingProject.images} strategy={horizontalListSortingStrategy}>
                                      <div className="grid grid-cols-4 gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        {editingProject.images.map((img, idx) => (
                                          <SortableImage key={img} id={img} img={img} onDelete={() => handleDeleteImage(editingProject.id, img)} isThumbnail={idx === 0} />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                )}
                                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-all">
                                  <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setSelectedFiles(e.target.files)} required={portfolioView === 'add'} />
                                  <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                  <p className="text-sm font-bold text-slate-500">{selectedFiles ? `Wybrano plików: ${selectedFiles.length}` : "Dodaj nowe zdjęcia"}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={uploading}>{uploading ? <Loader2 className="animate-spin" /> : "ZAPISZ PROJEKT"}</Button>
                              {uploading && <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><motion.div className="bg-accent h-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div>}
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
