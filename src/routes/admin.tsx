import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  ref, 
  set, 
  push, 
  remove, 
  get
} from "firebase/database";
import { 
  Plus, 
  Trash, 
  Edit, 
  Save, 
  Upload, 
  LogOut, 
  Lock, 
  Settings, 
  Music, 
  Heart, 
  Calendar, 
  Image as ImageIcon, 
  BookOpen, 
  Sparkles, 
  Smile, 
  FileText, 
  Check, 
  Copy, 
  ExternalLink,
  Info,
  Grid,
  TrendingUp,
  Inbox
} from "lucide-react";
import { toast } from "sonner";
import { auth, database } from "../firebase";
import { uploadToCloudinary } from "../cloudinary";
import { useFirebase } from "../context/FirebaseDataContext";
import { DEFAULT_DATA } from "../lib/dbDefaults";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { data, loading: dbLoading } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [presetName, setPresetName] = useState(() => 
    typeof window !== "undefined" ? localStorage.getItem("cloudinary_preset") || "rakhi" : "rakhi"
  );

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save preset to localstorage on edit
  useEffect(() => {
    localStorage.setItem("cloudinary_preset", presetName);
  }, [presetName]);

  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Admin account registered successfully! Logging you in...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back! CMS unlocked.");
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An error occurred. Please try again.";
      if (err.code === "auth/configuration-not-found") {
        errMsg = "Email/Password provider is disabled in your Firebase console. Please go to Authentication > Sign-in method, and enable Email/Password.";
      }
      setLoginError(errMsg);
      toast.error(isRegistering ? "Registration failed." : "Failed to log in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || dbLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-rose border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Loading AnnaVerse CMS...</p>
        </div>
      </div>
    );
  }

  // Render Login Form if unauthenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-4 font-sans relative overflow-hidden">
        {/* Festive backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md bg-paper p-8 rounded-2xl shadow-lift border border-amber-600/10 relative">
          <div className="absolute inset-3 border-2 border-double border-amber-600/10 pointer-events-none rounded-xl" />
          
          <div className="text-center mb-8 relative z-10">
            <span className="text-rose text-2xl">🪔</span>
            <h1 className="font-display text-3xl text-rose mt-2">
              {isRegistering ? "Create Admin Account" : "AnnaVerse CMS"}
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {isRegistering ? "Setup your login details" : "Sister's Dashboard Security"}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5 relative z-10">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg whitespace-pre-line">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E6DFD3] bg-[#FCFAF5] focus:outline-none focus:ring-2 focus:ring-rose/40 text-sm"
                placeholder="admin@annaverse.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E6DFD3] bg-[#FCFAF5] focus:outline-none focus:ring-2 focus:ring-rose/40 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary hover:bg-rose text-primary-foreground font-semibold text-sm tracking-wider uppercase shadow-soft hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isRegistering ? "Register Admin" : "Unlock Admin Panel"}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-rose hover:underline font-semibold cursor-pointer"
              >
                {isRegistering ? "Already have an account? Log In" : "Need to register? Create Admin Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render CMS Dashboard if authenticated
  return (
    <div className="flex min-h-screen bg-[#FCFAF5] text-ink font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-paper border-r border-[#E6DFD3] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Header Title */}
          <div className="p-6 border-b border-[#E6DFD3] flex items-center justify-between">
            <div>
              <h2 className="font-display text-rose text-xl leading-tight">AnnaVerse</h2>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Content Management</span>
            </div>
            <span className="text-xl">❤️</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <SidebarLink icon={Grid} label="Dashboard" tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="pt-2 pb-1 px-3 text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Section Pages</div>
            <SidebarLink icon={Smile} label="Home Page" tab="home" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={BookOpen} label="Memories Grid" tab="memories" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={TrendingUp} label="Our Bond" tab="ourBond" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Sparkles} label="Surprise Box" tab="surprise" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Heart} label="Virtual Rakhi" tab="rakhi" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Calendar} label="Our Timeline" tab="timeline" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={FileText} label="Handwritten Letter" tab="letter" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={ImageIcon} label="The Gallery" tab="gallery" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Smile} label="Wishes & Promises" tab="wishes" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Music} label="Dedicated Songs" tab="songs" activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="pt-2 pb-1 px-3 text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Assets</div>
            <SidebarLink icon={ImageIcon} label="Media Library" tab="media" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={Settings} label="Global Settings" tab="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#E6DFD3] flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold truncate text-muted-foreground">{user.email}</p>
            <span className="text-[9px] uppercase tracking-wider text-rose font-bold">Authorized Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            title="Log Out"
            className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto">
          {activeTab === "dashboard" && <TabDashboard data={data} setActiveTab={setActiveTab} />}
          {activeTab === "home" && <TabHome data={data} />}
          {activeTab === "memories" && <TabMemories data={data} presetName={presetName} />}
          {activeTab === "ourBond" && <TabOurBond data={data} />}
          {activeTab === "surprise" && <TabSurprise data={data} />}
          {activeTab === "rakhi" && <TabRakhi data={data} />}
          {activeTab === "timeline" && <TabTimeline data={data} presetName={presetName} />}
          {activeTab === "letter" && <TabLetter data={data} />}
          {activeTab === "gallery" && <TabGallery data={data} presetName={presetName} />}
          {activeTab === "wishes" && <TabWishes data={data} />}
          {activeTab === "songs" && <TabSongs data={data} presetName={presetName} />}
          {activeTab === "media" && <TabMedia data={data} presetName={presetName} setPresetName={setPresetName} />}
          {activeTab === "settings" && <TabSettings data={data} />}
        </div>
      </main>

    </div>
  );
}

