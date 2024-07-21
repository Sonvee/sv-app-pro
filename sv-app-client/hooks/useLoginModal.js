import { useUserStore } from "@/store/user";

/**
 * 判断用户是否登录，未登录则提示登录弹窗
 * @returns {Boolean} 是否已登录 
 */
export function useLoginModal() {
  const hadLogin = useUserStore().hasLogin
  if (!hadLogin) {
    uni.showModal({
      title: '系统提示',
      content: '还没有登录哦',
      showCancel: true,
      success: ({ confirm }) => {
        if (confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
  }
  return hadLogin
}