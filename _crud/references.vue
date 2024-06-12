<template></template>
<script>
import { PROPS_BUTTONS } from '../_pages/admin/approval/constant';

export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qmapper.entityNames.references'),
        apiRoute: 'apiRoutes.qmapper.references',
        permission: 'imapper.references',
        create: false,
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
              name: 'division',
              label: 'Division',
              field: 'division',
              align: 'rigth',
              sortable: true,
              action: 'edit'
            },
            {
              name: 'approvalInd',
              label: 'Status',
              field: row => row,
              align: 'center',
              sortable: true,
              format: item => this.getTag(item)
            },
            {
              name: 'tableColumnName',
              label: 'Source Column',
              field: 'tableColumnName',
              align: 'rigth',
              sortable: true
            },
            {
              name: 'tableColumnValue',
              label: 'Source Value',
              field: 'tableColumnValue',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'tableColumnValueDesc',
              label: 'Source Value Description',
              field: 'tableColumnValueDesc',
              sortable: true,
              align: 'rigth',
              format: val => val ?? '-'
            },
            {
              name: 'matchType',
              label: 'Match type',
              field: 'matchType',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'unifiedValue',
              label: 'Unified Value',
              field: 'unifiedValue',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'unifiedValueDesc',
              label: 'Unified Value Desc',
              field: 'unifiedValueDesc',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'unifiedValueGroup',
              label: 'Unified Value Group',
              field: 'unifiedValueGroup',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            {
              name: 'unifiedValueCategory',
              label: 'Unified Value Category',
              field: 'unifiedValueCategory',
              sortable: true,
              align: 'center',
              format: val => val ?? '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          filters: {
            unifiedValue: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value',
                clearable: true
              },
              ...this.getLoadOption('unifiedValue')
            },
            unifiedValueDesc: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Description',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueDesc')
            },
            unifiedValueGroup: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Group',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueGroup')
            },
            unifiedValueCategory: {
              value: null,
              type: 'select',
              props: {
                label: 'Unified Value Category',
                clearable: true
              },
              ...this.getLoadOption('unifiedValueCategory')
            },
            countRequest: {
              value: 0,
              type: 'checkbox',
              props: {
                label: 'Pending Approvals'
              }
            },
            tableName: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Subject Area',
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.metadata',
                select: { label: 'subjectArea', id: 'tableName' }
              }
            },
            mappingInd: {
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
            division: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Division',
                options: [
                  { label: 'ALL', value: 'ALL' }
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.references',
                select: { label: 'division', id: 'division' },
                requestParams: { filter: { _distinct: 'division' } }
              }
            },
            sourceSystem: {
              value: 'ALL',
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Source Application',
                options: [
                  { label: 'ALL', value: 'ALL' }
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qmapper.metadata',
                select: { label: 'sourceSystem', id: 'sourceSystem' },
                requestParams: { filter: { _distinct: 'sourceSystem' } }
              }
            }
          },
          requestParams: {
            include: 'requested',
            filter: {
              tableColumnValue: {
                operator: "!=",
                value: "null"
              }
            }
          },
          disabled: {
            row: (item) => !!item?.requested?.length
          },
          excludeActions: ['export', 'sync', 'recommendations']
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
      const filter = {
        loadOptions: {
          apiRoute: 'apiRoutes.qmapper.references',
          select: { label: name, id: name },
          requestParams: {
            filter: {
              _distinct: name,
            }
          }
        }
      };

      filter.loadOptions.requestParams.filter[name] = {
        operator: "!=",
        value: "null"
      }

      return filter;
    },
    getTag(item) {
      const ind = item?.requested?.approvalInd || item?.mappingInd;

      if (!ind) return '-';
      const { bg, color } = PROPS_BUTTONS[ind] || {
        bg: '#B1E2FA',
        color: '#156DAC'
      };

      // <i className="fa-solid fa-comment-dots"></i>
      return `<span class="tw-border tw-py-0.5 tw-px-2 tw-rounded-md tw-font-bold" style="background-color: ${bg}; color: ${color}; font-size: 10px;">${ind}</span>`;
    },
  }
};
</script>
