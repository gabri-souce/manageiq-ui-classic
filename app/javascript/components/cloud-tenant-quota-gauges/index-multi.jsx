import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loading, Tabs, Tab, TabList, TabPanels, TabPanel } from 'carbon-components-react';
import QuotaGaugeMulti from './quota-gauge-multi';
import QuotaGauge from './quota-gauge';
import './quota-gauges.scss';

/**
 * CloudTenantQuotaGaugesMulti - Versione avanzata con supporto per chart types multipli
 * Permette di visualizzare le quote con diversi tipi di grafici Carbon Charts
 */
const CloudTenantQuotaGaugesMulti = ({ tenantId, defaultChartType = 'meter', allowChartSelection = true }) => {
  const [quotasData, setQuotasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalChartType, setGlobalChartType] = useState(defaultChartType);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tabs'

  useEffect(() => {
    if (!tenantId) {
      setError(__('Tenant ID is required'));
      setIsLoading(false);
      return;
    }

    const fetchQuotaData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/cloud_tenant_dashboard/quota_data/${tenantId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data && result.data.quotas) {
          setQuotasData(result.data.quotas);
        } else {
          setError(__('Invalid quota data format'));
        }
      } catch (err) {
        console.error('Error fetching quota data:', err);
        setError(sprintf(__('Failed to load quota data: %s'), err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotaData();
  }, [tenantId]);

  if (isLoading) {
    return (
      <div className="cloud-tenant-quota-gauges">
        <div className="quota-gauges-header">
          <h2 className="quota-gauges-title">{__('Cloud Tenant Quotas')}</h2>
        </div>
        <div className="quota-gauges-loading">
          <Loading className="quota-loading-spinner" withOverlay={false} />
          <p>{__('Loading quota data...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cloud-tenant-quota-gauges">
        <div className="quota-gauges-header">
          <h2 className="quota-gauges-title">{__('Cloud Tenant Quotas')}</h2>
        </div>
        <div className="quota-gauges-error">
          <div className="pficon pficon-error-circle-o" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quotasData || quotasData.length === 0) {
    return (
      <div className="cloud-tenant-quota-gauges">
        <div className="quota-gauges-header">
          <h2 className="quota-gauges-title">{__('Cloud Tenant Quotas')}</h2>
        </div>
        <div className="quota-gauges-empty">
          <p>{__('No quota data available for this tenant.')}</p>
        </div>
      </div>
    );
  }

  // Render grid view with all quotas
  const renderGridView = () => (
    <div className="quota-gauges-grid">
      {quotasData.map((quota) => (
        <QuotaGaugeMulti
          key={quota.name}
          quota={quota}
          chartType={globalChartType}
          showSelector={allowChartSelection}
        />
      ))}
    </div>
  );

  // Render tab view with different chart types
  const renderTabView = () => (
    <Tabs>
      <TabList aria-label="Chart type tabs">
        <Tab>{__('Meter')}</Tab>
        <Tab>{__('Gauge')}</Tab>
        <Tab>{__('Donut')}</Tab>
        <Tab>{__('Pie')}</Tab>
        <Tab>{__('Bar')}</Tab>
        <Tab>{__('Original')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGaugeMulti key={quota.name} quota={quota} chartType="meter" />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGaugeMulti key={quota.name} quota={quota} chartType="gauge" />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGaugeMulti key={quota.name} quota={quota} chartType="donut" />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGaugeMulti key={quota.name} quota={quota} chartType="pie" />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGaugeMulti key={quota.name} quota={quota} chartType="bar" />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="quota-gauges-grid">
            {quotasData.map((quota) => (
              <QuotaGauge key={quota.name} quota={quota} />
            ))}
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );

  return (
    <div className="cloud-tenant-quota-gauges cloud-tenant-quota-gauges-multi">
      <div className="quota-gauges-header">
        <h2 className="quota-gauges-title">{__('Cloud Tenant Quotas')}</h2>
        <p className="quota-gauges-subtitle">
          {__('Monitor resource usage against allocated quotas with multiple chart types')}
        </p>

        {/* View mode and chart type controls */}
        <div className="quota-gauges-controls">
          <div className="view-mode-selector">
            <label htmlFor="view-mode">{__('View Mode:')} </label>
            <select
              id="view-mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="view-mode-select"
            >
              <option value="grid">{__('Grid View')}</option>
              <option value="tabs">{__('Compare Chart Types')}</option>
            </select>
          </div>

          {viewMode === 'grid' && !allowChartSelection && (
            <div className="global-chart-selector">
              <label htmlFor="chart-type">{__('Chart Type:')} </label>
              <select
                id="chart-type"
                value={globalChartType}
                onChange={(e) => setGlobalChartType(e.target.value)}
                className="chart-type-select"
              >
                <option value="meter">{__('Meter Chart')}</option>
                <option value="gauge">{__('Gauge Chart')}</option>
                <option value="donut">{__('Donut Chart')}</option>
                <option value="pie">{__('Pie Chart')}</option>
                <option value="bar">{__('Bar Chart')}</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderTabView()}

      {/* Legend for status colors */}
      <div className="quota-gauges-legend">
        <h4>{__('Status Indicators:')}</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color quota-status-ok"></span>
            <span>{__('OK (< 75%)')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color quota-status-warning"></span>
            <span>{__('Warning (75-90%)')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color quota-status-critical"></span>
            <span>{__('Critical (> 90%)')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CloudTenantQuotaGaugesMulti.propTypes = {
  tenantId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  defaultChartType: PropTypes.oneOf(['meter', 'gauge', 'donut', 'pie', 'bar']),
  allowChartSelection: PropTypes.bool,
};

CloudTenantQuotaGaugesMulti.defaultProps = {
  defaultChartType: 'meter',
  allowChartSelection: false,
};

export default CloudTenantQuotaGaugesMulti;
