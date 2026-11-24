import { describe, expect, it } from 'vitest';
import { buildSiteDoctorReport } from '../../scripts/site-doctor-reporter.mjs';

describe('buildSiteDoctorReport', () => {
  it('counts interrupted tests as failures, not skips', () => {
    const report = buildSiteDoctorReport([
      { status: 'passed' },
      { status: 'skipped' },
      { status: 'interrupted', title: 'tool run interrupted' }
    ], '2026-11-23T18:00:00.000Z');

    expect(report).toMatchObject({
      total: 3,
      passed: 1,
      failed: 1,
      skipped: 1,
      interrupted: 1,
      generatedAt: '2026-11-23T18:00:00.000Z'
    });
    expect(report.failures).toHaveLength(1);
    expect(report.failures[0].status).toBe('interrupted');
  });

  it('keeps intentionally skipped tests out of the failure count', () => {
    const report = buildSiteDoctorReport([{ status: 'skipped' }]);
    expect(report.failed).toBe(0);
    expect(report.skipped).toBe(1);
    expect(report.interrupted).toBe(0);
  });

  it('treats failed and timed-out tests as failures', () => {
    const report = buildSiteDoctorReport([{ status: 'failed' }, { status: 'timedOut' }]);
    expect(report.failed).toBe(2);
    expect(report.failures.map(result => result.status)).toEqual(['failed', 'timedOut']);
  });
});