/* SIDEBAR LINK HELPER */
function SidebarLink({ icon: Icon, label, tab, activeTab, setActiveTab }: { icon: any; label: string; tab: string; activeTab: string; setActiveTab: (t: string) => void }) {
  const active = activeTab === tab;
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
        active 
          ? "bg-rose/10 text-rose font-medium" 
          : "text-muted-foreground hover:bg-[#FCFAF5] hover:text-foreground"
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? "text-rose" : "text-muted-foreground"}`} />
      <span>{label}</span>
    </button>
  );
}

/* ==========================================
   TAB 1: DASHBOARD
   ========================================== */
function TabDashboard({ data, setActiveTab }: { data: any; setActiveTab: (t: string) => void }) {
  const stats = [
    { label: "Memories", count: data.memories?.length || 0, tab: "memories", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Gallery Photos", count: data.gallery?.length || 0, tab: "gallery", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Timeline Milestones", count: data.timeline?.length || 0, tab: "timeline", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Sibling Wishes", count: data.wishes?.length || 0, tab: "wishes", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Dedicated Songs", count: data.songs?.length || 0, tab: "songs", color: "bg-rose-50 text-rose/70 border-rose-100" },
    { label: "Cloudinary Assets", count: Object.keys(data.media || {}).length, tab: "media", color: "bg-indigo-50 text-indigo-600 border-indigo-100" }
  ];

  const replies = Object.entries(data.replies || {}).map(([id, val]: [string, any]) => ({ id, ...val }));
  const sortedReplies = replies.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div>
        <h1 className="text-3xl font-display text-rose">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Here is a quick snapshot of the contents tying your AnnaVerse together.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setActiveTab(s.tab)}
            className={`p-5 rounded-xl border text-left hover:shadow-soft transition-all duration-300 cursor-pointer ${s.color}`}
          >
            <span className="text-2xl font-semibold tracking-tight">{s.count}</span>
            <p className="text-xs font-semibold uppercase tracking-wider mt-2 opacity-80">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Brother's Sealed Replies Inbox */}
      <div className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft">
        <h2 className="font-display text-xl text-rose mb-4 flex items-center gap-2">
          <Inbox className="w-5 h-5" />
          <span>Brother's Sealed Replies ({replies.length})</span>
        </h2>
        {sortedReplies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
            <span className="text-2xl">✉️</span>
            <p>No replies sealed yet. When your brother seals his reply on the Letter page, it will appear here!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedReplies.map((r) => (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                  <span>{r.date}</span>
                  <span className="text-rose font-semibold">Sealed 💝</span>
                </div>
                <p className="font-hand text-lg text-ink/90 leading-relaxed bg-[#FCFAF5] p-3 rounded-lg border border-[#E6DFD3]">
                  "{r.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 2: HOME CMS
   ========================================== */
function TabHome({ data }: { data: any }) {
  const [eyebrow, setEyebrow] = useState(data.home.eyebrow || "");
  const [title, setTitle] = useState(data.home.title || "");
  const [subtitle, setSubtitle] = useState(data.home.subtitle || "");
  const [buttonText, setButtonText] = useState(data.home.buttonText || "");
  const [heroImage, setHeroImage] = useState(data.home.heroImage || "");
  const [finalImage, setFinalImage] = useState(data.home.finalImage || "");
  const [finalMessage, setFinalMessage] = useState(data.home.finalMessage || "");
  const [finalSignature, setFinalSignature] = useState(data.home.finalSignature || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await set(ref(database, "home"), {
        eyebrow,
        title,
        subtitle,
        buttonText,
        heroImage,
        finalImage,
        finalMessage,
        finalSignature
      });
      toast.success("Home page details updated!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Home Section CMS</h1>
        <p className="text-sm text-muted-foreground">Manage headings, banner copy, buttons, and closing footer layouts.</p>
      </div>

      <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-5">
        <h3 className="font-display text-rose border-b border-border pb-2">1. Hero Splash Screen</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eyebrow (Small Heading)</label>
            <input 
              type="text" 
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Title Heading</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subtitle Quote</label>
          <input 
            type="text" 
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CTA Button Text</label>
            <input 
              type="text" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hero Image Filename/URL</label>
            <input 
              type="text" 
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="brother-hero.png"
            />
          </div>
        </div>

        <h3 className="font-display text-rose border-b border-border pb-2 pt-4">2. Climax Footer</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Final Footer Photo URL</label>
            <input 
              type="text" 
              value={finalImage}
              onChange={(e) => setFinalImage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="final-photo.png"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Closing Message Text</label>
            <input 
              type="text" 
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="Until the next Rakhi we celebrate together…"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Signature (Accepts Newlines)</label>
          <textarea 
            value={finalSignature}
            onChange={(e) => setFinalSignature(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            placeholder="Lots of Love,&#10;Your Sister ❤️"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm tracking-wider uppercase hover:bg-rose active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   TAB 3: MEMORIES CMS
   ========================================== */
function TabMemories({ data, presetName }: { data: any; presetName: string }) {
  const memoriesList = data.memories || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState("");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");
  const [imgClassName, setImgClassName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEdit = (m: any) => {
    setEditingId(m.id || null);
    setFile(m.file || "");
    setLabel(m.label || "");
    setCaption(m.caption || "");
    setImgClassName(m.imgClassName || "");
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFile("");
    setLabel("");
    setCaption("");
    setImgClassName("");
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find matching item or create new
      const list = [...memoriesList];
      const newItem = {
        id: editingId || "mem_" + Date.now(),
        file,
        label,
        caption,
        imgClassName
      };

      if (editingId) {
        const idx = list.findIndex(m => m.id === editingId);
        if (idx !== -1) list[idx] = newItem;
      } else {
        list.push(newItem);
      }

      await set(ref(database, "memories"), list);
      toast.success(editingId ? "Memory card updated!" : "New memory card added!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to save memory.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      const list = [...memoriesList];
      list.splice(index, 1);
      await set(ref(database, "memories"), list);
      toast.success("Memory card deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete memory.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(uploadFile, presetName, (p) => setProgress(p));
      setFile(res.secure_url);
      
      // Also register in central Media Library list
      const mediaRef = ref(database, "media");
      const newFileRef = push(mediaRef);
      await set(newFileRef, {
        url: res.secure_url,
        publicId: res.public_id,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now()
      });

      toast.success("Media uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-rose">Memories Album CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete Polaroid photo cards in the memories grid.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-rose active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Polaroid Card</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
          <h3 className="font-display text-rose border-b border-border pb-2">
            {editingId ? "Edit Memory Polaroid" : "Create New Polaroid Card"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Title/Label (e.g. Childhood Memory)</label>
              <input 
                type="text" 
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Position Tuning CSS (e.g. object-top)</label>
              <input 
                type="text" 
                value={imgClassName}
                onChange={(e) => setImgClassName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="object-top, object-[center_10%], or empty"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Caption Note</label>
            <textarea 
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="Write a sweet description for this memory..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Photo URL / File Name</label>
              <input 
                type="text" 
                required
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="https://res.cloudinary.com/... or memory-01.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer bg-[#FCFAF5] hover:bg-[#E6DFD3]/20 border border-[#E6DFD3] p-2.5 rounded-lg text-center text-sm">
                <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                  <Upload className="w-4 h-4 text-rose" />
                  {uploading ? `Uploading ${progress}%` : "Direct Upload to Cloudinary"}
                </span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase hover:bg-rose flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Polaroid</span>
            </button>
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="px-5 py-2.5 border border-dashed border-[#E6DFD3] text-muted-foreground rounded-lg text-xs font-bold uppercase hover:bg-[#FCFAF5] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid of existing memories */}
      <div className="grid gap-4 sm:grid-cols-2">
        {memoriesList.map((m: any, index: number) => (
          <div key={m.id || index} className="bg-paper p-4 border border-[#E6DFD3] shadow-soft rounded-xl flex gap-4">
            <div className="w-24 h-24 shrink-0 bg-[#FCFAF5] rounded-lg overflow-hidden border border-[#E6DFD3] relative">
              {m.file && (
                <img 
                  src={m.file.startsWith("http") ? m.file : `/src/assets/${m.file}`} 
                  alt="" 
                  className={`w-full h-full object-cover ${m.imgClassName || ""}`}
                  onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1590076247564-a29d582985f3?w=300"; }}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose/70 tracking-widest block mb-0.5">#{index + 1} {m.label}</span>
                <p className="text-sm font-semibold truncate text-foreground">{m.caption}</p>
              </div>
              <div className="flex gap-1 pt-2">
                <button 
                  onClick={() => startEdit(m)}
                  className="p-2 hover:bg-rose/10 text-rose rounded-lg transition-colors cursor-pointer"
                  title="Edit Memory"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(index)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Memory"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 4: OUR BOND CMS
   ========================================== */
function TabOurBond({ data }: { data: any }) {
  const [eyebrow, setEyebrow] = useState(data.ourBond.eyebrow || "");
  const [title, setTitle] = useState(data.ourBond.title || "");
  const [point1, setPoint1] = useState(data.ourBond.point1 || "");
  const [point2, setPoint2] = useState(data.ourBond.point2 || "");
  const [subtitle, setSubtitle] = useState(data.ourBond.subtitle || "");
  const [things, setThings] = useState<any[]>(data.ourBond.things || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await set(ref(database, "ourBond"), {
        eyebrow,
        title,
        point1,
        point2,
        subtitle,
        things
      });
      toast.success("Our Bond details updated!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleThingChange = (idx: number, field: "title" | "note", val: string) => {
    const list = [...things];
    list[idx] = { ...list[idx], [field]: val };
    setThings(list);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Our Sibling Bond CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the travel map cities, banners, and the "Things I Love" card list.</p>
      </div>

      <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-6">
        <h3 className="font-display text-rose border-b border-border pb-2">1. Two Cities Map Banners</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eyebrow (e.g. Two cities, one thread)</label>
            <input 
              type="text" 
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Heading</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Left City Point Name (e.g. Me / Sister)</label>
            <input 
              type="text" 
              value={point1}
              onChange={(e) => setPoint1(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Right City Point Name (e.g. Annayyya)</label>
            <input 
              type="text" 
              value={point2}
              onChange={(e) => setPoint2(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Footer Quote</label>
          <input 
            type="text" 
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>

        <h3 className="font-display text-rose border-b border-border pb-2 pt-4">2. Things I Love About You Cards</h3>
        <div className="space-y-4">
          {things.map((t, idx) => (
            <div key={idx} className="p-4 bg-[#FCFAF5] rounded-lg border border-[#E6DFD3] space-y-3">
              <span className="text-xs font-mono text-gold font-bold">CARD 0{idx + 1}</span>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Card Title</label>
                <input 
                  type="text" 
                  value={t.title}
                  onChange={(e) => handleThingChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#E6DFD3] bg-paper"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Card Description</label>
                <textarea 
                  value={t.note}
                  onChange={(e) => handleThingChange(idx, "note", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-[#E6DFD3] bg-paper"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm tracking-wider uppercase hover:bg-rose active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   TAB 5: SURPRISE CMS
   ========================================== */
function TabSurprise({ data }: { data: any }) {
  const [eyebrow, setEyebrow] = useState(data.surprise.eyebrow || "");
  const [title, setTitle] = useState(data.surprise.title || "");
  const [buttonText, setButtonText] = useState(data.surprise.buttonText || "");
  const [message, setMessage] = useState(data.surprise.message || "");
  const [heading, setHeading] = useState(data.surprise.heading || "");
  const [signature, setSignature] = useState(data.surprise.signature || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await set(ref(database, "surprise"), {
        eyebrow,
        title,
        buttonText,
        message,
        heading,
        signature
      });
      toast.success("Surprise Box details updated!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Surprise Box CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the emotional surprise button, message content, and final greeting banner.</p>
      </div>

      <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eyebrow (Small Heading)</label>
            <input 
              type="text" 
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Heading Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Open Button CTA Text</label>
            <input 
              type="text" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revealed Sub-Signature (e.g. Jaanu 🌸)</label>
            <input 
              type="text" 
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revealed Climax Heading (e.g. Happy Rakhi, Annayyya ❤️)</label>
          <input 
            type="text" 
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revealed Surprise Message Description</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            placeholder="Write the paragraph to show when they click open..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm tracking-wider uppercase hover:bg-rose active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   TAB 6: RAKHI CMS
   ========================================== */
function TabRakhi({ data }: { data: any }) {
  const [eyebrow, setEyebrow] = useState(data.rakhi.eyebrow || "");
  const [title, setTitle] = useState(data.rakhi.title || "");
  const [messageUntied, setMessageUntied] = useState(data.rakhi.messageUntied || "");
  const [messageTied, setMessageTied] = useState(data.rakhi.messageTied || "");
  const [buttonText, setButtonText] = useState(data.rakhi.buttonText || "");
  const [buttonTiedText, setButtonTiedText] = useState(data.rakhi.buttonTiedText || "");
  const [greeting, setGreeting] = useState(data.rakhi.greeting || "");
  const [signature, setSignature] = useState(data.rakhi.signature || "");
  const [avatarSister, setAvatarSister] = useState(data.rakhi.avatarSister || "");
  const [avatarBrother, setAvatarBrother] = useState(data.rakhi.avatarBrother || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await set(ref(database, "rakhi"), {
        eyebrow,
        title,
        messageUntied,
        messageTied,
        buttonText,
        buttonTiedText,
        greeting,
        signature,
        avatarSister,
        avatarBrother
      });
      toast.success("Virtual Rakhi details updated!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Virtual Rakhi CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage interactive Rakhi ceremony greetings, messages, and avatar labels.</p>
      </div>

      <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-6">
        <h3 className="font-display text-rose border-b border-border pb-2">1. Page Titles & Avatars</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eyebrow (Small Heading)</label>
            <input 
              type="text" 
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ceremony Main Heading</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sister Label (Avatar Floor)</label>
            <input 
              type="text" 
              value={avatarSister}
              onChange={(e) => setAvatarSister(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Brother Label (Avatar Floor)</label>
            <input 
              type="text" 
              value={avatarBrother}
              onChange={(e) => setAvatarBrother(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>

        <h3 className="font-display text-rose border-b border-border pb-2 pt-4">2. Interactive Message Card States</h3>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Untied Message Text</label>
          <textarea 
            value={messageUntied}
            onChange={(e) => setMessageUntied(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tied Message Text</label>
          <textarea 
            value={messageTied}
            onChange={(e) => setMessageTied(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Button Text: Tie Ceremony (Untied State)</label>
            <input 
              type="text" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Button Text: Tie Again (Tied State)</label>
            <input 
              type="text" 
              value={buttonTiedText}
              onChange={(e) => setButtonTiedText(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>

        <h3 className="font-display text-rose border-b border-border pb-2 pt-4">3. Bottom Card Greeting</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Greeting Title Text</label>
            <input 
              type="text" 
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ceremony Signature Text (e.g. Jaanu, your little sister 🌸)</label>
            <input 
              type="text" 
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm tracking-wider uppercase hover:bg-rose active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   TAB 7: TIMELINE CMS
   ========================================== */
function TabTimeline({ data, presetName }: { data: any; presetName: string }) {
  const timelineList = data.timeline || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [era, setEra] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState("");
  const [label, setLabel] = useState("");
  const [imgClassName, setImgClassName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEdit = (m: any) => {
    setEditingId(m.id || null);
    setEra(m.era || "");
    setTitle(m.title || "");
    setNote(m.note || "");
    setFile(m.file || "");
    setLabel(m.label || "");
    setImgClassName(m.imgClassName || "");
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEra("");
    setTitle("");
    setNote("");
    setFile("");
    setLabel("");
    setImgClassName("");
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const list = [...timelineList];
      const newItem = {
        id: editingId || "time_" + Date.now(),
        era,
        title,
        note,
        file,
        label,
        imgClassName
      };

      if (editingId) {
        const idx = list.findIndex(t => t.id === editingId);
        if (idx !== -1) list[idx] = newItem;
      } else {
        list.push(newItem);
      }

      await set(ref(database, "timeline"), list);
      toast.success(editingId ? "Timeline milestone updated!" : "New milestone added!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to save milestone.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this timeline entry?")) return;
    try {
      const list = [...timelineList];
      list.splice(index, 1);
      await set(ref(database, "timeline"), list);
      toast.success("Milestone deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete milestone.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(uploadFile, presetName, (p) => setProgress(p));
      setFile(res.secure_url);
      
      // Also register in central Media Library list
      const mediaRef = ref(database, "media");
      const newFileRef = push(mediaRef);
      await set(newFileRef, {
        url: res.secure_url,
        publicId: res.public_id,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now()
      });

      toast.success("Media uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-rose">Story Timeline CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage chronological events, details, photos, and date eras in your story timeline.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-rose active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
          <h3 className="font-display text-rose border-b border-border pb-2">
            {editingId ? "Edit Milestone Entry" : "Create New Milestone Entry"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Era / Period (e.g. School Years)</label>
              <input 
                type="text" 
                required
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Title Heading (e.g. You always had my back)</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fallback Photo Label (e.g. Us as kids)</label>
              <input 
                type="text" 
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Img Tuning CSS (e.g. object-center)</label>
              <input 
                type="text" 
                value={imgClassName}
                onChange={(e) => setImgClassName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="object-center, object-top, or empty"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Milestone Description Story</label>
            <textarea 
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Milestone Image URL / File Name</label>
              <input 
                type="text" 
                required
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="https://res.cloudinary.com/... or timeline-01.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer bg-[#FCFAF5] hover:bg-[#E6DFD3]/20 border border-[#E6DFD3] p-2.5 rounded-lg text-center text-sm">
                <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                  <Upload className="w-4 h-4 text-rose" />
                  {uploading ? `Uploading ${progress}%` : "Direct Upload to Cloudinary"}
                </span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase hover:bg-rose flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Milestone</span>
            </button>
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="px-5 py-2.5 border border-dashed border-[#E6DFD3] text-muted-foreground rounded-lg text-xs font-bold uppercase hover:bg-[#FCFAF5] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Timeline listing */}
      <div className="space-y-4">
        {timelineList.map((m: any, index: number) => (
          <div key={m.id || index} className="bg-paper p-5 border border-[#E6DFD3] shadow-soft rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-[#FCFAF5] rounded-lg overflow-hidden border border-[#E6DFD3] relative shrink-0">
                {m.file && (
                  <img 
                    src={m.file.startsWith("http") ? m.file : `/src/assets/${m.file}`} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1590076247564-a29d582985f3?w=300"; }}
                  />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-rose/70 font-semibold tracking-widest">{m.era}</span>
                <h4 className="text-base font-bold leading-tight mt-0.5">{m.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1 max-w-lg">{m.note}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0 self-end sm:self-center">
              <button 
                onClick={() => startEdit(m)}
                className="p-2 hover:bg-rose/10 text-rose rounded-lg transition-colors cursor-pointer"
                title="Edit Milestone"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(index)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                title="Delete Milestone"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 8: HANDWRITTEN LETTER CMS
   ========================================== */
function TabLetter({ data }: { data: any }) {
  const [eyebrow, setEyebrow] = useState(data.letter.eyebrow || "");
  const [title, setTitle] = useState(data.letter.title || "");
  const [paragraphs, setParagraphs] = useState<string[]>(data.letter.paragraphs || []);
  const [signature, setSignature] = useState(data.letter.signature || "");
  const [editingText, setEditingText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Formats paragraphs into a single text block separated by double linebreaks for the textarea editor
    setEditingText(paragraphs.join("\n\n"));
  }, [paragraphs]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Split text box paragraphs back into clean string arrays
    const formattedParagraphs = editingText
      .split("\n\n")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    try {
      await set(ref(database, "letter"), {
        eyebrow,
        title,
        paragraphs: formattedParagraphs,
        signature
      });
      setParagraphs(formattedParagraphs);
      toast.success("Letter content updated!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Handwritten Letter CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage paragraph layouts, headlines, and signature details of your handwritten sister letter.</p>
      </div>

      <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eyebrow (Small Heading)</label>
            <input 
              type="text" 
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Letter Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Letter Signature (e.g. Forever your little sister, Jaanu ❤️)</label>
          <input 
            type="text" 
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Letter Body Paragraphs (Leave a blank line between paragraphs)
          </label>
          <textarea 
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 text-base font-hand rounded-lg border border-[#E6DFD3] bg-[#FCFAF5] leading-relaxed text-ink"
            placeholder="Dearest Annayyya,&#10;&#10;I don't know if I've ever said all of this out loud..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm tracking-wider uppercase hover:bg-rose active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   TAB 9: GALLERY CMS
   ========================================== */
function TabGallery({ data, presetName }: { data: any; presetName: string }) {
  const galleryList = data.gallery || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState("");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");
  const [imgClassName, setImgClassName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEdit = (m: any) => {
    setEditingId(m.id || null);
    setFile(m.file || "");
    setLabel(m.label || "");
    setCaption(m.caption || "");
    setImgClassName(m.imgClassName || "");
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFile("");
    setLabel("");
    setCaption("");
    setImgClassName("");
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const list = [...galleryList];
      const newItem = {
        id: editingId || "gal_" + Date.now(),
        file,
        label,
        caption,
        imgClassName
      };

      if (editingId) {
        const idx = list.findIndex(g => g.id === editingId);
        if (idx !== -1) list[idx] = newItem;
      } else {
        list.push(newItem);
      }

      await set(ref(database, "gallery"), list);
      toast.success(editingId ? "Gallery photo updated!" : "New photo added to Gallery!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to save photo.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this photo from the Gallery?")) return;
    try {
      const list = [...galleryList];
      list.splice(index, 1);
      await set(ref(database, "gallery"), list);
      toast.success("Photo deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete photo.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(uploadFile, presetName, (p) => setProgress(p));
      setFile(res.secure_url);
      
      // Also register in central Media Library list
      const mediaRef = ref(database, "media");
      const newFileRef = push(mediaRef);
      await set(newFileRef, {
        url: res.secure_url,
        publicId: res.public_id,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now()
      });

      toast.success("Media uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-rose">The Gallery CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage photos, categories, descriptions, and grid layout ordering in your scrapbook gallery.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-rose active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
          <h3 className="font-display text-rose border-b border-border pb-2">
            {editingId ? "Edit Gallery Photo Details" : "Add Photo to Gallery"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Label Category (e.g. Childhood Memory)</label>
              <input 
                type="text" 
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Img Tuning CSS (e.g. object-top)</label>
              <input 
                type="text" 
                value={imgClassName}
                onChange={(e) => setImgClassName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="object-top, object-center, or empty"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Caption Note</label>
            <input 
              type="text" 
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="e.g. Us laughing in Vizag Zoo Park"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Photo URL / File Name</label>
              <input 
                type="text" 
                required
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="https://res.cloudinary.com/... or timeline-01.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer bg-[#FCFAF5] hover:bg-[#E6DFD3]/20 border border-[#E6DFD3] p-2.5 rounded-lg text-center text-sm">
                <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                  <Upload className="w-4 h-4 text-rose" />
                  {uploading ? `Uploading ${progress}%` : "Direct Upload to Cloudinary"}
                </span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase hover:bg-rose flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Photo</span>
            </button>
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="px-5 py-2.5 border border-dashed border-[#E6DFD3] text-muted-foreground rounded-lg text-xs font-bold uppercase hover:bg-[#FCFAF5] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid of gallery assets */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {galleryList.map((m: any, index: number) => (
          <div key={m.id || index} className="bg-paper p-3 border border-[#E6DFD3] shadow-soft rounded-xl flex flex-col justify-between">
            <div className="aspect-[4/5] bg-[#FCFAF5] rounded-lg overflow-hidden border border-[#E6DFD3] relative">
              {m.file && (
                <img 
                  src={m.file.startsWith("http") ? m.file : `/src/assets/${m.file}`} 
                  alt="" 
                  className={`w-full h-full object-cover ${m.imgClassName || ""}`}
                  onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1590076247564-a29d582985f3?w=300"; }}
                />
              )}
            </div>
            <div className="pt-2.5">
              <span className="text-[9px] font-mono uppercase text-rose/70 font-semibold tracking-wider block mb-0.5">{m.label}</span>
              <p className="text-xs font-semibold text-foreground truncate">{m.caption}</p>
              <div className="flex gap-1 mt-3 pt-2 border-t border-border">
                <button 
                  onClick={() => startEdit(m)}
                  className="p-1.5 hover:bg-rose/10 text-rose rounded-md transition-colors cursor-pointer"
                  title="Edit Photo Info"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(index)}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 10: WISHES CMS
   ========================================== */
function TabWishes({ data }: { data: any }) {
  const wishesList = data.wishes || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [kind, setKind] = useState<"wish" | "promise">("wish");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (m: any) => {
    setEditingId(m.id || null);
    setKind(m.kind || "wish");
    setTitle(m.title || "");
    setNote(m.note || "");
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setKind("wish");
    setTitle("");
    setNote("");
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const list = [...wishesList];
      const newItem = {
        id: editingId || "wish_" + Date.now(),
        kind,
        title,
        note
      };

      if (editingId) {
        const idx = list.findIndex(w => w.id === editingId);
        if (idx !== -1) list[idx] = newItem;
      } else {
        list.push(newItem);
      }

      await set(ref(database, "wishes"), list);
      toast.success(editingId ? "Card updated!" : "New card added!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to save card.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this wish/promise card?")) return;
    try {
      const list = [...wishesList];
      list.splice(index, 1);
      await set(ref(database, "wishes"), list);
      toast.success("Card deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete card.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-rose">Wishes & Promises CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the emotional cards detailing sister's promises and prayers.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-rose active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Promise/Wish Card</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
          <h3 className="font-display text-rose border-b border-border pb-2">
            {editingId ? "Edit Wish/Promise Card" : "Add New Wish/Promise Card"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Card Category Type</label>
              <select 
                value={kind}
                onChange={(e) => setKind(e.target.value as "wish" | "promise")}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              >
                <option value="wish">Wish (Sister's Prayer for Brother)</option>
                <option value="promise">Promise (Sister's Commitment to Brother)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Card Title (e.g. For your dreams)</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Message Note</label>
            <textarea 
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="Write the prayer or promise message..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase hover:bg-rose flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Card</span>
            </button>
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="px-5 py-2.5 border border-dashed border-[#E6DFD3] text-muted-foreground rounded-lg text-xs font-bold uppercase hover:bg-[#FCFAF5] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Listing wishes */}
      <div className="grid gap-4 sm:grid-cols-2">
        {wishesList.map((m: any, index: number) => (
          <div key={m.id || index} className="bg-paper p-5 border border-[#E6DFD3] shadow-soft rounded-xl flex flex-col justify-between">
            <div>
              <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                m.kind === "wish" ? "bg-amber-100 text-amber-700" : "bg-rose/10 text-rose"
              }`}>
                {m.kind}
              </span>
              <h4 className="text-base font-bold mt-2.5">{m.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{m.note}</p>
            </div>
            <div className="flex gap-1 mt-4 pt-2.5 border-t border-border">
              <button 
                onClick={() => startEdit(m)}
                className="p-1.5 hover:bg-rose/10 text-rose rounded-md transition-colors cursor-pointer"
                title="Edit Card"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(index)}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors cursor-pointer"
                title="Delete Card"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 11: SONGS CMS
   ========================================== */
