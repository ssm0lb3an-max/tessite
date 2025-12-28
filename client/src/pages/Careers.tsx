import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, Star, Clock, MessageSquare, Target } from "lucide-react";
import tesLogo from "@assets/tes-logo.png";

const requirements = [
  { text: "200+ confirmed eliminations", icon: Target },
  { text: "Minimum of 24 hours in-game", icon: Clock },
  { text: "Basic understanding of policing and combat tactics", icon: Shield },
  { text: "Proficient English", icon: MessageSquare },
];

const optional = [
  { text: "POST Certification", description: "Helpful for faster advancement" },
  { text: "Tactical Gamepass", description: "Makes operations smoother" },
];

const steps = [
  {
    number: "01",
    title: "Meet Requirements",
    description: "Ensure you meet all baseline requirements before applying",
  },
  {
    number: "02",
    title: "Open Application Ticket",
    description: "Submit your application through our Discord server",
  },
  {
    number: "03",
    title: "Application Review",
    description: "Most applications are reviewed within 24-48 hours",
  },
  {
    number: "04",
    title: "Onboarding",
    description: "Upon acceptance, you'll be onboarded as a Probationary Officer",
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={tesLogo} alt="T.E.S Logo" className="h-16 w-16 mx-auto mb-6" />
          <h1
            className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4"
            data-testid="text-page-title"
          >
            Join T.E.S
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Ready to become part of Berkeley County's elite tactical response unit? Review the
            requirements below and start your application today.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-wide mb-4" data-testid="text-requirements-section">
              Application Requirements
            </h2>
            <p className="text-muted-foreground">
              To ensure every T.E.S operative is mission-ready from day one, meet these baseline
              standards:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {requirements.map((req, index) => (
              <Card
                key={index}
                className="p-5 flex items-start gap-4"
                data-testid={`requirement-card-${index}`}
              >
                <div className="p-2 bg-accent rounded-md flex-shrink-0">
                  <req.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{req.text}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-card mb-12" data-testid="card-optional-helpful">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wide">Optional But Helpful</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              The items below aren't required, but they can help you early on and make things
              smoother once you're in:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {optional.map((opt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-background rounded-md"
                >
                  <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{opt.text}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-wide mb-4">
              Application Process
            </h2>
            <p className="text-muted-foreground">
              Follow these steps to start your journey with T.E.S
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center" data-testid={`step-${index}`}>
                <div className="text-4xl font-bold text-muted-foreground mb-3">{step.number}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center" data-testid="card-ready-apply">
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-4">
              Ready to Apply?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              If you meet these requirements, hit the button below and start your path into T.E.S.
              If not, no worries — you're still welcome in the server, but please hold off on
              opening an application ticket until you qualify.
            </p>
            <Button
              size="lg"
              className="uppercase tracking-wide font-semibold px-8"
              onClick={() => window.open("https://discord.gg/bpCDkxey2W", "_blank")}
              data-testid="button-join-discord"
            >
              Join Discord to Apply
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6" data-testid="card-expect-review">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent rounded-md flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Quick Review</h3>
              <p className="text-sm text-muted-foreground">
                Most applications are reviewed within 24-48 hours
              </p>
            </div>
            <div className="text-center p-6" data-testid="card-expect-training">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent rounded-md flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Training Available</h3>
              <p className="text-sm text-muted-foreground">
                Multiple trainings hosted weekly by our FTO team
              </p>
            </div>
            <div className="text-center p-6" data-testid="card-expect-division">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent rounded-md flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Division Access</h3>
              <p className="text-sm text-muted-foreground">
                Apply for divisions once you reach Officer I rank
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
