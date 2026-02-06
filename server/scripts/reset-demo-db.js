const { spawnSync } = require('child_process');

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const error = new Error(`${command} ${args.join(' ')} failed`);
    error.code = result.status;
    throw error;
  }
}

function main() {
  if (process.env.ALLOW_DB_RESET !== 'true') {
    console.error(
      'Refusing to reset DB. Set ALLOW_DB_RESET=true to enable this command.'
    );
    process.exit(1);
  }

  run('yarn', ['db:reset']);
}

main();
