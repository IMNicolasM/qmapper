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
        delete: true,
        formLeft: {
          UNI_RefID: { value: '' },
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`
            }
          },
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`
            }
          },
          systemName: {
            value: '',
            type: 'input',
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.systemName')}*`
            }
          },
          description: {
            name: 'description',
            value: '',
            type: 'html',
            isTranslatable: true,
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`
            }
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}*`,
              options: [
                { label: this.$tr('isite.cms.label.enabled'), value: '1' },
                { label: this.$tr('isite.cms.label.disabled'), value: '0' }
              ]
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
