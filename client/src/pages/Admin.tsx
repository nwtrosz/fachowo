import { useEffect, useState } from "react";
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
  GripVertical
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
      
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-1 left-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </div>

      {/* Delete Button */}
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
  image: string; // Main image
  images?: string[]; // All images
  description: string;
  created_at: string;
  archived?: boolean;
}

export default function Admin() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
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

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Komercyjne',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  // Use relative paths for production compatibility
  const API_BASE = "";

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
        setIsAuthenticated(true);
        setAuthError("");
        fetchData();
      } else {
        setAuthError(data.error || "Nieprawidłowa nazwa użytkownika lub hasło");
      }
    } catch (error) {
      setAuthError("Błąd połączenia z serwerem logowania");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLeads([]);
    setStats(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/leads`),
        fetch(`${API_BASE}/api/admin/stats`),
        fetch(`${API_BASE}/api/admin/projects`)
      ]);
      
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveProject = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, archived: true } : p));
      }
    } catch (error) { console.error("Failed to archive", error); }
  };

  const handleRestoreProject = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}/restore`, { method: 'POST' });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, archived: false } : p));
      }
    } catch (error) { console.error("Failed to restore", error); }
  };

  const handleDeleteImage = async (projectId: number, imageUrl: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${projectId}/images/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update local projects state
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, images: data.images, image: data.images[0] || "" } : p
        ));
        // Also update editingProject if active
        if (editingProject && editingProject.id === projectId) {
          setEditingProject({ ...editingProject, images: data.images, image: data.images[0] || "" });
        }
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handlePermanentDeleteProject = async (id: number) => {
    const currentCount = deleteClickCount[id] || 0;
    
    if (currentCount < 2) {
      setDeleteClickCount({ ...deleteClickCount, [id]: currentCount + 1 });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}/permanent`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        setDeleteClickCount({ ...deleteClickCount, [id]: 0 });
      }
    } catch (error) { console.error("Failed to delete permanently", error); }
  };

  const handleArchiveLead = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/leads/${id}/archive`, {
        method: 'POST'
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, archived: !l.archived } : l));
      }
    } catch (error) {
      console.error("Failed to archive lead", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !editingProject || !editingProject.images) return;

    const oldIndex = editingProject.images.indexOf(active.id as string);
    const newIndex = editingProject.images.indexOf(over.id as string);

    const newImages = arrayMove(editingProject.images, oldIndex, newIndex);
    
    // Update locally immediately
    const updatedProject = { 
      ...editingProject, 
      images: newImages, 
      image: newImages[0] 
    };
    setEditingProject(updatedProject);
    setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));

    // Save to server
    try {
      await fetch(`${API_BASE}/api/admin/projects/${editingProject.id}/images/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls: newImages })
      });
    } catch (error) {
      console.error("Failed to save new order", error);
    }
  };

  const handleSendReply = async (id: number) => {
    if (!replyMessage.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/leads/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      });
      if (res.ok) {
        // Update local state with the new reply
        const newReply: Reply = {
          id: Date.now(),
          message: replyMessage,
          created_at: new Date().toISOString()
        };
        
        setLeads(leads.map(l => {
          if (l.id === id) {
            const currentReplies = l.replies || [];
            return { ...l, replies: [...currentReplies, newReply] };
          }
          return l;
        }));
        
        setReplyMessage("");
        alert("Odpowiedź została wysłana!");
      } else {
        alert("Błąd podczas wysyłania odpowiedzi.");
      }
    } catch (error) {
      console.error("Failed to send reply", error);
      alert("Błąd połączenia.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const getLeadHistory = (lead: Lead) => {
    return leads.filter(l => 
      (l.email && l.email === lead.email) || 
      (l.phone && l.phone === lead.phone)
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Populate form on edit
  useEffect(() => {
    if (editingProject) {
      setNewProject({
        title: editingProject.title,
        category: editingProject.category,
        description: editingProject.description
      });
      setSelectedFiles(null); // Reset files, we keep existing unless added
    } else {
      setNewProject({ title: '', category: 'Komercyjne', description: '' });
      setSelectedFiles(null);
    }
  }, [editingProject]);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!editingProject && (!selectedFiles || selectedFiles.length === 0)) {
        alert("Proszę wybrać co najmniej jedno zdjęcie.");
        return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('category', newProject.category);
    formData.append('description', newProject.description);
    
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }
    }

    const url = editingProject 
      ? `${API_BASE}/api/admin/projects/${editingProject.id}` 
      : `${API_BASE}/api/admin/projects`;
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(percent);
      }
    });

    xhr.addEventListener('load', async () => {
      setUploading(false);
      setUploadProgress(0);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        setEditingProject(null);
        setNewProject({ title: '', category: 'Komercyjne', description: '' });
        setSelectedFiles(null);
        setFormKey(prev => prev + 1);
        setPortfolioView('list');
        
        const projectsRes = await fetch(`${API_BASE}/api/projects`);
        if (projectsRes.ok) setProjects(await projectsRes.json());
        alert(editingProject ? "Projekt zaktualizowany!" : "Projekt dodany!");
      } else {
        let errorMessage = "Błąd zapisu projektu";
        try {
          const errorData = JSON.parse(xhr.responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {}
        alert(errorMessage);
      }
    });

    xhr.addEventListener('error', () => {
      setUploading(false);
      setUploadProgress(0);
      alert("Wystąpił błąd połączenia z serwerem. Sprawdź rozmiar zdjęć.");
    });

    xhr.open(editingProject ? 'PUT' : 'POST', url);
    xhr.send(formData);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten projekt?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        if (editingProject?.id === id) setEditingProject(null);
      } else {
        alert("Błąd usuwania projektu");
      }
    } catch (error) {
       console.error("Error deleting project", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/20">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center mb-4">
              <Lock className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Panel Administratora</CardTitle>
            <CardDescription>
              Zaloguj się, aby zarządzać stroną Fachowo.EU
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {authError && (
                <p className="text-sm text-destructive font-medium text-center">{authError}</p>
              )}

              <Button type="submit" className="w-full font-bold">
                Zaloguj się
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-xl font-display font-bold">Fachowo.EU</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left",
              activeTab === 'dashboard' ? "bg-accent text-white font-bold shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutDashboard size={20} />
            Pulpit
          </button>
          
          <button
             onClick={() => setActiveTab('messages')}
             className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left",
              activeTab === 'messages' ? "bg-accent text-white font-bold shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <MessageSquare size={20} />
            Wiadomości
            {leads.length > 0 && (
              <span className="ml-auto bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {leads.length}
              </span>
            )}
          </button>

          <button
             onClick={() => setActiveTab('portfolio')}
             className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left",
              activeTab === 'portfolio' ? "bg-accent text-white font-bold shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Briefcase size={20} />
            Portfolio
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:text-red-100 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-border p-4 flex items-center justify-between md:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-primary">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
             <div className="text-sm text-muted-foreground hidden md:block">
                Zalogowany jako <span className="font-bold text-primary">popek</span>
             </div>
             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                P
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Pulpit Zarządzania</h1>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Wszystkie Zapytania</CardTitle>
                          <MessageSquare className="w-4 h-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{stats?.totalLeads || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Łączna liczba wiadomości</p>
                        </CardContent>
                      </Card>

                      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Nowe Dzisiaj</CardTitle>
                          <User className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">
                             {leads.filter(l => {
                               try {
                                 return l.created_at && new Date(l.created_at).toDateString() === new Date().toDateString();
                               } catch (e) {
                                 return false;
                               }
                             }).length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Potencjalni klienci z dzisiaj</p>
                        </CardContent>
                      </Card>

                      <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-accent">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Projekty w Portfolio</CardTitle>
                          <Briefcase className="w-4 h-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{projects.length}</div>
                          <p className="text-xs text-muted-foreground mt-1">Aktywne realizacje</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Messages Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ostatnie Wiadomości</CardTitle>
                        <CardDescription>Podgląd 5 ostatnich zapytań z formularza kontaktowego.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data</TableHead>
                              <TableHead>Klient</TableHead>
                              <TableHead>Temat</TableHead>
                              <TableHead className="text-right">Akcja</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leads.slice(0, 5).map((lead) => {
                              let formattedDate = "Brak daty";
                              try {
                                if (lead.created_at) {
                                  formattedDate = format(new Date(lead.created_at), "d MMM, HH:mm", { locale: pl });
                                }
                              } catch (e) {}
                              
                              return (
                                <TableRow key={lead.id}>
                                  <TableCell className="font-medium text-gray-600">
                                    {formattedDate}
                                  </TableCell>
                                <TableCell>
                                  <div className="font-semibold text-primary">{lead.name}</div>
                                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                  {lead.message}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('messages')}>Zobacz</Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {leads.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                  Brak wiadomości.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                                {/* Messages View */}
                                {activeTab === 'messages' && (
                                  <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-900">Wiadomości od Klientów</h1>
                                      <div className="flex gap-2 bg-white p-1 rounded-lg border">
                                        <Button 
                                          variant={!showArchived ? "default" : "ghost"} 
                                          size="sm" 
                                          onClick={() => setShowArchived(false)}
                                        >
                                          Aktywne
                                        </Button>
                                        <Button 
                                          variant={showArchived ? "default" : "ghost"} 
                                          size="sm" 
                                          onClick={() => setShowArchived(true)}
                                        >
                                          Zarchiwizowane
                                        </Button>
                                      </div>
                                    </div>
                
                                    {selectedLeadHistory ? (
                                      <Card className="border-accent">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                          <div>
                                            <CardTitle>Historia kontaktu: {selectedLeadHistory.name}</CardTitle>
                                            <CardDescription>{selectedLeadHistory.email} | {selectedLeadHistory.phone}</CardDescription>
                                          </div>
                                          <Button variant="outline" size="sm" onClick={() => setSelectedLeadHistory(null)}>
                                            <X className="w-4 h-4 mr-2" /> Zamknij historię
                                          </Button>
                                        </CardHeader>
                                                                <CardContent>
                                                                  <div className="space-y-6">
                                                                    <div className="space-y-4">
                                                                      <h4 className="text-sm font-bold uppercase text-muted-foreground border-b pb-2">Otrzymane wiadomości i odpowiedzi</h4>
                                                                      {(() => {
                                                                        const history = getLeadHistory(selectedLeadHistory);
                                                                        // Combine inquiries and replies for a chronological view
                                                                        const timeline = [
                                                                          ...history.map(h => ({ ...h, type: 'inquiry' })),
                                                                          ...(leads.find(l => l.id === selectedLeadHistory.id)?.replies || []).map(r => ({ ...r, type: 'reply', branch: selectedLeadHistory.branch }))
                                                                        ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                                        
                                                                        return timeline.map((item: any) => (
                                                                          <div key={`${item.type}-${item.id}`} className={cn(
                                                                            "p-4 rounded-xl border-l-4",
                                                                            item.type === 'inquiry' ? "bg-white border-l-accent border shadow-sm" : "bg-primary/5 border-l-primary border-dashed border ml-8"
                                                                          )}>
                                                                            <div className="flex justify-between mb-2">
                                                                              <div className="flex items-center gap-2">
                                                                                <Badge variant={item.type === 'inquiry' ? "outline" : "default"} className="text-[10px]">
                                                                                  {item.type === 'inquiry' ? "KLIENT" : "TWOJA ODPOWIEDŹ"}
                                                                                </Badge>
                                                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                                                  {format(new Date(item.created_at), "dd.MM.yyyy HH:mm", { locale: pl })}
                                                                                </span>
                                                                              </div>
                                                                              <Badge variant="secondary" className="text-[10px]">{item.branch}</Badge>
                                                                            </div>
                                                                            <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                                                                          </div>
                                                                        ));
                                                                      })()}
                                                                    </div>
                                        
                                                                    {/* Reply Form */}
                                                                    <div className="pt-6 border-t">
                                                                      <h4 className="text-sm font-bold mb-4 uppercase text-primary">Wyślij odpowiedź do: {selectedLeadHistory.email}</h4>
                                                                      <Textarea 
                                                                        placeholder="Napisz treść odpowiedzi..."
                                                                        className="mb-4 min-h-[150px]"
                                                                        value={replyMessage}
                                                                        onChange={(e) => setReplyMessage(e.target.value)}
                                                                      />
                                                                      <div className="flex justify-end gap-3">
                                                                        <Button variant="outline" onClick={() => { setReplyMessage(""); setSelectedLeadHistory(null); }}>Anuluj</Button>
                                                                        <Button 
                                                                          disabled={isSendingReply || !replyMessage.trim()}
                                                                          onClick={() => handleSendReply(selectedLeadHistory.id)}
                                                                        >
                                                                          {isSendingReply ? <Loader2 className="animate-spin mr-2" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                                                                          Wyślij E-mail
                                                                        </Button>
                                                                      </div>
                                                                      <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                                                        Odpowiedź zostanie wysłana z adresu fachowo.eu@gmail.com
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                </CardContent>                                      </Card>
                                    ) : (
                                      <Card>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Data</TableHead>
                                              <TableHead>Klient</TableHead>
                                              <TableHead>Kontakt</TableHead>
                                              <TableHead>Filia</TableHead>
                                              <TableHead>Wiadomość</TableHead>
                                              <TableHead className="text-right">Akcje</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {leads
                                              .filter(l => !!l.archived === showArchived)
                                              .map((lead) => {
                                                let formattedDate = "Brak daty";
                                                try {
                                                  if (lead.created_at) {
                                                    formattedDate = format(new Date(lead.created_at), "dd.MM.yyyy HH:mm", { locale: pl });
                                                  }
                                                } catch (e) {}
                                                
                                                return (
                                                  <TableRow 
                                                    key={lead.id} 
                                                    className="cursor-pointer hover:bg-secondary/5"
                                                    onClick={() => setSelectedLeadHistory(lead)}
                                                  >
                                                    <TableCell>{formattedDate}</TableCell>
                                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                                    <TableCell>{lead.email}<br/><span className="text-xs text-muted-foreground">{lead.phone}</span></TableCell>
                                                    <TableCell>
                                                      <Badge variant="outline" className={cn(
                                                        lead.branch === 'Poznań' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                      )}>
                                                        {lead.branch || 'Nie określono'}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">{lead.message}</TableCell>
                                                    <TableCell className="text-right">
                                                      <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-muted-foreground hover:text-primary"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleArchiveLead(lead.id);
                                                        }}
                                                      >
                                                        {showArchived ? "Przywróć" : "Archiwizuj"}
                                                      </Button>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                            {leads.filter(l => !!l.archived === showArchived).length === 0 && (
                                              <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8">Brak wiadomości</TableCell>
                                              </TableRow>
                                            )}
                                          </TableBody>
                                        </Table>
                                      </Card>
                                    )}
                                  </div>
                                )}

                {/* Portfolio View */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {portfolioView === 'list' && "Menedżer Portfolio"}
                          {portfolioView === 'add' && "Dodaj Nowy Projekt"}
                          {portfolioView === 'edit' && `Edytuj Projekt: ${editingProject?.title}`}
                        </h1>
                        <div className="flex gap-3">
                          {portfolioView === 'list' && (
                            <div className="flex gap-2 bg-white p-1 rounded-lg border mr-4">
                              <Button 
                                variant={!showArchivedProjects ? "default" : "ghost"} 
                                size="sm" 
                                onClick={() => setShowArchivedProjects(false)}
                              >
                                Aktywne
                              </Button>
                              <Button 
                                variant={showArchivedProjects ? "default" : "ghost"} 
                                size="sm" 
                                onClick={() => setShowArchivedProjects(true)}
                              >
                                Archiwum
                              </Button>
                            </div>
                          )}
                          {portfolioView === 'list' ? (
                            <Button onClick={() => setPortfolioView('add')}>
                              <Plus className="mr-2 h-4 w-4" /> Dodaj Projekt
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => { setPortfolioView('list'); setEditingProject(null); }}>
                              <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy
                            </Button>
                          )}
                        </div>
                     </div>

                     {portfolioView === 'list' ? (
                        <div className="space-y-4">
                           <h2 className="text-xl font-semibold text-muted-foreground">
                             {showArchivedProjects ? "Zarchiwizowane Projekty" : "Aktywne Realizacje"} ({projects.filter(p => !!p.archived === showArchivedProjects).length})
                           </h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {projects
                                .filter(p => !!p.archived === showArchivedProjects)
                                .map((project) => (
                                 <div key={project.id} className="bg-white border rounded-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative h-48 bg-gray-100">
                                       <img 
                                          src={project.image} 
                                          alt={project.title} 
                                          className="w-full h-full object-cover"
                                       />
                                       <div className="absolute top-3 right-3 flex gap-1">
                                          <Badge variant="secondary" className="bg-white/95 text-primary shadow-sm">{project.category}</Badge>
                                          {project.images && project.images.length > 1 && (
                                             <Badge variant="secondary" className="bg-white/95 text-primary shadow-sm">+{project.images.length - 1} zdjęć</Badge>
                                          )}
                                       </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                       <h3 className="font-bold text-xl text-primary mb-2">{project.title}</h3>
                                       <p className="text-sm text-muted-foreground flex-1 mb-6 line-clamp-3 italic leading-relaxed">
                                          {project.description}
                                       </p>
                                       
                                       <div className="flex gap-3 mt-auto">
                                          {!showArchivedProjects ? (
                                            <>
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 border-primary/20 hover:bg-primary hover:text-white"
                                                onClick={() => {
                                                  setEditingProject(project);
                                                  setPortfolioView('edit');
                                                }}
                                              >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edytuj
                                              </Button>
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 text-muted-foreground hover:text-amber-600 hover:border-amber-200"
                                                onClick={() => handleArchiveProject(project.id)}
                                              >
                                                <Briefcase className="w-4 h-4 mr-2" />
                                                Archiwizuj
                                              </Button>
                                            </>
                                          ) : (
                                            <>
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                                                onClick={() => handleRestoreProject(project.id)}
                                              >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Przywróć
                                              </Button>
                                              <Button 
                                                variant={ (deleteClickCount[project.id] || 0) === 0 ? "outline" : "destructive" }
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => handlePermanentDeleteProject(project.id)}
                                              >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {(deleteClickCount[project.id] || 0) === 0 && "Usuń trwale"}
                                                {(deleteClickCount[project.id] || 0) === 1 && "Potwierdź (2/3)"}
                                                {(deleteClickCount[project.id] || 0) === 2 && "USUŃ TERAZ (3/3)"}
                                              </Button>
                                            </>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                              {projects.filter(p => !!p.archived === showArchivedProjects).length === 0 && (
                                 <div className="col-span-full text-center py-20 border-2 border-dashed rounded-2xl text-muted-foreground bg-white">
                                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                       <Briefcase className="w-8 h-8 opacity-20" />
                                    </div>
                                    <p className="text-lg font-medium">{showArchivedProjects ? "Archiwum jest puste." : "Brak aktywnych projektów."}</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     ) : (
                        /* Add/Edit Full Page Form */
                        <Card className="max-w-3xl mx-auto shadow-2xl border-t-4 border-t-accent">
                           <CardHeader className="pb-8">
                              <CardTitle className="text-2xl font-bold">
                                 {portfolioView === 'add' ? "Szczegóły nowej realizacji" : "Edycja istniejącej realizacji"}
                              </CardTitle>
                              <CardDescription>
                                {portfolioView === 'add' ? "Wypełnij formularz, aby zaprezentować swoją pracę na stronie." : "Zaktualizuj dane projektu i zdjęcia."}
                              </CardDescription>
                           </CardHeader>
                           <CardContent>
                              <form key={formKey} onSubmit={handleProjectSubmit} className="space-y-6">
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-sm font-bold text-primary">Tytuł Realizacji</label>
                                       <Input 
                                          placeholder="np. Kompleksowy remont biura" 
                                          required
                                          className="h-12"
                                          value={newProject.title}
                                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                       />
                                    </div>
                                    
                                    <div className="space-y-2">
                                       <label className="text-sm font-bold text-primary">Kategoria</label>
                                       <select 
                                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          value={newProject.category}
                                          onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                       >
                                          <option value="Komercyjne">Komercyjne</option>
                                          <option value="Mieszkaniowe">Mieszkaniowe</option>
                                          <option value="Podłogi">Podłogi</option>
                                          <option value="Inne">Inne</option>
                                       </select>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Opis prac i zakres realizacji</label>
                                    <Textarea 
                                       placeholder="Opisz co dokładnie zostało wykonane..." 
                                       required
                                       className="min-h-[150px] resize-none"
                                       value={newProject.description}
                                       onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">
                                       {portfolioView === 'edit' ? "Dodaj nowe zdjęcia (dopiszą się do galerii)" : "Zdjęcia projektu"}
                                    </label>
                                    
                                    {portfolioView === 'edit' && editingProject?.images && editingProject.images.length > 0 && (
                                       <div className="space-y-3 mb-4">
                                          <div className="flex justify-between items-center">
                                             <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Obecna Galeria ({editingProject.images.length})</p>
                                             <p className="text-[10px] text-accent font-medium">Przeciągnij, aby zmienić kolejność</p>
                                          </div>
                                          
                                          <DndContext 
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                          >
                                            <SortableContext 
                                              items={editingProject.images}
                                              strategy={horizontalListSortingStrategy}
                                            >
                                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-secondary/5 p-3 rounded-xl border border-dashed">
                                                {editingProject.images.map((img, idx) => (
                                                  <SortableImage 
                                                    key={img} 
                                                    id={img} 
                                                    img={img} 
                                                    onDelete={() => handleDeleteImage(editingProject.id, img)} 
                                                    isThumbnail={idx === 0}
                                                  />
                                                ))}
                                              </div>
                                            </SortableContext>
                                          </DndContext>
                                       </div>
                                    )}

                                    <div className="group relative border-2 border-dashed border-primary/20 rounded-2xl p-10 text-center hover:bg-accent/5 hover:border-accent transition-all cursor-pointer">
                                       <input 
                                          type="file" 
                                          accept="image/*"
                                          multiple
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          onChange={(e) => setSelectedFiles(e.target.files)}
                                          required={portfolioView === 'add'}
                                       />
                                       <div className="flex flex-col items-center gap-3">
                                          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                             <ImageIcon size={32} />
                                          </div>
                                          <div>
                                             <p className="font-bold text-primary">
                                                {selectedFiles && selectedFiles.length > 0 
                                                   ? `Wybrano plików: ${selectedFiles.length}` 
                                                   : "Kliknij lub przeciągnij zdjęcia tutaj"}
                                             </p>
                                             <p className="text-xs text-muted-foreground mt-1">Możesz wybrać wiele zdjęć na raz (zalecane JPG/PNG)</p>
                                          </div>
                                       </div>
                                    </div>
                                    {portfolioView === 'edit' && editingProject?.images && (
                                       <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                                          <CheckCircle size={14} />
                                          Obecnie w galerii: {editingProject.images.length} zdjęć.
                                       </div>
                                    )}
                                 </div>

                                 <div className="flex flex-col gap-4 pt-4">
                                    <div className="flex-1 space-y-2">
                                       <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/10" disabled={uploading}>
                                          {uploading ? <Loader2 className="animate-spin mr-2" /> : (portfolioView === 'edit' ? <Edit className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />)}
                                          {portfolioView === 'edit' ? "Zapisz Zmiany w Projekcie" : "Opublikuj Projekt w Portfolio"}
                                       </Button>
                                       
                                       {uploading && (
                                          <div className="w-full space-y-2 mt-4">
                                             <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-widest">
                                                <span>Przesyłanie danych...</span>
                                                <span>{uploadProgress}%</span>
                                             </div>
                                             <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                                                <motion.div 
                                                   className="bg-accent h-full" 
                                                   initial={{ width: 0 }}
                                                   animate={{ width: `${uploadProgress}%` }}
                                                   transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                                />
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                    <Button type="button" variant="ghost" className="h-12" onClick={() => { setPortfolioView('list'); setEditingProject(null); }} disabled={uploading}>
                                       Anuluj i wróć
                                    </Button>
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
