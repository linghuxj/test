module.exports = {
  apps: [
    {
      name: "test1",
      script: "pnpm",
      args: "start --port 3010",
      env: {
        port: 3010,
        NODE_ENV: "production",
      },
      watch: false,
      log_file: "logs/test1.log",
    },
  ],
};
