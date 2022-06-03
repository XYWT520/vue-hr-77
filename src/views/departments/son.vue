<template>
  <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option v-for="item in getSimple " :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
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
    isEdit: {
      type: Boolean,
      required: true
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义校验 部门编码
    const vaildCode = (rule, value, callback) => {
      // console.log('用户输入的值是', value)
      // 需求: 校验 value 是否在 originList 数组中存在
      // 1. some 查找数组中是否有对应的元素 有就返回 true, 并停止循环 没有就返回 false
      // 2. includes 只能校验基本数据类型 不能校验复杂数据类型
      // console.log(this.originList)
      let codeList = null
      // console.log(codeList)

      // 编辑状态的表单校验
      if (this.isEdit) {
        // 编辑状态
        codeList = this.originList.filter(item => item.id !== this.id).map(({ code }) => code)
      } else {
        // 添加状态
        codeList = this.originList.map(({ code }) => code)
      }

      if (codeList.includes(value)) {
        // 如果用户输入的值已存在 则不允许添加
        callback(new Error(value + '已存在'))
      } else {
        callback()
      }
    }

    // 自定义校验 部门名称
    const vaildName = (rule, value, callback) => {
      // 需求: 部门名称不允许重复
      // 1. 添加时不允许和子部门名称重复
      // 2. 编辑时不允许和兄弟部门重复
      // const nameList = null

      // 找到当前子部门的 id
      // this.id => 当前点击的部门
      let children = null
      // console.log(children)
      if (this.isEdit) {
        // 根据当前点击的部门的 id 找到父部门的 id
        const pid = this.originList.find(item => item.id === this.id).pid
        // 根据 pid 过滤出 所有子部门,就是兄弟部门了
        children = this.originList.filter(item => item.pid === pid && item.id !== this.id).map(({ name }) => name)
      } else {
        children = this.originList.filter(item => item.pid === this.id).map(({ name }) => name)
      }
      children.includes(value) ? callback(new Error(value + '已存在')) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '请输入2-50个字符', trigger: ['change', 'blur'] },
          { validator: vaildName, trigger: ['change', 'blur'] }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '请输入2-50个字符', trigger: ['change', 'blur'] },
          { validator: vaildCode, trigger: ['change', 'blur'] }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: ['change', 'blur'] }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: ['change', 'blur'] },
          { min: 2, max: 300, message: '请输入2-300个字符', trigger: ['change', 'blur'] }
        ]
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
      // console.log(res)
      this.form = res.data
    },

    // 确定按钮
    hSubmit() {
      this.$refs.deptForm.validate(valid => {
        if (!valid) return // 趁早返回
        if (this.isEdit) {
          this.doisEdit()
        } else {
          this.doAdd()
        }
      })
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
      this.$emit('hcolse')
    }
  }
}
</script>

<style>

</style>
