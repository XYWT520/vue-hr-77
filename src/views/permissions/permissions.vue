<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd">添加权限</el-button>
        </div>
        <el-table border :data="permissionsList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="description" />
          <el-table-column label="描述" prop="code" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible.sync="showDialog" title="弹层标题">
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
import { getPermissionList } from '@/api/permissions'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      permissionsList: [],
      showDialog: false,
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
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
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

    hAdd() {
      this.showDialog = true
    },
    // 添加权限 兜底校验
    async hSubmit() {
      const valid = await this.$refs.form.validate().catch(e => e)
      if (!valid) return
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-container{
  user-select:none
}
</style>
