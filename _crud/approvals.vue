<template></template>
<script>
import { TEST_USERS as users, TAG_COLORS } from 'src/modules/qmapper/_pages/admin/approval/constant';

export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      const info = this.crudInfo;
      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.approvals'),
        apiRoute: 'apiRoutes.qmapper.approvals',
        permission: 'imapper.approvals',
        create: false,
        modalActions: {
          save: {
            props: {
              label: 'Save',
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
              field: row => row,
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
              format: val => users[val] || 'NAN'
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
            notToSnakeCase: ['ApprovalInd', 'RuleCreatedBy', 'TableColumnName', 'RuleValue', 'RuleValueDesc', 'MatchType', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
          },
          excludeActions: ['export', 'sync', 'recommendations']
        },
        update: {
          title: 'Editing',
          customFormResponse: (criteria, formData, customParams) => {
            return new Promise((resolve, reject) => {
              this.$crud.post(`${config('apiRoutes.qmapper.approvals')}/action`, { editing: true, attributes: formData })
                .then(response => resolve(response))
                .catch(error => reject(error?.response?.data?.errors || {}))
            })
          },
        },
        formLeft: {
          SeqNo: { value: '' },
          UNI_RuleID: { value: '' },
          UNI_MetaID: { value: '' },
          SourceSystem: {
            value: null,
            type: 'select',
            props: {
              label: 'Source Application'
            },
            ...this.getLoadOption('SourceSystem')
          },
          Division: {
            value: null,
            type: 'select',
            props: {
              label: 'Division',
              options: [
                { label: 'ALL', value: 'ALL' }
              ]
            },
            ...this.getLoadOption('Division')
          },
          TableName: {
            value: null,
            type: 'select',
            props: {
              label: 'Table Name'
            },
            ...this.getLoadOption('TableName')
          },
          TableColumnName: {
            value: null,
            type: 'select',
            required: true,
            props: {
              label: 'Source Column'
            },
            ...this.getLoadOption('TableColumnName', { TableName: info?.TableName })
          },
          RuleValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Source Value'
            },
            ...(info?.TableColumnName ? this.getLoadOption('TableColumnValue', { TableColumnName: info.TableColumnName }) : {})
          },
          RuleValueDesc: {
            value: '',
            type: 'input',
            required: true,
            props: {
              label: 'Source Value Description'
            }
          },
          MatchType: {
            value: 'EXACT',
            type: 'select',
            required: true,
            props: {
              label: 'Match type*',
              options: [
                { label: 'Exact Match', value: 'EXACT' }
                // { label: 'PATTERN', value: 'PATTERN' }
              ]
            }
          }
        },
        formRight: {
          UnifiedValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value'
            },
            ...(info?.TableColumnName ? this.getLoadOption('UnifiedValue', { TableColumnName: info.TableColumnName }) : {})
          },
          UnifiedValueDesc: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Description'
            },
            ...(info?.UnifiedValue ? this.getLoadOption('UnifiedValueDesc', { TableColumnName: info.UnifiedValue }) : {})
          },
          UnifiedValue_Group: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Group'
            },
            ...(info?.UnifiedValue ? this.getLoadOption('UnifiedValue_Group', { TableColumnName: info.UnifiedValue }) : {})
          },
          UnifiedValue_Category: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Category'
            },
            ...(info?.UnifiedValue ? this.getLoadOption('UnifiedValue_Category', { TableColumnName: info.UnifiedValue }) : {})
          },
          ApprovalInd: {
            value: 'APPROVED',
            type: 'select',
            required: true,
            props: {
              label: 'Mapping indicator',
              options: [
                { label: 'DENIED', value: 'DENIED' },
                { label: 'APPROVED', value: 'APPROVED' }
              ]
            }
          },
          RulePriority: {
            value: 1,
            type: 'input',
            required: true,
            props: {
              label: 'Rule Priority',
              type: 'number'
            }
          },
          RejectionComments: {
            value: '',
            type: 'input',
            props: {
              type: 'textarea',
              rows: '3',
              label: 'Leave a note'
            }
          }
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              if(changedFields.includes('TableName')) {
                formData = {
                  ...formData,
                  UNI_MetaID: null,
                  TableColumnName: null,
                  RuleValue: null,
                  RuleValueDesc: '',
                  UnifiedValue: null,
                  UnifiedValueDesc: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              } else if(changedFields.includes('TableColumnName')) {
                formData = {
                  ...formData,
                  RuleValue: null,
                  RuleValueDesc: '',
                  UnifiedValue: null,
                  UnifiedValueDesc: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              } else if(changedFields.includes('UnifiedValue')) {
                formData = {
                  ...formData,
                  UnifiedValueDesc: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              }
            }
            resolve(formData);
          });
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  },
  methods: {
    //Tag to show status
    getTag(item) {
      const ind = item.ApprovalInd;
      if (!ind) return '-';
      const { bg, color } = TAG_COLORS[ind] || {
        bg: '#B1E2FA',
        color: '#156DAC'
      };

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

      const { color } = TAG_COLORS[row[columnColor]] || {
        color: '#156DAC'
      };

      if (compareValue == null) compareValue = String(compareValue).toUpperCase();
      if (diffValue == null) diffValue = String(diffValue).toUpperCase();

      return `<div class="tw-py-0.5 tw-px-1" style="font-size: 13px;">
<span class="tw-text-[#666] tw-line-through">${diffValue}</span>
<br />
<span class="tw-font-semibold" style="color: ${color};">${compareValue}</span>
</div>`;
    },
    //Get Load Option
    getLoadOption(name, moreFilters = {}) {
      return {
        loadOptions: {
          apiRoute: 'apiRoutes.qmapper.references',
          select: { label: name, id: name },
          requestParams: {
            filter: {
              _distinct: name,
              ...moreFilters
            }
          }
        }
      };
    }
  }
};
</script>
