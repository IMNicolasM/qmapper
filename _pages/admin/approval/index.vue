<template>
  <div>
    <master-modal
      v-model="show"
      title="Are You Sure?"
      :actions="modalActions"
    >
      <div v-if="!!currentAction">
        <p>Before confirming, would you like to leave a comment to explain your choice?</p>
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
