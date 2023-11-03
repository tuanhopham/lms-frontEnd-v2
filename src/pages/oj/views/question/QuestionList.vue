<template lang="">
  <div>
    <Row class="row-body">
      <Col :span="24" class="col-items">
        <Row :gutter="40">
          <Col :xs="24" :sm="12">
            <Card>
              <div class="timeContainer">
                <h4>Time remaining:</h4>
                <h4 class="timeColor">{{ timeDown }}</h4>
              </div>
            </Card>
          </Col>
          <Col :xs="24" :sm="12">
            <h3 class="col-note">*Lưu ý: Hãy save từng câu sau khi trả lời</h3>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="col-items">
        <Card class="question-list">
          <Row :gutter="16">
            <Col v-if="endCount" class="question-item" :span="24">
              <p>Đã hết thời gian</p>
            </Col>
            <Col v-if="!endCount" class="question-item" v-loading="loading"
              v-for="(question, index) in questionList.questions" :key="question.id" 
              :xs="24" :sm="12" :md="8" :lg="6">
              <p :class="{ active: question.isActive }"
                @click="getQuestionItem(question.id, index, question.questionType)">
                <i class="el-icon-check" v-if="isSaved[question.id]" style="color: green;"></i>
                Question {{ index + 1 }}
              </p>
            </Col>
            <Col
              class="question-item item-emty"
              v-if="checkQuestion === 0"
              :span="24"
            >
              <p>Danh sách câu hỏi hiện chưa có</p>
            </Col>
          </Row>
        </Card>
      </Col>
      <!-- Question item -->
    
      <Col
        :span="24"
        v-if="!endCount && questionStt && questionItem"
        class="col-question"
      >
        <Row>
          <Col :span="24" class="question-title">
            <h2>{{ questionItem.title }}</h2>
            <p v-if="questionItem.mark > 0">({{ questionItem.mark }} pts)</p>
          </Col>
          <!-- Question conttent -->
          <Col style="margin-top: 15px" v-if="questionList != ''" :span="24">
            <template>
              <div>
                <div v-loading="loading">
                  <div>
                    <h3
                      style="word-break: break-all"
                      v-html="questionItem.question"
                    ></h3>
                    <div class="typeContainer">
                      <!-- <VueEditor
                        v-if="questionItem.questionType == 'OE'"
                        v-model="typeText[questionItem.id]"
                      /> -->
                      <QuestionOE  v-if="questionItem.questionType == 'OE'"
                     :answer="typeText[questionItem.id]"
                     :questionItem = "questionItem"
                      @update:answer="updateQuestionItem"
                      @save:handleSave = "saveAnswerOE"
                      />
                      <RadioGroup
                        class="space"
                        v-if="questionItem.questionType == 'TF'"
                        v-model="typeRadio[questionItem.id]"
                      >
                        <Radio size="large" border :label="true">True</Radio>
                        <Radio size="large" border :label="false">False</Radio>
                      </RadioGroup>
                      <div v-if="questionItem.questionType == 'SCQ'">
                        <RadioGroup
                          v-model="typeListRadio[questionItem.id]"
                          vertical
                        >
                          <Radio
                            class="space"
                            style="height: auto"
                            size="large"
                            border
                            v-for="item in questionItem.answerList"
                            :key="item.id"
                            :label="item.answer"
                          >
                            {{ item.answer }}
                          </Radio>
                        </RadioGroup>
                      </div>
                      <div v-if="questionItem.questionType == 'MCQ'">
                        <div
                          v-for="item in questionItem.answerList"
                          :key="item.id"
                          class="answerMCQ"
                        >
                          <input
                            type="checkbox"
                            :id="item.id"
                            :value="item.answer"
                            v-model="typeListCheckBoxObj[questionItem.id]"
                          />
                          <label :for="item.id">{{ item.answer }}</label>
                        </div>
                      </div>
                      <div v-if="questionItem.questionType == 'MAT'">
                        <div
                          class="space"
                          v-for="item in questionItem.answerList"
                          :key="item.id"
                        >
                          <Select
                            size="large"
                            v-model="listSelectMAT[questionItem.id][item.id]"
                            class="m-2"
                            placeholder="Matching to"
                            @on-change="onChange1"
                          >
                            <Option
                              v-for="itemMAT in item.matchAnswer"
                              :key="itemMAT.id"
                              :label="itemMAT.matchAnswer"
                              :value="itemMAT.matchAnswer"
                            ></Option>
                          </Select>
                          <el-text class="space-left">{{
                            item.answer
                          }}</el-text>
                        </div>
                      </div>
                      <div v-if="questionItem.questionType == 'RANK'">
                        <div
                          class="space"
                          v-for="item in questionItem.answerList"
                          :key="item.id"
                        >
                          <Select
                            size="large"
                            v-model="listSelectRank[questionItem.id][item.id]"
                            class="m-2"
                            placeholder="Select Order"
                            @on-change="onChange2"
                          >
                            <Option
                              v-for="itemRank in item.order"
                              :key="itemRank.id"
                              :label="itemRank.order"
                              :value="itemRank.order"
                            ></Option>
                          </Select>
                          <el-text class="space-left">{{
                            item.answer
                          }}</el-text>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Question action -->
                  <Col :span="24" class="question-btn">
                    <Button
                      type="error"
                      icon="md-document"
                      class="btn"
                      v-if="shouldRenderSaveButton()"
                      @click="
                        handleSave(questionItem.id, questionItem.questionType)
                      "
                      >Save</Button
                    >
                    <Button
                      type="warning"
                      v-if="currentIndex > 0"
                      icon="ios-arrow-back"
                      @click="handlePrev()"
                      class="btn"
                      >Prev</Button
                    >
                    <Button
                      type="primary"
                      v-if="currentIndex < checkQuestion - 1"
                      class="btn"
                      icon="ios-arrow-forward"
                      @click="handleNext()"
                      >Next</Button
                    >
                    <Button
                      type="success"
                      icon="md-checkmark"
                      class="btn"
                      @click="handleSubmit(courseId, sectionId, quizId, questionList.quizUserId)"
                      >Submit</Button
                    >
                  </Col>
                </div>
              </div>
            </template>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import api from "../../api";
