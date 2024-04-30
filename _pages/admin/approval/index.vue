<template>
  <div>
    <crud
      ref="crudComponent"
      :crud-data="import('src/modules/qmapper/_crud/approvals.vue')"
      :custom-data="customCrudData.productPriceList"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      actions: {
        1: 'APPROVED',
        2: 'DENIED'
      }
    };
  },
  computed: {
    customCrudData() {
      return {
        read: {
          actions: [
            {
              icon: 'fa-regular fa-circle-check',
              vIf: this.$hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Approve',
              action: (item) => this.sendAction(this.actions[1], item),
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: this.$hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Deny',
              action: (item) => this.sendAction(this.actions[2], item),
            }
          ]
        }
      }
    }
  },
  methods: {
    //Send action
    async sendAction(action, attributes) {
      await this.$crud.post(`${config('apiRoutes.qmapper.approvals')}/action`, {
        action,
        attributes
      }).then(response => {
        this.getDataTable(true)
      }).catch(err => console.warn('Error', err));
    },
    async getDataTable(refresh) {
      await this.$refs.crudComponent.getDataTable(refresh);
    },
  }
};
</script>
