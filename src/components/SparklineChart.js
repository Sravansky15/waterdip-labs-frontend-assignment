import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SparklineChart = ({ total, data, title }) => {
  if (!data || data.length === 0 || total === undefined) {
    return <div>Loading...</div>; // Handle empty or undefined data
  }

  const series = [{ name: title, data }];

  const options = {
    chart: { type: 'line', sparkline: { enabled: true } },
    title: { text: `${title}: ${total}`, style: { fontSize: '16px' } },
    stroke: { curve: 'smooth' },
  };

  return <ReactApexChart options={options} series={series} type="line" height={150} />;
};

export default SparklineChart;
