import axios from 'axios';

import { API_BASE_URL } from '@/config/config';
import store from '@/store/store';

export class AuthService {
    static async handleSuccess(data: any, email: string) {
        const accessToken = data.AccessToken;
        if (accessToken) {
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
            const userInfo = userInformationResponse.data.Data.user;

            store.commit('user/setUser', userInfo);
            store.commit('user/setStores', userInfo.store);
            
            return userInformationResponse.data.Data.user;
        } else {
            console.error('AccessToken alınamadı.');
        }
    }
    static async login(email: string, password: string): Promise<any> {
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

                const userData = await this.handleSuccess(response.data.Data, email);
                return {
                    success: true,
                    user: userData,
                    token: response.data.Data.AccessToken,
                };
            } else {
                console.error('API yanıtı başarısız:', response.data.ApiStatusMessage);
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.response.data.message,
            };
        } finally {
            store.dispatch('loading/stopLoading')
        }
    }
    static isAuthenticated(): boolean {
        return store.state.accessToken !== null;
    }
    static async logout(): Promise<void> {
        try {
            await axios.post('/user/logout');
            store.commit('setAccessToken', null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Loading durumunu kapat
            store.commit('setLoading', false);
        }
    }
}