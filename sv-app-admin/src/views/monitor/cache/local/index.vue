<template>
  <div class="page-container">
    <div class="card table-container">
      <div class="table-control">
        <el-button type="danger" plain :icon="Delete" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="Refresh" @click="getStorage" title="刷新"></el-button>
      </div>
      <el-table v-loading="loading" :data="storageList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="key" label="缓存键名" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="value" label="缓存详情" align="center" width="160">
          <template #default="scope">
            <el-button type="primary" plain :icon="View" circle @click="cacheViewer(scope.row)"></el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="danger" :icon="Delete" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- JSON格式化预览 -->
    <el-dialog v-model="showViewer" title="缓存详情" width="800" align-center>
      <div class="json-viewer">
        <JsonViewer :value="cacheData" :expand-depth="2"></JsonViewer>
      </div>
      <template #footer>
        <el-button @click="closeViewer">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Refresh, Delete, View } from '@element-plus/icons-vue'
import { isTruthy, objectToArray } from '@/utils'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

onMounted(() => {
  getStorage()
})

const loading = ref(true)
const storageList = ref([])
function getStorage() {
  loading.value = true
  let storageMap = {}
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    storageMap[key] = localStorage.getItem(key)
  })
  storageList.value = objectToArray(storageMap)
  loading.value = false
}

// 删
function del(row) {
  localStorage.removeItem(row.key)
  getStorage()
}

// 多选
const batchSelection = ref([])
function handleSelectionChange(e) {
  batchSelection.value = e.map((item) => item.key)
}

// 批量删除
function batchDelete() {
  if (!isTruthy(batchSelection.value, 'arr')) return
  ElMessageBox.confirm(`确认批量删除所选项吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchSelection.value.forEach((key) => {
        localStorage.removeItem(key)
      })
      ElMessage({
        type: 'success',
        message: '批量删除成功'
      })
      getStorage()
    })
    .catch(() => {})
}

const cacheData = ref({})
const showViewer = ref(false)
function cacheViewer(row) {
  cacheData.value = JSON.parse(row.value)
  showViewer.value = true
}

function closeViewer() {
  showViewer.value = false
  cacheData.value = {}
}
</script>

<style lang="scss" scoped>
.json-viewer {
  height: 500px;
  overflow: auto;

  :deep(.jv-container) {
    height: 100%;

    .jv-code {
      height: 100%;
      overflow: auto;
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
</style>
