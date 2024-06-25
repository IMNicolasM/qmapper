import { computed, reactive, ref, onMounted, toRefs, watch } from 'vue';
import { clone, i18n, store, alert } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  };

  // States
  const state = reactive({
    data: [],
    pagination: {
      page: 1,
      rowsNumber: '',
      rowsPerPage: 10,
      descending: true
    },
    filter: {
      search: null
    },
    localShowAs: 'table'
  });

  // Computed
  const computeds = {
    permisionRelation: computed(() => {
      return props.read?.relation?.permission ? store.hasAccess(props.read.relation.permission) : true;
    }),
    tableColumns: computed(() => {
      let columns = clone(props.read.columns);
      //Check columns
      columns.forEach(column => {
        //Default sort by id
        if (['id', 'created_at', 'updated_at'].indexOf(column.name) != -1) column.sortable = true;
        //Validate column actions
        if (column.name == 'actions') column.align = 'right';
        //Add format to status column
        if ((['status', 'active'].indexOf(column.name) != -1) || column.asStatus) {
          column.format = val => {
            let value = (typeof val === 'boolean') ? (val = val ? 1 : 0) : val;//Convert booleand to integer
            return Number.isInteger(parseInt(value)) ? parseInt(value) : 0;//Parse value
          };
        }
      });

      //Force align first column
      if (columns.length > 0) columns[0].align = 'left';
      // Collapsible action column
      const relationName = methods.relationConfig('name');
      if ((methods.relationConfig('name') || methods.relationConfig('apiRoute')) && computeds.permisionRelation.value) {
        columns.unshift({
          name: 'expandibleColumn',
          label: '',
          align: 'center'
        });
      }
      //Select column
      if (computeds.bulkActions.value.length) {
        columns.unshift({ name: 'selectColumn', label: '', align: 'center' });
      }

      //Verify if includes qrs
      if (props?.read?.requestParams?.include?.includes('qrs')) {
        //Create column QR, if exist in include
        const columnQr = {
          name: 'qr', label: 'QR',
          align: 'left',
          format: () => '<i class="fa-light fa-qrcode" style="font-size: 20px">',
          tooltip: i18n.tr('iqreable.cms.label.view'),
          action: (item: any) => emit('openQr', item)
        };

        //Set the QR column and place it in position 1 of the array
        columns.splice(1, 0, columnQr);
      }
      //Response
      return columns;
    }),

    bulkActions: computed(() => {
      let response = [];
      var bulkActions = props.read.bulkActions || [];
      //Validate availability
      response = bulkActions.filter(action => {
        //Validate vIf
        if ((action?.vIf != undefined) && !action?.vIf) return false;
        //Validate permission
        if ((action.permission != undefined) && !store.hasAccess(action.permission)) return false;
        //Validate apiRoute
        if (!action.apiRoute) return false;
        //Default response
        return true;
      }).map(action => {
        return {
          ...action,
          props: {
            rounded: true,
            dense: true,
            unelevated: true,
            color: 'white',
            class: 'btn-small',
            noCaps: true,
            textColor: 'blue-grey',
            padding: '3px 10px',
            ...(action.props || {})
          }
        };
      });
      //Response
      return response;
    })
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    // collapsible relation return type
    relationConfig(key = '') {
      //Instance de relationConfig
      const relation = {
        label: '',
        apiRoute: '',
        requestParams: {},
        columns: [],
        actions: [],
        ...(props.read.relation || {})
      };

      //Default response
      if (!key) return relation;
      //Add action column
      if (relation.actions.length && !relation.columns.find(item => item.name == 'actions')) {
        relation.columns.push({ name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center' });
      }
      //Response
      return relation[key];
    }
    // methodKey: () => {}
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
