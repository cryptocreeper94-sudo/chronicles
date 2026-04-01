import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRightLeft, ShoppingBag } from "lucide-react";
import { economyEngine, BARTER_ITEMS, EconomyState } from "@/lib/economy/engine";
import { voiceEngine } from "@/lib/audio/voice-engine";

export function ChroniclesBarterModal({ characterId, characterName, characterEmoji, era, onClose }: {
  characterId: string;
  characterName: string;
  characterEmoji: string;
  era: string;
  onClose: () => void;
}) {
  const [economyState, setEconomyState] = useState<EconomyState>(economyEngine.getState());
  
  useEffect(() => {
    const handleUpdate = () => setEconomyState(economyEngine.getState());
    window.addEventListener("chronicles_economy_update", handleUpdate);
    return () => window.removeEventListener("chronicles_economy_update", handleUpdate);
  }, []);

  const handleBuy = (itemId: string, name: string) => {
    const success = economyEngine.barterItem(itemId, true, 1);
    if (success) {
      voiceEngine.speak(`A wise purchase. Enjoy your ${name}.`, characterId);
    } else {
      voiceEngine.speak(`You don't have enough shells for that.`, characterId);
    }
  };

  const handleSell = (itemId: string, name: string) => {
    const success = economyEngine.barterItem(itemId, false, 1);
    if (success) {
      voiceEngine.speak(`I'll take that ${name} off your hands.`, characterId);
    } else {
      voiceEngine.speak(`You don't have any ${name} to sell.`, characterId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
    >
      <GlassCard glow className="w-full max-w-md p-6 relative border-cyan-500/30">
        <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{characterEmoji}</div>
          <div>
            <h2 className="text-xl font-bold text-white">Trading with {characterName}</h2>
            <p className="text-xs text-gray-400">Secure Barter Network</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Your Wallet</span>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-400 text-sm">
            {economyState.shells} 🐚
          </Badge>
        </div>

        <h3 className="text-white text-sm font-semibold mb-3">Available Goods</h3>
        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
          {BARTER_ITEMS.map(item => {
            const ownedQty = economyState.inventory[item.id] || 0;
            return (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-black/30 p-2 rounded-md">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-yellow-500">{item.value} 🐚 per unit</p>
                    {ownedQty > 0 && <p className="text-[10px] text-cyan-400">You own: {ownedQty}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 px-2 text-xs border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => handleSell(item.id, item.name)}
                    disabled={ownedQty <= 0}
                  >
                    Sell
                  </Button>
                  <Button 
                    size="sm"
                    className="h-8 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white"
                    onClick={() => handleBuy(item.id, item.name)}
                    disabled={economyState.shells < item.value}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
