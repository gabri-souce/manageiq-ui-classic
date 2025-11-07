# Cloud Tenant Quota Gauges Plugin

Plugin multi-layer per visualizzare le quote dei cloud tenant in ManageIQ con gauge grafici chiari e leggibili.

## 📋 Descrizione

Questo plugin fornisce 5 gauge visuali per monitorare le quote dei cloud tenant:
- **RAM** (convertita automaticamente da MB a GB)
- **Cores** (CPU cores)
- **Instances** (istanze VM)
- **Volumes** (volumi storage)
- **Gigabytes** (storage in GB)

### Caratteristiche
- ✨ Visualizzazione multi-layer (numeri + gauge + status)
- 🎨 Color-coding intelligente (verde/arancione/rosso)
- ♾️ Supporto quote illimitate
- ⚠️ Allarmi over-quota
- 📱 Layout responsive
- 🔄 Fetch dati automatico via API

## 📁 Contenuto della Directory

```
cloud-tenant-quota-gauges/
├── README.md           # Questa documentazione
├── index.jsx           # Componente principale che gestisce fetch dati e layout
├── quota-gauge.jsx     # Componente singolo gauge (riutilizzabile)
└── quota-gauges.scss   # Stili CSS/SCSS
```

## 🚀 Installazione

### 1. Copiare i File del Plugin

Copia l'intera directory in:
```
app/javascript/components/cloud-tenant-quota-gauges/
```

### 2. Registrare il Componente

Modifica: `app/javascript/packs/component-definitions-common.js`

**Aggiungi l'import** (dopo le altre import di cloud components, circa linea 35):
```javascript
import CloudTenantQuotaGauges from '../components/cloud-tenant-quota-gauges';
```

**Registra il componente** (dopo CloudTenantForm, circa linea 216):
```javascript
ManageIQ.component.addReact('CloudTenantQuotaGauges', CloudTenantQuotaGauges);
```

### 3. Aggiungere l'Endpoint API

Modifica: `app/controllers/cloud_tenant_dashboard_controller.rb`

**Aggiungi `quota_data` al before_action** (linea 6):
```ruby
before_action :get_tenant, :only => %i[data recent_instances_data recent_images_data aggregate_status_data quota_data]
```

**Aggiungi il metodo pubblico** (dopo `aggregate_status_data`, circa linea 28):
```ruby
def quota_data
  assert_privileges('ems_cloud_view')
  render :json => {:data => quota}
end
```

**Aggiungi il metodo privato** (dopo `aggregate_status`, circa linea 48):
```ruby
def quota
  CloudTenantDashboardService.new(@tenant, self, CloudTenant).quota_data
end
```

### 4. Implementare la Logica Backend

Modifica: `app/services/cloud_tenant_dashboard_service.rb`

**Aggiungi il metodo** (alla fine della classe, prima di `end`):
```ruby
def quota_data
  quota_metrics = [
    { :service => 'compute', :name => 'ram', :label => _('RAM'), :units => 'MB' },
    { :service => 'compute', :name => 'cores', :label => _('Cores'), :units => _('Cores') },
    { :service => 'compute', :name => 'instances', :label => _('Instances'), :units => _('Instances') },
    { :service => 'cinder', :name => 'volumes', :label => _('Volumes'), :units => _('Volumes') },
    { :service => 'cinder', :name => 'gigabytes', :label => _('Gigabytes'), :units => 'GB' }
  ]

  quotas = quota_metrics.map do |metric|
    quota = CloudResourceQuota.find_by(
      :cloud_tenant_id => @record_id,
      :service_name    => metric[:service],
      :name            => metric[:name]
    )

    if quota
      value = quota.value.to_i
      used = quota.used.to_i

      # Convert RAM from MB to GB for better readability
      if metric[:name] == 'ram'
        value = value / 1024.0 if value > 0
        used = used / 1024.0 if used >= 0
        units = 'GB'
      else
        units = metric[:units]
      end

      {
        :resource        => metric[:label],
        :name            => metric[:name],
        :quota_total     => value < 0 ? -1 : value.round(2),
        :quota_used      => used < 0 ? 0 : used.round(2),
        :quota_available => value < 0 ? -1 : (value - used).round(2),
        :units           => units,
        :unlimited       => value < 0
      }
    else
      # Return placeholder if quota not found
      {
        :resource        => metric[:label],
        :name            => metric[:name],
        :quota_total     => 0,
        :quota_used      => 0,
        :quota_available => 0,
        :units           => metric[:units],
        :unlimited       => false,
        :not_available   => true
      }
    end
  end

  { :quotas => quotas }
end
```

