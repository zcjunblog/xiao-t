<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: {}
});
</script>

<style>
  @font-face {
    font-family: 'iconfont';
    src: url('//at.alicdn.com/t/font_2651202_dvcgy7bg77p.ttf') format('truetype');
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
