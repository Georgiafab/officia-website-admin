<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <!-- <el-image
          v-if="logomoble"
          fit="contain"
          :src="logomoble"
          class="sidebar-logo"
        /> -->
        <h1 class="sidebar-title">VixAI</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <el-image v-if="logo" fit="contain" :src="logo" class="sidebar-logo" /> -->
        <h1 class="sidebar-title">VixAI</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logo from "@/assets/logo.svg";
import logomoble from "@/assets/logomoble.png";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // title: "Vue Admin Template",
      logo: logo,
      logomoble: logomoble,
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 70px;
  background: #223769;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 90%;
      height: 26px;
      vertical-align: middle;
      // margin-right: 12px;
    }

    & .sidebar-title {
      font-size: 35px;
      line-height: 1;
      font-weight: 700;
      font-family: "Roboto", sans-serif;
      color: #fff;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
