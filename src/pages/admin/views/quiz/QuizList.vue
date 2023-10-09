<template>
  <div class="view">
    <Panel :title="sectionId ? 'Section Quiz List' : 'Quiz List'">
      <div slot="header">
        <el-input v-model="query" prefix-icon="el-icon-search" placeholder="Từ khóa" />
      </div>
      <el-table v-loading="loading" element-loading-text="loading" :data="quizList.results" ref="table"
        style="width: 100%">
        <el-table-column prop="id" width="80" label="ID" sortable />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="quiz_type" label="Quiz Type" width="140" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.quiz_type === 'Quiz' ? 'success' : 'primary'">
              {{ scope.row.quiz_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="max_number_of_questions" label="Max Question" width="140" align="center" />
        <el-table-column prop="max_test" label="Max Test" width="140" align="center" />
        <el-table-column prop="visible" width="100" label="Visible" align="center">
          <template slot-scope="scope">
            <el-switch style="cursor:pointer;" v-model="scope.row.visible" active-text="" inactive-text=""
              @change="handleVisibleSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column width="180" label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)" />
            <icon-btn name="Question" icon="list-ol" @click.native="goQuestionList(scope.row.id)" />
            <icon-btn name="Delete" icon="trash" @click.native="deleteQuiz(scope.row.id)" />
          </div>
        </el-table-column>
      </el-table>

      <div class="SSbottom">
        <div class="btn-action">
          <el-button type="info" icon="el-icon-back" @click="goBack(courseId)" size="small">Back</el-button>
          <el-button type="primary" size="small" @click="goCreateQuiz" icon="el-icon-plus">Create</el-button>
        </div>
        <el-pagination class="page" layout="prev, pager, next" @current-change="currentChange"
          :page-count="quizList.total_pages" hide-on-single-page />
      </div>
    </Panel>
  </div>
</template>

<script>
import api from "../../api.js";

export default {
  data() {
    return {
      quizList: [],
      query: "",
      routeName: "",
      loading: false,
      currentPage: 1,
      quizId: "",
      sectionId: "",
      courseId: ""
    };
  },
  mounted() {
    this.routeName = this.$route.name;
    this.sectionId = this.$route.params.sectionId;
    this.getQuizList({
      query: this.query,
      page: this.quizList.current_page || 1
    });
  },
  methods: {
    currentChange(page) {
      this.currentPage = this.quizList.current_page;
      this.quizList.current_page = page;
      this.getQuizList({ page });
    },
    getQuizList(params) {
      this.loading = true;
      let funcName =
        this.routeName === "quiz-list" ? "getQuizList" : "getSectionQuizList";
      api[funcName](this.sectionId, {
        query: this.query,
        page: params.page
      }).then(
        res => {
          this.loading = false;
          this.quizList = res.data;
          this.courseId = res.data.course_id[0];
        },
        () => {
          this.loading = false;
        }
      );
    },
    goEdit(quizId) {
      if (this.routeName === "quiz-list") {
        this.$router
          .push({ name: "edit-quiz", params: { quizId } })
          .catch(() => { });
      } else if (this.routeName === "section-quiz-list") {
        this.$router
          .push({
            name: "edit-section-quiz",
            params: { quizId: quizId, sectionId: this.sectionId }
          })
          .catch(() => { });
      }
    },
    goCreateQuiz() {
      if (this.routeName === "quiz-list") {
        this.$router.push({ name: "create-quiz" }).catch(() => { });
      } else if (this.routeName === "section-quiz-list") {
        this.$router
          .push({
            name: "create-section-quiz",
            params: { sectionId: this.sectionId }
          })
          .catch(() => { });
      }
    },
    goQuestionList(quizId) {
      this.$router
        .push({ name: "quiz-question-list", params: { quizId } })
        .catch(() => { });
    },
    goBack(coursesId) {
      this.$router
        .push({ name: "courses-section-list", params: { coursesId } })
        .catch(() => { });
    },
    deleteQuiz(id) {
      this.$confirm(
        "Sure to delete this problem? The associated submissions will be deleted as well.",
        "Delete Quiz",
        {
          type: "warning"
        }
      ).then(
        () => {
          let funcName =
            this.routeName === "quiz-list" ? "deleteQuiz" : "deleteSectionQuiz";
          api[funcName](this.sectionId, id)
            .then(() => [this.getQuizList(this.currentPage - 1)])
            .catch(() => { });
        },
        () => { }
      );
    },
    handleVisibleSwitch(row) {
      api.editSectionQuiz(this.sectionId, row);
    }
  },
  watch: {
    query() {
      this.currentChange(this.quizList.current_page);
    }
  }
};
</script>

<style>
.SSbottom {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-action {
  display: flex;
}
</style>
