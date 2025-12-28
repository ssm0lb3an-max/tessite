import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Crosshair,
  Zap,
  Heart,
  Eye,
  Radio,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import vetoLogo from "@assets/vetotes_1766482226049.png";
import soLogo from "@assets/specilops_1766482382846.png";
import tsiuLogo from "@assets/tsiu_1766482449771.png";
import ttruLogo from "@assets/ttru_1766482469129.png";
import ucLogo from "@assets/uc_1766482517292.png";
import intelLogo from "@assets/intel_1766482552528.png";
import prLogo from "@assets/pr_1766482593412.png";

const divisions = [
  {
    id: "veto",
    name: "VETO",
    fullName: "Violent Enforcement & Tactical Operations",
    type: "Main",
    icon: Target,
    logo: vetoLogo,
    description:
      "VETO responds to the most dangerous and unpredictable situations in Berkeley County. They manage violent incidents, enforce tactical control, and secure high-threat areas. Their focus is on containment, neutralizing risks, and maintaining public safety with efficiency and precision. This is our most elite division and our last line of defense against crime.",
    responsibilities: [
      "Manage extreme threat engagements",
      "Execute tactical containment",
      "Maintain crime suppression during most extreme crime",
      "Maintain readiness for immediate response",
    ],
    requirements: [
      "2.5+ K/D or 2500+ kills",
      "15+ days of playtime",
      "Tactical gamepass",
      "T.E.S. Officer IV",
      "POST Certified",
      "Advanced knowledge about policing, tactics and techniques",
    ],
  },
  {
    id: "so",
    name: "SO",
    fullName: "Special Operations",
    type: "Main",
    icon: Crosshair,
    logo: soLogo,
    description:
      "SO handles the most critical and high-risk operations in Berkeley County. They intervene in situations where precision, strategy, and coordination are essential. SO provides tactical support to other divisions and ensures operations stay controlled under high-pressure scenarios.",
    responsibilities: [
      "Execute high-risk operations and raids",
      "Support other divisions in tactical scenarios",
      "Suppress crime when it breaks out",
    ],
    requirements: [
      "1.5+ K/D",
      "5+ days of playtime",
      "Excellent knowledge about policing",
      "Tactical gamepass",
      "Officer II+",
    ],
  },
  {
    id: "tsiu",
    name: "TSIU",
    fullName: "Tactical Speed Intervention Unit",
    type: "Sub",
    icon: Zap,
    logo: tsiuLogo,
    description:
      "TSIU specializes in rapid response and high-speed pursuit of targets. They intercept suspects, secure high-risk areas, and support patrol units during emergencies. Officers are trained to react instantly, maintain situational awareness, and coordinate closely with tactical teams.",
    responsibilities: [
      "High-speed pursuits and interdiction",
      "Support patrol units during emergencies",
      "Deploy against the fastest of the criminals",
      "Maintain readiness by attending weekly trainings",
    ],
    requirements: ["35+ PITS", "60+ arrests", "Good knowledge of the map"],
  },
  {
    id: "ttru",
    name: "TTRU",
    fullName: "Tactical Trauma Response Unit",
    type: "Main",
    icon: Heart,
    logo: ttruLogo,
    description:
      "TTRU provides immediate medical and trauma support during field operations. They stabilize injured personnel, revive downed officers, and maintain readiness for emergencies. Their presence ensures officers and civilians receive critical care while operations continue safely.",
    responsibilities: [
      "On-scene medical response",
      "Revive our officers at the scene",
      "Maintain readiness for rapid deployment",
      "Train officers in trauma response and first aid",
    ],
    requirements: ["25+ revives", "1+ days of playtime", "Basic knowledge of medical terms"],
  },
  {
    id: "uc",
    name: "UC",
    fullName: "Undercover",
    type: "Sub",
    icon: Eye,
    logo: ucLogo,
    description:
      "Undercover officers infiltrate criminal networks and gather critical intelligence. They operate silently in high-risk environments, observing without detection. Their findings guide tactical operations, support INTEL analysis, and strengthen overall mission success.",
    responsibilities: [
      "Conduct undercover operations",
      "Provide intelligence to INTEL and other divisions",
      "Maintain cover and operational security",
      "Support tactical units with actionable insights",
    ],
    requirements: ["Investigator game pass", "5+ days of playtime"],
  },
  {
    id: "intel",
    name: "INTEL",
    fullName: "Intelligence",
    type: "Sub",
    icon: Radio,
    logo: intelLogo,
    description:
      "INTEL monitors criminal activity, tracks emerging threats, and analyzes patterns behind the scenes. They provide actionable insights to support planning and operations. Their work keeps T.E.S one step ahead, ensuring the agency can respond effectively to potential risks.",
    responsibilities: [
      "Gather and analyze activity patterns",
      "Monitor gang and suspect behavior",
      "Provide actionable intelligence to other divisions",
      "Maintain secure operational records",
    ],
    requirements: ["10+ days of playtime"],
  },
  {
    id: "pr",
    name: "PR",
    fullName: "Public Relations",
    type: "Sub",
    icon: Megaphone,
    logo: prLogo,
    description:
      "PR manages T.E.S' public image, presence, and community communications. They handle announcements, document operations, and maintain a respected reputation for the agency. PR ensures the community is informed while supporting recruitment and outreach initiatives.",
    responsibilities: [
      "Host booths and events for the public",
      "Make sure that T.E.S has a great public face",
      "Answer various questions that recruits may have",
    ],
    requirements: [
      "2+ weeks in T.E.S",
      "T.E.S. Officer III",
      "3+ days of playtime",
      "Good knowledge about the game",
    ],
  },
];

export default function Divisions() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1
            className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4"
            data-testid="text-page-title"
          >
            Divisions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tactical Emergency Services has seven specialized divisions that officers can join.
            Officers may join up to 2 primary divisions and unlimited secondary divisions.
            Each division plays a crucial role in maintaining safety across Berkeley County.
          </p>
        </div>

        <div className="space-y-8">
          {divisions.map((division, index) => (
            <Card
              key={division.id}
              className="p-6 sm:p-8"
              data-testid={`card-division-detail-${division.id}`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  {division.logo ? (
                    <img
                      src={division.logo}
                      alt={`${division.name} logo`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                      data-testid={`img-division-logo-${division.id}`}
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-md flex items-center justify-center">
                      <division.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold uppercase tracking-wide">{division.name}</h2>
                    <Badge variant="secondary" className="uppercase text-xs">
                      {division.type}
                    </Badge>
                  </div>

                  <p className="text-lg text-muted-foreground mb-2">{division.fullName}</p>

                  <p className="text-base mb-6">{division.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold uppercase text-sm tracking-wide mb-3 text-muted-foreground">
                        Key Responsibilities
                      </h3>
                      <ul className="space-y-2">
                        {division.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-foreground mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold uppercase text-sm tracking-wide mb-3 text-muted-foreground">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {division.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {index < divisions.length - 1 && <div className="border-b border-border -mx-6 sm:-mx-8 mt-8" />}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
