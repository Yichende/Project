import { UserType } from "./user";

// 队伍类型
export type TeamType = {
  id: number;
  userId: number;
  name: string;
  description: string;
  expireTime?: Date;
  maxNum: number;
  password?: string;
  status: number;
  hasJoin: boolean;
  createTime?: Date;
  updateTime?: Date;
  createUser?: UserType;
  hasJoinNum?: number;
};
