<script setup>
import { vBColorMode } from "bootstrap-vue-next";
import { useUserStore } from "~/store/user";
import { ref } from "vue";
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
let formData = ref({
  email: "",
  password: "",
  type: "",
});
const updateForm = (data) => {
  formData.value = {
    email: data.value.email,
    password: data.value.password,
    type: data.value.type,
  };
};
const handleInput = async (formData) => {
  if (formData.type === "login") {
    const newFormData = {
      email: formData.email,
      password: formData.password,
    };
    console.log(newFormData);
    await store.signIn(newFormData.email, newFormData.password);
  } else if (formData.type === "register") {
    await store.register(formData.email, formData.password);
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
            title="Login"
            ok-title="Login"
            @ok="handleInput(formData)"
            @close="close()"
            @cancel="close()"
          >
            <LoginForm v-if="showLoginModal" @login="updateForm" />
            <RegisterForm v-if="showRegisterModal" @register="updateForm" />
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
</style>
