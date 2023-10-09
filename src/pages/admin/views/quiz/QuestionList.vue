<template>
  <div class="view">
    <Panel :title="quizId ? 'Quiz Question List' : 'Question List'">
      <div slot="header">
        <el-input v-model="query" prefix-icon="el-icon-search" placeholder="Từ khóa" />
      </div>
      <el-table v-loading="loading" element-loading-text="loading" :data="questionList.items" ref="table"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="question_type" label="Question Type" width="140" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.question_type === 'OE'
                ? 'info'
                : scope.row.question_type === 'TF'
                  ? 'danger'
                  : scope.row.question_type === 'SCQ' ||
                    scope.row.question_type === 'MCQ'
                    ? 'warning'
                    : scope.row.question_type === 'RANK'
                      ? 'success'
                      : 'primary'
              ">
              {{ scope.row.question_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="quiz_type == 'Quiz'" prop="mark" label="Question Mark" width="140" align="center" />
        <el-table-column prop="visible" width="100" label="Visible" align="center">
          <template slot-scope="scope">
            <el-switch style="cursor:pointer;" v-model="scope.row.visible" active-text="" inactive-text=""
              @change="handleVisibleSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160" label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)" />
            <!-- <icon-btn name="Announcement" icon="info-circle"></icon-btn> -->
            <icon-btn name="Delete" icon="trash" @click.native="deleteQuestion(scope.row.id)" />
          </div>
        </el-table-column>
      </el-table>
      <div class="SSbottom">
        <div class="btn-action">
          <el-button type="info" icon="el-icon-back" @click="goBack(sectionId)" size="small">Back</el-button>
          <el-button v-if="have_question < max_question" type="primary" size="small" @click="goCreateQuestion(quiz_type)"
            icon="el-icon-plus">Create
          </el-button>
          <el-button v-if="have_question >= max_question" disabled type="primary" size="small"
            icon="el-icon-plus">Create</el-button>
        </div>
        <el-pagination class="page" layout="prev, pager, next" @current-change="currentChange"
          :page-count="questionList.total_pages" hide-on-single-page />
      </div>
    </Panel>
  </div>
</template>

<script>
import api from "../../api.js";

export default {
  data() {
    return {
      query: "",
      routeName: "",
      loading: false,
      currentPage: 1,
      questionList: [],
      quizId: 0,
      have_question: 0,
      max_question: 0,
      quiz_type: "",
      sectionId: ""
    };
  },
  mounted() {
    this.routeName = this.$route.name;
    this.quizId = this.$route.params.quizId;
    this.getQuestionList({
      query: this.query,
      page: this.questionList.current_page || 1
    });
  },
  methods: {
    currentChange(page) {
      this.currentPage = this.questionList.current_page;
      this.questionList.current_page = page;
      this.getQuestionList({ page });
    },
    getQuestionList(params) {
      this.loading = true;
      let funcName =
        this.routeName === "question-list"
          ? "getQuestionList"
          : "getQuizQuestionList";
      api[funcName](this.quizId, {
        query: this.query,
        page: params.page
      }).then(
        res => {
          this.loading = false;
          this.questionList = res.data;
          this.have_question = res.data.items.length;
          this.max_question = res.data.max_question[0];
          this.quiz_type = res.data.quiz_type[0];
          this.sectionId = res.data.section_id[0];
        },
        res => {
          this.loading = false;
        }
      );
    },
    goEdit(questionId) {
      if (this.routeName === "question-list") {
        this.$router
          .push({ name: "edit-question", params: { questionId } })
          .catch(() => { });
      } else if (this.routeName === "quiz-question-list") {
        this.$router
          .push({
            name: "edit-quiz-question",
            params: {
              questionId: questionId,
              quizId: this.quizId,
              quiz_type: this.quiz_type
            }
          })
          .catch(() => { });
      }
    },
    goCreateQuestion(quiz_type) {
      if (this.routeName === "question-list") {
        this.$router.push({ name: "create-question" }).catch(() => { });
      } else if (this.routeName === "quiz-question-list") {
        this.$router
          .push({
            name: "create-quiz-question",
            params: { quizId: this.quizId, quiz_type }
          })
          .catch(() => { });
      }
    },
    goBack(sectionId) {
      this.$router
        .push({ name: "section-quiz-list", params: { sectionId } })
        .catch(() => { });
    },
    deleteQuestion(id) {
      this.$confirm(
        "Sure to delete this problem? The associated submissions will be deleted as well.",
        "Delete Question",
        {
          type: "warning"
        }
      ).then(
        () => {
          let funcName =
            this.routeName === "question-list"
              ? "deleteQuestion"
              : "deleteQuizQuestion";
          api[funcName](this.quizId, id)
            .then(() => [this.getQuestionList(this.currentPage - 1)])
            .catch(() => { });
        },
        () => { }
      );
    },
    handleVisibleSwitch(row) {
      api.editQuizQuestion(this.quizId, row);
    }
  },
  watch: {
    query() {
      this.currentChange(this.questionList.current_page);
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
