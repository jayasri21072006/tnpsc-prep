import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const processes = [];

function loadRootEnv() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        if (separator === -1) return [line.trim(), ''];

        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^(['"])(.*)\1$/, '$2');
        return [key, value];
      })
  );
}

const rootEnv = loadRootEnv();

function start(name, command, args, cwd = root, env = process.env) {
  const child = spawn(command, args, {
    cwd,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
    process.exitCode = 1;
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal === null) {
      console.error(`[${name}] stopped with exit code ${code ?? 'unknown'}`);
      process.exitCode = code ?? 1;
    }
  });

  processes.push(child);
}

// Use a project-local cache so Windows permissions on the shared uv cache do
// not prevent the development agent from starting.
start('agent', 'uv', ['run', 'python', 'src/agent.py', 'dev'], root, {
  ...process.env,
  UV_CACHE_DIR: path.join(root, '.uv-cache'),
});
start('frontend', 'npm', ['run', 'dev', '--prefix', 'frontend'], root, {
  ...rootEnv,
  ...process.env,
  AGENT_NAME: process.env.AGENT_NAME || rootEnv.AGENT_NAME || 'my-agent',
});

function stopAll() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});

console.log('JARVIS agent and frontend are starting.');
console.log('Frontend: http://localhost:3000');
