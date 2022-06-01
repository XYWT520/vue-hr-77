<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="home" /><span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="hshowAdd">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-tree default-expand-all :data="list">
          <template v-slot="{data}">
            <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
              <el-col :span="20">
                <svg-icon icon-class="home" /><span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hshowAdd(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hshowEdit(data.id)">编辑子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hDelete(data.id)">删除子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <el-tree />
        </el-tree>
      </el-card>
    </div>
    <!-- 添加的 dialog -->
    <el-dialog
      title="添加"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showVisible"
    >
      <span slot="footer" class="dialog-footer" />
      <addOrEdit :id="curId" :is-edit="isEdit" @success="hsuccess" />
    </el-dialog>

    <!-- 编辑的 dialog -->
    <el-dialog
      title="编辑"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isEditVisible"
    >
      <span slot="footer" class="dialog-footer" />
      <addOrEdit v-if="isEditVisible" :id="curId" :is-edit="isEdit" @success="hsuccess" />
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, DeldepartDetail } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import addOrEdit from './son.vue'
export default {
  components: {
    addOrEdit
  },
  data() {
    return {
      // list: [{
      //   name: '财务部',
      //   manager: '刘备',
      //   children: [
      //     {
      //       name: '财务核算部',
      //       manager: '张飞'
      //     },
      //     {
      //       name: '税务核算部',
      //       manager: '关羽'
      //     }
      //   ]
      // }]
      // 声明一个新数组 用来接取新数据
      list: [],
      showVisible: false,
      curId: '',
      isEditVisible: false,
      isEdit: false
    }
  },

  created() {
    this.loadDepartments()
  },

  methods: {
    // 查询企业的部门列表  可用来重新渲染页面
    async loadDepartments() {
      const res = await getDepartments()
      res.data.depts.shift()
      // console.log(res)
      this.list = tranListToTreeData(res.data.depts)
    },

    // 点击添加子部门
    hshowAdd(id) {
      this.showVisible = true
      this.curId = id
      this.isEdit = false
    },

    // 点击编辑子部门
    hshowEdit(id) {
      // 显示弹框
      this.isEditVisible = true
      this.curId = id
      this.isEdit = true
    },

    // 点击删除子部门
    hDelete(id) {
      this.$confirm('确定删除?', '提示', { type: 'waining' })
        .then(async() => {
          try {
            // 调用删除的请求
            const res = await DeldepartDetail(id)
            // 提醒用户
            this.$message.success(res.message)
            // 重新渲染页面
            this.loadDepartments()
          } catch (e) {
            this.$message.error(e.message)
          }
        }).catch(() => {

        })
    },

    // 关闭弹出框
    hsuccess() {
      // 关闭弹出框
      this.showVisible = false
      this.isEditVisible = false
      // 重新获取最新数据
      this.loadDepartments()
    }
  }

}
</script>
