module.exports = {
    apps: [
      {
        name: 'wattManager-frontend',
        exec_mode: 'cluster',
        instances: '1', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
		out_file: './logs/wattManager-frontend-out.log',
		error_file: './logs/wattManager-frontend-error.log'
      }
    ]
  }