<template>
  <div class="container">
    <el-drawer
      class="sidedrawer"
      :visible.sync="drawer"
      :direction="direction"
      size="auto"
    >
      <SideMenu class="sidebar"></SideMenu>
    </el-drawer>
    <div class="sidemenu">
      <SideMenu class="sidebar"></SideMenu>
    </div>

    <div id="header">
      <div class="leftside">
        <el-button @click="drawer = true" class="btnsidebar">
          <i class="el-icon-fa-bars btn-icon"></i>
        </el-button>
        <div id="disappear" class="imageHeight" title="Luyện Code Online">
          <a href="/">
            <img src="/static/img/logoHeader.png" class="imageHeight" alt="NCC LMS"
          /></a>
        </div>
      </div>
      <div>
        <i class="el-icon-fa-font katex-editor" @click="katexVisible = true"></i>
        <screen-full :width="14" :height="14" class="screen-full"></screen-full>
      </div>
    </div>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <el-dialog :title="$t('m.Latex_Editor')" :visible.sync="katexVisible">
      <KatexEditor></KatexEditor>
    </el-dialog>
  </div>
</template>

<script>
import { types } from "@/store";
import { mapGetters } from "vuex";
import SideMenu from "../components/SideMenu.vue";
import ScreenFull from "@admin/components/ScreenFull.vue";
import KatexEditor from "@admin/components/KatexEditor.vue";
import api from "../api";

export default {
  name: "app",
  data() {
    return {
      version: process.env.VERSION,
      katexVisible: false,
      drawer: false,
      direction: "ltr",
    };
  },
  components: {
    SideMenu,
    KatexEditor,
    ScreenFull,
  },
  beforeRouteEnter(to, from, next) {
    api.getProfile().then((res) => {
      if (!res.data.data) {
        // not login
        next({ name: "login" });
      } else {
        next((vm) => {
          vm.$store.commit(types.CHANGE_PROFILE, { profile: res.data.data });
        });
      }
    });
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style lang="less">
.imageHeight {
  height: 30px;
}
.sidedrawer {
  display: none;
}

.leftside {
  display: flex;
  align-items: center;
}

.btnsidebar {
  display: none;
}

a {
  background-color: transparent;
}

a:active,
a:hover {
  outline-width: 0;
}

img {
  border-style: none;
}

.container {
  overflow: auto;
  height: 100%;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  background-color: #edecec;
}

* {
  box-sizing: border-box;
}

#header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  z-index: 999;
  line-height: 60px;
  height: 60px;
  background: #333780;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  .screen-full {
    margin-right: 8px;
  }
}

.content-app {
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  margin-left: 240px;
  padding: 10px;
}

.footer {
  margin: 15px;
  text-align: center;
  font-size: small;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInUp-enter-active {
  animation: fadeInUp 0.8s;
}

.katex-editor {
  margin-right: 5px;
  /*font-size: 18px;*/
}

@media only screen and (max-width: 1024px) {
  #disappear {
    display: none;
  }

  .sidemenu {
    display: none;
  }

  .sidedrawer {
    display: flex;
  }

  .btnsidebar {
    display: flex;
    border: none;
    background: none;
  }

  .btnsidebar .btn-icon {
    padding: 6px 0;
  }

  #header {
    padding-left: 0;
    padding-right: 20px;
    justify-content: space-between;
  }

  .content-app {
    margin: 60px 0 0 0;
    display: inline-block;
    width: 100%;
  }

  #el-drawer__title {
    display: none;
  }
}
</style>
