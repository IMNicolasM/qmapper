export default {
  references: {
    permission: 'imapper.references.manage',
    activated: true,
    authenticated: true,
    path: '/mapper/references',
    name: 'qmapper.admin.references',
    page: () => import('src/modules/qmapper/_pages/admin/reference/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'Data Mapping',
    icon: 'fa-light fa-table',
    subHeader: {
      refresh: true,
    }
  },
  approvals: {
    permission: 'imapper.approvals.manage',
    activated: true,
    authenticated: true,
    path: '/mapper/approvals',
    name: 'qmapper.admin.approvals',
    page: () => import('src/modules/qmapper/_pages/admin/approval/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'Approvals',
    icon: 'fa-regular fa-circle-check',
    subHeader: {
      refresh: true,
    }
  },
}