### 5. Integrare nella View del Dashboard

Modifica: `app/views/cloud_tenant/_show_dashboard.html.haml`

**Aggiungi il componente** (dopo AggregateStatusCard, circa linea 5):
```haml
.row.row-tile-pf
  .col-xs-12
    = react 'CloudTenantQuotaGauges', {:tenantId => @record.id.to_s}
```

## 📦 Dipendenze

Il plugin utilizza **solo librerie già presenti** in ManageIQ:
- ✅ `@carbon/charts-react` - per i MeterChart
- ✅ `carbon-components-react` - per Loading component
- ✅ `react` / `prop-types` - già presenti
- ✅ `CloudResourceQuota` model - già esistente nel core ManageIQ

**Nessuna installazione npm o gem aggiuntiva richiesta!**

## 🎨 Personalizzazione

### Modificare i Colori delle Soglie

Modifica `quota-gauge.jsx` (linee 22-28):
```javascript
let statusClass = 'quota-status-ok';
if (!unlimited) {
  if (percentage >= 90) {           // Soglia critica
    statusClass = 'quota-status-critical';
  } else if (percentage >= 75) {    // Soglia warning
    statusClass = 'quota-status-warning';
  }
}
```

### Aggiungere/Rimuovere Metriche

Modifica `cloud_tenant_dashboard_service.rb` nell'array `quota_metrics`:
```ruby
quota_metrics = [
  { :service => 'compute', :name => 'ram', :label => _('RAM'), :units => 'MB' },
  # Aggiungi nuove metriche qui seguendo lo stesso formato
]
```

### Modificare lo Stile

Modifica `quota-gauges.scss` per cambiare:
- Layout grid (`.quota-gauges-grid`)
- Colori status (`.quota-status-ok/warning/critical`)
- Dimensioni gauge (`.quota-gauge-chart`)

## 🧪 Test

### Verificare l'Installazione

1. Riavvia il server ManageIQ:
   ```bash
   bundle exec rails server
   ```

2. Naviga in:
   ```
   Cloud → Tenants → [Seleziona un Tenant] → Dashboard
   ```

3. Dovresti vedere una sezione "Cloud Tenant Quotas" con i 5 gauge

### Test con Dati Mock

Se non hai un cloud tenant configurato, puoi testare l'endpoint direttamente:
```bash
curl http://localhost:3000/cloud_tenant_dashboard/quota_data/TENANT_ID
```

## 🐛 Troubleshooting

### Il componente non appare
- Verifica che sia registrato in `component-definitions-common.js`
- Controlla la console browser per errori JavaScript
- Verifica che l'endpoint `/cloud_tenant_dashboard/quota_data/:id` risponda

### Errore "quota_data not found"
- Verifica che il metodo `quota_data` sia nel CloudTenantDashboardService
- Controlla i log Rails per errori backend

### Gauge non visualizzano dati
- Verifica che il cloud tenant abbia CloudResourceQuota configurate
- Controlla che service_name sia 'compute' o 'cinder'
- Verifica i nomi delle quote: 'ram', 'cores', 'instances', 'volumes', 'gigabytes'

### Stili non applicati
- Verifica che `import './quota-gauges.scss';` sia presente in `index.jsx`
- Riavvia webpack se stai usando webpack-dev-server

## 📄 Licenza

Questo plugin segue la stessa licenza di ManageIQ.

## 👥 Autori

Creato per ManageIQ UI Classic - Cloud Tenant Dashboard

## 🔄 Changelog

### v1.0.0 (2025-01-07)
- Implementazione iniziale
- Supporto per 5 metriche quota (RAM, Cores, Instances, Volumes, Gigabytes)
- Layout responsive con color-coding
- Supporto quote illimitate e over-quota
