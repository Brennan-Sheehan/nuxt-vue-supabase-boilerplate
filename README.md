# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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

Obtain OAuth credentials for your Google Cloud project in the Credentials page of the console. When creating a new credential, choose Web application. In Authorized redirect URIs enter https://<project-id>.supabase.co/auth/v1/callback. This URL will be seen by your users, and you can customize it by configuring custom domains.
Configure the OAuth Consent Screen. This information is shown to the user when giving consent to your app. Within Authorized domains make sure you add your Supabase project's domain <project-id>.supabase.co. Configure the non-sensitive scopes by making sure the following ones are selected: .../auth/userinfo.email, .../auth/userinfo.profile, openid. If you're selecting other sensitive scopes, your app may require additional verification. In those cases, it's best to use custom domains.
Finally, add the client ID and secret from step 1 in the Google provider on the Supabase Dashboard.

## Supabase Database Schema 

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