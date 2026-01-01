module.exports = {
  apps: [{
    name: 'goal-setter',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/Journal/goal-setter',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    error_file: '/var/log/pm2/goal-setter-error.log',
    out_file: '/var/log/pm2/goal-setter-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
}
