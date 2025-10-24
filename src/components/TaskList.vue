<template>
  <div class="max-w-5xl mx-auto p-4 space-y-4">
    <!-- Search & Filter + Sorting Row -->
    <div class="flex flex-row flex-wrap items-center justify-between gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search tasks..."
        class="border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        @enter="onParamsChange"
      >
      <select
        v-model="filterStatus"
        class="border border-gray-300 rounded-lg p-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        @change="onParamsChange"
      >
        <option 
          value=""
        >
          All Status
        </option>
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
      <div class="flex gap-2 mt-2 sm:mt-0">
        <button
          class="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
          @click="() => sortBy('title')"
        >
          Sort Title
        </button>
        <button
          class="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
          @click="() => sortBy('status')"
        >
          Sort Status
        </button>
      </div>
    </div>

    <!-- Task Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="task in tasks.data"
        :key="task.id"
        class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
      >
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-bold text-lg">
            {{ task.title }}
          </h3>
          <span 
            :class="statusColor(task.status)" 
            class="font-semibold capitalize"
          >{{ TASK_STATUS[task.status] }}</span>
        </div>
        <p 
          class="text-gray-600 mb-1"
        >
          {{ task.description }}
        </p>
        <p 
          class="text-sm text-gray-500 mb-1"
        >
          Assigned to: <span class="font-medium">{{ task.userName || 'Unassigned' }}</span>
        </p>
        <p 
          class="text-sm text-gray-400 mb-2"
        >
          Created: {{ formatDate(task.createdAt) }}<br>
          Updated: {{ formatDate(task.updatedAt) }}
        </p>
        <div class="flex gap-2 mt-2">
          <button
            class="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
            @click="emitTaskUpdated(task)"
          >
            Edit
          </button>
          <button
            class="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition text-sm"
            @click="deleteTask(task._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4 flex-wrap gap-2">
      <button
        class="px-3 py-1 border rounded disabled:opacity-50 text-sm"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="text-sm">Page {{ currentPage }}</span>
      <button
        class="px-3 py-1 border rounded disabled:opacity-50 text-sm"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { TASK_STATUS } from "@/constants/TaskConstant";

const props = defineProps({
  tasks: { type: Object, required: true },
});
const emit = defineEmits(["taskUpdated", "taskDeleted", "paramsChange"]);

const search = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const totalPages = ref(0);
const sortKey = ref("");
const sortAsc = ref(true);

// Semua perubahan param langsung emit ke parent supaya fetchTasks dipanggil
const onParamsChange = (isResetPage = true) => {
  if (isResetPage) currentPage.value = 1; // reset page
  emit("paramsChange", {
    search: search.value,
    status: filterStatus.value,
    page: currentPage.value,
    sortKey: sortKey.value,
    sortAsc: sortAsc.value,
  });
};

const sortBy = key => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else sortKey.value = key;
  onParamsChange();
};

// Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    onParamsChange(false);
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    onParamsChange(false);
  }
};

// Methods
const statusColor = status => {
  const taskStatus = Object.keys(TASK_STATUS);
  switch (status) {
    case taskStatus[0]: return "text-gray-500";
    case taskStatus[1]: return "text-blue-500";
    case taskStatus[2]: return "text-green-500";
    default: return "text-gray-500";
  }
};

const emitTaskUpdated = task => emit("taskUpdated", task);

const deleteTask = id => emit("taskDeleted", id);

const formatDate = date => new Date(date).toLocaleString();

watch(
  () => props.tasks,
  (newTasks, oldTasks) => {
    totalPages.value = props.tasks?.meta?.totalPages;
  },
  { immediate: true, deep: true }
);
</script>
