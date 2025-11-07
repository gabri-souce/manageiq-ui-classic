import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loading } from 'carbon-components-react';
import QuotaGauge from './quota-gauge';
import './quota-gauges.scss';

const CloudTenantQuotaGauges = ({ tenantId }) => {
  const [quotasData, setQuotasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="cloud-tenant-quota-gauges">
      <div className="quota-gauges-header">
        <h2 className="quota-gauges-title">{__('Cloud Tenant Quotas')}</h2>
        <p className="quota-gauges-subtitle">
          {__('Monitor resource usage against allocated quotas')}
        </p>
      </div>

      <div className="quota-gauges-grid">
        {quotasData.map((quota) => (
          <QuotaGauge key={quota.name} quota={quota} />
        ))}
      </div>
    </div>
  );
};

CloudTenantQuotaGauges.propTypes = {
  tenantId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default CloudTenantQuotaGauges;
