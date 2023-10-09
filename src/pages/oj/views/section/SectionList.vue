<template lang="">
  <div>
    <Row style="margin-bottom: 15px">
      <Col :span="auto">
        <Breadcrumb>
          <BreadcrumbItem @click.native="goHome" class="bread-item">{{
            $t("m.Home")
          }}</BreadcrumbItem>
          <BreadcrumbItem @click.native="goDetail" class="bread-item">{{
            courses.title
          }}</BreadcrumbItem>
          <BreadcrumbItem>{{ $t("m.CoursesContent") }}</BreadcrumbItem>
        </Breadcrumb>
      </Col>
    </Row>
    <Row type="flex" :gutter="18">
      <Col :span="isFull == true ? 24 : 18">
        <Card :padding="5">
          <div class="full_screen">
            <Button @click="handleFull" type="text"><i class="el-icon-fa-arrows-alt" aria-hidden="true"></i></Button>
          </div>
          <div class="question-emty" v-if="!this.$route.params.sectionId && !this.$route.params.quizId">
            <h3>Vui lòng lựa chọn câu hỏi...</h3>
          </div>
          <!--children-->
          <transition name="fadeInUp">
            <router-view></router-view>
          </transition>
          <!--children end-->
        </Card>
      </Col>


      <Col :span="6" :style="{display: isFull == true ? 'none' : ''}">
        <Panel :padding="5">
          <div slot="title" class="taglist-title">
            <Icon type="md-pricetags" /> {{ $t("m.Section_List") }}
          </div>
          <Input
            v-model="query"
            search
            class="searchForm"
            placeholder="Từ khóa"
          />
          <div class="Scroll-bar">
            <h3 v-if="this.section.items.length == 0" class="no-content">
              No sections found
            </h3>
            <div class="menu-quiz"
              v-loading="loading"
              v-for="(sec, index) in section.items"
              :key="sec.id"
            >
              <QuizList :section="sec" :indexs="index + 1"></QuizList>
            </div>
          </div>
        </Panel>
      </Col>


    </Row>
  </div>
</template>
<script>
/* eslint-disable */

import api from "../../api";
import QuizList from "../quiz/QuizList.vue";
export default {
  name: "SectionList",
  components: { QuizList },
  data() {
    return {
      coursesId: '',
      isFull: false,
      isFullTemp: false,
      courses: [],
      section: {
        items: [],
        current_page: 1
      },
      currentPage: 1,
      query: ""
    };
  },
  mounted() {
    this.coursesId = this.$route.params.coursesId
    this.getCourses();
    this.getSection();
  },
  methods: {
    currentChange(page) {
      this.currentPage = this.section.current_page;
      this.section.current_page = page;
      this.getSection({ page });
    },
    goDetail() {
      this.$router.push({name: 'courses-details', params: {coursesId: this.coursesId}}).catch(()=>{});
    },
    goHome() {
      this.$router.push({path: '/courses'}).catch(() => {});
    },
    getCourses() {
      api
        .getCoursesDetail()
        .then(res => {
          let data = res.data.find(i => i.id == this.$route.params.coursesId);
          this.courses = data;
        })
        .catch(error => {});
    },
    getSection() {
      api
        .getSectionList(this.$route.params.coursesId, {
          query: this.query
        })
        .then(res => {
          this.loading = false;
          let data = res.data;
          this.section = data;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    handleFull() {
      this.isFull = this.isFullTemp ? false : true;
      this.isFullTemp = !this.isFullTemp;
    }
  },
  watch: {
    query() {
      this.currentChange(this.section.current_page);
    }
  }
};
</script>
<style lang="">
.question-emty {
  padding: 10px
}
/* .bread-item {
  cursor: pointer;
} */
.bread-item:hover {
  cursor: pointer;
  color: #337ab7;
}
.Scroll-bar {
  height: 60vh;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  padding: 0 5px
}
.Scroll-bar:hover {
  overflow-y: overlay;
  background: #fff;
}
.Scroll-bar::-webkit-scrollbar {
  width: 7px;
}
.Scroll-bar::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.4);
  border-radius: 10rem;
  border: 1px solid #fff;
}
.Scroll-bar::-webkit-scrollbar-track-piece:start {
  background: transparent;
}
.full_screen {
  display: flex;
  justify-content: right;
  margin-top: 10px
}
.full_screen .ivu-btn-text {
  font-size: 20px;
}
</style>
