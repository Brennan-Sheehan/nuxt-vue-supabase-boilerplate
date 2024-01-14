// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@bootstrap-vue-next/nuxt',
  ],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      exclude:[]
    }
  },
  
  
})