import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '初始化',
    visible: true,
    component: () => import('../views/Init.vue')
  },
  {
    path: '/Entity',
    name: '实体',
    visible: true,
    component: () => import('../views/Entity.vue')
  },
  {
    path: '/Model',
    name: '模型',
    visible: true,
    component: () => import('../views/Model.vue')
  },
  {
    path: '/ClippingPlane',
    name: '模型切割',
    visible: true,
    component: () => import('../views/ClippingPlane.vue')
  },
  {
    path: '/Path',
    name: '轨迹',
    visible: false,
    component: () => import('../views/Path.vue')
  },
  {
    path: '/EarthSdk',
    name: 'EarthSdk',
    visible: true,
    component: () => import('../views/EarthSdk.vue')
  },
  {
    path: '/Three',
    name: 'ThreeJS',
    visible: true,
    component: () => import('../views/Three')
  },
  {
    path: '/Three2',
    name: 'ThreeJSHushi',
    visible: false,
    component: () => import('../views/Three/index2.vue')
  },
  {
    path: '/Boom',
    name: 'Three炸裂',
    visible: true,
    component: () => import('../views/Three/Boom.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
