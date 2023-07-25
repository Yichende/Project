<template>
  <div id="teamPage">
    <van-search
      v-model="searchText"
      placeholder="搜索队伍"
      @search="onSearch" />

    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
    </van-tabs>

    <van-button
      class="add-button"
      icon="plus"
      type="primary"
      @click="doCreateTeam" />

    <team-card-list :team-list="teamList"/>

    <van-empty
      v-if="teamList?.length < 1"
      description="数据为空" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import myAxios from "../plugins/myAxios";
import { showFailToast } from "vant";

const active = ref('public');

const router = useRouter();
const searchText = ref('');

// 切换查询状态
const onTabChange = (name: string) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else { // 查加密
    listTeam(searchText.value, 2);
  }
}

// 跳转页面
const doCreateTeam = () => {
  router.push({
    path: "/team/add",
  });
};

const teamList = ref([]);

// 搜索队伍
const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    },
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

<style scoped>
#teamPage {
  padding-bottom: 60px;
}
</style>
