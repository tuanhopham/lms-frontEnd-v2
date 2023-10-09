<template>
<div class="item">

    <el-row :gutter="18" style="display: flex;align-items: center;">

        <el-col :span="2">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
        </el-col>
        <el-col :span="10">
            <div class="info">
                <span>{{source.username}}</span>
                <el-tag size="mini" type="danger">Senior</el-tag>
                <p>{{ source.email }}</p>
            </div>
        </el-col>
        <el-col :span="6">
            <el-select v-model="value" :change="handleChangeTypeUser(value)" default-first-option size="mini" placeholder="Select" style="margin: 0;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col style="text-align: end;" :span="4">
            <el-button icon="el-icon-arrow-right" size="medium" @click.native="moveToUser(source)" circle></el-button>

        </el-col>
    </el-row>
</div>
</template>

    
<script>
import {
    mapGetters,
    mapActions
} from 'vuex'

export default {
    data() {
        return {
            options: [{
                value: 'Member',
                label: 'Member'
            }, {
                value: 'Examiner',
                label: 'Examiner'
            }, ],
            value: ''
        }
    },

    props: {
        index: {
            type: Number,
            default: 0
        },
        source: {
            type: Object,
            default () {
                return {}
            }
        }
    },
     created() {
         this.value = this.source.typeUser;
    },
     watch: {
         'source'(val) {
           this.value = val.typeUser
        },
      
    },
    computed: {
    },
    methods: {
        ...mapActions(['moveToUser', 'changeTypeUser']),
        handleChangeTypeUser(newvalue) {
            this.source.typeUser = newvalue;
            this.changeTypeUser(this.source)
        }
    },
}
</script>

    
<style scoped>
.item {
    width: 100% ;
    overflow-x: hidden;
    border-bottom: 1px solid #e3e3e3;
}

.info span {
    font-weight: bold;
}
</style>
