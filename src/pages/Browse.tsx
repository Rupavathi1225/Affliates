import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";

const Browse = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

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

  const offers = [
    {
      id: 1,
      logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=40&h=40&fit=crop&crop=center",
      title: "Girl4love - SOI - CPA - Desktop & Mobile - Tier 1 - US, AU, UK, NZ",
      network: "AdsEmpire",
      tags: ["Dating", "Mobile", "SOI", "US", "AU", "GB", "NZ"],
      payout: "€ 2.40"
    },
    {
      id: 2,
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center",
      title: "VulkanSpiele - Stream (PL)",
      network: "Ace Partners",
      tags: ["Gambling", "PL"],
      payout: "€ 110.00"
    },
    {
      id: 3,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
      title: "Mes tests et avis - Merveilles du monde FR - SOI *PREFILL*",
      network: "Ray Advertising",
      tags: ["SOI", "FR"],
      payout: "€ 0.85"
    },
    {
      id: 4,
      logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=40&h=40&fit=crop&crop=center",
      title: "NetRdv SOI (FR, BE) (web+mob)",
      network: "Paysafe",
      tags: ["Dating", "Mobile", "Adult", "SOI", "BE", "FR"],
      payout: "$ 1.80"
    },
    {
      id: 5,
      logo: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=40&h=40&fit=crop&crop=center",
      title: "ZoomFlirts - SOI - 6 Geos",
      network: "CrakRevenue",
      tags: ["Dating", "Adult", "SOI", "6 Geos"],
      payout: "$ 3.19"
    },
    {
      id: 6,
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center",
      title: "StartACareerToday - Quick Hire Jobs - (US)",
      network: "Affmine",
      tags: ["Job", "US"],
      payout: "$ 2.10"
    },
    {
      id: 7,
      logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center",
      title: "Captcha Survey (Android, Google Chrome) - CPL [US,CA] - CPL",
      network: "Zeydoo",
      tags: ["Mobile", "Android", "Finance", "Survey", "US", "CA"],
      payout: "$ 0.02"
    },
    {
      id: 8,
      logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=center",
      title: "Wealth Expert Dutch 22189",
      network: "Algo-Affiliates",
      tags: ["Crypto", "BizOpp", "Forex", "WW"],
      payout: "$ 600.00"
    }
  ];

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
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="bg-muted text-foreground">
              🔝 Top Offers
            </Button>
            <Button variant="ghost" size="sm">All</Button>
            <Button variant="ghost" size="sm">Nutra</Button>
            <Button variant="ghost" size="sm">Crypto</Button>
            <Button variant="ghost" size="sm">Gambling</Button>
            <Button variant="ghost" size="sm">Game</Button>
            <Button variant="ghost" size="sm">COD</Button>
            <Button variant="ghost" size="sm">Sweepstakes</Button>
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
                    <Button size="sm" className="bg-primary hover:bg-primary-hover text-white">
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