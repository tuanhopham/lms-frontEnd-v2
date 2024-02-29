<template>
  <el-dialog
    title="Create Quesiton"
    :visible.sync="isCreateQuestion"
    :before-close="cancelQuestion"
    top="5vh"
    width="65%"
  >
    <el-form
      :model="question"
      ref="question"
      :rules="rules"
      label-position="top"
      style="height: 62vh;"
      class="scroll-modal"
    >
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
          <el-form-item prop="questionType" label="Question Type" required>
            <el-select
              placeholder="Quention Type"
              v-model="question.questionType"
              @change="changeType"
            >
              <el-option key="SCQ" value="SCQ"
                >Single Choice Question</el-option
              >
              <el-option key="MCQ" value="MCQ"
                >Multiple Choice Question</el-option
              >
              <el-option key="MAT" value="MAT">Matching</el-option>
              <el-option key="RANK" value="RANK">Ranked</el-option>
              <el-option key="TF" value="TF">True False</el-option>
              <el-option key="OE" value="OE">Open Ended</el-option>
              <el-option key="EQ" value="EQ">Essay questions</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" align="center">
          <el-form-item label="Status">
            <el-switch
              v-model="question.visible"
              active-text=""
              inactive-text=""
            />
          </el-form-item>
        </el-col>
        <el-col v-if="quizType == 'Quiz'" :span="8">
          <el-form-item prop="mark" label="mark" required>
            <el-input-number
              :min="0"
              placeholder="mark"
              v-model.number="question.mark"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="answerConditional">
          <el-form-item label="Answer" required>
            <VueEditor v-model="QAmodel" />
          </el-form-item>
        </el-col>
        <el-col v-if="question.questionType === 'TF'" :span="24">
          <el-form-item class="marginBottom floatLeft">
            <el-radio-group v-model="true_false">
              <el-radio border :label="true">True</el-radio>
              <el-radio border :label="false">False</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-checkbox
            v-if="correctConditional"
            label="IsCorrect"
            v-model="checkCorrect"
            border
          />
          <el-input
            v-if="question.questionType == 'MAT'"
            v-model="oppositeAnswer"
            class="w-50 m-2"
            placeholder="Match"
          />
          <el-input
            v-if="question.questionType == 'RANK'"
            v-model="rank"
            class="w-50 m-2"
            placeholder="Order"
          />
        </el-col>
        <el-col :span="8" v-if="answerConditional">
          <span class="marginBottom">
            <el-button
              v-if="editAnswer === false"
              type="primary"
              @click.native="addCheckAnswer"
              >Add</el-button
            >
            <el-button
              v-if="editAnswer === true"
              type="primary"
              @click.native="updateCheckAnswer"
              >Update</el-button
            >
          </span>
        </el-col>
        <el-col
          v-if="question.questionType === 'OE'"
          :span="24"
          class="marginBottom"
        >
          <el-select
            placeholder="Quention Type"
            v-model="question.problemId"
            @change="changeProblemId"
          >
            <el-option
              v-for="problem in problemsList"
              :key="problem.problemId"
              :value="problem.problemId"
            >
              {{ problem.problemId }}
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" class="marginBottom">
          <template v-if="checkRender">
            <el-table :data="question.resultList" style="width: 100%">
              <el-table-column prop="answer" label="Answer" />
              <el-table-column
                v-if="correctConditional"
                prop="isCorrect"
                label="IsCorrect"
                width="240"
                align="center"
              >
                <div slot-scope="scope">
                  <i
                    v-if="question.resultList[scope.$index].isCorrect"
                    class="el-icon-fa-check-square correctLabel"
                  ></i>
                  <i v-else class="el-icon-fa-minus-square incorrectLabel"></i>
                </div>
              </el-table-column>
              <el-table-column
                v-if="question.questionType === 'MAT'"
                prop="matchAnswer"
                label="Match to"
                width="320"
              />
              <el-table-column
                v-if="question.questionType === 'RANK'"
                prop="order"
                label="Order to"
                width="240"
                align="center"
              />
              <el-table-column fixed="right" width="200" label="Actions">
                <div slot-scope="scope">
                  <icon-btn
                    name="Edit"
                    icon="edit"
                    @click.native="editCheckAnswer(scope.$index)"
                  />
                  <icon-btn
                    name="Delete"
                    icon="trash"
                    @click.native="removeCheckAnswer(scope.$index)"
                  />
                </div>
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>
      <div class="buttonFooter"></div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click.native="cancelQuestion">Cancel</el-button>
      <el-button @click.native="saveQuestion('question')" type="primary"
        >Submit</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { VueEditor } from "vue2-editor";
import api from "../../../../../../api";

