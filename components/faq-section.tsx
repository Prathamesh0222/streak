"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What does my Pro purchase include?",
    a: "Unlimited habits on Pro, increased AI limits, and unlimited calendar history for 30 days.",
  },
  {
    q: "Is this a subscription?",
    a: "No. It's a one-time payment that unlocks Pro for 30 days. There is no auto-renewal.",
  },
  {
    q: "How do I cancel?",
    a: "No cancellation is needed since there is no auto-renewal. Your Pro access ends automatically after 30 days.",
  },
  {
    q: "Do you offer refunds?",
    a: "We follow a fair refund policy for accidental duplicate charges.",
  },
];

export function FAQSection() {
  return (
    <>
      <div className="border-t w-full">
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-x">
          <div className="text-center mb-10">
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-300/70 border-red-500 text-red-700 dark:bg-red-900/50 border dark:border-red-500 dark:text-red-500 font-bold">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto space-y-4"
          >
            {FAQS.map((item, index) => (
              <AccordionItem key={item.q} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
