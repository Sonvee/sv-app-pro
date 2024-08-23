<template>
  <el-dialog v-model="show" :title="title" width="740" align-center>
    <div class="flex-vhc">
      <el-transfer
        v-model="permissionDistribution"
        :data="permissions"
        :props="{
          key: 'permission_id',
          label: 'permission_name'
        }"
        :titles="['待分配', '已分配']"
        :button-texts="['撤消', '分配']"
        filterable
        filter-placeholder="权限检索"
      />
    </div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { permissionList } from '@/api/user/permission'
import { menuUpdate } from '@/api/menu'
import { ElMessage } from 'element-plus'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  }
})
const emits = defineEmits(['close', 'confirm'])
const show = defineModel({ type: Boolean, default: false })
const title = ref('权限分配')
const permissions = ref([])
const permissionDistribution = ref([])

// 数据
handleTable()
async function handleTable(params) {
  const res = await permissionList(params)
  permissions.value = res.data || []
}

watchEffect(() => {
  title.value = `『 ${props.formInit.meta?.title || props.formInit.name} 』权限分配`
  permissionDistribution.value = props.formInit.permissions
})

// 关闭弹窗
function close() {
  show.value = false
  emits('close')
}

async function confirm() {
  // 确认分配角色权限
  const res = await menuUpdate({
    menu_id: props.formInit.menu_id,
    permissions: permissionDistribution.value
  })
  if (res.success) {
    ElMessage({
      type: 'success',
      message: res?.msg
    })
  }
  // 关闭弹窗
  show.value = false
  emits('confirm', permissionDistribution.value)
}
</script>

<style lang="scss" scoped></style>
