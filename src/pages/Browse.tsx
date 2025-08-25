import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Consistent import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming useToast is available
import BannerDisplay from "@/components/BannerDisplay";

// Define types for Network and Offer based on your Supabase schema
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
  is_featured: boolean; // Ensure this property is available
  priority_order: number;
}

interface Offer {
  id: string;
  name: string;
  network_id: string; // Ensure this is present to link to network
  type: string;
  payout_amount: number;
  payout_currency: string;
  devices: string[];
  vertical: string[]; // Changed from string to string[]
  geo_targets: string[];
  tags: string[];
  image_url: string;
  landing_page_url: string;
  is_active: boolean;
  is_featured: boolean;
  priority_order: number;
  // Relationship to network, assuming it's fetched directly
  networks?: {
    id: string; // Added network ID for navigation
    name: string;
    logo_url: string;
  };
}

const Browse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<string>("🔝 Top Offers");

  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [allNetworks, setAllNetworks] = useState<Network[]>([]);
  const [offersCountByNetwork, setOffersCountByNetwork] = useState<Record<string, number>>({});
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingNetworks, setLoadingNetworks] = useState(true);
 
  // Fetch all active offers from Supabase
  useEffect(() => {
    const fetchOffers = async () => {
      setLoadingOffers(true);
      try {
        const { data, error } = await supabase
          .from('offers')
          .select(`*, networks (id, name, logo_url)`) // Select all offer fields and joined network name/logo/id
          // .eq('is_active', true); // Only fetch active offers

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

  // Fetch all active networks from Supabase for the sidebar
  useEffect(() => {
    const fetchNetworks = async () => {
      setLoadingNetworks(true);
      try {
        const { data, error } = await supabase
          .from('networks')
          .select('*')
          // .eq('is_active', true) // Only fetch active networks
          .order('priority_order', { ascending: false }); // Order by priority

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

  // Derive unique categories, geos, and verticals from fetched data
  const networksOptions = ["All", ...new Set(allNetworks.map(n => n.name))];
  const geosOptions = ["Worldwide", ...new Set(allOffers.flatMap(o => o.geo_targets))];
  const verticalsOptions = ["All", ...new Set(allOffers.map(o => o.vertical).flat())]; // Flatten array of arrays
  const offerCategories = ["🔝 Top Offers", "All", ...new Set(allOffers.map(o => o.vertical).flat())]; // Flatten array of arrays

  const getFilteredOffers = () => {
    let filtered = allOffers.filter(offer => offer.is_active);

    // Filter by selected network
    if (selectedNetworkFilter && selectedNetworkFilter !== "All") {
      filtered = filtered.filter(offer => offer.networks?.name === selectedNetworkFilter);
    }

    // Filter by selected geo
    if (selectedGeo && selectedGeo !== "Worldwide") {
      filtered = filtered.filter(offer => offer.geo_targets.includes(selectedGeo));
    }

    // Filter by selected vertical
    if (selectedVertical && selectedVertical !== "All") {
      filtered = filtered.filter(offer => (offer.vertical as string[]).includes(selectedVertical));
    }

    // Filter by offer category (vertical)
    if (selectedOfferCategory === "🔝 Top Offers") {
      // For "Top Offers", sort by priority_order and featured status
      return filtered
        .sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.priority_order || 0) - (a.priority_order || 0);
        })
        .slice(0, 8); // Return top 8 offers
    } else if (selectedOfferCategory !== "All") {
      filtered = filtered.filter(offer => (offer.vertical as string[]).includes(selectedOfferCategory));
    }
    
    // Default sorting for "All" or other categories
    return filtered.sort((a, b) => (b.priority_order || 0) - (a.priority_order || 0));
  };

  const offersToDisplay = getFilteredOffers();
  const networksToDisplay = allNetworks.filter(n => n.is_active); 

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
                  onClick={() => {
                    onSelect(option);
                    // Optionally reset search term or close dropdown
                  }}
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

  return (
    <div className="min-h-screen bg-gradient-background">
      <BannerDisplay />
      
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
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
            {loadingOffers ? (
              <div className="text-center py-8 text-muted-foreground">Loading offers...</div>
            ) : offersToDisplay.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No offers found.</div>
            ) : (
              offersToDisplay.map((offer) => (
                <Card key={offer.id} className="p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-4">
                    <img 
                      src={offer.networks?.logo_url || `https://placehold.co/40x40/E0E0E0/ADADAD?text=${offer.networks?.name.charAt(0) || 'N'}`}
                      alt={offer.networks?.name || "Network Logo"} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{offer.name}</h3>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">{offer.networks?.name || "Unknown Network"}</span>
                        <div className="flex gap-1 flex-wrap">
                          {/* Display Geo Targets as badges */}
                          {offer.geo_targets.map((geo, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                              {geo}
                            </Badge>
                          ))}
                          {/* Display existing tags as badges */}
                          {offer.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary mb-1">{offer.payout_currency} {offer.payout_amount?.toFixed(2)}</div>
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
          </div>
        </div>

        {/* All Networks Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg border border-input-border overflow-hidden">
            <div className="p-4 border-b border-input-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                ⭐ All Networks
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
                          <h3 className="font-medium text-foreground truncate">{network.name}</h3>
                          <Button size="sm" className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1">
                            Join
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {network.categories?.[0] || "N/A"} • {network.type}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {/* Display actual offer count */}
                          <span>📊 {offersCountByNetwork[network.id] || 0} offers</span> 
                          <span>💰 {network.payment_frequency}</span>
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
    </div>
  );
};

export default Browse;
