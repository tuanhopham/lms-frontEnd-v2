<template lang="">
  <div>
    <ul
      v-for="(answer, index) in answerUserListResult"
      :key="answer.questionId"
    >
      <li>
        <!-- Cau tra loi -->
        <div
          class="item-answer"
          :class="{
            correctAnswers: answer.statusAnswer === 'success',
            wrongAnswers: answer.statusAnswer === 'danger',
            infoAnswers: answer.statusAnswer === 'info',
            warningAnswers: answer.statusAnswer === 'warning'
          }"
        >
          <div class="title">
            <div class="title-left">
              <h3>Question {{ index + 1 }}. {{ answer.title }}</h3>
              <p>
                <el-tag :type="answer.statusAnswer" size="mini">
                  {{ answer.userScore }}/{{ answer.score }}
                </el-tag>
              </p>
              <p>
                <el-tag :type="answer.statusAnswer" size="mini">
                  {{ answer.questionType }}
                </el-tag>
              </p>
              <h4 class="question-item" v-html="answer.question"></h4>
            </div>

            <div v-if="answer.questionType == 'EQ'" class="markQuestion">
              <span class="demo-input-label">Mark:</span>
              <el-input-number
                size="small"
                placeholder="Mark"
                v-model.number="markQuestion[answer.answerId]"
                :min="0"
                :max="answer.score"
              ></el-input-number>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-check"
                :disabled="markQuestion[answer.answerId] === undefined"
                @click="handleSaveOEQuestions(answer)"
              ></el-button>
            </div>
          </div>
          <div class="flexContainer">
            <div
              class="itemFlex"
              :style="answer.questionType == 'EQ' ? 'min-width: 600px' : ''"
            >
              <p>Answer</p>
              <RadioGroup
                class="space"
                v-if="answer.questionType == 'TF'"
                v-model="answer.answer"
              >
                <Radio
                  border
                  :label="true"
                  disabled
                  :class="
                    answer.userScore > 0 && answer.answer === true
                      ? 'green'
                      : answer.userScore === 0 && answer.answer === true
                      ? 'red'
                      : ''
                  "
                  >True
                </Radio>
                <Radio
                  border
                  :label="false"
                  disabled
                  :class="
                    answer.userScore > 0 && answer.answer === false
                      ? 'green'
                      : answer.userScore === 0 && answer.answer === false
                      ? 'red'
                      : ''
                  "
                  >False
                </Radio>
              </RadioGroup>
              <div v-if="answer.questionType == 'SCQ'">
                <RadioGroup v-model="answer.answer" vertical>
                  <Radio
                    class="space"
                    style="height: auto"
                    border
                    disabled
                    v-for="item in answer.resultList"
                    :key="item.id"
                    :label="item.answer"
                    :class="
                      (answer.userScore > 0 && item.answer === answer.answer) ||
                      (answer.userScore == 0 &&
                        item.answer === answer.answer &&
                        !item.isCorrect)
                        ? item.isCorrect
                          ? 'green'
                          : 'red'
                        : ''
                    "
                  >
                    {{ item.answer }}
                  </Radio>
                </RadioGroup>
              </div>
              <div v-if="answer.questionType == 'MCQ'">
                <div
                  v-for="item in answer.resultList"
                  :key="item.id"
                  class="answerMCQ"
                >
                  <input
                    type="checkbox"
                    :id="item.id"
                    :value="item.answer"
                    v-model="answer.answer"
                    disabled
                  />
                  <label :for="item.id">{{ item.answer }}</label>
                </div>
              </div>
              <div v-if="answer.questionType == 'MAT'">
                <div class="space" v-for="item in answer.answer" :key="item.id">
                  <Select
                    v-model="answer.answer"
                    class="m-2"
                    :placeholder="item.value"
                    disabled
                    :class="
                      answer.userScore > 0 && answer.answer
                        ? 'green'
                        : answer.userScore === 0 && answer.answer
                        ? 'red'
                        : ''
                    "
                  >
                  </Select>
                </div>
              </div>

              <div v-if="answer.questionType == 'RANK'">
                <div class="space" v-for="item in answer.answer" :key="item.id">
                  <Select
                    v-model="answer.answer"
                    class="m-2"
                    :placeholder="item.value"
                    disabled
                  >
                  </Select>
                </div>
              </div>

              <div v-if="answer.questionType == 'OE'">
                <p>language:{{ answer.answer.language }}</p>
                <div class="code-box">
                  <p>{{ answer.answer.code }}</p>
                </div>
              </div>

              <div v-if="answer.questionType == 'EQ'">
                <el-card class="box-card space">
                  <div class="text item">
                    {{ answer.answer }}
                  </div>
                </el-card>
              </div>
            </div>

            <div
              class="itemFlex"
              v-if="
                !['success', 'info', 'warning'].includes(answer.statusAnswer)
              "
            >
              <p>Đáp án đúng</p>
              <RadioGroup
                class="space"
                v-if="answer.questionType == 'TF'"
                v-model="answer.resultList[0].correctAnswer"
              >
                <Radio border :label="true" disabled>True</Radio>
                <Radio border :label="false" disabled>False</Radio>
              </RadioGroup>
              <div v-if="answer.questionType == 'SCQ'">
                <RadioGroup
                  v-model="
                    answer.resultList.find(i => i.isCorrect == true).answer
                  "
                  vertical
                >
                  <Radio
                    class="space"
                    style="height: auto"
                    border
                    disabled
                    v-for="item in answer.resultList"
                    :key="item.id"
                    :label="item.answer"
                  >
                    {{ item.answer }}
                  </Radio>
                </RadioGroup>
              </div>
              <div v-if="answer.questionType == 'MCQ'">
                <div
                  v-for="item in answer.resultList"
                  :key="item.id"
                  class="answerMCQ"
                >
                  <input
                    type="checkbox"
                    :id="item.id"
                    :value="item.answer"
                    v-model="item.isCorrect == true"
                    disabled
                  />
                  <label :for="item.id">{{ item.answer }}</label>
                </div>
              </div>
              <div v-if="answer.questionType == 'MAT'">
                <div
                  class="space"
                  v-for="item in answer.resultList"
                  :key="item.id"
                >
                  <Select class="m-2" :placeholder="item.matchAnswer" disabled>
                  </Select>
                </div>
              </div>
              <div v-if="answer.questionType == 'RANK'">
                <div
                  class="space"
                  v-for="item in answer.resultList"
                  :key="item.id"
                >
                  <Select class="m-2" :placeholder="item.order" disabled>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../../api";
