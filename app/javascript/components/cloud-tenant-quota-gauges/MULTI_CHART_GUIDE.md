# 📊 Guida Multi-Chart per Cloud Tenant Quota Gauges

## Panoramica

Il plugin Cloud Tenant Quota Gauges ora supporta **5 diversi tipi di grafici** da Carbon Charts:

1. **Meter Chart** (Barra orizzontale) - Default, migliore per visualizzare singole metriche
2. **Gauge Chart** (Semicerchio) - Classico gauge semicircolare
3. **Donut Chart** (Anello) - Grafico ad anello con percentuale al centro
4. **Pie Chart** (Torta) - Grafico a torta per proporzioni
5. **Bar Chart** (Barre) - Grafico a barre per confrontare valori

## Componenti Disponibili

### 1. Componente Base: `CloudTenantQuotaGauges`

Il componente originale che usa solo Meter Charts.

**File:** `index.jsx`

**Utilizzo nella view:**
```haml
= react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

### 2. Componente Multi-Chart: `CloudTenantQuotaGaugesMulti`

Versione avanzata con supporto per chart types multipli.

**File:** `index-multi.jsx`

**Utilizzo base:**
```haml
= react 'CloudTenantQuotaGaugesMulti', {:tenantId => @record.id.to_s}
```

**Utilizzo con opzioni:**
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge',
  :allowChartSelection => true
}
```

### 3. Componente Singolo Multi-Chart: `QuotaGaugeMulti`

Singolo gauge con supporto per chart types multipli.

**File:** `quota-gauge-multi.jsx`

**Utilizzo:**
```jsx
import QuotaGaugeMulti from './quota-gauge-multi';

<QuotaGaugeMulti
  quota={quotaData}
  chartType="donut"
  showSelector={true}
/>
```

## Parametri dei Componenti

### CloudTenantQuotaGaugesMulti

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `tenantId` | String/Number | *richiesto* | ID del cloud tenant |
| `defaultChartType` | String | `'meter'` | Tipo di grafico default ('meter', 'gauge', 'donut', 'pie', 'bar') |
| `allowChartSelection` | Boolean | `false` | Permette di selezionare il tipo di grafico per ogni quota individualmente |

### QuotaGaugeMulti

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `quota` | Object | *richiesto* | Dati della quota |
| `chartType` | String | `'meter'` | Tipo di grafico ('meter', 'gauge', 'donut', 'pie', 'bar') |
| `showSelector` | Boolean | `false` | Mostra dropdown per cambiare tipo di grafico |

## Modalità di Visualizzazione

### Grid View (Vista Griglia)

Mostra tutte le quote in una griglia responsive. Puoi scegliere:
- Un tipo di grafico globale per tutte le quote
- Oppure permettere la selezione individuale per ogni quota

**Screenshot concettuale:**
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  RAM    │ │ Cores   │ │Instances│ │ Volumes │ │Gigabytes│
│ [Meter] │ │ [Meter] │ │ [Meter] │ │ [Meter] │ │ [Meter] │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Compare Chart Types (Confronta Tipi Grafici)

Mostra tabs per visualizzare tutte le quote con diversi tipi di grafici contemporaneamente.

**Tab layout:**
```
[ Meter ] [ Gauge ] [ Donut ] [ Pie ] [ Bar ] [ Original ]

┌─────────────────────────────────────────────────────────┐
│  Tutte le 5 quote visualizzate con il chart type        │
│  selezionato                                             │
└─────────────────────────────────────────────────────────┘
```

## Tipi di Grafici Dettagliati

### 1. Meter Chart
**Quando usarlo:** Default, ottimo per dashboard con molte metriche
**Visualizzazione:** Barra orizzontale con indicatore di percentuale
**Carbon Component:** `MeterChart`

```jsx
<QuotaGaugeMulti quota={data} chartType="meter" />
```

**Caratteristiche:**
- Compatto e pulito
- Facile lettura rapida
- Indicatori di stato colorati (verde/giallo/rosso)

### 2. Gauge Chart
**Quando usarlo:** Per dashboard executive o singole metriche critiche
**Visualizzazione:** Gauge semicircolare classico
**Carbon Component:** `GaugeChart`

```jsx
<QuotaGaugeMulti quota={data} chartType="gauge" />
```

**Caratteristiche:**
- Visivamente d'impatto
- Stile "cruscotto auto"
- Ottimo per presentazioni

### 3. Donut Chart
**Quando usarlo:** Per mostrare chiaramente la proporzione usato/disponibile
**Visualizzazione:** Anello con percentuale al centro
**Carbon Component:** `DonutChart`

```jsx
<QuotaGaugeMulti quota={data} chartType="donut" />
```

**Caratteristiche:**
- Mostra Used/Available separatamente
- Percentuale prominente al centro
- Design moderno

### 4. Pie Chart
**Quando usarlo:** Alternativa più semplice al Donut
**Visualizzazione:** Grafico a torta classico
**Carbon Component:** `PieChart`

```jsx
<QuotaGaugeMulti quota={data} chartType="pie" />
```

**Caratteristiche:**
- Semplice e familiare
- Buono per utenti non tecnici
- Proporzionamento chiaro

### 5. Bar Chart
**Quando usarlo:** Per confrontare Used vs Total
**Visualizzazione:** Barre verticali affiancate
**Carbon Component:** `SimpleBarChart`

```jsx
<QuotaGaugeMulti quota={data} chartType="bar" />
```

**Caratteristiche:**
- Confronto side-by-side
- Ottimo per analisi comparative
- Scala graduata sull'asse Y

## Esempi di Implementazione

