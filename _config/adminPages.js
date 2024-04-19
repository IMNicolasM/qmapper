export default {
  references: {
    permission: null,
    activated: true,
    authenticated: false,
    path: '/mapper/references',
    name: 'qmapper.admin.references',
    crud : import('@imagina/qmapper/_crud/references'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'Data Mapping (PT)',
    icon: 'fa-light fa-link',
    subHeader: {
      refresh: true,
    }
  },
}
