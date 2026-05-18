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
        yearly_member_fee:null,
        quarterly_member_fee:null,
        monthly_member_fee:null,
        yearly_member_bonus_point:null,
        quarterly_member_bonus_point:null,
        monthly_member_bonus_point:null,
        guest_bonus_point:null,
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
            <n-form-item label="年度会员费用" path="yearly_member_fee">
                <n-input-number style="width:100%" v-model:value="memberOrder.yearly_member_fee" clearable min="1"/>
            </n-form-item>
        
        </n-form>
    </n-flex>
</template>

<style scoped>

</style>


