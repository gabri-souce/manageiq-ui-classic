# 🎯 Plugin Quota Gauges - Versione Multi-Grafico

## 📋 Riepilogo delle Modifiche

Ho controllato tutti i file esistenti e ho aggiunto il **supporto per 5 diversi tipi di grafici** Carbon Charts al plugin delle quote cloud tenant.

### Cosa C'era Prima:
- ✅ Plugin base con **solo Meter Charts** (barre orizzontali)
- ✅ 5 quote visualizzate: RAM, Cores, Instances, Volumes, Gigabytes
- ✅ Indicatori di stato colorati (verde/giallo/rosso)

### Cosa Ho Aggiunto Ora:
- ✅ **5 tipi di grafici** disponibili (Meter, Gauge, Donut, Pie, Bar)
- ✅ **Componente multi-chart** con selettore grafico
- ✅ **Vista a tab** per confrontare tipi grafici
- ✅ **Stili avanzati** per tutti i nuovi chart types
- ✅ **Documentazione completa** in inglese e italiano

---

## 📊 I 5 Tipi di Grafici Disponibili

### 1. **Meter Chart** (Barra Orizzontale)
```
RAM (GB)
Used: 24.00 / Total: 64.00
[████████░░░░░░░░] 37.5% used
40.00 available
```
**Quando usarlo:** Default, ottimo per dashboard con molte metriche

### 2. **Gauge Chart** (Semicerchio)
```
    RAM (GB)
  ╭───────────╮
  │     ◥    │
  │   37.5%  │
  ╰───────────╯
24.00 / 64.00 GB
```
**Quando usarlo:** Dashboard executive, presentazioni

### 3. **Donut Chart** (Anello)
```
    RAM (GB)
   ╭─────╮
  │   📊 │  37.5%
   ╰─────╯
Used: 24.00
Available: 40.00
```
**Quando usarlo:** Mostrare proporzione usato/disponibile

### 4. **Pie Chart** (Torta)
```
    RAM (GB)
   ╭─────╮
  │ ◢█░│
   ╰─────╯
Used: 37.5%
Available: 62.5%
```
**Quando usarlo:** Visualizzazione semplice per utenti non tecnici

### 5. **Bar Chart** (Barre)
```
RAM (GB)
GB
64│     ┃
48│     ┃
32│  ┃  ┃
16│  ┃  ┃
 0└──┸──┸
   Used Total
```
**Quando usarlo:** Confrontare Used vs Total

---

## 📁 File Creati/Modificati

### Nuovi File:

1. **`quota-gauge-multi.jsx`**
   - Componente singolo con supporto multi-chart
   - Permette di scegliere il tipo di grafico
   - Props: `quota`, `chartType`, `showSelector`

2. **`index-multi.jsx`**
   - Componente principale multi-chart
   - Vista griglia e vista tab
   - Selettore globale chart type

3. **`MULTI_CHART_GUIDE.md`**
   - Guida completa in inglese
   - Esempi di utilizzo
   - Troubleshooting

4. **`GRAFICI_MULTIPLI_ITALIANO.md`** (questo file)
   - Guida completa in italiano
   - Istruzioni passo-passo

### File Modificati:

1. **`quota-gauges.scss`**
   - Stili per i nuovi componenti multi-chart
   - Controlli per selettore grafici
   - Legenda indicatori di stato
   - Supporto dark theme

---

## 🚀 Come Usare i Nuovi Grafici

### Opzione 1: Usa il Componente Originale (Solo Meter)

**Nessuna modifica necessaria** - Il componente base continua a funzionare come prima:

