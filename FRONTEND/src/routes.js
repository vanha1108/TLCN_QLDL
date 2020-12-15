
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import UserProfile from "views/UserProfile.js";

var routes = [  
  {
    path: "/icons",
    name: "Quản lý tài khoản",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Upload Tài liệu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "Quản lý chủ đề",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin"
  }
];
export default routes;
