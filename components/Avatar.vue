<script setup>
const props = defineProps(["path"]);
const { path, size } = toRefs(props);

const emit = defineEmits(["update:path", "upload"]);

const supabase = useSupabaseClient();

const uploading = ref(false);
const src = ref("");
const files = ref();

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path.value);
    if (error) throw error;
    src.value = URL.createObjectURL(data);
  } catch (error) {
    console.error("Error downloading image: ", error.message);
  }
};

const uploadAvatar = async () => {
  console.log(files.value);
  try {
    uploading.value = true;

    if (!files.value || files.value.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = files.value;
    console.log(file);
    const fileExt = file.name.split(".").pop();
    console.log(fileExt);
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    emit("update:path", filePath);
    emit("upload");
  } catch (error) {
    alert(error.message);
  } finally {
    uploading.value = false;
  }
};

downloadImage();

watch(path, () => {
  if (path.value) {
    downloadImage();
  }
});
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
    <div
      v-else
      class="avatar no-image"
      :style="{ height: size, width: size }"
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
