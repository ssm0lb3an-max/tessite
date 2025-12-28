import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/login", { key, password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("username", data.user.username || "User");
      toast({ title: "Login successful", description: "Redirecting...", duration: 2000 });
      setTimeout(() => navigate("/"), 1000);
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid key or password", variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      // First check if key exists and get its ID
      const keyCheck = await fetch(`/api/access-key/${key}`);
      if (!keyCheck.ok) {
        throw new Error("Invalid key");
      }

      const keyData = await keyCheck.json();
      const response = await apiRequest("POST", "/api/users/register", { keyId: keyData.id, password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("username", data.user.username || "User");
      toast({ title: "Registration successful", description: "Redirecting...", duration: 2000 });
      setTimeout(() => navigate("/"), 1000);
    },
    onError: (error: any) => {
      toast({ 
        title: "Registration failed", 
        description: error.message || "Failed to register", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !password) {
      toast({ title: "Error", description: "Please enter both key and password", variant: "destructive" });
      return;
    }

    if (isRegistering) {
      registerMutation.mutate();
    } else {
      loginMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">T.E.S Access</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isRegistering ? "Register with your assigned key" : "Login to access restricted features"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="key" className="block text-sm font-medium mb-2">
              Access Key
            </label>
            <Input
              id="key"
              type="text"
              placeholder="e.g., TES-XXXX-XXXX"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={loginMutation.isPending || registerMutation.isPending}
              data-testid="input-key"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending || registerMutation.isPending}
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending || registerMutation.isPending}
            data-testid="button-submit"
          >
            {loginMutation.isPending || registerMutation.isPending
              ? "Loading..."
              : isRegistering
              ? "Register"
              : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            {isRegistering
              ? "Already have an account?"
              : "New to T.E.S?"}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setKey("");
              setPassword("");
            }}
            data-testid="button-toggle-mode"
          >
            {isRegistering ? "Login instead" : "Register instead"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
