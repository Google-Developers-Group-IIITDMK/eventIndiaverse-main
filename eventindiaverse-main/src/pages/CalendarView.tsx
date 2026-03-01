import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: events } = useEvents();

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startDayOfWeek = getDay(startOfMonth(currentMonth));

  const getEventsForDay = (day: Date) => {
    return events?.filter((e) => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString());
    }) || [];
  };

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Event Calendar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[160px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-3 text-center text-xs font-semibold text-muted-foreground border-b border-border">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3 min-h-[100px] border-b border-r border-border" />
            ))}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 min-h-[100px] border-b border-r border-border cursor-pointer hover:bg-secondary/50 transition-colors ${isSelected ? "bg-primary/10" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="text-sm font-medium">{format(day, "d")}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div key={e.id} className="text-[10px] bg-primary/10 text-primary rounded px-1 py-0.5 truncate">
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Events on {format(selectedDay, "MMMM d, yyyy")}
            </h2>
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Link key={event.id} to={`/event/${event.id}`} className="block bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.city}, {event.state} · {event.category}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {event.event_type === "Free" ? "Free" : `₹${event.registration_fee}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events on this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
