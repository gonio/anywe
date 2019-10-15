import { getRandom } from '../../util/util';

// 方块的类型
const TYPE_MAP = {
    0: 'el-icon-eleme',
    1: 'el-icon-delete',
    2: 'el-icon-setting',
    3: 'el-icon-user',
    4: 'el-icon-phone-outline',
    5: 'el-icon-star-off',
    6: 'el-icon-goods',
    7: 'el-icon-help',
    8: 'el-icon-picture-outline-round',
    9: 'el-icon-bell'
};

// 方块的状态css类名
const STATUS_CLASS_MAP = {
    show: 'is-show', // 显示
    hide: 'is-hide', // 隐藏
    selected: 'is-show is-selected', // 选择
    destroy: 'is-hide is-destroying' // 销毁
};

// 图形，0代表没有格子，1代表有格子
const map1 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

// 每个格子类型的数量
const type = {
    0: 22,
    1: 22,
    2: 22,
    3: 22,
    4: 22,
    5: 22,
    6: 22,
    7: 22,
    8: 22,
    9: 22
};

/**
 * 初始化方块数据
 * @param {number} blockLimit
 * @param {object} blockShowMap 初始化方块数据
 * @param {number} col
 * @param {array} map
 * @returns {object}
 */
function initCoordinateData ({ blockLimit = 400, blockShowMap = {}, col = 20, map }) {
    let i = 0;
    if (_.isEmpty(blockShowMap)) {
        for (let key = 0; key < blockLimit; key++) {
            if (key % col === 0 && key !== 0) {
                i++;
            }
            blockShowMap[i] = blockShowMap[i] || [];
            blockShowMap[i].push({ isShown: map[key], type: showType(map[key]) });
        }
    }
    return blockShowMap;
}

export {
    initCoordinateData,
    map1,
    type,
    TYPE_MAP,
    STATUS_CLASS_MAP
};


/**
 * 获取随机方块类型
 * @returns {number}
 */
function getType () {
    const random = getRandom();
    if (type[random] < 1) {
        return getExistType(random);
    }
    type[random]--;
    return random;
}

/**
 * 根据当前的随机数，寻找其右边、左边的还剩下的方块类型
 * @param {number} random        随机数
 * @returns         {number}
 */
function getExistType (random = 0) {
    const typeNum = 10;

    // 先寻找右边的还存在的类型
    for (; random < typeNum; random++) {
        if (type[random] > 0) {
            type[random]--;
            return random;
        }
    }

    // 在寻找其左边的还存在的类型
    for (let i = 0; i < random; i++) {
        if (type[i] > 0) {
            type[i]--;
            return i;
        }
    }
    return -1;
}

/**
 * 显示类型的计算
 * @param {number} isShow       1为显示，0为隐藏
 * @returns {number}
 */
function showType (isShow) {
    if (isShow === 1) {
        return getType();
    }
    return -1;
}
