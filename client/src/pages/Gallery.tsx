import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ChevronLeft, ChevronRight, Camera, Image as ImageIcon, Upload, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import soRaidImage from "@assets/sotes_1766383105164.png";
import vetoImage from "@assets/verotes_1766383121532.jpg";
import trainingImage from "@assets/trainingtes_1766383216177.jpg";
import tsiuImage from "@assets/tsiutes_1766383363937.png";
import ttruImage from "@assets/ttrutes_1766383459396.jpg";
import nightPatrolImage from "@assets/tesnightpatrol_1766383648634.png";
import trafficStopImage from "@assets/pulledoverhaha_1766383803337.png";
import teamFormationImage from "@assets/patroltes_1766390116884.png";
import missionImage from "@assets/image_1766390603511.png";

const galleryImages: Array<{
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
}> = [
  {
    id: 1,
    title: "Tactical Operation Alpha",
    description: "VETO unit executing high-risk containment",
    category: "Operations",
    image: vetoImage,
  },
  {
    id: 2,
    title: "Training Exercise",
    description: "Weekly combat drills and coordination practice",
    category: "Training",
    image: trainingImage,
  },
  {
    id: 3,
    title: "Special Operations Raid",
    description: "SO division during strategic operation",
    category: "Operations",
    image: soRaidImage,
  },
  {
    id: 4,
    title: "High-Speed Pursuit",
    description: "TSIU intercepting fleeing suspects",
    category: "Patrol",
    image: tsiuImage,
  },
  {
    id: 5,
    title: "Medical Response",
    description: "TTRU providing on-scene trauma care",
    category: "Medical",
    image: ttruImage,
  },
  {
    id: 6,
    title: "Team Formation",
    description: "Full T.E.S deployment for major operation",
    category: "Team",
    image: teamFormationImage,
  },
  {
    id: 7,
    title: "Night Patrol",
    description: "Officers maintaining safety after dark",
    category: "Patrol",
    image: nightPatrolImage,
  },
  {
    id: 8,
    title: "Traffic Stop",
    description: "T.E.S officer conducting a routine traffic stop",
    category: "Patrol",
    image: trafficStopImage,
  },
  {
    id: 9,
    title: "Mission Focused",
    description: "T.E.S. officers dedicated to keeping you safe",
    category: "Operations",
    image: missionImage,
  },
];

const categories = ["All", "Operations", "Training", "Patrol", "Medical", "Team", "Events"];

