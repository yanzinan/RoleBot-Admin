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
        AddOne,
        Refresh,
        Setting,
        Sync,
        More,
        CloseOne,
        Play,
     } from "@icon-park/vue-next"

    const renderIcon = (icon) => {
        return () => h(NIcon, null, {default:()=>h(icon)});
    }

    // 弹窗实例
    const dialog = useDialog()


    // 筛选选项
    const filterValue = ref('0')
    const filterOptions = [
        { label: '全部', value: 'all' },
        { label: '自建', value: '1' },
        { label: '官方', value: '0' }
    ]
    // 筛选下拉切换事件
    const handleFilterChange = (value) => {
        filterValue.value = value
        // 切换筛选后可以重置分页
        currentPage.value = 1
        getAgentList()
    }

    // 卡片菜单选项
    const getCardMenuOptions = (type) => {
        if (type === 1) {
            // 自建 → 只显示 删除
            return [{ label: '删除', key: 'delete' }]
        } else {
            // 官方 → 显示 编辑 + 删除
            return [
                { label: '编辑', key: 'edit' },
                { label: '删除', key: 'delete' }
            ]
        }
    }

    // 分页数据
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalPages = ref(1)
    const agentList = ref([])

    const getAgentList = async () => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      await axiosService.get('agent-list',{
        page:currentPage.value,
        pageSize:pageSize.value,
        agentType:filterValue.value
      })
      .then(response => {
          if(response.code == 0){
              agentList.value = response.data.list;
              totalPages.value = response.data.totalPage;
              console.log(response.data)
          }else{
              tipsForLogin(response.code,response.message)
          }
          proxy.$mainStore.setAllLoading(false);
      })
    }

    // 处理下拉菜单点击
    const handleMenuSelect = (key,item) => {
        if (key === 'delete') {
            // 删除：弹出二次确认框
            dialog.warning({
                title: '确认删除',
                content: '确定要删除该 Agent 吗？删除后无法恢复！',
                positiveText: '确认删除',
                negativeText: '取消',
                onPositiveClick: () => {
                    // 在这里写真正的删除逻辑（接口请求）
                    console.log('执行删除操作')
                    // 打开加载中loading
                    proxy.$mainStore.setAllLoading(true);
                    axiosService.post('agent-delete',{
                      id:item.id,
                    })
                    .then(response => {
                        if(response.code == 0){
                            getAgentList()
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
        } else if (key === 'edit') {
            console.log('编辑')
            // 编辑逻辑

            // 获取音色列表
            getVoiceList()

            // 数据回显
            // 头像
            let avatarUrl = item.avatar;
            let avatarFileName = item.avatar.split('/').pop()
            console.log(avatarUrl,avatarFileName)
            urlToFile(avatarUrl,avatarFileName).then(file => {
              avatarList.value = [];
              avatarList.value.push({
                file:file,
                name: avatarFileName,
                status:"pending"
              })
            })
            // RTC头像
            let rtcAvatarUrl = item.avatar
            rtcAvatarUrl = rtcAvatarUrl.replace("avatar_background","rtc_avatar_background")
            rtcAvatarUrl = rtcAvatarUrl.replace(/\.(jpg|jpeg|png|webp|bmp|svg|tiff)$/i, '.gif')
            let rtcAvatarFileName = rtcAvatarUrl.split('/').pop()
            console.log(rtcAvatarUrl,rtcAvatarFileName)
            urlToFile(rtcAvatarUrl,rtcAvatarFileName).then(file => {
              rtcAvatarList.value = [];
              rtcAvatarList.value.push({
                file:file,
                name: rtcAvatarFileName,
                status:"pending"
              })
            })
            // 聊天背景
            let backgroundUrl = item.background
            let backgroundFileName = item.background.split('/').pop()
            urlToFile(backgroundUrl,backgroundFileName).then(file => {
              backgroundList.value = [];
              backgroundList.value.push({
                file:file,
                name: backgroundFileName,
                status:"pending"
              })
            })
            // 开场白
            if(item.openAudioUrl.indexOf("mp3") < 0){
              agentModelForm.value.fileOrText = false
              agentModelForm.value.openAudioUrl = item.openAudioUrl;
              openAudioUrlList.value = [];
            }else{
              agentModelForm.value.fileOrText = true
              agentModelForm.value.openAudioUrl = null;
              let openAudioFileUrl = item.openAudioUrl
              let openAudioFileFileName = item.openAudioUrl.split('/').pop()
              urlToFile(openAudioFileUrl,openAudioFileFileName).then(file => {
                openAudioUrlList.value = [];
                openAudioUrlList.value.push({
                  file:file,
                  name: openAudioFileFileName,
                  status:"pending"
                })
              })
            }
            // 欢迎语
            if(item.welcomeAudioUrl){
              let welcomeAudioFileUrl = item.welcomeAudioUrl
              let welcomeAudioFileFileName = item.welcomeAudioUrl.split('/').pop()
              urlToFile(welcomeAudioFileUrl,welcomeAudioFileFileName).then(file => {
                welcomeAudioUrlList.value = [];
                welcomeAudioUrlList.value.push({
                  file:file,
                  name: welcomeAudioFileFileName,
                  status:"pending"
                })
              })
              agentModelForm.value.isRoleStory = true
            }else{
              agentModelForm.value.isRoleStory = false
            }
            // 音色
            agentModelForm.value.voiceId = item.voiceId;
            // 语速
            agentModelForm.value.speed = item.speed;
            // 智能体名称
            agentModelForm.value.name = item.name;
            // 智能体摘要
            agentModelForm.value.digest = item.digest;
            // botId
            agentModelForm.value.botId = item.botId;
            // 资源点消耗
            agentModelForm.value.quantity = item.quantity;
            // agentId
            agentModelForm.value.agentId = item.id;

            showAgentModal.value = true
            agentModalTitle.value = '编辑'

        }
    }

    // 当前页发生改变时
    const onUpdatePage = (page) => {
        console.log(page)
        currentPage.value = page;
        getAgentList()
    }

    // 刷新
    const refreshAgent = () => {
      currentPage.value = 1;
      filterValue.value = '0';
      getAgentList()
    }

    const showAgentModal = ref(false)
    const agentModalTitle = ref('')
    const agentModelForm = ref({
      agentId:null,
      voiceId:null,
      speed:null,
      fileOrText:true,
      openAudioUrl:null,
      isRoleStory:true,
      quantity:40,
      name:null,
      digest:null,
      botId:null,
    })


    const avatarList = ref([])
    const rtcAvatarList = ref([])
    const backgroundList = ref([])
    const openAudioUrlList = ref([])
    const welcomeAudioUrlList = ref([])

    // 新建agent
    const createAgent = () => {
      showAgentModal.value=true;
      agentModalTitle.value='新建';
      agentModelForm.value.voiceId = null;
      agentModelForm.value.speed = null;
      agentModelForm.value.fileOrText = true;
      agentModelForm.value.openAudioUrl = null;
      agentModelForm.value.isRoleStory = true;
      agentModelForm.value.quantity = 40;
      agentModelForm.value.name = null;
      agentModelForm.value.digest = null;
      agentModelForm.value.botId = null;
      avatarList.value = []
      rtcAvatarList.value = []
      backgroundList.value = []
      openAudioUrlList.value = []
      welcomeAudioUrlList.value = []
      // 获取音色列表
      getVoiceList()
    }

    const showRtcModal = ref(false)
    const rtcModelForm = ref({
      quantity:25,
      rtcValue:null,
      pat:null,
    })
    const rtcOptions = ref([
      {
        label:'PAT',
        value:'pat'
      },
      {
        label:'费用',
        value:'cost'
      },
    ])

    const rtcHandleFilterChange = (value) => {
      rtcModelForm.value.rtcValue = value;
      if(value == 'cost'){
        getRtcMCost()
      }else{

      }
    }

    // rtc消耗配置
    const setRtcModal = () => {
      getRtcMCost()
    }

    // 获取当前rtc每分钟费用
    const getRtcMCost = async () => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      await axiosService.get('master-rtc-m-cost',{})
      .then(response => {
          if(response.code == 0){
              showRtcModal.value = true
              rtcModelForm.value.quantity = response.data.rtc_m_cost;
          }else{
              tipsForLogin(response.code,response.message)
          }
          proxy.$mainStore.setAllLoading(false);
      })
    }

    // 保存当前rtc配置
    const submitRtcMCost = async () => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      if(rtcModelForm.value.rtcValue == 'cost'){
        // rtc扣点
        await axiosService.post('master-rtc-m-cost',{
          rtc_m_cost:rtcModelForm.value.quantity
        })
        .then(response => {
            if(response.code == 0){
                showRtcModal.value = false
                dialog.success({
                  title: "配置成功",
                  positiveText: "关闭"
                });
            }else{
                tipsForLogin(response.code,response.message)
            }
            proxy.$mainStore.setAllLoading(false);
        })
      }else{
        // pat令牌
      }
      
    }

    const showUpdateModal = ref(false)
    const updateModelForm = ref({
      updateDatetime:null,
      modalId:null
    })

    //更新模型自建
    const updateModal = () => {
      getModelInfo()
    }

    // 获取更新模型的初始化信息
    const getModelInfo = async () => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      await axiosService.get('master-model-update',{})
      .then(response => {
          if(response.code == 0){
              showUpdateModal.value = true
              updateModelForm.value.updateDatetime = response.data.user_agent_update_check;
              updateModelForm.value.modalId = response.data.user_agent_update_model_id;
          }else{
              tipsForLogin(response.code,response.message)
          }
          proxy.$mainStore.setAllLoading(false);
      })
    }

    // 模型设置提交
    const modalSubmit = async (type) => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      await axiosService.post('master-model-update',{
        user_agent_update_check:updateModelForm.value.updateDatetime,
        user_agent_update_model_id:updateModelForm.value.modalId
      })
      .then(response => {
          if(response.code == 0){
              showUpdateModal.value = false
              dialog.success({
                title: "配置成功",
                positiveText: "关闭"
              });
          }else{
              tipsForLogin(response.code,response.message)
          }
          proxy.$mainStore.setAllLoading(false);
      })
      console.log(updateModelForm.value.updateDatetime)
    }

    // 把url转成文件
    const urlToFile = async (url, filename) => {
      try {
        const res = await fetch(url)
        const blob = await res.blob()
        return new File([blob], filename, { type: blob.type })
      } catch (err) {
        message.error('头像加载失败')
        return null
      }
    }

    const voiceOptions = ref([])

    // 获取音色列表
    const getVoiceList = async () => {
      // 打开加载中loading
      proxy.$mainStore.setAllLoading(true);
      await axiosService.get('voice-list',{})
      .then(response => {
          if(response.code == 0){
              voiceOptions.value = []
              response.data.forEach(item => {
                let obj = {};
                obj.label = item.name;
                obj.value = item.voiceId;
                obj.demo = item.demo
                voiceOptions.value.push(obj)
              })
            // JS 最常用的查找方法：find
            const result = voiceOptions.value.find(item => item.value === agentModelForm.value.voiceId);

            // 取出 demo
            audioRef.value.src = result ? result.demo : null;
          }else{
              tipsForLogin(response.code,response.message)
          }
          proxy.$mainStore.setAllLoading(false);
      })
    }

    const handleUpdateVoiceId = (value, option) => {
      audioRef.value.src = option.demo
      audioRef.value.load()
    }

    // 音频DOM实例
    const audioRef = ref(null)
    const playVoiceDemo = () => {
      audioRef.value.play()
    }

    // 切换switch
    function railStyle({
      focused,
      checked
    }) {
      const style = {};
      if (checked) {
        style.background = "#d03050";
        if (focused) {
          style.boxShadow = "0 0 0 2px #d0305040";
        }
      } else {
        style.background = "#2080f0";
        if (focused) {
          style.boxShadow = "0 0 0 2px #2080f040";
        }
      }
      return style;
    }

    const openAudioTagChange = (value) => {
      if(value == true){
        // 当前是上传文件 把文本内容清空充值
        agentModelForm.value.openAudioUrl = null;
      }else{
        // 当前是输入文本开场白  把文件内容清空
        openAudioUrlList.value = []
      }
    }

    // 新建、编辑提交
    const agentSubmit = () => {
      const formData = new FormData()
      // 判断头像是否为空
      if(avatarList.value.length == 0){
        dialog.warning({
            title: '提示',
            content: '请上传头像。',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('avatar',avatarList.value[0].file)
      }
      // 判断rtc头像是否为空
      if(rtcAvatarList.value.length == 0){
        dialog.warning({
            title: '提示',
            content: '请上传RTC头像。',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('avatarRtc',rtcAvatarList.value[0].file)
      }
      // 判断聊天背景是否为空
      if(backgroundList.value.length == 0){
        dialog.warning({
            title: '提示',
            content: '请上传聊天背景。',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('background',backgroundList.value[0].file)
      }
      // 判断开场白是否为空 当前switch为文件时  判断文件是否为空
      if(agentModelForm.value.fileOrText && openAudioUrlList.value.length == 0){
        dialog.warning({
            title: '提示',
            content: '请上传开场白',
            negativeText: '关闭'
        })
        return false
      }
      // 判断开场白是否为空 当前switch为文本时  判断文本是否为空
      if(!agentModelForm.value.fileOrText && agentModelForm.value.openAudioUrl == null){
        dialog.warning({
            title: '提示',
            content: '请输入开场白',
            negativeText: '关闭'
        })
        return false
      }
      // 开场白文件
      let openAudioUrlFile = openAudioUrlList.value.length > 0 ? openAudioUrlList.value[0].file : null;
      formData.append('openAudioUrlFile',openAudioUrlFile)
      // 开场白文本
      let openAudioUrlText = agentModelForm.value.openAudioUrl ? agentModelForm.value.openAudioUrl : null;
      formData.append('openAudioUrlText',openAudioUrlText)
      // 当前是文件还是文本
      let openAudioTag = agentModelForm.value.fileOrText ? 'file' : 'text'
      formData.append('openAudioTag',openAudioTag)
      // 欢迎语
      let welcomeAudioUrl = welcomeAudioUrlList.value.length > 0 ? welcomeAudioUrlList.value[0].file : null;
      formData.append('welcomeAudioUrl',welcomeAudioUrl)
      // 音色
      if(!agentModelForm.value.voiceId){
        dialog.warning({
            title: '提示',
            content: '请选择一个音色',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('voiceId',agentModelForm.value.voiceId)
      }
      // 语速
      if(!agentModelForm.value.speed){
        dialog.warning({
            title: '提示',
            content: '请设置语速',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('speed',agentModelForm.value.speed)
      }
      // 智能体名称
      if(!agentModelForm.value.name){
        dialog.warning({
            title: '提示',
            content: '请输入智能体名称',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('name',agentModelForm.value.name)
      }
      // 智能体摘要
      if(!agentModelForm.value.digest){
        dialog.warning({
            title: '提示',
            content: '请输入智能体摘要',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('digest',agentModelForm.value.digest)
      }
      // BotId
      if(!agentModelForm.value.botId){
        dialog.warning({
            title: '提示',
            content: '请输入botId',
            negativeText: '关闭'
        })
        return false
      }else{
        formData.append('botId',agentModelForm.value.botId)
      }
      // 资源点消耗
      formData.append('quantity',agentModelForm.value.quantity)
      
      

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

    //global init
    onMounted(() => {
      getAgentList()
    });

</script>

<template>
  <div class="agent-management-container">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <n-button class="action-btn" @click="createAgent">
        <template #icon>
          <n-icon>
            <AddOne />
          </n-icon>
        </template>
        新建 Agent
      </n-button>
      <n-button class="action-btn" @click="refreshAgent">
        <template #icon>
          <n-icon>
            <Refresh />
          </n-icon>
        </template>
        刷新
      </n-button>
      <n-button class="action-btn" @click="setRtcModal">
        <template #icon>
          <n-icon>
            <Setting />
          </n-icon>
        </template>
        RTC 设置
      </n-button>
      <n-button class="action-btn" @click="updateModal">
        <template #icon>
          <n-icon>
            <Sync />
          </n-icon>
        </template>
        更新模型 (自建)
      </n-button>
      <n-select
        class="filter-select"
        :value="filterValue"
        :options="filterOptions"
        @update:value="handleFilterChange"
        style="width: 120px;border: 1px solid #e5e7eb;border-radius: 6px;"
      />
    </div>

    <!-- Agent 卡片列表 -->
    <div class="agent-grid">

      <div class="agent-card" v-for="item in agentList" :key="item.id">
        <div class="card-header">
          <span class="agent-name">{{item.name}}</span>
          <n-dropdown trigger="click" :options="getCardMenuOptions(item.agentType)" @select="(key) => handleMenuSelect(key,item)">
            <n-button text>
              <n-icon>
                <More />
              </n-icon>
            </n-button>
          </n-dropdown>
        </div>
        <div class="card-footer">
          <n-tag v-if="item.agentType == 0" type="info" size="small">官方</n-tag>
          <n-tag v-if="item.agentType == 1" type="primary" size="small">自建</n-tag>
          <span class="update-time">更新于 {{item.updateDatetime.split("T")[0]}}</span>
        </div>
      </div>

    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <n-pagination
        v-model:page="currentPage"
        :page-count="totalPages"
        @update:page="onUpdatePage"
      />
    </div>
  </div>

  <!-- 创建 or 编辑 agent -->
  <n-drawer :width="520" v-model:show="showAgentModal">
    <n-drawer-content :title="agentModalTitle" :native-scrollbar="false" closable>
      <n-card
        style="width: 480px;"
        :bordered="false"
      >
        <n-space vertical>
          <n-form
            :model="agentModelForm"
            label-placement="top"
            :label-width="160"
            :style="{
              maxWidth: '580px',
            }"
          >
            <n-form-item label="头像">
              <n-upload
                v-model:file-list="avatarList"
                accept="image/png, image/jpeg, image/jpg"
                list-type="image-card"
                :multiple="false"
                :max="1"
              >
                点击上传
              </n-upload>
            </n-form-item>
            <n-form-item label="RTC 头像">
              <n-upload
                v-model:file-list="rtcAvatarList"
                accept="image/gif"
                list-type="image-card"
                :multiple="false"
                :max="1"
              >
                点击上传
              </n-upload>
            </n-form-item>
            <n-form-item label="聊天背景">
              <n-upload
                v-model:file-list="backgroundList"
                accept="video/mp4"
                :multiple="false"
                :max="1"
              >
                <n-button>点击上传</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item label="开场白" path="fileOrText">
              <n-switch :rail-style="railStyle" v-model:value="agentModelForm.fileOrText" @update:value="openAudioTagChange">
                <template #checked>
                  文件
                </template>
                <template #unchecked>
                  文本
                </template>
              </n-switch>
            </n-form-item>
            <n-upload
              style="margin-bottom:20px;"
              v-if="agentModelForm.fileOrText"
              v-model:file-list="openAudioUrlList"
              accept="audio/mp3"
              :multiple="false"
              :max="1"
            >
              <n-button>点击上传</n-button>
            </n-upload>
            <n-input v-else style="margin-bottom:20px;" v-model:value="agentModelForm.openAudioUrl" type="text" placeholder="请输入开场白" />
            <n-form-item label="欢迎语" path="isRoleStory">
              <n-switch :rail-style="railStyle" v-model:value="agentModelForm.isRoleStory">
                <template #checked>
                  有角色故事
                </template>
                <template #unchecked>
                  无角色故事
                </template>
              </n-switch>
            </n-form-item>
            <n-upload
              style="margin-bottom:20px;"
              v-if="agentModelForm.isRoleStory"
              v-model:file-list="welcomeAudioUrlList"
              accept="audio/mp3"
              :multiple="false"
              :max="1"
            >
              <n-button>点击上传</n-button>
            </n-upload>
            <n-form-item label="音色" path="voiceId">
              <n-select
                v-model:value="agentModelForm.voiceId"
                filterable
                placeholder="请选择音色"
                :options="voiceOptions"
                @update:value="handleUpdateVoiceId"
              />
              <n-icon size="20px" style="margin-left:10px;cursor:pointer;" v-if="agentModelForm.voiceId" @click="playVoiceDemo">
                <Play/>
              </n-icon>
              <!-- 音频标签 完全隐藏 -->
              <audio ref="audioRef" style="display: none;"/>
            </n-form-item>
            <n-form-item label="语速" path="speed">
              <n-input-number v-model:value="agentModelForm.speed" clearable :precision="1" :min="1" placeholder="请设置语速" style="width:100%"/>
            </n-form-item>
            <n-form-item label="智能体名称" path="name">
              <n-input v-model:value="agentModelForm.name" type="text" placeholder="请输入智能体名称" />
            </n-form-item>
            <n-form-item label="智能体摘要" path="digest">
              <n-input v-model:value="agentModelForm.digest" type="text" placeholder="请输入智能体摘要" />
            </n-form-item>
            <n-form-item label="Bot Id" path="botId">
              <n-input v-model:value="agentModelForm.botId" type="text" placeholder="请输入botId" />
            </n-form-item>
            <n-form-item label="资源点消耗" path="quantity">
              <n-slider show-tooltip v-model:value="agentModelForm.quantity" :step="1"/>
            </n-form-item>
          
          </n-form>
        </n-space>
      </n-card>
      <template #footer>
        <n-flex justify="space-around" size="large">
          <n-button type="primary" @click="agentSubmit">
            保存
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
    
  </n-drawer>

  <!-- rtc消耗点配置 -->
  <n-modal v-model:show="showRtcModal" :auto-focus="false">
    <n-card
      style="width: 600px"
      title="配置RTC"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-icon size="25px" @click="showRtcModal=false;">
          <CloseOne/>
        </n-icon>
      </template>
      <n-form
        :model="rtcModelForm"
        label-placement="top"
        :label-width="160"
        :style="{
          maxWidth: '580px',
        }"
      >
        <n-form-item label="配置项">
          <n-select
            class="filter-select"
            :value="rtcModelForm.rtcValue"
            :options="rtcOptions"
            @update:value="rtcHandleFilterChange"
            style="width: 100%;border: 1px solid #e5e7eb;border-radius: 6px;"
            placeholder="请选择要配置的选项"
          />
        </n-form-item>
        <n-form-item v-if="rtcModelForm.rtcValue == 'cost' " :label="`RTC资源点消耗「${rtcModelForm.quantity}」`" path="quantity">
            <n-slider :tooltip="false" v-model:value="rtcModelForm.quantity" :step="1"/>
        </n-form-item>
        <n-form-item v-if="rtcModelForm.rtcValue == 'pat' " label="PAT令牌" path="pat">
            <n-input v-model:value="rtcModelForm.pat" type="text" placeholder="请输入PAT令牌" />
        </n-form-item>
      
      </n-form>
      <template #footer>
        <n-flex justify="space-around" size="large">
          <n-button type="primary" @click="submitRtcMCost">保存</n-button>
        </n-flex>
      </template>
    </n-card>
  </n-modal>

  <!-- 更新模型自建 -->
  <n-modal v-model:show="showUpdateModal">
    <n-card
      style="width: 600px"
      title="更新模型(自建)"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-icon size="25px" @click="showUpdateModal = false">
          <CloseOne/>
        </n-icon>
      </template>
      <n-form
        :model="updateModelForm"
        label-placement="top"
        :label-width="160"
        :style="{
          maxWidth: '580px',
        }"
      >
        <n-form-item label="更新边界" path="updateDatetime">
          <n-date-picker
            v-model:formatted-value="updateModelForm.updateDatetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            clearable
            style="width:100%"
          />
        </n-form-item>
        <n-form-item label="模型ID" path="modalId">
          <n-input v-model:value="updateModelForm.modalId" type="text" placeholder="请输入模型ID" />
        </n-form-item>
      
      </n-form>
      <template #footer>
        <n-flex justify="end" size="large">
          <n-button @click="showUpdateModal = false">取消</n-button>
          <n-button type="primary" @click="modalSubmit">保存</n-button>
        </n-flex>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
.agent-management-container {
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

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.agent-card {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.agent-name {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
}

.update-time {
  font-size: 12px;
  color: #6b7280;
}

.pagination-container {
  display: flex;
  justify-content: right;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
</style>


