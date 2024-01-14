# Nuxt 3 - Vue - Supabase Starter


## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```


## Production

Build the application for production:

```bash
# npm
npm run build
```

## Supabase Config
### Create Supabase Project
1. Go to https://supabase.com/ and create a new supabase project.
2. Once created you should be provided a set of keys. Take this keys and add them to an .env file inside your project like below:

```code
SUPABASE_URL= ""
SUPABASE_KEY= ""
```
### Authentication
Email and password is already setup to work out of the box. This is the documentation for google OAuth. The other social provider documentation can be found here: https://supabase.com/docs/guides/auth/social-login
1. Obtain OAuth credentials for your Google Cloud project in the Credentials page of the console. When creating a new credential, choose Web application. In Authorized redirect URIs enter https://<project-id>.supabase.co/auth/v1/callback. This URL will be seen by your users, and you can customize it by configuring custom domains.
2. Configure the OAuth Consent Screen. This information is shown to the user when giving consent to your app. Within Authorized domains make sure you add your Supabase project's domain <project-id>.supabase.co. Configure the non-sensitive scopes by making sure the following ones are selected: .../auth/userinfo.email, .../auth/userinfo.profile, openid. If you're selecting other sensitive scopes, your app may require additional verification. In those cases, it's best to use custom domains.
3. Finally, add the client ID and secret from step 1 in the Google provider on the Supabase Dashboard.

### Database Schema 
1. Go to the SQL Editor page in the Dashboard.
2. Click User Management Starter.
3. Click Run.

Or tweak this sql to your desired schema
```sql
-- Create a table for public "profiles"
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
```