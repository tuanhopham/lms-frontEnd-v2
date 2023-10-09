<template lang="">
<Panel :title="
      coursesId
        ? this.$i18n.t('m.Courses_Section_List')
        : this.$i18n.t('m.Section_List')
    ">
    <el-row slot="header" :gutter="20">
        <el-col>
            <el-button@click="isCreateSection=true" type="primary">Create Section</el-button@click=>
        </el-col>
    </el-row>
    <div class="collapse-table">
        <div class="title-header">
            <div class="pr-15">#</div>
            <div>Section</div>

        </div>
        <!-- collapse section -->
        <el-collapse class="collapse-form" v-model="activeCollapse">
            <el-collapse-item v-for="(item, index) in sectionList.items" :key="item.id" :title="item.title">
                <template class="section-collapse-item" slot="title">
                    <div class="title-container">
                        <div class="title-content">
                            <div class="pr-15">{{ index + 1 }}</div>
                            <div>{{ item.title }}</div>
                        </div>
                        <div @click.stop="">
                            <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="handleOpenEditSectionDialog(item)"><i class="el-icon-edit-outline"></i>Edit</el-dropdown-item>
                                    <el-dropdown-item @click.native="handleOpenAddQuizzDialog(item)"><i class="el-icon-circle-plus-outline"></i>Add quizz</el-dropdown-item>
                                    <el-dropdown-item @click.native="godeleteSection(item.id)"><i class="el-icon-delete"></i>Delete</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </template>
                <!-- collapse quiz -->

                <QuizList2 :quizzesList=item.quizzes />

            </el-collapse-item>
        </el-collapse>
    </div>
    <CreateSection :handleCreateSection=handleCreateSection :handleCloseDialog=handleCloseDialog :isCreateSection=isCreateSection />

    <EditSection :sectionData=section :handleEditSection=handleEditSection :handleCloseDialog=handleCloseDialog :isEditSection=isEditSection />

    <CreateQuizz :isAddQuizz=isAddQuizz :sectionData=section :handleCreateQuizz=handleCreateQuizz :handleCloseDialog=handleCloseDialog />

</Panel>
</template>

<script>
import api from '../../../api'
import QuizList2 from './quiz/QuizList2.vue'
import CreateSection from './action/CreateSection.vue'
import EditSection from './action/EditSection.vue'
import CreateQuizz from './quiz/action/CreateQuizz.vue'
export default {
    name: 'CoursesSection',
    components: {
        QuizList2,
        CreateSection,
        EditSection,
        CreateQuizz,
    },
    data() {
        return {
            title: 'Courses Section',
            coursesId: '',
            sectionList: [],
            section: {},
            isCreateSection: false,
            isEditSection: false,
            isAddQuizz: false,
        }
    },
    mounted() {
        this.coursesId = this.$route.params.coursesId
        this.getSectionList()
    },
    methods: {
        getSectionList() {
            api
                .getCoursesSectionList(this.coursesId, {})
                .then(
                    res => {
                        this.sectionList = res.data
                    },

                )
        },
        handleOpenEditSectionDialog(section) {
            this.section = section;
            this.isEditSection = true;
        },
        handleOpenAddQuizzDialog(section) {
            this.section = section;
            this.isAddQuizz = true;
        },
        handleEditSection(section) {
            const index = this.sectionList.items.findIndex((i) => i.id === section.id);

            if (index !== -1) {
                this.sectionList.items.splice(index, 1, section);
            }
        },
        handleCloseDialog(name) {
            this[name] = false;
        },
        handleCreateSection(data) {
            const newData = {
                ...data,
                quizzes: []
            }
            this.sectionList.items.push(newData);
        },
        handleCreateQuizz(data) {
            this.section.quizzes.push(data);
        },
        godeleteSection(id) {
            this.$confirm(
                'Sure to delete this problem? The associated submissions will be deleted as well.',
                'Delete Section', {
                    type: 'warning',
                }
            ).then(() => {
                api
                    .deleteCoursesSection(this.coursesId, id)
                    .then(() => [this.getSectionList(this.currentPage - 1)])
            })
        },
        handleVisibleSwitch(row) {
            api.editCoursesSection(this.$route.params.coursesId, row, row.id)
        },
    },
    watch: {},
}
</script>

<style>
.collapse-table {
    border: 1px solid #d5d5da;
    /* border-bottom: 0px; */
    border-radius: 5px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.collapse-form {
    border-radius: 10px;
}

.el-collapse-item__wrap {
    background-color: #F7F7F7;
}

.scroll-modal {
    overflow-y: auto;
    overflow-x: hidden;
    height: 62vh;
}

.title-header {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color: #EEF1F8;
    color: #7A8189;
    display: flex;
    font-weight: 600;
    padding: 4px 4%;
    font-size: small;
}

.title-container {
    width: 96%;
    display: flex;
    justify-content: space-between;

}

.el-collapse-item__header {
    padding: 0 20px 0 0;
    height: fit-content;
    transition: background-color 0.3s ease-in-out;
    flex-direction: row-reverse;
    display: flex;
    color: #5E6A7C;
    line-height: 32px;
}

.el-collapse-item__arrow {
    margin: 0 auto;
}

.el-collapse-item__header:hover {
    background-color: #e9e9ea;

}

.title-content {
    font-weight: 600;
    width: 75%;
    display: flex;
    font-size: 11px;
}

.pr-15 {
    padding-right: 15px;
}
</style>
