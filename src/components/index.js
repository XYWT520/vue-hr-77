import PageTools from './pageTools/index.vue'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg/index.vue'
import ImggeHolder from './ImggeHolder/index.vue'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(UploadImg.name, UploadImg)
    Vue.component(ImggeHolder.name, ImggeHolder)
  }
}
