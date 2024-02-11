<template>
    <div>
        <h2>Login</h2>
        <div v-if="loading" class="overlay">
            <div class="loading-spinner"></div>
        </div>
        <div v-else>
            <form @submit.prevent="login">
                <label>Email:</label>
                <input v-model="formData.email" type="text" />

                <label>Password:</label>
                <input v-model="formData.password" type="password" />

                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { AuthService } from '@/services/AuthService';
import router from '@/router/route';

interface FormData {
    email: string;
    password: string;
}

const formData = ref<FormData>({
    email: 'homework@eva.guru',
    password: 'Homeworkeva1**',
});

const loading = ref(false);

const login = async () => {
    try {
        loading.value = true;
        const response: any = await AuthService.login(formData.value.email, formData.value.password);

        if (response.success) {
            router.push('/home');
        } else {
            console.error('Login failed. Error:', response.error);
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
</script>
  
<style scoped>
.loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 100px;
    height: 100px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style>
  