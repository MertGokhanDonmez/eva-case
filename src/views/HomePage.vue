<!-- HomePage.vue -->
<template>
    <div>
        <h2>Home Page</h2>
        <div id="chartContainer"></div>
        <button @click="loadChartWithDay(60)">Load Chart (Last 60 Days)</button>
        <button @click="loadChartWithDay(30)">Load Chart (Last 30 Days)</button>
        <button @click="loadChartWithDay(14)">Load Chart (Last 14 Days)</button>
        <button @click="loadChartWithDay(7)">Load Chart (Last 7 Days)</button>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { Chart } from 'highcharts-vue'
import ChartService from '@/services/ChartService'; // Lütfen gerçek yolda bulunan ChartService dosyanızın yolunu belirtin

export default defineComponent({
    mounted() {
        // İlk yüklenme anında varsayılan olarak 60 günlük grafik yükleniyor
        this.loadChartWithDay(60);
    },
    methods: {
        async loadChartWithDay(day: any) {
            try {
                const accessToken = '...'; // Burada giriş yaptıktan sonra alınan accessToken'ı kullanmalısınız
                const sellerId = '...'; // Alışveriş yapan mağazanın ID'si
                const marketplace = '...'; // Alışveriş yapılan pazar yerinin adı

                const chartData = await ChartService.getDailySalesOverview(accessToken, sellerId, marketplace, day);

                // Highcharts kullanarak chartData ile grafik oluşturun
                this.createChart(chartData);
            } catch (error) {
                console.error('Error loading chart:', error);
            }
        },
        createChart(data: any) {
            Chart.chart('chartContainer', {
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
        },
    },
});
</script>
  
<style scoped>
/* Your component styles go here */
</style>
  