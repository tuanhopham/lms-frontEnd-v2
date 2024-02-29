<template lang="">
  <div class="view">
    <Panel title="Quiz Answer List">
      <div slot="header">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="Từ khóa"
          v-model="searchQuiz"
        ></el-input>
      </div>
      <el-row class="row-item" :gutter="10">
        <!-- Quiz List -->
        <el-col :span="this.showHistory ? 12 : 24">
          <el-card>
            <h2>Quiz List</h2>
            <el-table
              v-loading="loading"
              :data="filteredQuizList"
              :default-sort="{ prop: 'quizId', order: 'ascending' }"
              max-height="300"
              style="width: 100%"
            >
              <el-table-column prop="title" label="Title"> </el-table-column>
              <el-table-column
                prop="quizType"
                label="Quiz Type"
                width="auto"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="
                      scope.row.quizType === 'Quiz' ? 'success' : 'primary'
                    "
                  >
                    {{ scope.row.quizType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="120"
                label="Operation"
                align="center"
              >
                <div slot-scope="scope">
                  <el-button
                    size="small"
                    style="width: 82px"
                    :type="
                      showHistory && currentId === scope.row.quizId
                        ? 'primary'
                        : ''
                    "
                    @click="goHistory(userId, scope.row.quizId)"
                  >
                    {{
                      showHistory && currentId === scope.row.quizId
                        ? "Viewing"
                        : "View"
                    }}
                  </el-button>
                </div>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <!-- Quiz History -->
        <el-col :span="12" v-if="showHistory">
          <el-card>
            <h2>Quiz History</h2>
            <QuizHistory
              :quizListUser="quizListUser"
              @dataAnswer="handleAnswer"
            ></QuizHistory>
          </el-card>
        </el-col>
      </el-row>
      <!-- Answerlist -->
      <el-row class="row-item">
        <el-col :span="24" v-show="answerUserList.length > 0">
          <el-card>
            <h3 class="item-title">Question & Answer</h3>
            <AnswerList :answerUserList="answerUserList"></AnswerList>
          </el-card>
        </el-col>
      </el-row>
    </Panel>
  </div>
</template>
<script>
import api from "../../api";
import QuizHistory from "./QuizHistory.vue";
import AnswerList from "./AnswerList.vue";
export default {
  name: "QuizAnswerList",
  components: {
    QuizHistory,
    AnswerList
  },
  data() {
    return {
      showHistory: false,
      currentId: null,
      courseId: null,
      userId: null,
      quizList: [],
      showAnswer: false,
      quizListUser: [],
      answerUserList: [],
      searchQuiz: ""
    };
  },
  mounted() {
    this.courseId = this.$route.params.coursesId;
    this.userId = this.$route.params.userId;
    this.getQuiz(this.courseId);
  },
  computed: {
    filteredQuizList() {
      return this.quizList.filter(quiz =>
        quiz.title.toLowerCase().includes(this.searchQuiz.toLowerCase())
      );
    }
  },
  methods: {
    getQuiz(courseId) {
      api.getQuizUserByCourse(courseId).then(res => {
        this.quizList = res.data.quizz;
      });
    },
    goHistory(userId, quizId) {
      switch (true) {
        case this.currentId === quizId && this.showHistory:
          this.showHistory = false;
          break;
        default:
          this.currentId = quizId;
          this.showHistory = true;
      }
      switch (true) {
        case this.showHistory:
          if (quizId !== this.currentQuizId) {
            this.answerUserList = [];
          }
          this.currentQuizId = quizId;
          api.getQuizListUser(userId, quizId).then(res => {
            this.quizListUser = res.data;
          });
          break;
        default:
          this.answerUserList = [];
          break;
      }
    },
    handleAnswer(value) {
      if (this.showHistory) {
        this.answerUserList = value;
      }
    }
  }
};
</script>
<style lang="">
.user-infor {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 10px;
}
.user-infor h3 {
  margin-left: 10px;
}
.row-item {
  margin-bottom: 10px;
}
.item-title {
  margin-bottom: 15px;
}
</style>
