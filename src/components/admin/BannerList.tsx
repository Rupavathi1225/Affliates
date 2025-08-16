import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Banner } from '@/types/banner';

interface BannerListProps {
  banners: Banner[];
  onUpdate: () => void;
  onEdit: (banner: Banner) => void;
}

const BannerList = ({ banners, onUpdate, onEdit }: BannerListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`,
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error updating banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banners ({banners.length}/2)</CardTitle>
      </CardHeader>
      <CardContent>
        {banners.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No banners found. Create your first banner to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Banner Image */}
                <img
                  src={banner.image_url}
                  alt={banner.alt_text || 'Banner'}
                  className="w-20 h-20 object-cover rounded-lg border"
                />

                {/* Banner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={banner.is_active ? "default" : "secondary"}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      Priority: {banner.priority_order}
                    </Badge>
                  </div>
                  
                  {banner.alt_text && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {banner.alt_text}
                    </p>
                  )}
                  
                  {banner.link_url && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{banner.link_url}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(banner)}
                  >
                    {banner.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(banner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deletingId === banner.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BannerList;