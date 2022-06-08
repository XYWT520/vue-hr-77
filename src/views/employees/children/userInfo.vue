<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form
      ref="userForm"
      label-width="220px"
      :model="userInfo"
      :rules="rules"
    >
      <!--手机 -->

      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userInfo.mobile" style="width:220px" />
      </el-form-item>

      <!-- 工号 入职时间 -->

      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="userInfo.timeOfEntry"
          type="date"
          class="inputW"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <!-- 员工照片 -->

      <el-form-item label="员工头像">
        <!-- 放置上传图片 -->
        <UploadImg :value="userInfo.staffPhoto" @input="e => userInfo.staffPhoto = e " />
        <img>
      </el-form-item>

      <!-- 保存个人信息 -->
      <el-form-item>
        <el-button type="primary" @click="updataUserInfo">保存更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UploadImg from '@/components/UploadImg'
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {
        mobile: '',
        timeOfEntry: '',
        staffPhoto: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        timeOfEntry: [
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

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
