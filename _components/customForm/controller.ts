import { computed, reactive, ref, toRefs } from 'vue';
import service from './services';
import { i18n, alert, cache, clone } from 'src/plugins/utils';
import { PROPS_BUTTONS } from '../../_pages/admin/approval/constant';

interface StateProps {
  showModal: boolean,
  loading: boolean,
  formData: any,
  id: string | null,
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
    id: null,
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
      const unifiedFilters = { tableColumnName: data?.tableColumnName, division: data?.division };

      if (!state.formData.matchType) {
        state.formData.matchType = 'EXACT';
      }

      if (!state.unified.value !== state.formData.unifiedValue) {
        const unified = state.formData.unifiedValue;
        state.unified.value = state.formData.unifiedValue;
        const desc = state.loadedUnifiedValue.find(uni => uni.unifiedValue == unified)?.unifiedValueDesc || '';
        const dataValue = state.formData.unifiedValueDesc || '';
        state.unified.desc = desc;
        state.formData.unifiedValueDesc = desc || dataValue;
      }

      return {
        matchTypeText: {
          type: 'text',
          col: 'col-12 col-md-6',
          vIf: false,
          props: {
            message: `Select the match type for "${computeds.sourceValue.value}"`
          }
        },
        matchType: {
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
        unifiedValueText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: methods.getDefaultText(data?.tableColumnName)
          }
        },
        unifiedValue: {
          value: null,
          type: 'select',
          required: true,
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value*'
          },
          ...(data?.tableColumnName ? methods.getLoadOption({
            name: 'unifiedValue',
            filter: { _groupBy: 'UnifiedValue,UnifiedValueDesc', unifiedValue: { operator: "!=", value: "null" }, ...unifiedFilters },
            moreSettings: {
              select: { label: 'unifiedValue', id: 'unifiedValue' },
              loadedOptions: (data: any) => state.loadedUnifiedValue = data
            }
          }) : {})
        },
        unifiedValueDescText: {
          type: 'text',
          colClass: 'col-12 col-md-6',
          props: {
            message: methods.getDefaultText(`${data?.tableColumnName} Description`)
          }
        },
        unifiedValueDesc: {
          value: '',
          type: 'input',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            readonly: !!state.unified.desc,
            label: 'Unified Value Description'
          }
        },
        unifiedValueGroupText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: methods.getDefaultText(`${data?.tableColumnName} Group`)
          }
        },
        unifiedValueGroup: {
          value: null,
          type: 'select',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value Group'
          },
          ...(data?.tableColumnName ? methods.getLoadOption({
            name: 'unifiedValueGroup',
            moreFilters: { unifiedValueGroup: { operator: "!=", value: "null" }, ...unifiedFilters}
          }) : {})
        },
        unifiedValueCategoryText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: methods.getDefaultText(`${data?.tableColumnName} Category`)
          }
        },
        unifiedValueCategory: {
          value: null,
          type: 'select',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value Category'
          },
          ...(data?.tableColumnName ? methods.getLoadOption({
            name: 'unifiedValueCategory',
            moreFilters: { unifiedValueCategory: { operator: "!=", value: "null" }, ...unifiedFilters }
          }) : {})
        },
        rejectionComments: {
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

      return data?.tableColumnValue || data?.ruleValue || 'NULL';
    }),
    //Get Source Value Desc
    sourceValueDesc: computed(() => {
      const data = state.data;

      return data?.tableColumnValueDesc || data?.ruleValueDesc || 'NULL';
    })
  };

  // Methods
  const methods = {
    //Get data by Id
    async getData({ id = null, apiRoute = '', apiRouteDelete = null, isApprove = false, customApiRoute = '', params = {} }: {
      id: string | null,
      apiRoute: string,
      apiRouteDelete: string | null,
      isApprove: boolean,
      customApiRoute: string
      params: object
    }) {
      if (!apiRoute?.length) return;

      state.apiRoute = apiRoute;
      state.apiRouteDelete = apiRouteDelete;
      state.showModal = true;
      state.loading = true;
      state.isApprove = isApprove;
      state.customApiRoute = customApiRoute;

      if (!!id) {
        await service.getDataCustom(apiRoute, id, { refresh: true, params: { include: 'tableName', ...params } })
          .then(res => {
            state.id = id
            state.data = clone(res);
            state.formData = clone(res);
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

      if (!state.isApprove && !data?.tableColumnValue) {
        alert.error('No Source Value found');
        return;
      }
      if (state?.id) {
        let mappedData = {
          ...formData,
          tableColumnValueDesc: data.tableColumnValueDesc || null
        };

        if (state.isApprove) {
          mappedData = {
            ruleValue: data.tableColumnValue,
            ruleValueDesc: data.tableColumnValueDesc || null,
            ...mappedData,
            approvalInd: state.action
          };
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
    },
    getDefaultText(str: string) {
      return `Select the unified "<span class="text-weight-bold">${str}</span>"`
    }
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
