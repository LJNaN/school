/**
 * 防抖函数
 * @param {function} fn 待防抖的函数
 * @param {number} delay 防抖时间，最后一次操作后延迟多少秒后执行
 */
export function debounce(fn, delay = 1000) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * 节流函数
 * @param {function} fn 待节流函数
 * @param {number} delay 节流时间，该时间内只执行一次
 */
export function throttle(fn, delay = 1000) {
    let timer = null;
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    };
}

/**
 * echarts轮播效果
 * @param {object} myChart 待轮播的echarts
 * @param {object} option echarts配置项
 */
export function echartsRotation(myChart, option) {
    function rotation() {
        let currentIndex = -1;
        return setInterval(function () {
            var dataLen = option.series[0].data.length;
            // 取消之前高亮的图形
            myChart.dispatchAction({
                type: "downplay",
                seriesIndex: 0,
                dataIndex: currentIndex,
            });
            currentIndex = (currentIndex + 1) % dataLen;
            // 高亮当前图形
            myChart.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: currentIndex,
            });
            // 显示 tooltip
            myChart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: currentIndex,
            });
        }, 1000);
    }
    let timer = rotation()
    myChart.getZr().on(
        "mousemove",
        // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
        debounce(function (event) {
            if (!event.target && !timer) {
                timer = rotation();
            }
        })
    );
    myChart.on(
        "mousemove",
        throttle(function () {
            clearInterval(timer);
            timer = null;
        })
    );
}






