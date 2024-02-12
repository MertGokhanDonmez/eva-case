<template>
    <div class="container mx-auto px-4">
        <select id="daySelection" @change="onDaySelectionChange">
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
        console.log(isLoading.value);


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
        store.dispatch('loading/stopLoading');
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
                },
                events: {
                    // Add a click event listener to columns
                    click: function (event) {
                        handleColumnClick(event);
                    },
                },
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

const handleColumnClick = (event: any) => {
    // Extract necessary data from the clicked column
    const columnData = event.point.options.columnData; // Adjust this based on your data structure
    console.log(columnData);

    const salesDate = columnData.date;

    // Make an API request to fetch comparison data
    fetchComparisonData(salesDate);
};

const fetchComparisonData = async (salesDate: any) => {
    try {
        // Make an API request with necessary parameters
        const comparisonResult = await ChartService.getDailySalesSkuList({
            isDaysCompare: isComparisonTableVisible.value ? 1 : 0,
            marketplace: 'Amazon', // Update with your marketplace data
            pageNumber: 1, // Adjust as needed
            pageSize: 30, // Adjust as needed
            salesDate,
            salesDate2: isComparisonTableVisible.value ? '2022-11-10' : '', // Adjust as needed
            sellerId: 'A', // Update with your seller ID
        });

        // Update comparison data and show the table
        comparisonData.value = comparisonResult.data; // Adjust this based on your API response structure
        isComparisonTableVisible.value = true;
    } catch (error) {
        console.error('Error fetching comparison data:', error);
    }
};

const onDaySelectionChange = (event: any) => {
    const selectedDay = event.target.value;
    loadChartWithDay(selectedDay);
};
</script>
  
<style scoped>
#daySelection {
    margin-top: 10px;
}
</style>
  