import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import tesLogo from "@assets/tes-logo.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Divisions", path: "/divisions" },
  { name: "Careers", path: "/careers" },
  { name: "Our Personnel", path: "/personnel" },
];

const moreItems = [
  { name: "Photo Gallery", path: "/gallery" },
  { name: "FAQ", path: "/faq" },
];

export function Navigation() {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setUserDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location === path;
  const isMoreActive = moreItems.some((item) => location === item.path);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img src={tesLogo} alt="T.E.S Logo" className="h-8 w-8" />
            <span className="font-bold text-lg tracking-wide uppercase" data-testid="text-logo">
              T.E.S
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`uppercase text-sm tracking-wide font-medium ${
                    isActive(item.path) ? "bg-accent" : ""
                  }`}
                  data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className={`uppercase text-sm tracking-wide font-medium flex items-center gap-1 ${
                  isMoreActive ? "bg-accent" : ""
                }`}
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                data-testid="button-more-dropdown"
              >
                More
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-150 ${
                    moreDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <div
                className={`absolute right-0 top-full mt-2 w-48 bg-card border border-card-border rounded-md shadow-lg overflow-hidden transition-all duration-150 ${
                  moreDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {moreItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`px-4 py-3 text-sm uppercase tracking-wide font-medium hover-elevate cursor-pointer ${
                        isActive(item.path) ? "bg-accent" : ""
                      }`}
                      data-testid={`link-more-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 pl-4 border-l border-border">
              {userId && userRole ? (
                <div className="relative" ref={userDropdownRef}>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    data-testid="button-user-menu"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm uppercase tracking-wide font-medium">
                      {userRole.replace("_", " ")}
                    </span>
                  </Button>
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-card border border-card-border rounded-md shadow-lg overflow-hidden transition-all duration-150 ${
                      userDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    {["directors_office", "public_relations_lead"].includes(userRole) && (
                      <Link href="/admin/keys">
                        <div
                          className={`px-4 py-3 text-sm uppercase tracking-wide font-medium hover-elevate cursor-pointer ${
                            isActive("/admin/keys") ? "bg-accent" : ""
                          }`}
                          data-testid="link-admin-keys"
                        >
                          Manage Keys
                        </div>
                      </Link>
                    )}
                    {["public_relations", "directors_office", "public_relations_lead"].includes(userRole) && (
                      <Link href="/admin/photos">
                        <div
                          className={`px-4 py-3 text-sm uppercase tracking-wide font-medium hover-elevate cursor-pointer ${
                            isActive("/admin/photos") ? "bg-accent" : ""
                          }`}
                          data-testid="link-admin-photos"
                        >
                          Manage Photos
                        </div>
                      </Link>
                    )}
                    <div
                      className="px-4 py-3 text-sm uppercase tracking-wide font-medium hover-elevate cursor-pointer border-t border-border flex items-center gap-2"
                      onClick={handleLogout}
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    className="uppercase text-sm tracking-wide font-medium"
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <div
        className={`md:hidden border-t border-border bg-background transition-all duration-250 overflow-hidden ${
          mobileMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`px-4 py-3 rounded-md uppercase text-sm tracking-wide font-medium hover-elevate ${
                  isActive(item.path) ? "bg-accent" : ""
                }`}
                data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.name}
              </div>
            </Link>
          ))}

          <div className="border-t border-border pt-2 mt-2">
            <div className="px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              More
            </div>
            {moreItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-4 py-3 rounded-md uppercase text-sm tracking-wide font-medium hover-elevate ${
                    isActive(item.path) ? "bg-accent" : ""
                  }`}
                  data-testid={`link-mobile-more-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
