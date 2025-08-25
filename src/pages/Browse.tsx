import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Network {
  id: string;
  name: string;
  type: string;
  description: string;
  logo_url: string;
  website_link: string;
  payment_frequency: string;
  payment_methods: string[];
  categories: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  priority_order: number;
}

interface Offer {
  id: string;
  name: string;
  network_id: string;
  type: string;
  payout_amount: number | string;
  payout_currency: string;
  devices: string[] | string;
  vertical: string | string[] | any;
  geo_targets: string[] | string;
  tags: string[] | string;
  image_url: string;
  landing_page_url: string;
  is_active: boolean;
  is_featured: boolean;
  priority_order: number | string;
  networks?: {
    id: string;
    name: string;
    logo_url: string;
  };
}

// New interfaces for banners to match the database structure
interface Banner {
  id: string;
  image_url: string;
  link_url?: string;
  section: string[];
  created_at: string;
  title?: string;
}

// Hook for rotating banners
const useRotatingBanners = (banners: Banner[], intervalMs: number = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [banners.length, intervalMs]);

  return banners.length > 0 ? banners[currentIndex] : null;
};

// Centralized component to display banners with rotation
const BannerDisplay = ({ banners, section }: { banners: Banner[], section: "top" | "footer" | "sidebar" | "fixed-top" | "fixed-bottom" }) => {
  const currentBanner = useRotatingBanners(banners);
  
  if (!currentBanner) return null;

  const isSidebar = section === "sidebar";
  const isFixed = section === "fixed-top" || section === "fixed-bottom";

  let containerClass = "";
  let imageClass = "";

  switch (section) {
    case "fixed-top":
      containerClass = "fixed top-0 left-0 right-0 z-50 bg-white shadow-md";
      imageClass = "w-full h-20 object-cover";
      break;
    case "fixed-bottom":
      containerClass = "fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md";
      imageClass = "w-full h-20 object-cover";
      break;
    case "sidebar":
      containerClass = "mb-4";
      imageClass = "w-full h-[400px] object-contain";
      break;
    case "top":
      containerClass = "my-6";
      imageClass = "w-full h-32 object-cover";
      break;
    case "footer":
      containerClass = "my-6";
      imageClass = "w-full h-20 object-cover";
      break;
  }

  return (
    <div className={containerClass}>
      <a
        href={currentBanner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <img
          src={currentBanner.image_url}
          alt={`${section} banner`}
          className={`${imageClass} rounded-md`}
        />
      </a>
      {/* Show rotation indicator if multiple banners */}
      {banners.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === banners.findIndex(b => b.id === currentBanner.id)
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar banner component for vertical display
const SidebarBannerDisplay = ({ banners }: { banners: Banner[] }) => {
  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <img
            src={banner.image_url}
            alt="Sidebar banner"
            className="w-full h-[400px] object-contain rounded-md"
          />
        </a>
      ))}
    </div>
  );
};

