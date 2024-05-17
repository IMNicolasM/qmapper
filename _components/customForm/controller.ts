import { computed, reactive, ref, onMounted, toRefs } from 'vue';
import service from './services';
import { i18n, clone, alert } from 'src/plugins/utils';

interface StateProps {
  showModal: boolean,
  loading: boolean,
  formData: any,
  apiRoute: string,
  data: any,
  loadedUnifiedValue: any[]
}

export default function controller(props: any, emit: any) {

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
    loadedUnifiedValue: []
  });

  // Computed
  const computeds = {
    //Map the info to dynamic form
    formFields: computed(() => {
      const data = state.data;
      const unifiedFilters = { TableColumnName: data?.TableColumnName, Division: data?.Division };

      if(!state.formData.MatchType) {
        state.formData.MatchType = 'EXACT'
      }

      return {
        MatchTypeText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            class: 'tw-text-[#666666] list-decimal',
            message: `Select the match type for "${data?.TableColumnValue}"`
          }
        },
        MatchType: {
          value: 'EXACT',
          type: 'select',
          required: true,
          colClass: 'col-12 col-md-6 self-center',
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
            message: `Select the unified "${data?.TableColumnName}" for "${data?.TableColumnValue}"`
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
            moreFilters: unifiedFilters,
            moreSettings: {
              select: { label: 'UnifiedValue', id: 'UnifiedValue' },
              loadedOptions: (data) => state.loadedUnifiedValue = data
            }
          }) : {})
        },
        UnifiedValueDescText: {
          type: 'text',
          colClass: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName} Description" for "${data?.TableColumnValue}"`
          }
        },
        UnifiedValueDesc: {
          value: null,
          type: 'select',
          colClass: 'col-12 col-md-6 self-center',
          props: {
            'fill-input': true,
            'hide-selected': true,
            label: 'Unified Value Description'
          },
          ...(state.formData?.UnifiedValue ? methods.getLoadOption({
            name: 'UnifiedValueDesc',
            moreFilters: { ...unifiedFilters, UnifiedValue: state.formData?.UnifiedValue }
          }) : {})
        },
        UnifiedValue_GroupText: {
          type: 'text',
          col: 'col-12 col-md-6',
          props: {
            message: `Select the unified "${data?.TableColumnName} Group" for "${data?.TableColumnValue}"`
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
            message: `Select the unified "${data?.TableColumnName} Category" for "${data?.TableColumnValue}"`
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
            label: 'Send Request',
            color: 'secondary'
          },
          action: () => refs?.formContent?.value.submit()
        }
      ];
    })
  };

  // Methods
  const methods = {
    //Get data by Id
    async getData({ id = null, apiRoute = '' }: { id: string | null, apiRoute: string }) {
      if (!apiRoute?.length) return;

      state.apiRoute = apiRoute;
      state.showModal = true;
      state.loading = true;

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
      } else {
        state.formData = {};
      }
      state.loading = false;
    },
    //Close Modal
    closeModal() {
      state.showModal = false;
      state.formData = {};
      state.data = null;
      state.apiRoute = '';
      state.loading = false;
    },
    //Get Load options
    getLoadOption({ name, moreFilters = {}, apiRoute = 'apiRoutes.qmapper.references', filter = {}, moreSettings = {} }) {
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
      console.warn('Submit: Yujuuu');
    },

    //Fill in data for update
    updateData(selectedBlock) {
      // Cloning and setting selected block data
      state.block = clone(selectedBlock);
      //Get Block id to Update
      state.idBlock = clone(selectedBlock.id);
      //Get data to pass to Form
      state.formBlock = clone(selectedBlock);

      //Search the selected block configuration
      state.configBlock = methods.getBlockConfig(selectedBlock.component?.systemName);

      state.showModal = true;
    },

    //Create Block
    async createBlock(data, params) {
      state.loading = true;

      service.createBlock(data, params).then(response => {
        state.loading = false;
        state.showModal = false;
        data.id = response.id;

        if (!!state.layoutId) {
          const pivotData = response.layouts[0]?.blocks?.find(block => block.id == response.id);

          if (pivotData) {
            data.pivot = pivotData.pivot;
          }

          delete data.layouts;
        }

        emit('created', data);
      }).catch(error => {
        state.loading = false;
      });
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
