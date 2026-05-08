<script setup>

    import { ref,onMounted,getCurrentInstance } from 'vue'
    import { useRouter } from 'vue-router';
    import { useAxios } from '../../services/axios.js'

    import {
        NGrid,
        NGi,
        NCard,
        NForm,
        NFormItem,
        NButton,
        NAlert
    } from 'naive-ui'

    import {
        Send,
    } from '@icon-park/vue-next'

    const { proxy } = getCurrentInstance()
    const axiosService = useAxios();
    const router = useRouter()

    const orderForm = ref({
        oldpwd:null,
        newpwd:null,
        confirmpwd:null
    })

    const gotoNext = () => {
        const { oldpwd, newpwd, confirmpwd } = orderForm.value;
        if (!oldpwd || !newpwd || !confirmpwd) {
            Swal.fire({
                icon: "error",
                title:'提示',
                text:'Please fill in all fields.',
            })
        } else {
            if (newpwd !== confirmpwd) {
                Swal.fire({
                    icon: "error",
                    title:'提示',
                    text:'The new passwords do not match.',
                })
            } else {
                //提交逻辑
                // 打开加载中loading
                proxy.$mainStore.setAllLoading(true);
                axiosService.post('Auth-change',{
                    "oldPwd":orderForm.value.oldpwd,
                    "newPwd":orderForm.value.newpwd
                })
                .then(response => {
                    if(response.code == 200){
                        sessionStorage.clear();
                        router.push("login");
                    }else{
                        Swal.fire({
                            icon: "error",
                            title:'提示',
                            text:response.msg,
                        })
                    }
                    proxy.$mainStore.setAllLoading(false);
                })
            }
        }
    }
    


</script>

<template>

    <n-flex justify="center">
            
        <n-alert type="warning">
            After the changes are successfully applied, you will be automatically logged out and redirected to the login page.
        </n-alert>
    
    </n-flex>

    <n-card id = "changeCard">

        <n-form :model="orderForm">
            <n-flex vertical>

                <n-form-item label="Old Password">
                    <n-input v-model:value="orderForm.oldpwd" type="password" round show-password-on="click" clearable placeholder="please input old password" />
                </n-form-item>

                <n-form-item label="New Password">
                    <n-input v-model:value="orderForm.newpwd" type="password" round show-password-on="click" clearable placeholder="please input new password" />
                </n-form-item>

                <n-form-item label="New Password Again">
                    <n-input v-model:value="orderForm.confirmpwd" type="password" round show-password-on="click" clearable placeholder="please input new password again" />
                </n-form-item>

            </n-flex>
        </n-form>

        <template #footer>
            <n-flex justify="end">
            
                <n-button strong secondary type="success" @click="gotoNext">
                    <template #icon>
                        <n-icon>
                            <Send />
                        </n-icon>
                    </template>
                    Send
                </n-button>
            
            </n-flex>
        </template>

    </n-card>
</template>

<style scoped>
 .n-card {
    width: 500px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid rgba(129, 216, 208, 0.3); /* 浅灰色边框 */
    box-shadow: 0 2px 4px rgba(129, 216, 208, 0.2); /* 淡蓝色的悬浮阴影 */
    border-radius: 5px; /* 5px的圆角 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
 }
 .n-card__action {
    background-color: white
 }
</style>