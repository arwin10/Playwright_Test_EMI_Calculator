# CI/CD Quick Reference

## 🎯 Common Commands

### Trigger Workflows Manually

```bash
# Main CI pipeline - run specific test suite
gh workflow run playwright-ci.yml -f test_suite=smoke

# Nightly tests - specific browser
gh workflow run nightly-tests.yml -f browsers=chromium

# Manual test run - full customization
gh workflow run manual-test-run.yml \
  -f test_type=regression \
  -f browser=all \
  -f environment=prod \
  -f headed=false
```

### Check Workflow Status

```bash
# List recent runs
gh run list --limit 10

# View specific workflow runs
gh run list --workflow=playwright-ci.yml

# Watch a running workflow
gh run watch

# View run details
gh run view <run-id>
```

### Download Artifacts

```bash
# List artifacts from latest run
gh run list --workflow=playwright-ci.yml --limit 1

# Download artifacts from specific run
gh run download <run-id>

# Download specific artifact
gh run download <run-id> --name allure-report
```

## 📋 Workflow Decision Tree

```
┌─────────────────────────────────────┐
│     What do you want to run?        │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
   Quick Test      Full Test
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│ Use Sanity   │  │Use Regression│
│   or Smoke   │  │   or All     │
└──────────────┘  └──────────────┘
       │               │
       ▼               ▼
   PR Checks      Main CI or
   (3-5 min)     Nightly Tests
                  (15-60 min)
```

## ⚡ Quick Actions

### Before Pull Request
```bash
# Run sanity locally
npm run test:sanity

# Run smoke locally
npm run test:smoke

# Check TypeScript
npx tsc --noEmit
```

### After PR Created
- Wait for PR checks to complete (~5 min)
- Review test results comment
- Fix failures if any
- Re-push to trigger re-run

### Debugging Failures
1. Click workflow run → Failed job
2. Download artifacts
3. Check screenshots/videos
4. View trace: `npx playwright show-trace trace.zip`

### Manual Test Execution
```bash
# Quick smoke test on Chrome
gh workflow run manual-test-run.yml \
  -f test_type=smoke \
  -f browser=chromium \
  -f environment=prod

# Full regression on all browsers
gh workflow run manual-test-run.yml \
  -f test_type=regression \
  -f browser=all \
  -f environment=prod

# Headed mode for debugging
gh workflow run manual-test-run.yml \
  -f test_type=sanity \
  -f browser=chromium \
  -f headed=true
```

## 🔗 Important Links

| Resource | URL Pattern |
|----------|-------------|
| **Actions Dashboard** | `github.com/USER/REPO/actions` |
| **Workflow Runs** | `github.com/USER/REPO/actions/workflows/playwright-ci.yml` |
| **Test Reports** | `USER.github.io/REPO/test-reports/` |
| **Nightly Reports** | `USER.github.io/REPO/nightly-reports/` |
| **Latest Artifact** | Actions → Recent run → Artifacts section |

## 📊 Workflow Matrix

| Workflow | Trigger | Duration | Browsers | Tests |
|----------|---------|----------|----------|-------|
| **PR Checks** | PR opened/updated | 3-5 min | Chrome | Sanity |
| **Main CI** | Push to main/develop | 15-20 min | Chrome | All |
| **Nightly** | Daily 2 AM UTC | 45-60 min | All | Full Suite |
| **Manual** | On-demand | Varies | Configurable | Configurable |

## 🚨 Troubleshooting

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Tests timeout** | Increase `timeout-minutes` in workflow |
| **Flaky tests** | Increase `retries` in playwright.config.ts |
| **Out of memory** | Reduce parallel workers or shards |
| **Browser install fails** | Specify exact Playwright version |
| **Artifacts not found** | Check retention period (may be expired) |
| **Pages not deploying** | Verify gh-pages branch and permissions |

### Debug Commands

```bash
# Check workflow syntax
gh workflow view playwright-ci.yml

# View workflow file
gh workflow view playwright-ci.yml --raw

# Cancel running workflow
gh run cancel <run-id>

# Re-run failed jobs
gh run rerun <run-id> --failed

# Re-run all jobs
gh run rerun <run-id>
```

## 🎓 Best Practices

### ✅ DO
- Run sanity tests locally before push
- Review test results before merging
- Keep test execution time under 20 min
- Use manual workflows for debugging
- Download failure artifacts promptly
- Monitor nightly test trends

### ❌ DON'T
- Commit secrets to repository
- Ignore flaky tests
- Skip quality gate checks
- Run full suite on every PR
- Keep all artifacts indefinitely
- Merge with failing tests

## 📦 Artifact Quick Reference

| Artifact | What It Contains | When to Use |
|----------|------------------|-------------|
| `playwright-results-*` | Test results, HTML reports | Review test outcomes |
| `allure-report` | Interactive test report | Share with team |
| `test-videos-*` | Video recordings | Debug UI issues |
| `screenshots-*` | Failure screenshots | Quick failure analysis |
| `*-trace.zip` | Playwright traces | Deep debugging |
| `error-context.md` | Page snapshot | Understand failure state |

## 🔄 CI/CD Workflow States

```
┌─────────┐
│ Queued  │ → Waiting for runner
└────┬────┘
     ▼
┌─────────┐
│In Progress│ → Tests running
└────┬────┘
     ▼
┌─────────┐
│Completed│ → Check result:
└────┬────┘
     │
  ┌──┴──┐
  ▼     ▼
Success  Failure
  │       │
  └───┬───┘
      ▼
  Artifacts & Reports
```

## 💡 Tips & Tricks

### Speed Up Workflows
```yaml
# Cache node_modules (already configured)
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# Run tests in parallel (already configured)
strategy:
  matrix:
    shard: [1, 2, 3, 4]
```

### Custom Notifications
Add Slack/Teams webhook:
```yaml
- name: Notify Slack
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text":"Tests failed!"}'
```

### Conditional Execution
```yaml
# Run only on main branch
if: github.ref == 'refs/heads/main'

# Run only on schedule
if: github.event_name == 'schedule'

# Run only if files changed
if: contains(github.event.head_commit.modified, 'tests/')
```

## 🎯 Success Criteria

### For Pull Requests
- ✅ All lint checks pass
- ✅ Sanity tests pass
- ✅ No new TypeScript errors
- ✅ Test coverage maintained

### For Main Branch
- ✅ Smoke tests pass
- ✅ Regression tests pass
- ✅ Reports generated
- ✅ No critical failures

### For Nightly Runs
- ✅ All browser tests pass
- ✅ Performance benchmarks met
- ✅ No flaky tests detected
- ✅ Reports deployed

## 📞 Support Contacts

- **CI/CD Issues**: [DevOps Team]
- **Test Failures**: [QA Team]
- **Workflow Help**: Check `.github/workflows/README.md`
- **Emergency**: [On-call Contact]

---

**Quick Links:**
- 📖 [Full CI/CD Guide](../../CI_CD_GUIDE.md)
- 🔧 [Workflow README](.github/workflows/README.md)
- 📊 [Test Reports](https://USER.github.io/REPO/test-reports/)
- 🚀 [Actions Dashboard](https://github.com/USER/REPO/actions)
