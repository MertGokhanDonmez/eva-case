<template>
    <div>
        <h2>Login</h2>
        <div v-if="loading" class="loading-spinner"></div>
        <form @submit.prevent="login">
            <label>Email:</label>
            <input v-model="formData.email" type="text" />

            <label>Password:</label>
            <input v-model="formData.password" type="password" />

            <button type="submit">Login</button>
        </form>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/services/AuthService';
import router from '@/router';
import { useStore } from 'vuex';

interface FormData {
    email: string;
    password: string;
}

export default defineComponent({
    data(): { formData: FormData } {
        return {
            formData: {
                email: 'homework@eva.guru',
                password: 'Homeworkeva1**',
            },
        };
    },
    computed: {
        loading(): boolean {
            return this.$store.state.loading;
        },
    },
    methods: {
        async login() {
            const store = useStore();
            try {
                store.commit('setLoading', true);
                const response: any = await AuthService.login(
                    this.formData.email,
                    this.formData.password
                );

                if (response.success) {
                    // Başarılı giriş durumunda işlemleri gerçekleştir
                    router.push('/home'); // Ana sayfaya yönlendir
                } else {
                    // Başarısız giriş durumunda hata mesajını göster
                    console.error('Login failed. Error:', response.error);
                    // İsteğe bağlı olarak kullanıcıya hata mesajını göstermek için bir mekanizma ekleyebilirsiniz
                }
            } catch (error) {
                console.error(error);
            } finally {
                store.commit('setLoading', false);
            }
        },
    },
});
</script>
  
<style scoped>
.loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 30px;
    height: 30px;
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
</style>
  