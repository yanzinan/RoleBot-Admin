<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    onMounted(() => {
        sessionStorage.clear();
        router.push("/login");
    })
</script>

<template>
    <div>
        Log out
    </div>
</template>

<style>
</style>