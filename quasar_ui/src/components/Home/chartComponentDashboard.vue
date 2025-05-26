<template>
  <div class="chart-container">

    <!-- filter data  -->
    <div class="time-filter-container q-mb-md q-pa-xs bg-white-light-active flex items-center justify-between">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="['time-option typography-caption-md-regular text-black', { active: modelValue === item.value }]"
        @click="modelValue = item.value"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- نمودار -->
    <div class="chart-wrapper q-px-none">
      <Line ref="chartRef" :data="internalData" :options="chartOptions" />
    </div>


    <!-- فیلترهای زمانی -->
    <div class="time-indicators q-mx-md">
      <div v-for="date in profitIndicators" :key="date.value" class="indicator typography-caption-md-regular flex items-center justify-between">
       <div class="profit-indicator-div q-ml-xs"
       :style="{ backgroundColor: indicatorColors[date.value] || '#ccc' }"
       ></div>
        <span >{{date.label}}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip
} from 'chart.js'
import { Line } from 'vue-chartjs'
import {  ref, nextTick, watch, computed } from 'vue'

const indicatorColors = {
  gold: 'rgba(231, 194, 77, 1)',
  coin: 'rgba(255, 159, 102, 1)',
  silver: 'rgba(143, 143, 143, 1)',
  usd: 'rgba(102, 191, 161, 1)'
}



const props = defineProps({
  data: Object,
  timestamps: Object,
  color:            { type: String, default:'#E7C24D' },
  profitIndicators: { type: Array, default: ()=>[] }
})

const modelValue = ref('24h')


watch(
  [() => props.data, () => props.timestamps, () => modelValue.value],
  async () => {
    await nextTick()
    const chart = chartRef.value?.chart
    if (!chart) return

    const ctx = chart.ctx
    const rawData = props.data[modelValue.value] || {}

    chart.data.labels = props.timestamps

    const allValues = Object.values(rawData).flat()
    const globalMin = Math.min(...allValues)

    const minY = Math.min(...allValues)
    const maxY = Math.max(...allValues)
    const niceMin = Math.floor(minY / 100000) * 100000
    const niceMax = Math.ceil(maxY / 100000) * 100000
    const step = Math.round((niceMax - niceMin) / 5) // 6 ticks → 5 فاصله


    const gradients = Object.fromEntries(
      Object.values(indicatorColors).map((baseColor) => {
        const top = baseColor.replace('1)', '0.2)')
        const bottom = 'rgba(228, 229, 241, 0.05)'
        return [baseColor, [top, bottom]]
      })
    )



    chart.data.datasets = Object.entries(rawData).map(([key, values]) => {
      const color = indicatorColors[key]
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height)

        if (Math.min(...values) === globalMin) {
          const [top, bottom] = gradients[color] || ['rgba(0,0,0,0.2)', 'rgba(228,229,241,0.1)']
          gradient.addColorStop(0, top)
          gradient.addColorStop(1, bottom)
        } else {
          gradient.addColorStop(0, 'rgba(0,0,0,0)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        }


      return {
        label: key,
        data: values,
        borderColor: color,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    })
    chart.options.scales.y.min = niceMin
    chart.options.scales.y.max = niceMax
    chart.options.scales.y.ticks.stepSize = step


    chart.update()
  },
  { immediate: true }
)





const chartRef = ref(null)
const options = [
  { label: '۲۴ ساعت', value: '24h' },
  { label: '۱ هفته', value: '1w' },
  { label: '۱ ماه', value: '1m' },
  { label: '۳ ماه', value: '3m' },
  { label: '۱ سال', value: '1y' }
]

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip)

const toPersianDigits = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(num).replace(/[0-9]/g, w => persianDigits[w])
}

const formatToMillions = (value) => {
  return toPersianDigits(Math.floor(value / 1000000)) + ',' +
         toPersianDigits(String(Math.floor((value % 1000000) / 1000)).padStart(3, '0')) + ',' +
         toPersianDigits(String(value % 1000).padStart(3, '0'))
}

ChartJS.register({
  id: 'dashedGridFixer',
  beforeDraw(chart, args, options) {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y

    ctx.save()
    ctx.beginPath()
    ctx.setLineDash(options.dash || [5, 5])
    ctx.lineWidth = options.width || 1
    ctx.strokeStyle = options.color || '#D0D0D0'

    yScale.ticks.forEach((_, index) => {
      const y = yScale.getPixelForTick(index)
      ctx.moveTo(chartArea.left, y)
      ctx.lineTo(chartArea.right, y)
    })

    ctx.stroke()
    ctx.restore()
  }
})

