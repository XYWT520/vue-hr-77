<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="loadDepartments()" />
      <el-tree v-if="TreeList.length" :data="TreeList" default-expand-all highlight-current :props="{ label : 'name' }" @node-click="hNodeClick" />
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('cancel')">取消</el-button>
      <el-button type="danger" @click="hSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import EmployessEnum from '@/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      hireType: EmployessEnum.hireType,
      TreeList: [],
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 正则校验
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' }
        ]
      }
    }
  },

  //   created() {
  //     this.loadDepartments()
  //   },

  methods: {
    // 获取部门列表
    async loadDepartments() {
      const res = await getDepartments()
      //   console.log(res)
      res.data.depts.shift()
      this.TreeList = tranListToTreeData(res.data.depts)
    //   console.log(this.TreeList)
    },

    // 确定按钮 兜底校验
    async hSubmit() {
      const valid = await this.$refs.addForm.validate().catch(e => e)
      if (!valid) return
      // 发送新增员工请求
      const res = await addEmployee(this.formData).catch(e => e)
      // console.log(res)
      // 提醒用户
      this.$message.success(res.message)
      // 关闭弹窗
      this.$emit('success')
    },

    hNodeClick(data) {
      // 判断是否有子节点 有就不允许添加
      if (data.children.length) return
      this.formData.departmentName = data.name
      this.TreeList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  width: 240px;
  user-select: none;
}
</style>
