<template>
  <div>
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

export default defineComponent({
  props: {},
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
