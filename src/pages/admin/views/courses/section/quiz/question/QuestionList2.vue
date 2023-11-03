<template>
<div class="collapse-table">
    <el-table :header-cell-style="{ background: '#EEF1F8', color: '#7A8189'}" size="mini" v-loading="loading" element-loading-text="loading" :data="questionList" ref="table" style="width: 100%">
        <el-table-column prop="title" label="Question" />
        <el-table-column prop="questionType" label="Question Type" width="140" align="center">
            <template slot-scope="scope">
                <el-tag :type="info">
                    {{ scope.row.questionType }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column v-if="quiz_type == 'Quiz'" prop="mark" label="Question Mark" width="140" align="center" />
        <el-table-column prop="visible" width="100" label="Visible" align="center">
            <template slot-scope="scope">
                <el-switch style="cursor:pointer;" width="30" v-model="scope.row.visible" active-text="" inactive-text="" @change="handleVisibleSwitch(scope.row)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column width="160" label="Operation">
            <div slot-scope="scope">
                <icon-btn name="Edit" icon="edit" @click.native="handleOpenEditQuestionDialog(scope.row)" />
                <icon-btn name="Delete" icon="trash" @click.native="deleteQuestion(scope.row.id)" />
            </div>
        </el-table-column>
    </el-table>
    <EditQuestion :problemsList="problemsList" :questionData="question" :quizId="quizId" :isEditQuestion="isEditQuestion" :handleCloseDialog="handleCloseDialog" />

</div>
</template>

<script>
import api from "../../../../../api.js";
import EditQuestion from "./action/EditQuestion.vue"
export default {
    name: 'QuestionList2',
    components: {
        EditQuestion
    },
    props: {
        quizId: {
            type: Number,
            required: true
        },
        isCreateQuestion: {
            type: Boolean,
        }
    },
    data() {
        return {
            questionList: [],
            question: {},
            isEditQuestion: false,
            problemsList:[],
        };
    },
    mounted() {
        this.getQuestionList();
        this.getProblemsList();
    },
    watch: {
        'isCreateQuestion'(val) {
            if (val == false) {
                this.getQuestionList();
            }
        },
        'isEditQuestion'(val) {
            if (val == false) {
                this.getQuestionList();
            }
        }
    },
    methods: {
        getQuestionList() {
            api["getQuizQuestionList"](this.quizId, {}).then(
                res => {
                    this.questionList = res.data.results;
                },
            );

        },
        getProblemsList() {
            api["getProblemsList"]().then(
                res => {
                    this.problemsList = res.data.data;
                }
            )
        },
        handleCloseDialog(name) {
            this[name] = false;
        },
        handleVisibleSwitch(row) {
            api.editQuizQuestion(this.quizId, row);
        },
        handleOpenEditQuestionDialog(question) {
            this.question = question
            this.isEditQuestion = true
        },
        deleteQuestion(id) {
            this.$confirm("Sure to delete this problem? The associated submissions will be deleted as well.",
                    "Delete Question", {
                        type: "warning"
                    })
                .then(() => {
                    api["deleteQuizQuestion"](this.quizId, id).then(() => {
                        this.questionList = this.questionList.filter(question => question.id !== id);
                    }).catch((error) => {
                        this.$error(error);
                    })

                })

        },
    },
};
</script>

<style scoped>
.SSbottom {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.btn-action {
    display: flex;
}

.p-0 {
    padding: 0;
}

.view {
    border-radius: 4px;
    overflow: hidden;
}
</style>
