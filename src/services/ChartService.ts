import axios from 'axios';
import { API_BASE_URL } from "@/config/config";

class ChartService {
  static async getDailySalesOverview(accessToken: string, sellerId: string, marketplace: string, day: number): Promise<any> {
    try {
      const response = await axios.get(API_BASE_URL + `data/daily-sales-overview`, {
        params: {
          customDateData: null,
          day: day,
          excludeYoYData: true,
          marketplace: marketplace,
          requestStatus: 0,
          sellerId: sellerId,
          
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
}

export default ChartService;