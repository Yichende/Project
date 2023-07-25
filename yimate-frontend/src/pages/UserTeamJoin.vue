<template>
  <div id="teamPage">
    <van-search
      v-model="searchText"
      placeholder="搜索队伍"
      @search="onSearch" />
    <team-card-list :team-list="teamList" />

    <van-empty v-if="teamList?.length < 1" description="数据为空" />
    <van-button @click="test">Test</van-button>
  </div>
  <p>欢迎来到后台没传参区域 orz</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TeamCardList from "../components/TeamCardList.vue";
import myAxios from "../plugins/myAxios";
import { showFailToast } from "vant";


const searchText = ref("");

const teamList = ref([]);

// 搜索队伍
const listTeam = async(val:any = '') => {
  const res = await myAxios.get("/team/list/my/join", {
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

const test = () => {
  console.log("列表数据：",teamList.value);
}
</script>

<style scoped></style>
