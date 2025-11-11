import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MeterChart,
  GaugeChart,
  DonutChart,
  PieChart,
  SimpleBarChart,
} from '@carbon/charts-react';

/**
 * QuotaGaugeMulti - Componente avanzato per visualizzare quote con multipli chart types
 * Supporta MeterChart, GaugeChart, DonutChart, PieChart, BarChart
 */
const QuotaGaugeMulti = ({ quota, chartType = 'meter', showSelector = false }) => {
  const [selectedChartType, setSelectedChartType] = useState(chartType);

  if (!quota || quota.not_available) {
    return (
      <div className="quota-gauge-card">
        <div className="quota-gauge-header">
          <h3>{quota?.resource || 'N/A'}</h3>
          <span className="quota-gauge-units">{quota?.units || ''}</span>
        </div>
        <div className="quota-gauge-unavailable">
          <p>{__('Quota data not available')}</p>
        </div>
      </div>
    );
  }

  const { resource, quota_used, quota_total, quota_available, units, unlimited } = quota;

  // Calculate percentage for the charts
  const percentage = unlimited ? 0 : (quota_used / quota_total) * 100;

  // Determine status color based on usage
  let statusClass = 'quota-status-ok';
  let carbonStatus = 'success';
  if (!unlimited) {
    if (percentage >= 90) {
      statusClass = 'quota-status-critical';
      carbonStatus = 'danger';
    } else if (percentage >= 75) {
      statusClass = 'quota-status-warning';
      carbonStatus = 'warning';
    }
  }

  // Chart data configurations for different chart types
  const getChartData = (type) => {
    switch (type) {
      case 'gauge':
      case 'meter':
        return [{
          group: sprintf(__('%s Used'), resource),
          value: unlimited ? 0 : percentage,
        }];

      case 'donut':
      case 'pie':
        return [
          {
            group: __('Used'),
            value: unlimited ? quota_used : quota_used,
          },
          {
            group: __('Available'),
            value: unlimited ? 100 : (quota_available > 0 ? quota_available : 0),
          },
        ];

      case 'bar':
        return [
          {
            group: resource,
            key: __('Used'),
            value: quota_used,
          },
          {
            group: resource,
            key: __('Total'),
            value: unlimited ? quota_used * 1.5 : quota_total,
          },
        ];

      default:
        return [{
          group: sprintf(__('%s Used'), resource),
          value: unlimited ? 0 : percentage,
        }];
    }
  };

  // Chart options for different types
  const getChartOptions = (type) => {
    const baseOptions = {
      toolbar: {
        enabled: false,
      },
      height: type === 'bar' ? '150px' : '120px',
      resizable: true,
      legend: {
        enabled: type === 'donut' || type === 'pie',
      },
    };

    switch (type) {
      case 'meter':
        return {
          ...baseOptions,
          meter: {
            status: {
              ranges: unlimited ? [] : [
                {
                  range: [0, 100],
                  status: carbonStatus,
                },
              ],
            },
          },
        };

      case 'gauge':
        return {
          ...baseOptions,
          gauge: {
            type: 'semi',
            status: carbonStatus,
          },
        };

      case 'donut':
        return {
          ...baseOptions,
          donut: {
            center: {
              label: sprintf(__('%s%%'), percentage.toFixed(1)),
            },
            alignment: 'center',
          },
        };

      case 'pie':
        return {
          ...baseOptions,
          pie: {
            alignment: 'center',
          },
        };

      case 'bar':
        return {
          ...baseOptions,
          axes: {
            left: {
              mapsTo: 'value',
              title: units,
            },
            bottom: {
              mapsTo: 'key',
              scaleType: 'labels',
            },
          },
        };

      default:
        return baseOptions;
    }
  };

  // Render appropriate chart based on selected type
  const renderChart = (type) => {
    if (unlimited && (type === 'gauge' || type === 'meter')) {
      return (
        <div className="quota-gauge-unlimited">
          <p>{__('Unlimited quota - no visualization needed')}</p>
        </div>
      );
    }

    const chartData = getChartData(type);
    const chartOptions = getChartOptions(type);

    switch (type) {
      case 'meter':
        return <MeterChart data={chartData} options={chartOptions} />;
      case 'gauge':
        return <GaugeChart data={chartData} options={chartOptions} />;
      case 'donut':
        return <DonutChart data={chartData} options={chartOptions} />;
      case 'pie':
        return <PieChart data={chartData} options={chartOptions} />;
      case 'bar':
        return <SimpleBarChart data={chartData} options={chartOptions} />;
      default:
        return <MeterChart data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className={`quota-gauge-card quota-gauge-multi ${statusClass}`}>
      <div className="quota-gauge-header">
        <h3>{resource}</h3>
        <span className="quota-gauge-units">{units}</span>
      </div>

      {/* Chart type selector */}
      {showSelector && (
        <div className="quota-chart-selector">
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="quota-chart-type-select"
          >
            <option value="meter">{__('Meter')}</option>
            <option value="gauge">{__('Gauge')}</option>
            <option value="donut">{__('Donut')}</option>
            <option value="pie">{__('Pie')}</option>
            <option value="bar">{__('Bar')}</option>
          </select>
        </div>
      )}

      {/* Multi-layer display: Numbers on top */}
      <div className="quota-gauge-values">
        <div className="quota-value-primary">
          <span className="value-label">{__('Used')}</span>
          <span className="value-number">{quota_used.toFixed(2)}</span>
        </div>
        <div className="quota-value-separator">/</div>
        <div className="quota-value-secondary">
          <span className="value-label">{unlimited ? __('Unlimited') : __('Total')}</span>
          <span className="value-number">{unlimited ? '∞' : quota_total.toFixed(2)}</span>
        </div>
      </div>

      {/* Chart layer */}
      <div className="quota-gauge-chart">
        {renderChart(showSelector ? selectedChartType : chartType)}
      </div>

      {/* Percentage indicator */}
      {!unlimited && (
        <div className="quota-percentage-indicator">
          <span className={`percentage-value ${statusClass}`}>
            {percentage.toFixed(1)}% {__('used')}
          </span>
        </div>
      )}

      {/* Available quota display */}
      <div className="quota-gauge-footer">
        {unlimited ? (
          <span className="quota-available unlimited">{__('No limit set')}</span>
        ) : (
          <span className={`quota-available ${quota_available < 0 ? 'over-quota' : ''}`}>
            {quota_available < 0
              ? sprintf(__('%s over quota'), Math.abs(quota_available).toFixed(2))
              : sprintf(__('%s available'), quota_available.toFixed(2))
            }
          </span>
        )}
      </div>
    </div>
  );
};

QuotaGaugeMulti.propTypes = {
  quota: PropTypes.shape({
    resource: PropTypes.string,
    name: PropTypes.string,
    quota_used: PropTypes.number,
    quota_total: PropTypes.number,
    quota_available: PropTypes.number,
    units: PropTypes.string,
    unlimited: PropTypes.bool,
    not_available: PropTypes.bool,
  }).isRequired,
  chartType: PropTypes.oneOf(['meter', 'gauge', 'donut', 'pie', 'bar']),
  showSelector: PropTypes.bool,
};

QuotaGaugeMulti.defaultProps = {
  chartType: 'meter',
  showSelector: false,
};

export default QuotaGaugeMulti;
