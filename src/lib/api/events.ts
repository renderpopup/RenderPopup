import { supabase } from '../supabase';
import type { Event, InsertTables, UpdateTables } from '../database.types';

// Get all events with optional filters
export async function getEvents(filters?: {
  category?: string;
  status?: string;
  search?: string;
}) {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Event[];
}

// Get single event by ID
export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Event;
}

// Create event (admin only)
export async function createEvent(event: InsertTables<'events'>) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

// Update event (admin only)
export async function updateEvent(id: string, updates: UpdateTables<'events'>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

// Delete event (admin only)
export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get event statistics
export async function getEventStats() {
  const { data: events, error } = await supabase
    .from('events')
    .select('status, category, applications_count');

  if (error) throw error;

  const totalEvents = events?.length || 0;
  const totalApplications = events?.reduce((sum, e) => sum + (e.applications_count || 0), 0) || 0;
  const categoryCount = events?.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    totalEvents,
    totalApplications,
    categoryCount,
    avgApplicationsPerEvent: totalEvents > 0 ? Math.round(totalApplications / totalEvents) : 0,
  };
}


