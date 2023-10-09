<template lang="">
   <el-dialog title="Edit Section" :visible.sync="isEditSection"  :before-close="cancelSection" width="30%" center>
    <el-form :model="section" ref="editSection" :rules="rules" label-position="top">
        <el-row :gutter="30">
            <el-col :span="24">
                <el-form-item prop="title" :label="$t('m.SectionName')" required>
                    <el-input v-model="section.title" :placeholder="$t('m.SectionName')"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="$t('m.Section_Visible')" required>
                    <el-switch v-model="section.visible" active-text="" inactive-text="" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div class="buttonFooter">
        <el-button @click="cancelSection">Cancel</el-button>
        <el-button @click.native="saveSection('editSection')" type="primary">Confirm</el-button>
    </div>
</el-dialog>
</template>

<script>
import api from "../../../../api";
export default {
    name: "EditSection",
    props: {
        handleEditSection: {
            type: Function,
        },
        handleCloseDialog: {
            type: Function,
        },
        sectionData: {
            type: Object,
            required: true,
        },
        isEditSection: {
            type: Boolean,
        },
    },
    data() {
        return {
            title: "edit Section",
            section: {
                visible: true,
                title: ""
            },
            rules: {
                title: {
                    required: true,
                    message: 'Please input title',
                    trigger: 'blur'
                }
            }
        };
    },
    methods: {
        saveSection(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {

                    let data = Object.assign({}, this.section);
                    const  res = await api["editCoursesSection"](this.$route.params.coursesId, data, this.sectionData.id)
                        .catch(() => {});
                    this.cancelSection()
                    this.handleEditSection(res.data)
                    this.$refs.section.resetFields();
                } else {
                    this.$error(!this.section.title ? this.rules.title.message : null)
                    return false;
                }
            })
        },
        cancelSection() {
            this.$refs.editSection.resetFields();
            this.handleCloseDialog('isEditSection')
        }
    },
    mounted() {
        this.section = {
            visible: this.sectionData.visible,
            title: this.sectionData.title
        }
    },
    watch: {
        'isEditSection'(val) {
            if (val == true) {
                this.section = {
                    visible: this.sectionData.visible,
                    title: this.sectionData.title
                }
            }
        },
    },
};
</script>

<style lang="">
.buttonFooter {
    display: flex;
    justify-content: flex-end;
}
</style>
