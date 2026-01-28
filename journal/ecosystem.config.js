module.exports = {
  apps: [
    {
      name: 'journal',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/journal',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
