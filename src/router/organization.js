export default [
  {
    path: '/organization/overview',
    name: 'organizationOverview',
    component: () =>
            import('views/Organization/Overview.vue')
  }, { 
    path: '/organization/contrast',
    name: 'organizationContrast',
    component: () =>
            import('views/Organization/Contrast.vue')
  }, { 
    path: '/organization/optimization',
    name: 'organizationOptimization',
    component: () =>
            import('views/Organization/Optimization.vue')
  }, { 
    path: '/organization/track',
    name: 'organizationTrack',
    component: () =>
            import('views/Organization/Track.vue')
  },
];
