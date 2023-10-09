<template lang="">
  <Menu class="menu-quiz" style="width:100%" :accordion="true">
    <Card class="Card-form">
      <Submenu :name="`${index}`">
        <template slot="title">
          <Row>
            <Col :span="20">
              <h3> {{indexs}}. {{ section.title }}</h3>
            </Col>
            <Col :span="4">
              ({{section.quizzes.length}})
            </Col>
          </Row>
        </template>
        <MenuItem v-if="section.quizzes.length == 0">No questions found</MenuItem>
        <MenuItem v-for="(item, index) in section.quizzes" :key="item.id" :name="`${index}-${itemIndex}`">
          <div style="word-break: break-all" @click="getQuizDetail(section.id, item.id)">
            {{ item.title }}
          </div>
        </MenuItem>
      </Submenu>
    </Card>
  </Menu>
</template>

<script>
export default {
  name: "Quizlist",
  props: ['section', 'indexs'],
  data() {
    return {
      quizlist: [],
      quiz: [],
      secId: '',
      loading: false,
    }
  },
  mounted() {
    this.secId = this.section.id
  },
  methods: {
    getQuizList() {
      this.quizlist = this.section.quizzes
    },
    getQuizDetail(secId, quizId) {
      this.$router.push({ name: "quiz-detail-user", params: {sectionId: secId, quizId: quizId} }).catch(() => {});
    }
  }
}
</script>

<style lang="">
.Card-form {
  margin-bottom: 10px;
}

.ivu-card-body {
  padding: 0px;
}

.ivu-menu-vertical .ivu-menu-submenu-title-icon {
  right: 0;
}
.ivu-btn {
  text-align: left;
}
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 5px 8px
}
.menu-quiz {
  position: relative
}
.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 14px 7px;
}
</style>
