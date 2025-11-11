import React from 'react';
import PropTypes from 'prop-types';
import { StackedBarChart } from '@carbon/charts-react';

const StackHorizontalChart = ({ data, title }) => {
  const options = {
    title,
    axes: {
      left: {
        scaleType: 'labels',
        mapsTo: 'key',
        title: '',
      },
      bottom: {
        stacked: true,
        mapsTo: 'value',
        scaleType: 'linear',
        title: '',
      },
    },
    grid: {
      x: {
        enabled: true,
      },
      y: {
        enabled: false,
      },
    },
    legend: {
      enabled: true,
      position: 'bottom',
      clickable: true,
    },
    bars: {
      maxWidth: 50,
    },
    height: '400px',
    tooltip: {
      enabled: true,
      showTotal: true,
      valueFormatter: (value) => value.toLocaleString(),
      truncation: {
        type: 'none',
      },
    },
    toolbar: {
      enabled: false,
    },
    color: {
      scale: null,
    },
    animations: true,
  };

  return (
    <StackedBarChart data={data} options={options} />
  );
};

StackHorizontalChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

StackHorizontalChart.defaultProps = {
  data: null,
  title: '',
};

export default StackHorizontalChart;
