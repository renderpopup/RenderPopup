import { useState, useEffect, useCallback } from 'react';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../api/events';
import type { Event, InsertTables, UpdateTables } from '../database.types';

export function useEvents(filters?: {
  category?: string;
  status?: string;
  search?: string;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents(filters);
      setEvents(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.status, filters?.search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
}

export function useEventMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (event: InsertTables<'events'>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createEvent(event);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updates: UpdateTables<'events'>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateEvent(id, updates);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEvent(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}


