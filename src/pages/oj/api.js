/* eslint-disable */

import Vue from "vue";
import store from "@/store";
import axios from "axios";

Vue.prototype.$http = axios;
axios.defaults.baseURL = "/api";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// const queryParams = (params) => {
//   let query = ''
//   for (const [key, value] of Object.entries(params)) {
//     if (value !== '' && value !== null && value !== undefined) {
//       query += `${key}=${value}&`
//     }
//   }
//   return query ? query.substring(0, query.length - 1) : ''
// }

export default {
  getWebsiteConf(params) {
    return ajax("website", "get", {
      params
    });
  },
  getAnnouncementList(offset, limit) {
    let params = {
      offset: offset,
      limit: limit
    };
    return ajax("announcement", "get", {
      params
    });
  },
  getAboutUs() {
    return ajax("aboutus", "get");
  },
  login(data) {
    return ajax("login", "post", {
      data
    });
  },
  loginWithGoogle(data) {
    return ajax("loginGoogle", "post", {
      data
    });
  },
  checkUsernameOrEmail(username, email) {
    return ajax("check_username_or_email", "post", {
      data: {
        username,
        email
      }
    });
  },
  // 注册
  register(data) {
    return ajax("register", "post", {
      data
    });
  },
  logout() {
    return ajax("logout", "get");
  },
  getCaptcha() {
    return ajax("captcha", "get");
  },
  getUserInfo(username = undefined) {
    return ajax("profile", "get", {
      params: {
        username
      }
    });
  },
  updateProfile(profile) {
    return ajax("profile", "put", {
      data: profile
    });
  },
  freshDisplayID(userID) {
    return ajax("profile/fresh_display_id", "get", {
      params: {
        user_id: userID
      }
    });
  },
  twoFactorAuth(method, data) {
    return ajax("two_factor_auth", method, {
      data
    });
  },
  tfaRequiredCheck(username) {
    return ajax("tfa_required", "post", {
      data: {
        username
      }
    });
  },
  getSessions() {
    return ajax("sessions", "get");
  },
  deleteSession(sessionKey) {
    return ajax("sessions", "delete", {
      params: {
        session_key: sessionKey
      }
    });
  },
  applyResetPassword(data) {
    return ajax("apply_reset_password", "post", {
      data
    });
  },
  resetPassword(data) {
    return ajax("reset_password", "post", {
      data
    });
  },
  changePassword(data) {
    return ajax("change_password", "post", {
      data
    });
  },
  changeEmail(data) {
    return ajax("change_email", "post", {
      data
    });
  },
  getLanguages() {
    return ajax("languages", "get");
  },
  getProblemTagList() {
    return ajax("problem/tags", "get");
  },
  getProblemList(offset, limit, searchParams) {
    let params = {
      paging: true,
      offset,
      limit
    };
    Object.keys(searchParams).forEach(element => {
      if (searchParams[element]) {
        params[element] = searchParams[element];
      }
    });
    return ajax("problem", "get", {
      params: params
    });
  },
  pickone() {
    return ajax("pickone", "get");
  },
  getProblem(problemID) {
    return ajax("problem", "get", {
      params: {
        problem_id: problemID
      }
    });
  },
  getContestList(offset, limit, searchParams) {
    let params = {
      offset,
      limit
    };
    if (searchParams !== undefined) {
      Object.keys(searchParams).forEach(element => {
        if (searchParams[element]) {
          params[element] = searchParams[element];
        }
      });
    }
    return ajax("contests", "get", {
      params
    });
  },
  // Courses
  getCoursesUserList(params) {
    return ajax(`user/courses`, "get", {
      params: {
        ...params
      }
    });
  },
  getCoursesDetail(params) {
    return ajax(`courses`, "get", {
      params: {
        ...params
      }
    });
  },
  startTimeCourseUser(courseId) {
    return ajax(`startCourse/${courseId}`, "get", {
      params: { courseId }
    });
  },
  // Section
  getSectionList(courseid, params) {
    return ajax(`user/courses/${courseid}/section`, "get", {
      params: {
        ...params
      }
    });
  },
  // get quiz
  getSectionQuizdetail(sectionId, id) {
    return ajax(`user/section/${sectionId}/quiz/${id}`, "get", {});
  },
  // set timestart
  postSectionQuizdetail(courseId, sectionId, id) {
    return ajax(
      `course/${courseId}/section/${sectionId}/quiz/${id}/quizUser`,
      "post",
      {}
    );
  },
  postToGetAnswer(data) {
    return ajax(`getQuizUserById`, "post", {
      data
    });
  },
  postSaveOneAnswer(data) {
    return ajax(`question/answersUser`, "post", {
      data
    });
  },
  postAnswerApi(data) {
    console.log("====data==API====", data);
    return ajax(`answer`, "post", {
      data
    });
  },
  getQuizQuestionList(quizId, params) {
    return ajax(`user/quiz/${quizId}/question`, "get", {
      params: { ...params }
    });
  },
  getQuizQuestionDetail(quizId, id, params) {
    return ajax(`user/quiz/${quizId}/question/${id}`, "get", {
      params: {
        ...params
      }
    });
  },
  getQuizList(sectionId) {
    return ajax(`section/${sectionId}/quiz`, "get", {});
  },
  getQuestionList(quizId) {
    return ajax(`quiz/${quizId}/question`, "get", {});
  },
  // check quiz user
  checkQuizUser() {
    return ajax(`checkQuizOfUser`, "post", {});
  },
  // test course user
  postCourseUserAnswer(coursesId) {
    return ajax(`courses/${coursesId}/users`, "post", {});
  },
  pushSubmitQuiz(courseId, sectionId, quizId, quizUserId) {
    return ajax(
      `course/${courseId}/section/${sectionId}/quiz/${quizId}/quizUser/${quizUserId}`,
      "put",
      {}
    );
  },
  getAnswer(quizId) {
    return ajax(`${quizId}/answer`, "get", {});
  },
  // Quiz User
  postQuizUser(courseId, sectionId, quizId) {
    return ajax(
      `course/${courseId}/section/${sectionId}/quiz/${quizId}/quizUser`,
      "post",
      {}
    );
  },
  // Question User
  createAnswer(quizUserId) {
    return ajax(`createAnswers/${quizUserId}`, "get", {});
  },
  saveAnswer(data) {
    return ajax(`question/answersUser`, "post", {
      data
    });
  },
  getQuestionsave(data) {
    return ajax(`getQuizUserById`, "post", {});
  },
  getContest(id) {
    return ajax("contest", "get", {
      params: {
        id
      }
    });
  },
  getContestAccess(contestID) {
    return ajax("contest/access", "get", {
      params: {
        contest_id: contestID
      }
    });
  },
  checkContestPassword(contestID, password) {
    return ajax("contest/password", "post", {
      data: {
        contest_id: contestID,
        password
      }
    });
  },
  getContestAnnouncementList(contestId) {
    return ajax("contest/announcement", "get", {
      params: {
        contest_id: contestId
      }
    });
  },
  getContestProblemList(contestId) {
    return ajax("contest/problem", "get", {
      params: {
        contest_id: contestId
      }
    });
  },
  getContestProblem(problemID, contestID) {
    return ajax("contest/problem", "get", {
      params: {
        contest_id: contestID,
        problem_id: problemID
      }
    });
  },
  submitCode(data) {
    return ajax("submission", "post", {
      data
    });
  },
  getSubmissionList(offset, limit, params) {
    params.limit = limit;
    params.offset = offset;
    return ajax("submissions", "get", {
      params
    });
  },
  getContestSubmissionList(offset, limit, params) {
    params.limit = limit;
    params.offset = offset;
    return ajax("contest_submissions", "get", {
      params
    });
  },
  getSubmission(id) {
    return ajax("submission", "get", {
      params: {
        id
      }
    });
  },
  submissionExists(problemID) {
    return ajax("submission_exists", "get", {
      params: {
        problem_id: problemID
      }
    });
  },
  submissionRejudge(id) {
    return ajax("admin/submission/rejudge", "get", {
      params: {
        id
      }
    });
  },
  updateSubmission(data) {
    return ajax("submission", "put", {
      data
    });
  },
  getUserRank(offset, limit, rule = "acm") {
    let params = {
      offset,
      limit,
      rule
    };
    return ajax("user_rank", "get", {
      params
    });
  },
  getContestRank(params) {
    return ajax("contest_rank", "get", {
      params
    });
  },
  getACMACInfo(params) {
    return ajax("admin/contest/acm_helper", "get", {
      params
    });
  },
  updateACInfoCheckedStatus(data) {
    return ajax("admin/contest/acm_helper", "put", {
      data
    });
  },
  IDE(data) {
    return ajax("ide", "post", {
      data
    });
  },
  GetSighinStatus() {
    return ajax("sighin", "get");
  },
  UserSighin() {
    return ajax("sighin", "post");
  },
  getForumList(offset, limit, searchParams) {
    let params = {
      paging: true,
      offset,
      limit
    };
    Object.keys(searchParams).forEach(element => {
      if (searchParams[element]) {
        params[element] = searchParams[element];
      }
    });
    return ajax("forumpost", "get", {
      params: params
    });
  },
  getForum(forumpostID) {
    return ajax("forumpost", "get", {
      params: {
        forumpost_id: forumpostID
      }
    });
  },
  submitFourmPost(data) {
    return ajax("forumpost", "post", {
      data
    });
  },
  deleteFourmPost(forumpostID) {
    let params = {
      forumpost_id: forumpostID
    };
    return ajax("forumpost", "delete", {
      params: params
    });
  },
  getForumReplyList(offset, limit, forumpostID) {
    let params = {
      paging: true,
      offset,
      limit,
      fa_id: forumpostID
    };
    return ajax("forumreply", "get", {
      params: params
    });
  },
  submitFourmReply(data) {
    return ajax("forumreply", "post", {
      data
    });
  },
  deleteFourmReply(id) {
    let params = {
      id: id
    };
    return ajax("forumreply", "delete", {
      params: params
    });
  },
  getDashboardInfo() {
    return ajax("dashboard_info", "get");
  }
};

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax(url, method, options) {
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
        if (res.data && res.data.error && res.data.error !== null) {
          Vue.prototype.$error(res.data.data);
          reject(res);
          // 若后端返回为登录，则为session失效，应退出当前登录用户
          if (
            res.data &&
            res.data.data &&
            res.data.data.startsWith("Please login")
          ) {
            store.dispatch("changeModalStatus", {
              mode: "login",
              visible: true
            });
          }
        } else {
          resolve(res);
          // if (method !== 'get') {
          //   Vue.prototype.$success('Succeeded')
          // }
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
