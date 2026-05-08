<script setup>
//global import

import { h, onMounted, ref, watch, computed, getCurrentInstance } from "vue";
import { RouterLink,useRoute } from "vue-router";
const route = useRoute();
import { 
    NFlex,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NIcon,
    
 } from "naive-ui";
import {
    Robot,
    Me,
    Logout,
    ElectronicDoorLock,
} from "@icon-park/vue-next"


//global init
const renderIcon = (icon) => {
    return () => h(NIcon, null, {default:()=>h(icon)});
}
const contentHeight =ref(0)

const { proxy } = getCurrentInstance()


//menu init
const activeKey = ref();
const loginStaff = ref("Me▾")


const menuOptions = ref([
    {
        label: () => h(RouterLink, {to:{name:"Agent",params:{}}},{default:()=>'Agent'}),key:"agent",icon:renderIcon(Robot)
    },
    {
        label: loginStaff.value,
        key: "login-owner",
        icon: renderIcon(Me),
        children: [
            {
                label: () => h(RouterLink, {to:{name:"Change",params:{}}},{default:()=>'Change Password'}),key:"change",icon:renderIcon(ElectronicDoorLock)
            },
            {
                label: () => h(RouterLink, {to:{name:"Logout",params:{}}},{default:()=>'Logout'}),key:"logout",icon:renderIcon(Logout)
            }
            
        ]
    }
])

//global function
const adjustMargins = () => {
    
    contentHeight.value = window.innerHeight - document.getElementById("mainHeader").clientHeight - document.getElementById('mainFooter').clientHeight - 2
}
onMounted(() => {
    window.addEventListener("resize", adjustMargins)
    adjustMargins()
    let routerName = window.location.hash.replace("#/",'').indexOf("?") > 0 ? window.location.hash.replace("#/",'').split('?')[0] : window.location.hash.replace("#/",'');
    //routerName.charAt(0).toUpperCase() + routerName.slice(1)
    routerName ? activeKey.value = routerName : activeKey.value = 'home';
    
}) 

watch(route, () => {
    let routerName = window.location.hash.replace("#/",'').indexOf("?") > 0 ? window.location.hash.replace("#/",'').split('?')[0] : window.location.hash.replace("#/",'');
    routerName ? activeKey.value = routerName : activeKey.value = 'home'
});
    
</script>

<template>

    <n-flex vertical>

        <n-layout>

            <n-layout-header bordered id="mainHeader">

                <n-menu
                    v-model:value="activeKey"
                    mode="horizontal"
                    :options="menuOptions"
                    responsive
                />

            </n-layout-header>

            <n-layout :style="{'height': contentHeight +'px'}"  id="">
                

                <n-layout-content :native-scrollbar="false" content-style="padding:10px">
                    <router-view :key="$route.fullPath"/>
                </n-layout-content>

            </n-layout>

            <n-layout-footer style="padding:10px" id="mainFooter">
                Last Version is Dev 20260506
            </n-layout-footer>

        </n-layout>

    </n-flex>
       
</template>

<style scoped>
 
</style>

