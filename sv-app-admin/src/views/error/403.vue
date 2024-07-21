<template>
    <div class="not-container">
        <h2>403</h2>
        <h4>抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</h4>
        <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
    </div>
</template>

<script setup name="403">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped lang="scss"></style>