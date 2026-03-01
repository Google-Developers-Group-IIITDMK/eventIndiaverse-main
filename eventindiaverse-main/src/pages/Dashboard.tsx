import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [regRes, wishRes, evtRes] = await Promise.all([
        supabase.from("event_registrations").select("*, events(*)").eq("user_id", user.id),
        supabase.from("wishlists").select("*, events(*)").eq("user_id", user.id),
        supabase.from("events").select("*").eq("created_by", user.id),
      ]);
      setRegistrations(regRes.data || []);
      setWishlists(wishRes.data || []);
      setMyEvents(evtRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const removeWishlist = async (id: string) => {
    await supabase.from("wishlists").delete().eq("id", id);
    setWishlists((prev) => prev.filter((w) => w.id !== id));
    toast.success("Removed from wishlist");
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    setMyEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/create-event")} className="rounded-xl">
            + Create Event
          </Button>
        </div>

        <Tabs defaultValue="registrations">
          <TabsList className="mb-6">
            <TabsTrigger value="registrations">Registered ({registrations.length})</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist ({wishlists.length})</TabsTrigger>
            <TabsTrigger value="my-events">My Events ({myEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />)}</div>
            ) : registrations.length > 0 ? (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div key={reg.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                    <div>
                      <Link to={`/event/${reg.event_id}`} className="font-semibold hover:text-primary transition-colors">
                        {reg.events?.title || "Event"}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {reg.events?.city}, {reg.events?.state} · {reg.events?.start_date ? format(new Date(reg.events.start_date), "MMM d, yyyy") : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${reg.payment_status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {reg.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>You haven't registered for any events yet.</p>
                <Button variant="link" onClick={() => navigate("/")}>Browse events</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlists.length > 0 ? (
              <div className="space-y-3">
                {wishlists.map((w) => (
                  <div key={w.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                    <Link to={`/event/${w.event_id}`} className="font-semibold hover:text-primary transition-colors">
                      {w.events?.title || "Event"}
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => removeWishlist(w.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>Your wishlist is empty.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-events">
            {myEvents.length > 0 ? (
              <div className="space-y-3">
                {myEvents.map((evt) => (
                  <div key={evt.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                    <div>
                      <Link to={`/event/${evt.id}`} className="font-semibold hover:text-primary transition-colors">
                        {evt.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{evt.city}, {evt.state}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteEvent(evt.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>You haven't created any events.</p>
                <Button variant="link" onClick={() => navigate("/create-event")}>Create your first event</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
