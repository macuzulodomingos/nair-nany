"use client";

import { useState, useEffect, type FormEvent } from "react";
import { API_URL } from "@/lib/api"; // Ajuste o caminho conforme sua pasta
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Image as ImageIcon,
  Music,
  Upload,
  Trash2,
  Edit,
  Plus,
  LogOut,
  Eye,
} from "lucide-react";
import { toast } from "sonner"; // IMPORTANTE
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import {
  Users, // Importe o ícone de Users
  ShieldCheck,
  UserPlus,
} from "lucide-react";

interface EventType {
  id: number;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  status: string;
}
interface ContactRecord {
  id: number;
  tipo_contato: "igreja" | "imprensa";
  nome: string;
  email: string;
  telefone: string | null;
  organizacao: string | null;
  meio_comunicacao: string | null;
  tipo_evento: string | null;
  data_evento: string | null;
  local_evento: string | null;
  assunto: string | null;
  mensagem: string;
  is_read: boolean;
  criado_em: string;
}

interface PrayerRequest {
  id: number;
  content: string;
  status: string;
  created_at: string;
}

interface PhotoRecord {
  id: number;
  url: string;
  name: string;
}

interface SongRecord {
  id: number;
  title: string;
  lyrics: string;
}

const Dashboard = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [agenda, setAgenda] = useState<EventType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [eventToEdit, setEventToEdit] = useState<EventType | null>(null);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [songs, setSongs] = useState<SongRecord[]>([]);
  const [newSong, setNewSong] = useState({ title: "", lyrics: "" });
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(
    null
  );
  const [users, setUsers] = useState([]); // Opcional: lista de membros
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });

  // Form states para nova agenda
  const [newEvent, setNewEvent] = useState({
    date: "",
    time: "",
    venue: "",
    city: "",
    country: "Angola",
    status: "pending",
  });

  useEffect(() => {
    if (!isLoggedIn) return; // só busca eventos se o usuário estiver logado

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`, {
          credentials: "include", // importante (cookies/JWT)
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error("Erro ao carregar eventos");
          return;
        }

        setAgenda(data); // ⬅️ eventos vindos do DB
      } catch (error) {
        console.error(error);
        toast.error("Erro de conexão ao carregar eventos");
      }
    };

    const fetchContacts = async () => {
      try {
        const res = await fetch(`${API_URL}/contact`, {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) setContacts(data);
      } catch (error) {
        toast.error("Erro ao carregar mensagens");
      }
    };

    const fetchPrayers = async () => {
      try {
        const res = await fetch(`${API_URL}/prayers`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPrayers(data);
        }
      } catch (error) {
        toast.error("Erro ao carregar pedidos de oração");
      }
    };

    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/photos`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        }
      } catch (error) {
        console.error("Erro ao carregar fotos");
      }
    };

    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/songs`);
        if (res.ok) {
          const data = await res.json();
          setSongs(data);
        }
      } catch (error) {
        console.error("Erro ao carregar letras");
      }
    };

    fetchEvents();
    fetchContacts();
    fetchPrayers();
    fetchPhotos();
    fetchSongs();
  }, [isLoggedIn]); // <-- agora só roda quando o usuário estiver logado

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante para enviar cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(
          <div>
            <strong>Erro</strong>
            <p>{data.message || "Falha no login"}</p>
          </div>
        );
        return;
      }

      setIsLoggedIn(true);
      toast.success(
        <div>
          <strong>Login efetuado</strong>
          <p>Bem-vinda ao painel de administração, Nair!</p>
        </div>
      );
    } catch (error) {
      console.error(error);
      toast.error(
        <div>
          <strong>Erro</strong>
          <p>Não foi possível conectar ao servidor.</p>
        </div>
      );
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    toast(
      <div>
        <strong>Sessão terminada</strong>
        <p>Até breve!</p>
      </div>
    );
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();

    if (!newEvent.date || !newEvent.venue || !newEvent.city) {
      toast.error(
        <div>
          <strong>Erro</strong>
          <p>Preencha os campos obrigatórios.</p>
        </div>
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        credentials: "include", // envia cookie JWT automaticamente
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          <div>
            <strong>Erro</strong>
            <p>{data.message || "Falha ao adicionar evento"}</p>
          </div>
        );
        return;
      }

      // Em vez de apenas 'data', garanta que o objeto tenha o que o card precisa
      const eventWithId = {
        ...data,
        id: data.id || Date.now(), // usa o id que vem do banco ou um temporário
      };

      setAgenda((prev) => [...prev, eventWithId]);

      // Limpa formulário
      setNewEvent({
        date: "",
        time: "",
        venue: "",
        city: "",
        country: "Angola",
        status: "pending",
      });

      toast.success(
        <div>
          <strong>Evento adicionado</strong>
          <p>O novo evento foi adicionado à agenda.</p>
        </div>
      );
    } catch (error) {
      console.error(error);
      toast(
        <div>
          <strong>Erro</strong>
          <p>Não foi possível conectar ao servidor.</p>
        </div>
      );
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        credentials: "include", // envia o cookie JWT
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          <div>
            <strong>Erro</strong>
            <p>{data.message || "Falha ao remover evento"}</p>
          </div>
        );
        return;
      }

      // Atualiza estado local APÓS sucesso no backend
      setAgenda((prev) => prev.filter((event) => event.id !== id));

      toast.success(
        <div>
          <strong>Evento removido</strong>
          <p>O evento foi removido com sucesso.</p>
        </div>
      );
    } catch (error) {
      console.error(error);
      toast.error(
        <div>
          <strong>Erro</strong>
          <p>Não foi possível conectar ao servidor.</p>
        </div>
      );
    }
  };

  const handleEditClick = (event: EventType) => {
    setEventToEdit({ ...event }); // Clona o evento para não editar a lista original antes da hora
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (e: FormEvent) => {
    e.preventDefault();

    if (!eventToEdit) return; // 🔒 proteção obrigatória
    try {
      const res = await fetch(`${API_URL}/events/${eventToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventToEdit),
        credentials: "include",
      });

      if (res.ok) {
        // Atualiza a lista local sem precisar recarregar a página (Imutabilidade)
        setAgenda((prev) =>
          prev.map((item) => (item.id === eventToEdit.id ? eventToEdit : item))
        );

        setIsEditModalOpen(false);
        toast.success("Evento atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma foto primeiro!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${API_URL}/photos`, {
        method: "POST",
        body: formData,
        credentials: "include", // se usar cookies de autenticação
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao enviar foto");
      }

      // Usa o objeto retornado pelo backend (já com id, url real, etc)
      setPhotos((prev) => [...prev, data]);

      setSelectedFile(null); // limpa seleção
      toast.success("Foto enviada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/photos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao deletar foto");

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
      toast.success("Foto removida com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao deletar foto");
      }
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/password/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      setResetMessage(
        data.message || "Se o email existir, receberá instruções."
      );
    } catch (error) {
      console.error(error);
      setResetMessage("Erro ao enviar solicitação");
    }
  };

  // Função para criar novo usuário
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao criar utilizador");
        return;
      }

      toast.success("Membro da equipa adicionado com sucesso!");
      setNewUser({ name: "", email: "", password: "", role: "editor" }); // Limpa form
    } catch (error) {
      toast.error("Falha na conexão com o servidor");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/contact/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_read: true } : c))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status");
    }
  };

  const handleDeleteContact = async (id: number) => {
    // 1. Confirmação simples
    if (!window.confirm("Tem certeza que deseja apagar este contacto?")) return;

    try {
      const res = await fetch(`${API_URL}/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Erro ao eliminar contacto");
        return;
      }

      // 2. Atualiza o estado local IMEDIATAMENTE (UI Optimista)
      setContacts((prev) => prev.filter((c) => c.id !== id));

      // 3. Limpa o contacto selecionado para fechar o modal
      setSelectedContact(null);

      toast.success("Contacto eliminado com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar:", error);
      toast.error("Não foi possível conectar ao servidor.");
    }
  };

  const handleDeletePrayer = async (id: number) => {
    if (!window.confirm("Deseja apagar este pedido de oração?")) return;

    try {
      const res = await fetch(`${API_URL}/prayers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPrayers((prev) => prev.filter((p) => p.id !== id));
        toast.success("Pedido de oração removido.");
      } else {
        toast.error("Erro ao remover pedido.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const handleTogglePrayerStatus = async (
    id: number,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    try {
      const res = await fetch(`${API_URL}/prayers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Atualização Imutável do Estado
        setPrayers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        toast.success(
          newStatus === "completed"
            ? "Marcado como orado! 🙏"
            : "Pedido reaberto."
        );
      }
    } catch (error) {
      toast.error("Falha ao atualizar status.");
    }
  };

  const handleAddSong = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSong),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao salvar letra:", data);
        toast.error(data.message || "Erro ao salvar letra");
        return;
      }

      setSongs((prev) => [...prev, data]);
      setNewSong({ title: "", lyrics: "" });
      toast.success("Letra adicionada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor");
    }
  };

  const handleDeleteSong = async (id: number) => {
    if (!window.confirm("Apagar esta letra?")) return;
    try {
      const res = await fetch(`${API_URL}/songs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao remover letra:", data);
        toast.error(data.message || "Erro ao remover letra");
        return;
      }

      setSongs((prev) => prev.filter((s) => s.id !== id));
      toast.success("Letra removida.");
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor");
    }
  };

  const handleUpdateSong = async (songToUpdate: SongRecord) => {
    try {
      const res = await fetch(`${API_URL}/songs/${songToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: songToUpdate.title,
          lyrics: songToUpdate.lyrics,
        }),
        credentials: "include",
      });

      if (res.ok) {
        // Atualiza o estado local para refletir a mudança na lista imediatamente
        setSongs((prev) =>
          prev.map((s) => (s.id === songToUpdate.id ? songToUpdate : s))
        );
        toast.success("Letra atualizada com sucesso!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Erro ao atualizar letra");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão com o servidor");
    }
  };

  
  // Tela de Login com "Esqueci a senha"
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-30">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">
              Painel de Administração
            </CardTitle>
            <CardDescription>Acesso exclusivo para Nair Nany</CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword ? (
              <>
                {/* Formulário de Login */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nair@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </form>

                {/* Link para "Esqueci a senha" */}
                <p className="text-sm mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-500 hover:underline"
                  >
                    Esqueci a senha
                  </button>
                </p>
              </>
            ) : (
              <>
                {/* Formulário de Esqueci a Senha */}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Digite seu email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Instruções
                  </Button>

                  {resetMessage && (
                    <p className="text-sm text-center mt-2">{resetMessage}</p>
                  )}

                  {/* Botão para voltar ao login */}
                  <p className="text-sm text-center mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-blue-500 hover:underline"
                    >
                      Voltar para login
                    </button>
                  </p>
                </form>
              </>
            )}

            {/* Nota de Demonstração */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center"></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard Principal
  return (
    <>
      <div className="min-h-screen mx-auto bg-background">
        {/* Header do Dashboard */}
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container pt-22 mx-auto w-[90%] md:w-[80%] px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="font-serif pb-1 text-2xl md:text-3xl">
                Painel de Administração
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Bem-vinda, Nair Nany!
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" size="sm" asChild>
                <a href="/" target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Site
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Dashboard */}
        <div className="container mx-auto w-[90%] md:w-[80%] px-4 py-8">
          <Tabs defaultValue="agenda" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-25 gap-4">
              {" "}
              {/* Aumentei para 3 colunas */}
              <TabsTrigger value="agenda" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agenda
              </TabsTrigger>
              <TabsTrigger value="fotos" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Fotos
              </TabsTrigger>
              <TabsTrigger value="letras" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Letras
              </TabsTrigger>
              <TabsTrigger
                value="contactos"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Mensagens{" "}
                {contacts.filter((c) => !c.is_read).length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {contacts.filter((c) => !c.is_read).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="oracoes" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />{" "}
                {/* Ou use um ícone de mãos dadas/oração */}
                Orações
              </TabsTrigger>
              <TabsTrigger value="equipa" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Equipa
              </TabsTrigger>
            </TabsList>

            {/* Tab Agenda */}
            <TabsContent value="agenda" className="space-y-6">
              {/* Adicionar Novo Evento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Adicionar Novo Evento
                  </CardTitle>
                  <CardDescription>
                    Preencha os detalhes do novo evento na sua agenda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleAddEvent}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Hora</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, time: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Local</Label>
                      <Input
                        id="venue"
                        placeholder="Nome da igreja/local"
                        value={newEvent.venue}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, venue: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        value={newEvent.city}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        placeholder="País"
                        value={newEvent.country}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, country: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={newEvent.status}
                        onValueChange={(value) =>
                          setNewEvent({ ...newEvent, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                      <Button type="submit">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Evento
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de Eventos */}
              <Card>
                <CardHeader>
                  <CardTitle>Eventos Agendados</CardTitle>
                  <CardDescription>
                    {agenda.length} evento(s) na sua agenda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agenda.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-15">
                            <div className="text-2xl font-bold text-primary">
                              {/* Se não for uma data válida, mostra -- */}
                              {!isNaN(new Date(event.date).getTime())
                                ? new Date(event.date).getDate()
                                : "--"}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase">
                              {!isNaN(new Date(event.date).getTime())
                                ? new Date(event.date).toLocaleDateString(
                                    "pt-PT",
                                    { month: "short" }
                                  )
                                : "Data"}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">{event.venue}</h4>
                            <p className="text-sm text-muted-foreground">
                              {event.city}, {event.country} • {event.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              event.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : event.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {event.status === "confirmed"
                              ? "Confirmado"
                              : event.status === "pending"
                              ? "Pendente"
                              : "Cancelado"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditClick(event)} // Agora passa o objeto todo
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {agenda.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum evento agendado</p>
                        <p className="text-sm">Adicione um novo evento acima</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-primary" />
                      Editar Evento
                    </DialogTitle>
                    <DialogDescription>
                      Ajuste as informações do evento. As alterações serão
                      refletidas imediatamente no site.
                    </DialogDescription>
                  </DialogHeader>

                  {eventToEdit && (
                    <form
                      onSubmit={handleUpdateEvent}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
                    >
                      {/* Data e Hora */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-date">Data</Label>
                        <Input
                          id="edit-date"
                          type="date"
                          value={eventToEdit.date}
                          onChange={(e) =>
                            setEventToEdit({
                              ...eventToEdit,
                              date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-time">Hora</Label>
                        <Input
                          id="edit-time"
                          type="time"
                          value={eventToEdit.time}
                          onChange={(e) =>
                            setEventToEdit({
                              ...eventToEdit,
                              time: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {/* Local - Ocupa linha inteira no mobile, metade no desktop */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-venue">
                          Local (Igreja/Auditório)
                        </Label>
                        <Input
                          id="edit-venue"
                          value={eventToEdit.venue}
                          onChange={(e) =>
                            setEventToEdit({
                              ...eventToEdit,
                              venue: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {/* Cidade e País */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-city">Cidade</Label>
                        <Input
                          id="edit-city"
                          value={eventToEdit.city}
                          onChange={(e) =>
                            setEventToEdit({
                              ...eventToEdit,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-country">País</Label>
                        <Input
                          id="edit-country"
                          value={eventToEdit.country}
                          onChange={(e) =>
                            setEventToEdit({
                              ...eventToEdit,
                              country: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {/* Status com o Select do shadcn */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-status">Status do Evento</Label>
                        <Select
                          value={eventToEdit.status}
                          onValueChange={(value) =>
                            setEventToEdit({ ...eventToEdit, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">
                              Confirmado
                            </SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Descartar
                        </Button>
                        <Button type="submit">Confirmar Alterações</Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Tab Fotos */}
            <TabsContent value="fotos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Gestão de Galeria e Media Kit
                  </CardTitle>
                  <CardDescription>
                    Faça upload de fotos para a galeria do site e materiais do
                    Media Kit.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row items-end gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture">Selecionar Imagem</Label>
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <Button
                      onClick={handlePhotoUpload}
                      disabled={!selectedFile}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar para Nuvem
                    </Button>
                  </div>

                  {/* Grid de Fotos vindas do Backend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                    {photos.map((photo: any) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {photos.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground">
                        Nenhuma foto na galeria.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="letras" className="space-y-6">
              {/* SEÇÃO: GESTÃO DE LETRAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário de Cadastro */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Music className="h-5 w-5" /> Adicionar Letra
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddSong} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título da Música</Label>
                        <Input
                          placeholder="Ex: Melhor Amigo"
                          value={newSong.title}
                          onChange={(e) =>
                            setNewSong({ ...newSong, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Letra Completa</Label>
                        <textarea
                          className="flex min-h-50 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Cole a letra aqui..."
                          value={newSong.lyrics}
                          onChange={(e) =>
                            setNewSong({ ...newSong, lyrics: e.target.value })
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Salvar Letra
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Lista de Letras Cadastradas */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Letras no Banco de Dados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {songs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Music className="h-4 w-4 text-primary" />
                            <span className="font-medium text-accent">
                              {song.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* DIALOG DE EDIÇÃO */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-500 hover:bg-blue-500/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-150">
                                <DialogHeader>
                                  <DialogTitle>
                                    Editar Letra: {song.title}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input
                                      defaultValue={song.title}
                                      onChange={(e) =>
                                        (song.title = e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Letra</Label>
                                    <textarea
                                      className="flex min-h-75 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                      defaultValue={song.lyrics}
                                      onChange={(e) =>
                                        (song.lyrics = e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleUpdateSong(song)}
                                  >
                                    Salvar Alterações
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* BOTÃO DE EXCLUIR */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteSong(song.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {songs.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma letra cadastrada.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ... Tab Contact ... */}
            <TabsContent value="contactos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Caixa de Entrada</CardTitle>
                  <CardDescription>
                    Gestão de convites e solicitações de imprensa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr className="text-left">
                          <th className="p-3 font-medium">Status</th>
                          <th className="p-3 font-medium">Remetente</th>
                          <th className="p-3 font-medium">Tipo/Local</th>
                          <th className="p-3 font-medium">Data Recebida</th>
                          <th className="p-3 font-medium text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {contacts.map((contact) => (
                          <tr
                            key={contact.id}
                            className={`${
                              !contact.is_read
                                ? "bg-primary/5 font-semibold"
                                : ""
                            } hover:bg-muted/50`}
                          >
                            <td className="p-3">
                              {!contact.is_read && (
                                <span className="h-2 w-2 bg-blue-600 rounded-full inline-block mr-2" />
                              )}
                              {contact.is_read ? "Lido" : "Novo"}
                            </td>
                            <td className="p-3">
                              <div>{contact.nome}</div>
                              <div className="text-xs text-muted-foreground">
                                {contact.email}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="capitalize text-xs border px-2 py-0.5 rounded-full mr-2">
                                {contact.tipo_contato}
                              </span>
                              <span className="text-muted-foreground">
                                {contact.local_evento || contact.assunto}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {new Date(contact.criado_em).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedContact(contact);
                                  if (!contact.is_read)
                                    handleMarkAsRead(contact.id);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Detalhes
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Dialog
                open={!!selectedContact}
                onOpenChange={() => setSelectedContact(null)}
              >
                {/* Adicionamos max-h-[90vh] e overflow-y-auto para o modal inteiro respirar no mobile */}
                <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Solicitação de {selectedContact?.nome}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Grid ajustada para 1 coluna no mobile e 2 no desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="break-all">
                        <strong className="block text-muted-foreground text-xs uppercase">
                          Email:
                        </strong>
                        {selectedContact?.email}
                      </div>
                      <div>
                        <strong className="block text-muted-foreground text-xs uppercase">
                          Telefone:
                        </strong>
                        {selectedContact?.telefone || "N/A"}
                      </div>
                      <div>
                        <strong className="block text-muted-foreground text-xs uppercase">
                          Organização:
                        </strong>
                        {selectedContact?.organizacao ||
                          selectedContact?.meio_comunicacao ||
                          "N/A"}
                      </div>
                      <div>
                        <strong className="block text-muted-foreground text-xs uppercase">
                          Local:
                        </strong>
                        {selectedContact?.local_evento || "N/A"}
                      </div>
                    </div>

                    <div className="separator border-t my-2" />

                    {/* Área da mensagem com scroll interno caso o texto seja gigante */}
                    <div>
                      <strong className="block text-muted-foreground text-xs uppercase mb-2">
                        Mensagem:
                      </strong>
                      <div className="bg-muted p-4 rounded-lg overflow-y-auto max-h-75 border">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {selectedContact?.mensagem}
                        </p>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="sticky bottom-0 bg-background pt-2 border-t sm:border-none">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteContact(selectedContact!.id)} // O ! garante que o ID existe
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Apagar
                    </Button>
                    <Button
                      asChild
                      variant="default"
                      className="w-full sm:w-auto"
                    >
                      <a href={`mailto:${selectedContact?.email}`}>
                        Responder por Email
                      </a>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Tab Orações */}
            <TabsContent value="oracoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos de Oração</CardTitle>
                  <CardDescription>
                    Gerencie as intenções. Os pedidos pendentes aparecem sempre
                    no topo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 1. O CONTADOR FICA AQUI (Acima da lista) */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                      <p className="text-sm text-amber-700 font-medium">
                        Pedidos Pendentes:{" "}
                        <span className="text-lg font-bold">
                          {prayers.filter((p) => p.status === "pending").length}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* 2. A LISTA COM O SORT + MAP */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prayers
                      .sort((a, b) => {
                        // Lógica: Pendentes primeiro
                        if (a.status === "pending" && b.status !== "pending")
                          return -1;
                        if (a.status !== "pending" && b.status === "pending")
                          return 1;
                        // Depois: Mais recentes primeiro
                        return (
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                        );
                      })
                      .map((prayer) => (
                        <div
                          key={prayer.id}
                          className="p-4 border rounded-lg bg-card flex flex-col justify-between shadow-sm"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                {new Date(prayer.created_at).toLocaleDateString(
                                  "pt-PT"
                                )}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeletePrayer(prayer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <p className="text-sm italic text-foreground/90 leading-relaxed mb-4">
                              "{prayer.content}"
                            </p>
                          </div>

                          {/* Rodapé do Card (Botão de Status) */}
                          <div className="mt-4 flex items-center justify-between border-t pt-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                prayer.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {prayer.status === "pending"
                                ? "Pendente"
                                : "Orado"}
                            </span>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleTogglePrayerStatus(
                                  prayer.id,
                                  prayer.status
                                )
                              }
                              className={
                                prayer.status === "completed"
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }
                            >
                              <ShieldCheck
                                className={`h-4 w-4 mr-1 ${
                                  prayer.status === "completed"
                                    ? "fill-emerald-100"
                                    : ""
                                }`}
                              />
                              {prayer.status === "pending"
                                ? "Marcar como Orado"
                                : "Concluído"}
                            </Button>
                          </div>
                        </div>
                      ))}

                    {/* Mensagem caso não haja nada */}
                    {prayers.length === 0 && (
                      <div className="col-span-full text-center py-10 text-muted-foreground italic">
                        Nenhum pedido de oração encontrado.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NOVA TAB: EQUIPA */}
            <TabsContent value="equipa" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Adicionar Gestor
                  </CardTitle>
                  <CardDescription>
                    Crie acessos para produtores ou assessores da Nair Nany.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleCreateUser}
                    className="space-y-4 max-w-xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input
                          placeholder="Ex: João Produtor"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          placeholder="produtor@email.com"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Senha Inicial</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nível de Acesso</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(val) =>
                            setNewUser({ ...newUser, role: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">
                              Editor (Agenda e Fotos)
                            </SelectItem>
                            <SelectItem value="admin">
                              Administrador (Total)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Conceder Acesso
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
