import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BannerFormData {
  image_url: string;
  link_url?: string;
  section: "top" | "footer" | "sidebar";
}

interface BannerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const BannerForm = ({ onSuccess, onCancel }: BannerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BannerFormData>({
    defaultValues: { section: "top" },
  });

  const imageUrl = watch("image_url");
  const section = watch("section");

  // ✅ File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `banners/banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images") // bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Could not get public URL");

      setUploadedImageUrl(publicUrl);
      setPreviewImage(URL.createObjectURL(file));
      setValue("image_url", publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImageUrl("");
    setPreviewImage("");
    setValue("image_url", "");
  };

  // ✅ Submit
  const onSubmit = async (data: BannerFormData) => {
    if (!data.image_url && !uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL or upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bannerData = {
        ...data,
        image_url: uploadedImageUrl || data.image_url,
      };

      const { error } = await supabase.from("banners").insert([bannerData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating banner:", error);
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Selection */}
          <div>
            <Label>Banner Section</Label>
            <Select
              defaultValue="top"
              onValueChange={(val) => setValue("section", val as any)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choose section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top Section</SelectItem>
                <SelectItem value="footer">Footer Section</SelectItem>
                <SelectItem value="sidebar">Sidebar (400x400)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Method */}
          <div className="space-y-2">
            <Label>Choose Image Method</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={uploadMethod === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button
                type="button"
                variant={uploadMethod === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("url")}
              >
                Enter URL
              </Button>
            </div>
          </div>

          {/* Upload Section */}
          {uploadMethod === "upload" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload Banner Image</Label>
                <div className="mt-2">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-primary/50"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    disabled={isLoading}
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm">Click to upload banner image</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Preview */}
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Banner preview"
                    className={`w-full ${
                      section === "sidebar"
                        ? "h-[400px] w-[400px] object-contain"
                        : "h-32 object-cover"
                    } rounded-md border`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={clearUploadedImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* URL Section */}
          {uploadMethod === "url" && (
            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                {...register("image_url", {
                  required:
                    uploadMethod === "url" ? "Image URL is required" : false,
                })}
                placeholder="https://example.com/banner-image.jpg"
              />
              {errors.image_url && (
                <p className="text-sm text-destructive mt-1">
                  {errors.image_url.message}
                </p>
              )}

              {/* Preview */}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Banner preview"
                    className={`w-full ${
                      section === "sidebar"
                        ? "h-[400px] w-[400px] object-contain"
                        : "h-32 object-cover"
                    } rounded-md border`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Link URL */}
          <div>
            <Label htmlFor="link_url">Link URL (Optional)</Label>
            <Input
              id="link_url"
              {...register("link_url")}
              placeholder="https://example.com/target-page"
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Banner"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
