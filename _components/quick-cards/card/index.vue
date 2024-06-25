<template>
  <div>
    <div v-if="!loading" id="card" class="flex tw-max-w-72 tw-rounded-2xl">
      <div class="full-width flex tw-items-center tw-justify-between">
        <div v-if="title" :class="`tw-text-2xl tw-font-bold ${color} ${title?.class || ''}`">{{title.label}}</div>

        <div v-if="icon" class="flex tw-bg-green-100 tw-p-3 tw-items-center tw-rounded-2xl tw-place-content-center tw-size-11" :style="icon?.bgStyle || ''">
          <q-icon :name="icon.name" :class="color" v-bind="icon.props || {}" />
        </div>
      </div>
      <div v-if="description" :class="`ellipsis-2-lines tw-leading-5 tw-text-gray-500 ${description.class || ''}`" v-html="description?.label" />

      <div>
        <q-btn v-if="button" flat dense color="secondary" v-bind="button.props || {}" class="text-weight-bold tw-rounded-2xl tw-leading-5"
               padding="none" @click="button.action != undefined ? button.action() : null" />
      </div>
    </div>

    <!--Inner Loading-->
    <q-skeleton
      v-if="loading"
      type="rect"
      height="161px"
      width="262px"
      class="tw-mt-4"
    />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'src/modules/qmapper/_components/quick-cards/card/controller'

export default defineComponent({
  props: {
    title: {type: Object, default: null},
    description: {type: Object, default: null},
    color: {default: "tw-text-[#185340]"},
    icon: {type: Object, default: null},
    button: {type: Object, default: null},
    loading: { default: false }
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#card {
  min-height: 164px;
  padding: 14px 24px;
  gap: 14px;
  background: #FFFFFF;
  /* Card */
  box-shadow: 0px 12px 46px rgba(0, 0, 0, 0.07), 0px 4.62222px 14.6519px rgba(0, 0, 0, 0.0425185), 0px 0.977778px 3.74815px rgba(0, 0, 0, 0.0274815);
}
</style>
