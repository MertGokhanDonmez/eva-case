<template>
    <div>
        <div v-if="loading" class="overlay">
            <div class="loading-spinner"></div>
        </div>
        <div>
            <label for="daySelection">Select Day Range:</label>
            <select id="daySelection" @change="onDaySelectionChange">
                <option value="60">Last 60 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="7">Last 7 Days</option>
            </select>
        </div>
        <div ref="chartContainer"></div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChartService from '@/services/ChartService';
import store from '@/store/store';
import Highcharts from 'highcharts';
import { IStoreModel } from '@/models/StoreModel';

const chartContainer = ref(null);
const loading = ref(false);

onMounted(() => {
    // İlk yüklenme anında varsayılan olarak 30 günlük grafik yükleniyor
    loadChartWithDay(30);
});

const loadChartWithDay = async (day: any) => {
    try {
        loading.value = true;

        const accessToken: any = store.state.accessToken;

        const storeData: any = store.getters['user/getStores'];
        const stores: IStoreModel[] = JSON.parse(JSON.stringify(storeData));

        if (stores && stores.length > 0) {
            const sellerId: any = stores[0].storeId;
            const marketplace: any = stores[0].marketplaceName;
            console.log(`sellerId - ${sellerId}, marketplace - ${marketplace}`);
            const chartData = await ChartService.getDailySalesOverview(accessToken, sellerId, marketplace, day);
            // const dates: string[] = [];
            // chartData.response.data.Data.item.forEach(function (element: any) {
            //     dates.push(element.date);
            // });
            const categories = chartData.response.item.map(item => item.date);
            const fbaAmountData = chartData.response.item.map(item => item.fbaAmount);
            const fbmAmountData = chartData.response.item.map(item => item.fbmAmount);
            const profit = chartData.response.item.map(item => item.profit);

            createChart(categories, fbaAmountData, fbmAmountData, profit);
        } else {
            console.log('Kullanıcının mağaza verisi yok');
        }
    } catch (error) {
        console.error('Grafik yüklenirken hata oluştu:', error);
    } finally {
        loading.value = false;
    }
};

const createChart = (categories: any, fbaAmountData: any, fbmAmountData: any, profit: any) => {
    Highcharts.chart(chartContainer.value, {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Daily Sales',
            align: 'left'
        },
        xAxis: {
            type: 'datetime',
            categories: categories,
        },
        yAxis: {
            title: {
                text: 'Amount ($)',
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                }
            },
            series: {
                allowPointSelect: true,
            },
            point: {
                events: {
                    click: function () {
                        // Seçilen çubuğa odaklanma işlemlerini burada gerçekleştirin
                        console.log('Selected point:', categories, this.y);
                    },
                },
            },
        },
        accessibility: {
            point: {
                valueSuffix: '$'
            }
        },
        series: [

            {
                name: 'Profit',
                data: profit,

            },
            {
                name: 'FBA Sales',
                data: fbaAmountData,

            },
            {
                name: 'FBM Sales',
                data: fbmAmountData,

            },
        ],
        tooltip: {
            formatter: function () {
                return (
                    '<b>' +
                    Highcharts.dateFormat('%Y-%m-%d', this.x) +
                    '</b><br/>' +
                    'Total Sales: ' +
                    this.y
                );
            },
        },

    });
};

const onDaySelectionChange = (event: any) => {
    const selectedDay = event.target.value;
    loadChartWithDay(selectedDay);
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

#daySelection {
    margin-top: 10px;
}
</style>
  