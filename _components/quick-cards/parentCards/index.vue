<template>
  <div id="parent">
    <h3 v-if="title" class="tw-text-xl text-primary tw-font-semibold">{{ title }}</h3>
    <br />
    <div class="flex tw-gap-4">
      <template v-for="card of cardsData">
        <simple-card v-bind="card" />
      </template>
    </div>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import simpleCard from 'src/modules/qmapper/_components/quick-cards/card/index.vue';
import controller from 'src/modules/qmapper/_components/quick-cards/parentCards/controller';

export default defineComponent({
  props: {
    title: { default: '' },
    cardType: { default: 'cards' },
    apiRoutes: { type: Array, default: () => [] }
  },
  components: {
    simpleCard
  },
  setup(props, { emit }) {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
</style>
