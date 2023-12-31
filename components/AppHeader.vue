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

let formData = ref<FormData>();
const updateForm = (data: FormData | undefined) => {
  formData.value = data;
};
const handleInput = async (formData: FormData | undefined) => {
  try {
    if (formData?.type === "login") {
      const newFormData = {
        email: formData.email,
        password: formData.password,
      };
      await store.signIn(newFormData.email, newFormData.password);
    } else if (formData?.type === "register") {
      await store.register(formData.email, formData.password);
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
            @ok="handleInput(formData)"
            @close="close()"
            @cancel="close()"
          >
            <div v-if="showLoginModal">
              <LoginForm @login="updateForm" />
              <div class="modalSwap">
                <p>Don't have an account?</p>
                <BButton
                  @click="(showRegisterModal = true), (showLoginModal = false)"
                >
                  Register
                </BButton>
              </div>
            </div>
            <div v-if="showRegisterModal">
              <RegisterForm @register="updateForm" />
              <div class="modalSwap">
                <p>Already have an account?</p>
                <BButton
                  @click="(showLoginModal = true), (showRegisterModal = false)"
                  >Login</BButton
                >
              </div>
            </div>
          </BModal>
        </div>

        <BNavItemDropdown right v-if="user">
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <BDropdownItem href="#">
            <NuxtLink :to="`/profile/${user.id}`">Profile</NuxtLink>
          </BDropdownItem>
          <BDropdownItem @click="store.logout()">Sign Out</BDropdownItem>
        </BNavItemDropdown>
      </BNavbarNav>
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
