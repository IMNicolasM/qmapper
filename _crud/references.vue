<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      notToSnakeCase: ['UNI_RefID', 'TableColumnName', 'TableColumnValue', 'TableColumnValueDesc', 'MatchType', 'TablePK_EDW', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.references'),
        apiRoute: 'apiRoutes.qmapper.references',
        permission: 'imapper.references',
        create: {
          title: 'Create New Value',
          requestParams: {
            notToSnakeCase: this.notToSnakeCase
          },
          useSystemMessage: true
        },
        modalActions: {
          save: {
            props: {
              label: 'Send Request',
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
              name: 'TableColumnName',
              label: 'Source Column',
              field: 'TableColumnName',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'TableColumnValue',
              label: 'Source Value',
              field: 'TableColumnValue',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'TableColumnValueDesc',
              label: 'Source Value Description',
              field: 'TableColumnValueDesc',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'MatchType',
              label: 'Match type',
              field: 'MatchType',
              sortable: true,
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
              sortable: true,
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
          filters: {
            UnifiedValue: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue')
            },
            UnifiedValueDesc: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Description',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValueDesc')
            },
            UnifiedValue_Group: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Group',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue_Group')
            },
            UnifiedValue_Category: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Category',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue_Category')
            },
            countRequest: {
              value: 0,
              type: 'checkbox',
              props: {
                label: 'Pending Approvals'
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
            MappingInd: {
              value: 'UNMAPPED',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Mapping indicator',
                options: [
                  { label: 'UNMAPPED', value: 'UNMAPPED' },
                  { label: 'MAPPED', value: 'MAPPED' }
                ]
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
            include: 'requestApproval',
            notToSnakeCase: this.notToSnakeCase
          },
          disabled: {
            row: (item) => item?.countRequest > 0
          },
          excludeActions: ['export', 'sync', 'recommendations'],
          actions: [
            {
              name: 'edit',
              format: (item) => (item?.countRequest > 0 ? { vIf: false } : {})
            },
            {
              icon: 'fa-regular fa-timer',
              label: 'Request Pending',
              vIf: false,
              action: (item) => {
                this.$router.push({ name: 'qmapper.admin.approvals', params: {} });
              },
              format: (item) => (item?.countRequest > 0 ? { vIf: true } : {})
            }
          ]
        },
        update: {
          title: 'Update Value',
          requestParams: {
            notToSnakeCase: [...this.notToSnakeCase, 'UNI_RuleID', 'Division']
          },
          customFormResponse: (criteria, formData, customParams) => {
            return new Promise((resolve, reject) => {
              this.$crud.post('apiRoutes.qmapper.references', { attributes: formData })
                .then(response => resolve(response))
                .catch(error => reject(error?.response?.data?.errors || {}));
            });
          },
          useSystemMessage: true
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              if (changedFields.includes('TableName')) {
                formData = {
                  ...formData,
                  TableColumnName: null,
                  TableColumnValue: null,
                  TableColumnValueDesc: null,
                  UnifiedValue: null,
                  UnifiedValueDesc: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              } else if (changedFields.includes('TableColumnName')) {
                formData = {
                  ...formData,
                  TableColumnValue: null,
                  TableColumnValueDesc: null,
                  UnifiedValue: null,
                  UnifiedValueDesc: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              } else if (changedFields.includes('UnifiedValue')) {
                formData = {
                  ...formData,
                  UnifiedValueDesc: null
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
    getLoadOption(name) {
      return {
        loadOptions: {
          apiRoute: 'apiRoutes.qmapper.references',
          select: { label: name, id: name },
          requestParams: {
            filter: {
              _distinct: name
            }
          }
        }
      };
    }
  }
};
</script>
