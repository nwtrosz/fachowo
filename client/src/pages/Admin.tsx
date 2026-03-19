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
  Maximize2,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useContent } from "@/contexts/ContentContext";
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
        isThumbnail ? "border-accent ring-2 ring-accent/20" : "border-border"
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

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

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
  read?: boolean;
  replies?: Reply[];
}

interface Stats {
  totalLeads: number;
  uniqueVisitors: number;
  history?: { date: string, leads: number, visitors: number }[];
  recentVisitors?: { ip: string, city: string, country: string, last_visit: string }[];
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

// Helper to clean HTML for the editor
const cleanHtmlForEditor = (html: string) => {
  if (!html) return "";
  // Convert our custom line break to a standard newline for editing
  return html.replace(/<br\s*className="hidden sm:block"\s*\/>/gi, "\n");
};

// Helper to wrap newlines back into our specific HTML format
const wrapHtmlForStorage = (text: string) => {
  if (!text) return "";
  // Convert newlines to our special hidden-sm-block break
  return text.replace(/\n/g, '<br className="hidden sm:block" />');
};

interface VisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

function VisualEditor({ value, onChange, label }: VisualEditorProps) {
  const [localText, setLocalText] = useState(cleanHtmlForEditor(value));

  // Sync internal state when value from parent changes (e.g. after initial load)
  useEffect(() => {
    setLocalText(cleanHtmlForEditor(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalText(val);
    onChange(wrapHtmlForStorage(val));
  };

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded font-bold uppercase">Auto-Format aktywowany</span>
        </div>
      </div>
      <div className="relative">
        <Textarea 
          value={localText} 
          onChange={handleChange}
          className="min-h-[100px] rounded-2xl bg-muted/20 border-border border-2 focus-visible:ring-accent text-lg font-display font-bold leading-snug p-6 text-foreground resize-none transition-all focus:bg-background" 
          placeholder="Wpisz tekst nagłówka... Użyj Enter, aby wymusić łamanie linii na komputerze."
        />
        <div className="absolute bottom-3 right-4 text-[9px] text-muted-foreground font-medium bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md border border-border">
          Naciśnij <kbd className="font-sans border px-1 rounded bg-muted">Enter</kbd> dla nowej linii
        </div>
      </div>
      <div className="mt-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-tighter mb-2">Podgląd struktury:</p>
        <div className="text-xs font-mono text-muted-foreground break-all opacity-60">
          {wrapHtmlForStorage(localText)}
        </div>
      </div>
    </div>
  );
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
  const { theme, toggleTheme, switchable } = useTheme();
  
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

  // CMS state
  const { data: globalContent, updateContent: updateGlobalContent, loading: contentLoading } = useContent();
  const [cmsData, setCmsData] = useState<any>(null);
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    // Sync local CMS state when global content loads or tab becomes active
    if (activeTab === 'content' && globalContent && !cmsData) {
      setCmsData(JSON.parse(JSON.stringify(globalContent)));
    }
  }, [activeTab, globalContent, cmsData]);

  const handleSaveContent = async () => {
    if (!cmsData) return;
    setIsSavingContent(true);
    try {
      await updateGlobalContent(cmsData);
      toast.success("Treść została pomyślnie zapisana!");
    } catch (e) {
      toast.error("Błąd podczas zapisywania treści");
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleCmsChange = (section: string, field: string, value: string, nestedField?: string) => {
    setCmsData((prev: any) => {
      const next = { ...prev };
      if (!next[section]) next[section] = {};
      
      if (nestedField) {
        if (!next[section][field]) next[section][field] = {};
        next[section][field][nestedField] = value;
      } else {
        next[section][field] = value;
      }
      return next;
    });
  };

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
      fetchData(true); // Initial fetch, no sound
      const interval = setInterval(() => fetchData(false), 10000); // Check every 10s
      return () => clearInterval(interval);
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

  const playNotificationSound = () => {
    // Standard system notification sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {
      console.log("Audio blocked by browser. Interaction required.");
    });
  };

  const fetchData = async (isInitial = false) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

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

      if (leadsRes.ok) {
        const newLeads: Lead[] = await leadsRes.json();
        
        setLeads(prevLeads => {
          // If this is the very first fetch after login/mount, just set the baseline
          if (isInitial || prevLeads.length === 0) {
            return newLeads;
          }

          // Check if any NEW non-archived leads arrived
          const prevActiveCount = prevLeads.filter(l => !l.archived).length;
          const newActiveCount = newLeads.filter(l => !l.archived).length;

          if (newActiveCount > prevActiveCount) {
            playNotificationSound();
            toast.success("Nowa wiadomość od klienta!", { icon: "🔔", duration: 5000 });
          }
          
          return newLeads;
        });
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  // Group leads into threads (Conversations)
  const getThreadedLeads = () => {
    const groups: { [key: string]: Lead & { lastActivity: string } } = {};
    
    leads.forEach(lead => {
      const key = (lead.email || lead.phone || lead.id).toString().toLowerCase();
      
      // Find the absolute latest message in this thread (either lead or one of its replies)
      let latestTime = lead.created_at;
      if (lead.replies && lead.replies.length > 0) {
        const newestReply = [...lead.replies].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        if (new Date(newestReply.created_at) > new Date(latestTime)) {
          latestTime = newestReply.created_at;
        }
      }

      if (!groups[key] || new Date(latestTime) > new Date(groups[key].lastActivity)) {
        groups[key] = { ...lead, lastActivity: latestTime };
      }
    });

    return Object.values(groups).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
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
        fetchData(true);
        // Start interval after login
        const interval = setInterval(() => fetchData(false), 10000);
        // Clean up on unmount would be ideal but simpler here for now
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

  const handleMarkAsRead = async (lead: Lead) => {
    if (lead.read) return; // Already read
    
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_BASE}/api/admin/leads/${lead.id}/read`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Update locally: mark all leads with same email/phone as read
      setLeads(prev => prev.map(l => {
        if ((l.email === lead.email && l.email) || (l.phone === lead.phone && l.phone) || l.id === lead.id) {
          return { ...l, read: true };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm("TRWAŁE USUNIĘCIE CAŁEJ ROZMOWY?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const leadToDelete = leads.find(l => l.id === id);
      const res = await fetch(`${API_BASE}/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        if (leadToDelete) {
          setLeads(leads.filter(l => 
            (l.email !== leadToDelete.email || !l.email) && 
            (l.phone !== leadToDelete.phone || !l.phone) &&
            l.id !== id
          ));
        }
        if (selectedLeadHistory?.id === id) setSelectedLeadHistory(null);
        toast.success("Konwersacja usunięta.");
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
      }
    } catch (error) { console.error("Failed to reply", error); }
    finally { setIsSendingReply(false); }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject && (!selectedFiles || selectedFiles.length === 0)) {
        toast.error("Wybierz zdjęcia!");
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
        toast.success("Zapisano!");
      } else { alert("Błąd zapisu"); }
    });
    xhr.open(editingProject ? 'PUT' : 'POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary bg-card">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg mx-auto flex items-center justify-center mb-4"><Lock className="w-6 h-6" /></div>
            <CardTitle className="text-2xl font-bold text-foreground">Panel Administratora</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="text" placeholder="Użytkownik" value={username} onChange={(e) => setUsername(e.target.value)} required className="bg-muted/30 border-border" />
              <Input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-muted/30 border-border" />
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full h-12 text-lg font-bold">Zaloguj się</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 bg-card text-card-foreground transition-transform duration-300 transform md:relative md:translate-x-0 border-r border-border shadow-2xl",
        !sidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-display text-xl font-bold">F</div>
          <span className="font-display text-xl font-bold tracking-tighter text-foreground">Fachowo.net.pl</span>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Pulpit', icon: LayoutDashboard },
            { id: 'messages', label: 'Wiadomości', icon: MessageSquare, count: leads.filter(l => !l.read && !l.archived).length },
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
            { id: 'content', label: 'Treść (CMS)', icon: Edit },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); if (window.innerWidth < 768) setSidebarOpen(false); }} className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left group",
              activeTab === item.id ? "bg-primary text-primary-foreground font-bold shadow-lg" : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            )}>
              <item.icon size={20} className={cn(activeTab === item.id ? "text-primary-foreground" : "text-primary group-hover:text-foreground")} />
              <span className="flex-1">{item.label}</span>
              {item.count ? <span className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.count}</span> : null}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start gap-3" onClick={handleLogout}>
            <LogOut size={20} /> Wyloguj się
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu size={24} /></Button>
          <div className="flex-1 flex justify-end items-center gap-4">
             {switchable && (
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={toggleTheme}
                 className="rounded-full text-foreground hover:bg-primary/10 transition-colors"
                 title="Przełącz motyw"
               >
                 {theme === 'dark' ? <Sun size={20} className="text-primary" /> : <Moon size={20} />}
               </Button>
             )}
             <div className="text-xs text-muted-foreground hidden md:block">Zalogowany jako <span className="font-bold text-primary uppercase">{loggedInUser}</span></div>
             <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold uppercase text-xs">{loggedInUser.charAt(0) || 'A'}</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 md:p-8 bg-background">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">Pulpit Zarządzania</h1>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl bg-card shadow-sm border-border text-foreground hover:text-primary transition-colors"
                          onClick={() => {
                            fetchData();
                            toast.info("Odświeżanie danych...");
                          }}
                        >
                          <RefreshCw size={18} className={cn(loading && "animate-spin")} />
                        </Button>
                      </div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-card px-4 py-2 rounded-xl border border-border shadow-sm w-fit">
                        {format(new Date(), "EEEE, d MMMM yyyy", { locale: pl })}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border-none shadow-md bg-card"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Wszystkie Zapytania</CardHeader><CardContent><div className="text-3xl font-bold text-foreground">{stats?.totalLeads || 0}</div></CardContent></Card>
                      <Card className="border-none shadow-md bg-card"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Dzisiejsze Goście</CardHeader><CardContent><div className="text-3xl font-bold text-foreground">{stats?.uniqueVisitors || 0}</div></CardContent></Card>
                      <Card className="border-none shadow-md bg-card"><CardHeader className="pb-2 text-xs font-bold text-muted-foreground uppercase">Projekty</CardHeader><CardContent><div className="text-3xl font-bold text-foreground">{projects.length}</div></CardContent></Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <Card className="shadow-md rounded-2xl bg-card border-none h-full">
                          <CardHeader className="pb-2 border-b border-border/50">
                            <CardTitle className="text-lg font-bold text-foreground">Aktywność (Ostatnie 7 dni)</CardTitle>
                            <CardDescription className="text-xs">Porównanie odwiedzin i zapytań</CardDescription>
                          </CardHeader>
                          <CardContent className="h-[250px] pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stats?.history || []}>
                                <defs>
                                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme === 'dark' ? '#3B82F6' : '#0F1F38'} stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor={theme === 'dark' ? '#3B82F6' : '#0F1F38'} stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1E293B' : '#f1f5f9'} />
                                <XAxis 
                                  dataKey="date" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                                  stroke="#94a3b8"
                                />
                                <YAxis hide />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#0F1F38' : '#FFFFFF', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    color: theme === 'dark' ? '#FAFAF8' : '#0F1F38'
                                  }}
                                  itemStyle={{ color: theme === 'dark' ? '#FAFAF8' : '#0F1F38' }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="visitors" 
                                  name="Odwiedziny"
                                  stroke={theme === 'dark' ? '#3B82F6' : '#0F1F38'} 
                                  strokeWidth={3}
                                  fillOpacity={1} 
                                  fill="url(#colorVisitors)" 
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="leads" 
                                  name="Zapytania"
                                  stroke="#f59e0b" 
                                  strokeWidth={3}
                                  fillOpacity={1} 
                                  fill="url(#colorLeads)" 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="shadow-md rounded-2xl bg-primary text-primary-foreground border-none">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-50">Skuteczność</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-4xl font-bold text-primary-foreground italic">
                              {stats && stats.totalLeads > 0 ? ((stats.totalLeads / 500) * 100).toFixed(1) : 0}%
                            </div>
                            <p className="text-[10px] mt-2 opacity-70">Wskaźnik konwersji względem celu</p>
                            <div className="w-full bg-primary-foreground/20 h-1.5 rounded-full mt-4 overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min(100, (stats?.totalLeads || 0) / 5)}%` }}
                                 className="bg-primary-foreground h-full"
                               />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="shadow-md rounded-2xl bg-card border-none">
                          <CardHeader className="pb-2 border-b border-border/50">
                            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest">Najczęstsza Filia</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2 text-xs">
                               <span className="font-medium text-foreground">Poznań</span>
                               <span className="font-bold text-foreground">{leads.filter(l => l.branch === 'Poznań').length}</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-4">
                               <div 
                                 className="bg-primary h-full" 
                                 style={{ width: `${(leads.filter(l => l.branch === 'Poznań').length / Math.max(1, leads.length)) * 100}%` }}
                               />
                            </div>
                            <div className="flex items-center justify-between mb-2 text-xs text-foreground">
                               <span className="font-medium">Warszawa</span>
                               <span className="font-bold">{leads.filter(l => l.branch === 'Warszawa').length}</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                               <div 
                                 className="bg-accent h-full" 
                                 style={{ width: `${(leads.filter(l => l.branch === 'Warszawa').length / Math.max(1, leads.length)) * 100}%` }}
                               />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Recent Messages Preview */}
                      <Card className="shadow-md overflow-hidden rounded-2xl bg-card border-none">
                        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-bold text-foreground">Ostatnie Wiadomości</CardTitle>
                          <Button variant="ghost" size="sm" className="text-accent font-bold text-xs" onClick={() => setActiveTab('messages')}>WSZYSTKIE</Button>
                        </CardHeader>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader><TableRow className="bg-muted/30 border-border"><TableHead className="text-[10px] uppercase font-bold tracking-wider">Data</TableHead><TableHead className="text-[10px] uppercase font-bold tracking-wider">Klient</TableHead><TableHead className="text-right text-[10px] uppercase font-bold tracking-wider">Akcja</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {getThreadedLeads().filter(l => !l.archived).slice(0, 5).map(lead => (
                                <TableRow key={lead.id} className="hover:bg-muted/20 group border-border">
                                  <TableCell className="text-[10px] text-muted-foreground font-bold uppercase">
                                    {format(new Date(lead.lastActivity), "HH:mm", { locale: pl })}
                                    <div className="text-[8px]">{format(new Date(lead.lastActivity), "dd.MM", { locale: pl })}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-bold text-foreground text-sm">{lead.name}</div>
                                    <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{lead.email}</div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg border-border" onClick={() => { 
                                      handleMarkAsRead(lead);
                                      setSelectedLeadHistory(lead); 
                                      setActiveTab('messages'); 
                                    }}>
                                      <MessageSquare size={14} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>

                      {/* Recent Visitors Preview */}
                      <Card className="shadow-md overflow-hidden rounded-2xl bg-card border-none">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="text-lg font-bold text-foreground">Ostatnie Odwiedziny</CardTitle>
                          <CardDescription className="text-xs">Podgląd unikalnych gości w czasie rzeczywistym</CardDescription>
                        </CardHeader>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader><TableRow className="bg-muted/30 border-border"><TableHead className="text-[10px] uppercase font-bold tracking-wider">Lokalizacja</TableHead><TableHead className="text-[10px] uppercase font-bold tracking-wider">Adres IP</TableHead><TableHead className="text-right text-[10px] uppercase font-bold tracking-wider">Ostatnio</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {(stats?.recentVisitors || []).slice(0, 5).map((visitor, idx) => (
                                <TableRow key={idx} className="hover:bg-muted/20 transition-colors border-border">
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">📍</span>
                                      <div>
                                        <div className="font-bold text-foreground text-sm">{visitor.city}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-medium">{visitor.country}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <code className="text-[10px] bg-muted px-2 py-1 rounded text-muted-foreground font-mono">{visitor.ip}</code>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                                      {format(new Date(visitor.last_visit), "HH:mm", { locale: pl })}
                                    </div>
                                    <div className="text-[8px] text-muted-foreground/60">{format(new Date(visitor.last_visit), "dd.MM", { locale: pl })}</div>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {(stats?.recentVisitors?.length || 0) === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic text-sm">Brak danych o gościach</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Wiadomości</h1>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg bg-card shadow-sm border-border text-foreground hover:text-accent transition-colors"
                          onClick={() => {
                            fetchData();
                            toast.info("Odświeżanie wiadomości...");
                          }}
                        >
                          <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                        </Button>
                      </div>
                      <div className="flex gap-1 bg-card p-1 rounded-xl border border-border shadow-sm">
                        <Button variant={!showArchived ? "default" : "ghost"} size="sm" onClick={() => setShowArchived(false)} className="rounded-lg h-8">Aktywne</Button>
                        <Button variant={showArchived ? "default" : "ghost"} size="sm" onClick={() => setShowArchived(true)} className="rounded-lg h-8">Archiwum</Button>
                      </div>
                    </div>

                    {selectedLeadHistory ? (
                      <Card className="border-accent shadow-2xl rounded-3xl overflow-hidden bg-card border-none">
                        <CardHeader className="bg-muted/30 border-b border-border flex flex-row items-center justify-between p-6">
                          <div><CardTitle className="text-2xl font-bold text-foreground">{selectedLeadHistory.name}</CardTitle><CardDescription className="font-medium">{selectedLeadHistory.email} | {selectedLeadHistory.phone}</CardDescription></div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedLeadHistory(null)} className="rounded-xl"><X className="mr-2 h-4 w-4" /> Zamknij</Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {[...leads.filter(l => (l.email && l.email === selectedLeadHistory.email) || (l.phone && l.phone === selectedLeadHistory.phone)).map(h => ({ ...h, type: 'inquiry' })), ...(leads.find(l => l.id === selectedLeadHistory.id)?.replies || []).map(r => ({ ...r, type: 'reply' }))].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((item: any) => (
                              <div key={`${item.type}-${item.id}`} className={cn("p-5 rounded-2xl border-l-4 shadow-sm", item.type === 'inquiry' ? "bg-card border border-border border-l-accent" : "bg-primary/5 border border-primary/10 border-l-primary border-dashed ml-8")}>
                                <div className="flex justify-between mb-2">
                                  <Badge variant={item.type === 'inquiry' ? "outline" : "default"} className="text-[9px] uppercase tracking-widest">{item.type === 'inquiry' ? "KLIENT" : "Ty"}</Badge>
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(item.created_at), "dd.MM HH:mm", { locale: pl })}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80">{item.message}</p>
                              </div>
                            ))}
                          </div>
                          <div className="pt-6 border-t border-border">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Szybka odpowiedź</h4>
                            <Textarea placeholder="Napisz wiadomość do klienta..." className="mb-4 min-h-[150px] rounded-2xl bg-muted/30 border-none shadow-inner focus-visible:ring-accent p-4" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" onClick={() => setReplyMessage("")}>Wyczyść</Button>
                              <Button disabled={isSendingReply || !replyMessage.trim()} onClick={() => handleSendReply(selectedLeadHistory.id)} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
                                {isSendingReply ? <Loader2 className="animate-spin mr-2" /> : <MessageSquare size={18} className="mr-2" />}
                                Wyślij Odpowiedź
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="rounded-2xl overflow-hidden shadow-sm bg-card border-none">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader><TableRow className="bg-muted/30 border-border"><TableHead className="w-[100px]">Ostatnia Akcja</TableHead><TableHead>Klient</TableHead><TableHead>Filia</TableHead><TableHead className="text-right">Akcja</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {getThreadedLeads().filter(l => !!l.archived === showArchived).map(lead => (
                                <TableRow 
                                  key={lead.id} 
                                  className={cn(
                                    "cursor-pointer hover:bg-muted/20 group border-border",
                                    !lead.read && !showArchived && "bg-accent/5 font-bold"
                                  )} 
                                  onClick={() => {
                                    handleMarkAsRead(lead);
                                    setSelectedLeadHistory(lead);
                                  }}
                                >
                                  <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">
                                    {format(new Date(lead.lastActivity), "HH:mm", { locale: pl })}
                                    <div className="text-[8px]">{format(new Date(lead.lastActivity), "dd.MM", { locale: pl })}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-bold text-sm text-foreground">{lead.name}</div>
                                    <div className="text-[10px] text-muted-foreground">{lead.email}</div>
                                    {lead.city && <div className="text-[9px] text-accent font-bold uppercase mt-1">📍 {lead.city}</div>}
                                  </TableCell>
                                  <TableCell><Badge variant="outline" className="text-[9px] font-bold uppercase border-border">{lead.branch || 'Brak'}</Badge></TableCell>
                                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" onClick={() => handleArchiveLead(lead.id)} title={showArchived ? "Przywróć" : "Archiwizuj"} className="hover:bg-muted"><Briefcase size={14} className={cn(showArchived ? "text-primary" : "text-muted-foreground")} /></Button>
                                      {loggedInUser === 'admin' && <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)} className="text-destructive hover:bg-destructive/10"><Trash2 size={14} /></Button>}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-foreground">{portfolioView === 'list' ? "Realizacje" : "Edytor Projektu"}</h1>
                      {portfolioView === 'list' ? (
                        <div className="flex gap-2">
                          <div className="bg-card p-1 rounded-xl border border-border flex shadow-sm mr-2">
                            <Button variant={!showArchivedProjects ? "default" : "ghost"} size="sm" onClick={() => setShowArchivedProjects(false)} className="h-8 text-xs">Aktywne</Button>
                            <Button variant={showArchivedProjects ? "default" : "ghost"} size="sm" onClick={() => setShowArchivedProjects(true)} className="h-8 text-xs">Archiwum</Button>
                          </div>
                          <Button onClick={() => setPortfolioView('add')} className="rounded-xl font-bold shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4" /> Dodaj</Button>
                        </div>
                      ) : <Button variant="ghost" onClick={() => { setPortfolioView('list'); setEditingProject(null); }} className="text-foreground"><ArrowLeft className="mr-2 h-4 w-4" /> Wróć</Button>}
                    </div>

                    {portfolioView === 'list' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.filter(p => !!p.archived === showArchivedProjects).map(p => (
                          <Card key={p.id} className="overflow-hidden rounded-2xl shadow-sm border-none group hover:shadow-xl transition-all bg-card">
                            <div className="relative h-40 bg-muted">
                              <img src={p.image} className="w-full h-full object-cover" />
                              <Badge className="absolute top-2 left-2 bg-card/95 text-foreground shadow-sm uppercase text-[9px] font-bold tracking-widest border-none">{p.category}</Badge>
                            </div>
                            <CardHeader className="p-4 pb-2"><CardTitle className="text-base truncate font-bold text-foreground">{p.title}</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                              <p className="text-xs text-muted-foreground line-clamp-2 h-8 italic font-light leading-relaxed">"{p.description}"</p>
                              <div className="flex gap-2">
                                {!showArchivedProjects ? (
                                  <>
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg border-border text-foreground hover:bg-muted" onClick={() => { setEditingProject(p); setPortfolioView('edit'); }}><Edit size={14} className="mr-2" /> Edytuj</Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleArchiveProject(p.id)} className="hover:text-amber-600 hover:bg-muted"><Briefcase size={14} /></Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => handleRestoreProject(p.id)}><Plus size={14} className="mr-2" /> Przywróć</Button>
                                    <Button variant={ (deleteClickCount[p.id] || 0) === 0 ? "ghost" : "destructive" } size="sm" className="flex-1 rounded-lg" onClick={() => handlePermanentDeleteProject(p.id)}><Trash2 size={14} className="mr-2" /> {(deleteClickCount[p.id] || 0) === 0 ? "Usuń" : `Potwierdź (${deleteClickCount[p.id]}/2)`}</Button>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="max-w-2xl mx-auto rounded-3xl shadow-2xl border-none bg-card">
                        <CardHeader className="p-8 pb-0"><CardTitle className="text-2xl font-bold text-foreground">{portfolioView === 'add' ? "Nowa realizacja" : "Edycja projektu"}</CardTitle></CardHeader>
                        <CardContent className="p-8">
                          <form key={formKey} onSubmit={handleProjectSubmit} className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Tytuł projektu</label><Input placeholder="np. Remont apartamentu" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none shadow-inner text-foreground" /></div>
                              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Kategoria</label><select className="w-full h-12 rounded-xl bg-muted/30 border-none shadow-inner px-4 text-sm font-medium text-foreground appearance-none" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}><option value="Komercyjne">Komercyjne</option><option value="Mieszkaniowe">Mieszkaniowe</option><option value="Podłogi">Podłogi</option><option value="Inne">Inne</option></select></div>
                              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Opis prac</label><Textarea placeholder="Opisz szczegóły realizacji..." required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="min-h-[120px] rounded-2xl bg-muted/30 border-none shadow-inner p-4 text-base text-foreground" /></div>
                              <div className="space-y-3">
                                {portfolioView === 'edit' && editingProject?.images && (
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Kolejność zdjęć (przeciągnij)</label>
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                      <SortableContext items={editingProject.images} strategy={horizontalListSortingStrategy}>
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-3 bg-muted/20 rounded-2xl border border-border shadow-sm">
                                          {editingProject.images.map((img, idx) => (
                                            <SortableImage key={img} id={img} img={img} onDelete={() => handleDeleteImage(editingProject.id, img)} isThumbnail={idx === 0} />
                                          ))}
                                        </div>
                                      </SortableContext>
                                    </DndContext>
                                  </div>
                                )}
                                <div className="relative group border-2 border-dashed border-border rounded-3xl p-10 text-center hover:bg-muted/20 hover:border-accent transition-all cursor-pointer">
                                  <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSelectedFiles(e.target.files)} required={portfolioView === 'add'} />
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors"><Upload size={24} /></div>
                                    <p className="text-sm font-bold text-foreground">{selectedFiles ? `Wybrano plików: ${selectedFiles.length}` : "Dodaj zdjęcia do galerii"}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Maks. 50 zdjęć na raz</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4 pt-4">
                              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={uploading}>{uploading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> <span>WYŚLIJ: {uploadProgress}%</span></div> : "ZAPISZ I PUBLIKUJ"}</Button>
                              {uploading && <div className="w-full bg-muted h-2 rounded-full overflow-hidden"><motion.div className="bg-accent h-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div>}
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'content' && cmsData && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h1 className="text-2xl font-bold text-foreground">Zarządzanie Treścią</h1>
                      <Button 
                        onClick={handleSaveContent} 
                        disabled={isSavingContent}
                        className="bg-accent text-accent-foreground font-bold shadow-lg"
                      >
                        {isSavingContent ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle className="mr-2" size={16} />}
                        Zapisz Zmiany
                      </Button>
                    </div>
                    
                    <Card className="max-w-3xl rounded-3xl shadow-2xl border-none bg-card">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold text-foreground">Sekcja: Hero (Strona Główna)</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Etykieta (Mały napis)</label>
                            <Input 
                              value={cmsData.hero?.badge || ""} 
                              onChange={e => handleCmsChange('hero', 'badge', e.target.value)}
                              className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Główny Nagłówek (H1)</label>
                            <Textarea 
                              value={cmsData.hero?.title || ""} 
                              onChange={e => handleCmsChange('hero', 'title', e.target.value)}
                              className="min-h-[80px] rounded-xl bg-muted/30 border-none text-foreground resize-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Podtytuł</label>
                            <Textarea 
                              value={cmsData.hero?.subtitle || ""} 
                              onChange={e => handleCmsChange('hero', 'subtitle', e.target.value)}
                              className="min-h-[80px] rounded-xl bg-muted/30 border-none text-foreground resize-none" 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="max-w-3xl rounded-3xl shadow-2xl border-none bg-card">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold text-foreground">Sekcja: O Nas</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Główny Opis</label>
                            <Textarea 
                              value={cmsData.about?.description || ""} 
                              onChange={e => handleCmsChange('about', 'description', e.target.value)}
                              className="min-h-[120px] rounded-xl bg-muted/30 border-none text-foreground resize-none" 
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Lata Doświadczenia</label>
                              <Input 
                                type="number"
                                value={cmsData.about?.stats?.years || ""} 
                                onChange={e => handleCmsChange('about', 'stats', e.target.value, 'years')}
                                className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Zadowoleni Klienci</label>
                              <Input 
                                type="number"
                                value={cmsData.about?.stats?.clients || ""} 
                                onChange={e => handleCmsChange('about', 'stats', e.target.value, 'clients')}
                                className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Projekty</label>
                              <Input 
                                type="number"
                                value={cmsData.about?.stats?.projects || ""} 
                                onChange={e => handleCmsChange('about', 'stats', e.target.value, 'projects')}
                                className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="max-w-3xl rounded-3xl shadow-2xl border-none bg-card mb-20">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold text-foreground">Sekcja: Kontakt</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Główny Telefon</label>
                              <Input 
                                value={cmsData.contact?.phoneMain || ""} 
                                onChange={e => handleCmsChange('contact', 'phoneMain', e.target.value)}
                                className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Główny Email</label>
                              <Input 
                                value={cmsData.contact?.emailMain || ""} 
                                onChange={e => handleCmsChange('contact', 'emailMain', e.target.value)}
                                className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                              />
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-bold text-foreground mb-4">Filia Poznań</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Telefon</label>
                                <Input 
                                  value={cmsData.contact?.branchPoznanPhone || ""} 
                                  onChange={e => handleCmsChange('contact', 'branchPoznanPhone', e.target.value)}
                                  className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Godziny (np. Pn-Pt: 8-18)</label>
                                <Input 
                                  value={cmsData.contact?.branchPoznanHours || ""} 
                                  onChange={e => handleCmsChange('contact', 'branchPoznanHours', e.target.value)}
                                  className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-bold text-foreground mb-4">Filia Warszawa</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Telefon</label>
                                <Input 
                                  value={cmsData.contact?.branchWarszawaPhone || ""} 
                                  onChange={e => handleCmsChange('contact', 'branchWarszawaPhone', e.target.value)}
                                  className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Godziny (np. Pn-Pt: 8-18)</label>
                                <Input 
                                  value={cmsData.contact?.branchWarszawaHours || ""} 
                                  onChange={e => handleCmsChange('contact', 'branchWarszawaHours', e.target.value)}
                                  className="h-12 rounded-xl bg-muted/30 border-none text-foreground" 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
