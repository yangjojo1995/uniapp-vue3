<template>
  <view class="page">
    <view class="header">
      <ym-search-bar
        clickable
        clear-button="none"
        cancel-button="none"
        @click="jumpSearch"
      ></ym-search-bar>
      <u-dropdown ref="dropdownRef">
        <u-dropdown-item
          v-model="filterData.investField"
          :title-active="filterData.investField"
          :title="fieldOption?.label || '全部领域'"
          :options="fieldOptions"
        >
        </u-dropdown-item>
        <u-dropdown-item
          v-model="filterData.city"
          :title-active="filterData.city"
          :title="filterData.cityName || '全部地区'"
        >
          <view class="region-city-panel">
            <div class="region-city-panel__inner">
              <ym-region-city-panel
                @checked-citys="handleCheckedCitys"
              ></ym-region-city-panel>
            </div>
          </view>
        </u-dropdown-item>
        <u-dropdown-item
          v-model="filterData.investRound"
          :title-active="filterData.investRound"
          :title="roundOption?.label || '全部轮次'"
          :options="roundOptions"
        >
        </u-dropdown-item>
      </u-dropdown>
    </view>

    <managerList class="page-list" :listPagingLazy="listPagingLazy"></managerList>

  </view>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import { useService, useRouter } from '@/plugins/app-core'
  import { PagingLazy } from '@/utils/paging'
  import managerList from './components/list.vue'
  const router = useRouter()
  const service = useService()

  const filterData = reactive({
    statues: ['assisted'],
    investField: '', // 投资领域
    province: '', // 省
    city: '', // 市
    cityName: '',
    investRound: '', // 投资轮次
    sortField: 'update_time',
    asc: false,
  })
  watch(
    () => filterData.investField,
    async () => listPagingLazy.refresh()
  )
  watch(
    () => filterData.city,
    async () => listPagingLazy.refresh()
  )
  watch(
    () => filterData.investRound,
    async () => listPagingLazy.refresh()
  )

  const factor = Math.trunc(Math.random() * 32)
  // 分页
  const listPagingLazy = reactive(
    new PagingLazy(async function (page, size) {
      const { total, records } = await service.manager.getManagerRecords({
        page,
        size,
        factor,
        ...filterData,
      })
      for (const item of records) {
        item.focusAreas = (item.focusAreasStr || [])
          .map((item: any) => item.cityIdStr)
          .join('、')
        item.investFields = (item.investFieldsStr || [])
          .map((item: any) => item.itemName)
          .join('、')
      }
      return { total, records }
    })
  )

  onLoad(() => listPagingLazy.load())
  onReachBottom(() => listPagingLazy.next())
  onPullDownRefresh(async () => {
    await listPagingLazy.refresh()
    uni.stopPullDownRefresh()
  })

  // 搜索条件
  const fieldOptions = reactive([]) as { label: string; value: string }[]
  const fieldOption = computed(() =>
    fieldOptions.find((v) => v.value === filterData.investField)
  )
  const roundOptions = reactive([]) as { label: string; value: string }[]
  const roundOption = computed(() =>
    roundOptions.find((v) => v.value === filterData.investRound)
  )
  onLoad(async (query) => {
    const fields = await service.app.getDictionary({ dictCode: 'invest_field' })
    fieldOptions.push(
      { label: '全部领域', value: '' },
      ...fields.map((item) => ({ value: item.itemValue, label: item.itemName }))
    )
    const rounds = await service.app.getDictionary({ dictCode: 'invest_round' })
    roundOptions.push(
      { label: '全部轮次', value: '' },
      ...rounds.map((item) => ({ value: item.itemValue, label: item.itemName }))
    )
  })

  const dropdownRef = ref()
  const handleCheckedCitys = function (citys: any[]) {
    dropdownRef.value && dropdownRef.value.close()
    if (!citys || !citys[0]) {
      filterData.province = ''
      filterData.city = ''
      filterData.cityName = ''
      return
    }
    if (filterData.city === citys[0].cityId) return
    filterData.province = citys[0].provinceId
    filterData.city = citys[0].cityId
    filterData.cityName = citys[0].cityName
  }

  // 跳转搜索页
  const jumpSearch = function (type: string) {
    return router.push({
      path: '/pages/features-page/search',
      query: {
        title: '搜索共享投资经理',
        type: 'manager',
        path: '/pages/manager/list',
      },
    })
  }

</script>

<style lang="scss" scoped>
  .page-list {
    margin-top: 20rpx;
  }
  .header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: #ffffff;
  }

  .region-city-panel {
    width: 100%;
    background-color: #ffffff;

    &__inner {
      flex: 0 0 auto;
      height: 60vh;
      // height: calc(100vh - 300rpx);
    }

    &__btns {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
