<template>
  <div v-if="user">
    <van-cell
      title="昵称"
      is-link
      to="/user/edit"
      :value="user.username"
      @click="toEdit('username', '昵称', user.username)" />
    <van-cell
      title="账号"
      is-link
      to="/user/edit"
      :value="user.userAccount" />
    <van-cell
      title="头像"
      is-link
      to="/user/edit">
      <img
        style="height: 48px"
        :src="user.avatarUrl" />
    </van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender"
      @click="toEdit('gender', '性别', user.gender)" />
    <van-cell
      title="电话"
      is-link
      to="/user/edit"
      :value="user.phone" />
    <van-cell
      title="邮箱"
      is-link
      to="/user/edit"
      :value="user.email"
      @click="toEdit('email', '邮箱', user.email)" />
    <van-cell
      title="编号"
      :value="user.planetCode" />
    <van-cell
      title="注册时间"
      :value="user.createTime" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// import myAxios from "../plugins/myAxios.ts";
// import { showFailToast, showSuccessToast } from "vant";
import { getCurrentUser } from "../services/user";
// import qs from 'qs';

// const user = {
//   id: 1,
//   username: 'czx',
//   userAccount: '957131',
//   avatarUrl: "http://pan.yichend.top/img/90405423.png?imgslim",
//   gender: '男',
//   phone: 13714120345,
//   email: "youxiang@qq.com",
//   planetCode: '1234',
//   createTime: new Date(),
// }

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
});

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: "/user/edit",
    query: {
      editKey,
      editName,
      currentValue,
    },
  });
};
</script>

<style scoped></style>
