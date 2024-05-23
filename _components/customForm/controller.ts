import { computed, reactive, ref, toRefs } from 'vue';
import service from './services';
import { i18n, alert, cache } from 'src/plugins/utils';
import { PROPS_BUTTONS } from '../../_pages/admin/approval/constant';

interface StateProps {
  showModal: boolean,
  loading: boolean,
  formData: any,
  apiRoute: string,
  data: any,
  loadedUnifiedValue: any[],
  unified: any,
  apiRouteDelete: string | null
  isApprove: boolean,
  customApiRoute: string,
  action: string | null
}

export default function controller(_props: any, emit: any) {

  // Refs
  const refs = {
    formContent: ref()
  };

  // States
  const state = reactive<StateProps>({
    showModal: false,
    loading: false,
    formData: {},
    apiRoute: '',
    data: null,
    loadedUnifiedValue: [],
    unified: {
      value: null,
      desc: null
    },
    apiRouteDelete: null,
    isApprove: false,
    customApiRoute: '',
    action: null
  });

  // Computed
  const computeds = {
    //Map the info to dynamic form
    formFields: computed(() => {
      const data = state.data;
      const unifiedFilters = { TableColumnName: data?.TableColumnName, Division: data?.Division };

      if (!state.formData.MatchType) {
        state.formData.MatchType = 'EXACT';
      }

      if (!state.unified.value !== state.formData.UnifiedValue) {
        const unified = state.formData.UnifiedValue;
        state.unified.value = state.formData.UnifiedValue;
        const desc = state.loadedUnifiedValue.find(uni => uni.UnifiedValue == unified)?.UnifiedValueDesc || '';
        state.unified.desc = desc;
        state.formData.UnifiedValueDesc = desc;
      }

      return {
        MatchTypeText: {
          type: 'text',
          col: 'col-12 col-md-6',
          vIf: false,
          props: {
            message: `Select the match type for "${computeds.sourceValue.value}"`
          }
        },
        MatchType: {
          value: 'EXACT',
          type: 'select',
          required: true,
          colClass: 'col-12 col-md-6',
          vIf: false,
          props: {
            label: 'Match type*',
            options: [
              { label: 'Exact Match', value: 'EXACT' }
              // { label: 'PATTERN', value: 'PATTERN' }
            ]
          }
        },
        UnifiedValueText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName}" for "<span class="tw-text-[#0092DB]">${computeds.sourceValue.value}</span>"`
          }
        },
        UnifiedValue: {
          value: null,
          type: 'select',
          required: true,
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value*'
          },
          ...(data?.TableColumnName ? methods.getLoadOption({
            name: 'UnifiedValue',
            filter: { _groupBy: 'UnifiedValue,UnifiedValueDesc', ...unifiedFilters },
            moreSettings: {
              select: { label: 'UnifiedValue', id: 'UnifiedValue' },
              loadedOptions: (data: any) => state.loadedUnifiedValue = data
            }
          }) : {})
        },
        UnifiedValueDescText: {
          type: 'text',
          colClass: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName} Description" for "<span class="tw-text-[#0092DB]">${computeds.sourceValue.value}</span>"`
          }
        },
        UnifiedValueDesc: {
          value: '',
          type: 'input',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            readonly: !!state.unified.desc,
            label: 'Unified Value Description'
          }
        },
        UnifiedValue_GroupText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName} Group" for "<span class="tw-text-[#0092DB]">${computeds.sourceValue.value}</span>"`
          }
        },
        UnifiedValue_Group: {
          value: null,
          type: 'select',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value Group'
          },
          ...(data?.TableColumnName ? methods.getLoadOption({
            name: 'UnifiedValue_Group',
            moreFilters: unifiedFilters
          }) : {})
        },
        UnifiedValue_CategoryText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName} Category" for "<span class="tw-text-[#0092DB]">${computeds.sourceValue.value}</span>"`
          }
        },
        UnifiedValue_Category: {
          value: null,
          type: 'select',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value Category'
          },
          ...(data?.TableColumnName ? methods.getLoadOption({
            name: 'UnifiedValue_Category',
            moreFilters: unifiedFilters
          }) : {})
        },
        RejectionComments: {
          vIf: state.isApprove,
          value: '',
          type: 'input',
          props: {
            type: 'textarea',
            rows: '3',
            label: 'Leave a note'
          }
        }
      };
    }),
    //get modal Actions
    modalActions: computed(() => {
      return [
        {
          props: {
            label: 'Cancel',
            color: 'secondary',
            outline: true
          },
          action: () => methods.closeModal()
        },
        {
          props: {
            vIf: state.isApprove,
            label: PROPS_BUTTONS.DENIED.label,
            style: `background-color: ${PROPS_BUTTONS.DENIED.btnColor}`,
            textColor: 'white'
          },
          action: () => {
            state.action = PROPS_BUTTONS.DENIED.action;
            refs?.formContent?.value.submit();
          }
        },
        {
          props: {
            label: state.isApprove ? PROPS_BUTTONS.APPROVED.label : 'Send Request',
            color: state.isApprove ? '' : 'secondary',
            style: `background-color: ${PROPS_BUTTONS.APPROVED.btnColor}`,
            textColor: 'white'
          },
          action: () => {
            state.action = PROPS_BUTTONS.APPROVED.action;
            refs?.formContent?.value.submit();
          }
        }
      ];
    }),
    //Get Source Value
    sourceValue: computed(() => {
      const data = state.data;

      return data?.TableColumnValue || data?.RuleValue || 'NULL';
    }),
    //Get Source Value Desc
    sourceValueDesc: computed(() => {
      const data = state.data;

      return data?.TableColumnValueDesc || data?.RuleValueDesc || 'NULL';
    })
  };

  // Methods
  const methods = {
    //Get data by Id
    async getData({ id = null, apiRoute = '', apiRouteDelete = null, isApprove = false, customApiRoute = '' }: {
      id: string | null,
      apiRoute: string,
      apiRouteDelete: string | null,
      isApprove: boolean,
      customApiRoute: string
    }) {
      if (!apiRoute?.length) return;

      state.apiRoute = apiRoute;
      state.apiRouteDelete = apiRouteDelete;
      state.showModal = true;
      state.loading = true;
      state.isApprove = isApprove;
      state.customApiRoute = customApiRoute;

      if (!!id) {
        await service.getDataCustom(apiRoute, id, { refresh: true, params: { include: 'tableName' } })
          .then(res => {
            state.data = res;
            state.formData = res;
          })
          .catch(e => {
            console.warn('Error Custom ', e);
            alert.error({ message: i18n.tr('isite.cms.message.errorRequest'), pos: 'bottom' });
          });
      }
      state.loading = false;
      if (!state.data) methods.closeModal();
    },
    //Close Modal
    async closeModal() {
      if (state.apiRouteDelete) await cache.remove({ allKey: state.apiRouteDelete });
      state.showModal = false;
      state.isApprove = false;
      state.formData = {};
      state.data = null;
      state.apiRoute = '';
      state.customApiRoute = '';
      state.loading = false;
      state.loadedUnifiedValue = [];
      state.unified = {
        value: null,
        desc: null
      };
      state.action = null;
    },
    //Get Load options
    getLoadOption({
                    name,
                    moreFilters = {},
                    apiRoute = 'apiRoutes.qmapper.references',
                    filter = {},
                    moreSettings = {}
                  }) {
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
          },
          ...moreSettings
        }
      };
    },
    //Hidden Fields
    hidenFields(field: any) {
      return (field.type != 'hidden') &&
        (field?.vIf != undefined ? field?.vIf : true);
    },
    //Save data
    async submitData() {
      const data = state.data;
      const formData = state.formData;

      if (!state.isApprove && !data?.TableColumnValue) {
        alert.error('No Source Value found');
        return;
      }

      if (data?.id) {
        let mappedData = {
          ...formData,
          TableColumnValueDesc: formData.TableColumnValueDesc || null
        };

        if (state.isApprove) {
          mappedData = {
            ...mappedData,
            RuleValue: formData.TableColumnValue,
            RuleValueDesc: formData.TableColumnValueDesc || null,
            ApprovalInd: state.action
          };
          delete mappedData.TableColumnValue;
          delete mappedData.TableColumnValueDesc;
        }

        await methods.updateData({ ...data, ...mappedData });
      }

    },
    //Create Block
    async updateData(data: any) {
      state.loading = true;

      const apiRoute = state.customApiRoute || state.apiRoute;

      await service.postData(apiRoute, { attributes: data }).then((response: any) => {
        const msg = response?.message || i18n.tr('isite.cms.message.recordCreated');
        alert.info(msg);
        emit('created');
        methods.closeModal();
      }).catch(error => {
        const msg = error?.response?.data?.errors?.message || i18n.tr('isite.cms.message.recordNoCreated');
        alert.error(msg);
      });

      state.loading = false;
    }
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
