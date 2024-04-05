<template>
<div>
    <h1>Current Tab URL</h1>
    <p>{{ currentUrl }}</p>
</div>
</template>

<script>
/* global chrome */
export default {
name: 'HomeComponent',
data() {
    return {
    currentUrl: ''
    }
},
mounted() {
    this.getCurrentTabUrl();
},
methods: {
    getCurrentTabUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
        this.currentUrl = tabs[0].url;
        }
        console.log(this.currentUrl);
    });
    }
}
}
</script>

<style scoped>
/* Your styles here */
</style>
