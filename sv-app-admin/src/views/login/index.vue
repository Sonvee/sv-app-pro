<template>
  <div class="login-container flex-vhc">
    <div class="login-box">
      <SwitchDark class="theme" />
      <!-- banner -->
      <div class="login-left flx-center">
        <img class="login-img" src="@/assets/images/login_left.png" alt="" />
      </div>
      <div class="login-right flex-vhc">
        <component :is="componentId" @changeMode="changeMode"></component>
      </div>
    </div>
  </div>
</template>

<script setup name="login">
import { shallowRef } from 'vue'
import SwitchDark from '@/components/SwitchDark/index.vue'
import LoginCard from './components/LoginCard.vue'
import RegisterCard from './components/RegisterCard.vue'

const componentId = shallowRef(LoginCard)

function changeMode(e) {
  switch (e) {
    case 'register':
      componentId.value = RegisterCard
      break
    case 'login':
      componentId.value = LoginCard
      break
  }
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: #eee;
  background-image: url('@/assets/svgs/login_bg.svg');
  // background-image: url('@/assets/svgs/colorful.svg');
  background-repeat: no-repeat;
  background-size: cover;

  .login-box {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    padding: 20px;
    position: relative;
    display: flex;

    .theme {
      position: absolute;
      top: 12px;
      right: 16px;
    }

    .login-left {
      flex: 3;

      .login-img {
        width: 70%;
        object-fit: cover;
      }
    }

    .login-right {
      flex: 2;
      flex-shrink: 0;
    }
  }
}

.dark {
  .login-container {
    background-color: #191919;

    .login-box {
      background-color: rgba(0, 0, 0, 0.6);

      .login-form,
      .register-form {
        box-shadow: rgb(255 255 255 / 12%) 0 2px 10px 2px;
      }
    }
  }
}

@media screen and (width <= 1250px) {
  .login-left {
    display: none;
  }
}

@media screen and (width <= 600px) {
  .login-right {
    width: 240px !important;
  }
}
</style>
