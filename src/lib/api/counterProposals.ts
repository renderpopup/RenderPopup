import { supabase } from '../supabase';
import type { CounterProposal, InsertTables, UpdateTables } from '../database.types';

// Get user's counter proposals
export async function getUserCounterProposals(userId: string) {
  const { data, error } = await supabase
    .from('counter_proposals')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as CounterProposal[];
}

// Get all counter proposals (admin)
export async function getAllCounterProposals() {
  const { data, error } = await supabase
    .from('counter_proposals')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as CounterProposal[];
}

// Get single counter proposal
export async function getCounterProposalById(id: string) {
  const { data, error } = await supabase
    .from('counter_proposals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as CounterProposal;
}

// Create counter proposal
export async function createCounterProposal(proposal: InsertTables<'counter_proposals'>) {
  const { data, error } = await supabase
    .from('counter_proposals')
    .insert(proposal)
    .select()
    .single();

  if (error) throw error;
  return data as CounterProposal;
}

// Update counter proposal
export async function updateCounterProposal(
  id: string,
  updates: UpdateTables<'counter_proposals'>
) {
  const { data, error } = await supabase
    .from('counter_proposals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CounterProposal;
}

// Update counter proposal status (admin)
export async function updateCounterProposalStatus(
  id: string,
  status: 'pending' | 'accepted' | 'rejected'
) {
  const { data, error } = await supabase
    .from('counter_proposals')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CounterProposal;
}

// Delete counter proposal
export async function deleteCounterProposal(id: string) {
  const { error } = await supabase
    .from('counter_proposals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get counter proposal statistics
export async function getCounterProposalStats() {
  const { data, error } = await supabase
    .from('counter_proposals')
    .select('status');

  if (error) throw error;

  const total = data?.length || 0;
  const pending = data?.filter(p => p.status === 'pending').length || 0;
  const accepted = data?.filter(p => p.status === 'accepted').length || 0;
  const rejected = data?.filter(p => p.status === 'rejected').length || 0;

  return { total, pending, accepted, rejected };
}

