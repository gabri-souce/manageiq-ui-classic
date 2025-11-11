import React from 'react';
import PropTypes from 'prop-types';
import { LineChart } from '@carbon/charts-react';

const LineChartGraph = ({ data, title }) => {
  const options = {
    title,
    axes: {
      bottom: {
        mapsTo: 'key',
        scaleType: 'labels',
        title: '',
      },
      left: {
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
        enabled: true,
      },
    },
    legend: {
      enabled: true,
      position: 'bottom',
      clickable: true,
    },
    points: {
      enabled: true,
      radius: 3,
    },
    curve: 'curveLinear',
    height: '400px',
    tooltip: {
      enabled: true,
      showTotal: false,
      truncation: {
        type: 'none',
      },
    },
    toolbar: {
      enabled: false,
    },
    color: {
      scale: null, // Uses Carbon default color palette
    },
    animations: true,
  };

  return (
    <LineChart data={data} options={options} />
  );
};

LineChartGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

LineChartGraph.defaultProps = {
  data: null,
  title: '',
};

export default LineChartGraph;
