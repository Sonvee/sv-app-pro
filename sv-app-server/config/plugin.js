/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },
  fullQiniu: {
    enable: true,
    package: 'egg-full-qiniu'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  }
}
