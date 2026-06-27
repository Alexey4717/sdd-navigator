/**
 * beforeShellExecution hook: block reads of secret files and destructive git commands.
 * failClosed: true in hooks.json — so this script MUST exit 0 with valid JSON always.
 */
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  let command = '';
  try {
    const payload = JSON.parse(input || '{}');
    command = payload.command ?? '';
  } catch {
    // Parse failure → allow (fail open for bad input)
    console.log(JSON.stringify({ permission: 'allow' }));
    process.exit(0);
  }

  // Secret / config file patterns the user forbids reading
  const secretPatterns = [
    /(?:^|[\s"'`])\.env(?:\s|$|["'`])/, // .env (standalone)
    /(?:^|[\s"'`])dev\.env(?:\s|$|["'`])/, // dev.env
    /(?:^|[\s"'`])config\.json(?:\s|$|["'`])/, // config.json
    /\w+\.example\.\w+/, // *.example.*
    /dev\.example\./,
  ];

  // Destructive git commands
  const destructiveGit = [
    /git\s+push\s+.*--force/,
    /git\s+push\s+.*-f\b/,
    /git\s+reset\s+--hard/,
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(command)) {
      console.log(
        JSON.stringify({
          permission: 'ask',
          user_message: `Command references a protected file (${command.match(pattern)?.[0]}). Review before proceeding.`,
          agent_message:
            'Hook guard: command reads a secret/config file that is off-limits per project rules.',
        }),
      );
      process.exit(0);
    }
  }

  for (const pattern of destructiveGit) {
    if (pattern.test(command)) {
      console.log(
        JSON.stringify({
          permission: 'ask',
          user_message: `Destructive git command detected: "${command}". Confirm before executing.`,
          agent_message:
            'Hook guard: destructive git operation requires explicit user approval.',
        }),
      );
      process.exit(0);
    }
  }

  console.log(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
});
