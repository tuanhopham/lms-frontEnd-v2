// all routes here.
/* eslint-disable */

import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  AboutUs,
  Home,
  Logout,
  NotFound,
  OIRank,
  ExperienceRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome,
  IDE,
  Forum,
  ForumList,
  ForumPost
} from "../views";

import * as Courses from "@oj/views/courses";
import * as Setting from "@oj/views/setting";
import * as Section from "@oj/views/section";
import * as Quiz from "@oj/views/quiz";
import * as Question from "@oj/views/question";
import { ACMContestHelper, ContestList, ContestRank } from "../views/contest";

export default [
  {
    name: "home",
    path: "/",
    meta: { title: "courses" },
    component: Courses.CoursesList
  },
  {
    name: "logout",
    path: "/logout",
    meta: { title: "Logout" },
    component: Logout
  },
  {
    name: "apply-reset-password",
    path: "/apply-reset-password",
    meta: { title: "Apply Reset Password" },
    component: ApplyResetPassword
  },
  {
    name: "reset-password",
    path: "/reset-password/:token",
    meta: { title: "Reset Password" },
    component: ResetPassword
  },
  // Courses
  {
    name: "courses-list",
    path: "/courses",
    meta: { title: "courses-list" },
    component: Courses.CoursesList
  },
  {
    name: "courses-details",
    path: "/courses/:coursesId",
    meta: { title: "Chi tiết khóa học" },
    component: Courses.CoursesDetail
  },
  {
    name: "section-list-user",
    path: "/courses/:coursesId/section",
    meta: { title: "Danh sách section" },
    component: Section.SectionList,
    children: [
      {
        name: "quiz-detail-user",
        path: ":sectionId/quiz/:quizId",
        meta: { title: "Quiz detail" },
        component: Quiz.QuizDetail
      },
      {
        name: "question-list-user",
        path: ":sectionId/quiz/:quizId/question",
        meta: { title: "Question list" },
        component: Question.QuestionList
      }
    ]
  },
  {
    name: "submission-details",
    path: "/status/:id/",
    meta: { title: "Chi tiết bài nộp" },
    component: SubmissionDetails
  },
  {
    name: "contest-list",
    path: "/contest",
    meta: { title: "Danh sách kỳ thi" },
    component: ContestList
  },
  {
    name: "problem-list",
    path: "/problem",
    meta: { title: "Danh sách bài tập" },
    component: ProblemList
  },
  {
    name: "problem-details",
    path: "/problem/:problemID",
    meta: { title: "Chi tiết bài tập" },
    component: Problem
  },
  {
    name: "contest-details",
    path: "/contest/:contestID/",
    meta: { title: "Chi tiết cuộc thi" },
    children: [
      {
        name: "courses-list",
        path: "/courses",
        meta: { title: "courses-list" }
      },
      {
        name: "contest-submission-list",
        path: "submissions",
        component: SubmissionList
      },

      {
        name: "contest-problem-details",
        path: "problem/:problemID/",
        component: Problem
      },
      {
        name: "contest-announcement-list",
        path: "announcements",
        component: Announcements
      },
      {
        name: "contest-rank",
        path: "rank",
        component: ContestRank
      },
      {
        name: "acm-helper",
        path: "helper",
        component: ACMContestHelper
      }
    ]
  },

  {
    path: "/setting",
    component: Setting.Settings,
    children: [
      {
        name: "default-setting",
        path: "",
        meta: { requiresAuth: true, title: "Default Settings" },
        component: Setting.ProfileSetting
      },
      {
        name: "profile-setting",
        path: "profile",
        meta: { requiresAuth: true, title: "Profile Settings" },
        component: Setting.ProfileSetting
      },
      {
        name: "account-setting",
        path: "account",
        meta: { requiresAuth: true, title: "Account Settings" },
        component: Setting.AccountSetting
      },
      {
        name: "security-setting",
        path: "security",
        meta: { requiresAuth: true, title: "Security Settings" },
        component: Setting.SecuritySetting
      }
    ]
  },
  {
    path: "/ide",
    name: "IDE",
    meta: { title: "Live IDE" },
    component: IDE
  },
  {
    name: "NotFound",
    path: "*",
    meta: { title: "404 Not Found" },
    component: NotFound
  },
  {
    name: "acm-rank",
    path: "/acm-rank",
    meta: { title: "Bảng xếp hạng ACM" },
    component: ACMRank
  },
  {
    name: "oi-rank",
    path: "/oi-rank",
    meta: { title: "Bảng xếp hạng OI" },
    component: OIRank
  },
  {
    name: "experience-rank",
    path: "/experience-rank",
    meta: { title: "Bảng xếp hạng Điểm kinh nghiệm" },
    component: ExperienceRank
  },
  {
    name: "user-home",
    path: "/user-home",
    component: UserHome,
    meta: { requiresAuth: true, title: "User Home" }
  },
  {
    path: "/judger",
    name: "judger",
    meta: { title: "Thông tin máy chấm" },
    component: About
  },
  {
    path: "/faq",
    name: "faq",
    meta: { title: "Câu hỏi thường gặp (FAQ)" },
    component: FAQ
  },
  {
    path: "/about",
    name: "AboutUs",
    meta: { title: "Về chúng tôi" },
    component: AboutUs
  },
  {
    name: "Forum-list",
    path: "/forum",
    meta: { title: "Danh sách thảo luận" },
    component: ForumList
  },
  {
    name: "Forum-post",
    path: "/post",
    meta: { title: "Tạo thảo luận" },
    component: ForumPost
  },
  {
    name: "Forum-details",
    path: "/forum/:forumpostID",
    meta: { title: "Chi tiết thảo luận" },
    component: Forum
  },
  {
    name: "submission-list",
    path: "/status",
    meta: { title: "Danh sách bài nộp" },
    component: SubmissionList
  }
];