ChartJS.register({
  id: 'customXAxisDashedGrid',
  beforeDraw(chart) {
    const { ctx, scales } = chart
    const xScale = scales.x
    const y =  xScale.bottom - 30// فاصله کمی بالاتر از برچسب‌ها

    ctx.save()
    ctx.strokeStyle = '#D0D0D0'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2]) // استایل خط‌چین

    xScale.ticks.forEach((_, i) => {
      const x = xScale.getPixelForTick(i)

      // رسم ۳ خط عمودی کوچک رو به بالا
      for (let j = 0; j < 3; j++) {
        const yStart = y - j * 4 // هر خط بالاتر از قبلی
        ctx.beginPath()
        ctx.moveTo(x, yStart)
        ctx.lineTo(x, yStart - 4)
        ctx.stroke()
      }
    })

    ctx.restore()
  }
})


ChartJS.register({
  id: 'startEndVerticalLines',
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const xScale = scales.x
    const yBottom = chartArea.bottom + 4

    const firstX = xScale.getPixelForTick(0)
    const lastX = xScale.getPixelForTick(xScale.ticks.length - 1)

    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([]) // solid
    ctx.strokeStyle = '#D0D0D0'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'

    // First short vertical line (12px height)
    ctx.moveTo(firstX, yBottom)
    ctx.lineTo(firstX, yBottom - 12)

    // Last short vertical line (12px height)
    ctx.moveTo(lastX, yBottom)
    ctx.lineTo(lastX, yBottom - 12)

    ctx.stroke()
    ctx.restore()
  }
})

const internalData = computed(() => {
  const rawData = props.data[modelValue.value] || {}
  const seriesColors = {
    gold: 'rgba(231, 194, 77, 1)',
    coin: 'rgba(255, 159, 102, 1)',
    silver: 'rgba(143, 143, 143, 1)',
    usd: 'rgba(102, 191, 161, 1)'
  }


  return {
    labels: props.timestamps,
    datasets: Object.entries(rawData).map(([key, values]) => ({
      label: key,
      data: values,
      borderColor: seriesColors[key],
      backgroundColor: `${seriesColors[key]}33`,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  }
})




const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 10, right: 0, bottom: 10, left: 0 }
  },
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    x: {
      ticks: {
        font: { family: 'iranYekanWeb', size: 10, weight: '400' },
        color: '#000000',
        align: 'center',
        padding: 10,
      },
      grid: { display: false },
      border: { display: false }
    },
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => formatToMillions(value),
        font: { family: 'iranYekanWeb', size: 10, weight: '400' },
        color: '#000000',
        padding: 10,
      },
      suggestedMin: 5400000,
      suggestedMax: 6600000,
      grid: { display: false },
      border: { display: false }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(12, 38, 71, 1)',
      titleColor: 'rgba(255, 255, 255, 1)',
      bodyColor: 'rgba(255, 255, 255, 1)',
      corenrRadius:8,
      padding: 8,
      displayColors: false,
      titleFont: { family: 'iranYekanWeb', size: 10, weight: 'bold',lineHeight: 1.4, },
      bodyFont: { family: 'iranYekanWeb', size: 10, },
      callbacks: {
        title: (ctx) => {
      const index = ctx[0].dataIndex
      const value = ctx[0].raw
      const time = props.timestamps?.[index] || ''
      return `${formatToMillions(value)} تومان\n${time}`
    },
    label: () => '',
      }
    },
    dashedGridFixer: {
      dash: [5, 5],
      width: 1.5,
      color: '#D0D0D0'
    },
    xAxisVerticalDashedLines: {},
    startEndVerticalLines: {}
  }
}


</script>

<style scoped>
.chart-container {
  width: 100%;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  min-height: 18.375rem; /* 310px */
}

.chart-wrapper canvas {
  width: 100% !important;
}

.price-header {
  margin-bottom: 0.9375rem; /* 15px */
  text-align: right;
}

.price-label {
  font-size: 0.875rem; /* 14px */
  color: #444;
}

.price-value {
  font-size: 1.125rem; /* 18px */
  font-weight: bold;
  color: #000;
  margin-right: 0.5rem; /* 8px */
}

.time-indicators {
  display: flex;
  justify-content: space-between;
  border-radius: 0.375rem; /* 6px */
  margin-bottom: 1rem; /* 16px */
}

.indicator {
  padding: 0.25rem; /* 4px */
  color: rgba(64, 64, 65, 1);
}

.time-filter-container {
  border-radius: 0.5rem; /* 8px */
}

.time-option {
  flex: 1;
  text-align: center;
  padding: 0.5rem; /* 8px */
  border-radius: 0.5rem; /* 8px */
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-option.active {
  background-color: white;
  font-weight: 700;
}
.profit-indicator-div{
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 3px;
  background-color: red;
}
</style>

