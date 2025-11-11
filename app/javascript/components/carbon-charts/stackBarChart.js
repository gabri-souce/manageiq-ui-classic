import React from 'react';
import PropTypes from 'prop-types';
import { StackedBarChart } from '@carbon/charts-react';

const StackBarChartGraph = ({ data, title, chart_options=null }) => {
  const options = {
    title,
    axes: {
      left: {
        mapsTo: 'value',
        stacked: true,
        scaleType: 'linear',
        title: '',
      },
      bottom: {
        mapsTo: 'key',
        scaleType: 'labels',
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
    <StackedBarChart data={data} options={chart_options ? chart_options : options} />
  );
};

StackBarChartGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

StackBarChartGraph.defaultProps = {
  data: null,
  title: '',
};

export default StackBarChartGraph;
