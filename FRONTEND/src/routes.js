
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import UserProfile from "views/UserProfile.js";
import Maps from "views/Map.js"
var routes = [  
  {
    path: "/icons",
    name: "Manage users",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Documents",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/map",
    name: "Upload Document",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "Manage Category",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin"
  }
];
export default routes;
