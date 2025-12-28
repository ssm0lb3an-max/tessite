import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PhotoSections() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [category, setCategory] = useState("Events");

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const canManage = ["public_relations", "public_relations_lead", "directors_office"].includes(userRole || "");

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            You don't have permission to manage photo sections
          </div>
        </div>
      </div>
    );
  }

  const { data: sectionsData, isLoading } = useQuery({
    queryKey: ["/api/photo-sections"],
    queryFn: async () => {
      const response = await fetch("/api/photo-sections");
      if (!response.ok) throw new Error("Failed to fetch photo sections");
      return response.json();
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/photo-sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "",
        },
        body: JSON.stringify({ title, description, photo, category }),
        credentials: "include",
      });
      if (response.status === 403) {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/login");
        throw new Error("Session expired");
      }
      if (!response.ok) throw new Error("Failed to create photo section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photo-sections"] });
      toast({ title: "Photo section created successfully", duration: 2000 });
      setTitle("");
      setDescription("");
      setPhoto("");
      setPhotoPreview("");
      setCategory("Events");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create photo section",
        description: error.message === "Session expired" ? "Please log in again" : error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await fetch(`/api/photo-sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": userId || "",
        },
        credentials: "include",
      });
      if (response.status === 403) {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/login");
        throw new Error("Session expired");
      }
      if (!response.ok) throw new Error("Failed to delete photo section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photo-sections"] });
      toast({ title: "Photo section deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete photo section",
        description: error.message === "Session expired" ? "Please log in again" : "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhoto(base64);
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = sectionsData?.photoSections || [];
  const isLoaded = !isLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Photo Sections</h1>
        <p className="text-muted-foreground mb-8">
          Add and manage photo sections displayed on the website
        </p>

        {/* Create Photo Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Photo Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Enter section title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createSectionMutation.isPending}
                data-testid="input-photo-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Enter section description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createSectionMutation.isPending}
                data-testid="input-photo-description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-photo-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Patrol">Patrol</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={createSectionMutation.isPending}
                data-testid="input-photo-file"
              />
              {photoPreview && (
                <div className="mt-4">
                  <img src={photoPreview} alt="Preview" className="max-w-xs rounded-md" />
                </div>
              )}
            </div>

            <Button
              onClick={() => createSectionMutation.mutate()}
              disabled={
                createSectionMutation.isPending ||
                !title.trim() ||
                !description.trim() ||
                !photo
              }
              data-testid="button-create-photo-section"
              className="w-full"
            >
              {createSectionMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photo Section
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Photo Sections Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Photo Sections ({sections.length})
          </h2>
          {isLoaded && sections.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No photo sections yet. Create one above.
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section: any) => (
                <Card key={section.id} className="overflow-hidden flex flex-col">
                  {section.photo && (
                    <img
                      src={section.photo}
                      alt={section.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {section.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSectionMutation.mutate(section.id)}
                      disabled={deleteSectionMutation.isPending}
                      data-testid={`button-delete-section-${section.id}`}
                      className="w-full justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-destructive mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
