import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';
import services from './services';
import { i18n, store } from 'src/plugins/utils';
import { PROPS_BUTTONS } from './constant';
// @ts-ignore
import customForm from 'modules/qmapper/_components/customForm/index.vue';
import { alert, cache } from '../../../../../plugins/utils';

export default function controller() {

  // Refs
  const refs = {
    crudComponent: ref(crud),
    referenceForm: ref(customForm)
  };

  // States
  const state = reactive({
    show: false,
    currentAction: '',
    loading: false,
    requested: {},
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
              name: 'edit',
              action: (item: any) => methods.openModal(item),
              format: (item: any) => (!!item?.requested ? { vIf: false } : {})
            },
            {
              icon: 'fa-regular fa-circle-check',
              vIf: store.hasAccess('imapper.approvals.acceptance'),
              tooltip: 'Approve',
              name: 'approve',
              action: (item: any) => methods.showModal(PROPS_BUTTONS.APPROVED.action, item),
              format: (item: any) => ({ vIf: store.hasAccess('imapper.approvals.acceptance') && item.ApprovalInd === PROPS_BUTTONS.REQUESTED.action })
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: false,
              tooltip: 'Deny',
              name: 'deny',
              action: (item: any) => methods.showModal(PROPS_BUTTONS.DENIED.action, item),
              format: (item: any) => ({ vIf: store.hasAccess('imapper.approvals.acceptance') && item.ApprovalInd === PROPS_BUTTONS.REQUESTED.action })
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: false,
              tooltip: 'Cancel',
              name: 'cancel',
              action: (item: any) => methods.showModal(PROPS_BUTTONS.CANCELLED.action, item),
              format: (item: any) => ({
                // @ts-ignore
                vIf: item.ApprovalInd === PROPS_BUTTONS.REQUESTED.action && store?.state?.quserAuth?.userId == item.RuleCreatedBy
              })
            }
          ]
        },
        update: {}
      };
    }),
    modalActions: computed(() => {
      const infoAction = PROPS_BUTTONS[state.currentAction] || PROPS_BUTTONS.DEFAULT;

      return [
        {
          props: {
            label: i18n.tr('isite.cms.label.cancel'),
            color: 'grey-4',
            textColor: 'grey-9'
          },
          action: () => state.show = false
        },
        {
          props: {
            label: infoAction.label,
            style: `background-color: ${infoAction.btnColor}`,
            textColor: 'white'
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
    async sendAction(action: string, att: any) {
      try {
        state.loading = true;
        state.show = false;
        const attributes = {
          ...att,
          ApprovalInd: action,
          RejectionComments: state.comment
        };
        await services.sendActionRuleApprove({ attributes });
        await cache.remove({ allKey: 'apiRoutes.qmapper.references' });
        state.loading = false;
        await methods.getDataTable(true);
      } catch (e) {
        state.loading = false;
        alert.error({ message: i18n.tr('isite.cms.message.errorRequest'), pos: 'bottom' });
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
    },
    clear() {
      state.comment = '';
      state.currentAction = '';
      state.attributes = {};
    },
    //Open form modal
    openModal(item: any) {

      refs.referenceForm.value?.getData({
        // @ts-ignore
        customApiRoute: `${config('apiRoutes.qmapper.approvals')}/action`,
        isApprove: true,
        id: item?.seqNo,
        apiRoute: 'apiRoutes.qmapper.approvals',
        apiRouteDelete: 'apiRoutes.qmapper.references',
        params: {
          filter: {
            field: "SeqNo"
          }
        }
      });
    }
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
