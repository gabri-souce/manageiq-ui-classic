import React from 'react';
import PropTypes from 'prop-types';
import { MeterChart } from '@carbon/charts-react';

const QuotaGauge = ({ quota }) => {
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

  // Calculate percentage for the meter chart
  const percentage = unlimited ? 0 : (quota_used / quota_total) * 100;

  // Determine status color based on usage
  let statusClass = 'quota-status-ok';
  if (!unlimited) {
    if (percentage >= 90) {
      statusClass = 'quota-status-critical';
    } else if (percentage >= 75) {
      statusClass = 'quota-status-warning';
    }
  }

  const chartData = [{
    group: sprintf(__('%s Used'), resource),
    value: unlimited ? 0 : percentage,
  }];

  const options = {
    meter: {
      status: {
        ranges: unlimited ? [] : [
          {
            range: [0, 100],
            status: percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'success',
          },
        ],
      },
    },
    toolbar: {
      enabled: false,
    },
    height: '100px',
    resizable: true,
  };

  return (
    <div className={`quota-gauge-card ${statusClass}`}>
      <div className="quota-gauge-header">
        <h3>{resource}</h3>
        <span className="quota-gauge-units">{units}</span>
      </div>

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

      {/* Gauge chart layer */}
      {!unlimited && (
        <div className="quota-gauge-chart">
          <MeterChart data={chartData} options={options} />
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

QuotaGauge.propTypes = {
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
};

export default QuotaGauge;
