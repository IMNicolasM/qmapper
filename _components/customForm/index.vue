<template>
  <master-modal v-model="showModal" width="320px" custom-class="!tw-max-w-[822px]"
                :title="id ? `Editing: ${id}` : ''"
                :actions="modalActions" :loading="loading"
                @hide="closeModal">
    <!--Title of the modal body-->
    <div class="column tw-gap-3 tw-mt-3.5">
      <h3 class="tw-text-base tw-text-[#0092DB] tw-font-semibold tw-leading-5">Description: "{{ sourceValueDesc }}"</h3>

      <p class="tw-text-[#444444] tw-text-sm tw-leading-4">Please select the unified values for the "{{ data?.TableColumnName }}:
        '{{ sourceValue }}'"</p>
    </div>
    <!--Form-->
    <q-form
      autocorrect="off"
      autocomplete="off"
      ref="formContent"
      class="row q-col-gutter-md col-12 tw-mt-5"
      @submit="submitData"
      @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
    >
      <!--Fields-->
      <div class="row q-col-gutter-x-md q-mb-sm">
        <template v-for="(field, key) in formFields" :key="key">
          <div v-if="hidenFields(field)"
               :class="`${field.colClass || field.columns || field.col || 'col-12'} tw-mb-px`">
            <div v-if="field.type == 'text'" class="tw-flex tw-flex-nowrap tw-items-center tw-text-[#666666] tw-mb-3 md:tw-mt-2.5">
              <div class="tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-[#666666] tw-mx-1.5" /> <div v-html="field?.props?.message || ''" ></div>
            </div>
            <dynamic-field v-else :field="field" :item-id="field.fieldItemId"
                           v-model="formData[field.name || key]" />
          </div>
        </template>
      </div>

    </q-form>

  </master-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from './controller';

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
.master-dialog .master-dialog__body {
  max-height: calc(100vh - 240px);
  padding: 0 16px 0 16px;
}
</style>
