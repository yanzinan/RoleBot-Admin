import { defineStore } from "pinia";

export const useMainStore = defineStore('main', {
    state:() => ({
        pagination: 10,
        loadingShow:false,
        baseUrl:'http://47.103.35.90:4202'
    }),
    actions:{
        setPagination(value) {
            this.pagination = value
        },
        setAllLoading(value){
            this.loadingShow = value
        }
    }
})