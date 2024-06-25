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
      col: 'col-12',
      permission: 'imapper.approvals.manage',
      component: () => import('src/modules/qmapper/_components/quick-cards/approvalInfo/index.vue')
    }
  ]
}
