import axios from 'axios';

import { API_BASE_URL } from '@/config/config';

export default {
    async handleSuccess(data: any, email: string) {
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
    },
    async login(email: string, password: string): Promise<any>{
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
            console.log(response);
            
            if (response.data.ApiStatus) {
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
        }
    }
}