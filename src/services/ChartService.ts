import axios from 'axios';
import { API_BASE_URL } from "@/config/config";
import store from '@/store/store';

class ChartService {
  static async getDailySalesOverview(accessToken: string, sellerId: string, marketplace: string, day: number): Promise<any> {
    try {
      store.dispatch('loading/startLoading');
      if (accessToken) {
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
      }


    } catch (error: any) {
      console.log(error);
      // throw new Error(error.response.data.message);
    } finally {
      store.dispatch('loading/stopLoading');

    }
  }

  static async getDailySalesSkuList(shiftKey: any, marketplace: any, accessToken: any, salesDate: any, sellerId: any) {

    const response = await axios.post(API_BASE_URL + `/data/daily-sales-sku-list`,
      {
        isDaysCompare: shiftKey ? 1 : 0,
        marketplace: marketplace,
        pageNumber: 1,
        pageSize: 1,
        salesDate,
        salesDate2: shiftKey ? salesDate : "",
        sellerId: sellerId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  }
}

export default ChartService;