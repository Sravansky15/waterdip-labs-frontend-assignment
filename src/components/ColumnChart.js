import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading...</div>; // Handle empty or undefined data
  }

  const series = [{
    name: 'Visitors',
    data: data.map(item => item.visitors),
  }];

  const options = {
    chart: { type: 'bar' },
    xaxis: { categories: data.map(item => item.country) },
    title: { text: 'Visitors By Country' },
  };

  return <ReactApexChart options={options} series={series} type="bar" height={350} />;
};

export default ColumnChart;
