import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Users,
  UserCheck,
  Star,
  Target,
  Crosshair,
  Zap,
  Heart,
  Radio,
  Megaphone,
} from "lucide-react";

const leadership = [
  {
    title: "Director's Office",
    icon: Shield,
    description:
      "Provides overall direction for T.E.S, oversees agency-wide decisions, and ensures all units operate with purpose and consistency.",
    level: "Command",
  },
  {
    title: "Internal Affairs (IA)",
    icon: Eye,
    description:
      "Our highest-level oversight division. IA maintains integrity across the agency, handles all misconduct investigations, and ensures every officer upholds T.E.S standards.",
    level: "Oversight",
  },
  {
    title: "High Rank (HR)",
    icon: Users,
    description:
      "Manages questions, concerns, documentation, and officer support. HR ensures all personnel are properly guided and informed.",
    level: "Management",
  },
  {
    title: "Division Leads",
    icon: Star,
    description:
      "Command the specialized units within T.E.S, maintain training standards, and guide members through advanced operations.",
    level: "Leadership",
  },
  {
    title: "Supervisors",
    icon: UserCheck,
    description:
      "Maintain day-to-day structure, oversee officer performance, and ensure field operations remain efficient and rule-compliant.",
    level: "Supervision",
  },
];

const divisionLeaders = [
  { name: "Chief V.E.T.O. Officer", division: "Violent Enforcement & Tactical Operations", icon: Target },
  { name: "Special Operations Commander", division: "Special Operations", icon: Crosshair },
  { name: "TSIU Commander", division: "Tactical Speed Intervention Unit", icon: Zap },
  { name: "TTRU Chief", division: "Tactical Trauma Response Unit", icon: Heart },
  { name: "Undercover Director", division: "Undercover", icon: Eye },
  { name: "Intelligence Handler", division: "Intelligence", icon: Radio },
  { name: "Executive PR Officer", division: "Public Relations", icon: Megaphone },
];

export default function Personnel() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1
            className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4"
            data-testid="text-page-title"
          >
            Our Personnel
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The strength and professionalism of T.E.S comes from the teams who keep the agency
            organized, disciplined, and mission-ready.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 text-center">
            Key Leadership & Support Groups
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            These units work behind the scenes to maintain standards, oversee operations, and ensure
            every officer in T.E.S is operating at peak effectiveness.
          </p>

          <div className="space-y-4">
            {leadership.map((role, index) => (
              <Card
                key={index}
                className="p-6"
                data-testid={`card-leadership-${index}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="p-3 bg-accent rounded-md flex-shrink-0 w-fit">
                    <role.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{role.title}</h3>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {role.level}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 text-center">
            Division Leadership
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Each division is led by experienced officers who specialize in their unit's operations.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisionLeaders.map((leader, index) => (
              <Card
                key={index}
                className="p-5"
                data-testid={`card-division-lead-${index}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent rounded-md">
                    <leader.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{leader.name}</h3>
                    <p className="text-sm text-muted-foreground">{leader.division}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-8 bg-card text-center" data-testid="card-full-roster">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-4">
              Full Personnel Roster
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              The complete command staff and personnel list is available through our Discord server.
              Join to view the full roster and connect with our team.
            </p>
            <a href="https://discord.gg/bYbVFzknBv" target="_blank" rel="noopener noreferrer">
              <Button variant="default" data-testid="button-discord">
                Available on Discord
              </Button>
            </a>
          </Card>
        </section>
      </div>
    </div>
  );
}
