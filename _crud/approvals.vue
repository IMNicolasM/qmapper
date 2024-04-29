<template></template>
<script>
export default {
  data() {
    return {
      colors: {
        REQUESTED: {
          bg: '#BBC9FE',
          color: '#3040C2'
        },
        DENIED: {
          bg: '#FCE0DF',
          color: '#881915'
        },
        APPROVED: {
          bg: '#D6EEE0',
          color: '#185340'
        }
      },
      users: {
        1: 'Reunity Test',
        2: 'Reunity Admin'
      },
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.approvals'),
        apiRoute: 'apiRoutes.qmapper.approvals',
        permission: 'imapper.approvals',
        create: false,
        modalActions: {
          save: {
            props: {
              label: 'Approve',
              color: 'secondary'
            }
          },
          cancel: {
            props: {
              outline: true,
              color: 'secondary'
            }
          }
        },
        read: {
          columns: [
            {
              name: 'ApprovalInd',
              label: 'Status',
              field: 'ApprovalInd',
              align: 'center',
              sortable: true,
              format: (item) => this.getTag(item)
            },
            {
              name: 'RuleCreatedBy',
              label: 'Requester',
              field: 'RuleCreatedBy',
              sortable: true,
              align: 'center',
              format: val => this.users[val] || 'NAN'
            },
            {
              name: 'TableColumnName',
              label: 'Source Column',
              field: 'TableColumnName',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'RuleValue',
              label: 'Source Value',
              field: 'RuleValue',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'RuleValueDesc',
              label: 'Source Value Description',
              field: 'RuleValueDesc',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'MatchType',
              label: 'Match type',
              field: 'MatchType',
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue',
              label: 'Unified Value',
              field: 'UnifiedValue',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValueDesc',
              label: 'Unified Value Desc',
              field: 'UnifiedValueDesc',
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue_Group',
              label: 'Unified Value Group',
              field: 'UnifiedValue_Group',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue_Category',
              label: 'Unified Value Category',
              field: 'UnifiedValue_Category',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          requestParams: {
            include: 'reference',
            notToSnakeCase: ['ApprovalInd', 'TableColumnValue']
          },
          excludeActions: ['export', 'sync', 'recommendations'],
          actions: [
            {
              icon: 'fa-regular fa-circle-check',
              tooltip: 'Approve',
              action: (item) => {
                console.warn("Approve: ", item)
              },
            },
            {
              icon: 'fa-regular fa-ban',
              tooltip: 'Deny',
              action: (item) => {
                console.warn("Deny: ", item)
              },
            }
          ]
        },
        update: false,
        formLeft: {}
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  },
  methods: {
    getTag(item) {
      if (!item) return '-'
      const { bg, color } = this.colors[item] || {
        bg: '#B1E2FA',
        color: '#156DAC'
      };


      return `<span class="tw-border tw-py-0.5 tw-px-2 tw-rounded-md tw-font-bold" style="background-color: ${bg}; color: ${color}; font-size: 10px;">${item}</span>`
    }
  }
};
</script>
