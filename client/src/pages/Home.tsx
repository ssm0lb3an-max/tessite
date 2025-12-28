import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Crosshair,
  Eye,
  Heart,
  Radio,
  UserCheck,
  Zap,
  Megaphone,
  Crown,
} from "lucide-react";
import tesLogo from "@assets/tes-logo.png";
import vetoLogo from "@assets/vetotes_1766482226049.png";
import soLogo from "@assets/specilops_1766482382846.png";
import tsiuLogo from "@assets/tsiu_1766482449771.png";
import ttruLogo from "@assets/ttru_1766482469129.png";
import ucLogo from "@assets/uc_1766482517292.png";
import intelLogo from "@assets/intel_1766482552528.png";
import prLogo from "@assets/pr_1766482593412.png";

const divisions = [
  {
    name: "VETO",
    fullName: "Violent Enforcement & Tactical Operations",
    description: "Elite division handling the most dangerous situations",
    icon: Target,
    logo: vetoLogo,
  },
  {
    name: "SO",
    fullName: "Special Operations",
    description: "Critical high-risk operations and tactical support",
    icon: Crosshair,
    logo: soLogo,
  },
  {
    name: "TSIU",
    fullName: "Tactical Speed Intervention Unit",
    description: "Rapid response and high-speed pursuit specialists",
    icon: Zap,
    logo: tsiuLogo,
  },
  {
    name: "TTRU",
    fullName: "Tactical Trauma Response Unit",
    description: "Medical and trauma support during field operations",
    icon: Heart,
    logo: ttruLogo,
  },
  {
    name: "UC",
    fullName: "Undercover",
    description: "Covert intelligence gathering and infiltration",
    icon: Eye,
    logo: ucLogo,
  },
  {
    name: "INTEL",
    fullName: "Intelligence",
    description: "Criminal activity monitoring and threat analysis",
    icon: Radio,
    logo: intelLogo,
  },
  {
    name: "PR",
    fullName: "Public Relations",
    description: "Community communications and outreach",
    icon: Megaphone,
    logo: prLogo,
  },
];

const requirements = [
  "200+ confirmed eliminations",
  "Minimum of 24 hours in-game",
  "Basic understanding of policing and combat tactics",
  "Proficient English",
];

const optional = ["POST Certification", "Tactical Gamepass"];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center justify-center bg-foreground text-primary-foreground py-24 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85)),
              radial-gradient(ellipse at 20% 30%, rgba(30,30,30,0.8) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(40,40,40,0.6) 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <img src={tesLogo} alt="T.E.S Logo" className="h-20 w-20" />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6"
            data-testid="text-hero-title"
          >
            Tactical Emergency Services
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Welcome to Tactical Emergency Services, we operate inside Berkeley County in Roblox,
            serving as a tactical agency built for rapid response and strategic combat. We focus on
            teamwork, discipline, and stopping crime.
          </p>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Our officers train to stay sharp, move fast, and handle anything from routine patrols to
            critical incidents. Inside TES, every officer plays a role in keeping the State of
            Concord safe.
          </p>
          <p className="text-base text-white/70 mb-6">
            Ready to move from civilian to an Officer? Hit the button below to start your TES entry
            process and join an agency that runs on speed, precision, and pure combat.
          </p>
          <Link href="/careers" data-testid="link-hero-apply">
            <Button
              size="lg"
              className="bg-white text-black border-white/20 uppercase tracking-wide font-semibold px-8"
              data-testid="button-hero-apply"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide mb-4" data-testid="text-divisions-title">
              Our Divisions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tactical Emergency Services (TES) has a total of seven various divisions that officers
              have an opportunity to join. Officers may join up to 2 primary divisions and unlimited secondary divisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {divisions.map((division) => (
              <Card
                key={division.name}
                className="p-6 hover-elevate transition-transform"
                data-testid={`card-division-${division.name.toLowerCase()}`}
              >
                <div className="flex items-start gap-4">
                  {division.logo ? (
                    <img
                      src={division.logo}
                      alt={`${division.name} logo`}
                      className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                      data-testid={`img-division-home-logo-${division.name.toLowerCase()}`}
                    />
                  ) : (
                    <div className="p-3 bg-accent rounded-md">
                      <division.icon className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg uppercase tracking-wide mb-1">
                      {division.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{division.fullName}</p>
                    <p className="text-sm">{division.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/divisions" data-testid="link-view-divisions">
              <Button variant="outline" className="uppercase tracking-wide" data-testid="button-view-divisions">
                View All Divisions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide mb-4" data-testid="text-requirements-title">
              Our Requirements
            </h2>
            <p className="text-muted-foreground">
              To ensure every T.E.S operative is mission-ready from day one, we ask that all
              applicants meet the following baseline standards before applying:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-background rounded-md"
                data-testid={`card-requirement-${index}`}
              >
                <CheckCircle className="h-5 w-5 text-foreground flex-shrink-0" />
                <span className="font-medium">{req}</span>
              </div>
            ))}
          </div>

          <div className="bg-background rounded-md p-6 mb-10" data-testid="card-optional-requirements">
            <p className="text-muted-foreground mb-4 text-center">
              The items below aren't required, but they can help you early on and make things
              smoother once you're in:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {optional.map((opt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-accent rounded-md"
                  data-testid={`badge-optional-${index}`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              If you meet these requirements, hit the button below and start your path into T.E.S.
              <br />
              If not, no worries — you're still welcome in the server, but please hold off on
              opening an application ticket until you qualify.
            </p>
            <Link href="/careers" data-testid="link-apply-requirements">
              <Button className="uppercase tracking-wide px-8" data-testid="button-apply-requirements">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide mb-4" data-testid="text-personnel-title">
              Our Personnel
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The strength and professionalism of T.E.S comes from the teams who keep the agency
              organized, disciplined, and mission-ready. These units work behind the scenes to
              maintain standards, oversee operations, and ensure every officer in T.E.S is operating
              at peak effectiveness.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <Card className="p-5" data-testid="card-personnel-director">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-md">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Director's Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides overall direction for T.E.S, oversees agency-wide decisions, and ensures
                    all units operate with purpose and consistency.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5" data-testid="card-personnel-ia">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-md">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Internal Affairs (IA)</h3>
                  <p className="text-sm text-muted-foreground">
                    Our highest-level oversight division. IA maintains integrity across the agency,
                    handles all misconduct investigations, and ensures every officer upholds T.E.S
                    standards.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5" data-testid="card-personnel-hr">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-md">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">High Rank (HR)</h3>
                  <p className="text-sm text-muted-foreground">
                    Manages questions, concerns, documentation, and officer support. HR ensures all
                    personnel are properly guided and informed.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5" data-testid="card-personnel-leads">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-md">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Division Leads & Supervisors</h3>
                  <p className="text-sm text-muted-foreground">
                    Command the specialized units within T.E.S, maintain training standards, guide
                    members through advanced operations, and ensure field operations remain efficient.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/personnel" data-testid="link-view-personnel">
              <Button variant="outline" className="uppercase tracking-wide" data-testid="button-view-personnel">
                View Full Roster
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-4">
            Ready to Join T.E.S?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Start your path to becoming part of Berkeley County's elite tactical response unit.
          </p>
          <Link href="/careers" data-testid="link-footer-cta">
            <Button
              size="lg"
              className="bg-white text-black border-white/20 uppercase tracking-wide font-semibold px-8"
              data-testid="button-footer-apply"
            >
              Begin Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
