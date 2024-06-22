<template>
  <parent-cards title="Recent Activity" :api-routes="data" />
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller';
import parentCards from '../parentCards/index.vue';

export default defineComponent({
  props: {},
  components: {
    parentCards
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