function TabSongs({ data, presetName }: { data: any; presetName: string }) {
  const songsList = data.songs || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEdit = (m: any) => {
    setEditingId(m.id || null);
    setTitle(m.title || "");
    setArtist(m.artist || "");
    setAudioUrl(m.audioUrl || "");
    setLyrics(m.lyrics || "");
    setFeatured(m.featured || false);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setAudioUrl("");
    setLyrics("");
    setFeatured(false);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let list = [...songsList];
      
      // If setting this song as featured, untoggle other featured flags
      if (featured) {
        list = list.map(s => ({ ...s, featured: false }));
      }

      const newItem = {
        id: editingId || "song_" + Date.now(),
        title,
        artist,
        audioUrl,
        lyrics,
        featured
      };

      if (editingId) {
        const idx = list.findIndex(s => s.id === editingId);
        if (idx !== -1) list[idx] = newItem;
      } else {
        list.push(newItem);
      }

      await set(ref(database, "songs"), list);
      toast.success(editingId ? "Song updated successfully!" : "New song dedicated to playlist!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to save song.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    try {
      const list = [...songsList];
      list.splice(index, 1);
      await set(ref(database, "songs"), list);
      toast.success("Song removed from playlist.");
    } catch (err) {
      toast.error("Failed to delete song.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(uploadFile, presetName, (p) => setProgress(p));
      setAudioUrl(res.secure_url);
      
      // Also register in central Media Library list
      const mediaRef = ref(database, "media");
      const newFileRef = push(mediaRef);
      await set(newFileRef, {
        url: res.secure_url,
        publicId: res.public_id,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now()
      });

      toast.success("Audio/Video file uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-rose">Dedicated Playlist CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage audio tracks, dedicated videos, and overlay lyrics in the public player.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-rose active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dedication Song</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
          <h3 className="font-display text-rose border-b border-border pb-2">
            {editingId ? "Edit Dedicated Song" : "Dedicate New Song"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Song Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Artist / Language Info (e.g. Jigra (Telugu))</label>
              <input 
                type="text" 
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lyrics / Overlay Note Display</label>
            <textarea 
              required
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
              placeholder="E.g. Wherever you are, I'll always be your sister..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Audio/Video URL or Local File Path</label>
              <input 
                type="text" 
                required
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E6DFD3] bg-[#FCFAF5]"
                placeholder="https://res.cloudinary.com/... or /nenu-thodu-undana.mp4"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer bg-[#FCFAF5] hover:bg-[#E6DFD3]/20 border border-[#E6DFD3] p-2.5 rounded-lg text-center text-sm">
                <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                  <Upload className="w-4 h-4 text-rose" />
                  {uploading ? `Uploading ${progress}%` : "Direct Upload to Cloudinary"}
                </span>
                <input 
                  type="file" 
                  accept="audio/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input 
              type="checkbox" 
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-rose focus:ring-rose"
            />
            <label htmlFor="featured" className="text-xs font-semibold uppercase text-muted-foreground select-none cursor-pointer">
              Set as Active Featured Song (Plays in public player widget)
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase hover:bg-rose flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Song</span>
            </button>
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="px-5 py-2.5 border border-dashed border-[#E6DFD3] text-muted-foreground rounded-lg text-xs font-bold uppercase hover:bg-[#FCFAF5] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Playlist Grid */}
      <div className="space-y-4">
        {songsList.map((m: any, index: number) => (
          <div key={m.id || index} className="bg-paper p-5 border border-[#E6DFD3] shadow-soft rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm ${
                m.featured ? "bg-rose text-white border-rose animate-pulse" : "bg-[#FCFAF5] border-border text-muted-foreground"
              }`}>
                <Music className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-base font-bold leading-tight flex items-center gap-2">
                  <span>{m.title}</span>
                  {m.featured && (
                    <span className="text-[8px] font-mono uppercase bg-rose/10 text-rose font-bold px-1.5 py-0.5 rounded-full">Active</span>
                  )}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{m.artist} • {m.audioUrl}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button 
                onClick={() => startEdit(m)}
                className="p-2 hover:bg-rose/10 text-rose rounded-lg transition-colors cursor-pointer"
                title="Edit Song"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(index)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                title="Delete Song"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 12: MEDIA LIBRARY (CLOUDINARY)
   ========================================== */
function TabMedia({ data, presetName, setPresetName }: { data: any; presetName: string; setPresetName: (n: string) => void }) {
  const mediaList = Object.entries(data.media || {}).map(([id, val]: [string, any]) => ({ id, ...val }));
  const sortedMedia = mediaList.sort((a, b) => b.uploadedAt - a.uploadedAt);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(uploadFile, presetName, (p) => setProgress(p));
      
      // Save metadata in Realtime Database under /media node
      const mediaRef = ref(database, "media");
      const newFileRef = push(mediaRef);
      await set(newFileRef, {
        url: res.secure_url,
        publicId: res.public_id,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        uploadedAt: Date.now()
      });

      toast.success("Media file uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this file from your selection library? (Note: Physical asset remains in Cloudinary dashboard).")) return;
    try {
      await remove(ref(database, `media/${id}`));
      toast.success("Item removed from dashboard list.");
    } catch (err) {
      toast.error("Failed to delete media.");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Media Library Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload photos/videos directly to Cloudinary and retrieve direct URLs for timeline, gallery, or home widgets.</p>
      </div>

      {/* Preset Config Bar */}
      <div className="bg-[#FCFAF5] p-4 rounded-xl border border-[#E6DFD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-rose shrink-0" />
          <p className="text-xs text-muted-foreground">
            Ensure signing preset in Cloudinary console is **Unsigned** so frontend uploads function.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Upload Preset</label>
          <input 
            type="text" 
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#E6DFD3] bg-paper w-32 focus:outline-none"
            placeholder="e.g. rakhi"
          />
        </div>
      </div>

      {/* Dropzone upload area */}
      <div className="relative">
        <label className="border-2 border-dashed border-[#E6DFD3] hover:border-rose/50 bg-paper hover:bg-[#FCFAF5] py-10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-rose/5 flex items-center justify-center text-rose">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Click to upload photo or video</p>
            <p className="text-xs text-muted-foreground mt-0.5">Direct client upload using preset "{presetName}"</p>
          </div>
          {uploading && (
            <div className="w-64 bg-[#FCFAF5] rounded-full h-2 overflow-hidden border border-border mt-1 relative">
              <div className="bg-rose h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* List items grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {sortedMedia.map((m) => (
          <div key={m.id} className="bg-paper p-3 border border-[#E6DFD3] shadow-soft rounded-xl flex flex-col justify-between">
            <div className="aspect-square bg-[#FCFAF5] rounded-lg overflow-hidden border border-[#E6DFD3] relative flex items-center justify-center">
              {m.type.startsWith("image") ? (
                <img 
                  src={m.url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={m.url} 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="pt-2">
              <p className="text-xs font-semibold text-foreground truncate" title={m.name}>{m.name}</p>
              <span className="text-[9px] font-mono text-muted-foreground block mt-0.5 truncate" title={m.url}>{m.url}</span>
              <div className="flex gap-1 mt-3.5 pt-2 border-t border-border">
                <button 
                  onClick={() => handleCopy(m.url)}
                  className="p-1.5 hover:bg-rose/10 text-rose rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy URL</span>
                </button>
                <button 
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors cursor-pointer ml-auto"
                  title="Remove Item"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   TAB 12: GLOBAL SETTINGS
   ========================================== */
function TabSettings({ data }: { data: any }) {
  const [seeding, setSeeding] = useState(false);

  const handleSeedDefaults = async () => {
    if (!window.confirm("Seed the database with defaults? (WARNING: This will replace current configurations in Firebase).")) return;
    setSeeding(true);
    try {
      const rootRef = ref(database);
      await set(rootRef, DEFAULT_DATA);
      toast.success("Database initialized with static defaults!");
    } catch (err) {
      toast.error("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-rose">Global Configuration Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage database reset capabilities and system-wide overrides.</p>
      </div>

      <div className="bg-paper p-6 rounded-xl border border-[#E6DFD3] shadow-soft space-y-4">
        <h3 className="font-display text-rose border-b border-border pb-2">Initialize Database</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If your Firebase Realtime Database is fresh or has been cleared, click the button below to initialize/seed it with all the default text copy and Polaroid image cards from the original static website layout.
        </p>
        <div className="pt-2">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-5 py-3 rounded-lg bg-rose hover:bg-[#801122] text-white font-bold text-xs tracking-wider uppercase shadow-soft flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{seeding ? "Initializing..." : "Reset/Seed with Static Defaults"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
