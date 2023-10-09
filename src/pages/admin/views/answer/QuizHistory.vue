<template lang="">
  <div>
    <el-table
      v-loading="loading"
      :data="quizListUser"
      :default-sort = "{prop: 'createdAt', order: 'descending'}"
      max-height="300" style="width: 100%"
    >
      <el-table-column
        type="index"
        width="60"
        sortable
      >
    </el-table-column>
      <el-table-column prop="createdAt" label="Created At" width="auto" align="center">
        <template slot-scope="scope">
          <el-tag
          type="info"
          >
            {{ scope.row.createdAt | localtime('HH:mm, DD/MM/YYYY') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Score">
        <template slot-scope="scope">
          <el-tag
          type="success"
          >
            {{ scope.row.totalScoreUser }} / {{ scope.row.totalScore }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120" label="Operation" align="center">
        <div slot-scope="scope">
          <el-button size="small" style="width: 82px" :type="showAnswer && currentId===scope.row.quizUserId ? 'primary' : ''" @click="goAnswerList(scope.row.quizUserId)">
              {{showAnswer && currentId===scope.row.quizUserId ? 'Viewing' : 'View'}}
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "QuizHistory",
  props: ['quizListUser'],
  data() {
    return {
      showAnswer: false,
      answerUser: [],
      dataAnswer: [],
      currentId: null,
    };
  },
  methods: {
   goAnswerList(quizUserId) {
   
      if (this.currentId === quizUserId && this.showAnswer) {
        this.showAnswer = false;
      } else {
        this.currentId = quizUserId;
        this.showAnswer = true;
      }
      if (this.showAnswer) {
          this.answerUser = this.quizListUser.find(i => i.quizUserId === quizUserId).QA;

      } 
      else {
        this.answerUser = []
      }
   
      this.$emit('dataAnswer', this.answerUser)
    }
  }
};
</script>
<style lang="">
</style>
