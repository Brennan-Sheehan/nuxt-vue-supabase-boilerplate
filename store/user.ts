import {defineStore} from 'pinia'


export const useUserStore = defineStore('user', () => {
  console.log("In the store")
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') {
      // handle initial session
      
    } else if (event === 'SIGNED_IN') {
      // handle sign in event
      console.log('SIGNED_IN', session)
      navigateTo('/')
      
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
      
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
  return {
    signIn,
    logout,
    register
  }
});