<script setup>
  import { ref } from 'vue';

  const title = ref("VuePractice-2025");
  const status = ref("active");
  const tasks = ref(['Task one', 'Task two', 'Task three']);
  const link = ref('https://google.com');
  const newTask = ref('');

  const handleChangeStatus = () => {
    if (status.value === 'active') {
      status.value = 'inactive';
    } else {
      status.value = 'active';
    }
  }

  const handleSubmit = () => {
    if (newTask.value.trim() !== '') {
      tasks.value.push(newTask.value.trim());
      newTask.value = '';
    }
  }

  const deleteTask = (index) => {
    tasks.value.splice(index, 1);
  }
</script>

<template>
  <h1>{{ title }}</h1>
  <p v-if="status === 'active'">Status is active</p>
  <p v-else-if="status === 'pending'">Status is pending</p>
  <p v-else>Status is inactive</p>

  <form @submit.prevent="handleSubmit">
    <label for="newTasks">New Task : </label>
    <input type="text" name="newTasks" id="newTasks" v-model="newTask" placeholder="Enter something" />
    <button type="submit">Submit</button>
  </form>

  <ul>
    <li v-for="(task, index) in tasks" :key="index"><span>{{ task }}</span><button @click="deleteTask(index)">x</button></li>
  </ul>

  <a :href="link">Go to Google</a>
  <button @click="handleChangeStatus"> Click Me</button>
</template>