export default {
  name: "CreateQuestion",
  components: {
    VueEditor
  },
  props: {
    quizzData: {
      type: Object,
      required: true
    },
    isCreateQuestion: {
      type: Boolean
    },
    handleCloseDialog: {
      type: Function
    }
  },
  data() {
    return {
      title: "Create Question",
      question: {
        title: "",
        question: "",
        questionType: "",
        mark: 0,
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
      problemsList: [],
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
        questionType: {
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
    this.quizType = this.quizzData.quizType;
    if (this.quizType == "Survey") {
      this.question.mark = 0;
    }
    if ((this.question.resultList = "")) {
      return (this.question.resultList.length = 0);
    }
    this.getProblemsList();
  },
  computed: {
    answerConditional() {
      return (
        this.question.questionType == "SCQ" ||
        this.question.questionType == "MCQ" ||
        this.question.questionType == "RANK" ||
        this.question.questionType == "MAT"
      );
    },
    correctConditional() {
      return (
        this.question.questionType == "SCQ" ||
        this.question.questionType == "MCQ"
      );
    },
    checkRender() {
      if (
        this.question.questionType == "SCQ" ||
        this.question.questionType == "MCQ"
      ) {
        return this.correctConditional && this.question.resultList.length >= 1;
      }
      if (this.question.questionType == "MAT") {
        return (
          this.question.questionType == "MAT" &&
          this.question.resultList.length >= 1
        );
      }
      if (this.question.questionType == "RANK") {
        return (
          this.question.questionType == "RANK" &&
          this.question.resultList.length >= 1
        );
      }
    }
  },
  methods: {
    getProblemsList() {
      api["getProblemsList"]().then(res => {
        this.problemsList = res.data.data;
      });
    },
    saveQuestion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.question.mark < 0) {
            this.$error("Mark is an integer value >= 0");
            return;
          }
          if (this.question.questionType == "SCQ") {
            if (
              this.question.resultList.filter(i => i.isCorrect === true)
                .length != 1
            ) {
              this.$error("Single Choice Question only have 1 correct answer");
              return;
            }
          }
          if (this.question.questionType == "MCQ") {
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
          if (this.question.questionType == "TF") {
            this.question.resultList = this.listAnswer;
            this.listAnswer.push({
              correctAnswer: this.true_false
            });
            this.true_false = this.listAnswer[0].correctAnswer;
          }
          this.question.answerList = this.question.resultList.map(i => {
            const matchArr = this.question.resultList.map(i => {
              return {
                matchAnswer: i.matchAnswer
              };
            });
            const orderArr = this.question.resultList.map(i => {
              return {
                order: i.order
              };
            });
            switch (this.question.questionType) {
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
          let data = Object.assign({}, this.question);
          api["createQuizQuestion"](this.quizzData.id, data)
            .then(res => {
              this.handleCloseDialog("isCreateQuestion");
              this.$refs.question.resetFields();
            })
            .catch(error => {
              this.$error(
                "The quiz has reached the maximum number of questions." + error
              );
            });
        } else {
          this.$error(
            !this.question.title.length
              ? this.rules.title.message
              : !this.question.question.length
              ? this.rules.question.message
              : !this.question.questionType.length
              ? this.rules.questionType.message
              : this.question.mark.length != undefined
              ? this.rules.mark.message
              : null
          );
          return false;
        }
      });
    },
    cancelQuestion() {
      this.$refs.question.resetFields();
      this.handleCloseDialog("isCreateQuestion");
    },
    addCheckAnswer() {
      if (this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim() === "") {
        this.$error("Answer is required");
        return;
      } else {
        if (this.title == "Create Question") {
          this.question.resultList = this.listAnswer;
          if (
            this.question.resultList.filter(
              i =>
                i.answer == this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim()
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
              this.question.questionType == "SCQ" ||
              this.question.questionType == "MCQ"
            ) {
              this.listAnswer.push({
                id: newId,
                answer: this.QAmodel.replace(/<\/?[^>]+(>|$)/g, "").trim(),
                isCorrect: this.checkCorrect
              });
            }
            if (this.question.questionType == "MAT") {
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
            if (this.question.questionType == "RANK") {
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
        this.question.questionType == "SCQ" ||
        this.question.questionType == "MCQ"
      ) {
        this.checkCorrect = this.listAnswer[index].isCorrect;
      }
      if (this.question.questionType == "MAT") {
        this.oppositeAnswer = this.listAnswer[index].matchAnswer;
      }
      if (this.question.questionType == "RANK") {
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
              this.question.questionType == "SCQ" ||
              this.question.questionType == "MCQ"
            ) {
              answer.isCorrect = this.checkCorrect;
            }
            if (this.question.questionType == "MAT") {
              answer.matchAnswer = this.oppositeAnswer;
            }
            if (this.question.questionType == "RANK") {
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
  },
  watch: {
    quizzData() {
      this.quizType = this.quizzData.quizType;
      if (this.quizType == "Survey") {
        this.question.mark = 0;
      }
    }
  }
};
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";

.correctLabel {
  font-size: 20px;
  color: green;
}

.incorrectLabel {
  font-size: 20px;
  color: red;
}
</style>
