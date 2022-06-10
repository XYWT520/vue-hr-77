<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd(1, '0')">添加权限</el-button>
        </div>
        <el-table border :data="permissionsList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="description" />
          <el-table-column label="描述" prop="code" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text" @click="hAdd(2,row.id)">添加</el-button>
              <el-button type="text" @click="hEdit(row.id)">编辑</el-button>
              <el-button type="text" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog :visible.sync="showDialog" title="弹层标题" @close="close">
      <!-- 表单内容 -->
      <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="hSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permissions'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    // 校验权限名称 同级不能重复
    const validName = (rule, value, callback) => {
      // 添加时的校验,不能取子元素的名字
      // 每一项数据里的 pid 和 formData 里的 pid 不能相同
      let nameList = null
      if (this.isEdit) {
        // 编辑的时校验,名字不能取兄弟的名字,并且排除自己
        nameList = this.permissionsList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).map(({ name }) => name)
      } else {
        nameList = this.permissionsList.filter(item => item.pid === this.formData.pid).map(({ name }) => name)
      }
      nameList.includes(value) ? callback(new Error(value + '已存在')) : callback()
    }

    // 校验 code 标识 全局不能重复
    // const validCode = (rule, value, callback) => {
    //   // 添加时的校验：code不能重复
    //   let existCodeList = this.permissionsList
    //   if (this.isEdit) {
    //     // 编辑时的校验: code能取自己
    //     existCodeList = this.permissionsList.filter(item => item.id !== this.formData.id)
    //   }
    //   existCodeList.map(it => it.code).includes(value) ? callback(new Error(value + '已经占用')) : callback()
    // }
    return {
      permissionsList: [],
      showDialog: false,
      isEdit: false,
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
          // { validator: validCode, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.loadgetPermissionList()
  },

  methods: {
    async loadgetPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.permissionsList = tranListToTreeData(res.data)
    },

    // 两个添加按钮
    hAdd(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
      this.isEdit = false
    },

    // 添加权限 兜底校验
    async hSubmit() {
      const valid = await this.$refs.form.validate().catch(e => e)
      if (!valid) return

      this.isEdit ? this.doEdit() : this.doAdd()
    },

    // 添加
    async doAdd() {
      try {
        // 发请求
        const res = await addPermission(this.formData)
        // 提醒用户
        this.$message.success(res.message)
        // 关闭 dialog
        this.showDialog = false
        // 重现获取页面
        this.loadgetPermissionList()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 编辑
    async doEdit() {
      try {
        // 发请求
        const res = await updatePermission(this.formData)
        // 提醒用户
        this.$message.success(res.message)
        // 关闭 dialog
        this.showDialog = false
        // 重现获取页面
        this.loadgetPermissionList()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 编辑按钮
    async hEdit(id) {
      this.isEdit = true
      const res = await getPermissionDetail(id)
      // console.log(res)
      this.formData = res.data
      this.showDialog = true
    },

    // 删除按钮
    async hDel(id) {
      const reluts = await this.$confirm('确定删除?', '提示', { type: 'warning' }).catch(e => e)
      if (reluts !== 'confirm') return
      try {
        const res = await delPermission(id)
        this.$message.success(res.message)
        this.loadgetPermissionList()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 清空表单
    close() {
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-container{
  user-select:none
}
</style>
