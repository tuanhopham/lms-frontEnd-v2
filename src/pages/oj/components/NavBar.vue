<template>
  <div id="header">
    <Menu
      theme="light"
      mode="horizontal"
      @on-select="handleRoute"
      :active-name="activeMenu"
      :class="oj - menu"
    >
      <div class="logo" title="NCC PLUS">
        <a href="/"
          ><img src="/static/img/logoNCC.png" height="45px" alt="NCC LMS"
        /></a>
      </div>
      <Menu-item name="/courses">
        <Icon type="md-school"></Icon>
        {{ $t("m.Courses") }}
      </Menu-item>
      <Menu-item name="/problem">
        <Icon type="ios-keypad"></Icon>
        {{ $t("m.NavProblems") }}
      </Menu-item>

      <Menu-item name="/contest">
        <Icon type="md-trophy"></Icon>
        {{ $t("m.Contests") }}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="md-cloud-upload"></Icon>
        {{ $t("m.NavStatus") }}
      </Menu-item>

      <Submenu name="rank">
        <template slot="title">
          <Icon type="md-podium"></Icon>
          {{ $t("m.Rank") }}
        </template>
        <Menu-item name="/acm-rank">
          {{ $t("m.ACM_Rank") }}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{ $t("m.OI_Rank") }}
        </Menu-item>
        <Menu-item name="/experience-rank">
          {{ $t("m.Experience_Ranklist") }}
        </Menu-item>
      </Submenu>

      <Submenu name="about">
        <template slot="title">
          <Icon type="md-information-circle"></Icon>
          {{ $t("m.About") }}
        </template>
        <Menu-item name="/judger">
          {{ $t("m.Judger") }}
        </Menu-item>
        <Menu-item name="/FAQ">
          {{ $t("m.FAQ") }}
        </Menu-item>
      </Submenu>
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button ref="loginBtn" shape="circle" @click="handleBtnClick('login')"
            >{{ $t("m.Login") }}
          </Button>
          <Button
            v-if="website.allow_register"
            shape="circle"
            @click="handleBtnClick('register')"
            style="margin-left: 5px;"
            >{{ $t("m.Register") }}
          </Button>
        </div>
      </template>

      <template v-else>
        <Dropdown
          class="drop-menu"
          @on-click="handleRoute"
          placement="bottom"
          trigger="click"
        >
          <Poptip
            trigger="hover"
            :title="`Cấp độ: ${profile.grade}`"
            :content="`Điểm kinh nghiệm: ${profile.experience}`"
            width="200px"
          >
            <Tag
              v-if="profile.user.title"
              :color="profile.user.title_color"
              style="margin-right:-15px;"
              >{{ profile.user.title }}</Tag
            >
            <Tag v-else :color="color">{{ gradename }}</Tag>
          </Poptip>
          <Button type="text" class="drop-menu-title"
            >{{ user.username }}
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <Dropdown-menu slot="list">
            <Dropdown-item name="/user-home">{{
              $t("m.MyHome")
            }}</Dropdown-item>
            <Dropdown-item name="/status?myself=1">{{
              $t("m.MySubmissions")
            }}</Dropdown-item>
            <Dropdown-item name="/setting/profile">{{
              $t("m.Settings")
            }}</Dropdown-item>
            <Dropdown-item v-if="isAdminRole || isInterviewer" name="/admin">{{
              $t("m.Management")
            }}</Dropdown-item>
            <Dropdown-item divided name="/logout">{{
              $t("m.Logout")
            }}</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">
        {{ $t("m.Welcome_to") }} NCC Lms
      </div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import login from "@oj/views/user/Login";
import register from "@oj/views/user/Register";

export default {
  components: {
    login,
    register
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    ...mapActions(["getProfile", "changeModalStatus"]),
    handleRoute(route) {
      if (route && route.indexOf("blog") >= 0) {
        window.open("https://ncc.asia/", "_blank");
      } else if (route && route.indexOf("admin") < 0) {
        this.$router.push(route).catch(() => {});
      } else {
        window.open("/admin/");
      }
    },
    handleBtnClick(mode) {
      this.changeModalStatus({
        visible: true,
        mode: mode
      });
    },
    // 更换主题
    switchChange(status) {
      let params = document.getElementById("app");
      params.className = "theme" + status;
      window.localStorage.setItem(
        "app",
        document.getElementById("app").className
      );
    },
    // 存储主题颜色
    localStorageDate() {
      let memoryColor = window.localStorage.getItem("app");
      let params = document.getElementById("app");
      params.className = memoryColor;
    }
  },
  computed: {
    ...mapGetters([
      "website",
      "modalStatus",
      "user",
      "profile",
      "isAuthenticated",
      "isAdminRole",
      "isInterviewer",
      "color",
      "gradename"
    ]),
    // 跟随路由变化
    activeMenu() {
      return "/" + this.$route.path.split("/")[1];
    },
    modalVisible: {
      get() {
        return this.modalStatus.visible;
      },
      set(value) {
        this.changeModalStatus({ visible: value });
      }
    }
  },
  created() {
    this.localStorageDate();
  }
};
</script>

<style lang="less">
.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-horizontal .ivu-menu-submenu {
  padding: 0 10px;
}
</style>

<style lang="less" scoped>
#header {
  min-width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);

  .oj-menu {
    background: #fdfdfd;
  }

  .logo {
    margin-left: 2%;
    margin-right: 2%;
    font-size: 20px;
    float: left;
  }

  .logo > a {
    display: flex;
    justify-content: center;
    height: 60px;
    align-items: center;
  }

  .drop-menu {
    float: right;
    margin-right: 30px;
    position: absolute;
    right: 10px;

    &-title {
      font-size: 18px;
    }
  }

  .btn-menu {
    font-size: 16px;
    float: right;
    margin-right: 10px;
  }

  .change-menu {
    float: right;
    margin-right: 130px;
    position: absolute;
    right: 10px;

    &-title {
      font-size: 18px;
    }
  }
}

.modal {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
