<script>
  export default {
    data() {
      return {
        title: "VuePractice-2025",
        status: "active",
        status2: "pending2",
        tasks: ['Task one', 'Task two', 'Task three'],
        link: 'https://google.com'
      };
    },
    methods: {
      handleChangeStatus() {
        if (this.status === 'active') {
          this.status = 'inactive';
        } else {
          this.status = 'active';
        }
      }
    }
  };
</script>

<template>
  <h1>{{ title }}</h1>
  <p v-if="status === 'active'">Status is active</p>
  <p v-else-if="status === 'pending'">Status is pending</p>
  <p v-else>Status is inactive</p>

  <p v-if="status2 === 'active2'">Status2 is active2</p>
  <p v-else-if="status2 === 'pending2'">Status2 is pending2</p>
  <p v-else>Status2 is inactive2</p>

  <ul>
    <li v-for="(task, index) in tasks" :key="index">{{ task }}</li>
  </ul>

  <a :href="link">Go to Google</a>
  <button @click="handleChangeStatus"> Click Me</button>
</template>