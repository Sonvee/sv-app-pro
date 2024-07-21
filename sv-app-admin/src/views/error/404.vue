<template>
    <div class="not-container">
        <h2>404</h2>
        <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
        <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
    </div>
</template>

<script setup name="404">
import { useRouter } from "vue-router";
const router = useRouter();

</script>

<style scoped lang="scss">
</style>