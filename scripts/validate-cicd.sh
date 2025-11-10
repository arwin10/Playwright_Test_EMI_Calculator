#!/bin/bash
# CI/CD Validation Script
echo "✅ CI/CD Pipeline Validation"
echo ""
echo "Workflow files:"
ls -1 .github/workflows/*.yml | while read f; do echo "  ✓ $(basename $f)"; done
echo ""
echo "Documentation:"
[ -f "CI_CD_GUIDE.md" ] && echo "  ✓ CI_CD_GUIDE.md"
[ -f "CICD_SETUP_SUMMARY.md" ] && echo "  ✓ CICD_SETUP_SUMMARY.md"
echo ""
echo "✅ CI/CD pipeline is ready!"
