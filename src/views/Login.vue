<script setup>

    //global import
    import { ref,onMounted,getCurrentInstance } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAxios } from '../services/axios.js'
    import axios from 'axios';
    
    

    import {
        NCard,
        NForm,
        NFormItem,
        NInput,
        NButton
    } from 'naive-ui';

    const { proxy } = getCurrentInstance()
    const axiosService = useAxios();


    //global init
    const router = useRouter()
    const marginTop = ref(0)
    const marginLeft = ref(0)


    //Login

    const loginData = ref({
        usr: null,
        pwd: null,
    })

    const loginDo = () => {
        if (!loginData.value.usr || !loginData.value.pwd) {
            // 如果usr或pwd为空或null，则执行以下代码
            tipsForLogin("账号和密码不能为空。");
        } else {
            // 打开加载中loading
            proxy.$mainStore.setAllLoading(true);
            // 如果usr和pwd都不为空且不为null，则执行以下代码
            axiosService.post('admin-login',{
                "username": loginData.value.usr,
                "password": loginData.value.pwd
            })
            .then(response => {
                if(response.code == 0){
                    localStorage.setItem("RoleBot-Admin-Login","True");
                    localStorage.setItem("username",response.data.username);
                    localStorage.setItem("id",response.data.id);
                    localStorage.setItem("RoleBot-Admin-Token",response.data.token);
                    router.push("/");
                }else{
                    tipsForLogin(response.message)
                }
                proxy.$mainStore.setAllLoading(false);
            })
            
        }
    }

    const adjustMargins = () => {
        marginLeft.value = ( window.innerWidth - document.getElementById("loginCard").clientWidth) / 2
        marginTop.value = ( window.innerHeight - document.getElementById("loginCard").clientHeight) / 2
    }

    const tipsForLogin = (msg) => {
        Swal.fire({
            icon: "error",
            title:'提示',
            text:msg,
        });
    };

    onMounted(()=>{
       window.addEventListener("resize", adjustMargins)
       adjustMargins()
    }) 

</script>

<template>
    <div>
        <n-card title="Login" hoverable :style="{ 'margin-top': marginTop + 'px', 'margin-left': marginLeft + 'px' }" id="loginCard">
            <n-form novalidate>
                <n-form-item label="Username">
                    <n-input v-model:value="loginData.usr" round clearable :input-props="{ autocomplete: 'off' }" placeholder="please input"/>
                </n-form-item>

                <n-form-item label="Password">
                    <n-input v-model:value="loginData.pwd" type="password" round show-password-on="click" clearable :input-props="{ autocomplete: 'new-password' }" placeholder="please input"/>
                </n-form-item>

                <n-button strong secondary round type="success" style="width: 100%;" @click="loginDo">
                    Log in
                </n-button>
            </n-form>
        </n-card>
    </div>
</template>

<style scoped>

    .n-card {
        margin-top:100px;
        width: 500px;
        max-width: 500px;
    }

    :deep(.n-base-selection) {
        border-radius: 20px!important;
    }


</style>