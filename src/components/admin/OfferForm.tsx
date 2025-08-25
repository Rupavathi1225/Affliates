import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Network, Offer, MasterData } from "@/types/admin";

declare const XLSX: any;
declare const supabase: any;

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; 
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Add a check to ensure Supabase URL and Key are not placeholders
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.error("Supabase credentials are not configured. Please replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY' with your actual Supabase project details.");
}

interface OfferFormProps {
  onSuccess: () => void;
  networks: Network[];
  masterData: MasterData | null;
  offer?: Offer;
}

const OfferForm = ({ onSuccess, networks, masterData, offer }: OfferFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Helper functions for handling ## placeholders
  const isPlaceholder = (value: any): boolean => {
    return !value || value === "##" || value === "null" || value === "undefined" || value === "";
  };

  const parseArrayFromOffer = (field: any): string => {
    if (isPlaceholder(field)) return "";
    
    if (Array.isArray(field)) {
      const filtered = field.filter(v => v && v !== "##" && v !== "null" && v !== "undefined");
      return filtered.join(", ");
    }
    
    if (typeof field === 'string') {
      try {
        // Try to parse as JSON
        if (field.startsWith('[') && field.endsWith(']')) {
          const parsed = JSON.parse(field);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(v => v && v !== "##" && v !== "null" && v !== "undefined");
            return filtered.join(", ");
          }
        }
        // Handle comma-separated
        if (field.includes(',')) {
          const filtered = field.split(',').map(v => v.trim()).filter(v => v && v !== "##" && v !== "null" && v !== "undefined");
          return filtered.join(", ");
        }
        // Single value
        return field === "##" || field === "null" || field === "undefined" ? "" : field;
      } catch (error) {
        return "";
      }
    }
    
    return "";
  };

  // Load XLSX and Supabase from CDN if they are not already loaded
  useEffect(() => {
    // Load XLSX
    if (typeof XLSX === 'undefined') {
      const scriptXLSX = document.createElement('script');
      scriptXLSX.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js';
      scriptXLSX.onload = () => console.log('XLSX loaded from CDN');
      scriptXLSX.onerror = (e) => console.error('Error loading XLSX:', e);
      document.head.appendChild(scriptXLSX);
    }

    // Load Supabase (if not already loaded globally or via another means)
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      const scriptSupabase = document.createElement('script');
      scriptSupabase.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      scriptSupabase.onload = () => {
        console.log('Supabase loaded from CDN');
        if (window.supabase && window.supabase.createClient) {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          setSupabaseClient(client);
        } else {
          console.error("Supabase client not available after loading script.");
          toast({
            title: "Error",
            description: "Supabase library not initialized. Check CDN link.",
            variant: "destructive",
          });
        }
      };
      scriptSupabase.onerror = (e) => console.error('Error loading Supabase:', e);
      document.head.appendChild(scriptSupabase);
    } else {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setSupabaseClient(client);
    }
  }, []);

  // Check Supabase config on component mount
  useEffect(() => {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
      toast({
        title: "Configuration Error",
        description: "Please update Supabase URL and Anon Key in OfferForm.tsx.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const [formData, setFormData] = useState({
    name: offer?.name || "",
    network_id: offer?.network_id || "",
    type: offer?.type || "",
    payout_amount: offer?.payout_amount || 0,
    payout_currency: offer?.payout_currency || "USD",
    devices: parseArrayFromOffer(offer?.devices),
    vertical: parseArrayFromOffer(offer?.vertical),
    geo_targets: parseArrayFromOffer(offer?.geo_targets),
    tags: parseArrayFromOffer(offer?.tags),
    image_url: offer?.image_url || "",
    landing_page_url: offer?.landing_page_url || "",
    is_active: offer?.is_active ?? true,
    is_featured: offer?.is_featured ?? false,
    priority_order: offer?.priority_order || 0,
  });

  // Helper to process form data before submission
  const processFormData = (data: any) => {
    return {
      name: data.name || "##",
      network_id: data.network_id || "##",
      type: data.type || "##",
      payout_amount: data.payout_amount !== null && data.payout_amount !== undefined && !isNaN(Number(data.payout_amount)) 
                     ? Number(data.payout_amount) 
                     : 0,
      payout_currency: data.payout_currency || "USD",
      devices: data.devices ? data.devices.split(",").map((s: string) => s.trim()).filter((s: string) => s) : ["##"],
      vertical: data.vertical ? data.vertical.split(",").map((s: string) => s.trim()).filter((s: string) => s) : ["##"],
      geo_targets: data.geo_targets ? data.geo_targets.split(",").map((s: string) => s.trim()).filter((s: string) => s) : ["##"],
      tags: data.tags ? data.tags.split(",").map((s: string) => s.trim()).filter((s: string) => s) : ["##"],
      image_url: data.image_url || "##",
      landing_page_url: data.landing_page_url || "##",
      is_active: data.is_active,
      is_featured: data.is_featured,
      priority_order: data.priority_order !== null && data.priority_order !== undefined && !isNaN(Number(data.priority_order)) 
                      ? Number(data.priority_order) 
                      : 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!supabaseClient) {
      toast({
        title: "Error",
        description: "Supabase client not initialized. Cannot save offer.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const offerData = processFormData(formData);

      let result;
      if (offer) {
        result = await supabaseClient
          .from('offers')
          .update(offerData)
          .eq('id', offer.id);
      } else {
        result = await supabaseClient
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

  const processImportedData = (data: any[]) => {
    return data.map((row) => ({
      name: row.name || row.Name || "##",
      network_id: row.network_id || row.NetworkID || "##",
      type: row.type || row.Type || "##",
      payout_amount: row.payout_amount ? parseFloat(row.payout_amount) : 0,
      payout_currency: row.payout_currency || "USD",
      devices: row.devices ? 
        row.devices.split(",").map((d: string) => d.trim()).filter((d: string) => d) : 
        ["##"],
      vertical: row.vertical ? 
        row.vertical.split(",").map((v: string) => v.trim()).filter((v: string) => v) : 
        ["##"],
      geo_targets: row.geo_targets ? 
        row.geo_targets.split(",").map((g: string) => g.trim()).filter((g: string) => g) : 
        ["##"],
      tags: row.tags ? 
        row.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t) : 
        ["##"],
      image_url: row.image_url || "##",
      landing_page_url: row.landing_page_url || "##",
      is_active: row.is_active?.toString().toLowerCase() === "true",
      is_featured: row.is_featured?.toString().toLowerCase() === "true",
      priority_order: row.priority_order ? parseInt(row.priority_order) : 0,
    }));
  };

  const handleGoogleSheetImport = async () => {
    setFileLoading(true);
    if (!supabaseClient) {
      toast({
        title: "Error",
        description: "Supabase client not initialized. Cannot import offers.",
        variant: "destructive",
      });
      setFileLoading(false);
      return;
    }
    try {
      if (typeof XLSX === 'undefined') {
        console.error("XLSX is not loaded. Please wait or check CDN.");
        toast({
          title: "Error",
          description: "Spreadsheet library not loaded. Please try again.",
          variant: "destructive",
        });
        setFileLoading(false);
        return;
      }
      const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmdaMr7n9hPynxTIDOlwD4zcb_cH35l88dq_Y21S4thuvTjfhntD_l4P9PNjI02cFJ3g0LEFI0dZsf/pub?gid=0&single=true&output=csv";

      const response = await fetch(CSV_URL);
      const csvText = await response.text();

      const workbook = XLSX.read(csvText, { type: "string" });
      const sheetName = workbook.SheetNames[0];
      const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const formattedData = processImportedData(jsonData);

      const { error } = await supabaseClient.from("offers").insert(formattedData);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Offers imported successfully from Google Sheet",
      });

      onSuccess();
    } catch (error) {
      console.error("Google Sheet import error:", error);
      toast({
        title: "Error",
        description: "Failed to import offers from Google Sheet",
        variant: "destructive",
      });
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    if (!supabaseClient) {
      toast({
        title: "Error",
        description: "Supabase client not initialized. Cannot upload offers.",
        variant: "destructive",
      });
      setFileLoading(false);
      return;
    }
    try {
      if (typeof XLSX === 'undefined') {
        console.error("XLSX is not loaded. Please wait or check CDN.");
        toast({
          title: "Error",
          description: "Spreadsheet library not loaded. Please try again.",
          variant: "destructive",
        });
        setFileLoading(false);
        return;
      }
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = processImportedData(jsonData);
    
      const { error } = await supabaseClient.from("offers").insert(formattedData);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Offers uploaded successfully from file",
      });

      onSuccess();
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload offers from file",
        variant: "destructive",
      });
    } finally {
      setFileLoading(false);
      if (event.target) event.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{offer ? 'Edit Offer' : 'Add New Offer'}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bulk Upload Section - Only for creating new offers */}
        {!offer && (
          <div className="mb-4 space-y-2">
            <Label>Bulk Upload Options</Label>
            <Input
              id="file_upload"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
              disabled={fileLoading}
            />
            <Button
              type="button"
              onClick={handleGoogleSheetImport}
              disabled={fileLoading}
              className="w-full"
            >
              {fileLoading ? "Importing..." : "Import from Google Sheet"}
            </Button>
            {fileLoading && (
              <p className="text-sm text-gray-500 mt-1">Processing...</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offer name */}
            <div>
              <Label htmlFor="name">Offer Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter offer name"
              />
            </div>
            {/* Network */}
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
            {/* Offer Type */}
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
            {/* Vertical */}
            <div>
              <Label htmlFor="vertical">Vertical (comma-separated)</Label>
              <Input
                id="vertical"
                value={formData.vertical}
                onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                placeholder="Nutra, Dating, Gaming"
              />
            </div>
            {/* Payout Amount */}
            <div>
              <Label htmlFor="payout_amount">Payout Amount</Label>
              <Input
                id="payout_amount"
                type="number"
                step="0.01"
                value={formData.payout_amount}
                onChange={(e) => setFormData({ ...formData, payout_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            {/* Payout Currency */}
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
            {/* Image URL */}
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {/* Landing Page URL */}
            <div>
              <Label htmlFor="landing_page_url">Landing Page URL</Label>
              <Input
                id="landing_page_url"
                type="url"
                value={formData.landing_page_url}
                onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
                placeholder="https://example.com/landing"
              />
            </div>
            {/* Priority Order */}
            <div>
              <Label htmlFor="priority_order">Priority Order</Label>
              <Input
                id="priority_order"
                type="number"
                value={formData.priority_order}
                onChange={(e) => setFormData({ ...formData, priority_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Devices */}
          <div>
            <Label htmlFor="devices">Devices (comma-separated)</Label>
            <Input
              id="devices"
              value={formData.devices}
              onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
              placeholder="Desktop, Mobile, Tablet"
            />
          </div>

          {/* Geo Targets */}
          <div>
            <Label htmlFor="geo_targets">Geo Targets (comma-separated country codes)</Label>
            <Input
              id="geo_targets"
              value={formData.geo_targets}
              onChange={(e) => setFormData({ ...formData, geo_targets: e.target.value })}
              placeholder="US, CA, GB, DE"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="high-converting, mobile-friendly, premium"
            />
          </div>

          {/* Switches */}
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