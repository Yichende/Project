import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";
import User from "../pages/User.vue";
import Search from "../pages/Search.vue";
import UserEdit from "../pages/UserEdit.vue";
import SearchResult from "../pages/SearchResult.vue";
import UserLogin from "../pages/UserLogin.vue";
import TeamAdd from "../pages/TeamAdd.vue";
import TeamUpdate from "../pages/TeamUpdate.vue";
import UserUpdate from "../pages/UserUpdate.vue"
import UserTeamJoin from "../pages/UserTeamJoin.vue"
import UserTeamCreate from "../pages/UserTeamCreate.vue"

const routes = [
  { path: "/", component: Index },
  { path: "/team", name: "找队伍", component: Team },
  { path: "/user", name: "用户中心", component: User },
  { path: "/search", name: "找伙伴", component: Search },
  { path: "/user/list", name: "用户列表", component: SearchResult },
  { path: "/user/edit", name: "编辑信息", component: UserEdit },
  { path: "/user/login", name: "登录", component: UserLogin },
  { path: "/user/update", name: "个人信息", component: UserUpdate },
  { path: "/user/team/join", name: "已加入队伍", component: UserTeamJoin },
  { path: "/user/team/create", name: "已创建队伍", component: UserTeamCreate },
  { path: "/team/add", name: "创建队伍", component: TeamAdd },
  { path: "/team/update", name: "更新队伍", component: TeamUpdate },
];

export default routes;
