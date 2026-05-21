<script setup>

    //global init

    import { h, ref, onMounted,getCurrentInstance, computed  } from "vue"
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

    const memberOrder = ref({
        grace_period:true,
        expiry_date:null,
        yearly_member_fee_regular:null,
        yearly_member_fee:null,
        quarterly_member_fee_regular:null,
        quarterly_member_fee:null,
        monthly_member_fee_regular:null,
        monthly_member_fee:null,
        yearly_member_bonus_point:null,
        quarterly_member_bonus_point:null,
        monthly_member_bonus_point:null,
        guest_bonus_point:null,
        guest_member_report_count:null,
        monthly_member_report_count:null,
        quarterly_member_report_count:null,
    })

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

    const gracePeriodChange = (value) => {
        memberOrder.value.grace_period = value
        if(value){
            // 请求json 做回显
        }else{
            memberOrder.value.expiry_date = "";
            memberOrder.value.yearly_member_fee_regular = "";
            memberOrder.value.quarterly_member_fee_regular = "",
            memberOrder.value.monthly_member_fee_regular = "";
        }
    }

    // 生成配置
    const generateConfig = () => {
        if(memberOrder.value.grace_period && !memberOrder.value.expiry_date){
            dialog.warning({
                title: '提示',
                content: '请填写优惠价格截止日期。',
                negativeText: '关闭'
            })
            return false
        }

        if(memberOrder.value.grace_period && !memberOrder.value.yearly_member_fee_regular){
            dialog.warning({
                title: '提示',
                content: '请填写优惠前的年度会员定价。',
                negativeText: '关闭'
            })
            return false
        }

        if(memberOrder.value.grace_period && !memberOrder.value.quarterly_member_fee_regular){
            dialog.warning({
                title: '提示',
                content: '请填写优惠前的季度会员定价。',
                negativeText: '关闭'
            })
            return false
        }

        if(memberOrder.value.grace_period && !memberOrder.value.monthly_member_fee_regular){
            dialog.warning({
                title: '提示',
                content: '请填写优惠前的月度会员定价。',
                negativeText: '关闭'
            })
            return false
        }

        // 保存：弹出二次确认框
        dialog.warning({
            title: '确认保存',
            content: '保存当前配置会覆盖之前的数据，您确定要继续吗？',
            positiveText: '保存',
            negativeText: '取消',
            onPositiveClick: () => {
                // 打开加载中loading
                proxy.$mainStore.setAllLoading(true);
                axiosService.post('member-config-save',{
                    gracePeriod:memberOrder.value.grace_period,
                    expiryDate:memberOrder.value.expiry_date,
                    yearlyMemberFeeRegular:memberOrder.value.yearly_member_fee_regular,
                    quarterlyMemberFeeRegular:memberOrder.value.quarterly_member_fee_regular,
                    monthlyMemberFeeRegular:memberOrder.value.monthly_member_fee_regular,
                })
                .then(response => {
                    if(response.code == 0){
                        // getMemberFeeBonus()
                        // currentRef.value = 1
                        jsonData.value = response.data
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

    const jsonData = ref({
        "grace_period":true,
        "member_activity_expiration_date":"2025-12-31 23:59:59",
        "memberDetail":[
        {
            "memberType":"3",
            "regularPrice":"￥189",
            "salePrice":"￥139",
            "packageId":"yearly_member"
        },
        {
            "memberType":"2",
            "regularPrice":"￥49",
            "salePrice":"￥39",
            "packageId":"quarterly_member"
        },
        {
            "memberType":"1",
            "regularPrice":"￥19",
            "salePrice":"￥15",
            "packageId":"monthly_member"
        }
        ],
        "yearly_member_bonus_point":"120000",
        "quarterly_member_bonus_point":"30000",
        "monthly_member_bonus_point":"10000",
        "yearly_member_report_count":"4",
        "quarterly_member_report_count":"4",
        "monthly_member_report_count":"2"
    })

    const currentRef = ref(1);
    const currentStatusRef = ref("process");

    const current = currentRef;
    const currentStatus = currentStatusRef;

    // 下一步
    const handleNextClick = () => {
        if(currentRef.value === 1 && !memberOrder.value.yearly_member_fee){
            dialog.warning({
                title: '提示',
                content: '请填写年度会员费用。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.quarterly_member_fee){
            dialog.warning({
                title: '提示',
                content: '请填写季度会员费用。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.monthly_member_fee){
            dialog.warning({
                title: '提示',
                content: '请填写月度会员费用。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.yearly_member_bonus_point){
            dialog.warning({
                title: '提示',
                content: '请填写年度会员送点。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.quarterly_member_bonus_point){
            dialog.warning({
                title: '提示',
                content: '请填写季度会员送点。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.monthly_member_bonus_point){
            dialog.warning({
                title: '提示',
                content: '请填写月度会员送点。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 1 && !memberOrder.value.guest_bonus_point){
            dialog.warning({
                title: '提示',
                content: '请填写游客送点。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 2 && !memberOrder.value.guest_member_report_count){
            dialog.warning({
                title: '提示',
                content: '请填写游客每月可进行心理评估报告次数。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 2 && !memberOrder.value.monthly_member_report_count){
            dialog.warning({
                title: '提示',
                content: '请填写月卡会员每月可进行心理评估报告次数。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 2 && !memberOrder.value.quarterly_member_report_count){
            dialog.warning({
                title: '提示',
                content: '请填写季卡会员每月可进行心理评估报告次数。',
                negativeText: '关闭'
            })
            return false
        }

        if(currentRef.value === 2 && !memberOrder.value.yearly_member_report_count){
            dialog.warning({
                title: '提示',
                content: '请填写年卡会员每月可进行心理评估报告次数。',
                negativeText: '关闭'
            })
            return false
        }

        // 保存：弹出二次确认框
        dialog.warning({
            title: '确认保存',
            content: '在跳转下一步之前会优先保存当前配置，您确定要继续吗？',
            positiveText: '保存',
            negativeText: '取消',
            onPositiveClick: () => {
                // 当前为第一步的保存
                if(currentRef.value === 1){
                    // 打开加载中loading
                    proxy.$mainStore.setAllLoading(true);
                    axiosService.post('master-member-fee-bonus-save',{
                        yearly_member_fee:memberOrder.value.yearly_member_fee,
                        quarterly_member_fee:memberOrder.value.quarterly_member_fee,
                        monthly_member_fee:memberOrder.value.monthly_member_fee,
                        yearly_member_bonus_point:memberOrder.value.yearly_member_bonus_point,
                        quarterly_member_bonus_point:memberOrder.value.quarterly_member_bonus_point,
                        monthly_member_bonus_point:memberOrder.value.monthly_member_bonus_point,
                        guest_bonus_point:memberOrder.value.guest_bonus_point,
                    })
                    .then(response => {
                        if(response.code == 0){
                            getMemberFeeBonus()
                            currentRef.value = 2
                            getReportUsageCount()
                        }else{
                            tipsForLogin(response.code,response.message)
                        }
                        proxy.$mainStore.setAllLoading(false);
                    })
                }

                // 当前为第一步的保存
                if(currentRef.value === 2){
                    // 打开加载中loading
                    proxy.$mainStore.setAllLoading(true);
                    axiosService.post('master-report-usage-count-save',{
                        guest_member_report_count:memberOrder.value.guest_member_report_count,
                        monthly_member_report_count:memberOrder.value.monthly_member_report_count,
                        quarterly_member_report_count:memberOrder.value.quarterly_member_report_count,
                        yearly_member_report_count:memberOrder.value.yearly_member_report_count,
                    })
                    .then(response => {
                        if(response.code == 0){
                            getReportUsageCount()
                            currentRef.value = 3
                        }else{
                            tipsForLogin(response.code,response.message)
                        }
                        proxy.$mainStore.setAllLoading(false);
                    })
                }
                
            },
            onNegativeClick: () => {
                console.log('取消删除')
            }
        })
    }
    // 上一步
    const handlePreClick = () => {
        if (currentRef.value === 0)
            currentRef.value = null;
        else if (currentRef.value === null)
            currentRef.value = 3;
        else currentRef.value--;
    }

    // 保存json
    const submitConfig = () => {

    }

    // 获取会员和送点
    const getMemberFeeBonus = async() => {
        // 打开加载中loading
        proxy.$mainStore.setAllLoading(true);
        await axiosService.get('master-member-fee-bonus',{})
        .then(response => {
            if(response.code == 0){
                memberOrder.value.yearly_member_fee = Number(response.data.yearly_member_fee);
                memberOrder.value.quarterly_member_fee = Number(response.data.quarterly_member_fee);
                memberOrder.value.monthly_member_fee = Number(response.data.monthly_member_fee);
                memberOrder.value.yearly_member_bonus_point = Number(response.data.yearly_member_bonus_point);
                memberOrder.value.quarterly_member_bonus_point = Number(response.data.quarterly_member_bonus_point);
                memberOrder.value.monthly_member_bonus_point = Number(response.data.monthly_member_bonus_point);
                memberOrder.value.guest_bonus_point = Number(response.data.guest_bonus_point);
            }else{
                tipsForLogin(response.code,response.message)
            }
            proxy.$mainStore.setAllLoading(false);
        })
    }

    // 获取评估报告次数
    const getReportUsageCount = async() => {
        // 打开加载中loading
        proxy.$mainStore.setAllLoading(true);
        await axiosService.get('master-report-usage-count',{})
        .then(response => {
            if(response.code == 0){
                memberOrder.value.guest_member_report_count = Number(response.data.guest_member_report_count);
                memberOrder.value.monthly_member_report_count = Number(response.data.monthly_member_report_count);
                memberOrder.value.quarterly_member_report_count = Number(response.data.quarterly_member_report_count);
                memberOrder.value.yearly_member_report_count = Number(response.data.yearly_member_report_count);
                
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
    //global init
    onMounted(() => {
      getMemberFeeBonus()
    });

</script>

<template>
    <n-flex justify="center">
        <n-steps :current="current" :status="currentStatus" style="width:60%">
            <n-step title="配置会员费用 and 送点">
            </n-step>
            <n-step title="配置报告使用次数">
                <div class="n-step-description">
                
                </div>
            </n-step>
            <n-step title="额外字段的补充提交">
                <div class="n-step-description">
                
                </div>
            </n-step>
        </n-steps>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px" v-if="current === 1">
        <n-form
            :model="memberOrder"
            label-placement="top"
            :label-width="160"
            :style="{
                width: '600px',
            }"
        >
            <n-form-item label="年度会员费用（分）" path="yearly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_fee" clearable min="1"/>
            </n-form-item>
            <n-form-item label="季度会员费用（分）" path="quarterly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_fee" clearable min="1"/>
            </n-form-item>
            <n-form-item label="月度会员费用（分）" path="monthly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_fee" clearable min="1"/>
            </n-form-item>
            <n-form-item label="年度会员送点" path="yearly_member_bonus_point">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_bonus_point" clearable min="1"/>
            </n-form-item>
            <n-form-item label="季度会员送点" path="quarterly_member_bonus_point">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_bonus_point" clearable min="1"/>
            </n-form-item>
            <n-form-item label="月度会员送点" path="monthly_member_bonus_point">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_bonus_point" clearable min="1"/>
            </n-form-item>
            <n-form-item label="游客送点" path="guest_bonus_point">
                <n-input-number style="width:100%" v-model:value="memberOrder.guest_bonus_point" clearable min="1"/>
            </n-form-item>
            
        </n-form>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px" v-if="current === 2">
        <n-form
            :model="memberOrder"
            label-placement="top"
            :label-width="160"
            :style="{
                width: '600px',
            }"
        >
            <n-form-item label="游客每月可进行心理评估报告次数" path="guest_member_report_count">
                <n-input-number style="width:100%" v-model:value="memberOrder.guest_member_report_count" clearable min="1"/>
            </n-form-item>
            <n-form-item label="月卡会员每月可进行心理评估报告次数" path="monthly_member_report_count">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_report_count" clearable min="1"/>
            </n-form-item>
            <n-form-item label="季卡会员每月可进行心理评估报告次数" path="quarterly_member_report_count">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_report_count" clearable min="1"/>
            </n-form-item>
            <n-form-item label="年卡会员每月可进行心理评估报告次数" path="yearly_member_report_count">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_report_count" clearable min="1"/>
            </n-form-item>
        </n-form>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px" v-if="current === 3">
        <n-form
            :model="memberOrder"
            label-placement="top"
            :label-width="160"
            :style="{
                width: '600px',
            }"
        >
            <n-form-item label="是否显示优惠" path="grace_period">
              <n-switch :rail-style="railStyle" v-model:value="memberOrder.grace_period" @update:value="gracePeriodChange">
                <template #checked>
                  显示优惠
                </template>
                <template #unchecked>
                  不显示优惠
                </template>
              </n-switch>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠价格截止日期" path="expiry_date">
                <n-date-picker style="width:100%" v-model:formatted-value="memberOrder.expiry_date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠前的年度会员定价" path="yearly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_fee_regular" clearable min="1"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠前的季度会员定价" path="quarterly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_fee_regular" clearable min="1"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠前的月度会员定价" path="monthly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_fee_regular" clearable min="1"/>
            </n-form-item>
        </n-form>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px" v-if="current === 3">
        <n-button type="primary" @click="generateConfig">生成配置</n-button>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px" v-if="current === 3">
        <pre style="width:560px;height:auto;background:#eee;padding:20px;">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px">
        <n-button type="primary" @click="handlePreClick" v-if="current === 2 || current === 3" style="margin:0 30px">上一步</n-button>
        <n-button type="primary" @click="handleNextClick" v-if="current === 1 || current === 2" style="margin:0 30px">下一步</n-button>
        <n-button type="primary" @click="submitConfig" v-if="current === 3" style="margin:0 30px">保存配置文件</n-button>
    </n-flex>
</template>

<style scoped>

</style>


