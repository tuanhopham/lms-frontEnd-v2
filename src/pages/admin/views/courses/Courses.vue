<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane name="Detail" label="Detail">
      <div class="view">
        <Panel :title="title">
          <el-form
            :model="courses"
            ref="courses"
            :rules="rules"
            label-position="top"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item
                  prop="avatar"
                  :label="$t('m.Avatar_Setting')"
                  required
                >
                  <el-col :span="12" style="margin-bottom: 10px;">
                    <label class="custom-file-upload">
                      <input type="file" ref="file" @change="selectAvt" />
                      <i class="el-icon-fa-upload icon-upload"></i>
                      Select file
                    </label>
                  </el-col>
                  <el-col :span="24" v-if="previewAvt">
                    <el-image
                      shape="square"
                      class="field-img"
                      :src="previewAvt"
                    ></el-image>
                  </el-col>
                  <el-col :span="24" v-if="!previewAvt">
                    <el-image
                      shape="square"
                      v-if="courses.avatar"
                      class="field-img"
                      :src="courses.avatar"
                    ></el-image>
                    <label v-if="!courses.avatar">Vui lòng chọn ảnh</label>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item
                  prop="title"
                  :label="$t('m.CoursesName')"
                  required
                >
                  <el-input
                    v-model="courses.title"
                    :placeholder="$t('m.CoursesName')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="totalTime" label="total Time" required>
                  <InputNumber
                    :max="1000"
                    de
                    v-model="days"
                    min="0"
                    controls-outside
                    :formatter="
                      value =>
                        `${value} days`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    "
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  />
                  <InputNumber
                    :max="23"
                    min="0"
                    v-model="hours"
                    controls-outside
                    :formatter="
                      value =>
                        `${value} hours`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    "
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-row :gutter="10">
                  <el-col :xs="24" :sm="12" :md="6">
                    <el-form-item
                      prop="sources"
                      :label="$t('m.CoursesSourse')"
                      required
                    >
                      <el-radio
                        class="radio"
                        v-model="courses.sources"
                        label="Ncc"
                        >NCC</el-radio
                      >
                      <el-radio
                        class="radio"
                        v-model="courses.sources"
                        label="Scorm"
                        >SCORM</el-radio
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :md="6">
                    <el-form-item
                      prop="level"
                      :label="$t('m.CoursesLevel')"
                      required
                    >
                      <el-select
                        :placeholder="$t('m.CoursesLevel')"
                        v-model="courses.level"
                      >
                        <el-option
                          :label="$t('m.Basic')"
                          value="Basic"
                        ></el-option>
                        <el-option
                          :label="$t('m.Advance')"
                          value="Advance"
                        ></el-option>
                        <el-option
                          :label="$t('m.Expert')"
                          value="Expert"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :md="6">
                    <el-form-item :label="$t('m.CType')" required>
                      <el-radio
                        class="radio"
                        v-model="courses.type"
                        label="Recur"
                        >Recur</el-radio
                      >
                      <el-radio
                        class="radio"
                        v-model="courses.type"
                        label="Perpetual"
                        >Perpetual</el-radio
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :md="6">
                    <el-form-item :label="$t('m.Courses_Visible')" required>
                      <el-switch
                        v-model="courses.visible"
                        active-text=""
                        inactive-text=""
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>

              <el-col :span="24">
                <el-form-item
                  prop="description"
                  :label="$t('m.CoursesDes')"
                  required
                >
                  <Simditor v-model="courses.description"></Simditor>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </Panel>
      </div>
    </el-tab-pane>
    <el-tab-pane
      name="Section"
      v-if="title != 'Create Courses'"
      label="Section"
    >
      <CoursesSection />
    </el-tab-pane>
    <el-tab-pane name="User" v-if="title != 'Create Courses'" label="User">
      <CourseUser />
    </el-tab-pane>
    <div class="buttonFooter">
      <cancel @click.native="cancelCourses" />
      <save @click.native="saveCourses('courses')"></save>
    </div>
  </el-tabs>
</template>

