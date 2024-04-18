<template>
  <master-modal
      v-model="showModal"
      @hide="resetModal()"
      :title="hook ? hook.title : ''"
      :loading="loading"
      :actions="actionsModal"
  >
    <div class="box" v-if="!!hook">
      <section>
        <!--Description-->
        <label class="text-grey-7 q-mr-xs">{{ $tr('isite.cms.form.description') }}:</label>
        <div v-html="hook.description"/>

        <!--Call Every Minutes-->
        <div class="q-mt-sm" v-if="!!hook.callEveryMinutes">
          <label class="text-grey-7 q-mr-xs">{{ $tr('iwebhooks.cms.form.callEveryMinutes') }}:</label>
          {{ hook.callEveryMinutes }}
        </div>
      </section>

      <section>
        <!--URL-->
        <div class="q-my-sm" style="word-wrap: break-word">
          <label class="text-grey-7 q-mr-xs">{{ $tr('iwebhooks.cms.form.endpoint') }}:</label>
          <p class="ellipsis">{{ hook.endpoint }}</p>
          <q-tooltip>
            {{ hook.endpoint }}
          </q-tooltip>
        </div>
        <!--Http Method-->
        <div>
          <label class="text-grey-7 q-mr-xs">{{ $tr('iwebhooks.cms.form.httpMethod') }}:</label> {{ hook.httpMethod }}
        </div>
      </section>

    </div>
  </master-modal>
</template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      showModal: false,
      hook: null,
      loading: false,
      loadingBtn: false,
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qwebhook.entityNames.hook"),
        apiRoute: 'apiRoutes.qwebhook.hooks',
        permission: 'iwebhooks.hooks',
        create: {
          title: this.$tr('iwebhooks.cms.title.newHook'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'endpoint',
              label: this.$tr('iwebhooks.cms.form.endpoint'),
              field: 'endpoint',
              align: 'left',
              action: (col) => this.openModal(col)
            },
            {
              name: 'category',
              label: this.$tr('isite.cms.form.category'),
              field: 'category',
              align: 'center',
              format: val => val?.title || '-',
            },
            {
              name: 'country',
              label: this.$tr('isite.cms.label.country'),
              field: 'country',
              align: 'center',
              format: val => val?.name || '-',
            },
            {
              name: 'callEveryMinutes',
              label: this.$tr('iwebhooks.cms.form.callEveryMinutes'),
              field: 'callEveryMinutes',
              align: 'center',
              format: val => val ? this.$trn(val) : '-',
            },
            {name: 'description', label: this.$tr('isite.cms.form.description'), field: 'description', align: 'rigth'},
            {name: 'httpMethod', label: this.$tr('iwebhooks.cms.form.httpMethod'), field: 'httpMethod', align: 'rigth'},
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'category,country'},
          actions: [
            {
              icon: 'fa-regular fa-rocket',
              tooltip: this.$tr('iwebhooks.cms.label.dispatch'),
              vIf: !!this.$auth.hasAccess('iwebhooks.hooks.dispatch'),
              color: 'blue',
              action: (item) => this.openModal(item),
            }
          ]
        },
        update: {
          title: this.$tr('iwebhooks.cms.title.updateHook'),
          requestParams: {include: 'category'}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
            },
          },
          description: {
            name: "description",
            value: '',
            type: 'html',
            isTranslatable: true,
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`
            }
          },
          actionLabel: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: this.$tr('iwebhooks.cms.form.actionLabel'),
            },
          },
          callEveryMinutes: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('iwebhooks.cms.form.callEveryMinutes'),
              type: 'number'
            },
          },
        },
        formRight: {
          endpoint: {
            value: '',
            type: 'input',
            required: true,
            help: {
              description: this.$tr('iwebhooks.cms.label.helpFieldEndpoint')
            },
            props: {
              label: `${this.$tr('iwebhooks.cms.form.endpoint')}*`,
            },
          },
          categoryId: {
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qwebhook/_crud/categories'),
              crudProps: {
                label: `${this.$tr('isite.cms.form.category')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                options: {
                  label: 'title', value: 'id'
                }
              }
            },
          },
          httpMethod: {
            value: null,
            type: 'select',
            required: true,
            props: {
              label: `${this.$tr('iwebhooks.cms.form.httpMethod')}*`
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsite.configs',
              select: {label: 'label', id: 'value'},
              requestParams: {filter: {configName: 'Iwebhooks.config.httpMethodsOptions'}}
            }
          },
          countryId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.country'),
              clearable: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.countries',
              select: {label: 'name', id: 'id'},
              filterByQuery: true
            }
          },
          redirectLink: {
            value: '',
            type: 'input',
            props: {
              label: this.$tr('iwebhooks.cms.form.redirectLink'),
            },
          },
          body: {
            type: 'json',
            props: {
              label: this.$tr('iwebhooks.cms.form.body'),
            },
          },
          headers: {
            type: 'json',
            props: {
              label: this.$tr('iwebhooks.cms.form.headers'),
            },
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    //Call to Action
    actionsModal() {
      return [
        {
          props: {
            color: 'primary',
            class: 'full-width',
            vIf: !!this.hook?.actionLabel,
            label: this.hook?.actionLabel ?? '',
            loading: this.hook?.isLoading !== 0 || this.loadingBtn
          },
          action: () => this.runWebhook(this.hook.id)
        }
      ]
    }
  },
  methods: {
    resetModal() {
      this.showModal = false
      this.hook = null
    },
    //Open Modal
    openModal(hook) {
      this.showModal = true
      this.getHook(hook.id)
    },
    //Get hook with id
    async getHook(id) {
      this.loading = true
      const requestParams = {refresh: true}
      // get a hook
      await this.$crud.show('apiRoutes.qwebhook.hooks', id, requestParams)
          .then(response => {
            this.hook = response.data
          }).catch(error => this.$alert.error(this.$tr('isite.cms.message.errorRequest')))
      this.loading = false
    },
    // Dispathc webhook by id
    async runWebhook(id) {
      this.loadingBtn = true

      await this.$crud.post(`${config('apiRoutes.qwebhook.hooks')}/dispatch/${id}`)
          .catch(error => this.$alert.error(this.$tr('isite.cms.message.errorRequest')))

      this.loadingBtn = false
    }
  }
}
</script>