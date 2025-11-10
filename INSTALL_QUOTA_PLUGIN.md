# Guida Installazione Plugin Cloud Tenant Quota Gauges

## ⚠️ IMPORTANTE: NON Sostituire l'Intera Directory!

Il plugin deve essere applicato come **patch** alla versione esistente di ManageIQ, non sostituendo l'intera directory `manageiq-ui-classic`.

## 📋 Problema Riscontrato

Se hai già sostituito l'intera directory e il container non parte più:

```
stack level too deep (SystemStackError)
```

Questo errore è causato da conflitti nelle dipendenze (Gemfile, yarn.lock) tra versioni diverse.

## ✅ Soluzione: Applicare Solo le Modifiche Necessarie

### Opzione 1: Usare il File Patch (RACCOMANDATO)

**Step 1: Ripristina il Container Originale**

```bash
cd ~/manageiq_testEnv

# Ferma e rimuovi il container attuale (con problemi)
podman stop manageiq-debug-vol_patch
podman rm manageiq-debug-vol_patch

# Se hai backup della directory originale, ripristinala
# Altrimenti, scarica nuovamente il progetto originale
```

**Step 2: Identifica la Directory di ManageIQ UI Classic nel Container**

La directory da patchare è:
```
~/manageiq_testEnv/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
```

**Step 3: Copia SOLO il File Patch**

```bash
# Copia il file patch nella directory di destinazione
cp cloud-tenant-quota-gauges.patch ~/manageiq_testEnv/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/
```

**Step 4: Applica il Patch**

```bash
cd ~/manageiq_testEnv/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

# Applica il patch
git apply cloud-tenant-quota-gauges.patch

# Oppure, se git apply non funziona:
patch -p1 < cloud-tenant-quota-gauges.patch
```

**Step 5: Riavvia il Container**

```bash
cd ~/manageiq_testEnv
# Usa il comando che usavi prima per avviare il container
podman start manageiq-debug-vol_patch
# oppure ricrea il container con il comando originale
```

### Opzione 2: Copia Manuale dei File (Metodo Sicuro)

Se preferisci un controllo totale:

**Step 1: Prepara i File da Copiare**

I file modificati dal plugin sono:

```
NUOVI FILE:
✅ app/javascript/components/cloud-tenant-quota-gauges/index.jsx
✅ app/javascript/components/cloud-tenant-quota-gauges/quota-gauge.jsx
✅ app/javascript/components/cloud-tenant-quota-gauges/quota-gauges.scss
✅ app/javascript/components/cloud-tenant-quota-gauges/README.md

FILE DA MODIFICARE:
⚠️ app/controllers/cloud_tenant_dashboard_controller.rb
⚠️ app/services/cloud_tenant_dashboard_service.rb
⚠️ app/javascript/packs/component-definitions-common.js
⚠️ app/views/cloud_tenant/_show_dashboard.html.haml
```

**Step 2: Crea la Directory del Plugin**

```bash
TARGET_DIR=~/manageiq_testEnv/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

mkdir -p $TARGET_DIR/app/javascript/components/cloud-tenant-quota-gauges
```

**Step 3: Copia i Nuovi File del Plugin**

```bash
# Dalla directory della tua repo custom
SOURCE_DIR=/path/to/your/custom/manageiq-ui-classic

cp $SOURCE_DIR/app/javascript/components/cloud-tenant-quota-gauges/*.jsx \
   $TARGET_DIR/app/javascript/components/cloud-tenant-quota-gauges/

cp $SOURCE_DIR/app/javascript/components/cloud-tenant-quota-gauges/*.scss \
   $TARGET_DIR/app/javascript/components/cloud-tenant-quota-gauges/

cp $SOURCE_DIR/app/javascript/components/cloud-tenant-quota-gauges/README.md \
   $TARGET_DIR/app/javascript/components/cloud-tenant-quota-gauges/
```

**Step 4: Modifica i File Esistenti**

Apri ogni file nel `$TARGET_DIR` e applica le modifiche documentate nel `README.md` del plugin.

Oppure copia direttamente i file (ma ATTENZIONE: verifica che le versioni siano compatibili):

```bash
# ⚠️ BACKUP PRIMA!
cp $TARGET_DIR/app/controllers/cloud_tenant_dashboard_controller.rb \
   $TARGET_DIR/app/controllers/cloud_tenant_dashboard_controller.rb.backup

# Poi copia il nuovo file
cp $SOURCE_DIR/app/controllers/cloud_tenant_dashboard_controller.rb \
   $TARGET_DIR/app/controllers/cloud_tenant_dashboard_controller.rb

# Ripeti per gli altri 3 file
```

