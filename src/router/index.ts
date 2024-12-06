import { createRouter, createWebHistory } from 'vue-router';
import CategoryView from '../views/CategoryView.vue';
import PaperReview from '../views/PaperReview.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/category/llm'
    },
    {
      path: '/category/:categoryId',
      component: CategoryView
    },
    {
      path: '/paper-review/:paperId',
      component: PaperReview,
      name: 'paper-review'
    }
  ]
});

export default router;