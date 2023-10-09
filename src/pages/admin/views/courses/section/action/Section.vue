<template lang="">
  <Panel :title="title">
    <el-form :model="section"  ref="section" :rules="rules" label-position="top">
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item prop="title" :label="$t('m.SectionName')" required>
            <el-input
              v-model="section.title"
              :placeholder="$t('m.SectionName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('m.Section_Visible')" required>
            <el-switch v-model="section.visible" active-text="" inactive-text=""
          /></el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="buttonFooter">
      <cancel @click.native="cancelSection" />
      <save @click.native="saveSection('section')"></save>
    </div>
  </Panel>
</template>
<script>
import api from "../../../../api";
export default {
  name: "Section",
  data() {
    return {
      title: "Create Section",
      section: {
        visible: true,
        title: ""
      },
      rules: {
        title:
          { required: true, message: 'Please input title', trigger: 'blur' }
      }
    };
  },
  methods: {
    saveSection(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let funcName =
            this.$route.name === "courses-section-edit"
              ? "editCoursesSection"
              : "createCoursesSection";
          let data = Object.assign({}, this.section);
          api[funcName](this.$route.params.coursesId, data, this.$route.params.sectionId)
            .then(res => {
              this.$router.push({
                name: "courses-section-list",
                query: { refresh: "true" }
              }).catch(() => {});
            })
            .catch(() => { });
        }
        else {
          this.$error(!this.section.title ? this.rules.title.message : null)
          return false;
        }
      })
    },
    cancelSection() {
      this.$router.push({ name: 'courses-section-list', params: this.$route.params.coursesId }).catch(() => {});
    }
  },
  mounted() {
    if (this.$route.name === "courses-section-edit") {
      this.title = "Edit Section";
      api
        .getCoursesSectionList(this.$route.params.coursesId)
        .then(res => {
          let data = res.data.items.find(i => i.id == this.$route.params.sectionId);
          this.section = data;
        })
        .catch(error => {
        });
    }
    
  }
};
</script>
<style lang="">
.buttonFooter {
    display: flex;
    justify-content: flex-end;
}</style>
