<template>
  <div>
    <master-modal
      v-model="show"
      :title="currentAction ? `Are you certain you ${currentAction.toLowerCase()} this request?` : ''"
      :actions="modalActions"
    >
      <div v-if="!!currentAction">
        <p>Please provide the reason for your decision to {{ currentAction.toLowerCase() }} this request.</p>
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
