<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="editUser.currentValue"
      :name="editUser.editKey"
      :label="editUser.editName"
      :placeholder="`请输入${editUser.editName}`" />
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit">
        确认修改
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import myAxios from "../plugins/myAxios";
import { showSuccessToast, showFailToast } from "vant";
import { getCurrentUser } from "../services/user";

const route = useRoute();
const router = useRouter();

const editUser = ref({
  editKey: route.query.editKey as string,
  currentValue: route.query.currentValue as string,
  editName: route.query.editName as string,
});

const onSubmit = async () => {
  const currentUser =await getCurrentUser();
  if (!currentUser) {
    showFailToast('用户未登录');
    return;
  }

  const res = await myAxios.post("/user/update", {
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  });
  console.log("更新请求");
  if (res.code === 0 && res.data > 0) {
    showSuccessToast("修改成功");
    router.back();
  } else {
    showFailToast("修改失败");
  }
};
</script>

<style scoped></style>
