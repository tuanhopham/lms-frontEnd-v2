<template lang="">
  <div>
    <Row style="margin-bottom: 15px">
      <Col :span="auto">
        <Breadcrumb>
          <BreadcrumbItem @click.native="goHome" class="bread-item">{{
            $t("m.Home")
          }}</BreadcrumbItem>
          <BreadcrumbItem>{{
            typeof courses.title === "string"
              ? courses.title
              : $t("m.CoursesInfo")
          }}</BreadcrumbItem>
        </Breadcrumb>
      </Col>
    </Row>
    <Row type="flex">
      <Col :span="24">
        <Card>
          <Row v-loading="loading" :gutter="10" class="elRow">
            <Col :xs="24" :sm="12" :md="16">
              <Row :gutter="20" class="form-left">
                <Col :span="24" class="col-title">
                  <h1 class="title">{{ courses.title }}</h1>
                </Col>
                <Col :span="24" class="col-title">
                  <p class="courses-item-i" v-html="courses.description"></p>
                </Col>
                <Col :span="24" class="col-title-content">
                  <h3>Course info:</h3>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-university icons"></i>Sources:
                    {{ courses.sources }}
                  </p>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-sort-amount-asc icons"></i>Level:
                    {{ courses.level }}
                  </p>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-graduation-cap icons"></i>Type:
                    {{ courses.type }}
                  </p>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-calendar-plus-o icons"></i>Start time:
                    {{ courses.start_time | localtime("HH:mm:ss, DD/MM/YYYY") }}
                  </p>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-calendar-check-o icons"></i>End time:
                    {{ courses.end_time | localtime("HH:mm:ss, DD/MM/YYYY") }}
                  </p>
                </Col>
                <Col :span="12">
                  <p class="courses-item-i">
                    <i class="el-icon-fa-calendar icons"></i>Total time:
                    {{ courses.totalTime }} hours
                  </p>
                </Col>
                <Col :span="12">
                  
                </Col>
              </Row>
            </Col>
            <Col :xs="24" :sm="12" :md="8">
              <Row :gutter="10" class="form-rignt">
                <Col :span="24" class="form-action">
                  <el-image :src="courses.avatar" />
                </Col>
                <Col :span="24" class="form-action btn-item">
                  <Button
                    long
                    type="warning"
                    :loading="loading"
                    @click.native="goSection"
                    class="btn-items"
                    >Start<Icon type="ios-play"
                  /></Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import time from "@/utils/time";
import SectionList from "../section/SectionList.vue";
import api from "../../api";
export default {
  name: "CoursesDetail",
  components: { SectionList },
  data() {
    return {
      courses: [],
      route_name: "",
      loading: false,
    };
  },
  mounted() {
    this.getCourses();
    this.route_name = this.$route.name;
  },
  methods: {
    goHome() {
      this.$router.push({ path: "/courses" }).catch(() => {});
    },
    getDuration(startTime, endTime) {
      return time.duration(startTime, endTime);
    },
    goSection() {
      api
        .startTimeCourseUser(this.$route.params.coursesId)
        .then(res => {
         this.$router.push({ name: "section-list-user" }).catch(() => {});
        })
        .catch(error => {
          this.loading = false;
        });
      
    },
    getCourses() {
      this.loading = true;
      api
        .getCoursesDetail()
        .then(res => {
          this.loading = false;
          let data = res.data.find(i => i.id == this.$route.params.coursesId);
          this.courses = data;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="">
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.action .btn {
  margin: 10px;
}
.icons {
  margin-right: 10px;
}
.elRow {
  padding: 25px;
}
.courses-item-i {
  margin-bottom: 15px;
  font-size: 17px;
}
.col-title {
  margin-bottom: 10px;
}
.col-title .title {
  font-size: 35px;
}
.col-title-content {
  margin-bottom: 20px;
}
.form-rignt,
.form-left {
  padding: 20px;
}
.form-action,
.btn-items {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-action .el-image {
  width: 100%;
  height: 100%;
}
.form-action .el-image img {
  border-radius: 10px;
  object-fit: cover;
  height: 35vh;
}

.btn-item {
  margin-top: 10px;
}
.bread-item {
  cursor: pointer;
}
</style>
