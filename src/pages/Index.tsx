import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Lovable Affiliate Portal
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with top affiliate networks and grow your business. Submit your network to get started with our platform.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link to="/submit-network">
            <Button className="bg-gradient-primary hover:bg-primary-hover shadow-button text-primary-foreground font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105">
              Submit Your Network
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300"
          >
            Browse Networks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
