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
        entityName: config('main.qmapper.entityNames.references'),
        apiRoute: 'apiRoutes.qmapper.references',
        permission: 'imapper.references',
        create: {
          title: 'Create New Value'
        },
        read: {
          columns: [
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left' },
            { name: 'TableColumnName', label: 'Column name', field: 'TableColumnName', align: 'rigth', sortable: true },
            { name: 'TablePK_EDW', label: 'Table PK (EDW)', field: 'TablePK_EDW', align: 'left' },
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
                clearable: true,
                class: 'col-md-6'
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'TableColumnName', id: 'TableColumnName' },
                requestParams: { filter: { _distinct: 'TableColumnName' } }
              }
            }
          }
        },
        update: {
          title: 'Update Value',
          requestParams: {
            field: 'UNI_RefID'
          }
        },
        formLeft: {
          UNI_RefID: { value: '' },
          TableColumnName: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Column name'
            }
          },
          TablePK_EDW: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Table PK (EDW)'
            }
          },
          TableColumnValue: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Column value'
            }
          },
          'Data owners': {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Data owners'
            }
          }
        },
        formRight: {
          UnifiedValue: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Unified Value'
            }
          },
          UnifiedValue_Group: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Unified Value Group'
            }
          },
          UnifiedValue_Category: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Unified Value Category'
            }
          }
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
