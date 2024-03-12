<template>
  <el-menu class="vertical_menu" :router="true" :default-active="currentPath">
    <div class="sidebar2">
      <div>
        <div class="logo">
          <div class="item">
            <img class="avatar" :src="profile.avatar" />
            <div class="info">
              <p>{{ user.username }}</p>
              <p>{{ user.admin_type }}</p>
            </div>
          </div>
          <div class="arrow">
            <el-dropdown class="colorWhite" @command="handleCommand">
              <i class="el-icon-caret-bottom el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-divider class="diver"></el-divider>
        <div class="sidebarlink">
          <el-menu-item index="/"
            ><i class="el-icon-fa-dashboard"></i
            >{{ $t("m.Dashboard") }}</el-menu-item
          >
          <el-submenu v-if="isSuperAdmin" index="general">
            <template slot="title"
              ><i class="el-icon-menu"></i>{{ $t("m.General") }}</template
            >
            <el-menu-item index="/user">{{ $t("m.User") }}</el-menu-item>
            <el-menu-item index="/announcement">{{
              $t("m.Announcement")
            }}</el-menu-item>
            <el-menu-item index="/conf">{{
              $t("m.System_Config")
            }}</el-menu-item>
            <el-menu-item index="/judge-server">{{
              $t("m.Judge_Server")
            }}</el-menu-item>
            <el-menu-item index="/prune-test-case">{{
              $t("m.Prune_Test_Case")
            }}</el-menu-item>
          </el-submenu>
          <el-submenu index="problem" v-if="isAdminRole">
            <template slot="title"
              ><i class="el-icon-fa-bars"></i>{{ $t("m.Problem") }}</template
            >
            <el-menu-item index="/problems">{{
              $t("m.Problem_List")
            }}</el-menu-item>
            <el-menu-item index="/problem/create">{{
              $t("m.Create_Problem")
            }}</el-menu-item>
            <el-menu-item index="/problem/batch_ops">{{
              $t("m.Export_Import_Problem")
            }}</el-menu-item>
          </el-submenu>
          <el-submenu index="contest" v-if="isAdminRole">
            <template slot="title"
              ><i class="el-icon-fa-trophy"></i>{{ $t("m.Contest") }}</template
            >
            <el-menu-item index="/contest">{{
              $t("m.Contest_List")
            }}</el-menu-item>
            <el-menu-item index="/contest/create">{{
              $t("m.Create_Contest")
            }}</el-menu-item>
          </el-submenu>
          <!-- course -->
          <el-submenu index="courses">
            <template slot="title"
              ><i class="el-icon-fa-graduation-cap"></i
              >{{ $t("m.Courses") }}</template
            >
            <el-menu-item index="/courses">{{
              $t("m.Courses_List")
            }}</el-menu-item>
            <el-menu-item v-if="isAdminRole" index="/courses/create">{{
              $t("m.Create_Courses")
            }}</el-menu-item>
          </el-submenu>
        </div>
        <el-divider class="diver"></el-divider>
      </div>
      <div class="footer">Build Version: {{ version }}</div>
    </div>
  </el-menu>
</template>
<script>
import { mapGetters } from "vuex";
import api from "../api";

export default {
  name: "SideMenu",
  data() {
    return {
      currentPath: "",
      version: process.env.VERSION
    };
  },
  mounted() {
    this.currentPath = this.$route.path;
  },
  computed: {
    ...mapGetters([
      "profile",
      "user",
      "isAdminRole",
      "isSuperAdmin",
      "hasProblemPermission"
    ])
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        api.logout().then(() => {
          this.$router.push({ name: "login" }).catch(() => {});
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.colorWhite {
  color: #fff;
}

.diver {
  margin: 0;
}

.sidebarlink {
  height: calc(100vh - 222px);
  overflow: hidden;
}

.sidebarlink:hover {
  overflow-y: scroll;
}

.sidebarlink::-webkit-scrollbar {
  width: 2px;
}

.sidebarlink::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 10px;
}

.sidebarlink::-webkit-scrollbar-thumb:hover {
  background: red;
  border-radius: 10px;
}

.sidebar2 {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100% - 60px);
}

.vertical_menu {
  margin-top: 60px;
  overflow: hidden;
  width: 240px;
  height: 100%;
  position: fixed !important;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;

  .logo {
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.5),
        rgba(13, 0, 58, 0.5)
      ),
      url("/static/img/header_img.jpg");
    background-size: cover;

    img {
      background-color: #fff;
      border-radius: 50%;
      width: 75px;
      height: 75px;
    }

    .item {
      display: flex;
      align-items: center;

      .info {
        margin-left: 10px;
        color: #fff;
      }
    }

    .arrow {
      display: flex;
      align-items: flex-end;
    }
  }
}

@media only screen and (max-width: 1024px) {
  .vertical_menu {
    margin-top: 0px;
  }

  .sidebarlink {
    height: calc(100vh - 162px);
  }

  .sidebar2 {
    height: 100%;
  }
}
</style>
