'use strict';

var AWS = require("aws-sdk");
var moment = require('moment');
var dynamo = new AWS.DynamoDB();

const sendMessageToClient = (url, connectionId, payload) => new Promise((resolve, reject) => {
  const apiGateway = new AWS.ApiGatewayManagementApi({apiVersion: '2029', endpoint: url});
  apiGateway.postToConnection({
    ConnectionId: connectionId, // connectionId of the receiving ws-client
    Data: JSON.stringify(payload),
  }, (err, data) => {
    if (err) {
      console.log('err is', err);
      reject(err);
    }
    resolve(data);
  });
});

module.exports.connect = async (event, context) => {
  const {
    connectionId
  } = event.requestContext;
  const params = {
    TableName: process.env.TABLE_SESSIONS,
    Item: {
      connectionId: {
        S: event.requestContext.connectionId
      },
      connectedAt: {
        S: moment().format()
      }
    }
  };

  await dynamo.putItem(params).promise();

  return {
    statusCode: 200,
  };
};

module.exports.message = async (event, context) => {
  const {
    domainName,
    stage,
    connectionId: srcConnectionId
  } = event.requestContext;
  const url = `https://${domainName}/${stage}`;
  const body = event.body;

  const params = {
    TableName: process.env.TABLE_SESSIONS,
    ProjectionExpression: 'connectionId',
  };
  const data = await dynamo.scan(params).promise();

  console.log(data);

  await Promise.all(data.Items.map(({ connectionId }) => {
    if (connectionId.S !== srcConnectionId) {
      return sendMessageToClient(url, connectionId.S, body);
    }
    return Promise.resolve();
  }));

  return {
    statusCode: 200,
  };
}

module.exports.disconnect = async (event) => {
  const {
    connectionId
  } = event.requestContext;
  const params = {
    TableName: process.env.TABLE_SESSIONS,
    Key: {
      connectionId: {
        S: event.requestContext.connectionId
      }
    }
  };

  await dynamo.deleteItem(params).promise();

  console.log(`disconnected ${event.requestContext.connectionId}`);

  return {
    statusCode: 200,
  };
};
