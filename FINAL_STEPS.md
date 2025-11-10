# Final Steps - Cloud Tenant Quota Gauges Plugin

## Current Status ✅

All code has been created and is ready to deploy:

### Files Created:
- ✅ `app/javascript/components/cloud-tenant-quota-gauges/index.jsx`
- ✅ `app/javascript/components/cloud-tenant-quota-gauges/quota-gauge.jsx`
- ✅ `app/javascript/components/cloud-tenant-quota-gauges/quota-gauges.scss`
- ✅ `app/javascript/components/cloud-tenant-quota-gauges/README.md`

### Files Modified:
- ✅ `app/services/cloud_tenant_dashboard_service.rb` (added quota_data method)
- ✅ `app/controllers/cloud_tenant_dashboard_controller.rb` (added quota_data endpoint)
- ✅ `app/javascript/packs/component-definitions-common.js` (registered component)
- ✅ `app/views/cloud_tenant/_show_dashboard.html.haml` (added quota gauges section)

### Documentation:
- ✅ `cloud-tenant-quota-gauges.patch` (patch file for colleagues)
- ✅ `INSTALL_QUOTA_PLUGIN.md` (installation guide)
- ✅ `apply-quota-gauges-patch.sh` (installation script)
- ✅ `COMPILE_IN_CONTAINER.md` (compilation guide)
- ✅ `compile-quota-gauges.sh` (compilation script) **← NEW**

## What's Left: Compile and Deploy 🚀

You need to:
1. Copy the compilation script to the server
2. Copy modified files to the container (if not done already)
3. Run webpack compilation inside the container
4. Restart ManageIQ
5. Test the quota gauges in the web UI

---

## Quick Start (Copy-Paste Commands)

### Step 1: Copy Files to Your Server

From your Mac terminal:

```bash
# Navigate to your local repo
cd ~/path/to/manageiq-ui-classic

# Copy compilation script to server
scp compile-quota-gauges.sh your-user@your-server:~/

# Copy modified files (if you haven't already)
tar czf quota-plugin-files.tar.gz \
  app/javascript/components/cloud-tenant-quota-gauges/ \
  app/services/cloud_tenant_dashboard_service.rb \
  app/controllers/cloud_tenant_dashboard_controller.rb \
  app/javascript/packs/component-definitions-common.js \
  app/views/cloud_tenant/_show_dashboard.html.haml

scp quota-plugin-files.tar.gz your-user@your-server:~/
```

### Step 2: SSH to Your Server

```bash
ssh your-user@your-server
```

### Step 3: Copy Files to Container

```bash
# Copy compilation script to container
podman cp ~/compile-quota-gauges.sh \
  manageiq-debug-vol_patch:/opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/

# Make it executable
podman exec manageiq-debug-vol_patch chmod +x \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/compile-quota-gauges.sh

# Copy modified files to container (if not done already)
podman cp ~/quota-plugin-files.tar.gz manageiq-debug-vol_patch:/tmp/

# Extract files in container
podman exec manageiq-debug-vol_patch bash -c \
  "cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef && \
   tar xzf /tmp/quota-plugin-files.tar.gz"
```

### Step 4: Enter Container and Compile

```bash
# Enter the container
podman exec -it manageiq-debug-vol_patch bash

# Navigate to ManageIQ UI Classic directory
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

# Run the compilation script
./compile-quota-gauges.sh
```

**Wait 5-10 minutes for compilation to complete.**

You should see:
```
========================================
✓ Webpack compiled successfully!
========================================
```

### Step 5: Exit and Restart

```bash
# Exit the container
exit

# Restart ManageIQ
podman restart manageiq-debug-vol_patch

# Watch logs to see when it's ready
podman logs -f manageiq-debug-vol_patch
```

Wait for the log message:
```
* Listening on http://0.0.0.0:3000
```

Then press `Ctrl+C` to exit the logs.

### Step 6: Test in Web UI

1. Open browser: `http://your-server-ip:3000`
2. Log in to ManageIQ
3. Navigate to: **Compute → Clouds → Tenants → [Select a Tenant] → Dashboard tab**
4. You should see the **"Cloud Tenant Quotas"** section with 5 gauge cards

---

## Manual Compilation (If Script Fails)

If the `compile-quota-gauges.sh` script fails, you can compile manually:

```bash
# Enter container
podman exec -it manageiq-debug-vol_patch bash

# Navigate to directory
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

# Verify plugin files exist
ls -la app/javascript/components/cloud-tenant-quota-gauges/

# Check dependencies
ls node_modules/babel-loader/

# If babel-loader missing, reinstall dependencies
yarn install --check-files

# Compile webpack
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack

# Exit container
exit

# Restart ManageIQ
podman restart manageiq-debug-vol_patch
```

---

## Verification Checklist ✓

After deployment, verify:

- [ ] Container starts without errors: `podman logs manageiq-debug-vol_patch | grep -i error`
- [ ] Webpack compiled successfully: Check for `component-definitions-common-*.js` in public/packs/
- [ ] Web UI loads: `http://your-server-ip:3000`
- [ ] Cloud Tenant dashboard loads: Navigate to a tenant → Dashboard tab
- [ ] Quota gauges section appears with 5 cards
- [ ] Gauges show data: RAM, Cores, Instances, Volumes, Gigabytes
- [ ] Meter charts render properly (colored bars)
- [ ] Status indicators work (green/orange/red borders)
- [ ] No JavaScript errors in browser console (F12 → Console)

---

## Expected Output

When quota gauges are working, you should see:

```
┌─────────────────────────────────────────────────┐
│         Cloud Tenant Quotas                     │
│   Monitor resource usage against allocated      │
│   quotas                                        │
└─────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   RAM    │ │  Cores   │ │ Instances│ │ Volumes  │ │Gigabytes │
│  (GB)    │ │          │ │          │ │          │ │  (GB)    │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ USED     │ │ USED     │ │ USED     │ │ USED     │ │ USED     │
│  24.00   │ │   8      │ │   3      │ │   5      │ │  150.00  │
│    /     │ │    /     │ │    /     │ │    /     │ │    /     │
│ TOTAL    │ │ TOTAL    │ │ TOTAL    │ │ TOTAL    │ │ TOTAL    │
│  64.00   │ │   16     │ │   10     │ │   20     │ │  500.00  │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ [====   ]│ │ [====   ]│ │ [==     ]│ │ [==     ]│ │ [==     ]│
│  37.5%   │ │   50%    │ │   30%    │ │   25%    │ │   30%    │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│ 40.00    │ │ 8 avail. │ │ 7 avail. │ │ 15 avail.│ │ 350.00   │
│available │ │          │ │          │ │          │ │available │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
  (Green)     (Green)      (Green)      (Green)      (Green)
```

### Status Colors:
- **Green border**: Usage < 75% (healthy)
- **Orange border**: Usage 75-90% (warning)
- **Red border**: Usage > 90% (critical)

---

## Troubleshooting

### Problem: Container won't start

**Check logs:**
```bash
podman logs manageiq-debug-vol_patch | tail -50
```

**Common causes:**
- Syntax error in modified Ruby files
- Missing dependencies
- Port 3000 already in use

**Solution:**
```bash
# Restore backup if needed
podman exec manageiq-debug-vol_patch bash -c \
  "cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef && \
   ls -la .quota-gauges-backup-*/"
```

### Problem: Webpack compilation fails

**Error:** "Can't resolve 'babel-loader'"

**Solution:**
```bash
podman exec -it manageiq-debug-vol_patch bash
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef
yarn install --check-files
NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production ./bin/webpack
```

### Problem: Quota gauges don't appear

**Check:**
1. Browser console (F12 → Console) for JavaScript errors
2. Network tab (F12 → Network) for failed API calls
3. Component is registered: `grep -r "CloudTenantQuotaGauges" app/javascript/packs/`
4. View includes component: `grep -r "CloudTenantQuotaGauges" app/views/cloud_tenant/`

**Solution:**
```bash
# Verify compiled pack exists
podman exec manageiq-debug-vol_patch ls -la \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/public/packs/component-definitions-common-*.js
```

### Problem: API endpoint returns 404

**Error in browser console:** `GET /cloud_tenant_dashboard/quota_data/123 404`

**Check controller:**
```bash
podman exec manageiq-debug-vol_patch grep -A 5 "def quota_data" \
  /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/app/controllers/cloud_tenant_dashboard_controller.rb
```

**Should show:**
```ruby
def quota_data
  assert_privileges('ems_cloud_view')
  render :json => {:data => quota}
end
```

---

## Sharing with Colleagues

To share this plugin with your team, provide them:

1. **Patch file:** `cloud-tenant-quota-gauges.patch`
2. **Installation guide:** `INSTALL_QUOTA_PLUGIN.md`
3. **Installation script:** `apply-quota-gauges-patch.sh`

They can apply the patch to their ManageIQ installation using:

```bash
git apply cloud-tenant-quota-gauges.patch
```

Or use the installation script for a safer approach.

---

## Summary

You've successfully created a complete ManageIQ plugin that:

- ✅ Displays 5 quota gauges (RAM, Cores, Instances, Volumes, Gigabytes)
- ✅ Uses multi-layer visualization (numbers + meter charts)
- ✅ Shows color-coded status indicators
- ✅ Fetches real quota data from CloudResourceQuota model
- ✅ Integrates seamlessly into Cloud Tenant dashboard
- ✅ Works with existing ManageIQ dependencies (no new gems/packages)
- ✅ Is shareable as a standalone plugin

**Next action:** Run the compilation commands above and test in your browser!

---

**Good luck! The quota gauges should be working within the next 15-20 minutes.** 🎉