<script>
import api from "../../api.js";
import Simditor from "../../components/Simditor.vue";
import CoursesSection from "./section/SectionList2.vue";
import CourseUser from "./courseUser/CourseUser.vue";
export default {
  name: "Courses",
  components: {
    CoursesSection,
    Simditor,
    CourseUser
  },
  data() {
    return {
      days: 0,
      hours: 0,
      activeName: "Detail",
      title: "Create Courses",
      currentAvt: undefined,
      previewAvt: undefined,
      courses: {
        title: "",
        description: "",
        sources: "Ncc",
        level: "Basic",
        type: "Recur",
        avatar: null,
        visible: true,
        showUpload: true,
        totalTime: 0
      },
      rules: {
        title: [
          {
            required: true,
            message: "Please input title",
            trigger: "blur",
            alert: "Please input title"
          }
        ],
        description: [
          {
            required: true,
            message: "Please input description",
            trigger: "blur"
          }
        ],
        totalTime: [
          {
            required: true,
            message: "total Time must be greater than 0 hours",
            trigger: "blur"
          }
        ],
        sources: [
          {
            required: true,
            message: "Please select sources",
            trigger: "change"
          }
        ],
        level: [
          {
            required: true,
            message: "Please select level",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "Please select type",
            trigger: "change"
          }
        ],
        avatar: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error("Please select an avatar file"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    selectAvt(event) {
      this.file = event.target.files[0];
      if (this.file.size > 1024 * 1024) {
        // Giới hạn 1MB
        alert("Size file not > 1MB");
        return;
      }
      const reader = new FileReader();
      let rawImg;
      reader.onloadend = () => {
        rawImg = reader.result;
        this.previewAvt = rawImg;
        this.courses.avatar = rawImg;
      };
      reader.readAsDataURL(this.file);
    },
    saveCourses(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let funcName =
            this.$route.name === "edit-courses"
              ? "editCourses"
              : "createCourses";
          if (funcName == "editCourses") {
            api.addCoursesUser(
              this.$route.params.coursesId,
              this.$store.getters.courseUser
            );
          }
          let data = Object.assign({}, this.courses);
          api[funcName](data)
            .then(res => {
              if (funcName == "editCourses") {
                this.$router
                  .push({
                    name: "courses-list",
                    query: {
                      refresh: "true"
                    }
                  })
                  .catch(() => {});
              }
              if (funcName == "createCourses") {
                this.$router
                  .push({
                    name: "edit-courses",
                    params: {
                      coursesId: res.data.id
                    }
                  })
                  .catch(() => {});
                this.activeName = "Section";
              }
            })
            .catch(() => {});
        } else {
          this.$error(
            !this.courses.title
              ? this.rules.title[0].message
              : !this.courses.description
              ? this.rules.description[0].message
              : !this.courses.sources
              ? this.rules.sources[0].message
              : !this.courses.level
              ? this.rules.level[0].message
              : !this.courses.type
              ? this.rules.type[0].message
              : !this.days
              ? this.rules.totalTime[0].message
              : !this.courses.avatar
              ? "please input avatar file"
              : null
          );
          return false;
        }
      });
    },
    cancelCourses() {
      this.$router.push({
        name: "courses-list",
        query: {
          // refresh: "true"
        }
      });
    }
  },
  mounted() {
    if (this.$route.name === "edit-courses") {
      this.title = "Edit Courses";
      api
        .getCoursesDetail()
        .then(res => {
          this.courses = res.data.find(
            i => i.id == this.$route.params.coursesId
          );
          const totalTimeData = this.courses.totalTime;
          this.days = Math.floor(totalTimeData / 24);
          this.hours = totalTimeData > 24 ? totalTimeData % 24 : totalTimeData;
        })
        .catch(error => {});
    }
  },
  watch: {
    "$route.name"(val) {
      if (val === "edit-courses") {
        this.title = "Edit Courses";
        api
          .getCoursesDetail()
          .then(res => {
            this.courses = res.data.find(
              i => i.id == this.$route.params.coursesId
            );
          })
          .catch(error => {});
      }
    },
    hours(val) {
      this.courses.totalTime = this.days * 24 + val;
    },
    days(val) {
      this.courses.totalTime = val * 24 + this.hours;
    }
  }
};
</script>

<style lang="less" scoped>
.Fcard {
  height: 25vh;
}

.field-img {
  width: 15%;
  height: 15%;
}

.custom-file-upload {
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.custom-file-upload:hover {
  background-color: darkblue;
}

.custom-file-upload input[type="file"] {
  display: none;
}

.custom-file-upload i {
  margin-right: 10px;
}

.buttonFooter {
  display: flex;
  justify-content: flex-end;
}
</style>
