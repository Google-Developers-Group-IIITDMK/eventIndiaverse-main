import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";

const categories = ["Tech", "Arts", "Sports", "Education", "Cultural", "Concert", "Online Event", "Talent Show"];

const CreateEvent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Tech", event_type: "Free",
    registration_fee: "0", start_date: "", end_date: "", registration_deadline: "",
    city: "", state: "", venue: "", image_url: "", organizer_name: "", organizer_contact: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title || !form.description || !form.start_date || !form.end_date || !form.registration_deadline || !form.city || !form.state || !form.venue || !form.organizer_name) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.description.length > 500) {
      toast.error("Description must be 500 characters or less");
      return;
    }

    setLoading(true);
    const spamScore = calculateSpamScore(form.description);

    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description,
      category: form.category as any,
      event_type: form.event_type as any,
      registration_fee: parseFloat(form.registration_fee) || 0,
      start_date: form.start_date,
      end_date: form.end_date,
      registration_deadline: form.registration_deadline,
      city: form.city,
      state: form.state,
      venue: form.venue,
      image_url: form.image_url || null,
      organizer_name: form.organizer_name,
      organizer_contact: form.organizer_contact || null,
      spam_score: spamScore,
      created_by: user.id,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to create event");
    } else {
      if (spamScore >= 0.7) {
        toast.warning("Event created but flagged for review due to suspicious content.");
      } else {
        toast.success("Event created successfully!");
      }
      navigate("/dashboard");
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 border border-border space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label>Event Title *</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} className="mt-1.5" />
            </div>
            <div className="md:col-span-2">
              <Label>Description * ({form.description.length}/500)</Label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={500} rows={4} className="mt-1.5" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Event Type *</Label>
              <Select value={form.event_type} onValueChange={(v) => update("event_type", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.event_type === "Paid" && (
              <div>
                <Label>Registration Fee (₹)</Label>
                <Input type="number" value={form.registration_fee} onChange={(e) => update("registration_fee", e.target.value)} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label>Start Date & Time *</Label>
              <Input type="datetime-local" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>End Date & Time *</Label>
              <Input type="datetime-local" value={form.end_date} onChange={(e) => update("end_date", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Registration Deadline *</Label>
              <Input type="datetime-local" value={form.registration_deadline} onChange={(e) => update("registration_deadline", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>City *</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>State *</Label>
              <Input value={form.state} onChange={(e) => update("state", e.target.value)} className="mt-1.5" />
            </div>
            <div className="md:col-span-2">
              <Label>Venue *</Label>
              <Input value={form.venue} onChange={(e) => update("venue", e.target.value)} className="mt-1.5" />
            </div>
            <div className="md:col-span-2">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="https://..." className="mt-1.5" />
            </div>
            <div>
              <Label>Organizer Name *</Label>
              <Input value={form.organizer_name} onChange={(e) => update("organizer_name", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Organizer Contact</Label>
              <Input value={form.organizer_contact} onChange={(e) => update("organizer_contact", e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </div>
    </div>
  );
};

function calculateSpamScore(text: string): number {
  let score = 0;
  const spamWords = ["win", "prize", "free money", "guaranteed", "click here", "act now", "limited time", "congratulations", "winner", "earn money", "no risk"];
  const lower = text.toLowerCase();
  spamWords.forEach((word) => { if (lower.includes(word)) score += 0.15; });
  if (text === text.toUpperCase() && text.length > 10) score += 0.2;
  if ((text.match(/!/g) || []).length > 3) score += 0.1;
  if ((text.match(/[₹$]/g) || []).length > 2) score += 0.1;
  return Math.min(score, 0.99);
}

export default CreateEvent;
