<script setup>
import { ref } from "vue";
const emit = defineEmits(["login"]);
const formData = ref({
  email: "",
  password: "",
  type: "login",
});
const handleChange = () => {
  if (formData.value.email && formData.value.password) {
    // Emit the "login" event only when both fields have data
    emit("login", formData);
  }
};
</script>

<template>
  <div>
    <b-form>
      <BFormGroup
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <BFormInput
          id="input-1"
          v-model="formData.email"
          type="email"
          placeholder="Enter email"
          required
          @change="handleChange"
        />
      </BFormGroup>
      <BFormGroup id="input-group-2" label="Password:" label-for="input-2">
        <BFormInput
          id="input-2"
          v-model="formData.password"
          aria-placeholder="Enter Password"
          required
          @change="handleChange"
        />
      </BFormGroup>
    </b-form>
  </div>
</template>
