export default [
  {
    path: '/channel/overview',
    name: 'channelOverview',
    component: () =>
            import('views/Channel/Overview.vue')
  }, {
    path: '/channel/contrast',
    name: 'channelContrast',
    component: () =>
            import('views/Channel/Contrast.vue')
  }, {
    path: '/channel/optimization',
    name: 'channelOptimization',
    component: () =>
            import('views/Channel/Optimization.vue')
  }, {
    path: '/channel/track',
    name: 'channelTrack',
    component: () =>
            import('views/Channel/Track.vue')
  },
];