```haml
# In app/views/cloud_tenant/_show_dashboard.html.haml
= react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

### Opzione 2: Usa Gauge Charts invece di Meter

**Modifica la view per usare il componente multi-chart:**

```haml
# In app/views/cloud_tenant/_show_dashboard.html.haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge'
}
```

### Opzione 3: Lascia Scegliere l'Utente

**Ogni utente può scegliere il proprio tipo di grafico preferito:**

```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'meter',
  :allowChartSelection => true
}
```

Ogni quota avrà un menu dropdown per scegliere: Meter, Gauge, Donut, Pie, o Bar.

### Opzione 4: Vista Comparativa (Tabs)

**L'utente vedrà tabs per confrontare tutti i tipi di grafici:**

Basta usare il componente multi-chart e l'utente può selezionare "Compare Chart Types" dal menu View Mode.

---

## ⚙️ Installazione e Configurazione

### Passo 1: Registra i Nuovi Componenti

**File:** `app/javascript/packs/component-definitions-common.js`

Aggiungi queste righe (se non ci sono già):

```javascript
// Import componenti multi-chart
import CloudTenantQuotaGaugesMulti from '../components/cloud-tenant-quota-gauges/index-multi';
import QuotaGaugeMulti from '../components/cloud-tenant-quota-gauges/quota-gauge-multi';

// Registrazione
ManageIQ.component.addReact('CloudTenantQuotaGaugesMulti', CloudTenantQuotaGaugesMulti);
ManageIQ.component.addReact('QuotaGaugeMulti', QuotaGaugeMulti);
```

### Passo 2: Modifica la View (Opzionale)

**File:** `app/views/cloud_tenant/_show_dashboard.html.haml`

**Prima (componente originale):**
```haml
.row.row-tile-pf
  .col-xs-12
    = react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

**Dopo (componente multi-chart):**
```haml
.row.row-tile-pf
  .col-xs-12
    = react 'CloudTenantQuotaGaugesMulti', {
      :tenantId => @record.id.to_s,
      :defaultChartType => 'gauge',
      :allowChartSelection => true
    }
```

### Passo 3: Compila Webpack

Segui la guida in `GUIDA_COMPLETA_ITALIANO.md` per compilare webpack:

```bash
# Dentro il container
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
./compile-quota-gauges.sh
```

### Passo 4: Riavvia ManageIQ

```bash
# Sul server
podman restart manageiq-debug-vol_patch
```

---

## 🎨 Parametri dei Componenti

### CloudTenantQuotaGaugesMulti

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `tenantId` | String/Number | *richiesto* | ID del cloud tenant |
| `defaultChartType` | String | `'meter'` | Tipo grafico default: 'meter', 'gauge', 'donut', 'pie', 'bar' |
| `allowChartSelection` | Boolean | `false` | Permette selezione individuale del chart type |

**Esempi:**

```haml
# Solo Gauge Charts
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge'
}

# Donut Charts con selezione individuale
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'donut',
  :allowChartSelection => true
}

# Bar Charts
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'bar'
}
```

### QuotaGaugeMulti

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `quota` | Object | *richiesto* | Dati della quota |
| `chartType` | String | `'meter'` | Tipo grafico: 'meter', 'gauge', 'donut', 'pie', 'bar' |
| `showSelector` | Boolean | `false` | Mostra dropdown per cambiare chart type |

---

## 📸 Visualizzazioni

### Vista Griglia (Grid View)

Mostra tutte le 5 quote in una griglia responsive:

```
┌─────────────────────────────────────────────────────────┐
│ Cloud Tenant Quotas                                     │
│ Monitor resource usage against allocated quotas with    │
│ multiple chart types                                    │
├─────────────────────────────────────────────────────────┤
│ View Mode: [Grid View ▼]  Chart Type: [Gauge ▼]       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │   RAM    │ │  Cores   │ │ Instances│ │ Volumes  │   │
│ │  (Gauge) │ │  (Gauge) │ │  (Gauge) │ │  (Gauge) │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│ ┌──────────┐                                            │
│ │Gigabytes │                                            │
│ │  (Gauge) │                                            │
│ └──────────┘                                            │
├─────────────────────────────────────────────────────────┤
│ Status Indicators:                                      │
│ ■ OK (< 75%)  ■ Warning (75-90%)  ■ Critical (> 90%)  │
└─────────────────────────────────────────────────────────┘
```

### Vista Tab (Compare Chart Types)

Tabs per confrontare i diversi tipi di grafici:

