module.exports = {
  apps: [{
    name: 'time-views',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/Journal/time-views',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3004,
    },
    error_file: '/var/log/pm2/time-views-error.log',
    out_file: '/var/log/pm2/time-views-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
}
