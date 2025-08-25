import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Banner } from "@/types/admin";

interface BannerListProps {
  banners: Banner[];
  onEdit: () => void;
  onRefresh: () => void;
}

export const BannerList = ({ banners, onEdit, onRefresh }: BannerListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("banners").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Banner List</h3>
        <Button onClick={onEdit}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Link URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                {banner.image_url ? (
                  <img 
                    src={banner.image_url} 
                    alt="Banner" 
                    className="h-12 w-20 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-20 bg-muted rounded flex items-center justify-center text-xs">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell>
                {banner.link_url ? (
                  <a 
                    href={banner.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-xs block"
                  >
                    {banner.link_url}
                  </a>
                ) : (
                  <span className="text-muted-foreground">No Link</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(banner.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {banners.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No banners found. Add your first banner to get started.
        </div>
      )}
    </div>
  );
};