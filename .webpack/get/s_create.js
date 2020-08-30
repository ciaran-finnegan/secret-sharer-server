var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
tenantId: 'ciaran',
applicationName: 'rest-api-app',
appUid: '000000000000000000',
tenantUid: '000000000000000000',
deploymentUid: 'undefined',
serviceName: 'secret-sharer',
stageName: 'dev',
pluginVersion: '3.2.5'})
const handlerWrapperArgs = { functionName: 'secret-sharer-dev-create', timeout: 6}
try {
  const userHandler = require('./create.js')
  module.exports.handler = serverlessSDK.handler(userHandler.main, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
