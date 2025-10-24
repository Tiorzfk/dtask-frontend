<template>
  <div class="bg-white p-6 rounded shadow-md mb-6 max-w-xl mx-auto">
    <ApiError
      :message="errorMessage"
      @clear="errorMessage = ''"
    />

    <!-- Header + Toggle Button -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">
        {{ editTask ? "Edit Task" : "Add Task" }}
      </h2>
      <button
        class="text-blue-500 hover:text-blue-700 font-semibold"
        @click="toggle()"
      >
        {{ isOpen ? "Collapse" : "Expand" }}
      </button>
    </div>

    <!-- Form (collapsible) -->
    <form 
      v-show="isOpen" 
      class="space-y-4" 
      @submit.prevent="submitTask"
    >
      <div>
        <label class="block mb-1 font-medium">Title</label>
        <input
          v-model="title"
          type="text"
          placeholder="Task title"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block mb-1 font-medium">Description</label>
        <textarea
          v-model="description"
          placeholder="Task description"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Status</label>
        <select
          v-model="status"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option 
            value="pending"
          >
            Pending
          </option>
          <option 
            value="in_progress"
          >
            In Progress
          </option>
          <option 
            value="done"
          >
            Done
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Assign User</label>
        <input
          v-model="userName"
          type="text"
          placeholder="User Name"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ editTask ? "Update Task" : "Add Task" }}
        </button>

        <button
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="button"
          @click="resetOrCancel()"
        >
          {{ editTask ? "Cancel" : "Reset" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../api/axios";
import ApiError from "@/components/ApiError.vue";

const props = defineProps({
  editTask: { type: Object, default: null },
  isOpen: { type: Boolean, default: false },
});
const emit = defineEmits(['taskAddedorUpdated', 'update:isOpen', 'reset']);

const title = ref(props.editTask ? props.editTask.title : "");
const description = ref(props.editTask ? props.editTask.description : "");
const status = ref(props.editTask ? props.editTask.status : "pending");
const userName = ref(props.editTask ? props.editTask.userName : "");
const errorMessage = ref("");

const toggle = () => {
  emit('update:isOpen', !props.isOpen);
};

watch(
  () => props.editTask,
  (newTask) => {
    title.value = newTask ? newTask.title : "";
    description.value = newTask ? newTask.description : "";
    status.value = newTask ? newTask.status : "pending";
    userName.value = newTask ? newTask.userName : "";
  }
);

// Submit task
const submitTask = async () => {
  errorMessage.value = "";
  
  try {
    if (props.editTask) {
      await api.put(`/tasks/${props.editTask._id}`, {
        title: title.value,
        description: description.value,
        status: status.value,
        userName: userName.value,
      });
      emit("taskAddedorUpdated", true, 'update');
    } else {
      await api.post("/tasks", {
        title: title.value,
        description: description.value,
        status: status.value,
        userName: userName.value,
      });
      emit("taskAddedorUpdated", true, 'add');
    }
    toggle();
    resetOrCancel();
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Login failed. Please try again.";
    emit("taskAddedorUpdated", false, props.editTask ? 'update' : 'add');
  }
};

const resetOrCancel = async () => {
  const isCancel = !!props.editTask;

  emit('reset');
  resetForm();

  if (isCancel) {
    toggle();
  }
}

// Reset form
const resetForm = () => {
  title.value = "";
  description.value = "";
  status.value = "pending";
  userName.value = "";
};
</script>
