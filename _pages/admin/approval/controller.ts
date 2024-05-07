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
      2: 'DENIED',
      3: 'CANCELLED'
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
              name: 'approve',
              action: (item: any) => methods.showModal(state.actions[1], item)
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: store.hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Deny',
              name: 'deny',
              action: (item) => methods.showModal(state.actions[2], item)
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: store.hasAccess('imapper.approvals.cancel'),
              tooltip: 'Cancel',
              name: 'cancel',
              action: (item) => methods.showModal(state.actions[3], item)
            }
          ],
          filters: {
            ApprovalInd: {
              value: 'REQUESTED',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Mapping indicator',
                options: [
                  { label: 'REQUESTED', value: 'REQUESTED' },
                  { label: 'DENIED', value: 'DENIED' },
                  { label: 'APPROVED', value: 'APPROVED' },
                  { label: 'CANCELLED', value: 'CANCELLED' },
                ]
              }
            }
          },
          disabled: {
            action: (item) => item.ApprovalInd ? item.ApprovalInd !== 'REQUESTED' : false
          }
        }
      };
    }),
    modalActions: computed(() => {
      const actions = {
        'APPROVED': {
          label: 'Approve',
          color: '#49C185'
        },
        'DENIED': {
          label: 'Deny',
          color: '#C42C27'
        },
        'CANCEL': {
          label: 'Cancel',
          color: '#C42C27'
        },
      };

      const currentAction = actions[state.currentAction] || { color: 'gray', label: 'None'};

      return [
        {
          props: {
            label: i18n.tr('isite.cms.label.cancel'),
            color: 'grey-4',
            textColor: "grey-9"
          },
          action: () => state.show = false
        },
        {
          props: {
            label: currentAction.label,
            style: `background-color: ${currentAction.color}`,
            textColor: "white"
          },
          action: () => {
            methods.sendAction(state.currentAction, state.attributes);
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
          rows: '3',
          label: 'Leave a note'
        }
      };
    })
  };

  // Methods
  const methods = {
    //Send action
    async sendAction(action: any, att: any) {
      try {
        state.show = false;
        const attributes = {
          ...att,
          RejectionComments: state.comment
        };
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
      state.attributes = item;
    }
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
