<script setup lang="ts">
import { ref } from "vue";
import type { FormData } from "~/types/user";
const emit = defineEmits(["handleUser"]);
const props = defineProps({
  type: String,
});
const formData = ref<FormData>({
  email: "",
  password: "",
});
const handleChange = () => {
  if (formData.value.email && formData.value.password) {
    emit("handleUser", formData, props.type);
  }
};
const onReset = () => {
  formData.value.email = "";
  formData.value.password = "";
};
</script>
<template>
  <BForm @reset="onReset">
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
        type="password"
        aria-placeholder="Enter Password"
        required
        @change="handleChange"
      />
    </BFormGroup>
  </BForm>
</template>
