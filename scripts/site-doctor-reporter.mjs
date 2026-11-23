import { writeFile } from 'node:fs/promises';

export default class SiteDoctorReporter {
  constructor() {
    this.results = [];
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  onTestEnd(test, result) {
    this.total += 1;
    if (result.status === 'passed') this.passed += 1;
    else if (result.status === 'skipped' || result.status === 'interrupted') this.skipped += 1;
    else {
      this.failed += 1;
      const titlePath = test.titlePath().join(' › ');
      const tagged = titlePath.match(/\[tool:([a-z0-9-]+)\]/i);
      const file = test.location?.file?.split('/').pop()?.replace(/^\d+-/, '').replace(/\.spec\.[^.]+$/, '');
      const tool = tagged?.[1] || (file && !/^(site-doctor|all-tool-routes)$/.test(file) ? file : 'عمومی سایت');
      this.results.push({
        tool,
        title: titlePath,
        file: test.location?.file ?? '',
        line: test.location?.line ?? null,
        durationMs: result.duration,
        error: (result.errors || []).map(item => item.stack || item.message || String(item)).join('\n\n').slice(0, 12000)
      });
    }
  }

  async onEnd() {
    const report = {
      generatedAt: new Date().toISOString(),
      total: this.total,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      failures: this.results
    };
    await writeFile('site-doctor-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(`SITE_DOCTOR_SUMMARY ${JSON.stringify({total: this.total, passed: this.passed, failed: this.failed, skipped: this.skipped})}`);
  }
}
