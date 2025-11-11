// ===== Utility Functions =====

/**
 * Format numbers with locale-specific thousand separators and decimals
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value == null || isNaN(value)) return '0';
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format bytes to human-readable format (KB, MB, GB, etc.)
 * @param {number} bytes - The bytes value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted bytes string
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format percentage values
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Get common chart options for consistency across charts
 * @param {object} customOptions - Custom options to merge with defaults
 * @returns {object} Chart options object
 */
export const getCommonChartOptions = (customOptions = {}) => ({
  animations: true,
  toolbar: {
    enabled: false,
  },
  color: {
    scale: null, // Uses Carbon default color palette
  },
  tooltip: {
    enabled: true,
    valueFormatter: (value) => formatNumber(value),
    truncation: {
      type: 'none',
    },
  },
  ...customOptions,
});

// ===== Sample Data =====

export const sampleData = [{
  group: 'Dataset 1',
  key: '1',
  value: 100,
},
{
  group: 'Dataset 1',
  key: '2',
  value: 400,
},
{
  group: 'Dataset 1',
  key: '4',
  value: 500,
},
{
  group: 'Dataset 1',
  key: '3',
  value: 200,
},
{
  group: 'Dataset 1',
  key: '5',
  value: 150,
},
{
  group: 'Dataset 2',
  key: '1',
  value: 280,
},
{
  group: 'Dataset 2',
  key: '2',
  value: 350,
},
{
  group: 'Dataset 2',
  key: '3',
  value: 700,
},
{
  group: 'Dataset 2',
  key: '5',
  value: 600,
},
{
  group: 'Dataset 2',
  key: '5',
  value: 200,
},
{
  group: 'Dataset 3',
  key: '4',
  value: 100,
},
{
  group: 'Dataset 3',
  key: '2',
  value: 500,
},
{
  group: 'Dataset 3',
  key: '1',
  value: 200,
}];

export const pieData = [{
  group: 'Dataset 1',
  key: '1',
  value: 100,
},
{
  group: 'Dataset 2',
  key: '1',
  value: 280,
},
{
  group: 'Dataset 3',
  key: '4',
  value: 100,
},
{
  group: 'Dataset 4',
  key: '2',
  value: 500,
}];

// convert report data to carbon chart data format.
export const getConvertedData = (data) => {
  if (data && data.data.columns && data.data && data.miq && data.miq.category_table) {
    const columnsData = data.data.columns;
    const dataGroups = data.miq.category_table;
    const rowsData = data.miq.name_table;
    const arr = [];
    if (columnsData.length > 0) {
      columnsData.forEach((items) => {
        items.forEach((item, i) => {
          const obj = {};
          if (i !== 0 && rowsData[items[0]]) {
            obj.group = rowsData[items[0]];
            if (dataGroups && typeof dataGroups[i - 1] === 'number') {
              obj.key = dataGroups[i - 1].toString();
            } else if (dataGroups) {
              obj.key = dataGroups[i - 1];
            }
            obj.value = item;
            arr.push(obj);
          }
        });
      });
    }
    return arr;
  }
  return [];
};

export const getLineConvertedData = (data) => {
  const columnsData = data.data.columns;
  const dataGroups = data.miq.category_table;
  const rowsData = data.miq.name_table;
  const arr = [];
  columnsData.forEach((items) => {
    items.forEach((item, i) => {
      const obj = {};
      if (i !== 0 && rowsData[items[0]]) {
        obj.group = rowsData[items[0]];
        obj.key = new Date(dataGroups[i - 1]);
        obj.value = item;
        arr.push(obj);
      }
    });
  });
  return arr;
};
