import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const SubmitNetwork = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "🎉 Thank you!",
      description: "We'll be in touch shortly to review your network.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-form">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Thank you for submitting your network!
            </h2>
            <p className="text-muted-foreground mb-6">
              We'll be in touch shortly to review your submission and get you started.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-primary hover:bg-primary-hover shadow-button text-primary-foreground font-medium px-8 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Submit Another Network
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header Section */}
      <div className="text-center pt-12 pb-8 px-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Submit Your Affiliate Network
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We'd love to learn about your network! Please fill in the details below, and we'll get in touch soon.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
          
          {/* Contact Information Section */}
          <div className="bg-white rounded-2xl p-8 shadow-form">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact" className="text-sm font-medium text-foreground">
                  Skype / Telegram / Phone *
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Skype: your_skype, Telegram: @your_telegram, Phone: +1234567890"
                />
              </div>
            </div>
          </div>

          {/* Network Details Section */}
          <div className="bg-white rounded-2xl p-8 shadow-form">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</span>
              Network Details
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="network-name" className="text-sm font-medium text-foreground">
                    Affiliate Network Name *
                  </Label>
                  <Input
                    id="network-name"
                    name="network-name"
                    required
                    className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Your Network Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="network-url" className="text-sm font-medium text-foreground">
                    Network Website URL *
                  </Label>
                  <Input
                    id="network-url"
                    name="network-url"
                    type="url"
                    required
                    className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="https://yournetwork.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="network-description" className="text-sm font-medium text-foreground">
                  Network Description *
                </Label>
                <Textarea
                  id="network-description"
                  name="network-description"
                  required
                  rows={4}
                  className="rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your network, what verticals you cover, your unique selling points, and what makes your network special..."
                />
              </div>
            </div>
          </div>

          {/* Operational Information Section */}
          <div className="bg-white rounded-2xl p-8 shadow-form">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</span>
              Operational Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="offers-count" className="text-sm font-medium text-foreground">
                  Number of Offers *
                </Label>
                <Input
                  id="offers-count"
                  name="offers-count"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="50+, 100+, 500+, etc"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-threshold" className="text-sm font-medium text-foreground">
                  Minimum Payment Threshold *
                </Label>
                <Input
                  id="payment-threshold"
                  name="payment-threshold"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="$50, $100, $500, etc"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-frequency" className="text-sm font-medium text-foreground">
                  Payment Frequency *
                </Label>
                <Input
                  id="payment-frequency"
                  name="payment-frequency"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Net-30, Net-15, Weekly, Upon Request, etc"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tracking-software" className="text-sm font-medium text-foreground">
                  Affiliate Tracking Software *
                </Label>
                <Input
                  id="tracking-software"
                  name="tracking-software"
                  required
                  className="h-12 rounded-xl border-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="HasOffers, Affise, CAKE, In-house, etc"
                />
              </div>
            </div>
          </div>

          {/* Captcha Section */}
          <div className="bg-white rounded-2xl p-8 shadow-form">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">4</span>
              Security Verification
            </h2>
            <div className="flex justify-center">
              <div className="g-recaptcha bg-muted rounded-xl p-6 border-2 border-dashed border-input-border" data-sitekey="your-site-key">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🔒</div>
                  <p className="text-sm">reCAPTCHA verification will appear here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button
              type="submit"
              className="bg-gradient-primary hover:bg-primary-hover shadow-button text-primary-foreground font-semibold text-lg px-12 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Submit Network
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitNetwork;