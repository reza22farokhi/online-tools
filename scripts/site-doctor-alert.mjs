import { appendFile, readFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('site-doctor-report.json', 'utf8'));
const summary = [
  '## 🩺 Site Doctor — Daily Health Report',
  '',
  `- Time: ${report.generatedAt}`,
  `- Total tests: ${report.total}`,
  `- Passed: ${report.passed}`,
  `- Failed: ${report.failed}`,
  `- Skipped: ${report.skipped}`,
  `- Interrupted: ${report.interrupted ?? 0}`,
  `- Result: ${report.failed ? '❌ Unhealthy' : '✅ Healthy'}`,
  ''
].join('\n');

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}

if (report.failed === 0 && (report.interrupted ?? 0) === 0) {
  console.log('Site Doctor: all Playwright tests passed.');
  process.exit(0);
}

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required to create alerts.');

const api = 'https://api.github.com';
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json'
};
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : 'Unavailable';

const grouped = new Map();
for (const failure of report.failures) {
  const name = failure.tool || 'عمومی سایت';
  if (!grouped.has(name)) grouped.set(name, []);
  grouped.get(name).push(failure);
}

for (const [tool, failures] of grouped) {
  const title = `🚨 ابزار ${tool} خراب شده`;
  const details = failures.map((failure, index) => [
    `### Failure ${index + 1}: ${failure.title}`,
    `- File: ${failure.file || 'unknown'}`,
    `- Line: ${failure.line ?? 'unknown'}`,
    `- Duration: ${failure.durationMs ?? 0} ms`,
    '',
    ' ```text',
    failure.error || 'No error details were captured.',
    ' ```'
  ].join('\n')).join('\n\n');

  const body = [
    '## Autonomous Site Doctor Alert',
    '',
    `**Tool:** ${tool}`,
    `**Detected:** ${report.generatedAt}`,
    `**Failed checks:** ${failures.length}`,
    `**Workflow run:** ${runUrl}`,
    '',
    details,
    '',
    'This issue was generated automatically. It will not be closed automatically; verify the fix and rerun Site Doctor.'
  ].join('\n');

  const search = new URLSearchParams({ q: `repo:${repository} is:issue is:open in:title "${title}"` });
  const searchResponse = await fetch(`${api}/search/issues?${search}`, { headers });
  if (!searchResponse.ok) throw new Error(`GitHub issue search failed: ${searchResponse.status} ${await searchResponse.text()}`);
  const searchData = await searchResponse.json();
  const existing = searchData.items?.[0];

  if (existing) {
    const commentResponse = await fetch(`${api}/repos/${repository}/issues/${existing.number}/comments`, {
      method: 'POST', headers, body: JSON.stringify({ body: `### Repeat detection — ${report.generatedAt}\n\n${body}` })
    });
    if (!commentResponse.ok) throw new Error(`Could not update issue #${existing.number}: ${commentResponse.status} ${await commentResponse.text()}`);
    console.log(`Updated existing issue #${existing.number} for ${tool}`);
  } else {
    const issueResponse = await fetch(`${api}/repos/${repository}/issues`, {
      method: 'POST', headers, body: JSON.stringify({ title, body })
    });
    if (!issueResponse.ok) throw new Error(`Could not create issue for ${tool}: ${issueResponse.status} ${await issueResponse.text()}`);
    const issue = await issueResponse.json();
    console.log(`Created issue #${issue.number}: ${issue.html_url}`);
  }
}
