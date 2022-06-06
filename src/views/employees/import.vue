<template>
  <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
</template>

<script>
import { formatExcelDate } from '@/utils/index'
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {

    }
  },

  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      const data = this.transExcel(results)
      try {
        const res = await importEmployee(data)
        // 提醒用户
        this.$message.success(res.message)
        // 返回上一级菜单
        this.$router.back()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 将中文转换为英文
    transExcel(results) {
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 声明一个空对象
      const enObj = {}
      return results.map(item => {
        // 将中文的属性名取出来
        const zhKeys = Object.keys(item)
        // 遍历中文的属性名
        zhKeys.forEach(items => {
          // 通过 mapInfo 的映射将中文属性名后面的英文属性值赋值给 enKey
          const enkey = mapInfo[items]
          // 判断
          if (enkey === 'timeOfEntry' || enkey === 'correctionTime') {
            enObj[enkey] = new Date(formatExcelDate(item[items]))
          }
          // 将 results 里的值赋值给 enObj 的
          enObj[enkey] = item[items]
          // 类似于下面的这步操作
        //   const obj = {
        //     name: ''
        //   }
        //   obj.name = '冷雪瞳'
        })
        return enObj
      })
    }
  }
}
</script>

<style>

</style>
