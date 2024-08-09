<template>
    <div class="example-wrapper">
        <h1>JS 监控测试</h1>
        <button id="codeErr" @click="codeError()">代码错误</button>
        <button id="codeErr" @click="imgError()">加载异常图片</button>
        <button id="exceptionReq" @click="onClickXhrError()">xhr异常请求</button>
        <button id="exceptionFetch" @click="onClickNativeErrorFetch()">Fetch异常请求</button>
        <button id="promiseError" @click="promiseError()">Promise Error</button>
        <!-- <button id="hashChange" @click="hashChange()">改变hash</button> -->

        <div>
            <img src="./12.png" v-if="imgShow">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const imgShow = ref(false)

function codeError() {
    let a = {};
    a.split('/');
}

function imgError() {
    imgShow.value = true;
}

function promiseError() {
    const promiseWrap = () =>
        new Promise((resolve, reject) => {
            reject('promise reject');
        });
    promiseWrap().then((res) => {
        console.log('res', res);
    });
}

function onClickNativeErrorFetch() {
    fetch('/exception/post', {
        method: 'POST',
        body: JSON.stringify({ test: 'test request body' }),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(
        (res) => {
            res.text().then((res) => console.log('res', res));
        },
        (err) => {
            console.log('err', err);
        },
    );
}

function onClickXhrError() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/exception');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
        }
    };
}
</script>

<style scoped>
.example-wrapper button {
    margin: 0 10px;
}
</style>
