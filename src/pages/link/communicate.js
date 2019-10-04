/**
 * 和服务端通信模块
 */

export class Communicate {
    constructor ({ data, vm }) {
        this.init({
            data,
            vm
        });
    }

    /**
     * 初始化
     * @param {object} isRoomOwner
     * @param {object} vm
     */
    init ({ data, vm }) {
        this.ws = new WebSocket(`ws://${window.location.hostname}:3000/ws/link`);
        const { ws } = this;

        this.isRoomOwner = data.isRoomOwner;
        this.roomID = data.roomID;

        ws.onopen = function () {
            ws.send(JSON.stringify(data));
        };

        ws.onmessage = function (evt) {
            let data = {};
            try {
                data = JSON.parse(evt.data);
            } catch (e) {

                // nothing
            }
            if (!data.success) {
                vm.$alert(data.msg || '与服务器通讯失败！');
                return null;
            }
            data = data.data;
            switch (data.type) {
                case 'start':
                    vm.startGame();
                    break;

                case 'update':
                    vm.$store.dispatch('link/updatePlayersInfo', data.players);
                    break;

                case 'gameOver':
                    vm.gameOver();
                    break;

                case 'win':
                    vm.win();
                    break;

                case 'quit':
                    vm.onclickQuit();
                    break;

                default:
                    vm.$store.dispatch('link/updatePlayersInfo', data.players);
                    vm.$store.dispatch('link/updateRoomInfo', data.info);
                    break;
            }
        };

        ws.onclose = function () {
            window.console.log('连接已关闭...');
        };
    }

    send (data) {
        this.ws.send(JSON.stringify(data));
    }

    close () {
        this.ws.close();
    }
}
