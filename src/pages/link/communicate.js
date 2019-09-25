/**
 * 和服务端通信模块
 */

const SEND_TYPE = {
    create: 0, // 创建房间
    join: 1, // 加入房间
};

export class Communicate {
    constructor({ isRoomOwner, store }) {
        this.init({ isRoomOwner, store });
    }

    /**
     * 初始化
     * @param isRoomOwner
     * @param store
     */
    init({ isRoomOwner, store }) {
        this.isRoomOwner = isRoomOwner;
        this.store = store;
        this.ws = new WebSocket('ws://localhost:3000/ws/link');
        const { ws } = this;

        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send(JSON.stringify({
                isRoomOwner,
                type: isRoomOwner ? SEND_TYPE.create : SEND_TYPE.join,
            }));
        };

        ws.onmessage = function (evt) {
            window.console.log(evt);

            store.dispatch(evt.data);
        };

        ws.onclose = function () {
            // 关闭 websocket
            window.console.log('连接已关闭...');
        };
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }
}
