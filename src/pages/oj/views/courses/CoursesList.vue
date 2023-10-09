<template lang="">
<Row type="flex">
    <Col :span="24">
    <Panel shadow>
        <div slot="title">{{$t("m.CoursesList")}}</div>
        <div slot="extra">
            <ul class="filter">
                <li>
                    <Dropdown @on-click="onSourceChange">
                        <span>{{
                    sources === ""
                      ? this.$i18n.t("m.CoursesSourse")
                      : this.$i18n.t(sources.toUpperCase())
                  }}
                            <Icon type="md-arrow-dropdown"></Icon>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item name="">{{ $t("m.All") }}</Dropdown-item>
                            <Dropdown-item name="Ncc">{{ $t("m.NCC") }}</Dropdown-item>
                            <Dropdown-item name="Scorm">{{
                    $t("m.SCORM")
                  }}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </li>
                <li>
                    <Dropdown @on-click="onLevelChange">
                        <span>{{
                    level === ""
                      ? this.$i18n.t("m.CoursesLevel")
                      : this.$i18n.t(level)
                  }}
                            <Icon type="md-arrow-dropdown"></Icon>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item name="">{{ $t("m.All") }}</Dropdown-item>
                            <Dropdown-item name="Basic">{{
                    $t("m.Basic")
                  }}</Dropdown-item>
                            <Dropdown-item name="Advance">{{
                    $t("m.Advance")
                  }}</Dropdown-item>
                            <Dropdown-item name="Expert">{{
                    $t("m.Expert")
                  }}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </li>
                <li>
                    <Dropdown @on-click="onTypeChange">
                        <span>{{
                    type === ""
                      ? this.$i18n.t("m.CType")
                      : this.$i18n.t(type)
                  }}
                            <Icon type="md-arrow-dropdown"></Icon>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item name="">{{ $t("m.All") }}</Dropdown-item>
                            <Dropdown-item name="Recur">{{
                    $t("m.Recur")
                  }}</Dropdown-item>
                            <Dropdown-item name="Perpetual">{{
                    $t("m.Perpetual")
                  }}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </li>
                <li>
                    <Input v-model="query" icon="ios-search" placeholder="Tìm Kiếm"></Input>
                </li>
            </ul>
        </div>
        <div v-loading="loading">
            <p class="no-content" v-if="coursesList.items == 0">{{$t('m.No_content')}}</p>
            <Row :gutter="20" class="elRow">
                <Col class="col-item" :xs="24" :sm="12" :md="8" :lg="6" v-for="courses in coursesList.items" :key="courses.id">
                <Card @click.native="goCourses(courses)">
                    <Row :gutter="20" class="course-item">
                        <Col :span="24" class="btn-avatar">
                        <div class="btn-avatar-item">
                            <el-image :src="courses.avatar"></el-image>
                        </div>
                        </Col>
                        <Col :span="24">
                        <Row class="item-info">
                            <Col :span="24">
                            <h3>{{ courses.title }}</h3>
                            </Col>
                        </Row>
                        <Row class="item-info" :gutter="10">
                            <Col :span="6">
                            <p>{{ courses.sources.toUpperCase() }}</p>
                            </Col>
                            <Col :span="12">
                            <p>
                                <Icon type="md-calendar"></Icon>
                                {{ courses.start_time | localtime('HH:mm, DD/MM/YYYY') }}
                            </p>
                            </Col>
                            <Col :span="6">
                            <p>
                                <Icon type="md-time"></Icon>
                                {{getDuration(courses.start_time, courses.end_time)}}
                            </p>
                            </Col>
                        </Row>
                        </Col>

                    </Row>
                </Card>

                </Col>
            </Row>
        </div>
    </Panel>
    <Pagination v-if="this.total > 1" :total="total * pageSize" @on-change="currentChange"></Pagination>
    </Col>
</Row>
</template>

<script>
import api from "@oj/api";
import time from '@/utils/time'
import {
    mapGetters
} from 'vuex'
import Pagination from "@/pages/oj/components/Pagination";
export default {
    name: "courses-list",
    components: {
        Pagination
    },
    data() {
        return {
            total: 0,
            loading: false,
            isHover: false,
            sources: "",
            level: "",
            type: "",
            query: "",
            coursesList: [],
            page: 1,
            currentPage: 1,
            pageSize: 10,
        };
    },
    mounted() {
        this.getCoursesUserList({
            query: this.query,
            page: this.currentPage
        });
    },
    methods: {
        currentChange(page) {
            this.currentPage = page;
            this.getCoursesUserList({
                page
            });
        },
        onSourceChange(sources) {
            this.sources = sources;
        },
        onLevelChange(level) {
            this.level = level;
        },
        onTypeChange(type) {
            this.type = type;
        },
        getDuration(startTime, endTime) {
            return time.duration(startTime, endTime)
        },
        goCourses(courses) {
            if (!this.isAuthenticated) {
                this.$error(this.$i18n.t('m.Please_login_first'))
                this.$store.dispatch('changeModalStatus', {
                    visible: true
                })
            } else {
                this.$router.push({
                    name: 'courses-details',
                    params: {
                        coursesId: courses.id
                    }
                }).catch(() => {})
            }
        },
        getCoursesUserList(params) {
            this.loading = true;
            const apiParams = {
                query: this.query,
                page: params.page
            };
            if (this.sources !== "") {
                apiParams.sources = this.sources;
            } else if (this.level !== "") {
                apiParams.level = this.level;
            } else if (this.type !== "") {
                apiParams.type = this.type;
            }
            api
                .getCoursesUserList(apiParams)
                .then(
                    res => {
                        this.loading = false;
                        this.total = res.data.total_pages;
                        this.coursesList = res.data;
                    },
                    res => {
                        this.loading = false;
                    }
                );
        },
    },
    computed: {
        ...mapGetters(['isAuthenticated', 'user', ])
    },
    watch: {
        isAuthenticated(value) {
            if (value === true) {
                this.getCoursesUserList({
                    query: this.query,
                    page: this.currentPage
                });
            }
        },
        query() {
            const page = this.coursesList.current_page || 1;
            this.currentChange(page);
        },
        sources() {
            const page = this.coursesList.current_page || 1;
            this.currentChange(page);
        },
        level() {
            const page = this.coursesList.current_page || 1;
            this.currentChange(page);
        },
        type() {
            const page = this.coursesList.current_page || 1;
            this.currentChange(page);
        }
    }
};
</script>

<style lang="">
.time {
    font-size: 13px;
    color: #999;
}

.elRow {
    padding: 10px;
}

.ivu-card-body {
    padding: 0;
}

.no-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

/* style2 */
.btn-avatar-item .el-image {
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.btn-avatar .btn-avatar-item {
    width: 100%;
}

.col-item {
    margin-bottom: 10px;
}

.btn-avatar {
    margin-bottom: 10px;
}

.course-item {
    margin-bottom: 10px;
}

.btn-avatar .el-image img {
    transition: transform .3s;
    object-fit: cover;
    max-width: 100%;
    height: 30vh;
}

.btn-avatar .el-image img:hover {
    transform: scale(1.1);
}

.item-info {
    padding: 0 10px
}
</style>
