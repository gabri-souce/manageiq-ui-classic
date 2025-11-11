import React from 'react';
import PropTypes from 'prop-types';
import { GroupedBarChart } from '@carbon/charts-react';

const GroupHorizontalBarChart = ({ data, title }) => {
  const options = {
    title,
    axes: {
      left: {
        scaleType: 'labels',
        mapsTo: 'key',
        title: '',
      },
      bottom: {
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
    <GroupedBarChart data={data} options={options} />
  );
};

GroupHorizontalBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

GroupHorizontalBarChart.defaultProps = {
  data: null,
  title: '',
};

export default GroupHorizontalBarChart;
