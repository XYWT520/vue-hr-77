import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'employees',
      component: () => import('@/views/employees/employees.vue'),
      meta: { title: '员工管理', icon: 'people' }
    },
    {
      path: '/import', // 作为默认渲染路由
      name: 'import',
      component: () => import('@/views/employees/import.vue'),
      meta: { title: '员工管理', icon: 'people' },
      hidden: true
    }
  ]
}
