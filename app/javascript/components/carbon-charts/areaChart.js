import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart } from '@carbon/charts-react';

const AreaChartGraph = ({ data, title }) => {
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
    curve: 'curveNatural',
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
      scale: null,
    },
    animations: true,
  };

  return (
    <AreaChart data={data} options={options} />
  );
};

AreaChartGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

AreaChartGraph.defaultProps = {
  data: null,
  title: '',
};

export default AreaChartGraph;
