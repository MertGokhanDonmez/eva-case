<template>
    <div>
        <LoadingSpinner class="overlay" v-if="isLoading" :spinner-width="70" :spinner-height="70" />
        <section v-else>
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-8">
                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 shadow-lg">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Sign in to your account
                        </h1>
                        <form class="space-y-4 md:space-y-6" @submit.prevent="login">
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                                    email</label>
                                <input v-model="formData.email" type="email" name="email" id="email"
                                    class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="name@company.com" required="true">
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                <input v-model="formData.password" type="password" name="password" id="password"
                                    placeholder="••••••••"
                                    class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                    required="true">
                            </div>
                            <button
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
                                text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign
                                In</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import { AuthService } from '@/services/AuthService';
import router from '@/router/route';
import store from '@/store/store';
import LoadingSpinner from "./LoadingSpinner.vue";

const isLoading = computed(() => store.getters['loading/isLoading']);

interface FormData {
    email: string;
    password: string;
}

const formData = ref<FormData>({
    email: 'homework@eva.guru',
    password: 'Homeworkeva1**',
});

const login = async () => {
    try {
        store.dispatch('loading/startLoading');
        console.log(store.getters['loading/isLoading']);

        const response: any = await AuthService.login(formData.value.email, formData.value.password);

        if (response.success) {
            router.push('/home');
        } else {
            console.error('Login failed. Error:', response.error);
        }
    } catch (error) {
        console.error(error);
    } finally {
        store.dispatch('loading/stopLoading');
    }
};
</script>
  
<style scoped>
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
  