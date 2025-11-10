# 📊 GUIDA COMPLETA - Plugin Gauge Quote Cloud Tenant

## Cosa Faremo

Installeremo un plugin per ManageIQ che mostra 5 gauge (grafici circolari) con le quote del cloud tenant:
- **RAM** (in GB)
- **Cores** (numero di CPU)
- **Instances** (numero di istanze)
- **Volumes** (numero di volumi)
- **Gigabytes** (spazio storage in GB)

---

## ✅ Prerequisiti

Prima di iniziare, assicurati di avere:
- [ ] Un server con ManageIQ installato in un container Podman
- [ ] Accesso SSH al server
- [ ] Il container ManageIQ si chiama: `manageiq-debug-vol_patch`
- [ ] Il tuo computer (Mac/Linux) con accesso al server

---

## 📋 PARTE 1: Preparazione sul Tuo Computer

### Passo 1: Scarica i File dalla Repository

Sul tuo computer (Mac/Linux), apri il terminale:

```bash
# Vai nella tua home
cd ~

# Clona la repository (se non l'hai già)
git clone https://github.com/gabri-souce/manageiq-ui-classic.git

# Entra nella directory
cd manageiq-ui-classic

# Vai sul branch corretto
git checkout claude/add-multilayer-gauge-plugins-011CUu32NSkX5Xn5VTXf4nNe

# Verifica di essere sul branch giusto
git branch
# Dovresti vedere: * claude/add-multilayer-gauge-plugins-011CUu32NSkX5Xn5VTXf4nNe
```

✅ **Verifica:** Controlla che esistano questi file:
```bash
ls -la compile-quota-gauges.sh
ls -la app/javascript/components/cloud-tenant-quota-gauges/
```

Dovresti vedere:
- `compile-quota-gauges.sh` (lo script di compilazione)
- La directory `cloud-tenant-quota-gauges` con i file del plugin

---

### Passo 2: Crea l'Archivio dei File Modificati

Dobbiamo creare un pacchetto con tutti i file da copiare nel container:

```bash
# Assicurati di essere nella directory manageiq-ui-classic
cd ~/manageiq-ui-classic

# Crea l'archivio con tutti i file modificati
tar czf ~/quota-plugin-files.tar.gz \
  app/javascript/components/cloud-tenant-quota-gauges/ \
  app/services/cloud_tenant_dashboard_service.rb \
  app/controllers/cloud_tenant_dashboard_controller.rb \
  app/javascript/packs/component-definitions-common.js \
  app/views/cloud_tenant/_show_dashboard.html.haml
```

✅ **Verifica:** Controlla che l'archivio sia stato creato:
```bash
ls -lh ~/quota-plugin-files.tar.gz
# Dovresti vedere un file di circa 10-20 KB
```

---

### Passo 3: Copia i File sul Server

**IMPORTANTE:** Sostituisci `TUO-UTENTE` e `TUO-SERVER-IP` con i tuoi dati!

```bash
# Copia lo script di compilazione
scp ~/manageiq-ui-classic/compile-quota-gauges.sh TUO-UTENTE@TUO-SERVER-IP:~/

# Copia l'archivio con i file modificati
scp ~/quota-plugin-files.tar.gz TUO-UTENTE@TUO-SERVER-IP:~/
```

Esempio:
```bash
scp ~/manageiq-ui-classic/compile-quota-gauges.sh mario@192.168.1.100:~/
scp ~/quota-plugin-files.tar.gz mario@192.168.1.100:~/
```

✅ **Verifica:** I file dovrebbero essere copiati senza errori.

---

## 🖥️ PARTE 2: Operazioni sul Server

### Passo 4: Connettiti al Server

Dal tuo computer, connettiti via SSH:

```bash
ssh TUO-UTENTE@TUO-SERVER-IP
```

Esempio:
```bash
ssh mario@192.168.1.100
```

Ora sei sul server! 🎉

---

### Passo 5: Verifica che il Container Sia Attivo

```bash
# Controlla lo stato del container
podman ps | grep manageiq
```

Dovresti vedere una riga con `manageiq-debug-vol_patch` e lo stato `Up`.

**Se il container non è attivo:**
```bash
podman start manageiq-debug-vol_patch
podman logs -f manageiq-debug-vol_patch
# Aspetta che vedi: "Listening on http://0.0.0.0:3000"
# Poi premi Ctrl+C
```

✅ **Verifica:** Il container è in esecuzione.

---

### Passo 6: Copia i File nel Container

```bash
# Copia lo script di compilazione nel container
podman cp ~/compile-quota-gauges.sh \
  manageiq-debug-vol_patch:/opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/

# Copia l'archivio dei file nel container
podman cp ~/quota-plugin-files.tar.gz \
  manageiq-debug-vol_patch:/tmp/
```

