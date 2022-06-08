<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <loginSetting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <userInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <jobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import loginSetting from './children/loginSetting.vue'
import userInfo from './children/userInfo.vue'
import jobInfo from './children/jobInfo.vue'
export default {
  components: {
    loginSetting,
    userInfo,
    jobInfo
  }
}
</script>
