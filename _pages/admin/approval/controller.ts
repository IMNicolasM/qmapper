import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';
import services from './services';
import { i18n, store } from 'src/plugins/utils';

export default function controller() {

  // Refs
  const refs = {
    crudComponent: ref(crud)
  };

  // States
  const state = reactive({
    show: false,
    currentAction: '',
    requested: {},
    actions: {
      1: 'APPROVED',
      2: 'DENIED'
    },
    comment: '',
    attributes: {}
  });

  // Computed
  const computeds = {
    customCrudData: computed(() => {
      return {
        read: {
          actions: [
            {
              icon: 'fa-regular fa-circle-check',
              vIf: store.hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Approve',
              action: (item: any) => methods.showModal(state.actions[1], item)
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: store.hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Deny',
              action: (item) => methods.showModal(state.actions[2], item)
            }
          ]
        }
      };
    }),
    modalActions: computed(() => {
      const action = state.currentAction
      const color = action == 'DENIED' ? 'negative' : 'secondary'
      return [
        {
          props: {
            label: i18n.tr('isite.cms.label.cancel'),
            outline: true,
            color: 'secondary'
          },
          action: () => state.show = false
        },
        {
          props: {
            label: state.currentAction,
            color
          },
          action: () => {
            methods.sendAction(action, state.attributes)
          }
        }
      ];
    }),
    fieldComment: computed(() => {
      return {
        value: '',
        type: 'input',
        props: {
          type: 'textarea',
          rows: '3'
        }
      };
    }),
  };

  // Methods
  const methods = {
    //Send action
    async sendAction(action: any, att: any) {
      try {
        state.show = false
        const attributes = {
          ...att,
          RejectionComments: state.comment
        }
        await services.sendActionRuleApprove({ action, attributes });
        await methods.getDataTable(true);
      } catch (e) {
        console.error(e);
      }
    },
    async getDataTable(refresh = false) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
    showModal(action: string, item: any) {
      state.show = true;
      state.currentAction = action;
      state.attributes = item
    }
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
