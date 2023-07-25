<template>
  <div
    id="teamCardList"
    v-if="isRouterAlive">
    <van-card
      v-for="team in props.teamList"
      :thumb="BF"
      :desc="team.description"
      :title="`${team.name}`">
      <template #tags>
        <van-tag
          style="margin-right: 8px; margin-top: 8px"
          plain
          type="primary"
          >{{ teamStatusEnum[team.status] }}</van-tag
        >
      </template>
      <template #bottom>
        <div>
          {{ `队伍人数： ${team.hasJoinNum} / ${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{ "过期时间： " + team.expireTime }}
        </div>
        <div>
          {{ "创建时间： " + team.createTime }}
        </div>
      </template>
      <template #footer>
        <van-button
          v-if="team.userId !== currentUser?.id && !team.hasJoin"
          size="small"
          plain
          type="primary"
          @click="preJoinTeam(team)"
          >加入队伍</van-button
        >
        <van-button
          v-if="team.userId === currentUser?.id"
          size="small"
          plain
          @click="doUpdateTeam(team.id)"
          >更新队伍</van-button
        >
        <van-button
          v-if="team.userId !== currentUser?.id && team.hasJoin"
          size="small"
          plain
          @click="doQuitTeam(team.id)"
          >退出队伍</van-button
        >
        <van-button
          v-if="team.userId === currentUser?.id"
          size="small"
          plain
          @click="doDeleteTeam(team.id)"
          type="danger"
          >解散队伍</van-button
        >
      </template>
    </van-card>

    <van-dialog
      v-model:show="showPasswordDialog"
      title="请输入密码"
      show-cancel-button
      @confirm="doJoinTeam"
      @cancel="doJoinCancel">
      <van-field
        v-model="password"
        placeholder="请输入密码" />
    </van-dialog>

    <van-button
      size="small"
      plain
      @click="reLoading"
      type="danger"
      >刷新</van-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TeamType } from "../models/team";
import { teamStatusEnum } from "../constants/team";
import BF from "../assets/BF.jpeg";
import myAxios from "../plugins/myAxios";
import { showSuccessToast, showFailToast } from "vant";
import { getCurrentUser } from "../services/user";
import { useRouter } from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[];
}
const props = withDefaults(defineProps<TeamCardListProps>(), {
  teamList: <never>[],
});

const currentUser = ref();

const router = useRouter();

// 更新队伍，跳转至更新队伍页面
const doUpdateTeam = (id: number) => {
  router.push({
    path: "/team/update",
    query: {
      id: id,
    },
  });
};

// 退出队伍
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post("/team/quit", {
    teamId: id,
  });
  if (res.code === 0) {
    showSuccessToast("退出成功");
  } else {
    showFailToast({
      message: "退出失败" + (res.description ? `，${res.description}` : ""),
      wordBreak: "normal",
    });
  }
};

// 解散队伍
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post("/team/delete", {
    id,
  });
  if (res.code === 0) {
    showSuccessToast("已解散");
  } else {
    showFailToast({
      message: "解散失败" + (res.description ? `，${res.description}` : ""),
      wordBreak: "normal",
    });
  }
};

onMounted(async () => {
  currentUser.value = await getCurrentUser();
});

const showPasswordDialog = ref(false);
const password = ref("");
const joinTeamId = ref();

const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam();
  } else {
    showPasswordDialog.value = true;
  }
};

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = "";
};

// 加入队伍
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post("/team/join", {
    teamId: joinTeamId.value,
    password: password.value,
  });
  if (res.code === 0) {
    showSuccessToast("加入成功");
    doJoinCancel();
  } else {
    showFailToast({
      message: "加入失败" + (res.description ? `，${res.description}` : ""),
      wordBreak: "normal",
    });
  }
};

const isRouterAlive = ref(true);
const test = ref('');

const reLoading = () => {
  isRouterAlive.value = false;
  test.value = '刷新中';
  console.log("刷新状态：",test.value)
  setTimeout(async () => {
    isRouterAlive.value = true;
    test.value = '刷新完成';
    console.log("刷新状态：",test.value)
    showSuccessToast("刷新完成");
  }, 5000);
};
</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
}
</style>
