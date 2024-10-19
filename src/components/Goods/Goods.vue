<script setup lang="ts">
defineProps({
    src: String,
    title: String,
    subTitle: String || null,
})
</script>

<template>
    <div class="googs-zone">
        <a-image :src="src" width="100%" fit="cover" :preview="false" />
        <div v-if="title" class="title">
            {{ title }}
        </div>
        <div v-if="subTitle" class="sub-title">
            {{ subTitle }}
        </div>
    </div>
</template>

<style scoped>
.googs-zone {
    margin-bottom: 10px;

    .title {
        font-size: 18px;
        color: #333;
        margin: 10px 0;
    }

    .sub-title {
        font-size: 14px;
        color: #666;
    }
}
</style>
