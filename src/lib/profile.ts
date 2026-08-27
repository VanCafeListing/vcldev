import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  avatar_url: string | null;
};

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, username, avatar_url')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Saves name/email to `profiles`, and — only when the email actually
 * changed — also updates the Supabase Auth sign-in email so the two never
 * drift. "Secure email change" confirmation is disabled project-wide (see
 * profile-settings design.md), so this applies immediately.
 */
export async function updateProfile(
  userId: string,
  { name, email }: { name: string; email: string },
  previousEmail: string | null
): Promise<void> {
  const { error } = await supabase.from('profiles').update({ name, email }).eq('id', userId);
  if (error) throw error;

  if (email !== previousEmail) {
    const { error: authError } = await supabase.auth.updateUser({ email });
    if (authError) throw authError;
  }
}

/**
 * Picks an image from the library, uploads it to `avatars/{userId}/...`,
 * and returns its public URL. Returns null if the user cancels the picker.
 */
export async function pickAndUploadAvatar(userId: string): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Photo library permission denied');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const ext = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const response = await fetch(asset.uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, { contentType: asset.mimeType ?? 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  // Cache-bust: the path is stable per user, so a re-upload needs a new URL
  // for clients to actually refetch the new image.
  const url = `${data.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', userId);
  if (updateError) throw updateError;

  return url;
}

/** Deletes the caller's own account via the delete-account Edge Function. */
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
}
