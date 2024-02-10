<template>
    <div>
        <h2>Home Page</h2>
        <div v-if="store.state.loading" class="overlay">
            <div class="loading-spinner"></div>
        </div>
        <div ref="chartContainer"></div>
        <button @click="loadChartWithDay(60)">Load Chart (Last 60 Days)</button>
        <button @click="loadChartWithDay(30)">Load Chart (Last 30 Days)</button>
        <button @click="loadChartWithDay(14)">Load Chart (Last 14 Days)</button>
        <button @click="loadChartWithDay(7)">Load Chart (Last 7 Days)</button>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart } from 'highcharts-vue';
import ChartService from '@/services/ChartService';
import store from '@/store/store';

const chartContainer = ref(null);

onMounted(() => {
    // İlk yüklenme anında varsayılan olarak 30 günlük grafik yükleniyor
    loadChartWithDay(30);
});

const loadChartWithDay = async (day: any) => {
    try {
        store.commit('setLoading', true);
        const accessToken: any = store.state.accessToken; // Burada giriş yaptıktan sonra alınan accessToken'ı kullanmalısınız
        const stores = store.getters['user/getStores'];
        console.log('test', store.getters['user/getStores']);
        const sellerId: any = stores[0].sellerId;
        const marketplace: any = stores[0].marketplace;
        // console.log(sellerId, marketplace);

        const chartData = await ChartService.getDailySalesOverview(accessToken, sellerId, marketplace, day);

        // Highcharts kullanarak chartData ile grafik oluşturun
        createChart(chartData);
    } catch (error) {
        console.error('Error loading chart:', error);
    } finally {
        store.commit('setLoading', false);
    }
};

const createChart = (data: any) => {
    Chart.chart(chartContainer.value, {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Daily Sales Overview',
        },
        xAxis: {
            categories: data.categories, // Kategorilerinizi buraya ekleyin
        },
        yAxis: {
            title: {
                text: 'Sales Amount',
            },
        },
        series: data.series, // Serilerinizi buraya ekleyin
    });
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
  