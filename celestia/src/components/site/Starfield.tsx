const stars = Array.from({ length: 70 }, (_, i) => ({
  top: (i * 37) % 100,
  left: (i * 61) % 100,
  size: (i % 3) + 1,
  delay: (i % 10) * 0.4,
}));

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
