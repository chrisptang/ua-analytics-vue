import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NSFWView from '../views/NSFWView.vue'
import KeywordIdeaView from '../views/KeywordIdeaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/nsfw',
      name: 'nsfw',
      component: NSFWView
    },
    {
      path: '/idea',
      name: 'idea',
      component: KeywordIdeaView
    }
  ]
})

export default router
