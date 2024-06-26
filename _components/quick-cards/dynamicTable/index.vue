<template>
  <div>
    <!--Table/Grid View-->
    <q-table
      v-model:pagination="pagination"
      v-if="['table','grid','folders'].includes(localShowAs)"
      :grid="localShowAs === 'grid'" :rows="data"
      :columns="tableColumns"
      :pagination.sync="pagination"
      @request="getData"
      class="stick-table"
      :table-class="localShowAs === 'folders' ? 'tw-hidden' : ''"
      ref="tableComponent"
      card-container-class="q-col-gutter-md"
    >
      <!--Custom Columns-->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in parseColumnsByRow(props.cols, props.row)"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name === 'selectColumn'">
              <q-checkbox
                v-model="selectedRowsAll"
                @update:modelValue="selectAllFields"
              />
            </div>
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="(col, keyCol) in parseColumnsByRow(props.cols, props.row)"
            :key="col.name"
            :props="props"
            :class="`${isDisableRow(props?.row) && col.name != 'actions' ? 'disabled no-pointer-events' : ''} ${col.bgColor ? 'bg-'+col.bgColor : ''}`"
          >
            <!-- Select row -->
            <div v-if="col.name === 'selectColumn'">
              <q-checkbox v-model="selectedRows"
                          :val="props.key"
              />
            </div>
            <!-- Button table collapsable -->
            <div v-if="col.name === 'expandibleColumn'">
              <q-btn
                size="sm"
                flat
                round
                color="blue-grey"
                :icon="tableCollapseIcon(props.key)"
                @click="toggleRelationContent(props)"
              />
            </div>
            <!--Actions column-->
            <div class="crudIndexActionsColumn" v-if="col.name == 'actions'">
              <btn-menu
                :actions="fieldActions(col)"
                :action-data="props.row"
              />
            </div>
            <!-- status columns -->
            <div v-else-if="(['status','active'].indexOf(col.name) != -1) || col.asStatus"
                 class="text-left">
              <!--Action-->
              <q-btn-dropdown
                :color="col.value ? 'green' : 'red'"
                flat
                padding="sm none"
                class="text-caption"
                :label="col.value ? $tr('isite.cms.label.enabled') : $tr('isite.cms.label.disabled')"
                no-caps
                v-if="permitAction(props.row).edit"
              >
                <!--Message change to-->
                <q-item class="q-pa-sm cursor-pointer" clickable @click="updateStatus({...props, col})"
                        v-close-popup>
                  <div class="row items-center">
                    <q-icon name="fa-light fa-pencil" class="q-mr-sm" :color="!col.value ? 'green' : 'red'" />
                    {{
                      $tr('isite.cms.message.changeTo', { text: (col.value ? $tr('isite.cms.label.disabled') : $tr('isite.cms.label.enabled')) })
                    }}
                  </div>
                </q-item>
              </q-btn-dropdown>

              <label v-else>
                {{ col.value ? $tr('isite.cms.label.disabled') : $tr('isite.cms.label.enabled') }}
              </label>
            </div>
            <!--Default columns-->
            <div v-else>
              <!--Badge-->
              <div>
                <promiseTemplate
                  :promise="col.formatAsync ? col.formatAsync(props.row) : col.value"
                  :isLoading="col.formatAsync ? loading : false"
                >
                  <template v-slot="data">
                    <div>
                      <div v-if="col.bgTextColor && data.data"
                           @click="rowclick(col,props.row)"
                           :class="(col.textColor ? ' text-'+col.textColor : '') + (isActionableColumn(col) ? ' cursor-actionable ' : '')"
                      >
                        <q-badge :class="col.bgTextColor">
                          <span v-html="data.data" />
                        </q-badge>
                      </div>
                      <!--Label-->
                      <div
                        v-else
                        @click="rowclick(col,props.row)"
                        v-html="data.data"
                        :class="(isActionableColumn(col) ? 'cursor-actionable' : '') + (col.textColor ? ' text-'+col.textColor : '')"
                      >
                      </div>
                      <q-tooltip v-if="col.tooltip == undefined || col.tooltip">
                        <div v-html="deleteHtml(col.tooltip || data.data)" />
                      </q-tooltip>
                    </div>
                  </template>
                </promiseTemplate>
              </div>
            </div>
          </q-td>
        </q-tr>
        <!-- Collapsed table relationship -->
        <q-tr style="border: 0">
          <q-td colspan="100%" id="collapseTable" style="height: 0; border: 0">
            <q-expansion-item :ref="`trExpansion${props.key}`" header-style="display : none" group="trExpansion">
              <div id="contentRelationData" class="row items-center justify-center">
                <!-- Data -->
                <div v-if="relation.data.length" class="col-12 q-mb-md shadow-3">
                  <!--Label-->
                  <div v-if="relationConfig('label')"
                       class="q-py-sm q-px-sm text-blue-grey text-h4 text-weight-bold text-subtitle1 ellipsis title-content text-center">
                    {{ relationConfig('label') }}
                  </div>
                  <!-- Table -->
                  <q-table
                    :rows="relation.data"
                    :columns="relationConfig('columns')"
                  >
                    <template v-slot:body-cell="props">
                      <q-td :props="props">
                        <!--Actions-->
                        <btn-menu v-if="props.col.name == 'actions'"
                                  :actions="relationConfig('actions')"
                                  :action-data="props.row"
                        />
                        <!-- Default Value -->
                        <label v-else>{{ props.value }}</label>
                      </q-td>
                    </template>
                  </q-table>
                </div>
                <!-- Empty result -->
                <not-result v-else />
                <!-- Inner loading -->
                <inner-loading :visible="relation.loading" />
              </div>
            </q-expansion-item>
          </q-td>
        </q-tr>
      </template>
      <!--Custom cards-->
      <template v-slot:item="props">
        <div :class="`${gridParams.colClass}`">
          <!--Card Component-->
          <component v-if="gridParams.component" :is="gridParams.component" :row="props.row"
                     :permit-action="permitAction(props.row)" :field-actions="fieldActions(props)"
                     @update="params.update.to ? false : $emit('update', props.row)"
                     @delete="deleteItem(props.row)" />
          <!--Default Card -->
          <q-card v-else class="box default-card-grid" style="padding-top: 5px">
            <!--item image-->
            <div class="default-card-grid_item-image" v-if="itemImage(props.row)"
                 :style="`background-image: url('${itemImage(props.row)}')`"></div>
            <!--Fields-->
            <q-list dense>
              <template v-for="col in parseColumnsByRow(props.cols, props.row)" :key="col.name">
                <q-item style="padding: 3px 0" v-if="col?.name != 'actions'">
                  <q-item-section>
                    <!--Field name-->
                    <q-item-label class="ellipsis">
                      <div v-if="col.name != 'actions'" class="row justify-between items-center">
                        <!--Label-->
                        <div> {{ col.label }} {{ col.name == 'id' ? col.value : '' }}</div>
                        <!--Actions-->
                        <btn-menu v-if="col.name == 'id'" :actions="fieldActions(props)" :action-data="props.row" />
                      </div>
                      <q-separator v-if="['id'].indexOf(col.name) != -1" class="q-mt-sm" />
                    </q-item-label>
                    <!--Field value-->
                    <q-item-label v-if="col.name != 'id'" class="text-grey-6">
                      <!-- status columns -->
                      <div v-if="(['status','active'].includes(col.name)) || col.asStatus"
                           class="text-left">
                        <q-btn-dropdown :color="col.value ? 'green' : 'red'" flat padding="sm none"
                                        :label="col.value ? $tr('isite.cms.label.enabled') : $tr('isite.cms.label.disabled')"
                                        class="text-caption" no-caps>
                          <!--Message change to-->
                          <q-item class="q-pa-sm cursor-pointer" v-close-popup clickable
                                  @click="updateStatus({...props, col : col})">
                            <div class="row items-center">
                              <q-icon name="fa-light fa-pencil" class="q-mr-sm"
                                      :color="!col.value ? 'green' : 'red'" />
                              {{
                                $tr('isite.cms.message.changeTo', { text: (col.value ? $tr('isite.cms.label.disabled') : $tr('isite.cms.label.enabled')) })
                              }}
                            </div>
                          </q-item>
                        </q-btn-dropdown>
                      </div>
                      <!--Default columns-->
                      <div v-else>
                        <!--Badge-->
                        <promiseTemplate
                          :promise="col.formatAsync ? col.formatAsync(props.row) : col.value"
                          :isLoading="col.formatAsync ? loading : false"
                        >
                          <template v-slot="data">
                            <div>
                              <div v-if="col.bgTextColor && data.data"
                                   @click="rowclick(col,props.row)"
                                   :class="(col.textColor ? ' text-'+col.textColor : '') + (isActionableColumn(col) ? ' cursor-actionable ' : '')"
                              >
                                <q-badge :class="col.bgTextColor" v-html="data.data"></q-badge>
                              </div>
                              <!--Label-->
                              <div
                                v-else
                                @click="rowclick(col,props.row)"
                                v-html="data.data"
                                :class="'ellipsis ' + (isActionableColumn(col) ? 'cursor-actionable' : '') + (col.textColor ? ' text-'+col.textColor : '')"
                              >
                              </div>
                              <q-tooltip>
                                <div v-html="deleteHtml(col.tooltip || data.data)" />
                                <label v-if="isActionableColumn(col)" class="text-weight-bold">
                                  {{ $tr('isite.cms.label.clickToAction') }}
                                </label>
                              </q-tooltip>
                            </div>
                          </template>
                        </promiseTemplate>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card>
        </div>
      </template>
      <!-- pagination -->
      <!--    <template #bottom="props">-->
      <!--      <div-->
      <!--        :class="`bottonCrud full-width flex items-center ${windowSize == 'mobile' ? 'justify-center' : 'justify-between'}`">-->
      <!--        <div class="sm:tw-text-sm":class="`text-blue-grey ${windowSize == 'mobile' ? 'q-mb-sm' : ''} `">-->
      <!--          {{ $tr('isite.cms.label.showing') }} <b>{{ countPage(props) }}</b> {{ $trp('isite.cms.label.entry') }}-->
      <!--        </div>-->
      <!--        <div class="col-12 q-ml-sm q-mr-lg flex flex-center">-->
      <!--          <q-pagination-->
      <!--            id="crudPaginationComponent"-->
      <!--            v-if="showPagination(props)"-->
      <!--            v-model="table.pagination.page"-->
      <!--            :value="props.pagination"-->
      <!--            @click.prevent="getDataTable()"-->
      <!--            round-->
      <!--            input-class="no-shadow"-->
      <!--            color="while"-->
      <!--            text-color="primary"-->
      <!--            active-color="primary"-->
      <!--            active-text-color="white"-->
      <!--            :max="props.pagesNumber"-->
      <!--            :max-pages="6"-->
      <!--            :ellipses="false"-->
      <!--            :boundary-numbers="false"-->
      <!--            unelevated-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="flex items-center">-->
      <!--          <div class="flex items-center tw-mr-4 text-blue-grey">-->
      <!--            <span class="sm:tw-text-sm">{{ $tr('isite.cms.label.show') }}</span>-->
      <!--            <q-select-->
      <!--              v-model="table.pagination.rowsPerPage"-->
      <!--              :options="rowsPerPageOption"-->
      <!--              @update:modelValue="getDataTable()"-->
      <!--              options-cover-->
      <!--              dense-->
      <!--              class="q-mx-sm text-caption"-->
      <!--              outlined-->
      <!--            />-->
      <!--            <span class="sm:tw-text-sm">{{ $trp('isite.cms.label.entry') }}</span>-->
      <!--          </div>-->
      <!--          <div class="actionsBtnPag">-->
      <!--            <q-btn-->
      <!--              color="primary"-->
      <!--              class="tw-mr-2"-->
      <!--              dense-->
      <!--              size="14px"-->
      <!--              round-->
      <!--              flat-->
      <!--              :disable="props.isFirstPage"-->
      <!--              @click="props.prevPage"-->
      <!--            >-->
      <!--              <i class="fa-solid fa-chevron-left"></i>-->
      <!--            </q-btn>-->
      <!--            <q-btn-->
      <!--              color="primary"-->
      <!--              dense-->
      <!--              size="14px"-->
      <!--              round-->
      <!--              flat-->
      <!--              :disable="props.isLastPage"-->
      <!--              @click="props.nextPage"-->
      <!--            >-->
      <!--              <i class="fa-solid fa-chevron-right"></i>-->
      <!--            </q-btn>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </template>-->
    </q-table>

    <!--Inner Loading-->
    <q-skeleton
      v-if="loading"
      type="rect"
      height="161px"
      width="262px"
      class="tw-mt-4"
    />
  </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from './controller';

export default defineComponent({
  props: {
    read: { default: false },
    entityName: { default: '' }
  },
  components: {},
  emits: ['openQr'],
  setup(props, { emit }) {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
</style>
