<script setup lang="ts">
import { vBColorMode } from "bootstrap-vue-next";
import { useUserStore } from "~/store/user";
import { ref } from "vue";
import type { FormData } from "~/types/user";

const store = useUserStore();
const user = ref(useSupabaseUser());
const showRegisterModal = ref(false);
const showLoginModal = ref(false);
const showModal = ref(false);
const close = () => {
  showLoginModal.value = false;
  showRegisterModal.value = false;
  showModal.value = false;
};

const formData = ref<FormData>({
  email: "",
  password: "",
});
let actionType = ref("");
const updateForm = (data: any, type: string) => {
  actionType.value = type;
  if (data) {
    formData.value.email = data.value.email;
    formData.value.password = data.value.password;
  }
};
const handleInput = async () => {
  try {
    if (actionType.value === "login" && formData.value) {
      await store.signIn(formData.value.email, formData.value.password);
    } else if (actionType.value === "register" && formData.value) {
      await store.register(formData.value.email, formData.value.password);
    }
  } catch (error) {
    alert((error as Error).message);
  }
};
</script>

<template>
  <BNavbar toggleable="lg" variant="primary" v-b-color-mode="'dark'">
    <BNavbarBrand href="#">Nuxt-Supabase-Boilerplate</BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <ClientOnly>
        <BNavbarNav class="ms-auto mb-2 mb-lg-0">
          <div v-if="!user">
            <BButton @click="(showRegisterModal = true), (showModal = true)"
              >Register</BButton
            >
            <BButton
              class="login-button"
              @click="(showLoginModal = true), (showModal = true)"
              >Login</BButton
            >

            <BModal
              v-model="showModal"
              id="modal-center"
              centered
              :title="showLoginModal ? 'Login' : 'Register'"
              :ok-title="showLoginModal ? 'Login' : 'Register'"
              @ok="handleInput"
              @close="close()"
              @cancel="close()"
            >
              <div v-if="showLoginModal">
                <UserForm @handleUser="updateForm" type="login" />
                <div class="modalSwap">
                  <p>Don't have an account?</p>
                  <BButton
                    @click="
                      (showRegisterModal = true), (showLoginModal = false)
                    "
                  >
                    Register
                  </BButton>
                </div>
              </div>
              <div v-if="showRegisterModal">
                <UserForm @handleUser="updateForm" type="register" />
                <div class="modalSwap">
                  <p>Already have an account?</p>
                  <BButton
                    @click="
                      (showLoginModal = true), (showRegisterModal = false)
                    "
                    >Login</BButton
                  >
                </div>
              </div>
            </BModal>
          </div>

          <BNavItemDropdown right v-if="user">
            <template #button-content>
              <em>User</em>
            </template>
            <BDropdownItem>
              <NuxtLink :to="`/profile/${user.id}`">Profile</NuxtLink>
            </BDropdownItem>
            <BDropdownItem @click="store.logout()">Sign Out</BDropdownItem>
          </BNavItemDropdown>
        </BNavbarNav>
      </ClientOnly>
    </BCollapse>
  </BNavbar>
</template>

<style scoped>
.login-button {
  margin-left: 1rem;
}

.modalSwap {
  display: flex;

  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
