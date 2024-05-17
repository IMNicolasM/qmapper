<template>
  <master-modal v-model="showModal"
                :title="data?.id ? `Editing: ${data.id}` : 'Create'"
                custom-position :actions="modalActions" :loading="loading"
                @hide="closeModal">

    <h3>Please select the unified values for the "{{ data?.TableColumnName }}: '{{ data?.TableColumnValue || 'NULL'
      }}'"</h3>
    <p>Description: {{ data?.TableColumnValueDesc }}</p>

    <dynamic-form v-model="formData" :blocks="formFields" @submit="submitData" @hide="closeModal"
                  no-actions ref="refForm" no-reset-with-blocks-update hide-progress-bar />
  </master-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from 'src/modules/qmapper/_components/customForm/controller';

export default defineComponent({
  props: {},
  components: {},
  emits: ['updated', 'created'],
  setup(props, { emit }) {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
</style>
