<template>
    <div class="loading-spinner-container">
        <div class="loading-spinner" :style="{ color: props.spinnerColor, fontSize: props.spinnerSize + 'px' }">
            <div class="spinner-circle"></div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps(['isLoading', 'spinnerColor', 'spinnerSize']);
</script>
  
<style scoped>
.loading-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.loading-spinner {
    position: relative;
}

.spinner-circle {
    width: 70px;
    height: 70px;
    border: 7px solid #e0e0e0;
    border-radius: 50%;
    border-top: 7px solid #3498db;
    animation: spin 1s infinite linear;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
  