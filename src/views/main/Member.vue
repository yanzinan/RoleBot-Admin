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
      if(value == true){
        
      }else{
        
      }
    }

    // 生成配置
    const generateConfig = () => {

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
        "monthly_member_bonus_point":"10000"
    })

    //global init
    onMounted(() => {
      
    });

</script>

<template>
    <n-flex justify="center" style="margin-top:30px">
        <n-form
            :model="memberOrder"
            label-placement="top"
            :label-width="160"
            :style="{
                width: '600px',
            }"
        >
            <n-form-item label="年度会员费用" path="yearly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_fee_regular" clearable min="1"/>
            </n-form-item>
            <n-form-item label="季度会员费用" path="quarterly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_fee_regular" clearable min="1"/>
            </n-form-item>
            <n-form-item label="月度会员费用" path="monthly_member_fee_regular">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_fee_regular" clearable min="1"/>
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
            <n-form-item label="是否优惠" path="grace_period">
              <n-switch :rail-style="railStyle" v-model:value="memberOrder.grace_period" @update:value="gracePeriodChange">
                <template #checked>
                  优惠
                </template>
                <template #unchecked>
                  原价
                </template>
              </n-switch>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠价格截止日期" path="expiry_date">
                <n-date-picker style="width:100%" v-model:value="memberOrder.expiry_date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠后的年度会员费用" path="yearly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_fee" clearable min="1"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠后的季度会员费用" path="quarterly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.quarterly_member_fee" clearable min="1"/>
            </n-form-item>
            <n-form-item v-if="memberOrder.grace_period" label="优惠后的月度会员费用" path="monthly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.monthly_member_fee" clearable min="1"/>
            </n-form-item>
        </n-form>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px">
        <n-button type="primary" @click="generateConfig">生成配置</n-button>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px">
        <pre style="width:560px;height:auto;background:#eee;padding:20px;">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </n-flex>
    <n-flex justify="center" style="margin-top:30px">
        <n-button type="primary" @click="generateConfig">保存配置文件</n-button>
    </n-flex>
</template>

<style scoped>

</style>


