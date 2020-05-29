<template>
  <div class="dashboard-container">
    <span class="dashboard-header">欢迎来到交通时空大数据分析系统</span>
    <div class="dashboard-body">
      <router-link :to="'/analysis/heat'">
        <div class="dashboard-list-item">人群密度分析</div>
      </router-link>
      <router-link :to="'/analysis/trajectory'">
        <div class="dashboard-list-item">出行轨迹分析</div>
      </router-link>
      <router-link :to="'/analysis/trip-mode'">
        <div class="dashboard-list-item">出行方式分析</div>
      </router-link>
      <router-link :to="'/analysis/abnormal-aggregation'">
        <div class="dashboard-list-item">异常聚集分析</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 84px);
  width: 100%;
  flex-direction: column;
}

.dashboard-header {
  font-size: 24px;
  font-weight: 500;
  line-height: 80px;
}

.dashboard-list-item {
  color: #1a90ff;
  line-height: 40px;
  font-size: 18px;
}
</style>
