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

    // 弹窗实例
    const dialog = useDialog()

    // 邀请好友
    const inviteFriendsModal = ref(false)
    const shareList = ref([])
    const inviteFriends = () => {
        inviteFriendsModal.value = true;
        let url = proxy.$mainStore.baseUrl + '/rolebot/mini_program/share/share.jpg?v=' + new Date().getTime()
        urlToFile(url,'share.jpg').then(file => {
            shareList.value = [];
            shareList.value.push({
                file:file,
                name: 'share.jpg',
                status:"pending"
            })
        })
    }

    // 关于萝卜AI简介
    const roleBotIntroductionModal = ref(false)
    const imageType = ref(null)
    const imageTypeOptions = ref([
        {
            label:'公众号卡片',
            value:'official_account'
        },
        {
            label:'文章封面',
            value:'article'
        },
    ])
    const officialAccountList = ref([])
    const articleList = ref([])
    const imageTypeHandleFilterChange = (value) => {
        imageType.value = value
        if(value == 'official_account'){
            let url = proxy.$mainStore.baseUrl + '/rolebot/mini_program/generic/official_account.png?v=' + new Date().getTime()
            urlToFile(url,'official_account.png').then(file => {
                officialAccountList.value = [];
                officialAccountList.value.push({
                    file:file,
                    name: 'official_account.png',
                    status:"pending"
                })
            })
        }else{
            let url = proxy.$mainStore.baseUrl + '/rolebot/mini_program/generic/article.png?v=' + new Date().getTime()
            urlToFile(url,'article.png').then(file => {
                articleList.value = [];
                articleList.value.push({
                    file:file,
                    name: 'article.png',
                    status:"pending"
                })
            })
        }
    }
    const roleBotIntroduction = () => {
        roleBotIntroductionModal.value = true
        imageType.value = null;
    }

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

    const othersOrder = ref({
        first_bonus_point:null,
        first_bonus_member_long:null,
        first_bonus_member_type:null,
        report_max_sample:null,
        report_submit_max:null,
        report_update_alert:null,
    })

    // 获取初始化数据
    const getPointPackage = async () => {
        // 打开加载中loading
        proxy.$mainStore.setAllLoading(true);
        await axiosService.get('master-others',{})
        .then(response => {
            if(response.code == 0){
                othersOrder.value.first_bonus_point = Number(response.data.first_bonus_point);
                othersOrder.value.first_bonus_member_long = Number(response.data.first_bonus_member_long);
                othersOrder.value.first_bonus_member_type = Number(response.data.first_bonus_member_type);
                othersOrder.value.report_max_sample = Number(response.data.report_max_sample);
                othersOrder.value.report_submit_max = Number(response.data.report_submit_max);
                othersOrder.value.report_update_alert = Number(response.data.report_update_alert);
                
            }else{
                tipsForLogin(response.code,response.message)
            }
            proxy.$mainStore.setAllLoading(false);
        })
    }

    // 保存配置
    const generateConfig = () => {
        if(!othersOrder.value.first_bonus_point){
            dialog.warning({
                title: '提示',
                content: '用户首次登录送点不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        if(!othersOrder.value.first_bonus_member_long){
            dialog.warning({
                title: '提示',
                content: '用户首次登录赠送会员天数不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        if(!othersOrder.value.first_bonus_member_type){
            dialog.warning({
                title: '提示',
                content: '用户首次登录会员类型不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        if(!othersOrder.value.report_max_sample){
            dialog.warning({
                title: '提示',
                content: '心理评估最小取样条目数不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        if(!othersOrder.value.report_submit_max){
            dialog.warning({
                title: '提示',
                content: '心里评估最大取样条目数不能为空。',
                negativeText: '关闭'
            })
            return false
        }

        if(!othersOrder.value.report_update_alert){
            dialog.warning({
                title: '提示',
                content: '可进行心理评估报告提醒条目数不能为空。',
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
            axiosService.post('master-others-save',{
              first_bonus_point:othersOrder.value.first_bonus_point,
              first_bonus_member_long:othersOrder.value.first_bonus_member_long,
              first_bonus_member_type:othersOrder.value.first_bonus_member_type,
              report_max_sample:othersOrder.value.report_max_sample,
              report_submit_max:othersOrder.value.report_submit_max,
              report_update_alert:othersOrder.value.report_update_alert,
            })
            .then(response => {
                if(response.code == 0){
                    dialog.success({
                      title: "配置成功",
                      positiveText: "关闭"
                    });
                    getPointPackage()
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

    // 邀请好友图片上传
    const inviteFriendUpload = () => {
        if(shareList.value.length == 0){
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
                formData.append("file",shareList.value[0].file)
                axiosService.post('other-share-upload',formData)
                .then(response => {
                    if(response.code == 0){
                        inviteFriendsModal.value = false
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

    // 萝卜AI简介上传图片
    const roleBotIntroductionUpload = () => {
        // 上传公众号
        if(imageType.value == 'official_account'){
            if(officialAccountList.value.length == 0){
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
                    formData.append("file",officialAccountList.value[0].file)
                    axiosService.post('other-official-account-upload',formData)
                    .then(response => {
                        if(response.code == 0){
                            roleBotIntroductionModal.value = false
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

        // 上传文章封面
        if(imageType.value == 'article'){
            if(articleList.value.length == 0){
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
                    formData.append("file",articleList.value[0].file)
                    axiosService.post('other-article-upload',formData)
                    .then(response => {
                        if(response.code == 0){
                            roleBotIntroductionModal.value = false
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
    }

    //global init
    onMounted(() => {
      getPointPackage()
    });

</script>

<template>
    <div class="other-management-container">
        <!-- 顶部操作栏 -->
        <div class="top-actions">
            <n-button class="action-btn" @click="inviteFriends">
                <template #icon>
                <n-icon>
                    <UploadPicture />
                </n-icon>
                </template>
                邀请好友
            </n-button>

            <n-button class="action-btn" @click="roleBotIntroduction">
                <template #icon>
                <n-icon>
                    <UploadPicture />
                </n-icon>
                </template>
                萝卜AI伙伴简介
            </n-button>
        </div>

        <n-flex justify="center" style="margin-top:30px">
            <n-form
                :model="othersOrder"
                label-placement="top"
                :label-width="160"
                :style="{
                    width: '600px',
                }"
            >
                <n-form-item label="用户首次登录送点" path="first_bonus_point">
                    <n-input-number style="width:100%" v-model:value="othersOrder.first_bonus_point" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="用户首次登录赠送会员天数" path="first_bonus_member_long">
                    <n-input-number style="width:100%" v-model:value="othersOrder.first_bonus_member_long" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="用户首次登录会员类型" path="first_bonus_member_type">
                    <n-input-number style="width:100%" v-model:value="othersOrder.first_bonus_member_type" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="心理评估最小取样条目数" path="report_max_sample">
                    <n-input-number style="width:100%" v-model:value="othersOrder.report_max_sample" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="心里评估最大取样条目数" path="report_submit_max">
                    <n-input-number style="width:100%" v-model:value="othersOrder.report_submit_max" clearable min="1" :precision="0"/>
                </n-form-item>
                <n-form-item label="可进行心理评估报告提醒条目数" path="report_update_alert">
                    <n-input-number style="width:100%" v-model:value="othersOrder.report_update_alert" clearable min="1" :precision="0"/>
                </n-form-item>
                
            </n-form>
        </n-flex>
        <n-flex justify="center" style="margin-top:30px">
            <n-button type="primary" @click="generateConfig">保存配置</n-button>
        </n-flex>

    </div>
    <!-- 邀请好友图片替换 -->
    <n-modal v-model:show="inviteFriendsModal">
        <n-card
            style="width: 600px"
            title="邀请好友"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
        <template #header-extra>
            <n-icon size="25px" @click="inviteFriendsModal = false">
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
                v-model:file-list="shareList"
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
            <n-button @click="inviteFriendsModal = false">取消</n-button>
            <n-button type="primary" @click="inviteFriendUpload">保存</n-button>
            </n-flex>
        </template>
        </n-card>
    </n-modal>
    <!-- 萝卜AI简介图片替换 -->
    <n-modal v-model:show="roleBotIntroductionModal" :auto-focus="false">
        <n-card
        style="width: 600px"
        title="萝卜AI伙伴简介"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        >
        <template #header-extra>
            <n-icon size="25px" @click="roleBotIntroductionModal=false;">
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
            <n-form-item label="配置项">
            <n-select
                class="filter-select"
                :value="imageType"
                :options="imageTypeOptions"
                @update:value="imageTypeHandleFilterChange"
                style="width: 100%;border: 1px solid #e5e7eb;border-radius: 6px;"
                placeholder="请选择要配置的选项"
            />
            </n-form-item>
            <n-form-item label="图片替换（限制png）" v-if="imageType == 'official_account' ">
                <n-upload
                v-model:file-list="officialAccountList"
                accept="image/png"
                list-type="image-card"
                :multiple="false"
                :max="1"
                >
                点击上传
                </n-upload>
            </n-form-item>
            <n-form-item label="图片替换（限制png）" v-if="imageType == 'article' ">
                <n-upload
                v-model:file-list="articleList"
                accept="image/png"
                list-type="image-card"
                :multiple="false"
                :max="1"
                >
                点击上传
                </n-upload>
            </n-form-item>
            
        </n-form>
        <template #footer>
            <n-flex justify="space-around" size="large">
            <n-button type="primary" @click="roleBotIntroductionUpload">保存</n-button>
            </n-flex>
        </template>
        </n-card>
    </n-modal>
</template>

<style scoped>
.other-management-container {
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


