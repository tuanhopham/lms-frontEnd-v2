<template lang="">
  <div class="view">
    <Panel title="Users Answer List">
      <div slot="header">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="Search" v-model="searchUser"
        ></el-input>
        
      </div>
      
      <el-table v-loading="loading" element-loading-text="loading" ref="table" :data="filteredUserList" style="width: 100%"
        :default-sort="{ prop: 'userId', order: 'ascending' }">
        <el-table-column prop="userId" width="80" label="ID" sortable>
        </el-table-column>
        <el-table-column prop="username" label="User name">
        </el-table-column>
        <el-table-column prop="email" label="Email">
        </el-table-column>
        <el-table-column label="Role" width="100" align="center">
            <template slot-scope="scope">
            <el-tag :type="scope.row.admin_type === 'Super Admin' ? 'danger' : scope.row.role === 'Admin' ? 'warning' : ''">
              {{ scope.row.admin_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="140" align="center">
            <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'Completed' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="220" label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(courseId, scope.row.userId)" />
            <icon-btn v-if="scope.row.status == 'Pending'" name="Completed" icon="check-square-o" @click.native="goCompleted(scope.row.userId)" />
          </div>
        </el-table-column>
    </el-table>
    </Panel>
  </div>
</template>
<script>
import api from '../../api'
export default {
  name: 'UserAnswerList',
  data() {
    return{
        usersList: [],
        courseId: null,
        searchUser: ''
    }
  },
  mounted() {
    this.courseId = this.$route.params.coursesId
    this.getUsers(this.courseId)
  },
  computed: {
    filteredUserList() {
      return this.usersList.filter(user => user.username.toLowerCase().includes(this.searchUser.toLowerCase()));
    }
  },
  methods: {
    getUsers(courseId){
      api.getCourseUserAnswer(courseId).then(res => {
        this.usersList = res.data
      })
    },
    goCompleted  (userId)  {
      api.putCourseUserAnswer(this.courseId, userId, {})
      const user = this.usersList.find(i => i.userId === userId);
      if (user) {
        user.status = 'Completed'
      }
    },
    goEdit(courseId, userId) {
      this.$router.push({
        name: "quiz-user-list",
        params: { courseId: courseId, userId: userId}
      }).catch(() => {});
    }
  },
}
</script>
<style lang=""></style>
