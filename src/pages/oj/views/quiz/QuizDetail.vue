<template lang="">
  <div>
    <Row class="quizQuestion" v-loading="loading">
      <div>
        <h2 style="text-align: center">{{quiz.title}}</h2>
        <h3 class="important top">*Lưu ý: Các câu trắc nghiệm sẽ tự động được chấm ngay sau khi submit còn các câu tự luận sẽ được chấm sau</h3>
        <h4 class="important top">Số lần làm bài hiện tại: {{quiz.userCompletedQuiz}}/{{quiz.maxTest}}</h4>
        <h4 class="important">Kết quả cao nhất đạt được: {{quiz.highestScore}}/{{quiz.totalScore}}</h4>
        <h3 v-html="quiz.description" class="top"></h3>
      </div>
      <div class="quiz-action">
        <Button icon="md-timer" v-if="canContinue(quiz, quizUser)" class="quiz-btn" plain type="warning" @click.native="goContinue(secId, quizId)">Continue</Button>
        <Button icon="md-timer" v-if="canGoReady(quiz, quizUser)" class="quiz-btn" plain type="primary" @click.native="goReady(coursesId, secId, quizId)">Ready to go</Button>
      </div>
    </Row>
  </div>
</template>
<script>
import api from '../../api'

export default {
  name: "QuizDetail",
  data() {
    return {
      quiz: [],
      secId: null,
      quizId: null,
      loading: false,
      quizUser: []
    }
  },
  beforeRouteUpdate(to, from, next) {
    const secId = to.params.sectionId;
    const quizId = to.params.quizId;
    this.checkQuizUser()
    this.getQuiz(secId, quizId);
    next();
  },
  mounted() {
    this.coursesId = this.$route.params.coursesId;
    this.secId = this.$route.params.sectionId;
    this.quizId = this.$route.params.quizId;
    this.checkQuizUser()
    this.getQuiz(this.secId, this.quizId);
  },
  methods: {
    checkQuizUser() {
      api.checkQuizUser().then(res => {
        let data = res.data
        this.quizUser = data
      })
    },
    getQuiz(secId, quizId) {
      this.loading = true
      api.getSectionQuizdetail(secId, quizId).then(res => {
        this.loading = false
        let data = res.data
        this.quiz = data
      })
    },
    canContinue(quiz, quizUser) {
      const now = new Date();
      return quiz.quizUserId && now < new Date(quiz.timeEnd) && quiz.isSubmit == false && quiz.id == quizUser.quizId;
    },
    canGoReady(quiz, quizUser) {
      const now = new Date();
      return quiz.maxTest > quiz.userCompletedQuiz && (!quizUser || Object.keys(quizUser).length == 0 || now > new Date(quiz.timeEnd) || quiz.isSubmit == true);
    },
    goContinue() {
      this.$router.push({ name: "question-list-user", params: { sectionId: this.$route.params.sectionId, quizId: this.$route.params.quizId } });
    },
    goReady() {
      this.coursesId = this.$route.params.coursesId;
      this.secId = this.$route.params.sectionId;
      this.quizId = this.$route.params.quizId;
      api.postQuizUser(this.coursesId, this.secId, this.quizId).then(res => {
        api.createAnswer(res.data.id)//create answer for quizzes
        this.$router.push({ name: "question-list-user", params: { sectionId: this.secId, quizId: this.quizId } });
      })
    }
  }
}
</script>

<style lang="">
.important {
  color: #a94442;
}
.top {
  margin-top: 10px;
}
.quiz-btn {
  display: flex;
  justify-content: center;
  align-items: center;
} 
.quizQuestion {
  padding: 20px;
  min-height: 400px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.col-itemss-end {
  display: flex;
  justify-content: center;
}
.spaceBreak { 
  word-break: break-all;
  margin-top: 15px;
}
</style>