✅ **Verifica:** I comandi dovrebbero completarsi senza errori.

---

### Passo 7: Estrai i File nel Container

```bash
# Estrai i file modificati nella posizione corretta
podman exec manageiq-debug-vol_patch bash -c \
  "cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef && \
   tar xzf /tmp/quota-plugin-files.tar.gz"
```

✅ **Verifica:** Controlla che i file siano stati estratti:
```bash
podman exec manageiq-debug-vol_patch ls -la \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/app/javascript/components/cloud-tenant-quota-gauges/
```

Dovresti vedere:
- `index.jsx`
- `quota-gauge.jsx`
- `quota-gauges.scss`
- `README.md`

---

## ⚙️ PARTE 3: Compilazione Webpack

### Passo 8: Entra nel Container

```bash
podman exec -it manageiq-debug-vol_patch bash
```

Ora sei DENTRO il container! Il prompt dovrebbe cambiare.

---

### Passo 9: Vai nella Directory ManageIQ UI

```bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
```

✅ **Verifica:** Sei nella directory corretta:
```bash
pwd
# Dovresti vedere: /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
```

---

### Passo 10: Rendi Eseguibile lo Script

```bash
chmod +x compile-quota-gauges.sh
```

✅ **Verifica:** Lo script è eseguibile:
```bash
ls -la compile-quota-gauges.sh
# Dovresti vedere: -rwxr-xr-x (le 'x' indicano che è eseguibile)
```

---

### Passo 11: Esegui lo Script di Compilazione

**QUESTO È IL PASSO PIÙ IMPORTANTE!**

```bash
./compile-quota-gauges.sh
```

**Cosa succederà:**
1. Lo script controlla che tutti i file siano presenti
2. Verifica le dipendenze Node.js
3. Pulisce la cache webpack
4. Compila tutto il codice JavaScript

**⏱️ TEMPO:** Ci vorranno circa **5-10 minuti**. Sii paziente!

**ASPETTATI DI VEDERE:**
```
========================================
Cloud Tenant Quota Gauges - Webpack Compiler
========================================

Step 1: Verifying plugin files...
✓ Plugin files found

Step 2: Checking Node.js environment...
  Node version: v16.20.2
✓ Node.js environment ready

Step 3: Cleaning previous builds...
✓ Webpack cache cleared

Step 4: Compiling webpack...
This may take 5-10 minutes. Please be patient...

[... molti log di compilazione ...]

webpack 5.x.x compiled successfully

========================================
✓ Webpack compiled successfully!
========================================
```

✅ **SUCCESSO!** Se vedi "✓ Webpack compiled successfully!" puoi continuare.

❌ **ERRORE?** Se vedi errori, continua a leggere la sezione "Risoluzione Problemi" più sotto.

---

### Passo 12: Esci dal Container

```bash
exit
```

Ora sei tornato sul server (non più dentro il container).

---

## 🔄 PARTE 4: Riavvio ManageIQ

### Passo 13: Riavvia il Container

```bash
podman restart manageiq-debug-vol_patch
```

✅ **Verifica:** Aspetta che il container si riavvii:
```bash
podman logs -f manageiq-debug-vol_patch
```

**Aspetta finché non vedi:**
```
* Listening on http://0.0.0.0:3000
```

Questo significa che ManageIQ è pronto! Premi `Ctrl+C` per uscire dai log.

---

## 🌐 PARTE 5: Test nel Browser

### Passo 14: Accedi a ManageIQ

1. Apri il browser
2. Vai a: `http://TUO-SERVER-IP:3000`
3. Fai login con le tue credenziali

---

### Passo 15: Naviga ai Gauge delle Quote

1. Nel menu laterale vai su: **Compute** → **Clouds** → **Tenants**
2. Clicca su un tenant dalla lista
3. Clicca sulla tab **Dashboard**

**🎉 DOVRESTI VEDERE:**

