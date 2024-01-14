<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { reactive } from "vue";

const store = useUserStore();
const { logout, updateProfile } = store;
const user = computed(() => store.currentUserData);

const userProfile = reactive({
  full_name: "",
  username: "",
  website: "",
  avatar_url: "",
});

if (user.value) {
  Object.assign(userProfile, user.value);
}

const handleUpdate = async () => {
  try {
    await updateProfile({
      id: user.value!.id,
      ...userProfile,
      updated_at: new Date().toISOString().toLocaleString(),
    });
  } catch (error) {
    alert((error as Error).message);
  }
};
</script>

<template>
  <div class="container">
    <div class="profile">
      <form class="form-widget">
        <div class="avatar">
          <Avatar v-model:path="userProfile.avatar_url" :size="10" />
        </div>
        <div class="form-element">
          <label for="username">Username</label>
          <BFormInput
            v-model="userProfile.username"
            placeholder="Enter your username"
            type="text"
          />
        </div>
        <div class="form-element">
          <label for="website">Website</label>
          <BFormInput
            v-model="userProfile.website"
            placeholder="Enter your website"
            type="url"
          />
        </div>
        <div class="button-container">
          <div>
            <BButton
              class="button block"
              variant="outline-primary"
              @click="handleUpdate"
              >Update</BButton
            >
          </div>

          <div>
            <BButton
              class="button block"
              variant="outline-danger"
              @click="logout"
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
