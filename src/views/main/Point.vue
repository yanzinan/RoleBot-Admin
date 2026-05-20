<script setup>

    //global init

    import { h, ref, onMounted,getCurrentInstance, nextTick  } from "vue"
    const { proxy } = getCurrentInstance()
    import { useRouter } from 'vue-router';
    const router = useRouter();
    import { useAxios } from '../../services/axios.js'
    const axiosService = useAxios();
    
    import { 
        NPageHeader,
        NGrid,
        NGi,
        NStatistic,
        NAvatar,
        NAlert,
        NIcon,
        NBadge,
        NDataTable,
        NButton,
        NDropdown,
        NTabs,
        NTabPane,
        NTag,
        NNumberAnimation,
        NSelect,
        useDialog,
        NModal,
    } from "naive-ui"

    import { 
        UploadPicture,
        CloseOne,
        Play,
     } from "@icon-park/vue-next"

    const renderIcon = (icon) => {
        return () => h(NIcon, null, {default:()=>h(icon)});
    }

    const uploadCostPointModal = ref(false)
    const costPointList = ref([])
    // 打开资源点消耗说明的上传弹窗
    const uploadCostPoint = () => {
        uploadCostPointModal.value = true;
        let url = proxy.$mainStore.baseUrl + '/rolebot/mini_program/generic/cost-point.jpg?v=' + new Date().getTime()
        urlToFile(url,'cost-point.jpg').then(file => {
            costPointList.value = [];
            costPointList.value.push({
                file:file,
                name: 'cost-point.jpg',
                status:"pending"
            })
        })
    }

    // 弹窗实例
    const dialog = useDialog()

    // 把url转成文件
    const urlToFile = async (url, filename) => {
      try {
        const res = await fetch(url)
        const blob = await res.blob()
        return new File([blob], filename, { type: blob.type })
      } catch (err) {
        message.error('图片加载失败')
        return null
      }
    }

    const pointOrder = ref({
        point_6000_fee:null,
        point_6000_value:null,
        point_12000_fee:null,
        point_12000_value:null,
        point_30000_fee:null,
        point_30000_value:null,
        point_68000_fee:null,
        point_68000_value:null,
    })

    // 获取初始化数据
    const getPointPackage = async () => {
        // 打开加载中loading
        proxy.$mainStore.setAllLoading(true);
        await axiosService.get('master-point-package',{})
        .then(response => {
            if(response.code == 0){
                pointOrder.value.point_6000_fee = Number(response.data.point_6000_fee);
                pointOrder.value.point_6000_value = Number(response.data.point_6000_value);
                pointOrder.value.point_12000_fee = Number(response.data.point_12000_fee);
                pointOrder.value.point_12000_value = Number(response.data.point_12000_value);
                pointOrder.value.point_30000_fee = Number(response.data.point_30000_fee);
                pointOrder.value.point_30000_value = Number(response.data.point_30000_value);
                pointOrder.value.point_68000_fee = Number(response.data.point_68000_fee);
                pointOrder.value.point_68000_value = Number(response.data.point_68000_value);
            }else{
                tipsForLogin(response.code,response.message)
            }
            proxy.$mainStore.setAllLoading(false);
        })
    }

    const tipsForLogin = (code,msg) => {
      if(code == 401){
        Swal.fire({
            icon: "error",
            title:"Token is missing or invalid!",
            confirmButtonText: "重新登录",
        }).then(() => {
          localStorage.clear();
          router.push('/login')
        });;
      }else{
        Swal.fire({
            icon: "error",
            title:"提示",
            text:msg,
        });
      }
    };

    // 保存配置
    const generateConfig = () => {
        if(!pointOrder.value.point_6000_fee || !pointOrder.value.point_6000_value || !pointOrder.value.point_12000_fee || !pointOrder.value.point_12000_value || !pointOrder.value.point_30000_fee || !pointOrder.value.point_30000_value || !pointOrder.value.point_68000_fee || !pointOrder.value.point_68000_value){
            dialog.warning({
                title: '提示',
                content: '以上4个档位均为必填项，不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        // 保存：弹出二次确认框
        dialog.warning({
            title: '确认保存',
            content: '该操作有一定风险，保存后会覆盖原有数据，请再次确认是否要保存。',
            positiveText: '保存',
            negativeText: '取消',
            onPositiveClick: () => {
                // 打开加载中loading
                proxy.$mainStore.setAllLoading(true);
                axiosService.post('master-point-package-save',{
                point_6000_fee:pointOrder.value.point_6000_fee,
                point_6000_value:pointOrder.value.point_6000_value,
                point_12000_fee:pointOrder.value.point_12000_fee,
                point_12000_value:pointOrder.value.point_12000_value,
                point_30000_fee:pointOrder.value.point_30000_fee,
                point_30000_value:pointOrder.value.point_30000_value,
                point_68000_fee:pointOrder.value.point_68000_fee,
                point_68000_value:pointOrder.value.point_68000_value
                })
                .then(response => {
                    if(response.code == 0){
                        getPointPackage()
                        dialog.success({
                        title: "配置成功",
                        positiveText: "关闭"
                        });
                    }else{
                        tipsForLogin(response.code,response.message)
                    }
                    proxy.$mainStore.setAllLoading(false);
                })
            },
            onNegativeClick: () => {
                console.log('取消删除')
            }
        })
    }

    // 上传资源点消耗说明图片
    const pointResourceUpload = () => {
        if(costPointList.value.length == 0){
            dialog.warning({
                title: '提示',
                content: '请上传图片。',
                negativeText: '关闭'
            })
            return false
        }

        // 保存：弹出二次确认框
        dialog.warning({
            title: '确认保存',
            content: '该操作有一定风险，保存后会覆盖原有图片，请再次确认是否要保存。',
            positiveText: '保存',
            negativeText: '取消',
            onPositiveClick: () => {
                // 打开加载中loading
                proxy.$mainStore.setAllLoading(true);
                const formData = new FormData()
                formData.append("file",costPointList.value[0].file)
                axiosService.post('point-consume-resource-upload',formData)
                .then(response => {
                    if(response.code == 0){
                        uploadCostPointModal.value = false
                        dialog.success({
                            title: "配置成功",
                            positiveText: "关闭"
                        });
                    }else{
                        tipsForLogin(response.code,response.message)
                    }
                    proxy.$mainStore.setAllLoading(false);
                })
            },
            onNegativeClick: () => {
                console.log('取消删除')
            }
        })
    }

    //global init
    onMounted(() => {
      getPointPackage()
    });

</script>

<template>
    <div class="point-management-container">
        <!-- 顶部操作栏 -->
        <div class="top-actions">
            <n-button class="action-btn" @click="uploadCostPoint">
                <template #icon>
                <n-icon>
                    <UploadPicture />
                </n-icon>
                </template>
                资源点消耗说明
            </n-button>
        </div>

        <n-flex justify="center" style="margin-top:30px">
            <n-form
                :model="pointOrder"
                label-placement="top"
                :label-width="160"
                :style="{
                    width: '600px',
                }"
            >
                <n-form-item label="档位1费用（分）" path="point_6000_fee">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_6000_fee" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位1点数" path="point_6000_value">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_6000_value" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位2费用（分）" path="point_12000_fee">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_12000_fee" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位2点数" path="point_12000_value">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_12000_value" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位3费用（分）" path="point_30000_fee">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_30000_fee" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位3点数" path="point_30000_value">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_30000_value" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位4费用（分）" path="point_68000_fee">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_68000_fee" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="档位4点数" path="point_68000_value">
                    <n-input-number style="width:100%" v-model:value="pointOrder.point_68000_value" clearable min="1" :precision="0"/>
                </n-form-item>
            </n-form>
        </n-flex>
        <n-flex justify="center" style="margin-top:30px">
            <n-button type="primary" @click="generateConfig">保存配置</n-button>
        </n-flex>

    </div>

    <n-modal v-model:show="uploadCostPointModal">
        <n-card
            style="width: 600px"
            title="资源点消耗说明"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
        <template #header-extra>
            <n-icon size="25px" @click="uploadCostPointModal = false">
                <CloseOne/>
            </n-icon>
        </template>
        <n-form
            label-placement="top"
            :label-width="160"
            :style="{
            maxWidth: '580px',
            }"
        >
            <n-form-item label="图片替换（限制jpg）">
              <n-upload
                v-model:file-list="costPointList"
                accept="image/jpg"
                list-type="image-card"
                :multiple="false"
                :max="1"
              >
                点击上传
              </n-upload>
            </n-form-item>
        
        </n-form>
        <template #footer>
            <n-flex justify="end" size="large">
            <n-button @click="uploadCostPointModal = false">取消</n-button>
            <n-button type="primary" @click="pointResourceUpload">保存</n-button>
            </n-flex>
        </template>
        </n-card>
    </n-modal>
</template>

<style scoped>
.point-management-container {
  padding: 24px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}


.action-btn {
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: white;
}
</style>


