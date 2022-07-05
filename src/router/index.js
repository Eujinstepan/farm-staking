import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/Trade.vue')
  },
  {
    path: '/prefill/:fromToken/:toToken/:targetPrice',
    name: 'Trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/Trade.vue')
  },
  {
    path: '/prefill-trade/:fromToken/:toToken/:targetPrice/:tradeType',
    name: 'Trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/Trade.vue')
  },
  {
    path: '/farm',
    name: 'Farm',
    component: () => import(/* webpackChunkName: "about" */ '../views/Farm.vue')
  },
  {
    path: '/options',
    name: 'Options',
    component: () => import(/* webpackChunkName: "about" */ '../views/Options.vue')
  },
  {
    path: '/your-trades',
    name: 'TradesPerformance',
    component: () => import(/* webpackChunkName: "about" */ '../views/TradesPerformance.vue')
  },
  {
    path: '/invest',
    name: 'Invest',
    component: () => import(/* webpackChunkName: "about" */ '../views/Invest.vue')
  },
  {
    path: '/fund-performance',
    name: 'Fund Performance',
    component: () => import(/* webpackChunkName: "about" */ '../views/FundPerformance.vue')
  },
  {
    path: '/tradelytics',
    name: 'Trade analytics',
    component: () => import(/* webpackChunkName: "about" */ '../views/Analytics.vue')
  },
  {
    path: '/pro-trade/:fromAddress',
    name: 'Pro Trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProTrade.vue')
  },
  {
    path: '/get-civ/success',
    name: 'Get CIV Success',
    component: () => import(/* webpackChunkName: "about" */ '../views/GetCivSuccess.vue')
  },
  {
    path: '/get-civ',
    name: 'Get CIV',
    component: () => import(/* webpackChunkName: "about" */ '../views/GetCivPage.vue')
  },
  {
    path: '/get-civ-embedded',
    name: 'Get CIV',
    component: () => import(/* webpackChunkName: "about" */ '../views/GetCivEmbedded.vue')
  },
  {
    path: '/*',
    name: 'Trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/Trade.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes
})

export default router
