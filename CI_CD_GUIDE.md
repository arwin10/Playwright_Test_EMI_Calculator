# CI/CD Pipeline Guide

Complete guide for the GitHub Actions CI/CD pipeline for Playwright test automation.

## 🚀 Quick Start

### Prerequisites
1. GitHub repository with admin access
2. GitHub Actions enabled
3. Repository secrets configured (if needed)

### Initial Setup

1. **Enable GitHub Actions**
   ```bash
   # Workflows are already in .github/workflows/
   # Push to GitHub to trigger
   git add .github/workflows/
   git commit -m "Add CI/CD workflows"
   git push origin main
   ```

2. **Enable GitHub Pages** (for test reports)
   - Go to repository **Settings** → **Pages**
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `(root)`
   - Click Save

3. **Update Badge URLs in README.md**
   ```markdown
   Replace YOUR_USERNAME and YOUR_REPO with your actual values:
   [![Playwright Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-ci.yml/badge.svg)](...)
   ```

## 📊 Workflows Overview

### 1. Main CI Pipeline (`playwright-ci.yml`)

**Purpose**: Automated testing on every push/PR

**When it runs:**
- Push to `main` or `develop`
- Pull requests
- Manual trigger
- Daily at 2 AM UTC

**Jobs Flow:**
```
Lint → [Sanity, Smoke, Negative] → Regression → Report → Notify
```

**Execution Time**: ~15-20 minutes

**Key Features:**
- Parallel test execution (4 shards)
- Selective test execution based on trigger
- Automatic report generation
- GitHub Pages deployment

### 2. PR Quality Checks (`pr-checks.yml`)

**Purpose**: Fast feedback for pull requests

**When it runs:**
- PR opened, updated, or reopened

**Jobs:**
1. **Validate** - Code quality checks
2. **Sanity Check** - Critical path tests
3. **Quality Gate** - Overall status

**Execution Time**: ~3-5 minutes

**Auto Comments**: Posts test results on PR

### 3. Nightly Tests (`nightly-tests.yml`)

**Purpose**: Comprehensive cross-browser testing

**When it runs:**
- Daily at 2 AM UTC
- Manual trigger with browser selection

**Jobs:**
- Chromium tests
- Firefox tests
- WebKit tests
- Performance benchmarks
- Report generation

**Execution Time**: ~45-60 minutes

**Reports**: Deployed to `/nightly-reports/` on GitHub Pages

### 4. Manual Test Run (`manual-test-run.yml`)

**Purpose**: On-demand test execution with custom parameters

**When it runs:**
- Manual trigger only

**Parameters:**
- Test type (sanity/smoke/regression/negative/all)
- Browser (chromium/firefox/webkit/all)
- Environment (prod/staging/dev)
- Headed mode (true/false)

**Execution Time**: Varies (5-60 minutes)

## 🔄 Workflow Triggers

### Automatic Triggers

| Trigger | Workflows | Condition |
|---------|-----------|-----------|
| Push to main/develop | CI, Nightly | All commits |
| Pull Request | CI, PR Checks | To main/develop |
| Schedule (2 AM UTC) | CI, Nightly | Daily |

### Manual Triggers

All workflows support `workflow_dispatch` for manual execution:

**Via GitHub UI:**
1. Actions tab → Select workflow
2. Run workflow → Fill parameters
3. Click "Run workflow"

**Via GitHub CLI:**
```bash
# Run sanity tests
gh workflow run playwright-ci.yml -f test_suite=sanity

# Run nightly tests on specific browser
gh workflow run nightly-tests.yml -f browsers=chromium

# Manual test with custom params
gh workflow run manual-test-run.yml \
  -f test_type=smoke \
  -f browser=firefox \
  -f environment=staging \
  -f headed=false
```

## 📦 Artifacts & Reports

### Artifact Types

| Artifact | Retention | Contents |
|----------|-----------|----------|
| playwright-results-* | 30 days | Test results, reports |
| sanity-test-results | 7 days | Sanity test outputs |
| smoke-test-results | 14 days | Smoke test outputs |
| regression-test-results | 30 days | Full regression results |
| nightly-results-* | 90 days | Cross-browser results |
| allure-report | 30-90 days | Generated reports |
| test-videos-* | 7-14 days | Failure videos |
| screenshots-* | 7-14 days | Failure screenshots |

### Downloading Artifacts

**Via GitHub UI:**
1. Go to workflow run
2. Scroll to "Artifacts" section
3. Click to download

**Via GitHub CLI:**
```bash
# List artifacts
gh run list --workflow=playwright-ci.yml --limit 1

# Download artifact
gh run download <run-id>
```

### Viewing Reports

**Allure Reports:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/test-reports/
https://YOUR_USERNAME.github.io/YOUR_REPO/nightly-reports/
```

**Playwright HTML Report:**
Download artifact and open `playwright-report/index.html`

## ⚙️ Configuration

### Environment Variables

**In workflows:**
```yaml
env:
  ENV: prod              # Environment (prod/staging/dev)
  HEADLESS: true         # Headless mode
  BROWSER: chromium      # Browser type
