import { supabase } from '../supabase';
import type { BrandProfile, InsertTables, UpdateTables } from '../database.types';

// Get user's brand profile
export async function getUserBrandProfile(userId: string) {
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as BrandProfile | null;
}

// Create brand profile
export async function createBrandProfile(profile: InsertTables<'brand_profiles'>) {
  const { data, error } = await supabase
    .from('brand_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('이미 프로필이 등록되어 있습니다.');
    }
    throw error;
  }
  return data as BrandProfile;
}

// Update brand profile
export async function updateBrandProfile(
  userId: string,
  updates: UpdateTables<'brand_profiles'>
) {
  const { data, error } = await supabase
    .from('brand_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as BrandProfile;
}

// Delete brand profile
export async function deleteBrandProfile(userId: string) {
  const { error } = await supabase
    .from('brand_profiles')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// Upload product image
export async function uploadProductImage(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// Upload business registration
export async function uploadBusinessRegistration(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/business-registration.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('business-documents')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('business-documents')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}


