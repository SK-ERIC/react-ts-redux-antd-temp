import ReconnectingWebSocket, { Message } from 'reconnecting-websocket';

export default class SocketHelper {
  private retryMessageList: Message[] = [];
  private socket: ReconnectingWebSocket;
  private static socketHelper: SocketHelper;
  private reciveMessageEvent: { [key: string]: { callback: Function; errCallback: Function } } = {};
  private timeout: number = 3000;
  private reconnectNum = 10;
  private timeoutObj: NodeJS.Timeout | null = null;

  private getConfig() {
    if (process.env.NODE_ENV === 'development') {
      return { domain: 'ws://127.0.0.1:8080', path: '/test/' };
    } else {
      return { domain: 'ws://test.com', path: '/test/' };
    }
  }

  //! 客户端发送 n 次心跳包服务端均未回复才判定为失去连接，所以这时需要加上计数来判断。
  private heartCheck(ws: ReconnectingWebSocket) {
    let _num = this.reconnectNum;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      if (ws.readyState === 3) {
        return;
      }
      ws.send('ping'); // 心跳包
      _num--;
      // 计算答复的超时次数
      if (_num === 0) {
        ws.close();
      }
    }, this.timeout);
  }

  private constructor() {
    const config = this.getConfig();
    let url = config.domain + config.path;
    this.socket = new ReconnectingWebSocket(url, [], {
      debug: false,
      maxRetries: 10,
    });

    this.socket.addEventListener('open', () => {
      if (!this.socket) return;
      if (this.socket.readyState === 1) {
        this.heartCheck(this.socket); // 心跳
        this.socket.addEventListener('message', (e) => {
          if (e.data && e.data === 'pong') {
            this.heartCheck(this.socket); // 心跳
          } else if (e.data && e.data !== 'success') {
            try {
              const json = JSON.parse(e.data);
              console.debug('ws recive data:', json);
              if (Object.prototype.hasOwnProperty.call(this.reciveMessageEvent, json.event)) {
                const cb = this.reciveMessageEvent[json.event];
                if (json.status === 1) {
                  cb.callback(json);
                } else {
                  console.error('ws 返回失败>>', e.data);
                  cb.errCallback('');
                }
              } else {
                console.warn('websocket 返回消息未注册处理方法', json);
              }
            } catch (e) {
              console.error('websocket 返回消息，json解析异常,', e);
            }
          }
        });
      }
      if (this.retryMessageList.length > 0) {
        for (const msg of this.retryMessageList) {
          this.send(msg, true);
        }
      }
    });

    // 错误时进行的处理
    this.socket.addEventListener('error', (e) => {
      console.error(e.message);
    });
    // 关闭时进行的操作
    this.socket.addEventListener('close', () => {
      console.warn('asset ws service disconnected.');
    });

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = () => {
      this.socket.close();
    };
  }

  public static getInstance() {
    if (this.socketHelper === null) {
      this.socketHelper = new SocketHelper();
    }
    return this.socketHelper;
  }

  public receive = (event: string, callback: Function, errCallback: Function) => {
    this.reciveMessageEvent[event] = {
      callback,
      errCallback,
    };
  };

  public send = (data: Message, needPop?: boolean): void => {
    if (!this.socket) {
      console.error('socket还没有初始化，无法调用');
      return;
    }
    if (this.socket.readyState === 1) {
      try {
        const string = JSON.stringify(data);
        this.socket.send(string);
      } catch (error) {
        console.log('json stringify error >>', error);
      }
      if (true === needPop) {
        this.retryMessageList.shift();
      }
    } else {
      this.retryMessageList.push(data);
    }
  };

  public disconnect = () => {
    if (this.socket) {
      this.socket.close(1000);
    }
  };
}
