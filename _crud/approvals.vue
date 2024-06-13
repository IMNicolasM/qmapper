<template></template>
<script>
import { PROPS_BUTTONS } from 'src/modules/qmapper/_pages/admin/approval/constant';

export default {
  data() {
    return {
      crudId: this.$uid(),
      notToSnakeCase: ['approvalInd', 'division', 'ruleCreatedBy', 'tableColumnName', 'ruleCreatedDate', 'ruleValue', 'ruleValueDesc', 'matchType', 'unifiedValue', 'unifiedValueDesc', 'unifiedValueGroup', 'unifiedValueCategory']
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
              name: 'approvalInd',
              label: 'Status',
              field: row => row,
              align: 'center',
              format: (item) => this.getTag(item)
            },
            {
              name: 'division',
              label: 'Division',
              field: 'division',
              align: 'rigth',
              sortable: true
            },
            {
              name: 'ruleCreatedBy',
              label: 'Requester',
              field: 'userCreated',
              sortable: true,
              align: 'center',
              format: val => val?.fullName || val?.full_name || 'NAN'
            },
            {
              name: 'tableColumnName',
              label: 'Source Column',
              field: 'tableColumnName',
              align: 'center',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'ruleCreatedDate',
              label: 'Date',
              field: 'ruleCreatedDate',
              align: 'center',
              sortable: true,
              format: val => val ? this.getDate(val) : '-',
            },
            {
              name: 'ruleValue',
              label: 'Source Value',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'ruleValue', 'tableColumnValue')
            },
            {
              name: 'ruleValueDesc',
              label: 'Source Value Description',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'ruleValueDesc', 'tableColumnValueDesc')
            },
            {
              name: 'matchType',
              label: 'Match type',
              field: row => row,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'matchType')
            },
            {
              name: 'unifiedValue',
              label: 'Unified Value',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'unifiedValue')
            },
            {
              name: 'unifiedValueDesc',
              label: 'Unified Value Desc',
              field: row => row,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'unifiedValueDesc')
            },
            {
              name: 'unifiedValueGroup',
              label: 'Unified Value Group',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'unifiedValueGroup')
            },
            {
              name: 'unifiedValueCategory',
              label: 'Unified Value Category',
              field: row => row,
              sortable: true,
              align: 'center',
              format: (val) => this.formatRowDiff(val, 'unifiedValueCategory')
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          filters: {
            unifiedValue: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value',
                clearable: true
              },
              ...this.getLoadOption('unifiedValue')
            },
            unifiedValueDesc: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Description',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueDesc')
            },
            unifiedValueGroup: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Group',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueGroup')
            },
            unifiedValueCategory: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Category',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueCategory')
            },
            tableName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Subject Area',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.metadata',
                select: { label: 'subjectArea', id: 'tableName' }
              }
            },
            approvalInd: {
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
            division: {
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
                select: { label: 'division', id: 'division' },
                requestParams: { filter: { _distinct: 'division' } }
              }
            },
            sourceSystem: {
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
                select: { label: 'sourceSystem', id: 'sourceSystem' },
                requestParams: { filter: { _distinct: 'sourceSystem' } }
              }
            }
          },
          requestParams: {
            notToSnakeCase: this.notToSnakeCase,
            include: 'reference,userCreated'
          },
          excludeActions: ['export', 'sync', 'recommendations']
        }
      };
    }
  },
  methods: {
    //Tag to show status
    getTag(item) {
      const ind = item.approvalInd;
      if (!ind) return '-';
      const { bg, color } = PROPS_BUTTONS[ind] || PROPS_BUTTONS.DEFAULT

      // <i className="fa-solid fa-comment-dots"></i>
      return `<span class="tw-border tw-py-0.5 tw-px-2 tw-rounded-md tw-font-bold" style="background-color: ${bg}; color: ${color}; font-size: 10px;">${ind}</span>`;
    },
    //Compare style of column
    formatRowDiff(row, column, diffColumn = '', columnColor = 'approvalInd') {
      if (!row || !column) return '-';

      let columnToCompare = diffColumn;

      if (!diffColumn?.length) columnToCompare = column;
      let compareValue = row[column];
      let diffValue = !!row?.reference ? row?.reference[columnToCompare] : "-";

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
      const date = this.$trd(val, { fromUTC: false, type: 'long' }).split('at');

      return `<div>
<span><b>Date:</b> ${date[0]}</span>
<br />
<span><b>Hour:</b> ${date[1]}</span>
</div>`
    }
  }
};
</script>
