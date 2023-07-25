export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', name: 'login',component: './User/Login' }] },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_chart', name: '智能分析',icon: 'barChart', component: './AddChart' },
  { path: '/add_chart_async', name: '智能分析（异步）',icon: 'barChart', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表',icon: 'pieChart', component: './MyChart' },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: 'subAdmin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: 'subPage', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
