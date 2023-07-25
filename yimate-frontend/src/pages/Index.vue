<template>
  <van-cell
    center
    title="匹配模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" />
    </template>
  </van-cell>

  <user-card-list :user-list="userList" :loading="loading"></user-card-list>
  <van-empty
    v-if="!userList || userList.length < 1"
    description="数据为空" />
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { showSuccessToast, showFailToast } from "vant";
import myAxios from "../plugins/myAxios.ts";
import UserCardList from "../components/UserCardList.vue";
import { UserType } from "../models/user";

const isMatchMode = ref<boolean>(false);

const userList: any = ref([]);

const loading = ref<boolean>(true);

const loadData = async () => {
  let userListData;
  loading.value = true;
  // 匹配模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios
      .get("/user/match", {
        params: {
          num,
        },
      })
      .then(function (response: any) {
        console.log("/user/match succeed", response);
        showSuccessToast("请求成功");
        return response?.data;
      })
      .catch(function (error: any) {
        console.log("/user/match error", error);
        showFailToast("请求失败");
      });
  } else {
    // 普通模式
    userListData = await myAxios
      .get("/user/recommend", {
        params: {
          pageSize: 8,
          pageNum: 1,
        },
      })
      .then(function (response: any) {
        console.log("/user/recommend succeed", response);
        showSuccessToast("请求成功");
        return response?.data;
      })
      .catch(function (error: any) {
        console.log("/user/recommend error", error);
        showFailToast("请求失败");
      });
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  }
  loading.value = false;
};

watchEffect(() => {
  loadData();
});

onMounted(async () => {});
</script>

<style scoped></style>
