<template lang="">
  <el-card>
    <div class="header-content">
      <div class="title">Course List</div>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-select v-model="sources" placeholder="Sources">
            <el-option value="">All</el-option>
            <el-option value="Ncc">{{ $t("m.NCC") }}</el-option>
            <el-option value="Scorm">{{ $t("m.SCORM") }}</el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-select v-model="level" placeholder="Level">
            <el-option value="">All</el-option>
            <el-option value="Basic">{{ $t("m.Basic") }}</el-option>
            <el-option value="Advance">{{ $t("m.Advance") }}</el-option>
            <el-option value="Expert">{{ $t("m.Expert") }}</el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-select v-model="type" placeholder="Type">
            <el-option value="">All</el-option>
            <el-option value="Recur">{{ $t("m.Recur") }}</el-option>
            <el-option value="Perpetual">{{ $t("m.Perpetual") }}</el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-input
            class="el-select"
            v-model="query"
            prefix-icon="el-icon-search"
            placeholder="Tìm Kiếm"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <el-form>
      <el-table
        v-loading="loading"
        :data="coursesList.items"
        element-loading-text="loading"
        ref="table"
        width="100%"
      >
        <el-table-column
          prop="id"
          align="center"
          label="ID"
          width="60"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="Avatar"
          align="center"
          width="160"
          prop="avatar"
        >
          <template slot-scope="scope">
            <el-avatar
              class="avatar-img"
              shape="square"
              :size="100"
              :fit="fit"
              :src="scope.row.avatar"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="Title"
          width="auto"
        ></el-table-column>
        <el-table-column align="center" label="Sourses" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.sources === 'Ncc'
                  ? 'danger'
                  : scope.row.sources === 'Scorm'
                  ? 'primary'
                  : null
              "
              >{{ scope.row.sources }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="Level" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.level === 'Basic'
                  ? 'success'
                  : scope.row.level === 'Advance'
                  ? 'warning'
                  : scope.row.level === 'Expert'
                  ? 'danger'
                  : null
              "
              >{{ scope.row.level }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column align="center" label="Type" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.type === 'Recur'
                  ? 'info'
                  : scope.row.type === 'Perpetual'
                  ? ''
                  : null
              "
              >{{ scope.row.type }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="Visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.visible"
              active-text=""
              inactive-text=""
              @change="handleVisibleSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="220" label="Operation">
          <div slot-scope="scope">
            <icon-btn
              name="Edit"
              icon="edit"
              @click.native="goEdit(scope.row.id)"
            ></icon-btn>
            <icon-btn
              name="User Answers"
              icon="users"
              @click.native="goUserAnswer(scope.row.id)"
            />
            <icon-btn
              name="Delete"
              @click.native="goDelete(scope.row.id)"
              icon="trash"
            ></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="SSbottom" v-if="isSuperAdmin">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="goCreate()"
          size="small"
          >Create</el-button
        >
        <el-pagination
          class="pagnination"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-count="coursesList.total_pages"
          hide-on-single-page
        >
        </el-pagination>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";
export default {
  name: "CoursesList",
  data() {
    return {
      title: "Courses List",
      loading: false,
      sources: "",
      level: "",
      query: "",
      type: "",
      page: 1,
      coursesList: [],
      currentPage: 1
    };
  },
  mounted() {
    this.getCoursesList({ query: this.query, page: this.currentPage });
  },
  methods: {
    currentChange(page) {
      this.currentPage = page;
      this.getCoursesList({ page });
    },
    getCoursesList(params) {
      this.loading = true;
      const apiParams = {
        query: this.query,
        page: params.page
      };
      if (this.sources !== "") {
        apiParams.sources = this.sources;
      } else if (this.level !== "") {
        apiParams.level = this.level;
      } else if (this.type !== "") {
        apiParams.type = this.type;
      }
      api.getCoursesList(apiParams).then(
        res => {
          this.loading = false;
          this.coursesList = res.data;
        },
        res => {
          this.loading = false;
        }
      );
    },
    goEdit(coursesId) {
      this.$router
        .push({ name: "edit-courses", params: { coursesId } })
        .catch(() => {});
    },
    goCreate() {
      this.$router.push({ name: "create-courses" }).catch(() => {});
    },
    goUserAnswer(coursesId) {
      this.$router
        .push({
          name: "courses-users",
          params: { coursesId }
        })
        .catch(() => {});
    },
    handleVisibleSwitch(row) {
      api.editCourses(row);
    },
    goDelete(id) {
      this.$confirm(
        "Sure to delete this problem? The associated submissions will be deleted as well.",
        "Delete Courses",
        {
          type: "warning"
        }
      ).then(
        () => {
          api
            .deleteCourses(id)
            .then(() => [this.getCoursesList(this.currentPage - 1)])
            .catch(() => {});
        },
        () => {}
      );
    }
  },
  computed: {
    ...mapGetters(["isSuperAdmin", "isInterviewer"])
  },
  watch: {
    query() {
      this.currentChange(this.coursesList.current_page);
    },
    sources() {
      const page = this.coursesList.current_page || 1;
      this.currentChange(page);
    },
    level() {
      const page = this.coursesList.current_page || 1;
      this.currentChange(page);
    },
    type() {
      const page = this.coursesList.current_page || 1;
      this.currentChange(page);
    }
  }
};
</script>
<style lang="">
.pagnination {
  display: flex;
  justify-content: right;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 20px;
}
.avatar-img img {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.SSbottom {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.title {
  margin: 0;
  color: #333;
  border-color: #ddd;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.025em;
  height: 60px;
  line-height: 45px;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.el-card__body,
.el-main {
  padding: 15px;
}
.el-card {
  margin-bottom: 0px;
}
.header-content {
  display: flex;
  justify-content: space-between;
}
.el-divider {
  margin: 0;
}
.el-select {
  margin-bottom: 10px;
}
</style>
