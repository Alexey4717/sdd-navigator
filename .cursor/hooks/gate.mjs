/**
 * subagentStop hook: run pnpm typecheck + check-coverage after each subagent.
 * Fails open when package.json or pnpm are absent (project not scaffolded yet).
 * loop_limit: 1 in hooks.json prevents infinite loops.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  // Fail open: project not scaffolded yet
  if (!existsSync('package.json')) {
    process.exit(0);
  }

  // Fail open: pnpm not available
  const hasPnpm = (() => {
    try {
      execSync('pnpm --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();
  if (!hasPnpm) {
    process.exit(0);
  }

  const issues = [];

  const tc = spawnSync('pnpm', ['-s', 'typecheck'], {
    encoding: 'utf8',
    timeout: 60000,
  });
  if (tc.status !== 0) {
    issues.push('TypeScript errors:\n' + (tc.stdout || '') + (tc.stderr || ''));
  }

  const cc = spawnSync('pnpm', ['-s', 'check-coverage'], {
    encoding: 'utf8',
    timeout: 30000,
  });
  if (cc.status !== 0) {
    issues.push(
      'Coverage check failures:\n' + (cc.stdout || '') + (cc.stderr || ''),
    );
  }

  if (issues.length > 0) {
    const report = issues.join('\n\n---\n\n');
    console.log(
      JSON.stringify({
        followup_message: `Gate hook found issues that must be fixed before finishing:\n\n${report}\n\nPlease fix the above and re-verify.`,
      }),
    );
  }

  process.exit(0);
});
