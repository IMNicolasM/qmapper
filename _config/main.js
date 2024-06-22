export default {
  moduleName: 'imapper',
  //Entities
  entityNames: {
    references: 'references',
    approvals: 'approvals'
  },
  //Quick Cards
  quickCards: [
    {
      active: true,
      permission: 'profile.user.manage',
      component: () => import('src/modules/qmapper/_components/quick-cards/approvalInfo/index.vue')
    }
  ]
}
