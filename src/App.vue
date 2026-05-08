<script setup>
	import { ref,onMounted,getCurrentInstance,computed } from 'vue';
	import {
        NSpin
    } from 'naive-ui'

	const { proxy } = getCurrentInstance()

	const loadingShow = computed(() => {
		return proxy.$mainStore.loadingShow
	});

</script>

<template>
	<n-spin :show="loadingShow">
		<n-dialog-provider>
			<n-modal-provider>
				<router-view :key="$route.fullPath"/>
			</n-modal-provider>
		</n-dialog-provider>
	</n-spin>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

body {
	margin: 0 auto;
	text-align:center;
}
</style>