```
┌─────────────────────────────────────────────────────────┐
│ Cloud Tenant Quotas                                     │
├─────────────────────────────────────────────────────────┤
│ View Mode: [Compare Chart Types ▼]                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Meter] [Gauge] [Donut] [Pie] [Bar] [Original]        │
│ ───────                                                  │
│                                                          │
│  Tutte le 5 quote visualizzate con Meter Charts        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Casi d'Uso

### Caso 1: Dashboard Operations

**Scenario:** Operatori tecnici che monitorano molti tenant

**Soluzione:** Usa Meter Charts (default)
```haml
= react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

**Perché:** Compatti, facili da leggere rapidamente

### Caso 2: Dashboard Executive

**Scenario:** Presentazioni per management

**Soluzione:** Usa Gauge Charts
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge'
}
```

**Perché:** Visivamente d'impatto, look professionale

### Caso 3: Report per Clienti

**Scenario:** Report mensili per clienti finali

**Soluzione:** Usa Donut Charts
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'donut'
}
```

**Perché:** Facili da capire, mostrano chiaramente usato vs disponibile

### Caso 4: Analisi Comparativa

**Scenario:** Confrontare quote tra diversi tenant

**Soluzione:** Usa Bar Charts
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'bar'
}
```

**Perché:** Confronto side-by-side chiaro

### Caso 5: Self-Service Portal

**Scenario:** Utenti finali che gestiscono le proprie risorse

**Soluzione:** Permetti selezione individuale
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'meter',
  :allowChartSelection => true
}
```

**Perché:** Ogni utente sceglie il grafico che preferisce

---

## 🔧 Personalizzazione Avanzata

### Cambiare i Colori di Stato

**File:** `quota-gauges.scss`

```scss
.quota-gauge-card {
  &.quota-status-ok {
    border-left: 4px solid #00aa00; // Cambia verde
  }

  &.quota-status-warning {
    border-left: 4px solid #ff8800; // Cambia arancione
  }

  &.quota-status-critical {
    border-left: 4px solid #ff0000; // Cambia rosso
  }
}
```

### Cambiare le Soglie di Warning

**File:** `quota-gauge-multi.jsx` (riga ~28-33)

```javascript
let statusClass = 'quota-status-ok';
let carbonStatus = 'success';
if (!unlimited) {
  if (percentage >= 85) { // Era 90 - cambia qui
    statusClass = 'quota-status-critical';
    carbonStatus = 'danger';
  } else if (percentage >= 70) { // Era 75 - cambia qui
    statusClass = 'quota-status-warning';
    carbonStatus = 'warning';
  }
}
```

### Cambiare il Layout della Griglia

**File:** `quota-gauges.scss`

```scss
.quota-gauges-grid {
  // Per 3 colonne invece di 5
  @media (min-width: 1600px) {
    grid-template-columns: repeat(3, 1fr); // Era 5
  }

  // Per gap più grande
  gap: 30px; // Era 20px
}
```

---

## ✅ Checklist Verifica

Dopo aver installato e configurato:

- [ ] I file `quota-gauge-multi.jsx` e `index-multi.jsx` sono presenti
- [ ] I componenti sono registrati in `component-definitions-common.js`
- [ ] Webpack è compilato con successo
- [ ] Container ManageIQ è riavviato
- [ ] Accedendo a Cloud Tenant → Dashboard vedi le quote
- [ ] Puoi cambiare "View Mode" tra "Grid View" e "Compare Chart Types"
- [ ] Se `allowChartSelection: true`, vedi i dropdown sui singoli gauge
- [ ] I colori di stato (verde/giallo/rosso) funzionano correttamente
- [ ] La legenda degli indicatori di stato appare in fondo
- [ ] Tutti e 5 i tipi di grafici si visualizzano correttamente

---

## 🐛 Risoluzione Problemi

### Problema: "Component CloudTenantQuotaGaugesMulti not found"

**Causa:** Componente non registrato

**Soluzione:**
1. Verifica che in `component-definitions-common.js` ci sia:
```javascript
import CloudTenantQuotaGaugesMulti from '../components/cloud-tenant-quota-gauges/index-multi';
ManageIQ.component.addReact('CloudTenantQuotaGaugesMulti', CloudTenantQuotaGaugesMulti);
```

