import React from 'react';
import PropTypes from 'prop-types';
import { StackedAreaChart } from '@carbon/charts-react';

const StackAreaChart = ({ data, title }) => {
  const options = {
    title,
    axes: {
      left: {
        stacked: true,
        scaleType: 'linear',
        mapsTo: 'value',
        title: '',
      },
      bottom: {
        scaleType: 'linear',
        mapsTo: 'key',
        title: '',
      },
    },
    grid: {
      x: {
        enabled: true,
      },
      y: {
        enabled: true,
      },
    },
    legend: {
      enabled: true,
      position: 'bottom',
      clickable: true,
    },
    curve: 'curveMonotoneX',
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
    <StackedAreaChart data={data} options={options} />
  );
};

StackAreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

StackAreaChart.defaultProps = {
  data: null,
  title: '',
};

export default StackAreaChart;
