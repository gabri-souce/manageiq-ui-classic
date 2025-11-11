import React from 'react';
import PropTypes from 'prop-types';
import { DonutChart } from '@carbon/charts-react';

const DonutChartGraph = ({ data, title }) => {
  const options = {
    title,
    donut: {
      center: {
        label: __('Total'),
        numberFormatter: (value) => value.toLocaleString(),
      },
      alignment: 'center',
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
    height: '400px',
    resizable: true,
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
    <DonutChart data={data} options={options} />
  );
};

DonutChartGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};

DonutChartGraph.defaultProps = {
  data: null,
  title: '',
};

export default DonutChartGraph;