export default function Gallery() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageData, setImageData] = useState<Record<number, string>>({
    1: vetoImage,
    2: trainingImage,
    3: soRaidImage,
    4: tsiuImage,
    5: ttruImage,
    6: teamFormationImage,
    7: nightPatrolImage,
    8: trafficStopImage,
    9: missionImage,
  });

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const canEditPhotos = userId && (userRole === "public_relations" || userRole === "public_relations_lead" || userRole === "directors_office");

  // Fetch photo sections from backend
  const { data: photoSectionsData } = useQuery({
    queryKey: ["/api/photo-sections"],
    queryFn: async () => {
      const response = await fetch("/api/photo-sections");
      if (!response.ok) throw new Error("Failed to fetch photo sections");
      return response.json();
    },
  });

  const [photoMetadata, setPhotoMetadata] = useState<Record<number, { title: string; description: string }>>({});
  const [editingPhoto, setEditingPhoto] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const getPhotoMetadata = (id: number) => {
    return photoMetadata[id] || galleryImages.find((img) => img.id === id) || { title: "", description: "" };
  };

  const getRoleDisplay = () => {
    if (userRole === "public_relations") return "Public Relations";
    if (userRole === "directors_office") return "Directors Office";
    return "User";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (selectedImage !== null) {
        setImageData((prev) => ({
          ...prev,
          [selectedImage]: result,
        }));
        sendDiscordNotification(`Photo updated`, `Photo #${selectedImage} image was changed by **${username}** (${getRoleDisplay()})`);
        toast({ title: "Photo updated successfully", duration: 2000 });
      }
    };
    reader.readAsDataURL(file);
  };

  const sendDiscordNotification = async (title: string, description: string) => {
    try {
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      if (!webhookUrl) return;
      
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `Gallery Updated: ${title}`,
              description: description,
              color: 3447003,
              timestamp: new Date().toISOString(),
              footer: { text: "T.E.S Gallery" },
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startEditingMetadata = (id: number) => {
    const metadata = getPhotoMetadata(id);
    setEditingPhoto(id);
    setEditTitle(metadata.title);
    setEditDescription(metadata.description);
  };

  const saveMetadata = () => {
    if (editingPhoto !== null) {
      setPhotoMetadata((prev) => ({
        ...prev,
        [editingPhoto]: {
          title: editTitle,
          description: editDescription,
        },
      }));
      sendDiscordNotification(
        `Metadata Updated`,
        `Photo "${editTitle}" metadata was updated by **${username}** (${getRoleDisplay()})`
      );
      toast({ title: "Photo updated successfully", duration: 2000 });
      setEditingPhoto(null);
    }
  };

  // Combine gallery images with photo sections from backend
  const photoSections = photoSectionsData?.photoSections || [];
  const combinedImages = [
    ...galleryImages,
    ...photoSections.map((section: any, index: number) => ({
      id: 1000 + index,
      title: section.title,
      description: section.description,
      category: section.category || "Events",
      image: section.photo,
    })),
  ];

  const filteredImages =
    selectedCategory === "All"
      ? combinedImages
      : combinedImages.filter((img) => img.category === selectedCategory);

  const currentImageIndex = selectedImage !== null 
    ? filteredImages.findIndex((img) => img.id === selectedImage)
    : -1;

  const navigateImage = (direction: "prev" | "next") => {
    if (currentImageIndex === -1) return;
    
    if (direction === "prev") {
      const newIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
      setSelectedImage(filteredImages[newIndex].id);
    } else {
      const newIndex = currentImageIndex === filteredImages.length - 1 ? 0 : currentImageIndex + 1;
      setSelectedImage(filteredImages[newIndex].id);
    }
  };

  const currentImage = combinedImages.find((img) => img.id === selectedImage);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-accent rounded-md">
              <Camera className="h-10 w-10" />
            </div>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4"
            data-testid="text-page-title"
          >
            Photo Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A collection of operational photos, training exercises, and team moments from T.E.S.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="uppercase text-xs tracking-wide"
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover-elevate group"
              onClick={() => setSelectedImage(image.id)}
              data-testid={`card-gallery-${image.id}`}
            >
              <div className="aspect-video bg-accent flex items-center justify-center relative overflow-hidden">
                {imageData[image.id] ? (
                  <img
                    src={imageData[image.id]}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                ) : image.image ? (
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{getPhotoMetadata(image.id).title || image.title}</h3>
                <p className="text-sm text-muted-foreground">{getPhotoMetadata(image.id).description || image.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <Card className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No images found in this category.</p>
          </Card>
        )}

        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setSelectedImage(null)}
              data-testid="button-close-lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              data-testid="button-prev-image"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              data-testid="button-next-image"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-accent rounded-md flex items-center justify-center mb-4 overflow-hidden">
                {currentImage && imageData[currentImage.id] ? (
                  <img
                    src={imageData[currentImage.id]}
                    alt={currentImage.title}
                    className="w-full h-full object-cover"
                  />
                ) : currentImage?.image ? (
                  <img
                    src={currentImage.image}
                    alt={currentImage.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-24 w-24 text-muted-foreground" />
                )}
              </div>
              {currentImage && (
                <div className="text-center text-white mb-4">
                  <h3 className="text-xl font-semibold mb-2">{getPhotoMetadata(currentImage.id).title || currentImage.title}</h3>
                  <p className="text-white/70">{getPhotoMetadata(currentImage.id).description || currentImage.description}</p>
                </div>
              )}
              {canEditPhotos && currentImage && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={triggerFileInput}
                    className="text-white"
                    data-testid="button-change-photo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => startEditingMetadata(currentImage.id)}
                    className="text-white"
                    data-testid="button-edit-metadata"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Info
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    data-testid="input-photo-file"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <Card className="p-8 mt-12 text-center bg-card" data-testid="card-share-moments">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">
            Share Your Moments
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have operational photos or memorable T.E.S moments? Submit them through our Discord
            server to be featured in the gallery.
          </p>
        </Card>

        <Dialog open={editingPhoto !== null} onOpenChange={(open) => !open && setEditingPhoto(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Photo Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Photo title"
                  data-testid="input-edit-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Photo description"
                  data-testid="input-edit-description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPhoto(null)} data-testid="button-cancel-edit">
                Cancel
              </Button>
              <Button onClick={saveMetadata} data-testid="button-save-edit">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
