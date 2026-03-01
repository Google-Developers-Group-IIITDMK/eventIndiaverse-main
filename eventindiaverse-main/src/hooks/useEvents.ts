import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  event_type: string;
  registration_fee: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  city: string;
  state: string;
  venue: string;
  image_url: string | null;
  organizer_name: string;
  organizer_contact: string | null;
  event_status: string;
  spam_score: number;
  created_by: string | null;
  created_at: string;
}

export const useEvents = (filters?: {
  category?: string;
  city?: string;
  eventType?: string;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      let query = supabase.from("events").select("*").order("start_date", { ascending: true });

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category as any);
      }
      if (filters?.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters?.eventType === "Free") {
        query = query.eq("event_type", "Free");
      } else if (filters?.eventType === "Paid") {
        query = query.eq("event_type", "Paid");
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.status) {
        query = query.eq("event_status", filters.status as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });
};
