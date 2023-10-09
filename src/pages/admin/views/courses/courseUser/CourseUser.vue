<template>
<div class="user-form">
    <div class="list-user">
        <h3>Course Users</h3>
        <el-row :gutter="24">
            <el-col style="text-align: start;" :span="11">
                <el-select v-model="value" size="large" multiple placeholder="Filter">
                    <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-col>
            <el-col style="text-align: start;" :span="13">
                <el-input placeholder="Search user by email" prefix-icon="el-icon-search" v-model="searchCourseUser"></el-input>
            </el-col>
        </el-row>
        <virtual-list class="list" style="height: 360px; overflow-y: auto;" :data-key="'id'" :data-sources="computedCourseUserList" :data-component="courseUser" :estimate-size="20" />
    </div>
    <div class="list-user">
        <h3>Users</h3>
        <el-row :gutter="24">
            <el-col style="text-align: start;" :span="11">
                <el-select v-model="value" size="large" multiple placeholder="Filter">
                    <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-col>
            <el-col style="text-align: start;" :span="13">
                <el-input placeholder="Search user by email" prefix-icon="el-icon-search" v-model="searchUser"></el-input>
            </el-col>
        </el-row>
        <virtual-list class="list" style="height: 360px; overflow-y: auto;" :data-key="'id'" :data-sources="computedUserList" :data-component="user" :estimate-size="20" />

    </div>

</div>
</template>

<script>
import User from './UserItem.vue'
import CourseUser from './CourseUserItem.vue'
import {
    mapActions
} from 'vuex'
export default {
    name: "CourseUser",
    components: {},
    data() {
        return {
            searchUser: '',
            searchCourseUser: '',
            user: User,
            courseUser: CourseUser,
            options: [{
                label: 'City',
                options: [{
                    value: 'Vinh',
                    label: 'Vinh'
                }, {
                    value: 'HN3',
                    label: 'HN3'
                }, {
                    value: 'QN',
                    label: 'QN'
                }]
            }, {
                label: 'Level',
                options: [{
                    value: 'Staff',
                    label: 'Staff'
                }, {
                    value: 'Intern',
                    label: 'Intern'
                }, {
                    value: 'Collaborator',
                    label: 'Collaborator'
                }]
            }],
            value: '',
        }
    },
    methods: {
        ...mapActions(['getCourseUser'])
    },
    mounted() {
        this.getCourseUser(this.$route.params.coursesId)
    },
    computed: {
        computedUserList() {
            const filteredList = this.$store.getters.UsersNotInCourse.filter(item => {
                const searchUser = this.searchUser.trim().toLowerCase();
                const username = item.username ? item.username.trim().toLowerCase():'';
                const email = item.email ? item.email.trim().toLowerCase():'';
                return username.includes(searchUser) || email.includes(searchUser);
            });

            return filteredList.map((item, index) => {
                return {
                    ...item,
                    id: index
                };
            });
        },
        computedCourseUserList() {
            const filteredList = this.$store.getters.courseUser.filter(item => {
                const searchUser = this.searchCourseUser.trim().toLowerCase();
                const username = item.username ? item.username.trim().toLowerCase():'';
                const email = item.email ? item.email.trim().toLowerCase():'';
                return username.includes(searchUser) || email.includes(searchUser);
            });
            return filteredList.map((item, index) => {
                return {
                    ...item,
                    id: index
                };
            });
        },

    }
}
</script>

<style lang="less" scoped>
.user-form {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
}

.list-user {
    padding: 10px;
    width: 36vw;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
</style>
