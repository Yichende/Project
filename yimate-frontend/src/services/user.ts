import myAxios from "../plugins/myAxios";
import { setCurrentUserState } from "../states/user";

// 封装用户请求
export const getCurrentUser = async () => {
  // const currentUser = getCurrentUserState();
  // if (currentUser) { // 存在缓存则从缓存取 （一直从缓存取，修改不了信息，暂时注释）
  //   return currentUser;
  // }

  // 不存在则从远程获取
  const res = await myAxios.get("/user/current");
  if (res.code === 0) {
    setCurrentUserState(res.data);
    return res.data;
  }
  return null;
};
