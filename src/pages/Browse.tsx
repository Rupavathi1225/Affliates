import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";

const Browse = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<string>("🔝 Top Offers");

  const networks = [
    "All", "1 Click Wonder", "1win Partners", "1xBet Partners", "1xBit Affiliate Program", 
    "1xSlot Partners", "249 Media", "2QL", "2x2 Media"
  ];

  const geos = [
    "Worldwide", "Afghanistan", "Aland Islands", "Albania", "Algeria", 
    "American Samoa", "Andorra"
  ];

  const verticals = [
    "Crypto", "BizOpp", "Forex", "Mobile", "CPL", "SOI", "Dating", "Nutra"
  ];

  const allOffers = [
    // Top/Popular Offers
    {
      id: 1,
      logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=40&h=40&fit=crop&crop=center",
      title: "Girl4love - SOI - CPA - Desktop & Mobile - Tier 1 - US, AU, UK, NZ",
      network: "AdsEmpire",
      tags: ["Dating", "Mobile", "SOI", "US", "AU", "GB", "NZ"],
      payout: "€ 2.40",
      category: "Dating"
    },
    {
      id: 2,
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center",
      title: "VulkanSpiele - Stream (PL)",
      network: "Ace Partners",
      tags: ["Gambling", "PL"],
      payout: "€ 110.00",
      category: "Gambling"
    },
    {
      id: 3,
      logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=center",
      title: "Wealth Expert Dutch 22189",
      network: "Algo-Affiliates",
      tags: ["Crypto", "BizOpp", "Forex", "WW"],
      payout: "$ 600.00",
      category: "Crypto"
    },
    // Nutra Offers
    {
      id: 4,
      logo: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=40&h=40&fit=crop&crop=center",
      title: "KetoSlim Pro - Weight Loss Supplement - US/CA",
      network: "NutraAffiliates",
      tags: ["Nutra", "Weight Loss", "US", "CA"],
      payout: "$ 45.00",
      category: "Nutra"
    },
    {
      id: 5,
      logo: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=40&h=40&fit=crop&crop=center",
      title: "Collagen Beauty Formula - Anti-Aging Cream",
      network: "HealthOffers",
      tags: ["Nutra", "Beauty", "Anti-Aging", "EU"],
      payout: "€ 38.50",
      category: "Nutra"
    },
    // Crypto Offers
    {
      id: 6,
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=40&h=40&fit=crop&crop=center",
      title: "Bitcoin Revolution - Auto Trading Platform",
      network: "CryptoMax",
      tags: ["Crypto", "Trading", "Bitcoin", "WW"],
      payout: "$ 800.00",
      category: "Crypto"
    },
    {
      id: 7,
      logo: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=40&h=40&fit=crop&crop=center",
      title: "Ethereum Profit - Investment Platform",
      network: "BlockchainAds",
      tags: ["Crypto", "Investment", "Ethereum", "Tier1"],
      payout: "$ 1200.00",
      category: "Crypto"
    },
    // Gambling Offers
    {
      id: 8,
      logo: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=40&h=40&fit=crop&crop=center",
      title: "Royal Casino - New Player Bonus 500%",
      network: "GamingNetwork",
      tags: ["Gambling", "Casino", "Bonus", "EU"],
      payout: "€ 150.00",
      category: "Gambling"
    },
    {
      id: 9,
      logo: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=40&h=40&fit=crop&crop=center",
      title: "Sports Betting Pro - Live Odds",
      network: "BetPartners",
      tags: ["Gambling", "Sports", "Live Betting", "US"],
      payout: "$ 200.00",
      category: "Gambling"
    },
    // Game Offers
    {
      id: 10,
      logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=40&h=40&fit=crop&crop=center",
      title: "Mobile Legends RPG - Install & Play",
      network: "GameAds",
      tags: ["Game", "RPG", "Mobile", "Install"],
      payout: "$ 8.50",
      category: "Game"
    },
    {
      id: 11,
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=40&h=40&fit=crop&crop=center",
      title: "Racing Thunder - Car Racing Game",
      network: "PlayNetwork",
      tags: ["Game", "Racing", "Mobile", "Action"],
      payout: "$ 12.00",
      category: "Game"
    },
    // COD Offers  
    {
      id: 12,
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=40&h=40&fit=crop&crop=center",
      title: "Premium Kitchen Set - Cash on Delivery",
      network: "CODMasters",
      tags: ["COD", "Kitchen", "Home", "India"],
      payout: "₹ 250.00",
      category: "COD"
    },
    {
      id: 13,
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
      title: "Fashion Jewelry Collection - COD Available",
      network: "EcomAffiliates",
      tags: ["COD", "Fashion", "Jewelry", "Women"],
      payout: "₹ 180.00",
      category: "COD"
    },
    // Sweepstakes Offers
    {
      id: 14,
      logo: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=40&h=40&fit=crop&crop=center",
      title: "iPhone 15 Pro Giveaway - Enter Now",
      network: "SweepNetwork",
      tags: ["Sweepstakes", "iPhone", "Giveaway", "US"],
      payout: "$ 15.00",
      category: "Sweepstakes"
    },
    {
      id: 15,
      logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=40&h=40&fit=crop&crop=center",
      title: "Win $10,000 Cash Prize - Weekly Draw",
      network: "PrizePartners",
      tags: ["Sweepstakes", "Cash", "Prize", "Weekly"],
      payout: "$ 25.00",
      category: "Sweepstakes"
    }
  ];

  const offerCategories = ["🔝 Top Offers", "All", "Nutra", "Crypto", "Gambling", "Game", "COD", "Sweepstakes"];

  const getFilteredOffers = () => {
    if (selectedOfferCategory === "🔝 Top Offers") {
      // Return top performing offers (first 3 from each category)
      return allOffers.slice(0, 8);
    } else if (selectedOfferCategory === "All") {
      return allOffers;
    } else {
      return allOffers.filter(offer => offer.category === selectedOfferCategory);
    }
  };

  const offers = getFilteredOffers();

  const premiumNetworks = [
    {
      id: 1,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center",
      name: "ClickDealer",
      category: "Smartlink",
      subcategory: "Leadgen",
      offers: "8 offers",
      frequency: "Weekly, Bi-weekly"
    },
    {
      id: 2,
      logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=48&h=48&fit=crop&crop=center",
      name: "Traffic Light",
      category: "Nutra",
      subcategory: "Direct Advertiser",
      offers: "2183 offers +15",
      frequency: "Upon Request"
    },
    {
      id: 3,
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=48&h=48&fit=crop&crop=center",
      name: "Royal Partners",
      category: "Casino",
      subcategory: "Betting, Gambling",
      offers: "14 offers",
      frequency: "Weekly, Monthly"
    },
    {
      id: 4,
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=center",
      name: "Affmine",
      category: "PIN Submit",
      subcategory: "CPI, CPE",
      offers: "500 offers +28",
      frequency: "Bi-Weekly, Weekly"
    },
    {
      id: 5,
      logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=center",
      name: "Algo-Affiliates",
      category: "Crypto",
      subcategory: "Forex",
      offers: "100000 offers +4",
      frequency: "Weekly for volume"
    },
    {
      id: 6,
      logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=center",
      name: "CrakRevenue",
      category: "Adult",
      subcategory: "CAM, Dating",
      offers: "608 offers",
      frequency: "Net-30, Net-15"
    }
  ];

  const FilterDropdown = ({ title, options, selected, onSelect }: any) => (
    <div className="relative group">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 px-4 py-2 bg-white border-input-border hover:bg-muted transition-colors"
      >
        <span className="text-sm font-medium">{selected || title}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-input-border rounded-lg shadow-lg z-50 hidden group-hover:block">
        <div className="p-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder={`Search ${title.toLowerCase()}`}
              className="pl-10 h-8 text-sm"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer rounded text-sm"
                onClick={() => onSelect(option)}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4"
                    checked={selected === option}
                    readOnly
                  />
                  {option}
                </label>
                {option !== "All" && option !== "Worldwide" && option !== "Crypto" && (
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 100000) + 1000}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header with Filters */}
      <div className="bg-white border-b border-input-border px-6 py-4">
        <div className="flex items-center gap-4">
          <FilterDropdown 
            title="Networks" 
            options={networks}
            selected={selectedNetwork}
            onSelect={setSelectedNetwork}
          />
          <FilterDropdown 
            title="Geos" 
            options={geos}
            selected={selectedGeo}
            onSelect={setSelectedGeo}
          />
          <FilterDropdown 
            title="Verticals" 
            options={verticals}
            selected={selectedVertical}
            onSelect={setSelectedVertical}
          />
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Top Offers Filter */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            {offerCategories.map((category) => (
              <Button 
                key={category}
                variant={selectedOfferCategory === category ? "outline" : "ghost"}
                size="sm" 
                className={selectedOfferCategory === category ? "bg-muted text-foreground" : ""}
                onClick={() => setSelectedOfferCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-4">
                  <img 
                    src={offer.logo} 
                    alt="Network Logo" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{offer.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">{offer.network}</span>
                      <div className="flex gap-1 flex-wrap">
                        {offer.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary mb-1">{offer.payout}</div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary-hover text-white"
                      onClick={() => navigate(`/offer/${offer.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Networks Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg border border-input-border overflow-hidden">
            <div className="p-4 border-b border-input-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                ⭐ Premium Networks
              </h2>
            </div>
            <div className="space-y-0">
              {premiumNetworks.map((network) => (
                <div key={network.id} className="p-4 border-b border-input-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={network.logo} 
                      alt={network.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-foreground truncate">{network.name}</h3>
                        <Button size="sm" className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1">
                          Join
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {network.category} • {network.subcategory}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>📊 {network.offers}</span>
                        <span>💰 {network.frequency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;