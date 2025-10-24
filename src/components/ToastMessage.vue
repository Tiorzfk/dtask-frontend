<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 z-50',
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]"
    >
      <span class="font-semibold">
        {{ message }}
      </span>
    </div>
  </transition>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success' }, // 'success' | 'error'
  duration: { type: Number, default: 3000 },
  show: { type: Boolean, default: false },
});

const visible = ref(false);

watchEffect(() => {
  if (props.show) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration || 10000);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
