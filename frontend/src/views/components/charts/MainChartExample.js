import React from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';

const MainChart = attributes => {
  const defaultDatasets = (() => {
    const data = attributes.data ? Object.values(attributes.data) : [];
    return [
      {
        label: attributes.name,
        backgroundColor: hexToRgba(attributes.color, 10),
        borderColor: attributes.color,
        pointHoverBackgroundColor: attributes.color,
        borderWidth: 2,
        data: data.map(item => item.sum)
      }
    ];
  })();

  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      scales: {
        xAxes: [
          {
            beginAtZero: false,
            ticks: {
              autoSkip: false
            },
            gridLines: {
              drawOnChartArea: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
              callback: function(value, index, values) {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
              }
            },
            gridLines: {
              display: true
          }
          }
        ]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };
  })();

  // render
  return <CChartLine {...attributes} datasets={defaultDatasets} options={defaultOptions} labels={[]} />;
};

export default MainChart;
