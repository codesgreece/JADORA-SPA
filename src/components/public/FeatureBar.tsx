import { Crown, Flower2, Heart, Sparkles } from "lucide-react";

const features = [
  { icon: Heart, label: "Ασφαλές & ποιοτικό" },
  { icon: Sparkles, label: "Δημιουργική απασχόληση" },
  { icon: Crown, label: "Μοναδική εμπειρία" },
  { icon: Flower2, label: "Για κορίτσια από 4 ετών" },
];

export function FeatureBar({ vibeText }: { vibeText?: string }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-4 md:gap-8">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--soft-pink)] bg-white text-mauve shadow-[var(--shadow-soft)]">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <span className="text-sm leading-snug text-jadora-text">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="font-script shrink-0 text-2xl text-[color:var(--blush)] md:text-3xl md:pl-6">
          {vibeText || "More than a party it's a vibe ♡"}
        </p>
      </div>
    </section>
  );
}
