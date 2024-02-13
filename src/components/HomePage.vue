<template>
    <div class="container mx-auto px-4">
        <select id="daySelection" @change="onDaySelectionChange($event.target)">
            <option value="60">Last 60 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="7">Last 7 Days</option>
        </select>
        <div v-show="!isLoading" ref="chartContainer"></div>
        <LoadingSpinner v-show="isLoading" :spinnerHeight="50" :spinnerWidth="50" />
    </div>

    <table v-if="isComparisonTableVisible">
        <!-- Table headers -->
        <thead>
            <tr>
                <th>Column 1 Data</th>
                <th>Column 2 Data</th>
                <!-- Add more headers as needed -->
            </tr>
        </thead>
        <!-- Table body -->
        <tbody>
            <!-- Loop through the comparison data and display rows -->
            <tr v-for="(row, index) in comparisonData" :key="index">
                <td>{{ row.column1Data }}</td>
                <td>{{ row.column2Data }}</td>
                <!-- Add more columns as needed -->
            </tr>
        </tbody>
    </table>
</template>
  
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ChartService from '@/services/ChartService';
import store from '@/store/store';
import Highcharts from 'highcharts';
import { IStoreModel } from '@/models/StoreModel';
import LoadingSpinner from "./LoadingSpinner.vue";

const chartContainer = ref(null);
const isLoading = computed(() => store.getters['loading/isLoading']);
const isComparisonTableVisible = ref(false);
const comparisonData = ref([]);

onMounted(() => {
    // İlk yüklenme anında varsayılan olarak 30 günlük grafik yükleniyor
    loadChartWithDay(30);
});

const loadChartWithDay = async (day: any) => {
    try {
        store.dispatch('loading/startLoading');

        const accessToken: any = store.state.accessToken;

        const storeData: any = store.getters['user/getStores'];
        const stores: IStoreModel[] = JSON.parse(JSON.stringify(storeData));

        if (stores && stores.length > 0) {
            const sellerId: any = stores[0].storeId;
            const marketplace: any = stores[0].marketplaceName;
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
            window.alert('Kullanıcının mağaza verisi yok');
        }
    } catch (error) {
        console.error('Grafik yüklenirken hata oluştu:', error);
    } finally {
        store.dispatch('loading/stopLoading');
    }
};

const createChart = (categories: any, fbaAmountData: any, fbmAmountData: any, profit: any) => {
    Highcharts.chart(chartContainer.value, {
        chart: {
            type: 'column',
            stacking: 'normal',
        },
        title: {
            text: 'Daily Sales',
            align: 'left'
        },
        xAxis: {
            type: 'datetime',
            categories: categories,
            crosshair: {
                enabled: true
            }
            // crosshair: {
            //     enabled: true,
            //     events: {
            //         click: function (event: any) {
            //             const category = this.options.xAxis[0].categories[this.columnIndex]
            //             window.alert(category);
            //             handleColumnClick(event);
            //         },
            //     },
            // },


        },
        yAxis: {
            title: {
                text: 'Amount ($)',
            },
        },
        plotOptions: {
            column: {
                grouping: false,
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                },
            },
            series: {
                allowPointSelect: true,
                compare: 'value',
                events: {
                    click: function (event: any) {
                        handleColumnClick(event);
                    },
                },
            },
        },
        accessibility: {
            point: {
                valueSuffix: '$'
            },
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
            shared: true,
        },


    });
};

// const highlightColumns = (selectedCategory: any) => {
//     // Seçili kategoriye sahip olan sütunları bulmak için
//     const selectedColumns = this.series[0].points.filter((point: any) => point.category === selectedCategory);

//     // Tüm sütunları normal renge çevir
//     this.series[0].points.forEach((point: any) => {
//         point.update({
//             color: '#189e54',
//         });
//     });

//     // Seçili sütunları vurgulamak için renklerini değiştir
//     selectedColumns.forEach((point: any) => {
//         point.update({
//             color: '#64961e',
//         });
//     });
// };

const handleColumnClick = (event: any) => {
    // Extract necessary data from the clicked column
    const salesDate = event.point.category;

    const user = store.getters['user/getUser'];
    const marketplace = user.marketplace;
    const sellerId = user.sellerId;

    // Make an API request to fetch comparison data
    fetchComparisonData(event.shiftKey, marketplace, salesDate, sellerId);
};

const fetchComparisonData = async (shiftKey: any, marketplace: any, salesDate: any, sellerId: any) => {
    try {
        const accessToken: any = store.state.accessToken;
        // Make an API request with necessary parameters
        const comparisonResult = await ChartService.getDailySalesSkuList(shiftKey, marketplace, accessToken, salesDate, sellerId);

        // Update comparison data and show the table
        comparisonData.value = comparisonResult.data; // Adjust this based on your API response structure
        isComparisonTableVisible.value = true;
    } catch (error) {
        console.error('Error fetching comparison data:', error);
    }
};

const onDaySelectionChange = (selectedDay: any) => {
    const _selectedDay = selectedDay.target.value;
    loadChartWithDay(_selectedDay);
};
</script>
  
<style scoped>
#daySelection {
    margin-top: 10px;
}
</style>
  