<template lang="">
<div>
    <ul v-for="(answer, index) in answerUserListResult" :key="answer.questionId">
        <li>
            <!-- Cau tra loi -->
            <div class="item-answer" :class="{ correctAnswers: answer.statusAnswer === 'success', wrongAnswers: answer.statusAnswer === 'danger', infoAnswers: answer.statusAnswer === 'info' }">
                <div class="title">
                    <h3>Question {{ index + 1 }}. {{ answer.title }}</h3>
                    <p>
                        <el-tag :type="answer.statusAnswer" size="mini">
                            {{ answer.userScore}}/{{ answer.score}}
                        </el-tag>
                    </p>
                    </p>
                    <p>
                        <el-tag :type="answer.statusAnswer" size="mini">
                            {{ answer.questionType}}
                        </el-tag>
                    </p>
                    <h4 class="question-item" v-html="answer.question"></h4>

                </div>
                <div class="flexContainer">
                    <div class="itemFlex">
                        <p>Answer</p>
                        <RadioGroup class="space" v-if="answer.questionType == 'TF'" v-model="answer.answer">
                            <Radio border :label="true" disabled :class="
                    answer.userScore > 0 && answer.answer === true
                      ? 'green'
                      : answer.userScore === 0 && answer.answer === true
                      ? 'red'
                      : ''
                  ">True</Radio>
                            <Radio border :label="false" disabled :class="
                    answer.userScore > 0 && answer.answer === false
                      ? 'green'
                      : answer.userScore === 0 && answer.answer === false
                      ? 'red'
                      : ''
                  ">False</Radio>
                        </RadioGroup>
                        <div v-if="answer.questionType == 'SCQ'">
                            <RadioGroup v-model="answer.answer" vertical>
                                <Radio class="space" style="height: auto" border disabled v-for="item in answer.resultList" :key="item.id" :label="item.answer" :class="
                      (answer.userScore > 0 && item.answer === answer.answer) ||
                      (answer.userScore == 0 &&
                        item.answer === answer.answer &&
                        !item.isCorrect)
                        ? item.isCorrect
                          ? 'green'
                          : 'red'
                        : ''
                    ">
                                    {{ item.answer }}
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div v-if="answer.questionType == 'MCQ'">
                            <div v-for="item in answer.resultList" :key="item.id" class="answerMCQ">
                                <input type="checkbox" :id="item.id" :value="item.answer" v-model="answer.answer" disabled />
                                <label :for="item.id">{{ item.answer }}</label>
                            </div>
                        </div>
                        <div v-if="answer.questionType == 'MAT'">
                            <div class="space" v-for="item in answer.answer" :key="item.id">
                                <Select v-model="answer.answer" class="m-2" :placeholder="item.value" disabled :class="
                      answer.userScore > 0 && answer.answer
                        ? 'green'
                        : answer.userScore === 0 && answer.answer
                        ? 'red'
                        : ''
                    ">
                                </Select>
                            </div>
                        </div>
                        <div v-if="answer.questionType == 'RANK'">
                            <div class="space" v-for="item in answer.answer" :key="item.id">
                                <Select v-model="answer.answer" class="m-2" :placeholder="item.value" disabled>
                                </Select>
                            </div>
                        </div>

                        <div v-if="answer.questionType == 'OE'">
                            <p v-html="answer.answer"></p>
                        </div>
                    </div>
                    <div class="itemFlex" v-if="!['success', 'info'].includes(answer.statusAnswer)">
                        <p>Đáp án đúng</p>
                        <RadioGroup class="space" v-if="answer.questionType == 'TF'" v-model="answer.resultList[0].correctAnswer">
                            <Radio border :label="true" disabled>True</Radio>
                            <Radio border :label="false" disabled>False</Radio>
                        </RadioGroup>
                        <div v-if="answer.questionType == 'SCQ'">
                            <RadioGroup v-model="
                    answer.resultList.find(i => i.isCorrect == true).answer
                  " vertical>
                                <Radio class="space" style="height: auto" border disabled v-for="item in answer.resultList" :key="item.id" :label="item.answer">
                                    {{ item.answer }}
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div v-if="answer.questionType == 'MCQ'">
                            <div v-for="item in answer.resultList" :key="item.id" class="answerMCQ">
                                <input type="checkbox" :id="item.id" :value="item.answer" v-model="item.isCorrect == true" disabled />
                                <label :for="item.id">{{ item.answer }}</label>
                            </div>
                        </div>
                        <div v-if="answer.questionType == 'MAT'">
                            <div class="space" v-for="item in answer.resultList" :key="item.id">
                                <Select class="m-2" :placeholder="item.matchAnswer" disabled>
                                </Select>
                            </div>
                        </div>
                        <div v-if="answer.questionType == 'RANK'">
                            <div class="space" v-for="item in answer.resultList" :key="item.id">
                                <Select class="m-2" :placeholder="item.order" disabled>
                                </Select>
                            </div>
                        </div>
                    </div>

                </div>
                 <!-- Nhap Diem -->
            <div class="item-score" v-if="answer.questionType == 'OE'">
                <el-row>
                    <el-col :span="7"  style="display:flex;justify-content:end" :offset="14">
                        <el-input-number :max="answer.score" :min="0" v-model="answer.userScore" @change="handleChangeUserScore($event, index)"></el-input-number>

                    </el-col>
                    <el-col :span="
                    3" style="display:flex;justify-content:center" >
                        <el-button icon="el-icon-fa-file" type="danger"  @click="handleSaveOEQuestions(answer)" >Save</el-button>
                    </el-col>
                </el-row>
            </div>
            </div>
           
        </li>
        <!-- submit -->
    </ul>
    <!-- <div class="item-submit">
        <el-button icon="el-icon-fa-check" type="success">Submit</el-button>
    </div> -->
</div>
</template>

<script>
import api from '../../api';

export default {
    name: "AnswerList",
    props: ["answerUserList"],
    data() {
        return {
            
        };
    },
    methods: {
        handleSaveOEQuestions (answer){
            api.saveScoreAnswer(answer.answerId,{ userScore :answer.userScore}).then(res => {
            }).catch(err => { console.log(err); })
        },
         handleChangeUserScore(newValue, answerIndex) {
            this.answerUserList[answerIndex].userScore = newValue;
        }
        
    },
    computed: {
        answerUserListResult() {
            let newAnswerUserList = this.answerUserList.map(data => {
                let statusAnswer = 'info' //Nếu chưa trả lời được
                if (data.userScore === data.score) statusAnswer = 'success' //Nếu user Trả lời đúng
                if (data.userScore === 0) statusAnswer = 'danger' //Nếu user Trả lời sai
                if (data.questionType === 'OE') statusAnswer = 'info' //Nếu user Trả lời sai

                return {
                    ...data,
                    statusAnswer
                }
            })
            return newAnswerUserList
        }
    }
};
</script>

<style lang="" scoped>
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

.answerMCQ>input {
    width: 17px;
    height: 17px;
    cursor: no-drop;
}

.answerMCQ>label {
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
    margin-left: 25px
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

.NullAnswers {}

.infoAnswers {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
}
</style>
