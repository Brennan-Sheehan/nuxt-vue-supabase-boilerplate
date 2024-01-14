import {defineStore} from 'pinia'
import type {Database}  from '~/types/supabase-generated'

import type {Tables} from '~/types/supabase-generated'
export const useUserStore = defineStore('user', () => {

  const supabase = useSupabaseClient<Database>();
  
  const currentUserData = ref<Tables<'profiles'> | null>(null);
  
  const user = useSupabaseUser();
  const fetchUserData = async () => {
    if (user.value) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single();
        if (error) throw error;
        currentUserData.value = data;
      } catch (error: any) {
        console.error("Error fetching user data: ", error.message);
      }
    }
  }
  // Function to handle auth state changes
  const handleAuthStateChange = (event: any) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      fetchUserData();
    } else if (event === 'SIGNED_OUT') {
      currentUserData.value = null;
      navigateTo('/');
    }
  }

  // Subscribe to auth state changes
  supabase.auth.onAuthStateChange(handleAuthStateChange);

  
  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) throw new Error('Email and password are required');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
     
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Error logging out:', error.message);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      if (!email || !password) throw new Error('Email and password are required');
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error registering:', error.message);
    }
  };

  const updateProfile = async (updates: Tables<'profiles'>) => {
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.value!.id);
      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
    }
  };

  const uploadAvatar = async (file: File, filePath: string) => {
    
    try {
     
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
  
      if (uploadError) throw uploadError;
  
    } catch (error: any) {
      alert(error.message);
    } 
  };
  return {
    signIn,
    logout,
    register,
    currentUserData,
    updateProfile,
    uploadAvatar,
  }
});