
import Notifications from "views/Notifications.js";
import Maps from "views/Map.js"

var routesuser = [
  {
    path: "/notifications",
    name: "Tài liệu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/user"
  },
  {
    path: "/map",
    name: "Upload Tài liệu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Maps,
    layout: "/user"
  }
];
export default routesuser;