import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Headphones, 
  Cpu, 
  Zap, 
  BarChart3, 
  Share2, 
  Plus, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Play
} from 'lucide-react';
import { spotifyApi, SpotifyTrack } from './lib/spotify';
import { geminiService, PlaylistSuggestion } from './services/gemini';

// --- Components ---

const Logo = () => (
  <div className="relative w-8 h-8 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="6" y="12" width="2" height="6" rx="1" fill="url(#logo-grad)" />
      <rect x="10" y="10" width="2" height="10" rx="1" fill="url(#logo-grad)" />
      <rect x="14" y="11" width="2" height="8" rx="1" fill="url(#logo-grad)" />
      <rect x="18" y="13" width="2" height="4" rx="1" fill="url(#logo-grad)" />
      <defs>
        <linearGradient id="logo-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9d4edd" />
          <stop offset="1" stopColor="#1db954" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 bg-[#9d4edd]/20 blur-lg rounded-full -z-10"></div>
  </div>
);

const Navbar = ({ onLogin, isLoggedIn, onLogout }: { onLogin: () => void, isLoggedIn: boolean, onLogout: () => void }) => (
  <nav className="flex justify-between items-center py-4 md:py-6 border-b border-white/5 sticky top-0 bg-[#09090a]/80 backdrop-blur-md z-[100] px-[5%]">
    <div className="font-black text-xl tracking-tighter flex items-center gap-3">
      <Logo />
      <span className="hidden xs:inline">SpotifAI</span>
    </div>
    <div className="hidden lg:flex gap-8">
      <a href="#cosa-facciamo" className="text-[#888888] hover:text-white transition-colors text-sm font-medium">Cosa facciamo</a>
      <a href="#come-funziona" className="text-[#888888] hover:text-white transition-colors text-sm font-medium">Come funziona</a>
      <a href="#chi-siamo" className="text-[#888888] hover:text-white transition-colors text-sm font-medium">Chi siamo</a>
    </div>
    <div className="flex gap-4">
      {isLoggedIn ? (
        <button onClick={onLogout} className="px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all bg-transparent border border-white/10 hover:bg-white/5 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      ) : (
        <>
          <a href="#cosa-facciamo" className="hidden sm:inline-block px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all bg-transparent border border-white/10 hover:bg-white/5">
            Cosa facciamo?
          </a>
          <button onClick={onLogin} className="px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all bg-white text-black shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:opacity-90">
            Get Started →
          </button>
        </>
      )}
    </div>
  </nav>
);

const Hero = ({ onLogin }: { onLogin: () => void }) => (
  <main className="flex flex-col lg:flex-row items-center justify-between min-h-[90vh] px-[5%] md:px-[10%] relative overflow-hidden">
    <div className="max-w-[600px] z-10 py-12 md:py-20 text-center lg:text-left">
      <div className="inline-flex items-center gap-2.5 p-1 pr-3 rounded-full border border-white/10 bg-white/5 text-[0.7rem] md:text-[0.75rem] text-[#888888] mb-6 md:mb-8">
        <span className="bg-[#9d4edd]/20 text-[#9d4edd] px-2 py-0.5 rounded-full font-semibold text-[0.65rem] md:text-[0.7rem]">NEW</span>
        Modelli AI per playlist generativi aggiornati →
      </div>
      <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.06em] leading-[1.1] mb-4 bg-gradient-to-r from-white via-[#1db954] to-[#9d4edd] bg-[length:200%_auto] text-transparent bg-clip-text animate-shine">
        SpotifAI
      </h1>
      <h2 className="text-xl md:text-3xl font-medium tracking-tight mb-6 leading-[1.2]">
        La tua libreria musicale, curata dall'intelligenza artificiale.
      </h2>
      <p className="text-base md:text-lg text-[#888888] leading-relaxed mb-8 md:mb-10 max-w-[500px] mx-auto lg:mx-0">
        Ottimizza la tua esperienza di ascolto. SpotifAI è il motore più veloce per generare playlist perfette partendo da una semplice frase o emozione.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <button onClick={onLogin} className="px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-all bg-white text-black shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:opacity-90">
          Inizia Gratuitamente →
        </button>
        <a href="#cosa-facciamo" className="px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-all bg-transparent border border-white/10 hover:bg-white/5">
          Scopri di più
        </a>
      </div>
    </div>

    <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] flex justify-center items-center mt-12 lg:mt-0">
      <div className="absolute w-full h-full animate-[spin_50s_linear_infinite]">
        <svg className="absolute top-0 left-0 w-full h-full z-[1]" viewBox="0 0 500 500">
          <polygon points="122,97 375,72 475,222 400,400 222,450 72,350" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="250" y1="250" x2="122" y2="97" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
          <line x1="250" y1="250" x2="375" y2="72" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
          <line x1="250" y1="250" x2="475" y2="222" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
          <line x1="250" y1="250" x2="400" y2="400" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
          <line x1="250" y1="250" x2="222" y2="450" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
          <line x1="250" y1="250" x2="72" y2="350" stroke="rgba(157, 78, 221, 0.2)" strokeWidth="1"/>
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9d4edd]/50 w-[140px] h-[140px] border-dashed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1db954]/20 w-[280px] h-[280px]"></div>
        <div className="absolute w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,#fff_0%,#9d4edd_40%,transparent_70%)] rounded-full z-[3] shadow-[0_0_50px_#9d4edd,0_0_100px_#7b2cbf] animate-pulse"></div>
        
        <div className="absolute top-[270px] left-[260px] flex items-center gap-1.5 font-mono text-[0.65rem] color-[#1db954] tracking-widest z-[5] bg-black/70 px-2 py-1 rounded border border-[#1db954]/30">
          <div className="w-1.5 h-1.5 bg-[#1db954] rounded-full shadow-[0_0_10px_#1db954] animate-pulse"></div> AI CORE
        </div>

        {/* Nodes */}
        {[
          { pos: 'top-[97px] left-[122px]', icon: <Music className="w-5 h-5" /> },
          { pos: 'top-[72px] left-[375px]', icon: <Headphones className="w-5 h-5" /> },
          { pos: 'top-[222px] left-[475px]', icon: <Cpu className="w-5 h-5" /> },
          { pos: 'top-[400px] left-[400px]', icon: <Zap className="w-5 h-5" /> },
          { pos: 'top-[450px] left-[222px]', icon: <BarChart3 className="w-5 h-5" /> },
          { pos: 'top-[350px] left-[72px]', icon: <Share2 className="w-5 h-5" /> },
        ].map((node, i) => (
          <div key={i} className={`absolute w-12 h-12 rounded-full bg-[#0f0f0f]/80 border border-white/10 backdrop-blur-md z-[4] shadow-[inset_0_0_20px_rgba(255,255,255,0.02),0_0_15px_rgba(157,78,221,0.2)] -translate-x-1/2 -translate-y-1/2 ${node.pos}`}>
            <div className="w-full h-full flex justify-center items-center animate-[spin_50s_linear_infinite_reverse]">
              {node.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
);

const Features = () => (
  <section id="cosa-facciamo" className="py-32 px-[10%] relative overflow-hidden">
    <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(157,78,221,0.1)_0%,transparent_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 blur-[50px] pointer-events-none"></div>
    <div className="absolute top-[20%] left-[-10%] w-[80%] h-[100px] bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent blur-[50px] z-0 pointer-events-none opacity-60 rounded-full -rotate-15 animate-pulse"></div>

    <h2 className="text-5xl font-extrabold text-center mb-4 tracking-tight relative z-[2]">Cosa facciamo</h2>
    <p className="text-center text-[#888888] text-lg mb-16 max-w-[600px] mx-auto relative z-[2]">
      Trasformiamo le tue idee in onde sonore. Utilizziamo reti neurali avanzate per comprendere il tuo mood e costruire librerie musicali che non sapevi di desiderare.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-[2]">
      {[
        { 
          icon: <Plus />, 
          title: "Prompt to Playlist", 
          desc: "Scrivi semplicemente \"Musica per programmare di notte sotto la pioggia\" e lascia che la nostra AI analizzi e componga una playlist di 50 brani in 3 secondi.",
          color: "#9d4edd"
        },
        { 
          icon: <Share2 />, 
          title: "Integrazione Spotify", 
          desc: "Nessun copia e incolla. Connetti il tuo account Spotify e salva istantaneamente le playlist generate direttamente nel tuo profilo con copertine generate dall'AI.",
          color: "#1db954"
        },
        { 
          icon: <BarChart3 />, 
          title: "Analisi del Vibe", 
          desc: "L'AI non sceglie canzoni a caso, analizza i BPM, la tonalità e l'energia per creare transizioni fluide e un mood costante e immersivo.",
          color: "#9d4edd"
        }
      ].map((feat, i) => (
        <div key={i} className="group bg-[#141416]/60 border border-white/5 rounded-2xl p-10 backdrop-blur-md transition-all duration-400 hover:-translate-y-2 hover:border-[#9d4edd]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(157,78,221,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          <div className={`w-12 h-12 rounded-xl flex justify-center items-center mb-6 border border-white/10`} style={{ backgroundColor: `${feat.color}1a`, color: feat.color, borderColor: `${feat.color}33` }}>
            {feat.icon}
          </div>
          <h3 className="text-2xl font-semibold mb-4">{feat.title}</h3>
          <p className="text-[#888888] text-sm leading-relaxed">{feat.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="come-funziona" className="py-32 px-[10%] relative overflow-hidden">
    <div className="absolute top-[40%] right-[-20%] w-full h-[150px] bg-gradient-to-r from-transparent via-[#7b2cbf] to-transparent blur-[50px] z-0 pointer-events-none opacity-60 rounded-full rotate-25 animate-pulse delay-2000"></div>

    <h2 className="text-5xl font-extrabold text-center mb-4 tracking-tight relative z-[2]">Come funziona</h2>
    <p className="text-center text-[#888888] text-lg mb-16 max-w-[600px] mx-auto relative z-[2]">
      Tre semplici passi per passare dall'immaginazione all'ascolto in cuffia. Niente settaggi complicati.
    </p>

    <div className="flex flex-col gap-8 max-w-[800px] mx-auto relative z-[2]">
      <div className="absolute top-0 bottom-0 left-10 w-[2px] bg-gradient-to-b from-transparent via-[#1db954] to-[#9d4edd] opacity-30"></div>
      {[
        { num: 1, title: "Ispira l'AI", desc: "Usa la barra di ricerca per descrivere un'emozione, un'attività, un genere o anche la trama di un film. Più sei specifico, più la magia sarà accurata.", color: "#9d4edd" },
        { num: 2, title: "Elaborazione Neurale", desc: "Il nostro AI Core interroga milioni di tracce, calcolando affinità semantiche e sonore. Filtra artisti, bilancia i ritmi e costruisce la sequenza perfetta.", color: "#1db954" },
        { num: 3, title: "Ascolta e Salva", desc: "Premi play per ascoltare l'anteprima mixata. Soddisfatto? Clicca \"Esporta su Spotify\" e goditi il tuo nuovo viaggio sonoro.", color: "#9d4edd" }
      ].map((step, i) => (
        <div key={i} className="flex gap-8 items-start bg-white/2 p-8 rounded-2xl border border-white/5 backdrop-blur-[5px]">
          <div className={`w-20 h-20 shrink-0 rounded-full bg-[#09090a] border-2 flex justify-center items-center text-3xl font-black shadow-[0_0_20px_rgba(157,78,221,0.3)] z-[2]`} style={{ borderColor: step.color, boxShadow: `0 0 20px ${step.color}4d` }}>
            {step.num}
          </div>
          <div className="pt-2">
            <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
            <p className="text-[#888888] leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const About = () => (
  <section id="chi-siamo" className="py-32 px-[10%] relative overflow-hidden">
    <div className="absolute bottom-0 left-[10%] w-[90%] h-[80px] bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent blur-[50px] z-0 pointer-events-none opacity-60 rounded-full -rotate-5 animate-pulse delay-1000"></div>

    <h2 className="text-5xl font-extrabold text-center mb-12 tracking-tight relative z-[2]">Chi siamo</h2>
    
    <div className="text-center max-w-[800px] mx-auto p-16 bg-gradient-to-b from-[#141416]/80 to-[#9d4edd]/10 rounded-[24px] border border-[#9d4edd]/20 relative z-[2] backdrop-blur-md">
      <p className="text-xl font-light leading-[1.8]">
        Siamo un team di audiofili, ingegneri del machine learning e designer frustrati dal classico algoritmo di raccomandazione. <br/><br/>
        Crediamo che la musica debba essere una scoperta attiva, non passiva. SpotifAI è nato per restituire alle persone il potere di <span className="text-[#9d4edd] font-semibold">dirigere la propria colonna sonora</span>, unendo la vastità dei cataloghi musicali moderni con la potenza chirurgica dell'intelligenza artificiale linguistica.
      </p>
    </div>
  </section>
);

// --- Main App Component ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<PlaylistSuggestion | null>(null);
  const [foundTracks, setFoundTracks] = useState<SpotifyTrack[]>([]);
  const [searchingTrack, setSearchingTrack] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in cookies
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('spotify_access_token='));
    if (tokenCookie) {
      const t = tokenCookie.split('=')[1];
      setToken(t);
      setIsLoggedIn(true);
      fetchUserProfile(t);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        // Small delay to ensure cookies are propagated
        setTimeout(() => {
          const updatedCookies = document.cookie.split('; ');
          const newTokenCookie = updatedCookies.find(row => row.startsWith('spotify_access_token='));
          if (newTokenCookie) {
            const t = newTokenCookie.split('=')[1];
            setToken(t);
            setIsLoggedIn(true);
            fetchUserProfile(t);
          } else {
            // Fallback: try to fetch profile anyway if we think we are logged in
            setIsLoggedIn(true);
            // The server might have the token in a session or we can try to re-check
          }
        }, 500);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchUserProfile = async (t: string) => {
    try {
      const profile = await spotifyApi.getUserProfile(t);
      setUser(profile);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch profile', err);
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.error || '';
      if (errorMsg.includes('not registered')) {
        setError("Il tuo account non è abilitato per questa app. Aggiungi la tua email nella sezione 'User Management' della tua Spotify Developer Dashboard.");
      } else {
        setError("Sessione scaduta o errore di connessione con Spotify.");
        handleLogout();
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/url');
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      window.open(data.url, 'spotify_auth', 'width=600,height=800');
    } catch (err) {
      console.error('Login failed', err);
      setError("Impossibile avviare l'autenticazione. Controlla la console per i dettagli.");
    }
  };

  const handleLogout = () => {
    document.cookie = 'spotify_access_token=; Max-Age=0; path=/;';
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    setSuggestion(null);
    setFoundTracks([]);
  };

  const handleGenerate = async () => {
    if (!prompt || !token) return;
    setIsGenerating(true);
    setSaveSuccess(false);
    setError(null);
    setSuggestion(null);
    setFoundTracks([]);
    
    try {
      const res = await geminiService.generatePlaylistSuggestions(prompt);
      setSuggestion(res);
      
      // Search for tracks on Spotify (Agent Mode)
      const tracks: SpotifyTrack[] = [];
      for (const track of res.tracks) {
        setSearchingTrack(`${track.title} - ${track.artist}`);
        try {
          const results = await spotifyApi.searchTracks(`${track.title} ${track.artist}`, token);
          if (results.length > 0) {
            tracks.push(results[0]);
          }
        } catch (searchErr) {
          console.warn(`Failed to find track: ${track.title}`, searchErr);
        }
        // Small delay to make the agent feel "real"
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setSearchingTrack(null);
      if (tracks.length === 0) {
        setError("L'IA ha suggerito dei brani, ma non siamo riusciti a trovarli su Spotify. Prova con un prompt diverso.");
      } else {
        setFoundTracks(tracks);
      }
    } catch (err: any) {
      console.error('Generation failed', err);
      const errorMsg = err.response?.data?.error?.message || '';
      if (errorMsg.includes('not registered')) {
        setError("Il tuo account non è abilitato per questa app. Aggiungi la tua email nella sezione 'User Management' della tua Spotify Developer Dashboard.");
      } else {
        setError("C'è stato un errore durante la generazione della playlist. Riprova più tardi.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToSpotify = async () => {
    if (!suggestion || foundTracks.length === 0 || !token || !user) {
      setError("Impossibile salvare la playlist. Assicurati di aver generato dei brani e di essere connesso.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const playlist = await spotifyApi.createPlaylist(user.id, suggestion.name, suggestion.description, token);
      await spotifyApi.addTracksToPlaylist(playlist.id, foundTracks.map(t => t.uri), token);
      setSaveSuccess(true);
    } catch (err: any) {
      console.error('Saving failed', err);
      const errorMsg = err.response?.data?.error?.message || '';
      if (errorMsg.includes('not registered')) {
        setError("Il tuo account non è abilitato per questa app. Aggiungi la tua email nella sezione 'User Management' della tua Spotify Developer Dashboard.");
      } else {
        setError(`Errore durante il salvataggio su Spotify: ${err.message || 'Riprova.'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#09090a] text-white selection:bg-[#9d4edd] selection:text-white">
        <Navbar onLogin={handleLogin} isLoggedIn={false} onLogout={handleLogout} />
        <Hero onLogin={handleLogin} />
        <Features />
        <HowItWorks />
        <About />
        <footer className="py-12 border-t border-white/5 text-center text-[#888888] text-sm">
          <p>© 2026 SpotifAI. Built with AI for Music Lovers.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090a] text-white selection:bg-[#9d4edd] selection:text-white relative overflow-hidden">
      <Navbar onLogin={handleLogin} isLoggedIn={true} onLogout={handleLogout} />
      
      {/* Background Elements */}
      <div className="glow-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      <div className="blurred-line top-[10%] left-[-10%] w-[80%] h-[100px] -rotate-12"></div>
      <div className="blurred-line bottom-[10%] right-[-10%] w-[80%] h-[100px] rotate-12 bg-gradient-to-r from-transparent via-[#7b2cbf] to-transparent"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 md:p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <Zap className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-base md:text-lg mb-2">Attenzione: Errore di Configurazione</p>
                <p className="leading-relaxed mb-4 text-xs md:text-sm">{error}</p>
                
                {error.includes('403') && (
                  <div className="bg-black/40 p-3 md:p-4 rounded-xl border border-red-500/30 text-[10px] md:text-xs space-y-3">
                    <p className="font-semibold text-white uppercase tracking-wider">SOLUZIONE OBBLIGATORIA (ERRORE 403):</p>
                    <p className="text-red-300 font-medium">Spotify blocca l'accesso perché la tua email non è registrata come "Tester" nella dashboard sviluppatori.</p>
                    <ol className="list-decimal list-inside space-y-2 text-white/70">
                      <li>Vai su <a href="https://developer.spotify.com/dashboard" target="_blank" className="text-[#9d4edd] underline font-bold">Spotify Developer Dashboard</a></li>
                      <li>Apri la tua app e clicca su <strong>Settings</strong> (in alto a destra)</li>
                      <li>Vai nella sezione <strong>User Management</strong></li>
                      <li>Clicca su <strong>Add User</strong> e inserisci l'email: <code className="bg-white/10 px-1 rounded text-white break-all">{user?.email || 'filoama36@gmail.com'}</code></li>
                      <li>Salva e <strong>RIFAI IL LOGIN</strong> in questa app.</li>
                    </ol>
                  </div>
                )}
                
                {error.includes('SPOTIFY_CLIENT_ID') && (
                  <div className="bg-black/40 p-4 rounded-xl border border-red-500/30 text-xs space-y-3">
                    <p className="font-semibold text-white uppercase tracking-wider">Configura i Secrets:</p>
                    <p className="text-white/70">Assicurati di aver aggiunto <code>SPOTIFY_CLIENT_ID</code> e <code>SPOTIFY_CLIENT_SECRET</code> nel pannello <strong>Settings &gt; Secrets</strong> di AI Studio.</p>
                  </div>
                )}
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Chat/Input */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#141416]/60 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
              
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-[#9d4edd]" /> AI Playlist Generator
              </h2>
              <p className="text-[#888888] text-sm mb-6">
                Descrivi il mood, l'attività o il genere. L'AI creerà la selezione perfetta per te.
              </p>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Esempio: Una playlist synthwave per guidare di notte in una città futuristica..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#9d4edd]/50 transition-colors resize-none placeholder:text-white/20"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="absolute bottom-4 right-4 p-3 bg-[#9d4edd] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(157,78,221,0.4)]"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Lo-fi Study', 'Techno Workout', 'Rainy Jazz', 'Indie Roadtrip'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPrompt(`Una playlist ${tag.toLowerCase()}...`)}
                    className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {user && (
              <div className="bg-[#141416]/60 border border-white/5 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-xl">
                <img src={user.images?.[0]?.url || 'https://picsum.photos/seed/user/100/100'} alt={user.display_name} className="w-12 h-12 rounded-full border border-[#1db954] shadow-[0_0_15px_rgba(29,185,84,0.2)]" />
                <div>
                  <p className="text-xs text-[#888888] uppercase font-bold tracking-widest">Connesso come</p>
                  <p className="font-semibold">{user.display_name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!suggestion && !isGenerating ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Music className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-medium text-white/40 max-w-xs">Inizia a scrivere per generare la tua prima playlist con l'IA</h3>
                </motion.div>
              ) : isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-[#141416]/40 rounded-2xl border border-white/5 backdrop-blur-md"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-[#9d4edd]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#9d4edd] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-[#9d4edd] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analisi Neurale in corso...</h3>
                  <p className="text-[#888888] mb-4">Stiamo interrogando milioni di tracce per trovare il vibe perfetto.</p>
                  
                  {searchingTrack && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-[#9d4edd]"
                    >
                      <Loader2 className="w-3 h-3 animate-spin" />
                      AGENTE: Ricerca di "{searchingTrack}"...
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#141416]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl"
                >
                  <div className="p-8 border-b border-white/10 bg-gradient-to-br from-[#9d4edd]/20 to-transparent">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{suggestion?.name}</h2>
                        <p className="text-[#888888] text-sm max-w-md leading-relaxed">{suggestion?.description}</p>
                      </div>
                      <div className="bg-[#1db954]/20 text-[#1db954] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#1db954]/30 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
                        AI Generated
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={handleSaveToSpotify}
                        disabled={isSaving || saveSuccess || foundTracks.length === 0}
                        className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                          saveSuccess 
                            ? 'bg-[#1db954] text-white' 
                            : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                        }`}
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : saveSuccess ? (
                          <><CheckCircle2 className="w-5 h-5" /> Salvata su Spotify</>
                        ) : (
                          <><Plus className="w-5 h-5" /> Esporta su Spotify</>
                        )}
                      </button>
                      {saveSuccess && (
                        <a 
                          href="https://open.spotify.com/collection/playlists" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-black/20">
                    {foundTracks.map((track, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={track.id} 
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 text-center text-xs font-mono text-white/20 group-hover:text-[#9d4edd] transition-colors">
                          {(i + 1).toString().padStart(2, '0')}
                        </div>
                        <img src={track.album.images[0]?.url} alt={track.name} className="w-12 h-12 rounded-md shadow-lg border border-white/5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm group-hover:text-[#9d4edd] transition-colors">{track.name}</p>
                          <p className="text-xs text-[#888888] truncate">{track.artists.map(a => a.name).join(', ')}</p>
                        </div>
                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#1db954] hover:scale-110">
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
