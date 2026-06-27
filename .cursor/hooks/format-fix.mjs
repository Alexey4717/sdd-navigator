/**
 * afterFileEdit hook: run prettier + eslint --fix on the edited file.
 * Fails open — if tools are absent or package.json missing, exits 0 silently.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  let filePath = '';
  try {
    const payload = JSON.parse(input || '{}');
    filePath = payload.path ?? payload.file_path ?? payload.filePath ?? '';
  } catch {
    process.exit(0);
  }

  if (!filePath) process.exit(0);

  // Fail open: no package.json → tooling not installed yet
  if (!existsSync('package.json')) process.exit(0);

  const hasTool = (cmd) => {
    try {
      execSync(`command -v ${cmd}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  };

  const pnpmAvail = hasTool('pnpm');

  if (pnpmAvail) {
    // Try prettier
    spawnSync(
      'pnpm',
      ['-s', 'exec', 'prettier', '--write', '--ignore-unknown', filePath],
      {
        stdio: 'ignore',
        timeout: 15000,
      },
    );
    // Try eslint --fix (only on .ts/.tsx/.js/.jsx)
    if (/\.(tsx?|jsx?)$/.test(filePath)) {
      spawnSync(
        'pnpm',
        [
          '-s',
          'exec',
          'eslint',
          '--fix',
          '--no-error-on-unmatched-pattern',
          filePath,
        ],
        {
          stdio: 'ignore',
          timeout: 15000,
        },
      );
    }
  }

  process.exit(0);
});
