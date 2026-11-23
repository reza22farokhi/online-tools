import { writeFile } from 'node:fs/promises';

export default class SiteDoctorReporter {
  constructor() {
    this.finalResults = new Map();
  }

  onTestEnd(test, result) {
    const titlePath = test.titlePath().join(' › ');
    const tagged = titlePath.match(/\[tool:([a-z0-9-]+)\]/i);
    const file = test.location?.file?.split('/').pop()?.replace(/^\d+-/, '').replace(/\.spec\.[^.]+$/, '');
    const title = titlePath.toLowerCase();
    const knownTools = [
      ['image resizer', 'image-resizer'],
      ['image compressor', 'image-compressor'],
      ['format converter', 'format-converter'],
      ['video converter', 'video-converter'],
      ['file to base64', 'file-to-base64'],
      ['file information', 'file-info'],
      ['csv and json', 'csv-json-converter'],
      ['csv analyzer', 'csv-analyzer'],
      ['qr code', 'qr-code-generator'],
      ['background remover', 'background-remover'],
      ['hash generator', 'hash-generator'],
      ['json formatter', 'json-formatter'],
      ['url encoder', 'url-encoder'],
      ['password generator', 'password-generator'],
      ['word counter', 'word-counter'],
      ['jwt inspector', 'jwt-inspector'],
      ['jwt decoder', 'jwt-decoder']
    ];
    const matched = knownTools.find(([needle]) => title.includes(needle));
    const tool = tagged?.[1] || matched?.[1] ||
      (file && !/^(site-doctor|all-tool-routes)$/.test(file) ? file : 'عمومی سایت');

    this.finalResults.set(test.id, {
      status: result.status,
      tool,
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
