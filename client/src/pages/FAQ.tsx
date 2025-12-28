import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "Will I get access to in game teams or specific vehicles?",
        a: "No, as we are not a whitelisted agency, we do not have a designated in-game team or vehicles for us.",
      },
      {
        q: "How long does the application process take?",
        a: "Most applications are reviewed within 24–48 hours. If additional info is needed, you'll be pinged in your application ticket.",
      },
      {
        q: "Do I need any gamepasses to join?",
        a: "No. Gamepasses are optional. They may help you later in operations, but they are not required to apply.",
      },
      {
        q: "If I don't meet all the requirements yet, can I still join?",
        a: "Not yet. You're welcome to stay in the server, but you must meet all listed requirements before opening an application ticket.",
      },
      {
        q: "What happens after I get accepted?",
        a: "You'll be onboarded as a Probationary Officer, given basic instructions, and introduced to the channels you will use throughout your career at T.E.S.",
      },
    ],
  },
  {
    category: "Training & Advancement",
    questions: [
      {
        q: "Is there training for Probationary Officers?",
        a: "Yes, multiple trainings are usually hosted weekly by our FTO team. Reach out to an FTO after joining to schedule one.",
      },
      {
        q: "Can I apply for a division right away?",
        a: "Not yet, you must reach Officer I before applying for any division. This ensures you understand the basics first.",
      },
      {
        q: "What is a 'ride-along,' and can recruits join?",
        a: "A ride-along lets you observe higher-ranking officers on-duty. Recruits may request a ride along with one of our officers using the appropriate channel.",
      },
      {
        q: "What rank will I start with?",
        a: "Recruits start at the beginning of the chain. Once hired, you begin as Probationary Officer unless you have POST certification or returning-officer status.",
      },
    ],
  },
  {
    category: "Rules & Conduct",
    questions: [
      {
        q: "Do I need to use a uniform?",
        a: "Uniforms are optional. If you choose to wear one, make sure you only use uniforms that match your rank and division.",
      },
      {
        q: "What happens if I break a rule as a Probationary?",
        a: "You can still be punished like any officer—warnings, strikes, suspensions, or denial of your application if the issue is serious.",
      },
      {
        q: "Who handles punishments or rule-breaking?",
        a: "Internal Affairs (IA). They investigate all reports and handle disciplinary actions fairly and independently.",
      },
      {
        q: "Will I get kicked out if I take a break?",
        a: "No, but if you're gone for more than a week, submit an LOA so our supervisors know.",
      },
      {
        q: "Will I have to be active every day?",
        a: "No. Consistency matters more than daily playtime. Just avoid being gone for long periods without an LOA.",
      },
    ],
  },
  {
    category: "Application Tips",
    questions: [
      {
        q: "What do supervisors look for in applications?",
        a: "Clear answers, effort, honesty, and basic understanding of policing/game mechanics. Short, rushed, or AI-generated responses are usually a red flag.",
      },
      {
        q: "What should I avoid during the application process?",
        a: "Don't rush. Don't copy answers. Don't lie. And don't use AI, as our detectors will catch it.",
      },
      {
        q: "How do I know if my application was denied or accepted?",
        a: "You'll receive a direct response inside your application ticket. If accepted, you'll get your roles and steps right after.",
      },
      {
        q: "If my application gets denied, can I reapply?",
        a: "Yes. Your ticket will state how long your cooldown is. Once it ends, you can reapply without issues.",
      },
    ],
  },
  {
    category: "General Questions",
    questions: [
      {
        q: "Who do I contact if I have questions?",
        a: "Use the Open a Ticket channel. High Rank will assist you. Avoid DM'ing command unless instructed to.",
      },
      {
        q: "Do I need voice chat?",
        a: "No, VC is optional. It's useful during events or training, but not required to join.",
      },
      {
        q: "Do I need previous experience to join T.E.S?",
        a: "No. Experience helps, but we're built to train new recruits from the ground up as long as you meet the basic requirements.",
      },
      {
        q: "Are divisions required?",
        a: 'No. Many officers are on "General Patrol." Divisions are optional, but a great way to get more from T.E.S. and only available once you reach Officer I.',
      },
      {
        q: "What should I do if I'm confused about something?",
        a: "Open a ticket in the proper channel. Asking questions shows responsibility, not weakness.",
      },
    ],
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border-b border-border last:border-b-0"
      data-testid={`faq-item-${index}`}
    >
      <button
        className="w-full py-5 flex items-start justify-between gap-4 text-left hover-elevate"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        data-testid={`button-faq-${index}`}
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-muted-foreground pr-12">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-accent rounded-md">
              <HelpCircle className="h-10 w-10" />
            </div>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-4"
            data-testid="text-page-title"
          >
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Below are some of the most common questions we receive about joining and operating
            within T.E.S.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card
              key={categoryIndex}
              className="p-6"
              data-testid={`faq-category-${categoryIndex}`}
            >
              <h2 className="text-xl font-bold uppercase tracking-wide mb-4 pb-4 border-b border-border">
                {category.category}
              </h2>
              <div>
                {category.questions.map((faq, questionIndex) => (
                  <FAQItem
                    key={questionIndex}
                    question={faq.q}
                    answer={faq.a}
                    index={categoryIndex * 10 + questionIndex}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 mt-12 text-center bg-card" data-testid="card-still-questions">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Open a ticket in our Discord server and our High Rank team will assist you. Asking
            questions shows responsibility, not weakness.
          </p>
        </Card>
      </div>
    </div>
  );
}
