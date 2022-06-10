<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in assignList " :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="closeDoalog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    id: { required: true, type: String }
  },

  data() {
    return {
      roleIds: [],
      assignList: []
    }
  },

  created() {
    this.loadgetRoles()
    this.loadgetUserDetailById()
  },

  methods: {
    // 获取用户 id
    async loadgetUserDetailById() {
      const res = await getUserDetailById(this.id)
      // console.log(res)
      this.roleIds = res.data.roleIds
    },

    // 获取角色所有信息
    async loadgetRoles() {
      const res = await getRoles()
      // console.log(res)
      this.assignList = res.data.rows
    },

    // 确定按钮
    async hSubmit() {
      const res = await assignRoles({ id: this.id, roleIds: this.roleIds })
      // console.log(res)
      // 提醒用户
      this.$message.success(res.message)
      // 关闭 dialog
      this.$emit('close')
    },

    // 取消按钮, 关闭 dialog
    closeDoalog() {
      this.$emit('close')
    },

    resetRoleIds() {
      this.roleIds = []
    }
  }
}
</script>
