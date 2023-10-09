/* eslint-disable */

import api from "../../pages/admin/api";

const state = {
  courseUser: {
    users: [],
    courseUser: []
  }
};

const getters = {
  // courseUser
  courseUser: state => state.courseUser.courseUser,
  UsersNotInCourse: state => state.courseUser.users
};

const mutations = {
  changeUsersNotInCourseData(state, payload) {
    state.courseUser.users = payload;
  },
  changeCoursesUserData(state, payload) {
    state.courseUser.courseUser = payload;
  }
};

const actions = {
  getCourseUser({ commit }, courseId) {
    api
      .getCoursesUser(courseId)
      .then(res => {
        const users = res.data.Users;
        commit("changeUsersNotInCourseData", users);
        const courseUser = res.data.CourseUser;
        commit("changeCoursesUserData", courseUser);
      })
      .catch(err => {
        console.error(err);
      });
  },
  moveToCourseUser({ commit, state }, item) {
    const newUser = state.courseUser.users.filter(
      user => user.email !== item.email
    );
    commit("changeUsersNotInCourseData", newUser);
    delete item.id;
    const newItem = { ...item, typeUser: "Member" };
    commit("changeCoursesUserData", [...state.courseUser.courseUser, newItem]);
  },
  moveToUser({ commit, state }, item) {
    const newCourseUser = state.courseUser.courseUser.filter(
      user => user.email !== item.email
    );
    delete item.id;
    commit("changeUsersNotInCourseData", [...state.courseUser.users, item]);
    commit("changeCoursesUserData", newCourseUser);
  },
  changeTypeUser({ commit, state }, item) {
    const userIndex = state.courseUser.courseUser.findIndex(
      obj => obj.email == item.email
    );
    delete item.id;
    if (userIndex !== -1) {
      state.courseUser.courseUser[userIndex] = item;
      commit("changeCoursesUserData", state.courseUser.courseUser);
    }
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
