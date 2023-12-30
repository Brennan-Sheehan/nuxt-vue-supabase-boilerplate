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
          <BFormInput
            v-model="user.email"
            placeholder="Enter your email"
            type="email"
          />
        </div>
        <div class="form-element">
          <label for="username">Username</label>
          <BFormInput
            v-model="username"
            placeholder="Enter your username"
            type="text"
          />
        </div>
        <div class="form-element">
          <label for="website">Website</label>
          <BFormInput
            v-model="website"
            placeholder="Enter your website"
            type="url"
          />
        </div>
        <div class="button-container">
          <div>
            <BButton
              class="button block"
              variant="outline-primary"
              @click="updateProfile"
              :disabled="loading"
              >Update</BButton
            >
          </div>

          <div>
            <BButton
              class="button block"
              variant="outline-danger"
              @click="signOut"
              :disabled="loading"
              >Sign Out
            </BButton>
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

.form-widget {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
