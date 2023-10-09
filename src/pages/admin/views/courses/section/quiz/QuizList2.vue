<template>
<div class="collapse-quiz collapse-table">
    <div class="title-header">
        <el-row class="w-100">
            <el-col :span="8">Quizz</el-col>
            <el-col :span="4"> Max question</el-col>
            <el-col :span="4">Time</el-col>
            <el-col :span="4">Max test</el-col>
            <el-col style="text-align: end;" :span="4">Action</el-col>
        </el-row>

    </div>
    <el-collapse v-model="activeCollapse">
        <el-collapse-item v-for="(quizze, index) in this.quizzsList" :key="quizze.id" :title="quizze.title">
            <template slot="title">
                <div class="title-content w-96">
                    <el-row class="w-100">
                        <el-col :span="7">{{quizze.title}}</el-col>
                        <el-col style="text-align: center;" :span="3"> {{quizze.maxNumberOfQuestions}}</el-col>
                        <el-col style="text-align: center;" :span="4">{{ quizze.quizTime }}</el-col>
                        <el-col style="text-align: center;" :span="4">{{quizze.maxTest}}</el-col>
                        <el-col style="text-align: center;opacity:0" :span="4"> s</el-col>
                        <el-col style="text-align: end;" :span="1">

                            <div @click.stop="">
                                <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleOpenEditQuizzDialog(quizze)"><i class="el-icon-edit-outline"></i>Edit</el-dropdown-item>
                                        <el-dropdown-item @click.native="handleOpenCreateQuestion(quizze)"><i class="el-icon-circle-plus-outline"></i>Add question</el-dropdown-item>
                                        <el-dropdown-item @click.native="deleteQuiz(quizze.id)"><i class="el-icon-delete"></i>Delete</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>

                        </el-col>
                    </el-row>

                </div>
            </template>
            <div class="table-row" style="margin-bottom: -20px;padding:10px;background: #ffffff;">
                <QuestionList2 :quizId="quizze.id" :isCreateQuestion="isCreateQuestion" />
            </div>
        </el-collapse-item>
    </el-collapse>

    <EditQuizz :isEditQuizz=isEditQuizz :quizzData=quizzData :handleCloseDialog=handleCloseDialog :handleEditQUizz=handleEditQUizz />
    <CreateQuestion :quizzData="quizzData" :isCreateQuestion="isCreateQuestion" :handleCloseDialog=handleCloseDialog />

</div>
</template>

<script>
import QuestionList2 from "./question/QuestionList2.vue";
import api from "../../../../api";
import EditQuizz from './action/EditQuizz.vue'
import CreateQuestion from './question/action/CreateQuestion.vue'
export default {
    name: 'QuizList2',
    components: {
        QuestionList2,
        EditQuizz,
        CreateQuestion
    },
    props: {
        quizzesList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            quizzsList: [],
            quizzData: {},
            isEditQuizz: false,
            isCreateQuestion: false,

        }
    },
    mounted() {
        this.quizzsList = this.quizzesList;
    },
    methods: {
        handleCloseDialog(name) {
            this[name] = false;
        },
        deleteQuiz(id) {
            this.$confirm("Sure to delete this problem? The associated submissions will be deleted as well.",
                    "Delete Quizz", {
                        type: "warning"
                    })
                .then(() => {
                    api["deleteSectionQuiz"](id)
                    this.quizzsList = this.quizzsList.filter(quiz => quiz.id !== id);
                })
                .catch(() => {})
        },
        handleOpenEditQuizzDialog(quizz) {
            this.quizzData = quizz;
            this.isEditQuizz = false;
            this.isEditQuizz = true;
        },
        handleEditQUizz(quizz) {
            const index = this.quizzsList.findIndex((i) => i.id === quizz.id);
            if (index !== -1) {
                this.quizzsList.splice(index, 1, quizz);
            }
        },
        handleOpenCreateQuestion(quizz) {
            this.quizzData = quizz;
            this.isCreateQuestion = false;
            this.isCreateQuestion = true;
        }
    },
    watch: {
        'isEditQuizz' (){
        }
    }

}
</script>

<style scoped>
.collapse-quiz {
    border-radius: 5px;
    width: calc(100% - 16px);
    margin: 8px auto 0;

}

.w-100 {
    width: 100%;
}

.w-96 {
    width: 96%
}

.titleQuizz {
    font-weight: 700;
    color: #A1ABB8;
    display: flex;
    flex-direction: column;
    padding: 3px 20px;
    line-height: 25px;
    min-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

.titleQuizz>span {
    color: #5E6A7C;

}

.min-size30,
.min-size80 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;

}

.min-size80 {
    min-width: 80px;
}

.min-size30 {
    min-width: 40px;
}

.okb {
    background-color: #F7F7F7;
}
</style>
