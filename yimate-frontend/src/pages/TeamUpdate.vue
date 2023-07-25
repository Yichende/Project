<template>
  <div id="teamUpdatePage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="updateTeamData.name"
          name="name"
          label="队伍名"
          placeholder="请输入队伍名"
          :rules="[{ required: true, message: '请输入队伍名' }]" />

        <van-field
          v-model="updateTeamData.description"
          rows="4"
          autosize
          label="队伍描述"
          type="textarea"
          placeholder="请输入队伍描述" />

        <van-field
          is-link
          readonly
          name="datePicker"
          label="过期时间"
          :placeholder="datePlaceholder"
          @click="showPicker = true" />
        <van-popup
          v-model:show="showPicker"
          position="bottom">
          <van-date-picker
            :v-model="updateTeamData.expireTime"
            title="请选择过期时间"
            :min-date="minDate"
            @confirm="onConfirm"
            @cancel="showPicker = false" />
        </van-popup>

        <van-field
          name="radio"
          label="队伍状态">
          <template #input>
            <van-radio-group
              v-model="updateTeamData.status"
              direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-if="Number(updateTeamData.status) === 2"
          v-model="updateTeamData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入队伍密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    {{ updateTeamData.expireTime }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import myAxios from "../plugins/myAxios";
import { showFailToast, showSuccessToast } from "vant";
import { useRouter, useRoute } from "vue-router";
import { TeamType } from "../models/team";


const router = useRouter();
const route = useRoute();

const showPicker = ref(false);

const minDate = new Date();

const datePlaceholder = ref("点击选择时间");

const id = route.query.id as any;

const initFormData: TeamType = {
  id: 0,
  userId: 0,
  name: "",
  description: "",
  expireTime: new Date('2023-06-01'),
  maxNum: 3,
  password: "",
  status: 0,
  hasJoin: false,
};

// 用户填写的表单数据
const updateTeamData = ref({...initFormData});

// 获取之前的队伍信息
onMounted(async () => {
  if (id <= 0) {
    showFailToast("加载队伍失败");
    return;
  }
  const res = await myAxios.get("/team/list", {
    params: {
      id,
    },
  });
  if (res.code === 0) {
    updateTeamData.value = res.data[0];
    // console.log("我是data：", typeof(updateTeamData.value.expireTime));
    datePlaceholder.value = new Date(updateTeamData.value.expireTime!).toDateString();
    // console.log("我是datePlaceholder：", datePlaceholder.value);
  } else {
    showFailToast("加载队伍失败，请刷新重试");
  }
});

const onConfirm = ({ selectedValues }: any) => {
  updateTeamData.value.expireTime = new Date(selectedValues.join("/"));
  datePlaceholder.value = updateTeamData.value.expireTime.toDateString();
  showPicker.value = false;
};

const onSubmit = async () => {
  const postData = {
    ...updateTeamData.value,
    status: Number(updateTeamData.value.status),
  };
  const res = await myAxios.post("/team/update", postData);
  if (res?.code === 0 && res.data) {
    showSuccessToast("更新成功");
    router.push({
      path: "/team",
      replace: true,
    });
  } else {
    showFailToast("更新失败");
    console.log("res", res);
  }
};
</script>

<style scoped></style>
