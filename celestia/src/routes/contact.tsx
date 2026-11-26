import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CELESTIA" },
      { name: "description", content: "Send a message to the CELESTIA team. We'd love to hear from you." },
      { property: "og:title", content: "Contact — CELESTIA" },
      { property: "og:description", content: "Send a message to the CELESTIA team." },
    ],
  }),
  component: Contact,
});

const field = "glass w-full rounded-2xl px-4 py-3 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) {
      toast.error("Please fill in your name, a valid email and a message.", { position: "top-center" });
      return;
    }
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:hello@celestia.shop?subject=${encodeURIComponent("Message from " + form.name)}&body=${body}`;
    toast.success("Opening your email app to send your message ✨", { position: "top-center" });
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-center font-display text-4xl text-glow md:text-5xl">Say Hello</h1>
      <p className="mt-3 text-center font-serif text-xl text-muted-foreground">Questions, custom orders, or just stargazing thoughts — we're listening.</p>
      <form onSubmit={submit} className="glass mt-10 space-y-4 rounded-[2rem] p-8">
        <input className={field} placeholder="Your name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={field} type="email" placeholder="Email address" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className={`${field} min-h-36`} placeholder="Your message" maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button variant="cosmic" size="lg" type="submit" className="w-full"><Send className="h-4 w-4" />Send message</Button>
      </form>
      <p className="mt-8 flex items-center justify-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" />hello@celestia.shop</p>
    </div>
  );
}
