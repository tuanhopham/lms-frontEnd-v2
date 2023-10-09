<template>
  <div class="view">
    <Panel :title="title">
      <el-form :model="quiz" ref="quiz" :rules="rules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="title" label="Title" required>
              <el-input placeholder="Title" v-model="quiz.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="description" label="Description" required>
              <Simditor v-model="quiz.description" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="maxNumberOfQuestions"
              label="Max number of question"
              required
            >
              <el-input
                placeholder="Number"
                v-model.number="quiz.maxNumberOfQuestions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Quiz Type">
              <el-radio
                v-model="quiz.quiz_type"
                label="Quiz"
                :disabled="disabledQuizType"
              />
              <el-radio
                v-model="quiz.quiz_type"
                label="Survey"
                :disabled="disabledQuizType"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Status">
              <el-switch
                v-model="quiz.visible"
                active-text=""
                inactive-text=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="maxTest" label="Max test" required>
              <el-input placeholder="Max test" v-model.number="quiz.maxTest" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="quizTime" label="Quiz time" required>
              <TimePicker
                v-model="quiz.quizTime"
                placeholder="Quiz time"
              ></TimePicker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="buttonFooter">
        <cancel @click.native="cancelQuiz" />
        <save @click.native="saveQuiz('quiz')" />
      </div>
    </Panel>
  </div>
</template>

<script>
import api from "../../api.js";
import Simditor from "../../components/Simditor.vue";

export default {
  components: {
    Simditor
  },
  data() {
    return {
      title: "Create Quiz",
      disabledQuizType: false,
      quiz: {
        title: "",
        description: "",
        maxNumberOfQuestions: "",
        quiz_type: "Quiz",
        quizTime: "",
        maxTest: "",
        visible: true
      },
      rules: {
        title: {
          required: true,
          message: "Title is required",
          trigger: "blur"
        },
        description: {
          required: true,
          message: "Description is required",
          trigger: "change"
        },
        maxNumberOfQuestions: {
          required: true,
          message: "Max number of questions is required a valid integer value",
          trigger: "change"
        },
        quizTime: {
          required: true,
          message: "Quiz time is required",
          trigger: "change"
        },
        maxTest: {
          required: true,
          message: "Max test is required",
          trigger: "change"
        }
      }
    };
  },
  mounted() {
    if (
      this.$route.name === "edit-quiz" ||
      this.$route.name === "edit-section-quiz"
    ) {
      this.title = "Edit Quiz";
      this.disabledQuizType = true;
      api
        .getSectionQuiz(this.$route.params.sectionId)
        .then(res => {
          let data = res.data.results.find(
            i => i.id == this.$route.params.quizId
          );
          this.quiz = data;
        })
        .catch(() => {});
    }
  },
  methods: {
    saveQuiz(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let funcName =
            this.$route.name === "edit-section-quiz"
              ? "editSectionQuiz"
              : "createSectionQuiz";
          let data = Object.assign({}, this.quiz);
          api[funcName](this.$route.params.sectionId, data)
            .then(res => {
              this.$router
                .push({
                  name: "section-quiz-list",
                  query: { refresh: "true" }
                })
                .catch(() => {});
            })
            .catch(() => {});
        } else {
          this.$error(
            !this.quiz.title.length
              ? this.rules.title.message
              : !this.quiz.description.length
              ? this.rules.description.message
              : this.quiz.maxNumberOfQuestions.length != undefined
              ? this.rules.maxNumberOfQuestions.message
              : !this.quiz.quizTime
              ? this.rules.quizTime.message
              : !this.quiz.maxTest
              ? this.rules.maxTest.message
              : null
          );
          return false;
        }
      });
    },
    cancelQuiz() {
      this.$router.push({ name: "section-quiz-list" }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.buttonFooter {
  display: flex;
  justify-content: flex-end;
}
</style>
