import {defineStore} from 'pinia'
import type {Database}  from '~/types/supabase-generated'

import type {Tables} from '~/types/supabase-generated'
export const useUserStore = defineStore('user', () => {

  
  const supabase = useSupabaseClient<Database>();
  
  const currentUserData = ref<Tables<'profiles'> | null>(null);
  const user = useSupabaseUser();
  const data = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value!.id)
        .single();
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        currentUserData.value = data;
      }
    } catch (error: any) {
      console.error("Error fetching user data: ", error.message);
    }
  }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      // handle initial session
      data()
      navigateTo('/')
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
      currentUserData.value = null;
    } else if (event === 'INITIAL_SESSION') {
      // handle initial session
      data()
    }
  });
  const signIn = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if (error) {
      throw error;
    }
    if (!user) {
      throw new Error('User is null');
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const register = async (email: string, password: string) => {
    console.log('register', email, password)
    const {data, error} = await supabase.auth.signUp({email, password});
    if (error) {
      throw error;
    }
    if (!user) {
      throw new Error('User is null');
    }
    return data;
  };
  const updateProfile = async (updates: Tables<'profiles'> | null) => {
    console.log('updates', updates)
    try {
      
      if (updates !== null) {
        const { error } = await supabase.from("profiles").update(updates).eq("id", user.value!.id);
        if (error) {
          console.log(error);
          console.log(updates);
        }
     
      }
    } catch (error) {
      alert("Ther was an error updating your profile");
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