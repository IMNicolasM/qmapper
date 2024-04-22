<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      selectedColumnValue: null,
      selectedUnifiedValue: null,
      selectedUnifiedValue_Group: null,
      selectedUnifiedValue_Category: null,
      optionsColumnValue: [],
      optionsUnifiedValue: [],
      optionsUnifiedValue_Group: [],
      optionsUnifiedValue_Category: []
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.references'),
        apiRoute: 'apiRoutes.qmapper.references',
        permission: 'imapper.references',
        create: {
          title: 'Create New Value'
        },
        read: {
          columns: [
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left' },
            {
              name: 'TableColumnName',
              label: 'Column name',
              field: 'TableColumnName',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            { name: 'TablePK_EDW', label: 'Table PK (EDW)', field: 'TablePK_EDW', align: 'left' },
            {
              name: 'TableColumnValue',
              label: 'Column value',
              field: 'TableColumnValue',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'MatchType',
              label: 'Match type',
              field: 'MatchType',
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue',
              label: 'Unified Value',
              field: 'UnifiedValue',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValueDesc',
              label: 'Unified Value Desc',
              field: 'UnifiedValueDesc',
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue_Group',
              label: 'Unified Value Group',
              field: 'UnifiedValue_Group',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'UnifiedValue_Category',
              label: 'Unified Value Category',
              field: 'UnifiedValue_Category',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          filters: {
            Division: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Division',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'Division', id: 'Division' },
                requestParams: { filter: { _distinct: 'Division' } }
              }
            },
            MappingInd: {
              value: 'UNMAPPED',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Mapping indicator',
                options: [
                  { label: 'UNMAPPED', value: 'UNMAPPED' },
                  { label: 'MAPPED', value: 'MAPPED' }
                ]
              }
            },
            TableColumnName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Column Name',
                clearable: true,
                class: 'col-md-6'
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'TableColumnName', id: 'TableColumnName' },
                requestParams: { filter: { _distinct: 'TableColumnName' } }
              }
            }
          }
        },
        update: {
          title: 'Update Value',
          requestParams: {
            field: 'UNI_RefID'
          }
        },
        formLeft: {
          UNI_RefID: { value: '' },
          TableColumnName: {
            value: null,
            type: 'select',
            required: true,
            props: {
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Column name'
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'TableColumnName', id: 'TableColumnName' },
              requestParams: { filter: { _distinct: 'TableColumnName' } }
            }
          },
          TablePK_EDW: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Table PK (EDW)'
            }
          },
          TableColumnValue: {
            value: this.selectedColumnValue,
            type: 'select',
            required: true,
            handler: {
              label: 'Add New Column Value',
              selectNewValue: (val) => {
                this.optionsColumnValue.push({ label: val, value: val });
                this.selectedColumnValue = val
              }
            },
            props: {
              readonly: (this.crudInfo.typeForm === 'update' || !this.crudInfo.TableColumnName),
              label: 'Column value',
              options: this.optionsColumnValue,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'TableColumnValue', id: 'TableColumnValue' },
              requestParams: {
                filter: {
                  _distinct: 'TableColumnValue',
                  TableColumnName: this.crudInfo.TableColumnName
                }
              },
              filterByQuery: true,
              filterLengthQuery: 0
            }
          },
          'Data owners': {
            value: '',
            type: 'input',
            props: {
              readonly: true,
              label: 'Data owners'
            }
          }
        },
        formRight: {
          MatchType: {
            value: 'EXACT',
            type: 'select',
            require: true,
            props: {
              label: 'Match type*',
              options: [
                { label: 'EXACT', value: 'EXACT' },
                { label: 'PATTERN', value: 'PATTERN' }
              ],
              readonly: this.crudInfo.typeForm === 'update'
            }
          },
          UnifiedValue: {
            value: this.selectedUnifiedValue,
            type: 'select',
            required: true,
            handler: {
              label: 'Add New Unified Value',
              selectNewValue: (val) => {
                this.optionsUnifiedValue.push({ label: val, value: val });
                this.selectedUnifiedValue = val
              }
            },
            props: {
              readonly: !this.crudInfo.TableColumnValue,
              label: 'Unified Value',
              options: this.optionsUnifiedValue
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'UnifiedValue', id: 'UnifiedValue' },
              requestParams: {
                filter: {
                  _distinct: 'UnifiedValue',
                  TableColumnName: this.crudInfo.TableColumnName,
                  TableColumnValue: this.crudInfo.TableColumnValue
                }
              },
              filterByQuery: true,
              filterLengthQuery: 0
            }
          },
          UnifiedValue_Group: {
            value: this.selectedUnifiedValue_Group,
            type: 'select',
            required: true,
            handler: {
              label: 'Add New Unified Value Group',
              selectNewValue: (val) => {
                this.optionsUnifiedValue_Group.push({ label: val, value: val });
                this.selectedUnifiedValue_Group = val
              }
            },
            props: {
              readonly: !this.crudInfo.UnifiedValue,
              label: 'Unified Value Group',
              options: this.optionsUnifiedValue_Group
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'UnifiedValue_Group', id: 'UnifiedValue_Group' },
              requestParams: {
                filter: {
                  _distinct: 'UnifiedValue_Group',
                  TableColumnName: this.crudInfo.TableColumnName,
                  TableColumnValue: this.crudInfo.TableColumnValue,
                  UnifiedValue: this.crudInfo.UnifiedValue
                }
              },
              filterByQuery: true,
              filterLengthQuery: 0
            }
          },
          UnifiedValue_Category: {
            value: this.selectedUnifiedValue_Category,
            type: 'select',
            required: true,
            handler: {
              label: 'Add New Unified Value Category',
              selectNewValue: (val) => {
                this.optionsUnifiedValue_Category.push({ label: val, value: val });
                this.selectedUnifiedValue_Category = val
              }
            },
            props: {
              readonly: !this.crudInfo.UnifiedValue,
              label: 'Unified Value Category',
              options: this.optionsUnifiedValue_Category
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'UnifiedValue_Category', id: 'UnifiedValue_Category' },
              requestParams: {
                filter: {
                  _distinct: 'UnifiedValue_Category',
                  TableColumnName: this.crudInfo.TableColumnName,
                  TableColumnValue: this.crudInfo.TableColumnValue,
                  UnifiedValue: this.crudInfo.UnifiedValue
                }
              },
              filterByQuery: true,
              filterLengthQuery: 0
            }
          }
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              console.warn(formData, changedFields)
              if(changedFields.includes('TableColumnName')) {
                formData = {
                  ...formData,
                  TableColumnValue: null,
                  UnifiedValue: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              }
              else if(changedFields.includes('TableColumnValue')) {
                formData = {
                  ...formData,
                  UnifiedValue: null,
                  UnifiedValue_Group: null,
                  UnifiedValue_Category: null
                };
              }

            }
            resolve(formData);
          });
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  }
};
</script>
