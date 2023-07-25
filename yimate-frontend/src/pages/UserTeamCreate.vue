<template>
  <div id="teamPage">
    <van-search
      v-model="searchText"
      placeholder="搜索队伍"
      @search="onSearch" />
    <van-button
      type="primary"
      @click="doCreateTeam"
      >创建队伍</van-button
    >
    <team-card-list :team-list="teamList" />
    <van-empty v-if="teamList?.length < 1" description="数据为空" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import myAxios from "../plugins/myAxios";
import { showFailToast } from "vant";

const router = useRouter();
const searchText = ref("");

// 跳转页面
const doCreateTeam = () => {
  router.push({
    path: "/team/add",
  });
};

const teamList = ref([]);

// 搜索队伍
const listTeam = async(val:any = '') => {
  const res = await myAxios.get("/team/list/my/create", {
    params: {
      searchText: val,
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    showFailToast("加载队伍失败，请刷新重试");
  }
};

onMounted(() => {
  listTeam();
});

const onSearch = (val: any) => {
  listTeam(val);
};
</script>

<style scoped></style>