2. Ricompila webpack:
```bash
./compile-quota-gauges.sh
```

3. Riavvia container:
```bash
podman restart manageiq-debug-vol_patch
```

### Problema: Grafici non si visualizzano

**Causa:** Carbon Charts non importati correttamente

**Soluzione:**
Verifica in `quota-gauge-multi.jsx` riga 3-7:
```javascript
import {
  MeterChart,
  GaugeChart,
  DonutChart,
  PieChart,
  SimpleBarChart,
} from '@carbon/charts-react';
```

### Problema: Dropdown "Chart Type" non appare

**Causa:** `allowChartSelection` non impostato

**Soluzione:**
Nella view, aggiungi il parametro:
```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :allowChartSelection => true  # <- Aggiungi questa riga
}
```

### Problema: Tabs "Compare Chart Types" non funzionano

**Causa:** Carbon Tabs component non disponibile

**Soluzione:**
Verifica in `index-multi.jsx` riga 3:
```javascript
import { Loading, Tabs, Tab, TabList, TabPanels, TabPanel } from 'carbon-components-react';
```

### Problema: Colori di stato non corrispondono

**Causa:** Logica percentuale errata

**Soluzione:**
Verifica i dati della quota:
```javascript
console.log('Quota used:', quota_used);
console.log('Quota total:', quota_total);
console.log('Percentage:', percentage);
```

Se `quota_total` è 0 o negativo (illimitato), la percentuale sarà 0.

---

## 📦 File nella Repository

Dopo l'installazione completa, dovresti avere questa struttura:

```
app/javascript/components/cloud-tenant-quota-gauges/
├── index.jsx                    # Componente base (solo Meter)
├── index-multi.jsx              # Componente multi-chart ← NUOVO
├── quota-gauge.jsx              # Gauge singolo base
├── quota-gauge-multi.jsx        # Gauge singolo multi-chart ← NUOVO
├── quota-gauges.scss            # Stili (aggiornati)
├── README.md                    # README originale
├── MULTI_CHART_GUIDE.md         # Guida multi-chart inglese ← NUOVO
└── GRAFICI_MULTIPLI_ITALIANO.md # Questa guida ← NUOVO
```

---

## 🚀 Prossimi Passi

### 1. Testa Tutti i Chart Types

Vai su ManageIQ → Compute → Clouds → Tenants → [Seleziona Tenant] → Dashboard

Prova a cambiare chart type e verifica che tutti funzionino:
- Meter
- Gauge
- Donut
- Pie
- Bar

### 2. Scegli il Tuo Preferito

Quale grafico ti piace di più? Impostalo come default:

```haml
= react 'CloudTenantQuotaGaugesMulti', {
  :tenantId => @record.id.to_s,
  :defaultChartType => 'gauge'  # <- Il tuo preferito qui
}
```

### 3. Personalizza i Colori

Se i colori di default non ti piacciono, cambiali in `quota-gauges.scss`

### 4. Condividi con i Colleghi

Mostra le nuove visualizzazioni ai tuoi colleghi e chiedi feedback!

---

## 📚 Documentazione Correlata

- `GUIDA_COMPLETA_ITALIANO.md` - Guida installazione completa da zero
- `MULTI_CHART_GUIDE.md` - Guida tecnica dettagliata (inglese)
- `COMPILE_IN_CONTAINER.md` - Guida compilazione webpack
- `FINAL_STEPS.md` - Passi finali deployment
- `QUICK_REFERENCE.txt` - Riferimento rapido comandi

---

## 🎉 Congratulazioni!

Ora hai un plugin di quota gauges **completamente personalizzabile** con:

✅ 5 tipi di grafici diversi
✅ Vista griglia responsive
✅ Vista comparativa con tabs
✅ Selezione individuale chart type
✅ Indicatori di stato colorati
✅ Supporto quote illimitate
✅ Dark theme support
✅ Documentazione completa

**Buon lavoro e buon monitoraggio delle quote! 📊🚀**

---

**Versione:** 2.0 Multi-Chart
**Data:** Novembre 2024
**Compatibilità:** ManageIQ Classic UI (Radjabov), Carbon Charts, React 16+
