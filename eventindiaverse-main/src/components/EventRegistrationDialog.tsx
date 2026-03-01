import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Event } from "@/hooks/useEvents";

interface Props {
  event: Event;
  open: boolean;
  onClose: () => void;
}

const EventRegistrationDialog = ({ event, open, onClose }: Props) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill all fields");
      return;
    }
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      user_id: user.id,
      full_name: name,
      email,
      phone,
      payment_status: event.event_type === "Free" ? "Completed" : "Pending",
    });
    setLoading(false);

    if (error) {
      if (error.code === "23505") toast.info("You're already registered for this event");
      else toast.error("Registration failed");
    } else {
      toast.success("Registered successfully!");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
          </div>
          {event.event_type === "Paid" && (
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Amount to pay</p>
              <p className="text-2xl font-bold">₹{event.registration_fee}</p>
              <p className="text-xs text-muted-foreground mt-1">Payment integration coming soon</p>
            </div>
          )}
          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Registering..." : event.event_type === "Free" ? "Complete Registration" : "Register & Pay Later"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
