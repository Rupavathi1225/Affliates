import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import aftitansLogo from "@/assets/aftitans-logo.png";

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Sample offer data - in real app this would come from API
  const offer = {
    id: id,
    title: "Summer Break Gaming Challenge",
    company: "GamePro Studios",
    payout: "$5.62",
    category: "Game",
    description: "Complete exciting gaming challenges and earn rewards. Reach level 50 in our summer gaming tournament.",
    requirements: "Reach level 50",
    countries: ["US", "UK", "CA", "AU"],
    network: "ClickDealer",
    trackingUrl: "https://track.example.com/click?offer=" + id,
    restrictions: "18+ only, one account per user",
    conversionFlow: "Install game → Complete registration → Reach level 50 → Get reward",
    payoutDetails: {
      cpa: "$5.62",
      revShare: "15%",
      minPayout: "$100"
    }
  };

  const handleNotification = () => {
    toast({
      title: "Notification",
      description: "You have 3 new offer updates!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Logo and Controls */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {/* AfTitans Logo with Glass Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm"></div>
                <div className="relative backdrop-blur-sm bg-white/10 dark:bg-gray-800/10 rounded-lg p-2 border border-white/20">
                  <img 
                    src={aftitansLogo} 
                    alt="AfTitans" 
                    className="h-8 opacity-90"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Notification Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotification}
                className="relative hover:bg-primary/10"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-primary/10"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-200/50 dark:border-purple-700/50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Premium Offers</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Exclusive high-paying campaigns</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-200/50 dark:border-blue-700/50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Gaming Hub</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Latest gaming offers & rewards</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-200/50 dark:border-green-700/50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-green-700 dark:text-green-300">Top Earnings</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Maximize your revenue potential</p>
            </CardContent>
          </Card>
        </div>

        {/* Offer Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{offer.title}</CardTitle>
                    <p className="text-muted-foreground">{offer.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{offer.payout}</div>
                    <Badge variant="secondary">{offer.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{offer.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-muted-foreground">{offer.requirements}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Conversion Flow</h3>
                  <p className="text-muted-foreground">{offer.conversionFlow}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Available Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {offer.countries.map((country) => (
                      <Badge key={country} variant="outline">{country}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Restrictions</h3>
                  <p className="text-sm text-muted-foreground">{offer.restrictions}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Payout Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>CPA:</span>
                  <span className="font-semibold">{offer.payoutDetails.cpa}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Share:</span>
                  <span className="font-semibold">{offer.payoutDetails.revShare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Min Payout:</span>
                  <span className="font-semibold">{offer.payoutDetails.minPayout}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Network Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{offer.network}</p>
                <p className="text-sm text-muted-foreground">Trusted affiliate network</p>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              Get Tracking Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetail;