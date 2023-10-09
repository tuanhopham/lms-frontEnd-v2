/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import store, { types } from "../../store";

// 引入 view 组件
import {
  Announcement,
  Conf,
  Contest,
  ContestList,
  Home,
  JudgeServer,
  Login,
  Problem,
  ProblemList,
  User,
  PruneTestCase,
  Dashboard,
  ProblemImportOrExport,
  Courses,
  CoursesList,
  QuizList,
  Quiz,
  QuestionList,
  Question,
  SectionList,
  Section,
  UsersAnswerList,
  QuizAnswerList
} from "./views";
import { STORAGE_KEY } from "../../utils/constants";
import storage from "../../utils/storage";
import api from "./api";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "/admin/",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "/announcement",
          name: "announcement",
          component: Announcement
        },
        {
          path: "/user",
          name: "user",
          component: User
        },
        {
          path: "/conf",
          name: "conf",
          component: Conf
        },
        {
          path: "/judge-server",
          name: "judge-server",
          component: JudgeServer
        },
        {
          path: "/prune-test-case",
          name: "prune-test-case",
          component: PruneTestCase
        },
        {
          path: "/problems",
          name: "problem-list",
          component: ProblemList
        },
        {
          path: "/problem/create",
          name: "create-problem",
          component: Problem
        },
        {
          path: "/problem/edit/:problemId",
          name: "edit-problem",
          component: Problem
        },
        {
          path: "/problem/batch_ops",
          name: "problem_batch_ops",
          component: ProblemImportOrExport
        },
        // contest
        {
          path: "/contest/create",
          name: "create-contest",
          component: Contest
        },
        {
          path: "/contest",
          name: "contest-list",
          component: ContestList
        },
        {
          path: "/contest/:contestId/edit",
          name: "edit-contest",
          component: Contest
        },
        {
          path: "/contest/:contestId/announcement",
          name: "contest-announcement",
          component: Announcement
        },
        {
          path: "/contest/:contestId/problems",
          name: "contest-problem-list",
          component: ProblemList
        },
        {
          path: "/contest/:contestId/problem/create",
          name: "create-contest-problem",
          component: Problem
        },
        {
          path: "/contest/:contestId/problem/:problemId/edit",
          name: "edit-contest-problem",
          component: Problem
        },
        // courses
        {
          path: "/courses",
          name: "courses-list",
          component: CoursesList
        },
        {
          path: "/courses/create",
          name: "create-courses",
          component: Courses
        },
        {
          path: "/courses/:coursesId/edit",
          name: "edit-courses",
          component: Courses
        },
        // user-answer
        {
          path: "/courses/:coursesId/users",
          name: "courses-users",
          component: UsersAnswerList
        },
        {
          path: "courses/:coursesId/users/:userId",
          name: "quiz-user-list",
          component: QuizAnswerList
        },
        // courses-section
        {
          path: "/courses/:coursesId/section",
          name: "courses-section-list",
          component: SectionList
        },
        {
          path: "/courses/:coursesId/section/create",
          name: "create-courses-section",
          component: Section
        },
        {
          path: "/courses/:coursesId/section/:sectionId/edit",
          name: "courses-section-edit",
          component: Section
        },
        // section-quiz
        {
          path: "/section/:sectionId/quiz",
          name: "section-quiz-list",
          component: QuizList
        },
        {
          path: "/section/:sectionId/quiz/create",
          name: "create-section-quiz",
          component: Quiz
        },
        {
          path: "/section/:sectionId/quiz/:quizId/edit",
          name: "edit-section-quiz",
          component: Quiz
        },
        // quiz-question
        {
          path: "/quiz/:quizId/question",
          name: "quiz-question-list",
          component: QuestionList
        },
        {
          path: "/quiz/:quizId/question/create",
          name: "create-quiz-question",
          component: Question
        },
        {
          path: "/quiz/:quizId/question/:questionId/edit",
          name: "edit-quiz-question",
          component: Question
        },
        {
          path: "/about",
          name: "aboutus",
          component: Conf
        }
      ]
    },
    {
      path: "*",
      redirect: "/login"
    }
  ]
});
// router.beforeEach((to, from, next) => {
//   const roleUser = store.getters;
//   // Check if the route requires authentication (excluding the login route)
//   const requiresAuth = to.name !== "login";
//   if (requiresAuth && !(roleUser.isSuperAdmin || roleUser.isAdminRole)) {
//     api
//       .getProfile()
//       .then(res => {
//         if (!res.data.data) {
//           next("/login");
//         } else {
//           if (res.data.data.user.admin_type === "Regular User") {
//             next("/login");
//           } else {
//             next();
//           }
//         }
//       })
//       .catch(err => {
//         next("/login");
//       });
//   } else {
//     next();
//   }
// });

export default router;
