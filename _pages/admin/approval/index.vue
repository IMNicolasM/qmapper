<template>
  <div>
    <master-modal
      v-model="show"
      id="masterModalAction"
      :actions="modalActions"
    >
      <div v-if="!!currentAction">
        <h3 class="content__title">Action Confirmation</h3>
        <p>Before proceeding, would you like to include a rationale for your decision?</p>
        <br />
          <dynamic-field
            v-model="comment"
            :field="fieldComment"
          />
      </div>
    </master-modal>
    <crud
      ref="crudComponent"
      :crud-data="import('src/modules/qmapper/_crud/approvals.vue')"
      :custom-data="customCrudData"
    />
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import controller from 'src/modules/qmapper/_pages/admin/approval/controller'

export default defineComponent({
  props: {},
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>

<style lang="scss">
#masterModalAction {
  hr {
    display: none;
  }
  .content__title {
    color: #444444;
    font-size: 18px;
    font-weight: 700;
  }

  .master-dialog__body {
    margin-top: -50px;
    margin-bottom: 20px;
  }

  .master-dialog__actions {
    padding-bottom: 14px;
  }
}
</style>
