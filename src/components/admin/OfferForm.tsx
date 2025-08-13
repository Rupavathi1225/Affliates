import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Network, Offer, MasterData } from "@/types/admin";

interface OfferFormProps {
  onSuccess: () => void;
  networks: Network[];
  masterData: MasterData | null;
  offer?: Offer;
}

const OfferForm = ({ onSuccess, networks, masterData, offer }: OfferFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: offer?.name || "",
    network_id: offer?.network_id || "",
    type: offer?.type || "",
    payout_amount: offer?.payout_amount || 0,
    payout_currency: offer?.payout_currency || "USD",
    devices: offer?.devices?.join(", ") || "",
    vertical: offer?.vertical || "",
    geo_targets: offer?.geo_targets?.join(", ") || "",
    tags: offer?.tags?.join(", ") || "",
    image_url: offer?.image_url || "",
    landing_page_url: offer?.landing_page_url || "",
    is_active: offer?.is_active ?? true,
    is_featured: offer?.is_featured ?? false,
    priority_order: offer?.priority_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const offerData = {
        name: formData.name,
        network_id: formData.network_id,
        type: formData.type,
        payout_amount: formData.payout_amount || null,
        payout_currency: formData.payout_currency,
        devices: formData.devices ? formData.devices.split(",").map(s => s.trim()) : [],
        vertical: formData.vertical || null,
        geo_targets: formData.geo_targets ? formData.geo_targets.split(",").map(s => s.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map(s => s.trim()) : [],
        image_url: formData.image_url || null,
        landing_page_url: formData.landing_page_url || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        priority_order: formData.priority_order,
      };

      let result;
      if (offer) {
        result = await supabase
          .from('offers')
          .update(offerData)
          .eq('id', offer.id);
      } else {
        result = await supabase
          .from('offers')
          .insert([offerData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Offer ${offer ? 'updated' : 'created'} successfully`,
      });

      if (!offer) {
        setFormData({
          name: "",
          network_id: "",
          type: "",
          payout_amount: 0,
          payout_currency: "USD",
          devices: "",
          vertical: "",
          geo_targets: "",
          tags: "",
          image_url: "",
          landing_page_url: "",
          is_active: true,
          is_featured: false,
          priority_order: 0,
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Failed to ${offer ? 'update' : 'create'} offer`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{offer ? 'Edit Offer' : 'Add New Offer'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Offer Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="network_id">Network</Label>
              <Select
                value={formData.network_id}
                onValueChange={(value) => setFormData({ ...formData, network_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Offer Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {masterData?.offer_types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vertical">Vertical</Label>
              <Select
                value={formData.vertical}
                onValueChange={(value) => setFormData({ ...formData, vertical: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent>
                  {masterData?.verticals.map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>
                      {vertical}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payout_amount">Payout Amount</Label>
              <Input
                id="payout_amount"
                type="number"
                step="0.01"
                value={formData.payout_amount}
                onChange={(e) => setFormData({ ...formData, payout_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="payout_currency">Payout Currency</Label>
              <Select
                value={formData.payout_currency}
                onValueChange={(value) => setFormData({ ...formData, payout_currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {masterData?.currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="landing_page_url">Landing Page URL</Label>
              <Input
                id="landing_page_url"
                type="url"
                value={formData.landing_page_url}
                onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="priority_order">Priority Order</Label>
              <Input
                id="priority_order"
                type="number"
                value={formData.priority_order}
                onChange={(e) => setFormData({ ...formData, priority_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="devices">Devices (comma-separated)</Label>
            <Input
              id="devices"
              value={formData.devices}
              onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
              placeholder="Desktop, Mobile, Tablet"
            />
          </div>

          <div>
            <Label htmlFor="geo_targets">Geo Targets (comma-separated country codes)</Label>
            <Input
              id="geo_targets"
              value={formData.geo_targets}
              onChange={(e) => setFormData({ ...formData, geo_targets: e.target.value })}
              placeholder="US, CA, GB, DE"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="high-converting, mobile-friendly, premium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : `${offer ? 'Update' : 'Create'} Offer`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OfferForm;