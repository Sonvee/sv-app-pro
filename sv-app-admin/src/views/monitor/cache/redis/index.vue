<template>
  <div class="page-container">
    <!-- 栅格布局 -->
    <el-row :gutter="10" class="h-full">
      <el-col :span="8">
        <el-card shadow="hover" class="h-full">
          <template #header>
            <i class="sv-icons-redis mr-5"></i>
            缓存键名
          </template>
          <!-- 键名结构（树状） -->
          <el-input v-model="filterText" :prefix-icon="Search" placeholder="请输入检索" class="w-full mb-10" />
          <el-tree
            ref="treeRef"
            accordion
            :data="treedata"
            :filter-node-method="filterNode"
            :props="{
              children: 'children',
              label: 'label'
            }"
            v-permission="['sys:cache:query']"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <div>{{ node.label }}</div>
                <el-button
                  v-if="!isTruthy(data.children, 'arr')"
                  size="small"
                  :icon="Delete"
                  link
                  type="danger"
                  v-permission="['sys:cache:delete']"
                  @click.stop="deleteRedis(node.label)"
                ></el-button>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" ref="cardRef" class="h-full">
          <template #header>
            <div class="flx-justify-between">
              <div>
                <i class="admin-icons-doc mr-5"></i>
                缓存内容 {{ curKey ? ' 『 ' + curKey + ' 』 ' : '' }}
              </div>
              <el-button size="large" :icon="Delete" link type="danger" v-permission="['sys:cache:delete']" @click="deleteRedis(curKey)" />
            </div>
          </template>
          <div class="json-viewer">
            <JsonViewer :value="valuedata" :expand-depth="2" v-permission="['sys:cache:query']"></JsonViewer>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { cacheDelete, cacheKeyList, cacheValueByKey } from '@/api/cache'
import { isTruthy } from '@/utils'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'
import { useElementSize } from '@vueuse/core'
import { Search, Delete } from '@element-plus/icons-vue'

const treedata = ref([])
const filterText = ref('')
const curKey = ref('')
const valuedata = ref({})
const treeRef = ref()
const cardRef = ref()
const { height: cardHeight } = useElementSize(cardRef)
const JsonViewerHeight = ref()

onMounted(() => {
  refresh()

  // 获取卡片内容部分高度作为JsonViewer高度
  JsonViewerHeight.value = `${cardHeight.value - 100}px`
})

watch(filterText, (newVal) => {
  treeRef.value?.filter(newVal)
})

function filterNode(e, data) {
  if (!e) return true
  return data.label.includes(e)
}

function handleNodeClick(e) {
  if (!isTruthy(e.children, 'arr')) {
    curKey.value = e.label
    getCacheValue(e.label)
  }
}

function refresh() {
  getCacheKeyList()
  valuedata.value = {}
  filterText.value = ''
  curKey.value = ''
}

function getCacheKeyList() {
  cacheKeyList().then((res) => {
    treedata.value = convertToTree(res.data)
  })
}

function getCacheValue(key) {
  cacheValueByKey({ key }).then((res) => {
    valuedata.value = res.data
  })
}

function deleteRedis(key) {
  if (!key) return

  ElMessageBox.confirm(`确认删除缓存『 ${key} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await cacheDelete({ key })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

/**
 * 将redis键数组转换为树形数组
 * @param {Array} arr redis键数组
 * @returns {Array} 树形数组
 */
function convertToTree(arr) {
  if (!isTruthy(arr, 'arrobj')) return []

  const tree = {}

  arr.forEach((item) => {
    const parts = item.split(':')
    let currentLevel = tree

    for (let i = 0; i < parts.length; i++) {
      const label = parts[i]

      if (!currentLevel[label]) {
        currentLevel[label] = {
          label: parts.slice(0, i + 1).join(':')
        }

        if (i < parts.length - 1) {
          // 只有不是最后一级时才添加children属性
          currentLevel[label].children = {}
        }
      }

      currentLevel = currentLevel[label].children
    }
  })

  // 将对象转换为数组形式
  function objToArray(obj) {
    return Object.entries(obj).map(([key, value]) => {
      const node = { ...value }
      if (value.children) {
        node.children = objToArray(value.children)
      }
      return node
    })
  }

  return objToArray(tree)
}
</script>

<style lang="scss" scoped>
.page-container {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.el-card) {
    display: flex;
    flex-direction: column;

    .el-card__body {
      flex: 1;
    }
  }

  .json-viewer {
    height: v-bind(JsonViewerHeight);
    overflow: auto;

    :deep(.jv-container) {
      height: 100%;

      .jv-code {
        height: 100%;
        overflow: auto;
        padding: 0;
      }
    }
    :deep(.jv-container.jv-light) {
      background: unset;

      .jv-key {
        color: var(--el-text-color-primary);
      }

      .jv-item.jv-object {
        color: var(--el-color-success);
      }

      .jv-item.jv-array {
        color: var(--el-color-primary);
      }

      .jv-ellipsis {
        background-color: #eeeeee22;
      }
    }
  }
}
</style>
