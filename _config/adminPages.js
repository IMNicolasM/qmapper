export default {
  references: {
    permission: 'imapper.references.manage',
    activated: true,
    authenticated: true,
    path: '/mapper/references',
    name: 'qmapper.admin.references',
    crud : import('modules/qmapper/_crud/references'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Data Mapping',
    icon: 'fa-light fa-link',
    subHeader: {
      refresh: true,
    }
  },
}
