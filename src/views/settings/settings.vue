<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="hAdd"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roles">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="showDialogAssign=true">分配权限</el-button>
                  <el-button size="small" type="primary" @click="hEdit(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="remove(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="q.page"
                :page-sizes="[2,,3,5,10]"
                :page-size="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>

          <!-- 新增弹框 -->
          <el-dialog
            title="编辑弹层"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="showDialog"
            @close="hClose"
          >
            <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleForm.name" />
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="roleForm.description" />
              </el-form-item>
            </el-form>
            <!-- 底部 -->
            <el-row slot="footer" type="flex" justify="center">
              <el-col :span="6">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
              </el-col>
            </el-row>
          </el-dialog>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog
      :visible.sync="showDialogAssign"
      title="分配权限"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <assignPermission @guanbi="showDialogAssign=false" />
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRoles, deleteRoles, updateRole } from '@/api/setting'
import assignPermission from './assignPermission.vue'
export default {
  components: {
    assignPermission
  },
  data() {
    return {
      roles: [],
      total: 0,
      showDialog: false,
      isEdit: false,
      showDialogAssign: false,

      roleForm: {
        name: '',
        description: ''
      },

      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称为2-10个字符', trigger: 'blur' }
        ]
      },

      q: {
        page: 1,
        pagesize: 10
      }
    }
  },

  created() {
    this.loadRoles()
  },

  methods: {
    handleSizeChange(pagesize) {
      this.q.pagesize = pagesize
      this.loadRoles()
    },
    handleCurrentChange(page) {
      this.q.page = page
      this.loadRoles()
    },

    // 获取角色列表 后期可用来重新渲染数据
    async loadRoles() {
      try {
        const res = await getRoles(this.q)
        // console.log(res)
        this.roles = res.data.rows
        this.total = res.data.total
      } catch (e) {
        console.log(e)
      }
    },

    // 新增模块
    hAdd() {
      this.isEdit = false
      this.showDialog = true
    },

    // 弹出框的取消按钮
    cancel() {
      this.showDialog = false
    },

    // 弹出框的确定按钮
    async hSubmit() {
      const valid = await this.$refs.roleForm.validate()
      if (!valid) return
      if (this.isEdit) {
        this.doEdit()
      } else {
        this.doAdd()
      }
    },

    // 添加角色
    async doAdd() {
      const res = await addRoles(this.roleForm).catch(e => e)
      // 判断 如果返回的 code 不等于 10000 那么久提醒用户
      if (res.code !== 10000) return this.$message.error('请求超时,请重试!')
      // console.log(res)
      // 提醒用户
      this.$message.success(res.message)
      // 关闭弹框
      this.showDialog = false
      // 如果总条数除以当前的几条每页 余 0  那么久将 total 加1
      // 当最后一个满了,将 total 加一
      if (this.total % this.q.pagesize === 0) {
        this.total++
      }
      // 跳到最后一页
      this.q.page = Math.ceil(this.total / this.q.pagesize)
      // 重新渲染页面
      this.loadRoles()
    },

    // 编辑角色
    async doEdit() {
      const res = await updateRole(this.roleForm).catch(e => e)
      // 判断 如果返回的 code 不等于 10000 那么久提醒用户
      if (res.code !== 10000) return this.$message.error('请求超时,请重试!')
      // console.log(res)
      // 提醒用户
      this.$message.success(res.message)
      // 关闭弹框
      this.showDialog = false
      // 重新渲染页面
      this.loadRoles()
    },

    // 关闭 dialog 的回调 清空表单
    hClose() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },

    // 编辑模块
    hEdit(row) {
      this.roleForm = { ...row }
      this.showDialog = true
      this.isEdit = true
    },

    // 删除模块
    remove(id) {
      this.$confirm('确定删除?', '提示', { type: 'warning' })
        .then(async() => {
          try {
            const res = await deleteRoles(id)
            // console.log(res)
            // 提醒用户
            this.$message.success(res.message)
            // 修复删除 bug
            // 当我删除的只剩余最后一条数据时,判断数组的长度是否等于 1 ,并且当前的条数要大于 1
            if (this.roles.length === 1 && this.q.page > 1) {
              this.q.page--
            }
            // 重新渲染页面
            this.loadRoles()
          } catch (e) {
            this.$message.error(e.message)
          }
        }).catch(() => {})
    }

    // 分配权限分配权限分配权限分配权限分配权限分配权限分配权限分配权限

  }
}
</script>
