import { computed, reactive, ref, onMounted, toRefs, watch } from 'vue';
import { clone, i18n } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  };

  // States
  const state = reactive({
    principalRoute: 'apiRoutes.qmapper.approvals',
    defaultFormatCard: {
      loading: false,
      icon: {
        props: {
          size: '16px'
        }
      }
    }
    // Key: Default Value
  });

  // Computed
  const computeds = {
    data: computed(() => {
      return [
        {
          id: 1,
          route: state.principalRoute,
          params: { filter: { approvalInd: 'APPROVED' }, take: 1 },
          format: (item: any) => methods.formatData(item, { icon: 'fa-solid fa-check', desc: 'Approvals Overall' })
        },
        {
          id: 2,
          route: state.principalRoute,
          params: { filter: { approvalInd: 'DENIED' }, take: 1 },
          format: (item: any) => methods.formatData(item, { icon: 'fa-solid fa-x', desc: 'Rejections Overall' }, false)
        },
        {
          id: 3,
          route: state.principalRoute,
          params: {
            filter: {
              approvalInd: 'APPROVED',
              date: { from: methods.getUTCDate(7), to: methods.getUTCDate() }
            }, take: 1
          },
          format: (item: any) => methods.formatData(item, {
            icon: 'fa-solid fa-thumbs-up',
            desc: 'Approvals past 7 days'
          })
        },
        {
          id: 4,
          route: state.principalRoute,
          params: {
            filter: { approvalInd: 'DENIED', date: { from: methods.getUTCDate(2), to: methods.getUTCDate() } },
            take: 1
          },
          format: (item: any) => methods.formatData(item, {
            icon: 'fa-solid fa-thumbs-down',
            desc: 'Rejections past 7 days'
          }, false)
        }
      ];
    })
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    formatData(item: any, props: any = {}, isDefaultColor = true) {
      let response: any = clone(state.defaultFormatCard);
      response.title = {
        label: i18n.trn(item.response?.meta?.page?.total || '0', null)
      };

      response.icon.name = props.icon || '';

      if (props.action) {
        response.button = {
          props: {
            label: 'More Information',
            color: 'secondary'
          },
          action: () => props.action()
        };
      }

      if (props.desc) {
        response.description = {
          label: `Total number of <br/> <b class=\'tw-text-base tw-leading-5\'>${props.desc}</b>`
        };
      }


      if (!isDefaultColor) {
        response = {
          ...response,
          color: 'tw-text-[#881915]',
          icon: {
            ...response.icon,
            bg: 'tw-bg-[#FCE0DF]'
          }
        };
      }
      return response;
    },
    getUTCDate(minusDays = 0) {
      const currentDate = new Date();

      if (minusDays > 0) {
        currentDate.setUTCDate(currentDate.getUTCDate() - minusDays);
      }

      return currentDate.toISOString();
    }
  };

  // Mounted
  onMounted(() => {
  });

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
