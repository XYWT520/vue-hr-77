<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总记录数: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="handleDownload">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table border :data="employess">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="username">
            <template v-slot="{row}">
              <img class="avatar" :src="row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{row}">
              {{ formatEmpolyess(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" :sortable="true" />
          <el-table-column label="账户状态" />
          <el-table-column label="操作" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="q.page"
            :page-sizes="[2,3,5,10,20]"
            :page-size="q.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </div>
    <el-dialog
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增员工"
      width="45%"
    >
      <empDialog v-if="showDialog" @success="hSuccess" @cancel="hCancel" />
    </el-dialog>
  </div>
</template>

<script>
import { delEmployee, getEmployees } from '@/api/employees'
import constant from '@/constant/employees'
import empDialog from './empDialog.vue'
const hireTypeMap = {}
constant.hireType.forEach(item => {
  hireTypeMap[item.id] = item.value
})
export default {
  components: {
    empDialog
  },
  data() {
    return {
      employess: [],
      total: 0,
      showDialog: false,
      q: {
        page: 1,
        size: 5
      }
    }
  },

  created() {
    this.loadgetEmployees()
  },

  methods: {
    handleSizeChange(size) {
      this.q.size = size
      this.loadgetEmployees()
    },
    handleCurrentChange(page) {
      this.q.page = page
      this.loadgetEmployees()
    },

    // 获取员工列表
    async loadgetEmployees() {
      try {
        // 请求
        const res = await getEmployees(this.q)
        // console.log(res)
        this.total = res.data.total
        this.employess = res.data.rows
      } catch (e) {
        console.log(e)
      }
    },

    // 删除员工
    async del(id) {
      try {
        await this.$confirm('确定删除?', '提示', { type: 'warning' })
        const res = await delEmployee(id)
        // console.log(res)
        // 提醒用户
        this.$message.success(res.message)
        // 删除优化 判断当前页是否大于一
        if (this.employess.length === 1 && this.q.page > 1) {
          this.q.page--
        }
        // 重新渲染页面
        this.loadgetEmployees()
      } catch (e) {
        if (e === 'cancel') return
        this.$message.error(e.message)
      }
    },

    // 聘用形似
    formatEmpolyess(code) {
      // const result = constant.hireType.find(item => item.id === code)
      // // const result = constant.hireType.find(function(item) {
      // //   return item.id === code
      // // })
      // if (result) {
      //   return result.value
      // } else {
      //   return '未知'
      // }
      return hireTypeMap[code]
    },

    // 子向父传值 关闭父组件 dialog
    hSuccess() {
      // 关闭父组件 dialog
      this.showDialog = false
      // 添加完成之后，就能立刻看到添加的数据，而不要手动去点击分页
      this.total++
      this.q.page = Math.ceil(this.total / this.q.size)
      // 重新获取数据
      this.loadgetEmployees()
    },

    // 子向父传值 电击取消关闭父组件 dialog
    hCancel() {
      this.showDialog = false
    },

    // 导出 Excel 表格
    async handleDownload() {
      const mapInfo = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      // 发请求获取全部数据
      const res = await getEmployees({ page: 1, size: this.total })
      // console.log(res)
      const list = res.data.rows

      // 取出第一个数据
      const first = list[0]
      // 判断有没有第一个数据 没有就不让执行
      if (!first) return

      // 取出 header
      // const header = Object.keys(first).map(item => mapInfo[item])
      const header = Object.keys(first).map(item => mapInfo[item])
      // console.log(header)

      // 取出 data 里的数据
      const data = list.map(item => {
        const code = item['formOfEmployment']
        item['formOfEmployment'] = hireTypeMap[code]
        return Object.values(item)
      })

      this.downloadLoading = true
      const excel = await import('@/vendor/Export2Excel')
      excel.export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename: 'excel-list', // 文件名称
        autoWidth: true, // 宽度是否自适应
        bookType: 'xlsx' // 生成的文件类型
      })
      this.downloadLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
