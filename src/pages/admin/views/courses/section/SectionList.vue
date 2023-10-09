<template lang="">
<Panel :title="coursesId ? this.$i18n.t('m.Courses_Section_List') : this.$i18n.t('m.Section_List')">
    <el-row slot="header" :gutter="20">
        <el-col>
            <el-input v-model="query" prefix-icon="el-icon-search" placeholder="Tìm Kiếm"></el-input>
        </el-col>
    </el-row>
    <el-form>
        <el-table :data="sectionList.items" width="100%">
            <el-table-column prop="id" label="ID" sortable width="60"></el-table-column>
            <el-table-column prop="title" label="Title"></el-table-column>
            <el-table-column align="center" width="100" label="Visible">
                <template slot-scope="scope">
                    <el-switch style="cursor:pointer;" v-model="scope.row.visible" active-text="" inactive-text="" @change="handleVisibleSwitch(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column width="180" label="Operation">
                <div slot-scope="scope">
                    <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
                    <icon-btn name="Quiz" @click.native="goQuizList(scope.row.id)" icon="list-ol"></icon-btn>
                    <icon-btn name="Delete" @click.native="godeleteSection(scope.row.id)" icon="trash"></icon-btn>
                </div>
            </el-table-column>

        </el-table>
        <div class="SSbottom">
            <div class="btn-action">
                <el-button type="info" icon="el-icon-back" @click="goBack" size="small">Back</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="goCreateSection(coursesId)" size="small">Create</el-button>
            </div>
            <el-pagination layout="prev, pager, next" @current-change="currentChange" :page-count="sectionList.total_pages" hide-on-single-page>
            </el-pagination>
        </div>
    </el-form>
</Panel>
</template>

<script>
import api from '../../../api';
export default {
    name: "CoursesSection",
    data() {
        return {
            title: "Courses Section",
            coursesId: '',
            sectionList: [],
            routeName: '',
            loading: false,
            query: '',
            currentPage: 1,
        };
    },
    mounted() {
        this.routeName = this.$route.name
        this.coursesId = this.$route.params.coursesId
        this.getSectionList({
            query: this.query,
            page: this.sectionList.current_page || 1
        })
    },
    methods: {
        currentChange(page) {
            this.currentPage = this.sectionList.current_page;
            this.sectionList.current_page = page;
            this.getSectionList({
                page
            });
        },
        goBack() {
            this.$router.push({
                name: 'courses-list'
            }).catch(() => {});
        },
        getSectionList(params) {
            this.loading = true;
            api.getCoursesSectionList(this.coursesId, {
                query: this.query,
                page: params.page,
            }).then(res => {
                this.loading = false
                this.sectionList = res.data
            }, res => {
                this.loading = false
            })
        },
        goQuizList(sectionId) {
            this.$router.push({
                name: 'section-quiz-list',
                params: {
                    sectionId
                }
            }).catch(() => {})
        },
        goCreateSection(coursesId) {
            this.$router.push({
                name: 'create-courses-section',
                params: {
                    coursesId: coursesId
                }
            }).catch(() => {});
        },
        goEdit(sectionId) {
            if (this.routeName === 'section-list') {
                this.$router.push({
                    name: 'edit-section',
                    params: {
                        sectionId
                    }
                }).catch(() => {})
            } else if (this.routeName === 'courses-section-list') {
                this.$router.push({
                    name: 'courses-section-edit',
                    params: {
                        sectionId: sectionId,
                        coursesId: this.coursesId
                    }
                }).catch(() => {});
            }
        },
        godeleteSection(id) {
            this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.', 'Delete Section', {
                type: 'warning'
            }).then(() => {
                api.deleteCoursesSection(this.coursesId, id).then(() => [
                    this.getSectionList(this.currentPage - 1)
                ])
            })
        },
        handleVisibleSwitch(row) {
            api.editCoursesSection(this.$route.params.coursesId, row, row.id)
        },
        goCreate() {
            if (this.routeName === 'section-list') {
                this.$router.push({
                    name: 'create-section'
                }).catch(() => {})
            } else if (this.routeName === 'course-section-list') {
                this.$router.push({
                    name: 'create-courses-section',
                    params: {
                        coursesId: this.coursesId
                    }
                }).catch(() => {})
            }
        },
    },
    watch: {
        'query'() {
            this.currentChange(this.sectionList.current_page)
        }
    }
};
</script>

<style lang="">
.SSbottom {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.menuH {
    display: flex;
    justify-content: space-between;
}

.newItem {
    justify-content: right;
    margin-bottom: 15px;
}

.btn-action {
    display: flex;
}
</style>
