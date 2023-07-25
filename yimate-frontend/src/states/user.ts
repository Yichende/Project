import { UserType } from "../models/user";

// 存储用户状态
let currentUser: UserType;

const setCurrentUserState = (user: UserType) => {
  currentUser = user;
}

const getCurrentUserState = () => {
  return currentUser;
}

export {
  setCurrentUserState,
  getCurrentUserState,
}