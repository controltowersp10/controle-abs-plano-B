const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'controle-abs',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

