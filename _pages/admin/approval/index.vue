<template>
  <div>
    <master-modal
      v-model="show"
      title="Action Confirmation"
      :actions="modalActions"
    >
      <div v-if="!!currentAction">
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
