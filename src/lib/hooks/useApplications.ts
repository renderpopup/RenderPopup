import { useState, useEffect, useCallback } from 'react';
import {
  getUserApplications,
  getAllApplications,
  createApplication,
  updateApplicationStatus,
  hasUserApplied,
} from '../api/applications';
import type { InsertTables } from '../database.types';

export function useUserApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserApplications(userId);
      setApplications(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}

export function useAllApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllApplications();
      setApplications(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}

export function useApplicationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apply = async (application: InsertTables<'applications'>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createApplication(application);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: 'pending' | 'approved' | 'rejected'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateApplicationStatus(id, status);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkApplied = async (userId: string, eventId: string) => {
    try {
      return await hasUserApplied(userId, eventId);
    } catch (err) {
      console.error('Error checking application:', err);
      return false;
    }
  };

  return { apply, updateStatus, checkApplied, loading, error };
}

