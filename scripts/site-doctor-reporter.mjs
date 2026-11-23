import { writeFile } from 'node:fs/promises';

export default class SiteDoctorReporter {
  constructor() {
    this.finalResults = new Map();
  }

  onTestEnd(test, result) {
    const titlePath = test.titlePath().join(' › ');
    const tool = titlePath.match(/\[tool:([a-z0-9-]+)\]/i)?.[1];
    const category = titlePath.match(/\[category:([a-z0-9-]+)\]/i)?.[1];
    const file = test.location?.file?.split('/').pop()?.replace(/^\d+-/, '').replace(/\.spec\.[^.]+$/, '');

    this.finalResults.set(test.id, {
      status: result.status,
      scope: tool ? 'tool' : category ? 'category' : 'site',
      tool: tool || undefined,
      category: category || undefined,
      title: titlePath,
      file: test.location?.file ?? '',
      line: test.location?.line ?? null,
      durationMs: result.duration,
      error: (result.errors || []).map(item => item.stack || item.message || String(item)).join('\n\n').slice(0, 12000)
    });
  }

  async onEnd() {
    const results = [...this.finalResults.values()];
    const failures = results.filter(result => !['passed', 'skipped', 'interrupted'].includes(result.status));
    const report = {
      generatedAt: new Date().toISOString(),
      total: results.length,
      passed: results.filter(result => result.status === 'passed').length,
      failed: failures.length,
      skipped: results.filter(result => ['skipped', 'interrupted'].includes(result.status)).length,
      failures
    };
    await writeFile('site-doctor-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(`SITE_DOCTOR_SUMMARY ${JSON.stringify({total: report.total, passed: report.passed, failed: report.failed, skipped: report.skipped})}`);
  }
}
