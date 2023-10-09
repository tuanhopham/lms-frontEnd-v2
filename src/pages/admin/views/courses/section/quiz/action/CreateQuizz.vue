<template>
<el-dialog title="Add Quizz" :visible.sync="isAddQuizz" :before-close="cancelQuiz" top="5vh" width="60%">
    <el-form :model="quiz" ref="quiz" :rules="rules" label-position="top" class="scroll-modal">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form-item prop="title" label="Title" required>
                    <el-input placeholder="Title" v-model="quiz.title" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="maxNumberOfQuestions" label="Max number of question" required>
                    <el-input-number :min="1" placeholder="Number" v-model.number="quiz.maxNumberOfQuestions" />
                </el-form-item>

            </el-col>
            <el-col :span="8">
                <el-form-item prop="maxTest" label="Max test" required>
                    <el-input-number :min="1" placeholder="Number" v-model.number="quiz.maxTest" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="quizTime" label="Quiz time" required>
                    <TimePicker v-model="quiz.quizTime" placeholder="Time"></TimePicker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Quiz Type">
                    <el-radio v-model="quiz.quizType" label="Quiz" :disabled="disabledQuizType" />
                    <el-radio v-model="quiz.quizType" label="Survey" :disabled="disabledQuizType" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Status">
                    <el-switch v-model="quiz.visible" active-text="" inactive-text="" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item prop="description" label="Description" required>
                    <Simditor v-model="quiz.description" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelQuiz">Cancel</el-button>
        <el-button @click.native="saveQuiz('quiz')" type="primary">Submit</el-button>
    </span>
</el-dialog>
</template>

<script>
import api from "../../../../../api";
import Simditor from "../../../../../components/Simditor.vue";

export default {
    name: "CreateQuizz",
    props: {
        handleCreateQuizz: {
            type: Function,
        },
        sectionData: {
            type: Object,
        },
        handleCloseDialog: {
            type: Function,
        },
        isAddQuizz: {
            type: Boolean,
        },
    },
    components: {
        Simditor
    },
    data() {
        return {
            title: "Create Quiz",
            sectionId: 0,
            disabledQuizType: false,
            quiz: {
                title: "",
                description: "",
                maxNumberOfQuestions: "",
                quizType: "Quiz",
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
        this.sectionId = this.sectionData.id
    },
    watch: {
        'sectionData'(val) {
            this.sectionId = val.id
        },
    },
    methods: {
        saveQuiz(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    const data = Object.assign({}, this.quiz);
                    const res = await api["createSectionQuiz"](this.sectionId, data)
                    this.handleCreateQuizz(res.data)
                    this.$refs.quiz.resetFields();
                    this.handleCloseDialog('isAddQuizz')
                } else {
                    this.$error(
                        !this.quiz.title.length ?
                        this.rules.title.message :
                        !this.quiz.description.length ?
                        this.rules.description.message :
                        this.quiz.maxNumberOfQuestions.length != undefined ?
                        this.rules.maxNumberOfQuestions.message :
                        !this.quiz.quizTime ?
                        this.rules.quizTime.message :
                        !this.quiz.maxTest ?
                        this.rules.maxTest.message :
                        null
                    );
                    return false;
                }
            });
        },
        cancelQuiz() {
            this.$refs.quiz.resetFields();
            this.handleCloseDialog('isAddQuizz')
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
