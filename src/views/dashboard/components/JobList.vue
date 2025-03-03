<template>
  <n-card class="job-card" @click="$emit('select-job', job)">
    <div class="job-logo">
      <img :src="job.company_logo_url || '/default-logo.png'" alt="Company Logo" />
    </div>
    <div class="job-info">
      <h3>{{ job.title }}</h3>
      <p class="company">{{ job.company_name }}</p>
      <p class="location">{{ job.location }} • {{ job.job_type }}</p>
      <div class="job-tags">
        <n-tag v-for="tag in job.tags" :key="tag">{{ tag }}</n-tag>
      </div>
    </div>
  </n-card>
</template>

<script>
export default {
  props: {
    job: Object,
  },
}
</script>

<style scoped>
.job-card {
  display: flex;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background 0.3s;
}

.job-card:hover {
  background: #f5f5f5;
}

.job-logo img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}

.job-info h3 {
  font-size: 16px;
  margin: 0;
}

.company {
  font-weight: bold;
  color: #555;
}

.location {
  color: #777;
}
</style>
