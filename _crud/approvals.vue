<template></template>
<script>
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
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left' },
            {
              name: 'TableColumnName',
              label: 'Column name',
              field: 'TableColumnName',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            { name: 'TablePK_EDW', label: 'Table PK (EDW)', field: 'TablePK_EDW', align: 'left', sortable: true },
            {
              name: 'TableColumnValue',
              label: 'Column value',
              field: 'TableColumnValue',
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
          filters: {
            Division: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Division',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'Division', id: 'Division' },
                requestParams: { filter: { _distinct: 'Division' } }
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
            TableColumnName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Column Name',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'TableColumnName', id: 'TableColumnName' },
                requestParams: { filter: { _distinct: 'TableColumnName' } }
              }
            }
          },
          requestParams: {
            notToSnakeCase: ['TableColumnName', 'TableColumnValue', 'TablePK_EDW']
          },
          excludeActions: ['export', 'sync', 'recommendations']
        },
        update: {
          title: 'Edit Rule',
          requestParams: {
            notToSnakeCase: ['UNI_RefID', 'TableColumnName', 'TableColumnValue', 'MatchType','TablePK_EDW', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
          },
        },
        formLeft: {
          UNI_RefID: { value: '' },
          TableColumnName: {
            value: null,
            type: 'select',
            required: true,
            props: {
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Column name',
              clearable: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'TableColumnName', id: 'TableColumnName' },
              requestParams: { filter: { _distinct: 'TableColumnName' } }
            }
          },
          Division: {
            value: null,
            type: 'select',
            props: {
              label: 'Division',
              readonly: this.crudInfo.typeForm === 'update',
              options: [
                {label: 'ALL', value: 'ALL'}
              ]
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'Division', id: 'Division' },
              requestParams: { filter: { _distinct: 'Division' } }
            }
          },
          TableColumnValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: !this.crudInfo.TableColumnName,
              label: 'Column value',
              options: [],
            },
            ...loadOptions.columnValue
          },
          'Data owners': {
            value: '',
            type: 'input',
            props: {
              readonly: true,
              label: 'Data owners'
            }
          }
        },
        formRight: {
          MatchType: {
            value: 'EXACT',
            type: 'select',
            require: true,
            props: {
              label: 'Match type*',
              options: [
                { label: 'EXACT', value: 'EXACT' },
                { label: 'PATTERN', value: 'PATTERN' }
              ],
              readonly: this.crudInfo.typeForm === 'update'
            }
          },
          UnifiedValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: !this.crudInfo.TableColumnValue,
              label: 'Unified Value'
            },
            ...loadOptions.unifiedValue
          },
          UnifiedValue_Group: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: !this.crudInfo.UnifiedValue,
              label: 'Unified Value Group'
            },
            ...loadOptions.unifiedValueGroup
          },
          UnifiedValue_Category: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: !this.crudInfo.UnifiedValue,
              label: 'Unified Value Category'
            },
            ...loadOptions.UnifiedValueCategory
          }
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              if(changedFields.includes('TableColumnName')) {
                formData = {
                  ...formData,
                  TableColumnValue: null,
                  UnifiedValue: null,
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
  }
};
</script>
