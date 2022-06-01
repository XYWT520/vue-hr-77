<template>
  <el-form ref="deptForm" label-width="120px">
    <el-form-item label="部门名称">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option v-for="item in getSimple " :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍">
      <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
      <el-button size="small" @click="hCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getSimple } from '@/api/employees'
import { setDepartments, getDepartDetail, updateDepartDetail } from '@/api/departments'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    isEdit: { type: Boolean, required: true }
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      getSimple: ''
    }
  },

  created() {
    this.getSonSimple()
    this.loadDetail()
  },

  methods: {
    // 获取部门负责人
    async getSonSimple() {
      const res = await getSimple()
      //   console.log(res)
      this.getSimple = res.data
    },

    // 获取部门详情 数据回填
    async loadDetail() {
      if (!this.isEdit) return
      const res = await getDepartDetail(this.id)
      console.log(res)
      this.form = res.data
    },

    // 确定按钮
    hSubmit() {
      if (this.isEdit) {
        this.doisEdit()
      } else {
        this.doAdd()
      }
    },

    // 编辑的
    async doisEdit() {
      try {
        const res = await updateDepartDetail(this.form)
        // console.log(res)
        // 提醒用户
        this.$message.success(res.message)
        //   关闭弹出框
        this.$emit('success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 添加的
    async doAdd() {
      try {
        // 合并数据
        this.form.pid = this.id
        const res = await setDepartments(this.form)
        // console.log(res)
        // 提醒用户
        this.$message.success(res.message)
        //   关闭弹出框
        this.$emit('success')
      } catch (e) {
        this.$message.success(e.message)
      }
    },

    // 取消按钮
    hCancel() {

    }
  }
}
</script>

<style>

</style>