import CodeMirror from "../../components/CodeMirror.vue";

export default {
  name: "AnswerList",
  props: ["answerUserList"],
  components: {
    CodeMirror
  },
  data() {
    return {
      markQuestion: {}
    };
  },
  methods: {
    handleSaveOEQuestions(answer) {
      api
        .saveScoreAnswer(answer.answerId, {
          userScore: this.markQuestion[answer.answerId]
        })
        .then(res => {
          this.handleChangeUserScore(
            this.markQuestion[answer.answerId],
            answer.answerId
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleChangeUserScore(newValue, answerId) {
      const index = this.answerUserList.findIndex(i => i.answerId === answerId);
      if (index !== -1) {
        this.$set(this.answerUserList, index, {
          ...this.answerUserList[index],
          userScore: newValue
        });
      }
    }
  },
  computed: {
    answerUserListResult() {
      let newAnswerUserList = this.answerUserList.map(data => {
        let statusAnswer = "info"; //Nếu chưa trả lời được
        if (data.userScore === data.score) statusAnswer = "success"; //Nếu user Trả lời đúng
        if (data.userScore === 0) statusAnswer = "danger"; //Nếu user Trả lời sai
        if (data.questionType === "OE") statusAnswer = "info"; //Nếu user Trả lời sai
        if (data.questionType === "EQ") {
          statusAnswer = "warning";
          this.markQuestion = {
            ...this.markQuestion,
            [data.answerId]: data.userScore
          };
        }

        return {
          ...data,
          statusAnswer
        };
      });
      return newAnswerUserList;
    }
  }
};
</script>

<style lang="" scoped>
.code-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  background-color: #f9f9f9;
  margin: 20px 0;
}

.space {
  margin: 15px;
  white-space: normal;
}

ul {
  list-style: none;
  margin-bottom: 20px;
}

.answerMCQ {
  margin: 15px;
  display: flex;
  column-gap: 5px;
  align-items: center;
}

.answerMCQ > input {
  width: 17px;
  height: 17px;
  cursor: no-drop;
}

.answerMCQ > label {
  font-size: 15px;
  color: black;
  cursor: no-drop;
}

.itemFlex {
  min-width: 300px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-left {
  display: flex;
}

.title p {
  margin-left: 5px;
}

.question-item {
  margin-left: 25px;
  font-weight: 500;
  max-width: 75%;
}

.item-score {
  margin-top: 20px;
}

.item-submit {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}

.flexContainer {
  display: flex;
  margin-left: 25px;
}

.green {
  color: green;
  border-color: green !important;
}

.red {
  color: red;
  border-color: red !important;
}

.item-answer {
  padding: 12px;
  border-radius: 5px;
}

.correctAnswers {
  background-color: #f4ffee;
  border: 1px solid #67c23a;
}

.wrongAnswers {
  background-color: #fff8f6;
  border: 1px solid #ffab96;
}

.NullAnswers {
}

.infoAnswers {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}
.warningAnswers {
  background-color: #fff7d8;
  border: 1px solid #ffe58f;
}

.markQuestion {
}
</style>
