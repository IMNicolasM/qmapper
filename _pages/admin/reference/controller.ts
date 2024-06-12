import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';
// @ts-ignore
import customForm from 'modules/qmapper/_components/customForm/index.vue'
import { uid, store, i18n, alert, cache } from 'src/plugins/utils';
import { PROPS_BUTTONS } from '../approval/constant';
import services from '../approval/services';

export default function controller() {

  // Refs
  const refs = {
    crudComponent: ref(crud),
    referenceForm: ref(customForm)
  };

  // States
  const state = reactive({
    crudId: uid()
  });

  // Computed
  const computeds = {
    customCrudData: computed(() => {
      return {
        crudId: state.crudId,
        read: {
          actions: [
            {
              name: 'edit',
              action: (item: any) => methods.openModal(item),
              format: (item: any) => (!!item?.requested ? { vIf: false } : {})
            },
            {
              icon: 'fa-regular fa-timer',
              label: 'Request Pending',
              vIf: false,
              action: () => {
                this.$router.push({ name: 'qmapper.admin.approvals', params: {} });
              },
              format: (item: any) => (item?.countRequest > 0 ? { vIf: true } : {})
            },
            {
              icon: 'fa-regular fa-ban',
              vIf: false,
              tooltip: 'Cancel',
              name: 'cancel',
              action: (item: any) => methods.quickCancel(item.SeqNo),
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
    //Crud info
    crudInfo: computed(() => {
      return store.getCrud(state.crudId);
    }),
  };

  // Methods
  const methods = {
    //Get Load Option
    getLoadOption({ name, moreFilters = {}, apiRoute = 'apiRoutes.qmapper.references', filter = {} }) {
      if (!Object.keys(filter)?.length) {
        filter = {
          _distinct: name,
          ...moreFilters
        };
      }
      return {
        loadOptions: {
          apiRoute,
          select: { label: name, id: name },
          requestParams: {
            filter
          }
        }
      };
    },
    async quickCancel(id: string) {
      alert.warning({
        mode: "modal",
        title: `Request ID: ${id}`,
        message: 'Are you sure you want to cancel this request?',
        actions: [
          {
            label: i18n.tr('isite.cms.label.close'),
            color: 'grey-6',
          },
          {
            label: PROPS_BUTTONS.CANCELLED.label,
            color: "negative",
            handler: async () => {
              try {
                const attributes = {
                  id,
                  ApprovalInd: PROPS_BUTTONS.CANCELLED.action,
                };
                await services.sendActionRuleApprove({ attributes });
                await methods.getDataTable(true);
                await cache.remove({ allKey: 'apiRoutes.qmapper.approvals' });
              } catch (e) {
                alert.error({ message: i18n.tr('isite.cms.message.errorRequest'), pos: 'bottom' });
              }
            },
          },
        ],
      });
    },
    //Open form modal
    openModal(item: any) {
      refs.referenceForm.value?.getData({ id: item?.uniRefId, apiRoute: 'apiRoutes.qmapper.references', customApiRoute: 'apiRoutes.qmapper.sendApproval', apiRouteDelete: 'apiRoutes.qmapper.approvals', params: {
        filter: {
          field: "UNI_RefID"
        }
      }})
    },
    async getDataTable(refresh = false) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