import { VueEditor } from "vue2-editor";
import QuestionOE from "./QuestionOE.vue";
export default {
  components: {
    VueEditor,
    QuestionOE
  },
  name: "QuestionList",
  data() {
    return {
      questionList: [],
      ishowQuestion: true,
      loading: false,
      quizId: "",
      questionStt: false,
      questionItem: [],
      currentIndex: 0,
      countTime: {
        hours: "",
        minutes: "",
        seconds: ""
      },
      submissionId:"",
      timeDown: "",
      questionCheck: [],
      data: [],
      typeRadio: {},
      typeText: {},
      typeListRadio: {},
      typeListCheckBoxObj: [],
      listSelectMAT: [],
      listSelectRank: [],
      endCount: false,
      saveCount: 0,
      checkQuestion: 0,
      courseId: null,
      isButtonClicked: false,
      isSaved: {},
      quizUserId: 0,
      sectionId: 0,
      rankQuestions: [],
      matQuestions: []
    };
  },
  mounted() {
    this.courseId = this.$route.params.coursesId;
    this.sectionId = this.$route.params.sectionId;
    this.quizId = this.$route.params.quizId;
    this.getQuestion(this.quizId);
    this.startTimer();
  },
  methods: {
    shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    getQuestion(quizId) {
      this.loading = true;
      api.getQuizQuestionList(quizId).then(res => {
        this.loading = false;
        let data = res.data;
        this.questionList = data;
        this.isSubmit = this.questionList.isSubmit;
        this.checkQuestion = data.questions.length;
        this.quizUserId = data.quizUserId;
        this.TimeField();
        this.questionList.questions.forEach(one => {
          switch (one.questionType) {
            case "MCQ":
              this.typeListCheckBoxObj[one.id] = [];
              break;
            case "MAT":
              this.listSelectMAT[one.id] = [];
              one.answerList.map(item => {
                item.matchAnswer = this.shuffleArray(item.matchAnswer);
              });
              break;
            case "RANK":
              this.listSelectRank[one.id] = [];
              one.answerList.map(item => {
                item.order = this.shuffleArray(item.order);
              });
              break;
            default:
              break;
          }
        });
        if (this.quizUserId) {
          let dataAnswerList = { quizUserId: this.quizUserId };
          api.postToGetAnswer(dataAnswerList).then(res => {
            if (res.data.answers.length > 0) {
              this.data = res.data.answers;
              const arrayId = this.data.map(i => i.questionId);
              arrayId.forEach(i => {
                this.isSaved[i] = true;
              });
              console.log("Data get from DB---", this.data);
            }
          });
        }
      });
    },
    getQuestionItem(questionId, index) {
      // save question
      this.handleSave(this.questionItem.id, this.questionItem.questionType);
      this.currentIndex = index;
      this.questionStt = true;
      // Get the question item from the question list
      this.questionItem = this.questionList.questions.filter(
        i => (i.isActive = i.id == questionId)
      )[0];
      if (this.data.some(i => i.questionId == questionId)) {
        const dataItem = this.data.find(item => item.questionId == questionId);
        // Iterate over the dataItem array and update the answer objects
        this.data.forEach(one => {
          switch (one.questionType) {
            case "TF":
              this.typeRadio[this.questionItem.id] = dataItem.answer;
              this.isSaved[this.questionItem.id] = dataItem.isSaved;
              break;
            case "OE":
              this.typeText[this.questionItem.id] = dataItem.answer;
              this.isSaved[this.questionItem.id] = dataItem.isSaved;
              break;
            case "SCQ":
              this.typeListRadio[this.questionItem.id] = dataItem.answer;
              this.isSaved[this.questionItem.id] = dataItem.isSaved;
              break;
            case "MCQ":
              this.typeListCheckBoxObj[this.questionItem.id] = dataItem.answer;
              this.isSaved[this.questionItem.id] = dataItem.isSaved;
              break;
            case "MAT":
              if (
                dataItem.questionType == "MAT" &&
                dataItem.answer.length > 0
              ) {
                dataItem.answer.map(i => {
                  this.listSelectMAT[this.questionItem.id][i.id] = i.value;
                });
                this.isSaved[this.questionItem.id] = dataItem.isSaved;
              }
              break;
            case "RANK":
              if (
                dataItem.questionType == "RANK" &&
                dataItem.answer.length > 0
              ) {
                dataItem.answer.map(i => {
                  this.listSelectRank[this.questionItem.id][i.id] = i.value;
                });
                this.isSaved[this.questionItem.id] = dataItem.isSaved;
              }
              break;
            default:
              break;
          }
        });
      }
    },
    onChange1() {
      this.$set(this.listSelectMAT, this.questionItem.id, {
        ...this.listSelectMAT[this.questionItem.id]
      });
      // Cập nhật trạng thái của câu hỏi "MAT" trong mảng matQuestions
      const matQuestion = this.matQuestions.find(q => q.questionId === this.questionItem.id);
      if (matQuestion) {
        matQuestion.renderSaveButton = Object.values(this.listSelectMAT[this.questionItem.id]).some(value => value != null);
      } else {
        this.matQuestions.push({
          questionId: this.questionItem.id,
          renderSaveButton: Object.values(this.listSelectMAT[this.questionItem.id]).some(value => value != null)
        });
      }
    },
    onChange2() {
      this.$set(this.listSelectRank, this.questionItem.id, {
        ...this.listSelectRank[this.questionItem.id]
      });
      // Cập nhật trạng thái của câu hỏi "RANK" trong mảng rankQuestions
      const rankQuestion = this.rankQuestions.find(q => q.questionId === this.questionItem.id);
      if (rankQuestion) {
        rankQuestion.renderSaveButton = Object.values(this.listSelectRank[this.questionItem.id]).some(value => value != null);
      } else {
        this.rankQuestions.push({
          questionId: this.questionItem.id,
          renderSaveButton: Object.values(this.listSelectRank[this.questionItem.id]).some(value => value != null)
        });
      }
    },
    shouldRenderSaveButton() {
      switch (this.questionItem.questionType) {
        case "TF":
          if (this.typeRadio[this.questionItem.id] == true || this.typeRadio[this.questionItem.id] == false) {
            return true;
          }
          return false;
        case "OE":
          if (this.typeText[this.questionItem.id]) {
            return true;
          }
          return false;
        case "SCQ":
          if (this.typeListRadio[this.questionItem.id]) {
            return true;
          }
          return false;
        case "MCQ":
          if (this.typeListCheckBoxObj[this.questionItem.id].length > 0) {
            return true;
          }
          return false;
        case "MAT":
          // Truy xuất đến trạng thái của câu hỏi "MAT" trong mảng matQuestions
          const matQuestion = this.matQuestions.find(q => q.questionId === this.questionItem.id);
          return matQuestion ? matQuestion.renderSaveButton : false;
        case "RANK":
          // Truy xuất đến trạng thái của câu hỏi "RANK" trong mảng rankQuestions
          const rankQuestion = this.rankQuestions.find(q => q.questionId === this.questionItem.id);
          return rankQuestion ? rankQuestion.renderSaveButton : false;
        default:
          return false;
      }
    },
    handleSave(questionId, questionType) {
      const prevData = this.data.find(data => data.questionId === questionId);
      const index = this.data.findIndex(i => i.questionId == questionId);
      if (index !== -1) {
        this.data.splice(index, 1);
      }
      let answer = null;
      switch (questionType) {
        case "TF":
          if (this.typeRadio[this.questionItem.id] != undefined) {
            answer = this.typeRadio[this.questionItem.id];
          }
          break;
        case "OE":
          if (this.typeText[this.questionItem.id] != undefined) {
            answer = this.typeText[this.questionItem.id];
          }
          break;
        case "SCQ":
          if (this.typeListRadio[this.questionItem.id] != undefined) {
            answer = this.typeListRadio[this.questionItem.id];
          }
          break;
        case "MCQ":
          if (this.typeListCheckBoxObj[this.questionItem.id].length > 0) {
            answer = this.typeListCheckBoxObj[this.questionItem.id];
          }
          break;
        case "MAT":
          if (Object.values(this.listSelectMAT[this.questionItem.id]).some(i => i)) {
            answer = Object.keys(this.listSelectMAT[this.questionItem.id]).map(key => ({
              id: key,
              value: this.listSelectMAT[this.questionItem.id][key]
            }));
          }
          break;
        case "RANK":
          if (Object.values(this.listSelectRank[this.questionItem.id]).some(i => i)) {
            answer = Object.keys(this.listSelectRank[this.questionItem.id]).map(key => ({
              id: key,
              value: this.listSelectRank[this.questionItem.id][key]
            }));
          }
          break;
        default:
          break;
      }
      if (answer === null || answer === "") {
        this.isSaved[questionId] = false;
        return;
      }
      this.data.push({
        quizUserId: this.quizUserId,
        questionId,
        questionType,
        answer,
        isSaved: (this.isSaved[this.questionItem.id] = true)
      });
      const postData = this.data.find(data => data.questionId === questionId);
      if ((JSON.stringify(prevData) !== JSON.stringify(postData)&& questionType !== 'OE') ||(questionType === 'OE'&& this.submissionId !=="")) {
        api.postSaveOneAnswer({...postData , submissionId : this.submissionId }).then(res => {
          console.log("Data push to DB---", res.data);
        });
        this.$success("Answer saved!");
        this.submissionId= ""
      }
    },
    handleNext() {
      this.isButtonClicked = true;
      this.handleSave(this.questionItem.id, this.questionItem.questionType);
      this.currentIndex++;
      this.questionStt = false;
      this.questionItem = {};
      this.getQuestionItem(
        this.questionList.questions[this.currentIndex].id,
        this.currentIndex
      );
    },
    handlePrev() {
      this.isButtonClicked = true;
      this.handleSave(this.questionItem.id, this.questionItem.questionType);
      this.currentIndex--;
      this.questionStt = false;
      this.questionItem = {};
      this.getQuestionItem(
        this.questionList.questions[this.currentIndex].id,
        this.currentIndex
      );
    },
    async handleSubmit(courseId, sectionId, quizId, quizUserId) {
      this.$Modal.confirm({
        title: " ",
        content:
          "<div>\
        <p class='alert-text'>Your test will be submitted. You cannot continue.</p>\
        <p class='alert-text'>Are you sure you want to finish your test?</p>\
      </div>",
        onOk: async () => {
          await this.handleSave(this.questionItem.id, this.questionItem.questionType);
          try {
            const res = await api.pushSubmitQuiz(courseId, sectionId, quizId, quizUserId);
            this.isSubmit = res.data.isSubmit;
            this.TimeField(this.isSubmit);
            this.$success("Bạn đã nạp bài thành công")
            this.$router.push({ name: "quiz-detail-user", params: { sectionId: sectionId, quizId: quizId } });
          } catch (error) {
            this.$error("Can't push!");
          }
        },
        onCancel: () => { }
      });
    },
    TimeField() {
      const [hours, minutes, seconds] = this.questionList.quizTime.split(":").map(Number);
      if (this.isSubmit == false || new Date < new Date(this.questionList.timeEnd)) {
        var timeToAdd = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
      } else if (this.isSubmit == true || new Date > new Date(this.questionList.timeEnd)) {
        var timeToAdd = 0;
      }
      const timeRemaining = timeToAdd - (new Date() - new Date(this.questionList.timeStart));
      const pad = (value) => String(value).padStart(2, "0");
      this.countTime.hours = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));
      this.countTime.minutes = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
      this.countTime.seconds = Math.max(0, Math.floor((timeRemaining % (1000 * 60)) / 1000));
      this.timeDown = `${pad(this.countTime.hours)}:${pad(this.countTime.minutes)}:${pad(this.countTime.seconds)}`;
    },
    startTimer() {
      this.interval = setInterval(() => {
        if (
          this.countTime.hours === 0 &&
          this.countTime.minutes === 0 &&
          this.countTime.seconds === 0
        ) {
          // this.$Message.warning("Đã hết thời gian");
          // this.handleSubmit();
          this.endCount = true;
          clearInterval(this.interval);
        } else {
          if (this.countTime.seconds === 0) {
            if (this.countTime.minutes === 0) {
              this.countTime.hours--;
              this.countTime.minutes = 59;
            } else {
              this.countTime.minutes--;
            }
            this.countTime.seconds = 59;
          } else {
            this.countTime.seconds--;
          }
        }
        const pad = value => String(value).padStart(2, "0");
        this.timeDown = `${pad(this.countTime.hours)}:${pad(
          this.countTime.minutes
        )}:${pad(this.countTime.seconds)}`;
      }, 1000);
    },
    updateQuestionItem(updatedItem) {
      this.typeText[this.questionItem.id] = updatedItem;
    },
    saveAnswerOE(submissionId, questionItem) {
      this.submissionId = submissionId;
      this.handleSave(questionItem.id, questionItem.questionType);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="">
@import "~vue2-editor/dist/vue2-editor.css";

.space {
  margin: 15px;
  white-space: normal;
}
.question-list {
  padding: 0 10px;
}
.question-item {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.question-item p {
  font-size: 16px;
  font-weight: 400;
  color: #337ab7;
}
.question-item p:hover {
  color: #000;
  cursor: pointer;
}
.row-body {
  padding: 10px;
}
.col-items {
  margin: 5px 0;
}
.timeContainer {
  display: flex;
  justify-content: center;
  padding: 5px;
  align-items: center;
}
.timeColor {
  margin-left: 5px;
  color: red;
}
.timeContainer:hover {
  cursor: pointer;
}
.col-note {
  color: #a94442;
}
.col-score {
  padding: 5px;
}
.col-question {
  margin: 10px 10px;
}
.question-title {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.question-title p {
  font-size: 16px;
}
.item-emty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.question-btn {
  display: flex;
  justify-content: right;
}
.question-btn .btn {
  margin-right: 10px;
}
.question-item p.active {
  color: red;
}
/* alert */
.ivu-modal {
  top: 200px;
}
.ivu-modal-confirm-body {
  padding-left: 0;
}
.ivu-modal-body,
.ivu-modal-confirm {
  padding: 10px;
}
.alert-text {
  font-weight: bold;
  display: flex;
  justify-content: center;
  padding: 5px;
}
.ivu-modal-confirm-head {
  padding: 10px;
}
.ivu-modal-confirm-head-icon-confirm {
  display: flex;
  justify-content: center;
  font-size: 60px;
}
.ivu-modal-confirm-footer {
  padding-top: 10px;
}
/* */
.answerMCQ {
  margin: 15px;
  display: flex;
  column-gap: 5px;
  align-items: center;
}
.answerMCQ > input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.answerMCQ > label {
  font-size: 16px;
  color: black;
  cursor: pointer;
}
.typeContainer {
  padding: 10px;
}
.m-2 {
  width: 200px;
}
.space-left {
  margin-left: 5px;
  font-size: 16px;
}
</style>
