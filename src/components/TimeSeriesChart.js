import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TimeSeriesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading...</div>; // Return loading message or a fallback if data is not ready
  }

  const series = [
    {
      name: 'Visitors',
      data: data.map(item => [new Date(item.date).getTime(), item.visitors]),
    },
  ];

  const options = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
    },
    xaxis: {
      type: 'datetime',
    },
    title: { text: 'Visitors Per Day' },
  };

  return <ReactApexChart options={options} series={series} type="line" height={350} />;
};

export default TimeSeriesChart;
