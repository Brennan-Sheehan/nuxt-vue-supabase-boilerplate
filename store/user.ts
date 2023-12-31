import {defineStore} from 'pinia'
import type {Database}  from '~/types/supabase-generated'

import type {Tables} from '~/types/supabase-generated'
export const useUserStore = defineStore('user', () => {

  
  const supabase = useSupabaseClient<Database>();
  
  const currentUserData = ref<Tables<'profiles'> | null>(null);
  const user = useSupabaseUser();
  const data = async () => {
    console.log("inside data")
    const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value!.id)
    .single()
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      currentUserData.value = data;
      console.log('currentUserData inside data', currentUserData)
    }
  }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') {
      // handle initial session
      console.log('INITIAL_SESSION', session)
      data();
    } else if (event === 'SIGNED_IN') {
      console.log('SIGNED_IN', session)
      
      data()
      navigateTo('/')
      
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
      currentUserData.value = null;
      console.log('SIGNED_OUT', session)
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
  }
  return {
    signIn,
    logout,
    register,
    currentUserData,
    updateProfile,
  }
});