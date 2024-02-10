import axios from 'axios';

import { API_BASE_URL } from '@/config/config';
import store from '@/store';

export class AuthService {
    static async handleSuccess(data: any, email: string) {
        const accessToken = data.AccessToken;
        if (accessToken) {

            // Şimdi, AccessToken ile başka bir API isteği yapabilirsiniz.
            // Örneğin, user-information gibi bir endpoint'e istek gönderebilirsiniz.
            const userInformationResponse = await axios.post(API_BASE_URL + '/user/user-information',
                {
                    email: email
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            // console.log('User Information:', userInformationResponse.data);
            return userInformationResponse.data.Data.user;
        } else {
            console.error('AccessToken alınamadı.');
        }
    }
    static async login(email: string, password: string): Promise<any>{
        try {
            const response = await axios.post(API_BASE_URL + '/oauth/token', {
                Email: email,
                Password: password,
                GrantType: "password",
                Scope: "amazon_data",
                ClientId: "C0001",
                ClientSecret: "SECRET0001",
                RedirectUri: "https://api.eva.guru",
            });
            
            if (response.data.ApiStatus) {
                const accessToken = response.data.Data.AccessToken;
                store.commit('setAccessToken', accessToken);

                const userData = this.handleSuccess(response.data.Data, email);
                return {
                    success: true,
                    user: userData,
                    token: response.data.Data.AccessToken,
                  };
            } else {
                console.error('API yanıtı başarısız:', response.data.ApiStatusMessage);
            }
        } catch (error:any) {
            return {
                success: false,
                error: error.response.data.message, // Örneğin, hata mesajını dönebilir
              };
        } finally{
            store.commit('setLoading', false);
        }
    }
    static isAuthenticated(): boolean {
        // Kullanıcının oturum açıp açık olup olmadığını kontrol et
        // Örneğin, token var mı veya başka bir kimlik doğrulama yöntemi var mı?
        // Dönen değere göre true veya false döndür
        return store.state.accessToken !== null;
    }
    static async logout(): Promise<void> {
        try {
            // Çıkış işlemi için user/logout endpointine POST isteği yap
            await axios.post('/user/logout');
            store.commit('setAccessToken', null);

            // İsteğe bağlı olarak, kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
            // router.push('/login');
        } catch (error) {
            // Çıkış işlemi başarısızsa hata mesajını yazdırabilirsiniz
            console.error('Logout error:', error);
        } finally {
            // Loading durumunu kapat
            store.commit('setLoading', false);
        }
    }
}