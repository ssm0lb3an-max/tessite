import { Link } from "wouter";
import tesLogo from "@assets/tes-logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4" data-testid="text-footer-logo">
              <img src={tesLogo} alt="T.E.S Logo" className="h-8 w-8" />
              <span className="font-bold text-lg uppercase tracking-wide">
                Tactical Emergency Services
              </span>
            </div>
            <p className="text-white/70 text-sm max-w-md">
              Elite tactical agency in Berkeley County, Roblox. Built for rapid response and
              strategic combat. Serving the State of Concord with speed, precision, and discipline.
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/divisions" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-divisions">
                  Divisions
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/personnel" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-personnel">
                  Our Personnel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-gallery">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-footer-faq">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50 text-sm">
            Tactical Emergency Services - Berkeley County, State of Concord
          </p>
        </div>
      </div>
    </footer>
  );
}
