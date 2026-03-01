import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, User, Phone, Heart, Bell, ArrowLeft, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { useEvent } from "@/hooks/useEvents";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import Header from "@/components/Header";
import EventRegistrationDialog from "@/components/EventRegistrationDialog";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id || "");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleWishlist = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    const { error } = await supabase.from("wishlists").insert({ user_id: user.id, event_id: id });
    if (error) {
      if (error.code === "23505") toast.info("Already in your wishlist");
      else toast.error("Failed to add to wishlist");
    } else toast.success("Added to wishlist!");
  };

  const handleReminder = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    const { error } = await supabase.from("reminders").insert({ user_id: user.id, event_id: id });
    if (error) {
      if (error.code === "23505") toast.info("Reminder already set");
      else toast.error("Failed to set reminder");
    } else toast.success("Reminder set! You'll be notified before the event.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-card rounded-2xl" />
            <div className="h-8 bg-card rounded w-1/2" />
            <div className="h-4 bg-card rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <Button variant="link" onClick={() => navigate("/")}>Go back home</Button>
        </div>
      </div>
    );
  }

  const deadlinePassed = isPast(new Date(event.registration_deadline));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 rounded-xl" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="text-xs">{event.category}</Badge>
                <Badge variant={event.event_type === "Free" ? "default" : "secondary"} className="text-xs">
                  {event.event_type === "Free" ? "FREE" : `₹${event.registration_fee}`}
                </Badge>
                <Badge variant="outline" className="text-xs">{event.event_status}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" /> Start Date
                </div>
                <p className="font-semibold">{format(new Date(event.start_date), "PPP 'at' p")}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" /> End Date
                </div>
                <p className="font-semibold">{format(new Date(event.end_date), "PPP 'at' p")}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" /> Venue
                </div>
                <p className="font-semibold">{event.venue}</p>
                <p className="text-sm text-muted-foreground">{event.city}, {event.state}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" /> Registration Deadline
                </div>
                <p className={`font-semibold ${deadlinePassed ? "text-destructive" : ""}`}>
                  {format(new Date(event.registration_deadline), "PPP")}
                  {deadlinePassed && " (Closed)"}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-2">Organizer</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {event.organizer_name}
                </div>
                {event.organizer_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {event.organizer_contact}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
              {event.event_type === "Paid" && (
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">Registration Fee</p>
                  <p className="text-3xl font-bold text-primary">₹{event.registration_fee}</p>
                </div>
              )}

              <Button
                className="w-full rounded-xl mb-3"
                size="lg"
                disabled={deadlinePassed || event.event_status === "Completed"}
                onClick={() => {
                  if (!user) { toast.error("Please login first"); navigate("/login"); return; }
                  setShowRegister(true);
                }}
              >
                {deadlinePassed ? "Registration Closed" : event.event_status === "Completed" ? "Event Completed" : "Register Now"}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={handleWishlist}>
                  <Heart className="h-4 w-4 mr-2" /> Wishlist
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" onClick={handleReminder}>
                  <Bell className="h-4 w-4 mr-2" /> Remind
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRegister && event && (
        <EventRegistrationDialog
          event={event}
          open={showRegister}
          onClose={() => setShowRegister(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
