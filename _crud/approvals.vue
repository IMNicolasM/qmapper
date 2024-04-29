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
              align: 'center',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'RuleValue',
              label: 'Source Value',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'RuleValue', 'refTableColumnValue')
            },
            {
              name: 'RuleValueDesc',
              label: 'Source Value Description',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'RuleValueDesc', 'refTableColumnValueDesc')
            },
            {
              name: 'MatchType',
              label: 'Match type',
              field: row => row,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'MatchType')
            },
            {
              name: 'UnifiedValue',
              label: 'Unified Value',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'UnifiedValue')
            },
            {
              name: 'UnifiedValueDesc',
              label: 'Unified Value Desc',
              field: row => row,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'UnifiedValueDesc')
            },
            {
              name: 'UnifiedValue_Group',
              label: 'Unified Value Group',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'UnifiedValue_Group')
            },
            {
              name: 'UnifiedValue_Category',
              label: 'Unified Value Category',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'UnifiedValue_Category')
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
              vIf: this.$hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Approve',
              action: (item) => {
                console.warn("Approve: ", item)
              },
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: this.$hasAccess('imapper.approvals.acceptance'),
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
    },
    formatRowDiff(row, column, diffColumn = '', columnColor = 'ApprovalInd') {
      if (!row || !column) return '-'

      let columnToCompare = diffColumn;

      if(!diffColumn?.length) columnToCompare = `ref${column}`
      let compareValue = row[column]
      let diffValue = row[columnToCompare]

      const { color } = this.colors[row[columnColor]] || {
        color: '#156DAC'
      };

      if(compareValue == null) compareValue = String(compareValue).toUpperCase()
      if(diffValue == null) diffValue = String(diffValue).toUpperCase()

      const textColor = `tw-text-[${color}]`

      return `<div class="tw-py-0.5 tw-px-1" style="font-size: 13px;">
<span class="tw-text-[#666] tw-line-through">${diffValue}</span>
<br />
<span class="${textColor} tw-font-semibold">${compareValue}</span>
</div>`
    },

  }
};
</script>
