import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Copy, Check, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminKeys() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState("public_relations");
  const [username, setUsername] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!userRole || !["directors_office", "public_relations_lead"].includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [userRole, navigate, toast]);

  const { data: keysData, isLoading, refetch } = useQuery({
    queryKey: ["/api/access-keys"],
    queryFn: async () => {
      const response = await fetch("/api/access-keys", {
        headers: { "x-user-id": userId || "" },
      });
      if (!response.ok) throw new Error("Failed to fetch keys");
      return response.json();
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const createKeyMutation = useMutation({
    mutationFn: async () => {
      const roleToCreate = isPRLead ? "public_relations" : selectedRole;
      const response = await fetch("/api/access-keys/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "",
        },
        body: JSON.stringify({ role: roleToCreate, username }),
        credentials: "include",
      });
      if (response.status === 403) {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/login");
        throw new Error("Session expired");
      }
      if (!response.ok) throw new Error("Failed to create key");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-keys"] });
      toast({ title: "Key created successfully", duration: 2000 });
      setUsername("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create key",
        description: error.message === "Session expired" ? "Please log in again" : "Username is required",
        variant: "destructive",
      });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/access-keys/${keyId}`, {
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
      if (!response.ok) throw new Error("Failed to delete key");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-keys"] });
      toast({ title: "Key deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete key",
        description: error.message === "Session expired" ? "Please log in again" : "Failed to delete key",
        variant: "destructive",
      });
    },
  });

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!userRole || !["directors_office", "public_relations_lead"].includes(userRole)) {
    return null;
  }

  const keys = keysData?.keys || [];
  const isPRLead = userRole === "public_relations_lead";
  const unusedKeys = isPRLead 
    ? keys.filter((k: any) => !k.used && k.role === "public_relations")
    : keys.filter((k: any) => !k.used);
  const usedKeys = isPRLead
    ? keys.filter((k: any) => k.used && k.role === "public_relations")
    : keys.filter((k: any) => k.used);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Key Management</h1>
        <p className="text-muted-foreground mb-8">
          Create and manage access keys for your team
        </p>

        {/* Create Key Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Key</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={createKeyMutation.isPending}
                data-testid="input-username"
              />
            </div>
            {!isPRLead && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public_relations">
                      Public Relations
                    </SelectItem>
                    <SelectItem value="public_relations_lead">
                      Public Relations Lead
                    </SelectItem>
                    <SelectItem value="directors_office">
                      Directors Office
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isPRLead && (
              <div className="flex-1 text-sm text-muted-foreground">
                Creating key for: <span className="font-semibold">Public Relations</span>
              </div>
            )}
            <Button
              onClick={() => createKeyMutation.mutate()}
              disabled={createKeyMutation.isPending || !username.trim()}
              data-testid="button-create-key"
            >
              {createKeyMutation.isPending ? "Creating..." : "Create Key"}
            </Button>
          </div>
        </Card>

        {/* Unused Keys */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Available Keys ({unusedKeys.length})
          </h2>
          {unusedKeys.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No available keys. Create one above.
            </Card>
          ) : (
            <div className="grid gap-3">
              {unusedKeys.map((key: any) => (
                <Card
                  key={key.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{key.username}</p>
                    <p className="font-mono text-sm text-muted-foreground">{key.key}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.role.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(key.key)}
                      data-testid={`button-copy-key-${key.id}`}
                    >
                      {copiedKey === key.key ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKeyMutation.mutate(key.id)}
                      disabled={deleteKeyMutation.isPending}
                      data-testid={`button-delete-key-${key.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Used Keys */}
        {usedKeys.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Assigned Keys ({usedKeys.length})
            </h2>
            <div className="grid gap-3">
              {usedKeys.map((key: any) => (
                <Card
                  key={key.id}
                  className="p-4 flex items-center justify-between opacity-75"
                >
                  <div>
                    <p className="font-semibold">{key.username}</p>
                    <p className="font-mono text-sm text-muted-foreground">{key.key}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.role.replace("_", " ")} • Assigned
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteKeyMutation.mutate(key.id)}
                    disabled={deleteKeyMutation.isPending}
                    data-testid={`button-delete-key-${key.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
