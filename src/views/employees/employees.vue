<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总记录数: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
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
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
  </div>
</template>

<script>
import { getEmployees } from '@/api/employees'
import constant from '@/constant/employees'

export default {
  data() {
    return {
      employess: [],
      total: 0,
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

    // 聘用形似
    formatEmpolyess(code) {
      const result = constant.hireType.find(item => item.id === code)
      // const result = constant.hireType.find(function(item) {
      //   return item.id === code
      // })
      if (result) {
        return result.value
      } else {
        return '未知'
      }
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