const Browse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<string>("🔥 Top Offers");

  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [allNetworks, setAllNetworks] = useState<Network[]>([]);
  const [offersCountByNetwork, setOffersCountByNetwork] = useState<Record<string, number>>({});
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingNetworks, setLoadingNetworks] = useState(true);
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  // Fetch ALL offers from Supabase without any filtering
  useEffect(() => {
    const fetchOffers = async () => {
      setLoadingOffers(true);
      try {
        const { data, error } = await supabase
          .from('offers')
          .select(`*, networks (id, name, logo_url)`);

        if (error) throw error;
        
        setAllOffers(data || []);

        // Calculate offer counts by network
        const counts: Record<string, number> = {};
        (data || []).forEach(offer => {
          if (offer.network_id) {
            counts[offer.network_id] = (counts[offer.network_id] || 0) + 1;
          }
        });
        setOffersCountByNetwork(counts);

      } catch (error: any) {
        console.error("Error fetching offers:", error.message);
        toast({
          title: "Error",
          description: "Failed to load offers.",
          variant: "destructive",
        });
      } finally {
        setLoadingOffers(false);
      }
    };
    fetchOffers();
  }, [toast]);

  // Fetch all networks from Supabase
  useEffect(() => {
    const fetchNetworks = async () => {
      setLoadingNetworks(true);
      try {
        const { data, error } = await supabase
          .from('networks')
          .select('*')
          .order('priority_order', { ascending: false });

        if (error) throw error;
        setAllNetworks(data || []);
      } catch (error: any) {
        console.error("Error fetching networks:", error.message);
        toast({
          title: "Error",
          description: "Failed to load networks.",
          variant: "destructive",
        });
      } finally {
        setLoadingNetworks(false);
      }
    };
    fetchNetworks();
  }, [toast]);
  
  // Fetch banners from Supabase
  useEffect(() => {
    const fetchBanners = async () => {
      setLoadingBanners(true);
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAllBanners(data || []);
      } catch (error: any) {
        console.error("Error fetching banners:", error.message);
        toast({
          title: "Error",
          description: "Failed to load banners.",
          variant: "destructive",
        });
      } finally {
        setLoadingBanners(false);
      }
    };
    fetchBanners();
  }, [toast]);

  // Helper to check if value is placeholder
  const isPlaceholder = (value: any): boolean => {
    return !value || value === "##" || value === "null" || value === "undefined" || value === "";
  };

  // Helper to convert any value to string array, keeping ## for filter options but excluding from display
  const toStringArray = (value: any, includeEmpty: boolean = false): string[] => {
    if (!value) return [];
    
    if (Array.isArray(value)) {
      const filtered = value.map(v => String(v)).filter(v => {
        if (includeEmpty) return true;
        return v && v !== "##" && v !== "null" && v !== "undefined";
      });
      return filtered;
    }
    
    if (typeof value === 'string') {
      // Handle JSON string
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            const filtered = parsed.map(v => String(v)).filter(v => {
              if (includeEmpty) return true;
              return v && v !== "##" && v !== "null" && v !== "undefined";
            });
            return filtered;
          }
        } catch (e) {
          console.log('JSON parse failed for:', value);
        }
      }
      
      // Handle comma-separated string
      if (value.includes(',')) {
        const filtered = value.split(',').map(v => v.trim()).filter(v => {
          if (includeEmpty) return true;
          return v && v !== "##" && v !== "null" && v !== "undefined";
        });
        return filtered;
      }
      
      // Single string value
      if (includeEmpty || (value !== "##" && value !== "null" && value !== "undefined")) {
        return [value];
      }
    }
    
    return [];
  };

  // Helper for display values - shows "N/A" for placeholders
  const getDisplayValue = (value: any, fallback: string = "N/A"): string => {
    if (isPlaceholder(value)) {
      return fallback;
    }
    return String(value);
  };

  // Get all unique values for dropdowns - include offers with valid data only
  const networksOptions = ["All", ...Array.from(new Set(
    allNetworks.map(n => getDisplayValue(n.name)).filter(name => name !== "N/A")
  ))];
  
  const geosOptions = ["Worldwide", ...Array.from(new Set(
    allOffers.flatMap(o => {
      const geos = toStringArray(o.geo_targets, false);
      return geos.length > 0 ? geos : [];
    })
  ))];
  
  const verticalsOptions = ["All", ...Array.from(new Set(
    allOffers.flatMap(o => {
      const verticals = toStringArray(o.vertical, false);
      return verticals.length > 0 ? verticals : [];
    })
  ))];
  
  const offerCategories = ["🔥 Top Offers", "All", ...Array.from(new Set(
    allOffers.flatMap(o => {
      const verticals = toStringArray(o.vertical, false);
      return verticals.length > 0 ? verticals : [];
    })
  ))];

  const getFilteredOffers = () => {
    let filtered = [...allOffers];

    if (selectedNetworkFilter && selectedNetworkFilter !== "All") {
      filtered = filtered.filter(offer => {
        const networkName = getDisplayValue(offer.networks?.name);
        return networkName === selectedNetworkFilter;
      });
    }

    if (selectedGeo && selectedGeo !== "Worldwide") {
      filtered = filtered.filter(offer => {
        const geoTargets = toStringArray(offer.geo_targets, false);
        return geoTargets.length === 0 || geoTargets.includes(selectedGeo);
      });
    }

    if (selectedVertical && selectedVertical !== "All") {
      filtered = filtered.filter(offer => {
        const verticals = toStringArray(offer.vertical, false);
        return verticals.length === 0 || verticals.includes(selectedVertical);
      });
    }

    if (selectedOfferCategory === "🔥 Top Offers") {
      filtered = filtered.sort((a, b) => {
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;
        
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        
        const aPriority = typeof a.priority_order === 'number' ? a.priority_order : 0;
        const bPriority = typeof b.priority_order === 'number' ? b.priority_order : 0;
        return bPriority - aPriority;
      });
    } else if (selectedOfferCategory !== "All") {
      filtered = filtered.filter(offer => {
        const verticals = toStringArray(offer.vertical, false);
        return verticals.includes(selectedOfferCategory);
      });
    }

    if (selectedOfferCategory !== "🔥 Top Offers") {
      filtered = filtered.sort((a, b) => {
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;
        
        const aPriority = typeof a.priority_order === 'number' ? a.priority_order : 0;
        const bPriority = typeof b.priority_order === 'number' ? b.priority_order : 0;
        return bPriority - aPriority;
      });
    }

    return filtered;
  };

  const offersToDisplay = getFilteredOffers();
  const networksToDisplay = allNetworks.filter(n => n.is_active);

  // Filter banners based on their section property
  const fixedTopBanners = allBanners.filter(b => b.section && b.section.includes("fixed-top"));
  const topBanners = allBanners.filter(b => b.section && b.section.includes("top"));
  const sidebarBanners = allBanners.filter(b => b.section && b.section.includes("sidebar"));
  const footerBanners = allBanners.filter(b => b.section && b.section.includes("footer"));
  const fixedBottomBanners = allBanners.filter(b => b.section && b.section.includes("fixed-bottom"));

  const FilterDropdown = ({ title, options, selected, onSelect }: any) => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredOptions = options.filter((option: string) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option: string, idx: number) => (
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const BannersDropdown = () => {
    return (
      <div className="relative group">
        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white border-input-border hover:bg-muted transition-colors">
          <span className="text-sm font-medium">Banners</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-input-border rounded-lg shadow-lg z-50 hidden group-hover:block">
          <div className="max-h-80 overflow-y-auto">
            {loadingBanners ? (
              <div className="p-3 text-muted-foreground text-sm">Loading banners...</div>
            ) : allBanners.length === 0 ? (
              <div className="p-3 text-muted-foreground text-sm">No banners found</div>
            ) : (
              allBanners.map((banner) => (
                <a
                  key={banner.id}
                  href={banner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-sm font-medium truncate">{banner.title}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Fixed Top Banners */}
      {fixedTopBanners.length > 0 && (
        <BannerDisplay banners={fixedTopBanners} section="fixed-top" />
      )}
      
      {/* Top Banners */}
      {topBanners.length > 0 && (
        <div className="p-6" style={{ marginTop: fixedTopBanners.length > 0 ? '80px' : '0' }}>
          <BannerDisplay banners={topBanners} section="top" />
        </div>
      )}
      
      {/* Header with Filters */}
      <div className="bg-white border-b border-input-border px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <FilterDropdown 
            title="Networks" 
            options={networksOptions}
            selected={selectedNetworkFilter}
            onSelect={setSelectedNetworkFilter}
          />
          <FilterDropdown 
            title="Geos" 
            options={geosOptions}
            selected={selectedGeo}
            onSelect={setSelectedGeo}
          />
          <FilterDropdown 
            title="Verticals" 
            options={verticalsOptions}
            selected={selectedVertical}
            onSelect={setSelectedVertical}
          />
          <BannersDropdown />  
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Debug Info */}
          <div className="mb-4 text-sm text-muted-foreground">
            Total Offers: {allOffers.length} | Displayed: {offersToDisplay.length}
          </div>

          {/* Category Filter */}
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
            {loadingOffers ? (
              <div className="text-center py-8 text-muted-foreground">Loading offers...</div>
            ) : offersToDisplay.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No offers found matching your filters.
                <br />
                <small>Try clearing some filters or check "All" category.</small>
              </div>
            ) : (
              offersToDisplay.map((offer) => (
                <Card key={offer.id} className={`p-4 hover:shadow-md transition-shadow ${offer.is_active ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <img 
                      src={offer.networks?.logo_url || `https://placehold.co/40x40/E0E0E0/ADADAD?text=${(offer.networks?.name || 'N').charAt(0)}`}
                      alt={offer.networks?.name || "Network Logo"} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {getDisplayValue(offer.name, "Unnamed Offer")}
                        </h3>
                        {!offer.is_active && (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                        {offer.is_featured && (
                          <Badge variant="default" className="text-xs bg-yellow-500">Featured</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">
                          {getDisplayValue(offer.networks?.name, "Unknown Network")}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {/* Geo badges - only show valid geos */}
                          {toStringArray(offer.geo_targets, false).slice(0, 3).map((geo, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                              {geo}
                            </Badge>
                          ))}
                          {toStringArray(offer.geo_targets, false).length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              +{toStringArray(offer.geo_targets, false).length - 3}
                            </Badge>
                          )}
                          {toStringArray(offer.geo_targets, false).length === 0 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                              No GEO specified
                            </Badge>
                          )}
                          
                          {/* Vertical badges - only show valid verticals */}
                          {toStringArray(offer.vertical, false).slice(0, 2).map((vertical, idx) => (
                            <Badge key={idx} variant="default" className="text-xs px-2 py-0.5">
                              {vertical}
                            </Badge>
                          ))}
                          {toStringArray(offer.vertical, false).length === 0 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                              No vertical specified
                            </Badge>
                          )}
                          
                          {/* Tag badges - only show valid tags */}
                          {toStringArray(offer.tags, false).slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary mb-1">
                        {getDisplayValue(offer.payout_currency, "USD")} {" "}
                        {typeof offer.payout_amount === 'number' ? 
                          offer.payout_amount.toFixed(2) : 
                          getDisplayValue(offer.payout_amount, "0.00")
                        }
                      </div>
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
              ))
            )}
            {/* Footer Banners */}
            {footerBanners.length > 0 && (
              <BannerDisplay banners={footerBanners} section="footer" />
            )}
          </div>
        </div>

        {/* Networks Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg border border-input-border overflow-hidden">
            {/* Sidebar Banners */}
            {sidebarBanners.length > 0 && (
              <div className="p-4">
                <SidebarBannerDisplay banners={sidebarBanners} />
              </div>
            )}
            <div className="p-4 border-b border-input-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                All Networks
              </h2>
            </div>
            <div className="space-y-0">
              {loadingNetworks ? (
                <div className="text-center py-4 text-muted-foreground">Loading networks...</div>
              ) : networksToDisplay.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No networks found.</div>
              ) : (
                networksToDisplay.map((network) => (
                  <div key={network.id} className="p-4 border-b border-input-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={network.logo_url || `https://placehold.co/48x48/E0E0E0/ADADAD?text=${network.name.charAt(0)}`}
                        alt={network.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {getDisplayValue(network.name, "Unnamed Network")}
                          </h3>
                          <Button size="sm" className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1">
                            Join
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {getDisplayValue(network.categories?.[0], "N/A")} • {getDisplayValue(network.type, "Unknown")}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>📊 {offersCountByNetwork[network.id] || 0} offers</span> 
                          <span>💰 {getDisplayValue(network.payment_frequency, "Unknown")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Banners */}
      {fixedBottomBanners.length > 0 && (
        <BannerDisplay banners={fixedBottomBanners} section="fixed-bottom" />
      )}
      
      {/* Add bottom margin to prevent content being hidden behind fixed bottom banner */}
      {fixedBottomBanners.length > 0 && <div className="h-20" />}
    </div>
  );
};

export default Browse;