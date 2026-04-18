<template>
  <div class="sora-dashboard">
    <SoraCard class="sora-dashboard__card">
      <template #header>
        <div class="sora-dashboard__header">
          <div>
            <div class="sora-dashboard__title">Thu/chi</div>
            <div class="sora-dashboard__year">Năm {{ selectedYear }}</div>
          </div>
          <div class="sora-dashboard__filters">
            <SoraSelect
              v-model="selectedMonth"
              :options="monthOptions"
              style="width: 160px; margin-right: 12px"
            />
            <SoraSelect v-model="selectedYear" :options="yearOptions" style="width: 140px" />
          </div>
        </div>
      </template>

      <component
        :is="ApexCharts"
        type="line"
        :options="chartOptions"
        :series="series"
        height="500"
      />
    </SoraCard>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, watch } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { SoraCard, SoraSelect } from '@renderer/components/ui';

const ApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function buildLabel(day: number, month: number): string {
  // Format dd/MM (day/month). Year shown as caption separately.
  return `${pad(day)}/${pad(month)}`;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// Month options (1..12)
const monthOptions = Array.from({ length: 12 }).map((_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));

const currentYear = new Date().getFullYear();
// Years descending: currentYear, currentYear-1, ..., currentYear-5
const yearOptions = Array.from({ length: 6 }).map((_, i) => ({ value: currentYear - i, label: `Năm ${currentYear - i}` }));

const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(currentYear);

const series = ref([
  { name: 'Thu', data: [] as number[] },
  { name: 'Chi', data: [] as number[] }
]);

const chartOptions = ref<ApexOptions>({
  chart: { id: 'dashboard-line', toolbar: { show: false }, height: 500 },
  xaxis: { categories: [], title: { text: 'Ngày' } },
  yaxis: {
    title: { text: 'Số tiền (VND)' },
    labels: {
      formatter: (val: number) => {
        // Ensure value is number and format as VND without decimals
        const n = Number(val) || 0;
        return vndFormatter.format(Math.round(n));
      }
    }
  },
  tooltip: {
    shared: true,
    y: {
      formatter: (val: number) => vndFormatter.format(Number(val) || 0)
    }
  },
  stroke: { curve: 'smooth', width: 2 },
  markers: {
    size: 5,
    strokeWidth: 2,
    hover: { sizeOffset: 4 }
  },
  dataLabels: { enabled: false },
  legend: { position: 'top' }
});

async function loadAndAggregate(): Promise<void> {
  try {
    // @ts-ignore - exposed by preload
    const all = (await window.api.getTransactions()) as Array<Record<string, any>>;
    const month = Number(selectedMonth.value);
    const year = Number(selectedYear.value);

    const dim = daysInMonth(month, year);
    const labels: string[] = [];
    const incomeData = new Array(dim).fill(0);
    const expenseData = new Array(dim).fill(0);

    for (let d = 1; d <= dim; d++) labels.push(buildLabel(d, month));

    for (const t of all) {
      try {
        const ts = t.time ? new Date(t.time) : null;
        if (!ts || isNaN(ts.getTime())) continue;
        if (ts.getMonth() + 1 !== month || ts.getFullYear() !== year) continue;
        const day = ts.getDate();
        const amt = Number(t.amount) || 0;
        if (amt >= 0) {
          incomeData[day - 1] += amt;
        } else {
          expenseData[day - 1] += Math.abs(amt);
        }
      } catch (e) {
        // ignore malformed row
      }
    }

    series.value = [
      { name: 'Thu', data: incomeData },
      { name: 'Chi', data: expenseData }
    ];

    chartOptions.value = {
      ...chartOptions.value,
      xaxis: { categories: labels, title: { text: 'Ngày' } }
    } as ApexOptions;
  } catch (err) {
    // ignore errors for now
    console.error('Error loading transactions for dashboard', err);
  }
}

onMounted(() => {
  loadAndAggregate();
});

watch([selectedMonth, selectedYear], () => {
  loadAndAggregate();
});
</script>

<style scoped>
.sora-dashboard {
  padding: 16px;
}
.sora-dashboard__card {
  width: 100%;
}
.sora-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sora-dashboard__title {
  font-weight: 600;
}
.sora-dashboard__year {
  font-size: 0.85rem;
  color: var(--sora-text-secondary, #666);
  margin-top: 4px;
}
.sora-dashboard__filters {
  display: flex;
  align-items: center;
}
</style>