```
╔═══════════════════════════════════════════════════╗
║         Cloud Tenant Quotas                       ║
║   Monitor resource usage against allocated quotas ║
╚═══════════════════════════════════════════════════╝

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   RAM    │ │  Cores   │ │ Instances│ │ Volumes  │ │Gigabytes │
│  (GB)    │ │          │ │          │ │          │ │  (GB)    │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ Used     │ │ Used     │ │ Used     │ │ Used     │ │ Used     │
│  24.00   │ │   8      │ │   3      │ │   5      │ │  150.00  │
│    /     │ │    /     │ │    /     │ │    /     │ │    /     │
│ Total    │ │ Total    │ │ Total    │ │ Total    │ │ Total    │
│  64.00   │ │   16     │ │   10     │ │   20     │ │  500.00  │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ [====   ]│ │ [====   ]│ │ [==     ]│ │ [==     ]│ │ [==     ]│
│  37.5%   │ │   50%    │ │   30%    │ │   25%    │ │   30%    │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ 40.00    │ │ 8        │ │ 7        │ │ 15       │ │ 350.00   │
│available │ │available │ │available │ │available │ │available │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Colori dei bordi:**
- 🟢 **Verde**: Utilizzo < 75% (tutto ok)
- 🟠 **Arancione**: Utilizzo 75-90% (attenzione)
- 🔴 **Rosso**: Utilizzo > 90% (critico)

---

## ✅ Checklist Finale

- [ ] Container è in esecuzione
- [ ] File copiati nel container
- [ ] Webpack compilato con successo
- [ ] Container riavviato
- [ ] Accesso a ManageIQ web UI
- [ ] Gauge visibili nel dashboard del tenant
- [ ] I 5 gauge mostrano dati (RAM, Cores, Instances, Volumes, Gigabytes)
- [ ] I grafici circolari (meter charts) sono visibili
- [ ] I bordi colorati funzionano

---

## 🐛 Risoluzione Problemi

### Problema 1: "bash: ./compile-quota-gauges.sh: Permission denied"

**Soluzione:**
```bash
chmod +x compile-quota-gauges.sh
./compile-quota-gauges.sh
```

---

### Problema 2: Webpack compilation failed

**Errore:** "Can't resolve 'babel-loader'"

**Soluzione:**
```bash
# Dentro il container
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
yarn install --check-files
./compile-quota-gauges.sh
```

---

### Problema 3: I gauge non appaiono nel browser

**Controlla la console del browser:**
1. Premi `F12` nel browser
2. Vai alla tab **Console**
3. Cerca errori in rosso

**Controlla che i file compilati esistano:**
```bash
# Sul server (fuori dal container)
podman exec manageiq-debug-vol_patch ls -la \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/public/packs/ | grep component-definitions-common
```

Dovresti vedere file come:
- `component-definitions-common-[hash].js`
- `component-definitions-common-[hash].js.map`

**Se non ci sono:**
```bash
# Entra nel container e ricompila
podman exec -it manageiq-debug-vol_patch bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
./compile-quota-gauges.sh
exit
podman restart manageiq-debug-vol_patch
```

---

### Problema 4: Container non si avvia dopo il riavvio

**Controlla i log:**
```bash
podman logs manageiq-debug-vol_patch | tail -100
```

**Cerca errori Ruby/Rails:**
- Syntax error nei file .rb
- Missing dependencies

**Se ci sono errori di sintassi:** Probabilmente un file è stato corrotto durante la copia. Ripeti i passi 6-7.

---

### Problema 5: API endpoint returns 404

**Errore nel browser:** `GET /cloud_tenant_dashboard/quota_data/123 404`

**Verifica che il controller sia stato modificato:**
```bash
podman exec manageiq-debug-vol_patch grep -A 5 "def quota_data" \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/app/controllers/cloud_tenant_dashboard_controller.rb
```

Se non vedi il metodo `quota_data`, ripeti i passi 6-7 per copiare nuovamente i file.

---

## 📞 Aiuto

Se qualcosa non funziona:

1. **Rileggi la guida** - assicurati di non aver saltato nessun passo
2. **Controlla i log** - `podman logs manageiq-debug-vol_patch`
3. **Console browser** - F12 → Console per errori JavaScript
4. **Verifica file** - Controlla che tutti i file siano stati copiati

---

## 🎓 Cosa Condividere con i Colleghi

Se i tuoi colleghi vogliono installare lo stesso plugin:

**File da condividere:**
- `cloud-tenant-quota-gauges.patch` (nella repo)
- `INSTALL_QUOTA_PLUGIN.md` (nella repo)
- Questa guida (`GUIDA_COMPLETA_ITALIANO.md`)

**Oppure semplicemente:**
```bash
git clone https://github.com/gabri-souce/manageiq-ui-classic.git
cd manageiq-ui-classic
git checkout claude/add-multilayer-gauge-plugins-011CUu32NSkX5Xn5VTXf4nNe
# Poi seguire questa guida
```

---

## 🎉 Fatto!

Se hai seguito tutti i passi, il plugin dovrebbe funzionare!

I gauge delle quote cloud tenant sono ora visibili e mostrano:
- Valori usati vs totali
- Grafici circolari (meter charts)
- Indicatori di stato colorati
- Valori disponibili

**Buon lavoro! 🚀**
