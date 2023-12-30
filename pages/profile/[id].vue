<script setup>
const supabase = useSupabaseClient();

const loading = ref(true);
const username = ref("");
const website = ref("");
const avatar_path = ref("");

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
  .from("profiles")
  .select(`username, website, avatar_url`)
  .eq("id", user.value.id)
  .single();

if (data) {
  username.value = data.username;
  website.value = data.website;
  avatar_path.value = data.avatar_url;
}

loading.value = false;

async function updateProfile() {
  try {
    loading.value = true;
    const user = useSupabaseUser();

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="profile">
      <div class="info">
        <h1>{{ username }}</h1>
        <p>{{ website }}</p>
      </div>
      <form class="form-widget" @submit.prevent="updateProfile">
        <div class="avatar">
          <Avatar
            v-model:path="avatar_path"
            @upload="updateProfile"
            :size="10"
          />
        </div>
        <div class="form-element">
          <label for="email">Email</label>
          <input id="email" type="text" :value="user.email" disabled />
        </div>
        <div class="form-element">
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username" />
        </div>
        <div class="form-element">
          <label for="website">Website</label>
          <input id="website" type="url" v-model="website" />
        </div>
        <div class="button-container">
          <div>
            <input
              type="submit"
              class="button primary block"
              :value="loading ? 'Loading ...' : 'Update'"
              :disabled="loading"
            />
          </div>

          <div>
            <button class="button block" @click="signOut" :disabled="loading">
              Sign Out
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
}
.profile {
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form-widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-element {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.button-container {
  display: flex;
  justify-content: space-between;
}
.mainHeader {
  width: 100%;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.avatarPlaceholder {
  border: var(--custom-border);
  border-radius: var(--custom-border-radius);
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-widget {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-widget > .button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #444444;
  text-transform: none !important;
  transition: all 0.2s ease;
}

.form-widget .button:hover {
  background-color: #2a2a2a;
}

.form-widget .button > .loader {
  width: 17px;
  animation: spin 1s linear infinite;
  filter: invert(1);
}
</style>
