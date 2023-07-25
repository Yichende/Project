<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="addTeamData.name"
          name="name"
          label="队伍名"
          placeholder="请输入队伍名"
          :rules="[{ required: true, message: '请输入队伍名' }]" />

        <van-field
          v-model="addTeamData.description"
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
            :v-model="addTeamData.expireTime"
            title="请选择过期时间"
            :min-date="minDate"
            @confirm="onConfirm"
            @cancel="showPicker = false" />
        </van-popup>

        <van-field
          name="stepper"
          label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" />
          </template>
        </van-field>

        <van-field
          name="radio"
          label="队伍状态">
          <template #input>
            <van-radio-group
              v-model="addTeamData.status"
              direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-if="Number(addTeamData.status) === 2"
          v-model="addTeamData.password"
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
    {{ addTeamData.expireTime }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import myAxios from "../plugins/myAxios";
import { showFailToast, showSuccessToast } from "vant";
import { useRouter } from "vue-router";
import { TeamType } from "../models/team";

const router = useRouter();

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
const addTeamData = ref({ ...initFormData });

const showPicker = ref(false);

const minDate = new Date();

const datePlaceholder = ref('点击选择时间');

// 确认时间，并优化显示
const onConfirm = ({ selectedValues }: any) => {
  addTeamData.value.expireTime = new Date(selectedValues.join('/'));
  datePlaceholder.value = addTeamData.value.expireTime.toDateString();
  showPicker.value = false;
};

const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status),
  };
  const res = await myAxios.post("/team/add", postData);
  if (res?.code === 0 && res.data) {
    showSuccessToast("添加成功");
    router.push({
      path: "/team",
      replace: true,
    });
  } else {
    showFailToast("添加失败");
    console.log("res",res);
  }
};
</script>

<style scoped></style>
