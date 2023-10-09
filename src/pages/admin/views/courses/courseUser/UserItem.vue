<template>
<div class="item">

    <el-row :gutter="18" style="display: flex;align-items: center;">
        <el-col style="text-align: start;" :span="2">
        <el-button icon="el-icon-arrow-left" size="medium"  @click.native="moveToCourseUser(source)" circle ></el-button>

        </el-col>
        <el-col :span="2">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
        </el-col>
        <el-col :span="10">
            <div class="info">
                <span>{{source.username}}</span> <el-tag size="mini" type="danger" >Senior</el-tag>
                <p>{{ source.email }}</p>
            </div>
        </el-col>
       
        
    </el-row>
</div>
</template>

<script>
import {
    mapGetters,mapActions
} from 'vuex'

export default {
    data() {
        return {
         
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
    computed: {
        ...mapGetters(['profile'])
    },
    methods: {
        ...mapActions(['moveToCourseUser'])
    },
}
</script>

<style scoped>
.item {
    width: 100%;
    overflow-x: hidden;
    border-bottom: 1px solid #e3e3e3;
}

.info span {
    font-weight: bold;
}
</style>
