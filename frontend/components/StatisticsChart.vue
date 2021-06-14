<template>
  <div class="chart-area">
    <div class="container">
      <div class="info">
        <div class="info__item" v-for="(item, index) in infoItems" :key="'chart-info-' + index">
          <div class="info__num">{{ item[0] }}</div>
          <div class="info__title">{{ item[1] }}</div>
        </div>
      </div>
      <h3>По департаментам</h3>
      <div class="doughnut-chart">
        <canvas ref="canvas" id="departmentChart" width="100%" height="100%"></canvas>
        <div class="legend" id="legend" ref="legend"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import 'chartjs-plugin-datalabels'
import getDeclension from '@/functions/getDeclension'
import styles from '@/styles/_export.scss'

const empWords = [
  ['Сотрудник', 'Сотрудника', 'Сотрудников'],
  ['Мужчина', 'Мужчины', 'Мужчин'],
  ['Женщина', 'Женщины', 'Женщин'],
  ['Пара', 'Пары', 'Пар']
]

export default {
  name: 'StatisticsChart',
  extends: Doughnut,
  props: {
    statisticsData: {
      type: Object
    }
  },
  data: () => ({
    chartHiddenIndexes: {}
  }),
  beforeUpdate() {
    const chartData = this.getChartData(this)
    this.renderChart(...chartData)
    let legendContainer = this.$refs.legend
    legendContainer.innerHTML = this.generateLegend()
    let legendItems = legendContainer.getElementsByTagName('li')
    for (let i = 0; i < legendItems.length; i += 1) {
      legendItems[i].addEventListener('click', this.legendClickCallback, false)
    }
  },
  computed: {
    datasetsData: function() {
      return this.statisticsData.departments.map(emp => emp.employees)
    },
    datasetsLabels: function() {
      return this.statisticsData.departments.map(name => name.title)
    },
    infoItems: function() {
      const info = [
        [this.statisticsData.total, getDeclension(this.statisticsData.total, empWords[0]) + ' в штате'],
        [this.statisticsData.males, getDeclension(this.statisticsData.males, empWords[1])],
        [this.statisticsData.females, getDeclension(this.statisticsData.females, empWords[2])],
        [this.statisticsData.couples, getDeclension(this.statisticsData.couples, empWords[3])]
      ]
      return info
    },
    chartColors: function() {
      let colors = styles.legendColors.toString()
      let colorArray = colors.split(',')
      return colorArray
    }
  },
  methods: {
    legendClickCallback(event) {
      event = event || window.event
      let target = event.target || event.srcElement
      while (target.nodeName !== 'LI') {
        target = target.parentElement
      }
      let parent = target.parentElement
      let chart = this.$data._chart
      let index = [...parent.children].indexOf(target)
      let meta = chart.getDatasetMeta(0)
      let item = meta.data[index]
      if (item.hidden === null || item.hidden === false) {
        item.hidden = true
        target.classList.add('hidden')
        this.chartHiddenIndexes[index] = index
      } else {
        target.classList.remove('hidden')
        item.hidden = null
        delete this.chartHiddenIndexes[index]
      }
      chart.update()
    },
    total(chart) {
      let data = chart.chart.data.datasets[0].data
      let hiddenIndexes = this.chartHiddenIndexes
      let filteredData = data.filter(function(elem, index) {
        if (index in hiddenIndexes) {
          return ''
        } else {
          return elem
        }
      })
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      let total = filteredData.reduce(reducer)
      return total
    },
    getChartData(valueContext) {
      const data = {
        datasets: [
          {
            data: this.datasetsData,
            backgroundColor: this.chartColors
          }
        ],
        labels: this.datasetsLabels
      }
      const options = {
        cutoutPercentage: 56,
        legend: false,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: {
          bodyFontSize: 30
        },
        plugins: {
          datalabels: {
            display: 'auto',
            color: '#fff',
            font: function(context) {
              let width = context.chart.width
              let size = Math.round(width / 20)
              return {
                size: size,
                family: 'Roboto',
                weight: 500
              }
            },
            formatter: function(value, context) {
              if (+((value * 100) / valueContext.total(context)).toFixed(1) > 5) {
                return ((value * 100) / valueContext.total(context)).toFixed(1) + '%'
              } else {
                return ''
              }
            }
          }
        }
      }
      const chartData = [data, options]
      return chartData
    }
  }
}
</script>
