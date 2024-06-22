import {computed, reactive, ref, onMounted, toRefs, watch, nextTick} from "vue";
import services from './services';

export default function controller(props: any, emit: any) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    cardsData: []
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    async init() {
        await methods.getData();
    },
    async getData() {
      const requests = [];
      const results = [];
      const routes = props.apiRoutes;

      for (const route of routes) {
        requests.push(
          services.getData(true, route.params || {}, route.route || '', route.id)
        )
      }

      // @ts-ignore
      await Promise.allSettled(requests).then(result => {
        result.forEach(res => {
          const { value } = res;
          const route = routes.find(r => r.id == value.id);
          if(route) {
            results.push({
              loading: true,
              ...(route.format ? route.format(value) || {} : {})
            })
          }
        })
      });

      state.cardsData = results;
    }
  }

  // Mounted
  onMounted(() => {
    nextTick(async () => {
      await methods.init()
    })
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
