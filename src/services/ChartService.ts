import axios from 'axios';
import { API_BASE_URL } from "@/config/config";
import store from '@/store/store';

class ChartService {
  static async getDailySalesOverview(accessToken: string, sellerId: string, marketplace: string, day: number): Promise<any> {
    try {
      store.commit('setLoading', true);
      const response = await axios.post(API_BASE_URL + `/data/daily-sales-overview`,
        {
          customDateData: null,
          day: day,
          excludeYoYData: true,
          marketplace: marketplace,
          requestStatus: 0,
          sellerId: sellerId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
        
      return {
        success: true,
        response: response.data.Data,
      };
    } catch (error: any) {
      console.log(error);
      // throw new Error(error.response.data.message);
    } finally {
      store.commit('setLoading', false);
    }
  }

  static async getDailySalesSkuList(params: any) {
      const response = await axios.post(API_BASE_URL+`/data/daily-sales-sku-list`, {
        params,
      });
      console.log();
      
      return response.data;
  }
}

export default ChartService;