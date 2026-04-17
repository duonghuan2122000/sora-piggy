<template>
  <div class="sora-dashboard">
    <SoraCard class="sora-dashboard__card">
      <template #header>Thu/chi trong 7 ngày</template>
      <component :is="ApexCharts" type="line" :options="chartOptions" :series="series" height="500" />
    </SoraCard>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { SoraCard } from '@renderer/components/ui';

const ApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

function lastNDates(n: number): string[] {
  const res: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    res.push(`${d.getDate()}/${d.getMonth() + 1}`);
  }
  return res;
}

const labels = lastNDates(7);

const series = ref([
  {
    name: 'Thu',
    data: [1500000, 1200000, 900000, 1100000, 800000, 1300000, 1250000]
  },
  {
    name: 'Chi',
    data: [800000, 600000, 700000, 500000, 300000, 400000, 900000]
  }
]);

const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const chartOptions = ref<ApexOptions>({
  chart: { id: 'dashboard-line', toolbar: { show: false }, height: 500 },
  xaxis: { categories: labels, title: { text: 'Ngày' } },
  yaxis: { labels: { formatter: (val: number) => vndFormatter.format(Number(val)) } },
  tooltip: { y: { formatter: (val: number) => vndFormatter.format(Number(val)) } },
  stroke: { curve: 'smooth' },
  dataLabels: { enabled: false },
  legend: { position: 'top' }
});
</script>

<style scoped>
.sora-dashboard {
  padding: 16px;
}
.sora-dashboard__card {
  width: 100%;
}
</style>
