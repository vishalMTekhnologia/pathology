module.exports = {
  apps: [
    {
      name: "thumbnail-worker",
      script: "rabbitmq/worker.js",
      exec_mode: "cluster", // Required for clustering
      instances: "max", // Or specify a number like 2, 4
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
