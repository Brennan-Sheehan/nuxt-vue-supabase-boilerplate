<script setup lang="ts">
import { useUserStore } from "~/store/user";
const props = defineProps(["path"]);

const emit = defineEmits(["update:path", "upload"]);

const supabase = useSupabaseClient();
const userStore = useUserStore();
const src = ref("");
const files = ref<File>();

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(props.path);
    if (error) throw error;
    src.value = URL.createObjectURL(data);
  } catch (error: any) {
    console.error("Error downloading image: ", error.message);
  }
};

const uploadAvatar = async () => {
  if (!files.value) {
    throw new Error("You must select an image to upload.");
  }

  const file = files.value;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;
  await userStore.uploadAvatar(files.value, filePath);
  emit("update:path", filePath);
};
if (props.path) {
  downloadImage();
}
</script>

<template>
  <div class="avatar-container">
    <BAvatar
      variant="dark"
      icon-variant="warning"
      v-if="src"
      :src="src"
      class="avatar"
      size="10rem"
    />

    <div class="avatar-upload">
      <BFormFile v-model="files" accept="image/*" />

      <BButton
        class="button block"
        variant="outline-primary"
        @click="uploadAvatar"
        >Upload
      </BButton>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.avatar {
  border-radius: var(--custom-border-radius);
  overflow: hidden;
  max-width: 100%;
}

.avatar.image {
  object-fit: cover;
}

.avatar.no-image {
  background-color: #333;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 5px;
}
</style>
