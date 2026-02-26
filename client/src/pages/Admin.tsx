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
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

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
        fetch(`${API_BASE}/api/projects`)
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

    try {
      let res;
      if (editingProject) {
         res = await fetch(`${API_BASE}/api/admin/projects/${editingProject.id}`, {
            method: 'PUT',
            body: formData,
         });
      } else {
         res = await fetch(`${API_BASE}/api/admin/projects`, {
            method: 'POST',
            body: formData,
         });
      }

      if (res.ok) {
        setEditingProject(null); // Close edit mode / clear form
        // Refresh projects
        const projectsRes = await fetch(`${API_BASE}/api/projects`);
        if (projectsRes.ok) setProjects(await projectsRes.json());
        alert(editingProject ? "Projekt zaktualizowany!" : "Projekt dodany!");
      } else {
        const errorData = await res.json();
        alert(`Błąd zapisu projektu: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error("Error saving project", error);
      alert("Wystąpił błąd połączenia z serwerem.");
    } finally {
      setUploading(false);
    }
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
                    </div>
                    <Card>
                        <Table>
                          <TableHeader>
                                                        <TableRow>
                                                          <TableHead>Data</TableHead>
                                                          <TableHead>Klient</TableHead>
                                                          <TableHead>Kontakt</TableHead>
                                                          <TableHead>Filia</TableHead>
                                                          <TableHead>Wiadomość</TableHead>
                                                        </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                        {leads.map((lead) => {
                                                          let formattedDate = "Brak daty";
                                                          try {
                                                            if (lead.created_at) {
                                                              formattedDate = format(new Date(lead.created_at), "dd.MM.yyyy HH:mm", { locale: pl });
                                                            }
                                                          } catch (e) {}
                                                          
                                                          return (
                                                            <TableRow key={lead.id}>
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
                                                              <TableCell>{lead.message}</TableCell>
                                                            </TableRow>
                                                          );
                                                        })}                          {leads.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8">Brak wiadomości</TableCell></TableRow>}
                          </TableBody>
                        </Table>
                    </Card>
                  </div>
                )}

                {/* Portfolio View */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Menedżer Portfolio</h1>
                     </div>

                     <div className="grid lg:grid-cols-3 gap-8">
                        {/* Add/Edit Project Form */}
                        <Card className="lg:col-span-1 h-fit sticky top-4">
                           <CardHeader>
                              <CardTitle>{editingProject ? "Edytuj Projekt" : "Dodaj Nowy Projekt"}</CardTitle>
                              <CardDescription>
                                {editingProject ? "Zmień dane lub dodaj nowe zdjęcia." : "Wypełnij formularz, aby dodać realizację."}
                              </CardDescription>
                           </CardHeader>
                           <CardContent>
                              <form onSubmit={handleProjectSubmit} className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Tytuł</label>
                                    <Input 
                                       placeholder="np. Remont Łazienki" 
                                       required
                                       value={newProject.title}
                                       onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                    />
                                 </div>
                                 
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Kategoria</label>
                                    <select 
                                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                       value={newProject.category}
                                       onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                    >
                                       <option value="Komercyjne">Komercyjne</option>
                                       <option value="Mieszkaniowe">Mieszkaniowe</option>
                                       <option value="Podłogi">Podłogi</option>
                                       <option value="Inne">Inne</option>
                                    </select>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Opis</label>
                                    <Textarea 
                                       placeholder="Krótki opis realizacji..." 
                                       required
                                       value={newProject.description}
                                       onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                       {editingProject ? "Dodaj nowe zdjęcia (opcjonalnie)" : "Zdjęcia"}
                                    </label>
                                    <div className="border-2 border-dashed border-border rounded-md p-4 text-center hover:bg-secondary/10 transition-colors cursor-pointer relative">
                                       <input 
                                          type="file" 
                                          accept="image/*"
                                          multiple
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          onChange={(e) => setSelectedFiles(e.target.files)}
                                          // required if not editing
                                          required={!editingProject}
                                       />
                                       <div className="flex flex-col items-center gap-2">
                                          <Upload className="w-8 h-8 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                             {selectedFiles && selectedFiles.length > 0 
                                                ? `Wybrano plików: ${selectedFiles.length}` 
                                                : "Kliknij, aby wybrać zdjęcia (wiele)"}
                                          </span>
                                       </div>
                                    </div>
                                    {editingProject && editingProject.images && (
                                       <div className="mt-2 text-xs text-muted-foreground">
                                          Obecnie: {editingProject.images.length} zdjęć w galerii.
                                       </div>
                                    )}
                                 </div>

                                 <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={uploading}>
                                       {uploading ? <Loader2 className="animate-spin mr-2" /> : (editingProject ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                                       {editingProject ? "Zapisz Zmiany" : "Dodaj Projekt"}
                                    </Button>
                                    {editingProject && (
                                       <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>
                                          Anuluj
                                       </Button>
                                    )}
                                 </div>
                              </form>
                           </CardContent>
                        </Card>

                        {/* Projects List */}
                        <div className="lg:col-span-2 space-y-4">
                           <h2 className="text-xl font-semibold">Twoje Projekty ({projects.length})</h2>
                           <div className="grid sm:grid-cols-2 gap-4">
                              {projects.map((project) => (
                                 <div key={project.id} className="bg-white border rounded-lg overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                    <div className="relative h-40 bg-gray-100">
                                       <img 
                                          src={project.image} 
                                          alt={project.title} 
                                          className="w-full h-full object-cover"
                                       />
                                       <div className="absolute top-2 right-2 flex gap-1">
                                          <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">{project.category}</Badge>
                                          {project.images && project.images.length > 1 && (
                                             <Badge variant="secondary" className="bg-white/90 text-primary">+{project.images.length - 1}</Badge>
                                          )}
                                       </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                       <h3 className="font-bold text-primary mb-1">{project.title}</h3>
                                       <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-2">{project.description}</p>
                                       
                                       <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button 
                                             variant="secondary" 
                                             size="sm" 
                                             className="flex-1"
                                             onClick={() => setEditingProject(project)}
                                          >
                                             <Edit className="w-4 h-4 mr-2" />
                                             Edytuj
                                          </Button>
                                          <Button 
                                             variant="destructive" 
                                             size="sm" 
                                             className="flex-1"
                                             onClick={() => handleDeleteProject(project.id)}
                                          >
                                             <Trash2 className="w-4 h-4 mr-2" />
                                             Usuń
                                          </Button>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                              {projects.length === 0 && (
                                 <div className="col-span-2 text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                    Brak projektów. Dodaj pierwszy używając formularza.
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
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