```

**In code (.env file):**
```bash
BASE_URL=https://www.calculateyouremi.in
ENV=prod
HEADLESS=true
```

### Secrets Management

**To add secrets:**
1. Repository → Settings → Secrets → Actions
2. Click "New repository secret"
3. Add name and value

**Usage in workflows:**
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  AUTH_TOKEN: ${{ secrets.AUTH_TOKEN }}
```

**Default secret:**
- `GITHUB_TOKEN` - Automatically provided

### Workflow Customization

#### Change Schedule
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
  # Change to: '0 14 * * 1-5'  # Weekdays at 2 PM UTC
```

#### Modify Sharding
```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]  # 4 shards
    # Change to: [1, 2, 3, 4, 5, 6]  # 6 shards
```

#### Add New Browser
```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    # Add: [chromium, firefox, webkit, mobile-chrome]
```

## 🔍 Monitoring & Debugging

### Viewing Workflow Status

**Dashboard:**
- Actions tab → All workflows
- Status badges in README
- Commit status checks

**Email Notifications:**
- Settings → Notifications
- Enable workflow notifications

### Debugging Failed Tests

1. **Check workflow logs:**
   ```
   Actions → Failed run → Expand failed job → View logs
   ```

2. **Download artifacts:**
   - Screenshots: `test-results/**/*.png`
   - Videos: `test-results/**/*.webm`
   - Traces: `test-results/**/*.zip`

3. **View Playwright trace:**
   ```bash
   # Download trace.zip artifact
   npx playwright show-trace trace.zip
   ```

4. **Check error context:**
   - Look for `error-context.md` in artifacts
   - Review step summary in workflow run

### Common Issues

**Issue: Tests timeout in CI**
```yaml
# Increase timeout
jobs:
  test:
    timeout-minutes: 90  # Increase from 60
```

**Issue: Flaky tests**
```typescript
// Increase retries in playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

**Issue: Out of disk space**
```yaml
# Clean before tests
- name: Clean disk
  run: docker system prune -af
```

**Issue: Browser installation fails**
```yaml
# Use specific version
- run: npx playwright@1.40.0 install --with-deps
```

## 📈 Performance Optimization

### Parallel Execution

**Current setup:**
- 4 parallel shards
- ~25% faster execution

**Optimize:**
```yaml
# Increase workers
strategy:
  matrix:
    shard: [1, 2, 3, 4, 5, 6]  # 6 shards
```

### Test Selection

**Run only changed tests:**
```yaml
- name: Get changed files
  id: changed-files
  uses: tj-actions/changed-files@v40
  
- name: Run affected tests
  run: npx playwright test ${{ steps.changed-files.outputs.all_changed_files }}
```

### Caching

**Already configured:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Caches node_modules
```

**Add Playwright cache:**
```yaml
- name: Cache Playwright
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}
```

## 🔐 Security Best Practices

1. **Never commit secrets**
   - Use GitHub Secrets
   - Use environment variables
   - Review `.gitignore`

2. **Limit workflow permissions**
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

3. **Use dependabot**
   - Enable in Settings → Security
   - Auto-update dependencies

4. **Review workflow changes**
   - Require approval for workflow changes
   - Settings → Actions → General

## 📊 Metrics & Reporting

### Test Metrics

**Track:**
- Test execution time
- Pass/fail rates
- Flaky test count
- Coverage metrics

**View in Allure:**
- Trends over time
- Test duration
- Failure categories

### Custom Metrics

**Add to workflow:**
```yaml
- name: Calculate metrics
  run: |
    echo "total_tests=$(cat test-results/results.json | jq .total)" >> $GITHUB_OUTPUT
    echo "pass_rate=$(cat test-results/results.json | jq .passRate)" >> $GITHUB_OUTPUT
```

### Status Dashboards

**GitHub Actions Dashboard:**
- Repository → Actions tab
- View all workflow runs
- Filter by status/branch

**External Monitoring:**
- Integrate with Slack/Teams
- Use webhook notifications
- Set up Datadog/New Relic

## 🚦 Quality Gates

### Pre-merge Checks

**Required checks:**
1. Lint & type check passes
2. Sanity tests pass
3. Smoke tests pass
4. No regression failures

**Configure:**
Settings → Branches → Add rule
- Require status checks to pass
- Select: `Sanity Tests`, `Smoke Tests`

### Blocking Conditions

**Automatically block if:**
- Lint errors exist
- Type check fails
- Critical tests fail
- Coverage drops

## 🔄 Continuous Improvement

### Weekly Reviews

- [ ] Check test execution trends
- [ ] Identify flaky tests
- [ ] Review failure rates
- [ ] Optimize slow tests

### Monthly Tasks

- [ ] Update Playwright version
- [ ] Review artifact storage
- [ ] Clean old workflow runs
- [ ] Update documentation

### Quarterly Reviews

- [ ] Audit workflow efficiency
- [ ] Review sharding strategy
- [ ] Update browser versions
- [ ] Optimize costs

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Allure Report](https://docs.qameta.io/allure/)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

## 🆘 Support & Troubleshooting

**For issues:**
1. Check workflow logs
2. Review error artifacts
3. Consult team documentation
4. Create issue with details

**Contact:**
- Team Lead: [Email]
- DevOps: [Slack Channel]
- Documentation: [Wiki Link]

---

**Last Updated**: November 2025
**Version**: 1.0
**Maintained By**: Test Automation Team
