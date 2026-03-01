import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";

const categories = ["All", "Tech", "Arts", "Sports", "Education", "Cultural", "Concert", "Online Event", "Talent Show"];

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [eventType, setEventType] = useState("All");
  const [city, setCity] = useState("");

  const { data: events, isLoading } = useEvents({
    category,
    city: city || undefined,
    eventType: eventType === "All" ? undefined : eventType,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Events<br />
            <span className="text-primary">Across India</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find tech conferences, cultural festivals, concerts, sports events, and more happening near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl h-12"
              />
            </div>
            <Input
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl h-12 sm:w-40"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-28 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {category === "All" ? "All Events" : `${category} Events`}
          </h2>
          <span className="text-sm text-muted-foreground">
            {events?.length || 0} events found
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl h-80 animate-pulse border border-border" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No events found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-sm text-muted-foreground">
          <p>© 2026 EventsIndia. Discover amazing events across India.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
