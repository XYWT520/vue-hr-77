<template>
  <el-form
    ref="userForm"
    :rules="rules"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="updataUserInfo">更新</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.loadgetUserDetailById()
  },

  methods: {
    async loadgetUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      //   console.log(this.$route.query.id)
      //   console.log(res)
      this.userInfo = res.data
    },

    // 更新用户信息
    async updataUserInfo() {
      // 兜底校验
      const valid = await this.$refs.userForm.validate().catch(e => e)
      // 趁早返回
      if (!valid) return
      try {
        await saveUserDetailById(this.userInfo)
        //   console.log(res)
        //   提醒用户
        this.$message.success('修改成功')
        // 更新页面 由于是 vuex 中的数据
        this.$store.dispatch('user/getUserProfile')
      } catch (e) {
        this.$message.success(e.message)
      }
    }
  }
}
</script>

