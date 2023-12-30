<script>
export default {
  name: "Modal",
  emits: ["close", "save"],
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="$emit('close')">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
        @click.stop
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header" class="slot-header">
            This is the default tile!
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </header>

        <section class="modal-body" id="modalDescription">
          <slot name="body" @close="close"> This is the default body! </slot>
        </section>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-primary-modal);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal {
  background: var(--color-background);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  width: auto;
}

.modal-header {
  padding: 15px;
  display: flex;
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: var(--color-primary);
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
#save {
  color: var(--color-white);
  background: var(--color-primary);
  margin-left: 7px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: var(--color-primary);
  background: transparent;
}
@media screen and (max-width: 600px) {
  .modal-backdrop {
    align-items: flex-start;
  }

  .modal {
    width: 100%;
    max-width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>
