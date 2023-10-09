<template>
  <div class="view">
    <Panel :title="title">
      <el-form :model="question" ref="question" :rules="rules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="title" label="Title" required>
              <el-input placeholder="Title" v-model="question.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="question" label="Question" required>
              <VueEditor v-model="question.question" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="question_type" label="Question Type" required>
              <el-select placeholder="Quention Type" v-model="question.question_type" @change="changeType">
                <el-option key="SCQ" value="SCQ">Single Choice Question</el-option>
                <el-option key="MCQ" value="MCQ">Multiple Choice Question</el-option>
                <el-option key="MAT" value="MAT">Matching</el-option>
                <el-option key="RANK" value="RANK">Ranked</el-option>
                <el-option key="TF" value="TF">True False</el-option>
                <el-option key="OE" value="OE">Open Ended</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" align="center">
            <el-form-item label="Status">
              <el-switch v-model="question.visible" active-text="" inactive-text="" />
            </el-form-item>
          </el-col>
          <el-col v-if="quizType == 'Quiz'" :span="8">
            <el-form-item prop="mark" label="Mark" required>
              <el-input placeholder="Mark" v-model.number="question.mark" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="answerConditional">
            <el-form-item label="Answer" required>
              <VueEditor v-model="QAmodel" />
            </el-form-item>
          </el-col>
          <el-col v-if="question.question_type === 'TF'" :span="24">
            <el-form-item class="marginBottom floatLeft">
              <el-radio-group v-model="true_false">
                <el-radio border :label="true">True</el-radio>
                <el-radio border :label="false">False</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-checkbox v-if="correctConditional" label="IsCorrect" v-model="checkCorrect" border />
            <el-input v-if="question.question_type == 'MAT'" v-model="oppositeAnswer" class="w-50 m-2"
              placeholder="Match" />
            <el-input v-if="question.question_type == 'RANK'" v-model="rank" class="w-50 m-2" placeholder="Order" />
          </el-col>
          <el-col :span="8" v-if="answerConditional">
            <div class="marginBottom">
              <el-button v-if="editAnswer === false" type="primary" @click.native="addCheckAnswer">Add</el-button>
              <el-button v-if="editAnswer === true" type="primary" @click.native="updateCheckAnswer">Update</el-button>
            </div>
          </el-col>
          <el-col :span="24" class="marginBottom">
            <template v-if="checkRender">
              <el-table :data="question.resultList" style="width: 100%">
                <el-table-column prop="answer" label="Answer" />
                <el-table-column v-if="correctConditional" prop="isCorrect" label="IsCorrect" width="240" align="center">
                  <div slot-scope="scope">
                    <i v-if="question.resultList[scope.$index].isCorrect"
                      class="el-icon-fa-check-square correctLabel"></i>
                    <i v-else class="el-icon-fa-minus-square incorrectLabel"></i>
                  </div>
                </el-table-column>
                <el-table-column v-if="question.question_type === 'MAT'" prop="matchAnswer" label="Match to"
                  width="320" />
                <el-table-column v-if="question.question_type === 'RANK'" prop="order" label="Order to" width="240"
                  align="center" />
                <el-table-column fixed="right" width="200" label="Actions">
                  <div slot-scope="scope">
                    <icon-btn name="Edit" icon="edit" @click.native="editCheckAnswer(scope.$index)" />
                    <icon-btn name="Delete" icon="trash" @click.native="removeCheckAnswer(scope.$index)" />
                  </div>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>

        <div class="buttonFooter">
          <cancel @click.native="cancelQuestion" />
          <save @click.native="saveQuestion('question')" />
        </div>
      </el-form>
    </Panel>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import api from "../../api.js";

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      title: "Create Question",
      question: {
        title: "",
        question: "",
        question_type: "",
        mark: "",
        resultList: [
          {
            answer: "",
            isCorrect: false,
            order: "",
            matchAnswer: ""
          }
        ],
        answerList: [],
        visible: true
      },
      true_false: false,
      editAnswer: false,
      listAnswer: [],
      incId: 1,
      QAmodel: "",
      checkCorrect: false,
      oppositeAnswer: "",
      rank: "",
      quizType: "",
      rules: {
        title: {
          required: true,
          message: "Title is required",
          trigger: "blur"
        },
        question: {
          required: true,
          message: "Question is required",
          trigger: "change"
        },
        question_type: {
          required: true,
          message: "Question type is required",
          trigger: "change"
        },
        mark: {
          required: true,
          message: "Mark is a valid integer value",
          trigger: "change"
        }
      }
    };
  },
  mounted() {
    this.quizType = this.$route.params.quiz_type;
    if (this.quizType == "Survey") {
      this.question.mark = 0;
    }
    if (
      this.$route.name === "edit-question" ||
      this.$route.name === "edit-quiz-question"
    ) {
      this.title = "Edit Question";
      this.quizType = this.$route.params.quiz_type;
      api
        .getQuizQuestion(this.$route.params.quizId)
        .then(res => {
          if (
            res.data.find(
              i =>
                i.id == this.$route.params.questionId && i.question_type == "TF"
            )
          ) {
            this.true_false = res.data.find(
              i =>
                i.id == this.$route.params.questionId && i.question_type == "TF"
            ).resultList[0].correctAnswer;
          }
          let data = res.data.find(i => i.id == this.$route.params.questionId);
          this.question = data;
        })
        .catch(() => { });
    }
    if ((this.question.resultList = "")) {
      return (this.question.resultList.length = 0);
    }
  },
  computed: {
    answerConditional() {
      return (
        this.question.question_type == "SCQ" ||
        this.question.question_type == "MCQ" ||
        this.question.question_type == "RANK" ||
        this.question.question_type == "MAT"
      );
    },
    correctConditional() {
      return (
        this.question.question_type == "SCQ" ||
        this.question.question_type == "MCQ"
      );
    },
    checkRender() {
      if (
        this.question.question_type == "SCQ" ||
        this.question.question_type == "MCQ"
      ) {
        return this.correctConditional && this.question.resultList.length >= 1;
      }
      if (this.question.question_type == "MAT") {
        return (
          this.question.question_type == "MAT" &&
          this.question.resultList.length >= 1
        );
      }
      if (this.question.question_type == "RANK") {
        return (
          this.question.question_type == "RANK" &&
          this.question.resultList.length >= 1
        );
      }
    }
  },
  methods: {
    saveQuestion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.question.mark < 0) {
            this.$error("Mark is an integer value >= 0");
            return;
          }
          if (this.question.question_type == "SCQ") {
            if (
              this.question.resultList.filter(i => i.isCorrect === true)
                .length != 1
            ) {
              this.$error("Single Choice Question only have 1 correct answer");
              return;
            }
          }
          if (this.question.question_type == "MCQ") {
            if (
              this.question.resultList.filter(i => i.isCorrect === true)
                .length < 1
            ) {
              this.$error(
                "Multiple Choice Question have at least 1 correct answer"
              );
              return;
            }
          }
          if (this.question.question_type == "TF") {
            this.question.resultList = this.listAnswer;
            this.listAnswer.push({
              correctAnswer: this.true_false
            });
            this.true_false = this.listAnswer[0].correctAnswer;
          }
          this.question.answerList = this.question.resultList.map(i => {
            const matchArr = this.question.resultList.map(i => {
              return { matchAnswer: i.matchAnswer };
            });
            const orderArr = this.question.resultList.map(i => {
              return { order: i.order };
            });
            switch (this.question.question_type) {
              case "SCQ":
                return {
                  id: i.id,
                  answer: i.answer
                };
              case "MCQ":
                return {
                  id: i.id,
                  answer: i.answer
                };
              case "MAT":
                return {
                  id: i.id,
                  answer: i.answer,
                  matchAnswer: matchArr
                };
              case "RANK":
                return {
                  id: i.id,
                  answer: i.answer,
                  order: orderArr
                };
            }
          });
          let funcName =
            this.$route.name === "edit-quiz-question"
              ? "editQuizQuestion"
              : "createQuizQuestion";
          let data = Object.assign({}, this.question);
          api[funcName](this.$route.params.quizId, data)
            .then(res => {
              this.$router
                .push({
                  name: "quiz-question-list",
                  query: { refresh: "true" }
                })
                .catch(() => { });
            })
            .catch((error) => {
              this.$error("Can't add! Question has reached the maximum number");
            });
        } else {
          this.$error(
            !this.question.title.length
              ? this.rules.title.message
              : !this.question.question.length
                ? this.rules.question.message
                : !this.question.question_type.length
                  ? this.rules.question_type.message
                  : this.question.mark.length != undefined
                    ? this.rules.mark.message
                    : null
          );
          return false;
        }
      });
    },
    cancelQuestion() {
      this.$router.push({ name: "quiz-question-list" }).catch(() => { });
    },
    addCheckAnswer() {
      if (this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim() === "") {
        this.$error("Answer is required");
        return;
      } else {
        if (this.title == "Edit Question") {
          api.getQuizQuestion(this.$route.params.quizId).then(res => {
            let data = res.data.find(i => i.id == this.$route.params.questionId);
            this.question.resultList = data.resultList;
            const lastId = this.question.resultList.length ? this.question.resultList[this.question.resultList.length - 1].id : 0;
            const newId = lastId + 1;
            if (
              this.question.resultList.filter(
                i => i.answer == this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim()
              ).length >= 1
            ) {
              this.QAmodel = "";
              this.checkCorrect = false;
              this.oppositeAnswer = "";
              this.rank = "";
              this.$error("Answer can not be duplicated");
              return;
            }
            if (this.question.question_type == "SCQ" || this.question.question_type == "MCQ") {
              this.question.resultList.push({
                id: newId,
                answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                isCorrect: this.checkCorrect
              });
            }
            if (this.question.question_type == "MAT") {
              if (this.oppositeAnswer.trim() == "") {
                this.oppositeAnswer = "";
                this.$error("Match is required");
                return;
              } else {
                if (this.question.resultList.filter(i => i.matchAnswer == this.oppositeAnswer.trim()).length >= 1) {
                  this.$error("Match answer can not be duplicated");
                  return;
                } else {
                  this.question.resultList.push({
                    id: newId,
                    answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                    matchAnswer: this.oppositeAnswer.trim()
                  });
                }
              }
            }
            if (this.question.question_type == "RANK") {
              if (this.rank.trim() == "") {
                this.rank = "";
                this.$error("Order is required");
                return;
              } else if (!isNaN(this.rank.trim() / 1) === false) {
                this.rank = "";
                this.$error("Order must be a number value");
                return;
              } else if (this.rank.trim() / 1 <= 0) {
                this.rank = "";
                this.$error("Order must be a number value > 0");
                return;
              } else {
                if (this.question.resultList.filter(i => i.order == this.rank.trim()).length >= 1) {
                  this.$error("Order answer can not be duplicated");
                  return;
                } else {
                  this.question.resultList.push({
                    id: newId,
                    answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                    order: this.rank.trim()
                  });
                }
              }
            }
            this.QAmodel = "";
            this.checkCorrect = false;
            this.oppositeAnswer = "";
            this.rank = "";
          });
        }
        else if (this.title == "Create Question") {
          this.question.resultList = this.listAnswer;
          if (
            this.question.resultList.filter(
              i => i.answer == this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim()
            ).length >= 1
          ) {
            this.QAmodel = "";
            this.checkCorrect = false;
            this.oppositeAnswer = "";
            this.rank = "";
            this.$error("Answer can not be duplicated");
            return;
          } else {
            const lastId = this.listAnswer.length
              ? this.listAnswer[this.listAnswer.length - 1].id
              : 0;
            const newId = lastId + 1;
            if (
              this.question.question_type == "SCQ" ||
              this.question.question_type == "MCQ"
            ) {
              this.listAnswer.push({
                id: newId,
                answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                isCorrect: this.checkCorrect
              });
            }
            if (this.question.question_type == "MAT") {
              if (this.oppositeAnswer.trim() == "") {
                this.oppositeAnswer = "";
                this.$error("Match is required");
                return;
              } else {
                if (
                  this.question.resultList.filter(
                    i => i.matchAnswer == this.oppositeAnswer.trim()
                  ).length >= 1
                ) {
                  this.$error("Match answer can not be duplicated");
                  return;
                } else {
                  this.listAnswer.push({
                    id: newId,
                    answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                    matchAnswer: this.oppositeAnswer.trim()
                  });
                }
              }
            }
            if (this.question.question_type == "RANK") {
              if (this.rank.trim() == "") {
                this.rank = "";
                this.$error("Order is required");
                return;
              } else if (!isNaN(this.rank.trim() / 1) === false) {
                this.rank = "";
                this.$error("Order must be a number value");
                return;
              } else if (this.rank.trim() / 1 <= 0) {
                this.rank = "";
                this.$error("Order must be a number value > 0");
                return;
              } else {
                if (
                  this.question.resultList.filter(
                    i => i.order == this.rank.trim()
                  ).length >= 1
                ) {
                  this.$error("Order answer can not be duplicated");
                  return;
                } else {
                  this.listAnswer.push({
                    id: newId,
                    answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                    order: this.rank.trim()
                  });
                }
              }
            }
            this.QAmodel = "";
            this.checkCorrect = false;
            this.oppositeAnswer = "";
            this.rank = "";
          }
        }
      }
    },
    removeCheckAnswer(index) {
      this.question.resultList.splice(index, 1);
      this.checkCorrect = false;
      this.oppositeAnswer = "";
      this.rank = "";
      this.editAnswer = false;
      this.QAmodel = "";
    },
    editCheckAnswer(index) {
      this.editAnswer = true;
      this.listAnswer = this.question.resultList;
      this.incId = index;
      this.QAmodel = this.listAnswer[index].answer;
      if (
        this.question.question_type == "SCQ" ||
        this.question.question_type == "MCQ"
      ) {
        this.checkCorrect = this.listAnswer[index].isCorrect;
      }
      if (this.question.question_type == "MAT") {
        this.oppositeAnswer = this.listAnswer[index].matchAnswer;
      }
      if (this.question.question_type == "RANK") {
        this.rank = this.listAnswer[index].order;
      }
    },
    updateCheckAnswer() {
      const inputAnswer = this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim();
      const inputMatch = this.oppositeAnswer.trim();
      const inputOrder = this.rank.trim();
      const isDuplicateAnswer = this.question.resultList.find(
        one =>
          one.answer == inputAnswer &&
          this.incId !== this.question.resultList.indexOf(one)
      );
      const isDuplicateMatch = this.question.resultList.find(
        one =>
          one.matchAnswer == inputMatch &&
          this.incId !== this.question.resultList.indexOf(one)
      );
      const isDuplicateOrder = this.question.resultList.find(
        one =>
          one.order == inputOrder &&
          this.incId !== this.question.resultList.indexOf(one)
      );
      if (isDuplicateAnswer) {
        this.$error("Answer can not be duplicated");
        this.checkCorrect = false;
        this.oppositeAnswer = "";
        this.rank = "";
        this.editAnswer = false;
        this.QAmodel = "";
        this.incId = null;
        return false;
      } else if (isDuplicateMatch) {
        this.$error("Match answer can not be duplicated");
        this.checkCorrect = false;
        this.oppositeAnswer = "";
        this.rank = "";
        this.editAnswer = false;
        this.QAmodel = "";
        this.incId = null;
        return false;
      } else if (isDuplicateOrder) {
        this.$error("Order answer can not be duplicated");
        this.checkCorrect = false;
        this.oppositeAnswer = "";
        this.rank = "";
        this.editAnswer = false;
        this.QAmodel = "";
        this.incId = null;
        return false;
      } else {
        this.question.resultList.map((answer, idx) => {
          if (idx === this.incId && !isDuplicateAnswer) {
            answer.answer = inputAnswer;
            if (
              this.question.question_type == "SCQ" ||
              this.question.question_type == "MCQ"
            ) {
              answer.isCorrect = this.checkCorrect;
            }
            if (this.question.question_type == "MAT") {
              answer.matchAnswer = this.oppositeAnswer;
            }
            if (this.question.question_type == "RANK") {
              answer.order = this.rank;
            }
          }
        });
        this.checkCorrect = false;
        this.oppositeAnswer = "";
        this.rank = "";
        this.listAnswer = this.question.resultList;
        this.editAnswer = false;
        this.QAmodel = "";
        this.incId = null;
      }
    },
    changeType() {
      this.question.resultList = [];
      this.question.answerList = [];
      this.listAnswer = [];
      this.incId = 1;
    }
  }
};
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";

.buttonFooter {
  display: flex;
  justify-content: flex-end;
}

.marginBottom {
  margin-bottom: 22px;
}

.floatLeft {
  float: left;
}

.correctLabel {
  font-size: 20px;
  color: green;
}

.incorrectLabel {
  font-size: 20px;
  color: red;
}
</style>
