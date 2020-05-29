/** When your routing table is too long, you can split it into small modules**/

import HeatMap from '@/views/analysis/HeatMap'

const analysis = {
  path: '/analysis/heat',
  component: HeatMap,
  redirect: 'noRedirect',
  name: 'HeatMap',
  meta: {
    title: 'heat',
    icon: 'chart'
  }
}

export default analysis
