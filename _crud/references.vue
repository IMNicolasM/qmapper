<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      const columnName = this.crudInfo.TableColumnName
      const unifiedValue = this.crudInfo.UnifiedValue

      const loadOptions = {
        columnValue: columnName ? {
          loadOptions: {
            apiRoute: 'apiRoutes.qmapper.references',
            select: { label: 'TableColumnValue', id: 'TableColumnValue' },
            requestParams: {
              filter: {
                _distinct: 'TableColumnValue',
                TableColumnName: this.crudInfo.TableColumnName
              }
            }
          }
        } : {},
        unifiedValue: columnName ? {
          loadOptions: {
            apiRoute: 'apiRoutes.qmapper.references',
            select: { label: 'UnifiedValue', id: 'UnifiedValue' },
            requestParams: {
              filter: {
                _distinct: 'UnifiedValue',
                TableColumnName: columnName
              }
            }
          }
        } : {},
        UnifiedValueDesc: unifiedValue ? {
          loadOptions: {
            apiRoute: 'apiRoutes.qmapper.references',
            select: { label: 'UnifiedValueDesc', id: 'UnifiedValueDesc' },
            requestParams: {
              filter: {
                _distinct: 'UnifiedValueDesc',
                TableColumnName: columnName,
                UnifiedValue: unifiedValue
              }
            }
          }
        } : {},
        unifiedValueGroup: unifiedValue ? {
          loadOptions: {
            apiRoute: 'apiRoutes.qmapper.references',
            select: { label: 'UnifiedValue_Group', id: 'UnifiedValue_Group' },
            requestParams: {
              filter: {
                _distinct: 'UnifiedValue_Group',
                TableColumnName: columnName,
                UnifiedValue: unifiedValue
              }
            }
          }
        } : {},
        UnifiedValueCategory: unifiedValue ? {
          loadOptions: {
            apiRoute: 'apiRoutes.qmapper.references',
            select: { label: 'UnifiedValue_Category', id: 'UnifiedValue_Category' },
            requestParams: {
              filter: {
                _distinct: 'UnifiedValue_Category',
                TableColumnName: columnName,
                UnifiedValue: unifiedValue
              }
            }
          }
        } : {},
      };

      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.references'),
        apiRoute: 'apiRoutes.qmapper.references',
        permission: 'imapper.references',
        create: {
          title: 'Create New Value',
          requestParams: {
            notToSnakeCase: ['UNI_RefID', 'TableColumnName', 'TableColumnValue', 'MatchType','TablePK_EDW', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
          },
          useSystemMessage: true
        },
        modalActions: {
          save: {
            props: {
              label: 'Send Request',
              color: 'secondary'
            }
          },
          cancel: {
            props: {
              outline: true,
              color: 'secondary'
            }
          }
        },
        read: {
          columns: [
            {
              name: 'TableColumnName',
              label: 'Source Column',
              field: 'TableColumnName',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'TableColumnValue',
              label: 'Source Value',
              field: 'TableColumnValue',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'TableColumnValueDesc',
              label: 'Source Value Description',
              field: 'TableColumnValueDesc',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'MatchType',
              label: 'Match type',
              field: 'MatchType',
              sortable: true,
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
              sortable: true,
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
            UnifiedValue: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue')
            },
            UnifiedValueDesc: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Description',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValueDesc')
            },
            UnifiedValue_Group: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Group',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue_Group')
            },
            UnifiedValue_Category: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Category',
                clearable: true
              },
              ...this.getLoadOption('UnifiedValue_Category')
            },
            TableName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Subject Area',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'TableName', id: 'TableName' },
                requestParams: { filter: { _distinct: 'TableName' } }
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
            Division: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Division'
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'Division', id: 'Division' },
                requestParams: { filter: { _distinct: 'Division' } }
              }
            },
            SourceSystem: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Source Application'
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'SourceSystem', id: 'SourceSystem' },
                requestParams: { filter: { _distinct: 'SourceSystem' } }
              }
            },
          },
          requestParams: {
            include: 'requestApproval',
            notToSnakeCase: ['TableColumnName', 'TableColumnValue', 'TableColumnValueDesc', 'MatchType', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
          },
          disabled: {
            row: (item) => item?.countRequest > 0
          },
          excludeActions: ['export', 'sync', 'recommendations']
        },
        update: {
          title: 'Update Value',
          requestParams: {
            notToSnakeCase: ['UNI_RefID', 'UNI_RuleID', 'TableColumnName', 'TableColumnValue', 'MatchType','TablePK_EDW', 'UnifiedValue', 'UnifiedValueDesc', 'UnifiedValue_Group', 'UnifiedValue_Category']
          },
          customFormResponse: (criteria, formData, customParams) => {
            return new Promise((resolve, reject) => {
              this.$crud.post('apiRoutes.qmapper.references', { attributes: formData })
                .then(response => resolve(response.data))
                .catch(error => {
                  console.warn(error)
                  reject(error.response?.data?.message)
                })
            })
          },
          useSystemMessage: true
        },
        formLeft: {
          UNI_RefID: { value: '' },
          UNI_RuleID: { value: '' },
          TableColumnName:  {
            value: null,
            type: 'select',
            required: true,
            props: {
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Source Column',
              clearable: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qmapper.references',
              select: { label: 'TableColumnName', id: 'TableColumnName' },
              requestParams: { filter: { _distinct: 'TableColumnName' } }
            }
          },
          TableColumnValue: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Source Value',
              options: [],
            },
            ...loadOptions.columnValue
          },
          TableColumnValueDesc: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: this.crudInfo.typeForm === 'update',
              label: 'Source Value Description',
            }
          },
          MatchType: {
            value: 'EXACT',
            type: 'select',
            require: true,
            props: {
              label: 'Match type*',
              options: [
                { label: 'Exact Match', value: 'EXACT' },
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
            ...loadOptions.unifiedValue
          },
          UnifiedValueDesc: {
            value: null,
            type: 'select',
            required: true,
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Description'
            },
            ...loadOptions.UnifiedValueDesc
          },
          UnifiedValue_Group: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Group'
            },
            ...loadOptions.unifiedValueGroup
          },
          UnifiedValue_Category: {
            value: null,
            type: 'select',
            props: {
              'fill-input': true,
              'hide-selected': true,
              label: 'Unified Value Category'
            },
            ...loadOptions.UnifiedValueCategory
          }
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              if(changedFields.includes('TableColumnName')) {
                formData = {
                  ...formData,
                  TableColumnValue: null,
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
  },
  methods: {
    getLoadOption(name) {
      return {
        loadOptions: {
          apiRoute: 'apiRoutes.qmapper.references',
          select: { label: name, id: name },
          requestParams: {
            filter: {
              _distinct: name,
            }
          }
        }
      }
    }
  }
};
</script>
