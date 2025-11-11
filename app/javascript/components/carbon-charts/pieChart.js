import React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@carbon/charts-react';

const PieChartGraph = ({ data, title }) => {
  const options = {
    title,
    pie: {
      alignment: 'center',
      labels: {
        enabled: false,
      },
    },
    legend: {
      enabled: true,
      position: 'bottom',
      clickable: true,
      truncation: {
        type: 'mid_line',
        threshold: 15,
        numCharacter: 12,
      },
    },
    resizable: true,
    height: '400px',
    tooltip: {
      enabled: true,
      valueFormatter: (value) => value.toLocaleString(),
      truncation: {
        type: 'none',
      },
    },
    color: {
      scale: null,
    },
    animations: true,
  };

  return (
    <PieChart data={data} options={options} />
  );
};

PieChartGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

PieChartGraph.defaultProps = {
  data: null,
  title: '',
};

export default PieChartGraph;
