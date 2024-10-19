<script setup lang="ts">
import { onMounted } from 'vue'
import { openWhiteScreen } from './check'
import Carousel from '@/components/Carousel/Carousel.vue'
import Goods from '@/components/Goods/Goods.vue'

// onMounted(() => {
//     openWhiteScreen((res: any) => {
//         console.log(res)
//     }, {
//         skeletonProject: false,
//         whiteBoxElements: ['html', 'body', '#app', '#root'],
//     })
// })

const images = [
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
]

const menus = ['欢', '迎', '来', '到', '天', '猫', '双', '11']

const googs = [
    {
        id: 1,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯1',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 2,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯2',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 3,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 4,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 5,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 6,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 7,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
    {
        id: 8,
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp',
        title: '超级大吊灯003',
        desc: '天猫双11，全程5折起',
    },
]

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function onMenuJump(src: string) {
    console.log(src)
}

function onCarouselClick(src: string) {
    console.log(src)
}
</script>

<!-- 白屏检测 -->
<template>
    <div class="home-page">
        <!-- 轮播图 -->
        <Carousel :images="images" @click-img="onCarouselClick" />
        <!-- 菜单按钮 -->
        <div v-if="menus.length" class="menu-btn-zone">
            <div v-for="(item, index) in menus" :key="index" class="menu-btn"
                :style="{ backgroundColor: getRandomColor() }" @click="onMenuJump(item)">
                {{ item }}
            </div>
        </div>
        <!-- 推荐商品 -->
        <div class="recommend-goods">
            <div v-for="item in googs" :key="item.id" class="good-item">
                <Goods :src="item.src" :title="item.title" :sub-title="item.desc" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.menu-btn-zone {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 8px;

    .menu-btn {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        margin: 10px
    }
}

.recommend-goods {
    display: flex;
    flex-wrap: wrap;

    .good-item {
        padding: 0 8px;
        width: 50%;
        box-sizing: border-box;
    }
}
</style>
