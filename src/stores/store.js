import { defineStore } from "pinia";

export const useMainStore = defineStore('main', {
    state:() => ({
        pagination: 10,
        loadingShow:false,
        baseUrl:'https://www.kaoiki.com'
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