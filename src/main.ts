import {Client,connect} from "mqtt";

let rpcReqId = 0;

export default class ViraLink {
  client: Client;

  constructor(token: string) {
    this.client = connect('mqtt://console.viralink.io', {
      username: token
    });

    this.client.on('connect', () => {
      // console.log('connected');
      this.client.subscribe([
        'v1/devices/me/rpc/request/+',
        'v1/devices/me/rpc/response/+',
        'v1/devices/me/attributes',
        'v1/devices/me/attributes/response/+',
      ]);
    });

    this.client.on('message', (topic: string, message: string) => {
      // console.log('request.topic: ' + topic);
      // console.log('request.body: ' + message.toString());
      if (topic.includes('v1/devices/me/rpc')) {
        const requestId = topic.slice('v1/devices/me/rpc/request/'.length);
        if (topic.includes('v1/devices/me/rpc/request'))
          this.client.publish('v1/devices/me/rpc/response/' + requestId, message);
        // } else if (topic.includes('v1/devices/me/rpc/response')) {
        //
        // }
      } /*else if (topic.includes('v1/devices/me/attributes')) {
                const requestId = topic.slice('v1/devices/me/attributes'.length);
                if (topic.includes('v1/devices/me/attributes/response/')) {

                } else if (topic.includes('v1/devices/me/attributes')) {

                }
            }*/
    });
  };

  public sendTelemetry(payload: string): void {
    this.client.publish('v1/devices/me/telemetry', payload);
  };

  public sendAttributes(payload: string) {
    this.client.publish('v1/devices/me/attributes', payload);
  };

  public sendRPC(payload: string) {
    this.client.publish('v1/devices/me/rpc/request/' + rpcReqId++, payload);
  };
}
