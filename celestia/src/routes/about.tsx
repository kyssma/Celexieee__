import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMG = "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1400&q=80";
const OG = "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&h=630&fit=crop";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — CELESTIA" },
      { name: "description", content: "The story behind CELESTIA, a dreamy boutique of space-inspired treasures." },
      { property: "og:title", content: "About Us — CELESTIA" },
      { property: "og:description", content: "The story behind CELESTIA, a dreamy boutique of space-inspired treasures." },
      { property: "og:image", content: OG },
      { name: "twitter:image", content: OG },
    ],
  }),
  component: About,
});

const values = [
  { icon: Star, title: "Made with wonder", text: "Every piece is chosen to spark the same awe you feel looking up at the night sky." },
  { icon: Moon, title: "Gentle on Earth", text: "We favor recycled packaging and long-lasting materials, so our planet stays as lovely as the others." },
  { icon: Sparkles, title: "Wrapped in magic", text: "Each order arrives gift-ready, wrapped in shimmering stardust tissue." },
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="animate-rise">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Our story</p>
          <h1 className="mt-2 font-display text-4xl text-glow md:text-5xl">Born under a pink nebula</h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
            CELESTIA began with a simple dream: that everyone deserves a little piece of the universe. We create planets, galaxies, moons and starlit keepsakes that turn ordinary rooms into tiny observatories of wonder.
          </p>
          <Button variant="cosmic" size="lg" className="mt-8" asChild><Link to="/shop">Explore Collection</Link></Button>
        </div>
        <img src={IMG} alt="Milky Way over the horizon" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-glow animate-float" />
      </div>
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="glass glow-hover rounded-3xl p-8">
            <v.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-serif text-2xl">{v.title}</h2>
            <p className="mt-2 text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
