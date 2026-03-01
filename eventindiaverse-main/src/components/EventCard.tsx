import { Link } from "react-router-dom";
import { Calendar, MapPin, IndianRupee, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  event_type: string;
  registration_fee: number;
  start_date: string;
  city: string;
  state: string;
  image_url: string | null;
  event_status: string;
}

const categoryColors: Record<string, string> = {
  Tech: "bg-[hsl(var(--tag-tech))] text-[hsl(var(--tag-tech-text))]",
  Arts: "bg-[hsl(var(--tag-arts))] text-[hsl(var(--tag-arts-text))]",
  Sports: "bg-[hsl(var(--tag-sports))] text-[hsl(var(--tag-sports-text))]",
  Education: "bg-[hsl(var(--tag-education))] text-[hsl(var(--tag-education-text))]",
  Cultural: "bg-[hsl(var(--tag-cultural))] text-[hsl(var(--tag-cultural-text))]",
  Concert: "bg-[hsl(var(--tag-concert))] text-[hsl(var(--tag-concert-text))]",
  "Online Event": "bg-[hsl(var(--tag-online))] text-[hsl(var(--tag-online-text))]",
  "Talent Show": "bg-[hsl(var(--tag-talent))] text-[hsl(var(--tag-talent-text))]",
};

const EventCard = ({
  id, title, description, category, event_type, registration_fee,
  start_date, city, state, image_url, event_status,
}: EventCardProps) => {
  return (
    <Link to={`/event/${id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${categoryColors[category] || "bg-secondary text-secondary-foreground"} border-0 text-xs font-semibold`}>
              {category}
            </Badge>
            {event_status === "Ongoing" && (
              <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-0 text-xs">
                Live
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={event_type === "Free" ? "default" : "secondary"} className="border-0 text-xs font-bold">
              {event_type === "Free" ? "FREE" : `₹${registration_fee}`}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(start_date), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {city}, {state}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
