module.exports = {
  apps : [{
      name      : 'dev-candidate',
      script    : 'server/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ],

  deploy : {
    production : {
      user : 'rakesh',
      host : 'portal.hirehumanly.com',
      ref  : 'origin/bciar',
      repo : 'git@user-survey:HireHumanly/user-survey.git',
      ssh_options: 'ForwardAgent=yes',
      path : '/home/rakesh/dev-candidate',
      'post-deploy' : 'yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production'
    },
    dev : {
      user : 'rakesh',
      host : 'portal.hirehumanly.com',
      ref  : 'origin/bciar',
      repo : 'git@user-survey:HireHumanly/user-survey.git',
      ssh_options: 'ForwardAgent=yes',
      path : '/home/rakesh/dev-candidate',
      'post-deploy' : 'yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};

