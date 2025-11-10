# GitHub Actions CI/CD Workflows

This directory contains automated workflows for running Playwright tests in the CI/CD pipeline.

## Workflows

### 1. **playwright-ci.yml** - Main CI Pipeline
**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch
- Daily at 2 AM UTC (scheduled)

**Jobs:**
- **Lint**: TypeScript compilation check
- **Sanity Tests**: Quick smoke checks (Chromium only)
- **Smoke Tests**: Critical path tests (Chromium only)
- **Regression Tests**: Full test suite (all browsers)
- **Negative Tests**: Error scenario tests
- **Test (Sharded)**: Parallel test execution across 4 shards
- **Report**: Generates and publishes Allure reports
- **Notify**: Sends notifications on failure

**Features:**
- Parallel execution with sharding (4 shards)
- Artifact retention (7-30 days)
- Allure report generation
- GitHub Pages deployment for reports
- Failure notifications

### 2. **pr-checks.yml** - Pull Request Quality Gates
**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
- **Validate**: Code quality checks
  - TypeScript compilation
  - Package-lock validation
  - Test file existence check
- **Sanity Check**: Run sanity tests
- **Quality Gate**: Overall PR status check

**Features:**
- Automatic PR comments with test results
- Fast feedback loop for developers
- Blocks merge on failure

### 3. **nightly-tests.yml** - Comprehensive Nightly Suite
**Triggers:**
- Daily at 2 AM UTC (scheduled)
- Manual workflow dispatch with browser selection

**Jobs:**
- **Cross-browser Tests**: Full suite on Chromium, Firefox, WebKit
- **Performance Tests**: Performance benchmarking
- **Generate Report**: Consolidated Allure report
- **Notify Results**: Test summary and notifications

**Features:**
- Cross-browser testing
- Extended artifact retention (90 days)
- Performance tracking
- Nightly reports on GitHub Pages

### 4. **manual-test-run.yml** - On-Demand Test Execution
**Triggers:**
- Manual workflow dispatch only

**Input Options:**
- **Test Type**: sanity, smoke, regression, negative, all
- **Browser**: chromium, firefox, webkit, all
- **Environment**: prod, staging, dev
- **Headed**: Run in headed mode (with browser UI)

**Features:**
- Flexible test execution
- Environment selection
- Custom browser selection
- Headed mode for debugging

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Code Push/PR                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   Lint & Check   │
              └─────────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌────────┐     ┌─────────┐    ┌──────────┐
   │ Sanity │     │  Smoke  │    │ Negative │
   └───┬────┘     └────┬────┘    └─────┬────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
                ┌──────────────┐
                │  Regression  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │Generate Report│
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │Deploy to Pages│
                └──────────────┘
```

## Artifacts

### Retention Periods
- **Sanity/Smoke**: 7-14 days
- **Regression**: 30 days
- **Nightly Tests**: 90 days
- **Allure Reports**: 30-90 days
- **Failure Screenshots/Videos**: 7-14 days

### Artifact Types
- `test-results/`: Playwright test results
- `playwright-report/`: HTML test report
- `allure-results/`: Allure test results
- `allure-report/`: Generated Allure report
- `*.png`: Screenshots on failure
- `*.webm`: Video recordings on failure

## GitHub Pages

Reports are automatically deployed to GitHub Pages:
- **Main Reports**: `https://<username>.github.io/<repo>/test-reports/`
- **Nightly Reports**: `https://<username>.github.io/<repo>/nightly-reports/`

### Enable GitHub Pages:
1. Go to repository **Settings** → **Pages**
2. Set **Source** to **gh-pages** branch
3. Set folder to **/ (root)**
4. Save

## Environment Variables

### Used in Workflows:
- `ENV`: Environment to test (prod/staging/dev)
- `HEADLESS`: Run in headless mode (true/false)
- `BROWSER`: Browser to use

### Secrets (if needed):
- `GITHUB_TOKEN`: Automatically provided
- Add custom secrets in **Settings** → **Secrets** → **Actions**

## Manual Workflow Execution

### Via GitHub UI:
1. Go to **Actions** tab
2. Select workflow from left sidebar
3. Click **Run workflow** button
4. Fill in parameters
5. Click **Run workflow**

### Via GitHub CLI:
```bash
# Run manual test
gh workflow run manual-test-run.yml \
  -f test_type=smoke \
  -f browser=chromium \
  -f environment=prod \
  -f headed=false

# Run nightly tests
gh workflow run nightly-tests.yml \
  -f browsers=all
```

## Monitoring & Notifications

### Success Indicators:
✅ All jobs completed successfully
✅ Quality gates passed
✅ Reports generated and deployed

### Failure Handling:
❌ Automatic notifications on failure
❌ Screenshots and videos captured
❌ Detailed logs in workflow run
❌ Artifacts available for download

## Best Practices

1. **PR Workflow**:
   - Always wait for sanity tests to pass
   - Review test results before merging
   - Fix failing tests before merge

2. **Nightly Tests**:
   - Review nightly reports daily
   - Track trends over time
   - Address flaky tests promptly

3. **Manual Runs**:
   - Use for debugging specific issues
   - Test specific scenarios
   - Verify fixes before PR

4. **Artifacts**:
   - Download failure artifacts for debugging
   - Share reports with team
   - Archive important test runs

## Troubleshooting

### Common Issues:

**Tests failing in CI but passing locally:**
- Check browser versions
- Verify environment variables
- Review timing/waits in tests
- Check network conditions

**Slow test execution:**
- Increase timeout in workflow
- Optimize test parallelization
- Review test dependencies

**Artifacts not uploading:**
- Check path patterns
- Verify files exist
- Review retention policies

**GitHub Pages not updating:**
- Check gh-pages branch
- Verify workflow permissions
- Review deployment logs

## Maintenance

### Weekly:
- Review test execution times
- Check artifact storage usage
- Monitor failure rates

### Monthly:
- Update Playwright version
- Review and clean old artifacts
- Optimize workflow configurations

### Quarterly:
- Review and update browser versions
- Audit test coverage
- Optimize CI/CD pipeline

## Support

For issues or questions:
1. Check workflow logs
2. Review test artifacts
3. Consult team documentation
4. Create issue with logs

---

**Last Updated**: November 2025
**Maintained By**: Test Automation Team
