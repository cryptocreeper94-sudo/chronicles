import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Sparkles, Terminal, Code, Database, BrainCircuit, ArrowRight,
  Send, RefreshCw, Box, Copy, Check, ChevronLeft, Hexagon,
  Network
} from "lucide-react";
import { getChroniclesSession } from "./chronicles-login";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "lume";
  content: string;
  type?: "text" | "code_preview" | "asset_preview" | "lore_codex";
  payload?: any;
}

export default function ChroniclesLumeStudio() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activePreview, setActivePreview] = useState<Message | null>(null);

  useEffect(() => {
    const s = getChroniclesSession();
    if (!s) {
      setLocation("/login");
      return;
    }
    setSession(s);
    
    // Initial Lume Greeting
    setMessages([
      {
        id: Date.now().toString(),
        role: "lume",
        content: `Lume Intelligence Array Active. Welcome back, ${s.username}. Primary trait: [${s.primaryTrait || 'Unassigned'}]. How shall we shape the GRID today?`
      }
    ]);
  }, [setLocation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isSynthesizing) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsSynthesizing(true);
    
    // Mock Lume Response based on prompt keywords
    setTimeout(() => {
      const isCode = userMsg.content.toLowerCase().includes("script") || userMsg.content.toLowerCase().includes("mechanic");
      const isLore = userMsg.content.toLowerCase().includes("story") || userMsg.content.toLowerCase().includes("npc") || userMsg.content.toLowerCase().includes("lore");
      
      let lumeMsg: Message;
      
      if (isCode) {
        lumeMsg = {
          id: (Date.now() + 1).toString(),
          role: "lume",
          content: "Synthesis complete. I have generated the requested logic architecture. Review the parameters before committing to the World Grid.",
          type: "code_preview",
          payload: {
            title: "Dynamic NPC Encounter Script",
            code: "function triggerEncounter(playerFocus) {\\n  const anomaly = WorldGen.plotRift();\\n  if (playerFocus === 'builder') {\\n    anomaly.yield = 'Resource Cache';\\n  }\\n  return anomaly;\\n}"
          }
        };
      } else if (isLore) {
        lumeMsg = {
          id: (Date.now() + 1).toString(),
          role: "lume",
          content: "Narrative matrix aligned. Here is the requested temporal datalog.",
          type: "lore_codex",
          payload: {
            title: "The Merchant of Sector 4",
            text: "A shadowed figure dealing in fractured time crystals. They recall the Wild West era as vividly as the Cyberpunk neon, suggesting they are a chronos-diver."
          }
        };
      } else {
        lumeMsg = {
          id: (Date.now() + 1).toString(),
          role: "lume",
          content: "I have initialized a standard asset container. Specify if you need logic, lore, or 3D geometry.",
          type: "asset_preview",
          payload: {
            type: "Generic Entity Bound"
          }
        };
      }
      
      setMessages(prev => [...prev, lumeMsg]);
      setActivePreview(lumeMsg);
      setIsSynthesizing(false);
    }, 1800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const handleCommit = () => {
    // In a real app, this would post to /api/builder/contributions
    alert("Asset Submited to Builder Grid for Community Approval!");
    setActivePreview(null);
  };

  const traitColor = session?.primaryTrait === "leader" ? "from-yellow-500 to-amber-600" 
                   : session?.primaryTrait === "creator" ? "from-purple-500 to-pink-500"
                   : "from-cyan-500 to-blue-500";

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* LEFT PANEL: Lume Terminal */}
      <div className="w-[45%] flex flex-col border-r border-white/5 bg-black/40 relative z-10 backdrop-blur-xl shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/builder")} className="text-white/50 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-bold flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                Lume Core Terminal
              </h2>
              <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">ID: {session?.id?.substring(0,8) || "SYNC-ERR"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Node Online
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br " + traitColor + " text-white shadow-lg" 
                    : "bg-white/5 border border-white/10 text-white/90"
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-wider opacity-60">
                    {msg.role === "lume" ? <Sparkles className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                    {msg.role}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.payload && (
                    <button 
                      onClick={() => setActivePreview(msg)}
                      className="mt-3 w-full py-2 bg-black/40 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-black/60 transition-colors border border-white/5"
                    >
                      <ArrowRight className="w-3 h-3 text-cyan-400" /> View Synthesis
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {isSynthesizing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm text-white/60">Synthesizing parameters...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/40">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Prompt Lume to build an asset, lore, or logic..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
              disabled={isSynthesizing}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSynthesizing}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500/20 text-cyan-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-500/40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Synthesis Canvas */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-black flex flex-col">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Canvas Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white/90">Synthesis Canvas</h3>
          </div>
          <div className="flex gap-4">
            <div className="text-xs text-white/40 flex items-center gap-1"><Network className="w-3 h-3"/> GRID_STATE: VERIFIED</div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 p-8 overflow-y-auto relative z-10 flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {!activePreview ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                  <Box className="w-8 h-8 text-white/20" />
                </div>
                <h4 className="text-xl font-bold text-white/60 mb-2">Awaiting Parameters</h4>
                <p className="text-white/30 text-sm max-w-sm mx-auto">Use the Lume Terminal to generate code, assets, or global narrative logic.</p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    {activePreview.type === "code_preview" ? <Code className="w-5 h-5 text-amber-400" /> : <Database className="w-5 h-5 text-blue-400" />}
                    <span className="font-bold text-sm tracking-wide">{activePreview.payload.title || "Synthesized Output"}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(activePreview.payload.code || activePreview.payload.text || "")}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
                  >
                    {copiedData ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="p-6 min-h-[300px]">
                  {activePreview.type === "code_preview" && (
                    <pre className="text-sm font-mono text-cyan-300 bg-black/50 p-6 rounded-xl border border-white/5 overflow-x-auto">
                      <code>{activePreview.payload.code}</code>
                    </pre>
                  )}
                  {activePreview.type === "lore_codex" && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-lg leading-relaxed text-white/80 border-l-2 border-purple-500/50 pl-4 py-2 italic">
                        "{activePreview.payload.text}"
                      </p>
                    </div>
                  )}
                  {activePreview.type === "asset_preview" && (
                    <div className="h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/30 font-mono text-sm">
                      [ 3D Render Placeholder: {activePreview.payload.type} ]
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setActivePreview(null)}>
                    Discard
                  </Button>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0" onClick={handleCommit}>
                    Compile & Submit to Grid
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
