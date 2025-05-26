<template>
  <div class="main-conteiner-donat">
    <!-- Deposit / Withdraw buttons -->
    <div class="row items-center justify-evenly q-px-auto buttons-container">
      <div class="col-4">
        <button @click="router.push('/withdraw/deposit')" class="withdraw-btn flex flex-center">
          <SvgIcon name="increase" state="black" size="24" />
          <span class="typography-caption-lg-regular text-blue-custom q-mr-sm">واریز</span>
        </button>
      </div>
      <div class="col-4">
        <button @click="router.push('/withdraw')" class="withdraw-btn flex flex-center">
          <SvgIcon name="decrease" state="black" size="24" />
          <span class="typography-caption-lg-regular text-blue-custom q-mr-sm">برداشت</span>
        </button>
      </div>
    </div>

    <!-- Chart and Asset Content -->
    <template v-if="!store.isLoading && store.assets.length">
      <div class="donut-wrapper">
        <Doughnut :data="store.chartData" :options="chartOptions" />

        <div class="donut-center">
          <div class="text q-pb-sm">ارزش کل دارایی</div>
          <div class="value">
            {{ formatPersianNumber(store.totalValue) }}
            <SvgIcon name="Rial" state="black" size="16" />
          </div>
        </div>
      </div>

      <div class="content-wrapper flex column justify-between">
        <div
          v-for="item in store.assets"
          :key="item.id"
          class="flex justify-between colored-items bg-white-light-active"
          :style="{ borderRightColor: item.color }"
          @click="router.push({ path: `/withdraw/asset-detail/${item.slug}` })"
        >
          <!-- Right -->
          <div class="flex items-center">
            <div class="flex flex-center q-ml-sm">
              <SvgIcon :name="item.icon" state="black" size="32" />
            </div>
            <div class="typography-caption-lg-regular text-blue-custom q-mr-xs flex column">
              {{ item.name }}
              <span
                v-if="item.pricePerUnit"
                class="typography-caption-md-regular text-white-dark"
              >
                قیمت ۱ گرم: {{ formatPersianNumber(item.pricePerUnit) }}
              </span>
            </div>
          </div>

          <!-- Left -->
          <div class="flex q-gutter-x-sm">
            <div class="flex column">
              <span class="typography-caption-lg-regular text-blue-custom">
                {{ formatPersianNumber(item.amount) }}
              </span>
              <span class="typography-caption-md-regular text-white-dark hover-text-white-dark-hover text-left">
                {{ item.unit }}
              </span>
            </div>
            <div class="flex flex-center">
              <SvgIcon name="arrow-left" state="black" size="16" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Loading fallback -->
    <template v-else>
      <div class="q-mt-md q-pa-md text-center text-grey">در حال بارگذاری...</div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

import SvgIcon from './SvgIcon.vue'
import { useDonatChartStore } from 'src/stores/donatChart'

const router = useRouter()
const store = useDonatChartStore()

onMounted(async () => {
  await store.fetchDonatChartData()
  await nextTick()
})

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  hover: { mode: null }
}

// Persian number formatter
function formatPersianNumber(number) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  return number
    .toLocaleString('fa-IR')
    .replace(/\d/g, d => persianDigits[d])
}
</script>

<style scoped>
.main-conteiner-donat {
  margin-bottom: 1.25rem;
}
.content-wrapper {
  gap: 0.75rem;
}
.content-wrapper > div {
  width: 100%;
}
.colored-items {
  border-right: 0.5rem solid;
  border-radius: 0.5rem;
  padding: 0.625rem;
}
.donut-wrapper {
  position: relative;
  margin: 0 auto;
  padding: 0 3.75rem;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1.25rem;
}
.donut-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}
.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  pointer-events: none;
}
.donut-center .text {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 100%;
  color: rgba(119, 119, 119, 1);
}
.donut-center .value {
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 100%;
}
.withdraw-btn {
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--white-light-active);
  width: 100%;
  cursor: pointer;
}
.withdraw-btn:active {
  background-color: var(--white-light-active);
}
</style>
