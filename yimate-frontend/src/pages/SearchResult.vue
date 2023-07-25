<template>
  <user-card-list :user-list="userList" :loading="loading"></user-card-list>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空" />

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { showSuccessToast, showFailToast } from 'vant';
import myAxios from "../plugins/myAxios.ts";
import qs from 'qs';
import UserCardList from "../components/UserCardList.vue";
// import { UserType } from "../models/user";

const route = useRoute();
const userList:any = ref([]);


const { tags } = route.query;

const loading = ref<boolean>(true);

onMounted( async() => {
  loading.value = true;
  // Optionally the request above could also be done as
  const userListData = await myAxios
    .get('/user/search/tags', {
      params: {
        tagNameList: tags
      },
      paramsSerializer: params => { // 序列化
        return qs.stringify(params, { indices: false })
      }
    })
    .then(function (response:any) {
      console.log('/user/search/tags succeed',response);
      showSuccessToast('请求成功');
      return response?.data;
    })
    .catch(function (error:any) {
      console.log('/user/search/tags error',error);
      showFailToast('请求失败');
    })
    if (userListData) {
      userListData.forEach((user:any) => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags);
        }
      })
      userList.value = userListData;
    }
    loading.value = false;
});

// const mockUser = {
//   id: 23333,
//   username: "czx",
//   userAccount: 12314,
//   profile: "这里是个人简介,因为要长一点，所以阿巴巴巴巴巴巴巴变阿巴巴巴",
//   avatarUrl: "http://pan.yichend.top/img/90405423.png?imgslim",
//   gender: 0,
//   phone: 13714124125,
//   email: "41542563@youxiang.com",
//   userRole: "number",
//   planetCode: "52352",
//   tags: ["html", "emo", "VUe", "233334"],
//   createTime: new Date(),
// };

</script>

<style scoped></style>
