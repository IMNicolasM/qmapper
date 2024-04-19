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
        permission: 'profile.user',
        create: {
          title: this.$tr('iwebhooks.cms.title.newCategory')
        },
        read: {
          columns: [
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left' },
            { name: 'TableColumnName', label: 'Column name', field: 'TableColumnName', align: 'rigth' },
            { name: 'TablePK_EDW', label: 'Table PK (EDW)', field: 'TablePK_EDW', align: 'left' },
            { name: 'TableColumnValue', label: 'Column value', field: 'TableColumnValue', align: 'rigth' },
            {
              name: 'UnifiedValue',
              label: 'Unified Value',
              field: 'UnifiedValue',
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
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue_Category',
              label: 'Unified Value Category',
              field: 'UnifiedValue_Category',
              align: 'center',
              format: val => val ?? '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ]
        },
        update: {
          title: this.$tr('iwebhooks.cms.title.updateCategory'),
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
          "Data owners": {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: true,
              label: 'Data owners'
            }
          },
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
          },
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
