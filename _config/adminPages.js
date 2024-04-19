export default {
  references: {
    permission: 'profile.user.manage',
    activated: true,
    authenticated: false,
    path: '/mapper/references',
    name: 'qmapper.admin.references',
    crud : import('modules/qmapper/_crud/references'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Data Mapping (PT)',
    icon: 'fa-light fa-link',
    subHeader: {
      refresh: true,
    }
  },
}
