module.exports = {
  apps: [
    {
      name: "mow-homepage",
      script: "npm",
      args: "start",
      cwd: "/var/www/Journal/homepage",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
      error_file: "/var/log/pm2/mow-homepage-error.log",
      out_file: "/var/log/pm2/mow-homepage-out.log",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