### Opzione 3: Modificare Direttamente nel Container in Esecuzione

Se il container è già in esecuzione e funzionante:

**Step 1: Entra nel Container**

```bash
podman exec -it manageiq-debug-vol_patch bash
```

**Step 2: Naviga alla Directory UI Classic**

```bash
cd /var/www/miq/vmdb
# o la directory corretta per la tua installazione
```

**Step 3: Crea la Directory del Plugin**

```bash
mkdir -p app/javascript/components/cloud-tenant-quota-gauges
```

**Step 4: Copia i File (dall'host al container)**

Da un altro terminale sull'host:

```bash
# Copia la directory del plugin
podman cp app/javascript/components/cloud-tenant-quota-gauges \
  manageiq-debug-vol_patch:/var/www/miq/vmdb/app/javascript/components/

# Copia i file modificati
podman cp app/controllers/cloud_tenant_dashboard_controller.rb \
  manageiq-debug-vol_patch:/var/www/miq/vmdb/app/controllers/

podman cp app/services/cloud_tenant_dashboard_service.rb \
  manageiq-debug-vol_patch:/var/www/miq/vmdb/app/services/

podman cp app/javascript/packs/component-definitions-common.js \
  manageiq-debug-vol_patch:/var/www/miq/vmdb/app/javascript/packs/

podman cp app/views/cloud_tenant/_show_dashboard.html.haml \
  manageiq-debug-vol_patch:/var/www/miq/vmdb/app/views/cloud_tenant/
```

**Step 5: Ricompila gli Asset (se necessario)**

Nel container:

```bash
cd /var/www/miq/vmdb
bundle exec rake assets:precompile
```

**Step 6: Riavvia i Worker**

Dall'interfaccia web ManageIQ:
```
Configuration → Servers → [il tuo server] → Restart Workers
```

## 🧪 Verifica Installazione

**1. Controlla che i file siano presenti:**

```bash
ls -la $TARGET_DIR/app/javascript/components/cloud-tenant-quota-gauges/
# Dovresti vedere: index.jsx, quota-gauge.jsx, quota-gauges.scss, README.md
```

**2. Controlla i log del container:**

```bash
podman logs manageiq-debug-vol_patch
# Non dovrebbero esserci errori "stack level too deep"
```

**3. Accedi a ManageIQ e vai a:**

```
Cloud → Tenants → [Seleziona un Tenant] → Tab "Dashboard"
```

Dovresti vedere la sezione "Cloud Tenant Quotas" con i gauge.

## 🔄 Rollback (se qualcosa va storto)

Se hai fatto backup:

```bash
cd ~/manageiq_testEnv/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

# Ripristina i file originali
cp app/controllers/cloud_tenant_dashboard_controller.rb.backup \
   app/controllers/cloud_tenant_dashboard_controller.rb

# Ripeti per gli altri file

# Rimuovi la directory del plugin
rm -rf app/javascript/components/cloud-tenant-quota-gauges
```

Poi riavvia il container.

## 📝 Note Importanti

1. **NON sostituire mai l'intera directory** `manageiq-ui-classic` - causa conflitti di dipendenze
2. **Applica solo i file modificati** come patch
3. **Fai sempre backup** prima di modificare file esistenti
4. **Verifica la compatibilità** - il plugin è stato sviluppato per la versione Radjabov

## 🐛 Troubleshooting

### Errore: stack level too deep

**Causa:** Hai sostituito l'intera directory invece di applicare il patch.

**Soluzione:** Ripristina la versione originale e applica solo il patch.

### Il componente non appare nel dashboard

**Causa:** Webpack non ha compilato i nuovi file JavaScript.

**Soluzione:**
```bash
# Nel container
cd /var/www/miq/vmdb
NODE_ENV=production bundle exec rake webpacker:compile
```

### Errore 404 sull'endpoint /cloud_tenant_dashboard/quota_data

**Causa:** Il controller non è stato riavviato.

**Soluzione:** Riavvia i worker o l'intero container.

## 📞 Supporto

Consulta il README.md nella directory del plugin per dettagli tecnici:
```
app/javascript/components/cloud-tenant-quota-gauges/README.md
```

---

**Versione:** 1.0
**Data:** 2025-11-10
**Compatibilità:** ManageIQ Radjabov-1
