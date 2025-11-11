import React from 'react';
import PropTypes from 'prop-types';
import { GroupedBarChart } from '@carbon/charts-react';

const GroupBarChart = ({ data, title, showLegend }) => {
  const options = {
    title,
    legend: {
      enabled: showLegend,
      position: 'bottom',
      clickable: true,
    },
    axes: {
      left: {
        mapsTo: 'value',
        scaleType: 'linear',
        title: '',
      },
      bottom: {
        scaleType: 'labels',
        mapsTo: 'key',
        title: '',
      },
    },
    grid: {
      x: {
        enabled: false,
      },
      y: {
        enabled: true,
      },
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

GroupBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
  showLegend: PropTypes.bool,
};

GroupBarChart.defaultProps = {
  data: null,
  title: '',
  showLegend: true,
};

export default GroupBarChart;
