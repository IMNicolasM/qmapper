<template>
  <div>
    <custom-form ref="referenceForm" />
    <crud
      ref="crudComponent"
      :crud-data="import('src/modules/qmapper/_crud/references.vue')"
      :custom-data="customCrudData"
    />
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import controller from 'src/modules/qmapper/_pages/admin/reference/controller'
import customForm from 'src/modules/qmapper/_components/customForm/index.vue'

export default defineComponent({
  props: {},
  components: {
    customForm
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
