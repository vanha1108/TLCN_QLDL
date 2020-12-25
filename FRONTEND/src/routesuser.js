
import Notifications from "views/Notifications.js";
import Maps from "views/Map.js"
import UserProfile from "views/UserProfile.js";
var routesuser = [
  {
    path: "/notifications",
    name: "Document",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/user"
  },
  {
    path: "/map",
    name: "Upload Document",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Maps,
    layout: "/user"
  },
  {
    path: "/user-profile",
    name: "Manage theme",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin"
  }
];
export default routesuser;