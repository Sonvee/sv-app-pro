import { menuBatchAdd } from '@/api/menu'
import { roleBatchAdd } from '@/api/user/role'
import { permissionBatchAdd } from '@/api/user/permission'
import { dictBatchAdd } from '@/api/dict/dict'
import { dictitemBatchAdd } from '@/api/dict/dictitem'

import menuData from '@/assets/json/menuList.json'
import roleData from '@/assets/json/roleList.json'
import permissionData from '@/assets/json/permissionList.json'
import dictData from '@/assets/json/dictList.json'
import dictitemData from '@/assets/json/dictitemList.json'

/**
 * 数据初始化
 * @description 调用一次即可，自动初始化菜单、角色、权限、字典、字典项等数据
 */
export const useDatabaseInit = () => {
  // menuBatchAdd({ list: menuData.data, cover: false })
  // roleBatchAdd({ list: roleData.data, cover: false })
  // permissionBatchAdd({ list: permissionData.data, cover: false })
  // dictBatchAdd({ list: dictData.data, cover: false })
  dictitemBatchAdd({ list: dictitemData.data, cover: false })
}
