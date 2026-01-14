import { supabase } from '../supabase';
import type { Application, InsertTables, UpdateTables } from '../database.types';

// Get user's applications
export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      events (
        id,
        title,
        date,
        location,
        category,
        status
      )
    `)
    .eq('user_id', userId)
    .order('applied_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get all applications (admin)
export async function getAllApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      events (
        id,
        title,
        date,
        location,
        category
      )
    `)
    .order('applied_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get applications for specific event
export async function getEventApplications(eventId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('event_id', eventId)
    .order('applied_at', { ascending: false });

  if (error) throw error;
  return data as Application[];
}

// Create application
export async function createApplication(application: InsertTables<'applications'>) {
  const { data, error } = await supabase
    .from('applications')
    .insert(application)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('이미 이 행사에 신청하셨습니다.');
    }
    throw error;
  }
  return data as Application;
}

// Update application status (admin)
export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected'
) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Application;
}

// Check if user has applied to event
export async function hasUserApplied(userId: string, eventId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// Get application statistics
export async function getApplicationStats() {
  const { data, error } = await supabase
    .from('applications')
    .select('status, applied_at');

  if (error) throw error;

  const total = data?.length || 0;
  const pending = data?.filter(a => a.status === 'pending').length || 0;
  const approved = data?.filter(a => a.status === 'approved').length || 0;
  const rejected = data?.filter(a => a.status === 'rejected').length || 0;

  return { total, pending, approved, rejected };
}