### Esempio 1: Usare Gauge Charts di Default

**In `app/views/cloud_tenant/_show_dashboard.html.haml`:**

```haml
.row.row-tile-pf
  .col-xs-12
    = react 'CloudTenantQuotaGaugesMulti', {
      :tenantId => @record.id.to_s,
      :defaultChartType => 'gauge'
    }
```

### Esempio 2: Permettere Selezione Individuale

```haml
.row.row-tile-pf
  .col-xs-12
    = react 'CloudTenantQuotaGaugesMulti', {
      :tenantId => @record.id.to_s,
      :defaultChartType => 'meter',
      :allowChartSelection => true
    }
```

Ogni quota avrà un dropdown per scegliere il proprio tipo di grafico.

### Esempio 3: Usare Donut Charts per Quota Specifiche

**In un custom component:**

```jsx
import React from 'react';
import QuotaGaugeMulti from './quota-gauge-multi';

const CustomQuotaView = ({ quotas }) => {
  return (
    <div className="custom-quota-view">
      {/* RAM con Donut */}
      <QuotaGaugeMulti
        quota={quotas.find(q => q.name === 'ram')}
        chartType="donut"
      />

      {/* Cores con Gauge */}
      <QuotaGaugeMulti
        quota={quotas.find(q => q.name === 'cores')}
        chartType="gauge"
      />

      {/* Resto con Meter */}
      {quotas.filter(q => !['ram', 'cores'].includes(q.name)).map(quota => (
        <QuotaGaugeMulti key={quota.name} quota={quota} chartType="meter" />
      ))}
    </div>
  );
};
```

## Registrazione dei Componenti

Per usare i nuovi componenti, devono essere registrati in:

**File:** `app/javascript/packs/component-definitions-common.js`

```javascript
// Import dei componenti multi-chart
import CloudTenantQuotaGaugesMulti from '../components/cloud-tenant-quota-gauges/index-multi';
import QuotaGaugeMulti from '../components/cloud-tenant-quota-gauges/quota-gauge-multi';

// Registrazione con ManageIQ
ManageIQ.component.addReact('CloudTenantQuotaGaugesMulti', CloudTenantQuotaGaugesMulti);
ManageIQ.component.addReact('QuotaGaugeMulti', QuotaGaugeMulti);
```

## Personalizzazione Stili

Gli stili sono in `quota-gauges.scss`. Puoi personalizzare:

### Colori di Stato

```scss
.quota-gauge-card {
  &.quota-status-ok {
    border-left: 4px solid #3f9c35; // Verde - cambia qui
  }

  &.quota-status-warning {
    border-left: 4px solid #ec7a08; // Arancione - cambia qui
  }

  &.quota-status-critical {
    border-left: 4px solid #cc0000; // Rosso - cambia qui
  }
}
```

### Layout Griglia

```scss
.quota-gauges-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px; // Spazio tra le card - cambia qui

  @media (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr); // 5 colonne su schermi grandi
  }
}
```

## Gestione Quote Illimitate

Le quote illimitate sono gestite automaticamente:

- **Meter/Gauge Charts:** Mostra messaggio "Unlimited quota"
- **Donut/Pie Charts:** Mostra solo quota usata
- **Bar Charts:** Scala automatica basata su quota usata

## Compatibilità

- ✅ **ManageIQ Classic UI** (Radjabov version)
- ✅ **Carbon Charts** @carbon/charts-react
- ✅ **React** 16+
- ✅ **Carbon Components React** 7+
- ✅ **Responsive** - Funziona su mobile, tablet, desktop

## Troubleshooting

### Charts non si visualizzano

**Problema:** I grafici non appaiono
**Soluzione:** Verifica che i componenti siano importati nel file di Carbon Charts:

```javascript
import {
  MeterChart,
  GaugeChart,
  DonutChart,
  PieChart,
  SimpleBarChart,
} from '@carbon/charts-react';
```

### Errore: "Cannot find module '@carbon/charts-react'"

**Problema:** Package non installato
**Soluzione:** Il package dovrebbe già essere nelle dipendenze di ManageIQ. Verifica `package.json`.

### I colori dei grafici non corrispondono allo stato

**Problema:** Il grafico è rosso ma la quota è al 50%
**Soluzione:** Verifica la logica di calcolo della percentuale nel componente:

```javascript
const percentage = unlimited ? 0 : (quota_used / quota_total) * 100;
```

## Migrazione dal Componente Base

Se stai usando `CloudTenantQuotaGauges` e vuoi passare a `CloudTenantQuotaGaugesMulti`:

**Prima:**
```haml
= react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

**Dopo:**
```haml
= react 'CloudTenantQuotaGaugesMulti', {:tenantId => @record.id.to_s}
```

**Opzionale - con chart type personalizzato:**
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge',
  :allowChartSelection => true
}
```

## Prossimi Sviluppi

Possibili miglioramenti futuri:

- [ ] **BulletChart** - Per visualizzare target vs performance
- [ ] **StackedBarChart** - Per confrontare multiple quote insieme
- [ ] **LineChart** - Per trend storici delle quote
- [ ] **Export** - Esportare i dati in CSV/PDF
- [ ] **Alerting** - Notifiche quando le quote raggiungono soglie
- [ ] **Drill-down** - Click su quota per dettagli

## Riferimenti

- [Carbon Charts Documentation](https://charts.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [@carbon/charts-react NPM](https://www.npmjs.com/package/@carbon/charts-react)
- [ManageIQ UI Classic](https://github.com/ManageIQ/manageiq-ui-classic)

---

**Versione:** 2.0
**Data:** Novembre 2024
**Autore:** Claude Code Assistant
