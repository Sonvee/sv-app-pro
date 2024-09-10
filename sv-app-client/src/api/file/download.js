import http from '@/config/request'

export function permissionExcelTemplate() {
	return http.download('/user/permissionExcelTemplate', {
		responseType: 'blob', // 指定响应类型为二进制数据
	})
}