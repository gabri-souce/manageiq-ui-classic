# Webpack Compilation Guide - Inside Container

## Current Status
- All modified files have been copied to the container
- Files are located in: `/opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef`
- node_modules exists in container (dependencies already installed)
- Need to compile webpack to generate JavaScript bundles

## Step-by-Step Compilation

### 1. Enter the Container

```bash
# From your Mac terminal
podman exec -it manageiq-debug-vol_patch bash
```

### 2. Navigate to ManageIQ UI Classic Directory

```bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
```

### 3. Verify Modified Files Are Present

```bash
# Check the quota gauges plugin files exist
ls -la app/javascript/components/cloud-tenant-quota-gauges/

# Should show: index.jsx, quota-gauge.jsx, quota-gauges.scss, README.md
```

### 4. Check Node.js and Dependencies

```bash
# Check Node version (should be 16.20.2 or higher)
node --version

# Verify babel-loader is installed
ls node_modules/babel-loader/
```

### 5. Compile Webpack

**Option A: Simple compilation (recommended first try)**

```bash
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

**Option B: If Option A fails, try compiling specific pack**

```bash
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production \
  yarn webpack --config config/webpack/production.js
```

**Option C: If babel-loader errors persist**

```bash
# Check if yarn is available
which yarn

# Reinstall dependencies (if needed)
yarn install --frozen-lockfile

# Then retry compilation
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

### 6. Verify Compilation Success

After compilation completes, check:

```bash
# Look for compiled packs
ls -la public/packs/

# Should contain files like:
# - component-definitions-common-[hash].js
# - component-definitions-common-[hash].js.map
```

### 7. Check Compilation Output

Look for this in the output:

```
Compiled successfully in XXXXms

webpack 5.x.x compiled successfully
```

Specifically verify that `component-definitions-common` pack was compiled (not just shims).

### 8. Restart ManageIQ (if needed)

```bash
# Exit container
exit

# From Mac terminal, restart container
podman restart manageiq-debug-vol_patch

# Wait for it to come back up (check logs)
podman logs -f manageiq-debug-vol_patch
```

## Troubleshooting

### Error: "Can't resolve 'babel-loader'"

**Cause:** babel-loader not installed or corrupted

**Fix:**
```bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
yarn install --check-files
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

### Error: "Entry module not found"

**Cause:** Incorrect webpack config or missing entry files

**Fix:**
```bash
# Verify entry file exists
ls -la app/javascript/packs/component-definitions-common.js

# Use bin/webpack instead of direct webpack call
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

### Error: "digital envelope routines::unsupported"

**Cause:** OpenSSL compatibility issue with Node 16/17+

**Fix:** Already included in commands above:
```bash
NODE_OPTIONS=--openssl-legacy-provider
```

### Compilation hangs or takes too long

**Tip:** Webpack can take 5-10 minutes on first compilation. Be patient.

### Only "shims" pack compiles, not component-definitions-common

**Cause:** Webpack may need full rebuild

**Fix:**
```bash
# Clean webpack cache
rm -rf public/packs/*
rm -rf tmp/cache/webpacker/*

# Recompile
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

## After Successful Compilation

### 1. Access ManageIQ Web UI

```
http://your-server-ip:3000
```

### 2. Navigate to Cloud Tenant Dashboard

```
Compute → Clouds → Tenants → [Select a Tenant] → Dashboard tab
```

### 3. Verify Quota Gauges Appear

You should see:
- Section titled "Cloud Tenant Quotas"
- 5 gauge cards showing: RAM, Cores, Instances, Volumes, Gigabytes
- Each gauge showing: Used value, Total value, Meter chart, Available amount
- Color-coded status indicators (green/orange/red borders)

### 4. Check Browser Console (F12)

If gauges don't appear:
- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed API calls to `/cloud_tenant_dashboard/quota_data/[id]`

## Quick Reference Commands

```bash
# Full workflow in container
podman exec -it manageiq-debug-vol_patch bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
ls -la app/javascript/components/cloud-tenant-quota-gauges/
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
# Wait for compilation...
# Check output for "Compiled successfully"
exit
podman restart manageiq-debug-vol_patch
```

## Notes

- **Do NOT run webpack on Mac** - dependencies are container-specific
- **Always use NODE_OPTIONS=--openssl-legacy-provider** - required for Node 16+
- **./bin/webpack is preferred** over direct webpack calls - it sets up environment properly
- **Compilation is slow** - 5-10 minutes is normal for production builds
- **Check logs** - `podman logs manageiq-debug-vol_patch` shows Rails startup errors

## What Gets Compiled

The webpack compilation bundles:
- `app/javascript/components/cloud-tenant-quota-gauges/index.jsx`
- `app/javascript/components/cloud-tenant-quota-gauges/quota-gauge.jsx`
- `app/javascript/components/cloud-tenant-quota-gauges/quota-gauges.scss`

Into:
- `public/packs/component-definitions-common-[hash].js` (JavaScript bundle)
- `public/packs/component-definitions-common-[hash].css` (CSS bundle)

These bundles are then loaded by the browser when viewing the Cloud Tenant dashboard.

---

**Next Steps:**
1. Execute compilation commands in container (Step 5)
2. Verify successful compilation (Step 6-7)
3. Restart container (Step 8)
4. Test in web UI (After Successful Compilation section)
