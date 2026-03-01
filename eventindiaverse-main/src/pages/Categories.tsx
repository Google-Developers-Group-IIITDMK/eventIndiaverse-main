import { Link } from "react-router-dom";
import { Laptop, Palette, Trophy, GraduationCap, Globe2, Music, Wifi, Star } from "lucide-react";
import Header from "@/components/Header";
import { useEvents } from "@/hooks/useEvents";

const categoryConfig = [
  { name: "Tech", icon: Laptop, desc: "Conferences, hackathons, and tech workshops" },
  { name: "Arts", icon: Palette, desc: "Art fairs, exhibitions, and creative workshops" },
  { name: "Sports", icon: Trophy, desc: "Marathons, tournaments, and fitness events" },
  { name: "Education", icon: GraduationCap, desc: "Seminars, bootcamps, and learning events" },
  { name: "Cultural", icon: Globe2, desc: "Festivals, heritage walks, and traditions" },
  { name: "Concert", icon: Music, desc: "Live music, DJ nights, and performances" },
  { name: "Online Event", icon: Wifi, desc: "Virtual workshops, webinars, and classes" },
  { name: "Talent Show", icon: Star, desc: "Open mics, auditions, and competitions" },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Browse by Category</h1>
          <p className="text-muted-foreground">Explore events across 8 categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryConfig.map(({ name, icon: Icon, desc }) => (
            <Link
              key={name}
              to={`/?category=${encodeURIComponent(name)}`}
              className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
