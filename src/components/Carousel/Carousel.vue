<script setup lang="ts">
import { emit } from 'node:process'

defineProps({
    images: {
        type: Array<string>,
    },
    curIndex: {
        type: Number,
        default: 1,
    },
})

const emits = defineEmits(['clickImg'])

function onClickImg(src: string) {
    emits('clickImg', src)
}
</script>

<template>
    <div class="carousel-wrapper">
        <a-carousel autoplay :style="{ width: '100%', height: '300px' }" :default-current="curIndex">
            <a-carousel-item v-for="(image, index) in images" :key="index">
                <a-image :src="image" width="100%" height="300px" fit="cover" :preview="false"
                    @click="onClickImg(image)" />"
            </a-carousel-item>
        </a-carousel>
    </div>
</template>

<style scoped></style>
