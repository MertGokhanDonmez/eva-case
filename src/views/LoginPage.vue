<template>
    <div>
        <h2>Login</h2>
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
import AuthService from '@/services/AuthService';

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
    methods: {
        async login() {
            const response: any = await AuthService.login(this.formData.email, this.formData.password);

            // Eğer AuthService.login bir UserInformation nesnesi döndürürse,
            // bu kullanıcı girişi başarılıdır ve başka işlemleri gerçekleştirebilirsiniz.
            if (response.success) {
                // Örneğin, kullanıcıyı başka bir sayfaya yönlendirebilirsiniz.
                // this.$router.push('/dashboard');
                console.log("User: ", response.user);
                console.log("Token: ", response.token);

            } else {
                // Kullanıcı girişi başarısızsa burada bir hata mesajı gösterebilirsiniz.
                console.error('Login failed');
            }
        },

    },
});
</script>

<style scoped>
/* Your component styles go here */
</style>
