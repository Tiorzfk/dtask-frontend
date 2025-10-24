<template>
  <div class="p-6">
    <h1 
      class="text-3xl font-bold mb-6"
    >
      Daily Tasks
    </h1>

    <TaskForm 
      :edit-task="editTask"
      :is-open="isFormOpen"
      @task-added="fetchTasks" 
      @reset="resetForm"
      @task-addedor-updated="taskAddedorUpdated"
      @update:is-open="isFormOpen = $event"
    />

    <TaskList
      :tasks="tasks"
      @task-updated="selectedEditTask"
      @task-deleted="selectedDeleteTask"
      @params-change="onParamsChange"
    />

    <ToastMessage
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />

    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import ToastMessage from '@/components/ToastMessage.vue';
import { useStore } from "vuex";
import api from "@/api/axios.js";
import TaskForm from "@/components/TaskForm.vue";
import TaskList from "@/components/TaskList.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { MESSAGE_ALERT } from "@/constants/TaskConstant.js"

const store = useStore();

const tasks = computed(() => store.state.tasks);
const loading = computed(() => store.state.loading);
const editTask = ref(null);
const isFormOpen = ref(false);

const emit = defineEmits(['update:isOpen']);
const toast = ref({ show: false, message: '', type: 'success' });

let queryParams = {
  search: "",
  status: "",
  page: 1,
  sortKey: "",
  sortAsc: true,
  limit: 2
};

const fetchTasks = async () => {
  try {
    store.commit("setLoading", true);
    const res = await api.get("/tasks", { params: queryParams });
    store.commit("setTasks", res.data.data);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  } finally {
    store.commit("setLoading", false);
  }
};

const deleteTask = async (id) => {
  try {
    store.commit("setLoading", true);
    const res = await api.delete(`/tasks/${id}`);
    store.commit("setTasks", res.data.data);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  } finally {
    store.commit("setLoading", false);
  }
};

const onParamsChange = (params) => {
  queryParams = { ...queryParams, ...params };
  fetchTasks();
};

const selectedEditTask = (params) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  isFormOpen.value = true;
  editTask.value = params;
}

const resetForm = () => {
  editTask.value = null;
}

const selectedDeleteTask = (id) => {
  if (confirm("Are you sure you want to delete this task?")) {
    deleteTask(id);
    fetchTasks();
    showAlert(true, 'delete');
  }
}

const taskAddedorUpdated = (isSuccess, type) => {
  if (isSuccess) showAlert(isSuccess, type);
  else showAlert(isSuccess, type);
  fetchTasks();
}

const showAlert = (isSuccess, type) => {
  toast.value = { show: true, message: MESSAGE_ALERT(isSuccess)[type], type: isSuccess ? 'success' : 'error' };
};

onMounted(() => {
  fetchTasks();
});
</script>
