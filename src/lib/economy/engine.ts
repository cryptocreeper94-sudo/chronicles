import { toast } from "@/hooks/use-toast";

const ECONOMY_STORAGE_KEY = "chronicles_economy_state";

export interface EstateProperty {
  id: string;
  name: string;
  era: "modern" | "wildwest" | "medieval";
  basePrice: number;
  currentValue: number;
  passiveYield: number; // Shells generated per tick
  icon: string;
  description: string;
}

export interface EconomyState {
  shells: number; // Local secondary currency
  ownedEstates: string[];
  lastTick: number;
  marketVolatility: number; // Current market modifier (-0.2 to +0.2)
  inventory: Record<string, number>; // itemId -> quantity
}

export const AVAILABLE_ESTATES: EstateProperty[] = [
  { id: "e_penthouse", name: "Neon Penthouse", era: "modern", basePrice: 5000, currentValue: 5000, passiveYield: 50, icon: "🏢", description: "A high-rise apartment overlooking the cyber-city." },
  { id: "e_club", name: "Underground Club", era: "modern", basePrice: 15000, currentValue: 15000, passiveYield: 200, icon: "🎵", description: "A popular hangout spot that generates steady income." },
  { id: "e_saloon", name: "Golden Nugget Saloon", era: "wildwest", basePrice: 2000, currentValue: 2000, passiveYield: 25, icon: "🍺", description: "The busiest watering hole on the frontier." },
  { id: "e_ranch", name: "Dusty Trails Ranch", era: "wildwest", basePrice: 8000, currentValue: 8000, passiveYield: 100, icon: "🐎", description: "A massive spread for breeding prize horses." },
  { id: "e_forge", name: "Master Blacksmith Forge", era: "medieval", basePrice: 3000, currentValue: 3000, passiveYield: 35, icon: "⚒️", description: "The only forge capable of crafting castle-grade steel." },
  { id: "e_keep", name: "Stonekeep Tower", era: "medieval", basePrice: 25000, currentValue: 25000, passiveYield: 400, icon: "🏰", description: "A fortified tower providing immense prestige and tax revenue." },
];

export const BARTER_ITEMS = [
  { id: "i_scrap", name: "Tech Scrap", value: 10, icon: "⚙️" },
  { id: "i_gold", name: "Gold Dust", value: 50, icon: "✨" },
  { id: "i_steel", name: "Refined Steel", value: 30, icon: "🗡️" }
];

class EconomyEngine {
  private state: EconomyState;

  constructor() {
    this.state = this.loadState();
    this.processOfflineTicks();
    
    // Setup market tick every 60 seconds
    setInterval(() => this.tick(), 60000);
  }

  private loadState(): EconomyState {
    const saved = localStorage.getItem(ECONOMY_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      shells: 1000, // Starter capital
      ownedEstates: [],
      lastTick: Date.now(),
      marketVolatility: 0,
      inventory: { "i_scrap": 5 }
    };
  }

  private saveState() {
    localStorage.setItem(ECONOMY_STORAGE_KEY, JSON.stringify(this.state));
    // Dispatch custom event for React components to re-render
    window.dispatchEvent(new Event("chronicles_economy_update"));
  }

  public getState() {
    return { ...this.state };
  }

  private processOfflineTicks() {
    const now = Date.now();
    const elapsedMinutes = Math.floor((now - this.state.lastTick) / 60000);
    
    if (elapsedMinutes > 0) {
      let earned = 0;
      this.state.ownedEstates.forEach(estateId => {
        const estate = AVAILABLE_ESTATES.find(e => e.id === estateId);
        if (estate) earned += estate.passiveYield * elapsedMinutes;
      });

      if (earned > 0) {
        this.state.shells += earned;
        console.log(`[Economy] Processed ${elapsedMinutes} offline ticks. Earned ${earned} Shells.`);
      }
      this.state.lastTick = now;
      this.saveState();
    }
  }

  private tick() {
    this.state.lastTick = Date.now();
    
    // Update market volatility (-20% to +20%)
    this.state.marketVolatility = (Math.random() * 0.4) - 0.2;

    // Process passive income
    let earned = 0;
    this.state.ownedEstates.forEach(estateId => {
      const estate = AVAILABLE_ESTATES.find(e => e.id === estateId);
      if (estate) earned += estate.passiveYield;
    });

    if (earned > 0) {
      this.state.shells += earned;
    }
    
    this.saveState();
  }

  public getMarketProperties(): EstateProperty[] {
    // Apply volatility to current values
    return AVAILABLE_ESTATES.map(estate => ({
      ...estate,
      currentValue: Math.floor(estate.basePrice * (1 + this.state.marketVolatility))
    }));
  }

  public purchaseEstate(estateId: string): boolean {
    const properties = this.getMarketProperties();
    const estate = properties.find(e => e.id === estateId);
    
    if (!estate) return false;
    
    if (this.state.ownedEstates.includes(estateId)) {
      toast({ title: "Already Owned", description: "You already own this estate.", variant: "destructive" });
      return false;
    }

    if (this.state.shells >= estate.currentValue) {
      this.state.shells -= estate.currentValue;
      this.state.ownedEstates.push(estateId);
      this.saveState();
      toast({ title: "Purchase Successful", description: `You are now the proud owner of ${estate.name}!` });
      return true;
    } else {
      toast({ title: "Insufficient Funds", description: `You need ${estate.currentValue} Shells to buy this.`, variant: "destructive" });
      return false;
    }
  }

  public sellEstate(estateId: string): boolean {
    const properties = this.getMarketProperties();
    const estate = properties.find(e => e.id === estateId);
    
    if (!estate) return false;
    
    const index = this.state.ownedEstates.indexOf(estateId);
    if (index > -1) {
      this.state.ownedEstates.splice(index, 1);
      this.state.shells += estate.currentValue;
      this.saveState();
      toast({ title: "Property Sold", description: `You sold ${estate.name} for ${estate.currentValue} Shells.` });
      return true;
    }
    return false;
  }

  public barterItem(itemId: string, buy: boolean, quantity: number = 1): boolean {
    const item = BARTER_ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    const totalValue = item.value * quantity;

    if (buy) {
      if (this.state.shells >= totalValue) {
        this.state.shells -= totalValue;
        this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + quantity;
        this.saveState();
        toast({ title: "Barter Successful", description: `Bought ${quantity}x ${item.name}` });
        return true;
      } else {
        toast({ title: "Not enough Shells", description: `Need ${totalValue} Shells.` });
        return false;
      }
    } else {
      const currentQty = this.state.inventory[itemId] || 0;
      if (currentQty >= quantity) {
        this.state.inventory[itemId] -= quantity;
        this.state.shells += totalValue;
        this.saveState();
        toast({ title: "Barter Successful", description: `Sold ${quantity}x ${item.name}` });
        return true;
      } else {
        toast({ title: "Not enough Items", description: `You only have ${currentQty}x ${item.name}.` });
        return false;
      }
    }
  }
}

export const economyEngine = new EconomyEngine();
