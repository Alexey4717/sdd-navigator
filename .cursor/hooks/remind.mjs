/**
 * stop hook: remind the agent to update dev-log and run pnpm verify before committing.
 */
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  console.log(
    JSON.stringify({
      additional_context:
        'REMINDER before finishing this session:\n' +
        '1. Append an entry to docs/dev-log.md: topic, prompt summary, what was accepted/rejected, start/end time.\n' +
        '2. Run `pnpm verify` (typecheck + lint + test + check-coverage + build) and ensure it exits 0.\n' +
        '3. Commit with format: type(scope): message [SCD-XXX-NNN].\n' +
        'Do NOT commit if pnpm verify is red.',
    }),
  );
  process.exit(0);
});
