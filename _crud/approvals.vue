<template></template>
<script>
import { PROPS_BUTTONS } from 'src/modules/qmapper/_pages/admin/approval/constant';

export default {
  data() {
    return {
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
        read: {
          columns: [
            {
              name: 'ApprovalInd',
              label: 'Status',
              field: row => row,
              align: 'center',
              format: (item) => this.getTag(item)
            },
            {
              name: 'RuleCreatedBy',
              label: 'Requester',
              field: row => row,
              sortable: true,
              align: 'center',
              format: val => val.userNameCreated || val.RuleCreatedBy || 'NAN'
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
              name: 'RuleCreatedDate',
              label: 'Date',
              field: 'RuleCreatedDate',
              align: 'center',
              sortable: true,
              format: val => val ? this.getDate(val) : '-',
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
          filters: {
            UnifiedValue: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value',
                clearable: true
              },
              ...this.getLoadOption({ name: 'UnifiedValue' })
            },
            UnifiedValueDesc: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Description',
                clearable: true
              },
              ...this.getLoadOption({ name: 'UnifiedValueDesc' })
            },
            UnifiedValue_Group: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Group',
                clearable: true
              },
              ...this.getLoadOption({ name: 'UnifiedValue_Group' })
            },
            UnifiedValue_Category: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Category',
                clearable: true
              },
              ...this.getLoadOption({ name: 'UnifiedValue_Category' })
            },
            ApprovalInd: {
              value: 'REQUESTED',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Pending Approvals',
                options: [
                  { label: 'REQUESTED', value: 'REQUESTED' },
                  { label: 'DENIED', value: 'DENIED' },
                  { label: 'APPROVED', value: 'APPROVED' },
                  { label: 'CANCELLED', value: 'CANCELLED' }
                ]
              }
            },
            TableName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Subject Area',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.metadata',
                select: { label: 'SubjectArea', id: 'TableName' }
              }
            },
            Division: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Division',
                options: [
                  { label: 'ALL', value: 'ALL' }
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'Division', id: 'Division' },
                requestParams: { filter: { _distinct: 'Division' } }
              }
            },
            SourceSystem: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Source Application',
                options: [
                  { label: 'ALL', value: 'ALL' }
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.metadata',
                select: { label: 'SourceSystem', id: 'SourceSystem' },
                requestParams: { filter: { _distinct: 'SourceSystem' } }
              }
            }
          },
          requestParams: {
            include: 'reference',
            notToSnakeCase: ['ApprovalInd', 'RuleCreatedBy', 'TableColumnName', 'RuleValue', 'RuleValueDesc', 'MatchType', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category', 'RuleCreatedDate']
          },
          excludeActions: ['export', 'sync', 'recommendations']
        }
      };
    }
  },
  methods: {
    //Tag to show status
    getTag(item) {
      const ind = item.ApprovalInd;
      if (!ind) return '-';
      const { bg, color } = PROPS_BUTTONS[ind] || PROPS_BUTTONS.DEFAULT

      // <i className="fa-solid fa-comment-dots"></i>
      return `<span class="tw-border tw-py-0.5 tw-px-2 tw-rounded-md tw-font-bold" style="background-color: ${bg}; color: ${color}; font-size: 10px;">${ind}</span>`;
    },
    //Compare style of column
    formatRowDiff(row, column, diffColumn = '', columnColor = 'ApprovalInd') {
      if (!row || !column) return '-';

      let columnToCompare = diffColumn;

      if (!diffColumn?.length) columnToCompare = `ref${column}`;
      let compareValue = row[column];
      let diffValue = row[columnToCompare];

      const { color } = PROPS_BUTTONS[row[columnColor]] || PROPS_BUTTONS.DEFAULT;

      if (compareValue == null) compareValue = String(compareValue).toUpperCase();
      if (diffValue == null) diffValue = String(diffValue).toUpperCase();

      return `<div class="tw-py-0.5 tw-px-1" style="font-size: 13px;">
<span class="tw-text-[#666] tw-line-through">${diffValue}</span>
<br />
<span class="tw-font-semibold" style="color: ${color};">${compareValue || '-'}</span>
</div>`;
    },
    //Get Load Option
    getLoadOption({ name, moreFilters = {}, apiRoute = 'apiRoutes.qmapper.references', filter = {}, select = false }) {
      if (!Object.keys(filter)?.length) {
        filter = {
          _distinct: name,
          ...moreFilters
        };
      }

      if (!select) {
        select = { label: name, id: name };
      }
      return {
        loadOptions: {
          apiRoute,
          select,
          requestParams: {
            filter
          }
        }
      };
    },
    //Return date
    getDate(val) {
      const date = this.$trd(val, { fromUTC: true, type: 'long' }).split('at');

      return `<div>
<span><b>Date:</b> ${date[0]}</span>
<br />
<span><b>Hour:</b> ${date[1]}</span>
</div>`
    }
  }
};
</script>
