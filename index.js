$(function() {
    $("#calendar").calendar({
        /*
         * 传入今天的时间
         * 默认：客户端时间
         * 可传入一个服务器的时间
         */
        date: new Date(),
        width: 800,
        height: 400,
        /* 左右框显示的比例 */
        rate: 0.69,
        /*
         * 休假和加班设置
         * JSON格式：Y加年-M加月-D加日
         * 0表示休假 1表示加吧
         */
        configDay: {
            "Y2016": {
                "M10": {
                    "D1": 0,
                    "D2": 0,
                    "D3": 0,
                    "D4": 1,
                    "D5": 1
                }
            }
        }
    });
});
