import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { Banner } from '@/types/banner';

interface BannerFormProps {
  onSuccess: () => void;
  editingBanner?: Banner | null;
  onCancelEdit?: () => void;
}

const BannerForm = ({ onSuccess, editingBanner, onCancelEdit }: BannerFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingBanner?.image_url || '');
  const [formData, setFormData] = useState({
    alt_text: editingBanner?.alt_text || '',
    link_url: editingBanner?.link_url || '',
    is_active: editingBanner?.is_active ?? true,
    priority_order: editingBanner?.priority_order || 1,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `banner-${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingBanner?.image_url || '';

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (!imageUrl) {
        throw new Error('Image is required');
      }

      const bannerData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingBanner) {
        // Update existing banner
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
      } else {
        // Create new banner
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Banner created successfully",
        });
      }

      // Reset form
      setFormData({
        alt_text: '',
        link_url: '',
        is_active: true,
        priority_order: 1,
      });
      setImageFile(null);
      setImagePreview('');
      onSuccess();
      
      if (onCancelEdit) {
        onCancelEdit();
      }
    } catch (error: any) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {editingBanner ? 'Edit Banner' : 'Add New Banner'}
          {editingBanner && onCancelEdit && (
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Banner Image *</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="text-primary hover:text-primary-hover">
                        Upload an image
                      </span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              placeholder="Describe the banner image"
            />
          </div>

          {/* Link URL */}
          <div>
            <Label htmlFor="link_url">Link URL (Optional)</Label>
            <Input
              id="link_url"
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          {/* Priority Order */}
          <div>
            <Label htmlFor="priority_order">Priority Order</Label>
            <Input
              id="priority_order"
              type="number"
              min="1"
              value={formData.priority_order}
              onChange={(e) => setFormData({ ...formData, priority_order: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BannerForm;