import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';
// @ts-ignore
import customForm from 'modules/qmapper/_components/customForm/index.vue'
import { uid, store } from 'src/plugins/utils';

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
      const crudInfo = computeds.crudInfo.value;
      const isUpdate = crudInfo.typeForm !== 'create';
      const tableName = crudInfo.TableName;
      const columnName = crudInfo.TableColumnName;
      const columnValue = crudInfo.TableColumnValue;
      const unifiedValue = crudInfo.UnifiedValue;
      const unifiedFilters = { TableColumnName: columnName, Division: crudInfo?.Division }

      return {
        crudId: state.crudId,
        formLeft: {
          UNI_RefID: { value: '' },
          UNI_RuleID: { value: '' },
          Division: { value: 'ALL' },
          SourceSystem: { value: 'ALL' },
          TableName: {
            value: methods.getCrudFilters()?.TableName,
            type: 'select',
            required: true,
            props: {
              label: 'Subject Area',
              vIf: !isUpdate
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.metadata',
              select: { label: 'SubjectArea', id: 'TableName' }
            }
          },
          TableColumnName: {
            value: isUpdate ? '' : null,
            type: isUpdate ? 'input' : 'select',
            required: true,
            props: {
              readonly: isUpdate,
              label: 'Source Column',
              clearable: !isUpdate
            },
            ...(isUpdate || !tableName ? {} : methods.getLoadOption({
              name: 'TableColumnName',
              moreFilters: { TableName: tableName }
            }))
          },
          TableColumnValue: {
            value: isUpdate ? '' : null,
            type: isUpdate ? 'input' : 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: isUpdate,
              label: 'Source Value',
              clearable: !isUpdate
            },
            ...(isUpdate || !columnName ? {} : methods.getLoadOption({
              name: 'TableColumnValue',
              moreFilters: { TableColumnName: columnName, MappingInd: 'UNMAPPED' }
            }))
          },
          TableColumnValueDesc: {
            value: isUpdate ? '' : null,
            type: isUpdate ? 'input' : 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: isUpdate,
              label: 'Source Value Description',
              clearable: !isUpdate
            },
            ...(isUpdate || !columnValue ? {} : methods.getLoadOption({
              name: 'TableColumnValueDesc',
              moreFilters: { TableColumnValue: columnValue }
            }))
          },
          MatchType: {
            value: 'EXACT',
            type: 'select',
            require: true,
            props: {
              label: 'Match type*',
              options: [
                { label: 'Exact Match', value: 'EXACT' }
                // { label: 'PATTERN', value: 'PATTERN' }
              ]
            }
          }
        },
        formRight: {
          UnifiedValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value'
            },
            ...(!columnName ? {} : methods.getLoadOption({
              name: 'UnifiedValue',
              moreFilters: unifiedFilters
            }))
          },
          UnifiedValueDesc: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Description'
            },
            ...(!unifiedValue ? {} : methods.getLoadOption({
              name: 'UnifiedValueDesc',
              moreFilters: { ...unifiedFilters, UnifiedValue: unifiedValue }
            }))
          },
          UnifiedValue_Group: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Group'
            },
            ...(!columnName ? {} : methods.getLoadOption({
              name: 'UnifiedValue_Group',
              moreFilters: unifiedFilters
            }))
          },
          UnifiedValue_Category: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Category'
            },
            ...(!columnName ? {} : methods.getLoadOption({
              name: 'UnifiedValue_Category',
              moreFilters: unifiedFilters
            }))
          }
        },
        update: {
          method: (item: any) => methods.openModal(item),
        }
      };
    }),
    //Crud info
    crudInfo: computed(() => {
      return store.getCrud(state.crudId);
    })
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
    //Get Crud Filters
    getCrudFilters() {
      const filters = refs?.crudComponent?.value?.getFilterValues;
      if (filters) {
        return filters() || {};
      }
    },
    //Open form modal
    openModal(item: any) {
      refs.referenceForm.value?.getData({ id: item?.id, apiRoute: 'apiRoutes.qmapper.references' })
    },
    async getDataTable(refresh = false) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
