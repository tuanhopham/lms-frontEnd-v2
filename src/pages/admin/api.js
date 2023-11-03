/* eslint-disable */
import Vue from "vue";
import router from "./router";
import axios from "axios";
import utils from "@/utils/utils";

Vue.prototype.$http = axios;
axios.defaults.baseURL = "/api";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
export default {
  // 登录
  login(username, password) {
    return ajax("login", "post", {
      data: {
        username,
        password
      }
    });
  },
  loginWithGoogle(data) {
    return ajax("loginGoogle", "post", {
      data
    });
  },
  logout() {
    return ajax("logout", "get");
  },
  getProfile() {
    return ajax("profile", "get");
  },
  // 获取公告列表
  getAnnouncementList(offset, limit) {
    return ajax("admin/announcement", "get", {
      params: {
        paging: true,
        offset,
        limit
      }
    });
  },
  // 删除公告
  deleteAnnouncement(id) {
    return ajax("admin/announcement", "delete", {
      params: {
        id
      }
    });
  },
  // 修改公告
  updateAnnouncement(data) {
    return ajax("admin/announcement", "put", {
      data
    });
  },
  // 添加公告
  createAnnouncement(data) {
    return ajax("admin/announcement", "post", {
      data
    });
  },
  // 获取用户列表
  getUserList(offset, limit, keyword, onlyadmin) {
    let params = { paging: true, offset, limit };
    if (keyword) {
      params.keyword = keyword;
    }
    if (onlyadmin) {
      params.onlyadmin = true;
    }
    return ajax("admin/user", "get", {
      params: params
    });
  },
  // 获取单个用户信息
  getUser(id) {
    return ajax("admin/user", "get", {
      params: {
        id
      }
    });
  },
  // 编辑用户
  editUser(data) {
    return ajax("admin/user", "put", {
      data
    });
  },
  deleteUsers(id) {
    return ajax("admin/user", "delete", {
      params: {
        id
      }
    });
  },
  importUsers(users) {
    return ajax("admin/user", "post", {
      data: {
        users
      }
    });
  },
  generateUser(data) {
    return ajax("admin/generate_user", "post", {
      data
    });
  },
  getLanguages() {
    return ajax("languages", "get");
  },
  getSMTPConfig() {
    return ajax("admin/smtp", "get");
  },
  createSMTPConfig(data) {
    return ajax("admin/smtp", "post", {
      data
    });
  },
  editSMTPConfig(data) {
    return ajax("admin/smtp", "put", {
      data
    });
  },
  testSMTPConfig(email) {
    return ajax("admin/smtp_test", "post", {
      data: {
        email
      }
    });
  },
  getWebsiteConfig() {
    return ajax("admin/website", "get");
  },
  editWebsiteConfig(data) {
    return ajax("admin/website", "post", {
      data
    });
  },
  getJudgeServer() {
    return ajax("admin/judge_server", "get");
  },
  deleteJudgeServer(hostname) {
    return ajax("admin/judge_server", "delete", {
      params: {
        hostname: hostname
      }
    });
  },
  updateJudgeServer(data) {
    return ajax("admin/judge_server", "put", {
      data
    });
  },
  getInvalidTestCaseList() {
    return ajax("admin/prune_test_case", "get");
  },
  pruneTestCase(id) {
    return ajax("admin/prune_test_case", "delete", {
      params: {
        id
      }
    });
  },
  createContest(data) {
    return ajax("admin/contest", "post", {
      data
    });
  },
  getContest(id) {
    return ajax("admin/contest", "get", {
      params: {
        id
      }
    });
  },
  editContest(data) {
    return ajax("admin/contest", "put", {
      data
    });
  },
  getContestList(offset, limit, keyword) {
    let params = { paging: true, offset, limit };
    if (keyword) {
      params.keyword = keyword;
    }
    return ajax("admin/contest", "get", {
      params: params
    });
  },
  deleteContest(id) {
    return ajax(`admin/contest`, "delete", {
      params: {
        id
      }
    });
  },
  getContestAnnouncementList(contestID) {
    return ajax("admin/contest/announcement", "get", {
      params: {
        contest_id: contestID
      }
    });
  },
  createContestAnnouncement(data) {
    return ajax("admin/contest/announcement", "post", {
      data
    });
  },
  deleteContestAnnouncement(id) {
    return ajax("admin/contest/announcement", "delete", {
      params: {
        id
      }
    });
  },
  updateContestAnnouncement(data) {
    return ajax("admin/contest/announcement", "put", {
      data
    });
  },
  // courses
  createCourses(data) {
    return ajax("courses", "post", {
      data
    });
  },
  getCoursesList(params) {
    return ajax(`coursesAdmin`, "get", {
      params: { ...params }
    });
  },
  getCoursesDetail(params) {
    return ajax(`coursesAdmin`, "get", {
      params: {
        ...params
      }
    });
  },
  editCourses(data) {
    return ajax(`courses/${data.id}`, "put", {
      data
    });
  },
  deleteCourses(id) {
    return ajax(`courses/${id}`, "delete", {
      params: { id }
    });
  },
  // courses-section
  getCoursesSectionList(courseid, params) {
    return ajax(`courses/${courseid}/section`, "get", {
      params: { ...params }
    });
  },
  getCoursesUser(courseid, data) {
    return ajax(`CoursesUser/${courseid}`, "get", {
      data
    });
  },
  addCoursesUser(courseid, data) {
    return ajax(
      `CoursesUser/${courseid}`,
      "post",
      {
        data
      },
      false
    );
  },
  createCoursesSection(courseid, data) {
    return ajax(`courses/${courseid}/section`, "post", {
      data
    });
  },
  editCoursesSection(courseid, data, id) {
    return ajax(`courses/${courseid}/section/${id}`, "put", {
      data
    });
  },
  deleteCoursesSection(courseid, id) {
    return ajax(`courses/${courseid}/section/${id}`, "delete", {
      params: {
        id
      }
    });
  },
  getProblemTagList(params) {
    return ajax("problem/tags", "get", {
      params
    });
  },
  getProblemsList() {
    return ajax("listProblems", "get");
  },
  compileSPJ(data) {
    return ajax("admin/compile_spj", "post", {
      data
    });
  },
  createProblem(data) {
    return ajax("admin/problem", "post", {
      data
    });
  },
  editProblem(data) {
    return ajax("admin/problem", "put", {
      data
    });
  },
  deleteProblem(id) {
    return ajax("admin/problem", "delete", {
      params: {
        id
      }
    });
  },
  getProblem(id) {
    return ajax("admin/problem", "get", {
      params: {
        id
      }
    });
  },
  getProblemList(params) {
    params = utils.filterEmptyValue(params);
    return ajax("admin/problem", "get", {
      params
    });
  },
  getContestProblemList(params) {
    params = utils.filterEmptyValue(params);
    return ajax("admin/contest/problem", "get", {
      params
    });
  },
  getContestProblem(id) {
    return ajax("admin/contest/problem", "get", {
      params: {
        id
      }
    });
  },
  createContestProblem(data) {
    return ajax("admin/contest/problem", "post", {
      data
    });
  },
  editContestProblem(data) {
    return ajax("admin/contest/problem", "put", {
      data
    });
  },
  deleteContestProblem(id) {
    return ajax("admin/contest/problem", "delete", {
      params: {
        id
      }
    });
  },
  makeContestProblemPublic(data) {
    return ajax("admin/contest_problem/make_public", "post", {
      data
    });
  },
  addProblemFromPublic(data) {
    return ajax("admin/contest/add_problem_from_public", "post", {
      data
    });
  },
  getReleaseNotes() {
    return ajax("admin/versions", "get", {}, false);
  },
  getDashboardInfo() {
    return ajax("admin/dashboard_info", "get", {}, false);
  },
  getSessions() {
    return ajax("sessions", "get");
  },
  exportProblems(data) {
    return ajax("export_problem", "post", {
      data
    });
  },
  // 获取关于我们列表
  getAboutUsList() {
    return ajax("admin/aboutus", "get", {});
  },
  // 修改关于我们
  updateAboutUs(data) {
    return ajax("admin/aboutus", "put", {
      data
    });
  },
  // 添加关于我们
  createAboutUs(data) {
    return ajax("admin/aboutus", "post", {
      data
    });
  },
  // section - quiz
  getSectionQuizList(sectionId, params) {
    return ajax(`section/${sectionId}/quiz`, "get", {
      params: { ...params }
    });
  },
  getSectionQuiz(sectionId, params) {
    return ajax(`section/${sectionId}/quiz`, "get", {
      params: {
        ...params
      }
    });
  },
  getSectionQuizdetail(sectionId, id) {
    return ajax(`section/${sectionId}/quiz/${id}`, "get", {});
  },
  createSectionQuiz(sectionId, data) {
    return ajax(`section/${sectionId}/quiz`, "post", {
      data
    });
  },
  editSectionQuiz(data) {
    return ajax(`updateQuiz/${data.id}`, "put", {
      data
    });
  },
  deleteSectionQuiz(id) {
    return ajax(`deleteQuiz/${id}`, "delete", {});
  },
  getQuizQuestionList(quizId, params) {
    return ajax(`quiz/${quizId}/question`, "get", {
      params: { ...params }
    });
  },
  getQuizQuestion(quizId, params) {
    return ajax(`quiz/${quizId}/question`, "get", {
      params: {
        ...params
      }
    });
  },
  getQuizQuestionDetail(quizId, id, params) {
    return ajax(`quiz/${quizId}/question/${id}`, "get", {
      params: {
        ...params
      }
    });
  },
  createQuizQuestion(quizId, data) {
    return ajax(`quiz/${quizId}/question`, "post", {
      data
    });
  },
  editQuizQuestion(quizId, data) {
    return ajax(`quiz/${quizId}/question/${data.id}`, "put", {
      data
    });
  },

  deleteQuizQuestion(quizId, id) {
    return ajax(`quiz/${quizId}/question/${id}`, "delete", {
      params: {
        id
      }
    });
  },
  getAnswersList(quizId) {
    return ajax(`${quizId}/answer`, "get", {});
  },
  // courses user answer list
  getCourseUserAnswer(coursesId) {
    return ajax(`courses/${coursesId}/users`, "get", {});
  },
  putCourseUserAnswer(coursesId, userId, data) {
    return ajax(`courses/${coursesId}/users/${userId}`, "put", {
      data
    });
  },
  // user answer list
  getQuizUserByCourse(courseId) {
    return ajax(`courses/${courseId}/user/quiz`, "get", {});
  },
  // goi quiz theo quizId, userId
  getQuizListUser(userId, quizId) {
    return ajax(`user/${userId}/quiz/${quizId}`, "get", {});
  },
  saveScoreAnswer(answerId, data) {
    return ajax(`saveAnswerScore/${answerId}`, "put", {
      data
    });
  }
};

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax(url, method, options, toast = true) {
  if (options !== undefined) {
    var { params = {}, data = {} } = options;
  } else {
    params = data = {};
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(
      res => {
        // API正常返回(status=20x), 是否错误通过有无error判断
        if (
          res.data &&
          res.data.error &&
          res.data.error !== null &&
          toast === true
        ) {
          Vue.prototype.$error(res.data.data);
          reject(res);
          // 若后端返回为登录，则为session失效，应退出当前登录用户
          if (
            res.data &&
            res.data.data &&
            res.data.data.startsWith("Please login")
          ) {
            router.push({ name: "login" });
          }
        } else {
          resolve(res);
          if (method !== "get" && toast === true) {
            Vue.prototype.$success("Succeeded");
          }
        }
      },
      res => {
        // API请求异常，一般为Server error 或 network error
        reject(res);
        Vue.prototype.$error(res.data.data);
      }
    );
  });
}
