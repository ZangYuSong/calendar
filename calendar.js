(function () {
    var calendar = {
        /**
        * 农历1900-2100的闰大小信息表
        * 例如：0x04bd8 相当于 0000 0100 1011 1101 1000      19位 --->  0位
        * 第0-3位代表 是否是闰月，如果全为0代表不闰月，否则代表闰月的月份。
        * 第15-4位代表从1月到12月是大月还是小月，大月30天，小月29天。
        * 后4位代表的是闰月是大月还是小月 0为小1为大。
        * 2033年的数据网上流传的是0x04bd7 其实应该是0x04afb
        */
        lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
            0x0d520 //2100
        ],
        /**
        * 公历每个月份的天数普通表
        */
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        /**
        * 天干地支之天干速查表
        */
        Gan: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        /**
        * 天干地支之地支速查表
        */
        Zhi: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
        /*
        * 计算天干地支季月使用
        * "甲": [2, 2]  表示 甲年的第一个月(立春)是丙寅月
        */
        monthTD: {
            "甲": [2, 2], "乙": [4, 2], "丙": [6, 2], "丁": [8, 2], "戊": [0, 2], "己": [2, 2], "庚": [4, 2], "辛": [6, 2], "壬": [8, 2], "癸": [0, 2]
        },
        /**
        * 生肖
        */
        Animals: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
        /**
        * 24节气速查表
        */
        solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
            "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪",
            "大雪", "冬至"
        ],
        /**
        * 24节气速查表,每种节气的计算数据
        */
        sTermInfo: [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693,
            263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758
        ],
        /**
        * 日期转农历称呼速查表
        */
        lunarDayStrFirst: ['初', '十', '廿', '卅'],
        lunarDayStrLast: ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
        /**
        * 星期称呼速查表
        */
        Week: ["一", "二", "三", "四", "五", "六", "日"],
        /**
        * 月份转农历称呼速查表
        */
        lunarMonthStr: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"],
        /**
        * 农历节日
        */
        lunarFestival: {
            "1-1": "春节",
            "1-15": "元宵节",
            "5-5": "端午节",
            "7-7": "乞巧节",
            "8-15": "中秋节",
            "9-9": "重阳节",
            "12-8": "腊八节",
            "12-24": "小年" // 有的是23小年 有的算24小年
        },
        /**
        * 公历节日
        */
        gregorianFestival: {
            "1-1": "元旦",
            "3-8": "妇女节",
            "3-12": "植树节",
            "5-1": "劳动节",
            "5-4": "青年节",
            "6-1": "儿童节",
            "7-1": "建党节",
            "8-1": "建军节",
            "9-10": "教师节",
            "10-1": "国庆节"
        },
        /*
        * 返回农历Y年的天数、闰月信息和每个月的信息
        */
        getLunarYearDays: function (Y) {
            var sum = 348;
            var lunarMonth = new Array();
            var leapMonth = [0, 0];
            var flag = 0;
            var temp = 0x8000
            for (i = 0; i < 12; i += 1) {
                flag = (calendar.lunarInfo[Y - 1900] & temp) ? 1 : 0;
                lunarMonth[i] = flag;
                sum += flag;
                temp >>= 1
            }
            leapMonth = calendar.getLunarMonth(Y);
            sum += leapMonth[1];
            return {
                sum: sum,
                leapMonth: leapMonth,
                lunarMonth: lunarMonth
            };
        },
        /*
        * 判断今年是否有闰月  闰月是大月还是小月
        */
        getLunarMonth: function (Y) {
            if (calendar.lunarInfo[Y - 1900] & 0xf) {
                return [calendar.lunarInfo[Y - 1900] & 0xf, (calendar.lunarInfo[Y - 1900] & 0x10000) ? 30 : 29];
            }
            return [0, 0];
        },
        /*
        * 获取1900(1900-01-31)年春节到的Y-M-D的阳历日期
        */
        gregorianCalendar: function (Y, M, D) {
            var sum = 0;
            for (var i = 1900; i < Y; i += 1) {
                if (i % 400 == 0 || (i % 100 != 0 && i % 4 == 0)) sum += 366;
                else sum += 365;
            }
            for (var i = 0; i < M - 1; i += 1) sum += calendar.solarMonth[i];
            if ((M > 2) && (Y % 400 == 0 || (Y % 100 != 0 && Y % 4 == 0))) sum += 1;
            sum += D - 1;
            return sum - 30;
        },
        /*
        * 获取1900年春节到的Y的阴历日期
        */
        lunarCalendar: function (Y, M, D) {
            var sum = 0;
            var temp = null;
            for (var i = 1900; i < Y; i += 1) {
                temp = calendar.getLunarYearDays(i);
                sum += temp.sum;
            }
            temp = calendar.getLunarYearDays(Y);
            for (var i = 0; i < M - 1; i++) sum += temp.lunarMonth[i] == 0 ? 29 : 30;
            if (temp.leapMonth[0] < M) sum += temp.leapMonth[1];
            sum += D - 1;
            return sum;
        },
        /*
        * 将阳历转换为阴历
        */
        calendarConvert: function (Y, M, D) {
            var num = calendar.lunarCalendar(Y, M, D) - calendar.gregorianCalendar(Y, M, D);
            var demo = calendar.getLunarYearDays(Y);
            var result = 0;
            if (D > num) return [0, Y, M, (D - num)];
            M -= 1;
            if (M == 0) {
                M = 12; Y -= 1;
                demo = calendar.getLunarYearDays(Y);
            }
            if (M == demo.leapMonth[0]) result = 1;
            if (D == num) return [result, Y, M, demo.lunarMonth[M - 1] == 0 ? 29 : 30];
            if (num > D) num -= D;
            while (true) {
                var temp = 0;
                if (demo.leapMonth[0] == M && result == 1) {
                    temp = demo.leapMonth[1];
                } else {
                    temp = demo.lunarMonth[M - 1] == 0 ? 29 : 30;
                }
                if (temp > num) { num = temp - num; break; }
                num -= temp;
                if (num == 0) {
                    if (demo.leapMonth[0] == M && result == 1) {
                        num = demo.lunarMonth[M - 1] == 0 ? 29 : 30;
                        result = 0;
                    } else {
                        M -= 1;
                        if (M == 0) {
                            M = 12; Y -= 1;
                            demo = calendar.getLunarYearDays(Y);
                        }
                        if (demo.leapMonth[0] == M) {
                            result = 1;
                            num = demo.leapMonth[1];
                        }
                        else {
                            num = demo.lunarMonth[M - 1] == 0 ? 29 : 30;
                        }
                    }
                    break;
                }
                if (demo.leapMonth[0] == M && result == 1) result = 0;
                else {
                    M -= 1;
                    if (M == 0) {
                        Y -= 1;
                        M = 12;
                        demo = calendar.getLunarYearDays(Y);
                    }
                    if (demo.leapMonth[0] == M) result = 1;
                }
            }
            return [result, Y, M, num];
        }
    };

    /* 保存今天的日期 */
    var ToDay = null;
    /* 保存点击的日期 */
    var ClickDays = 0;
    /* 休假和上班自定义配置信息 */
    var configDay = {};
    /* 本月信息 */
    var configDayM = {};
    var isclick = false;
    /*************************主程序******************************/
    $.fn.calendar = function (options) {
        var e = this;
        var defaults = {
            date: new Date(),
            width: 800,
            height: 400,
            rate: 0.7,
            week: false,
            week_walue: "2016/9/17",
            isclick: false,
            configDay: {}
        };
        var object = $.extend(true, {}, defaults, options);
        ToDay = object.date;
        isclick = object.isclick;
        configDay = object.configDay;
        createTable(object, e);
    };
    /*************************主程序******************************/

    function createTable(options, e) {
        var Y = options.date.getFullYear();
        var M = options.date.getMonth() + 1;
        /* 拷贝configDay对应本月的设置信息 */
        setconfigDayM(Y, M);
        ClickDays = options.date.getDate();
        /* 创建时间表格 */
        var datetable = new DateTable(Y, M, e);
        datetable.create();
        /* 设置样式 */
        setLayer(options, datetable.count);
        /* 设置触发事件 */
        btnClick(options, e, datetable.count);
        /* 设置单双休 */
        if (options.week) {
            setconfigDay(options, datetable.count, setWeek(options));
        }
        setconfigDay(options, datetable.count, configDayM);
        $("#SY").val(Y);
        $("#SM").val(M);
    }

    /* 拷贝configDay对应本月的设置信息 */
    function setconfigDayM(Y, M) {
        if (configDay["Y" + Y] && configDay["Y" + Y]["M" + M]) configDayM = $.extend(true, {}, configDay["Y" + Y]["M" + M]);
        else configDayM = {};
    }

    /* 设置单双休 */
    function setWeek(options) {
        var Y = options.date.getFullYear();
        var M = options.date.getMonth() + 1;
        var temp = new Date(Y + "/" + M + "/1").getDay();
        var D = 7 - (temp == 0 ? 7 : temp)
        if (D == 0) D = 7;
        var _configDayM = "{"
        var alldays = calendar.solarMonth[M - 1];
        if ((M == 2) && (Y % 400 == 0 || (Y % 100 != 0 && Y % 4 == 0))) alldays += 1;
        var week = 0;
        while (alldays >= D) {
            week = parseInt((new Date(Y + "/" + M + "/" + D) - new Date(options.week_walue)) / (3600 * 24 * 1000 * 7));
            if (week != 0 && week % 2 != 0) _configDayM += "\"D" + D + "\":\"1\",";
            D += 7;
        }
        _configDayM = _configDayM.substring(0, _configDayM.length - 1) + "}";
        return JSON.parse(_configDayM);
    }

    /* 设置加班休假日期 */
    function setconfigDay(options, count, _configDayM) {
        var width = options.width;
        var height = options.height;
        var Y = options.date.getFullYear();
        var M = options.date.getMonth() + 1;
        var D = "0";
        if (_configDayM) {
            $.each(_configDayM, function (k, v) {
                D = k.split("D")[1];
                var temp = $("#days" + D).find(".xbgj");
                if (temp.length > 0) {
                    $("#days" + D).find(".xbgj").remove();
                }
                if (v == 0) {
                    $("#days" + D).append("<div class=\"xbgj\" xbgj=\"0\" style=\"position: absolute;\"><div class=\"rest\" style=\"top:" +
            -parseInt((height - 16) / (count + 1) - 2) + "px;background-color: #53a253\">休</div></div>");
                }
                if (v == 1) {
                    $("#days" + D).append("<div class=\"xbgj\" xbgj=\"1\" style=\"position: absolute;\"><div class=\"rest\" style=\"top:" +
            -parseInt((height - 16) / (count + 1) - 2) + "px;background-color: #e15e5e\">班</div></div>");
                }
            });
        }
    }

    /* 定义创建时间表格函数 */
    var DateTable = function (Y, M, e) {
        var temp = null;
        this.Y = Y;
        this.M = M;
        this.e = e;
        temp = new Date(Y + "/" + M + "/1").getDay();
        this.W = (temp == 0 ? 7 : temp);
        this.days = this.monthDays();
        temp = this.days + this.W - 1;
        this.count = temp % 7 == 0 ? parseInt(temp / 7) : parseInt(temp / 7) + 1;
        this.html = "";
    };

    /* 创建表格 */
    DateTable.prototype.create = function () {
        this.html = "<div class=\"calendar\">";
        this.html += "<div class=\"leftArea\">";
        this.leftHead();
        this.leftWeek();
        this.leftDay();
        this.html += "</div>";
        this.html += "<div class=\"rightArea\">";
        this.html += "</div>";
        this.html += "</div>";
        this.e.append(this.html);
        this.lunarDay();
        rightArea(this.Y, this.M);
    };

    /* 获取本月多少天 */
    DateTable.prototype.monthDays = function () {
        if ((this.M == 2) && (this.Y % 400 == 0 || (this.Y % 100 != 0 && this.Y % 4 == 0))) return 29;
        else return calendar.solarMonth[this.M - 1];
    }

    /* 获取左边区域的头部 */
    DateTable.prototype.leftHead = function () {
        this.html += "<div class=\"head\">";
        this.html += "<div id=\"YL\" class=\"btn\"><</div>";
        this.html += "<select id=\"SY\">"
        for (var i = 1900; i < 2101; i++) this.html += "<option value=\"" + i + "\">" + i + "</option>";
        this.html += "</select>";
        this.html += "<div id=\"YR\" class=\"btn\">></div><div class=\"text\">年</div>";
        this.html += "<div id=\"ML\" class=\"btn\"><</div>";
        this.html += "<select id=\"SM\">"
        for (var i = 1; i < 13; i++) this.html += "<option value=\"" + i + "\">" + i + "</option>";
        this.html += "</select>"
        this.html += "<div id=\"MR\" class=\"btn\">></div><div class=\"text\">月</div>";
        this.html += "<input type=\"button\"  id=\"ReturnBtn\" value=\"返回今天\" class=\"btnreturn\"/>";
        this.html += "<div class=\"text\" style=\"margin-left:20px;\">" + this.Y + "年" + this.M + "月</div>";
        this.html += "</div>";
    };

    /* 获取左边区域的星期名称 */
    DateTable.prototype.leftWeek = function () {
        for (i = 0; i < 7; i++) this.html += "<div class=\"week\">" + calendar.Week[i] + "</div>";
    };

    /* 获取本月天数 */
    DateTable.prototype.leftDay = function () {
        var day = 0;
        var W = this.W;
        var color = "";
        for (i = 0; i < this.count * 7; i += 1) {
            if (i < this.W - 1 || i >= this.days + this.W - 1) this.html += "<div class=\"days1\"></div>";
            else {
                day = i + 2 - this.W;
                if (W == 6 || W == 7) color = "red";
                else color = "#006db7";
                this.html += "<div class=\"days\" id=\"days" + day + "\"><div id=\"num" + day +
                    "\" class=\"num\" style=\"color:" + color + ";\">" +
                    (day > 9 ? day : ("0" + day)) + "</div><div class=\"lunar\" id=\"lunar" +
                    day + "\"></div></div>";
                W += 1;
                if (W == 8) W = 1;
            }
        }
    };

    function sTerm(y, n) {
        var offDate = new Date((31556925974.7 * (y - 1900) + calendar.sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return (offDate.getUTCDate());
    }

    /* 获取对应的阴历日期 */
    DateTable.prototype.lunarDay = function () {
        var lunar = calendar.calendarConvert(this.Y, this.M, 1);
        var info = calendar.getLunarYearDays(lunar[1]);
        var temp = "";
        var flag = 0;
        var solarTerms = "";
        var tm = this.M - 1;
        // 本月对应节气的日期
        var tmp1 = sTerm(this.Y, tm * 2) - 1;
        var tmp2 = sTerm(this.Y, tm * 2 + 1) - 1;
        for (var i = 0; i < this.days; i += 1) {
            solarTerms = "";
            // 对应的农历日期
            if (lunar[3] === 1) {
                temp = calendar.lunarMonthStr[lunar[2] - 1] + "月";
                if (lunar[0] === 1) temp = "闰" + temp;
            } else if (lunar[3] == 10) { temp = "初十"; }
            else { temp = calendar.lunarDayStrFirst[parseInt(lunar[3] / 10)] + calendar.lunarDayStrLast[lunar[3] % 10] }
            // 判断今天时候是对应节气的日期
            if (tmp1 == i) solarTerms = calendar.solarTerm[tm * 2];
            if (tmp2 == i) solarTerms = calendar.solarTerm[tm * 2 + 1];
            // 显示  有限级别  节日/节气/农历
            temp = calendar.lunarFestival[lunar[2] + "-" + lunar[3]] || calendar.gregorianFestival[this.M + "-" + (i + 1)] || solarTerms || temp;
            $("#lunar" + (i + 1)).append(temp);
            // 设置不同的显示字体颜色
            if (calendar.lunarFestival[lunar[2] + "-" + lunar[3]] || calendar.gregorianFestival[this.M + "-" + (i + 1)]) {
                $("#lunar" + (i + 1)).css("color", "red");
            } else if (solarTerms !== "") {
                $("#lunar" + (i + 1)).css("color", "green");
            }
            // 计算下个日期的农历
            if (info.leapMonth[0] === lunar[2] && lunar[0] == 1) { flag = info.leapMonth[1]; }
            else flag = info.lunarMonth[lunar[2] - 1] === 0 ? 29 : 30;
            if (lunar[3] + 1 > flag) {
                lunar[3] = 1;
                if (lunar[2] !== info.leapMonth[0]) {
                    if (lunar[2] + 1 > 12) {
                        lunar[1] += 1;
                        lunar[2] = 1;
                        info = calendar.getLunarYearDays(lunar[1]);
                    } else lunar[2] += 1;
                }
                else {
                    if (lunar[0] === 1) {
                        if (lunar[2] + 1 > 12) {
                            lunar[1] += 1;
                            lunar[2] = 1;
                            info = calendar.getLunarYearDays(lunar[1]);
                        } else {
                            lunar[2] += 1;
                            lunar[0] = 0;
                        }
                    }
                    else { lunar[0] = 1; }
                }
            } else { lunar[3] += 1; }
        }
    };

    // 生成右边区域代码
    function rightArea(Y, M) {
        var html = "";
        var W = new Date(Y + "/" + M + "/" + ClickDays).getDay();
        W = W == 0 ? 7 : W;
        html += "<div class=\"ui\">" + Y + "年" + (M > 9 ? M : "0" + M) + "月" + (ClickDays > 9 ? ClickDays : "0" + ClickDays) + "日 星期"
            + calendar.Week[W - 1] + "</div>";
        html += "<div class=\"ud\">" + (ClickDays > 9 ? ClickDays : "0" + ClickDays) + "</div>";
        var lunar = calendar.calendarConvert(Y, M, ClickDays);
        var temp = "";
        temp += calendar.lunarMonthStr[lunar[2] - 1] + " 月 ";
        if (lunar[0] == 1) temp = "闰 " + temp;
        if (lunar[3] == 10) {
            temp += "初 十";
        } else {
            temp += calendar.lunarDayStrFirst[parseInt(lunar[3] / 10)] + " " + calendar.lunarDayStrLast[lunar[3] % 10]
        }
        html += "<div class=\"uld\">" + temp + "</div>";
        html += getLunrYMD(lunar, Y, M);
        html += getJR(lunar, Y, M);
        if (isclick) {
            html += "<input type=\"button\" style=\"width:100%;\" value=\"保  存\" class=\"saveChange\" />";
            html += "<input type=\"button\" style=\"width:100%;\" value=\"重  置\" class=\"resetData\" />";
        }
        $(".rightArea").empty();
        $(".rightArea").append(html);
        if (lunar[2] == 1 && lunar[3] == 1) {
            $(".calendar").css("border", "2px solid #f44f23");
            $(".rightArea").css("background-color", "#f44f23");
        } else {
            $(".calendar").css("border", "2px solid #8ec59b");
            $(".rightArea").css("background-color", "#e0f3e8");
        }
        if (isclick) getPushClick(Y, M);
    };

    // 保存和重置按钮
    function getPushClick(Y, M) {
        $(".resetData").click(function () {
            $(".xbgj").remove();
            configDayM = {};
        });
        $(".saveChange").click(function () {
            var html = "";
            if (saveConfig(Y, M, configDayM)) {
                if (configDay["Y" + Y]) {
                    configDay["Y" + Y]["M" + M] = $.extend(true, {}, configDayM);
                }
                else {
                    configDay["Y" + Y] = {};
                    configDay["Y" + Y]["M" + M] = $.extend(true, {}, configDayM);
                }
            }
        });
    }

    // 获取今天的节日信息
    function getJR(lunar, Y, M) {
        var temp = 0;
        var html = "<div class=\"djr\"><span class=\"title\">节日</span><span class=\"content\">";
        if (calendar.lunarFestival[lunar[2] + "-" + lunar[3]]) {
            html += calendar.lunarFestival[lunar[2] + "-" + lunar[3]] + " ";
            temp = 1;
        }
        if (calendar.gregorianFestival[M + "-" + ClickDays]) {
            html += calendar.gregorianFestival[M + "-" + ClickDays] + " ";
            temp = 1;
        }
        var solarTerms = "";
        var tm = M - 1;
        var tmp1 = sTerm(Y, tm * 2);
        var tmp2 = sTerm(Y, tm * 2 + 1);
        if (tmp1 == ClickDays) solarTerms = calendar.solarTerm[tm * 2];
        if (tmp2 == ClickDays) solarTerms = calendar.solarTerm[tm * 2 + 1];
        if (solarTerms != "") {
            html += solarTerms;
            temp = 1;
        }
        if (temp == 0) html += "无";
        html += "</span></div>";
        return html;
    }

    // 获取对应的阴历年月日
    function getLunrYMD(lunar, Y, M) {
        var html = "";
        var tempY = Y;
        // 公元4年是甲子年  每年从立春更替   立春在2月
        var solarTerms = sTerm(Y, (M - 1) * 2) - 1;
        var tgCount = ClickDays > solarTerms ? M - 2 : M - 3;
        if (tgCount < 0) tgCount += 12;
        if ((calendar.solarTerm[(M - 1) * 2] == "立春" && ClickDays <= solarTerms) || M < 2) {
            tempY -= 1;
        }
        var ganKey = (lunar[1] - 4) % 10;
        var zhiKey = (lunar[1] - 4) % 12;
        // 天干地支月  是根据24节气划分
        var tempM = calendar.monthTD[calendar.Gan[(tempY - 4) % 10]];
        // 1900-01-01 是甲戌日  0,10
        var tempD = (calendar.gregorianCalendar(Y, M, ClickDays) + 30) % 60;
        html += "<div class=\"ultd\">" + calendar.Gan[ganKey] + calendar.Zhi[zhiKey] + "年 【" + calendar.Animals[zhiKey] + "年】 " +
            calendar.Gan[(tgCount % 10 + tempM[0]) % 10] + calendar.Zhi[(tgCount % 12 + tempM[1]) % 12] + "月 " +
            calendar.Gan[(tempD % 10) % 10] + calendar.Zhi[(tempD % 12 + 10) % 12] + "日</div>";
        return html;
    }

    // 右键菜单点击事件
    function contextmenuClick(options, count, e) {
        var width = options.width;
        var height = options.height;
        var Y = options.date.getFullYear();
        var M = options.date.getMonth() + 1;
        var D = $(e).attr("id").split("days")[1];
        // 加班
        $("#menu-overtime").click(function () {
            var temp = $(e).find(".xbgj");
            if (temp.length > 0) {
                if ($(temp[0]).attr("xbgj") == "0") {
                    alert("请不要重复选择");
                    return;
                }
                temp.remove();
                delete configDayM["D" + D];
            }
            $(e).append("<div class=\"xbgj\" xbgj=\"0\" style=\"position: absolute;\"><div class=\"rest\" style=\"top:" +
            -parseInt((height - 16) / (count + 1) - 2) + "px;background-color: #53a253\">休</div></div>");
            configDayM["D" + D] = 0;
            $(".dayRightClick").remove();
        });
        // 休假
        $("#menu-vacation").click(function () {
            var temp = $(e).find(".xbgj");
            if (temp.length > 0) {
                if ($(temp[0]).attr("xbgj") == "1") {
                    alert("请不要重复选择");
                    return;
                }
                temp.remove();
                delete configDayM["D" + D];
            }
            $(e).append("<div class=\"xbgj\" xbgj=\"1\" style=\"position: absolute;\"><div class=\"rest\" style=\"top:" +
            -parseInt((height - 16) / (count + 1) - 2) + "px;background-color: #e15e5e\">班</div></div>");
            configDayM["D" + D] = 1;
            $(".dayRightClick").remove();
        });
        // 取消
        $("#menu-cancel").click(function () {
            var temp = $(e).find(".xbgj");
            if (temp.length > 0) {
                $(e).find(".xbgj").remove();
                delete configDayM["D" + D];
            }
            $(".dayRightClick").remove();
        });
        // 返回
        $("#menu-return").click(function () {
            $(".dayRightClick").remove();
        });
    }
    // 点击按钮和点击右键的事件
    function btnClick(options, e, count) {
        var Y = options.date.getFullYear();
        var M = options.date.getMonth() + 1;
        // 选择框值改变触发
        $("select").change(function () {
            reDraw(options, e);
        });
        // 点击日期事件
        $(".days").click(function () {
            $(".days").css("background", "").css("border", "1px solid #f1ebe4");
            $(this).css("background", "rgb(255, 248, 230);").css("border", "1px solid rgb(255, 203, 64)");
            ClickDays = $(this).attr("id").split("days")[1];
            rightArea(Y, M);
        });
        // 右击日期事件
        if (isclick) {
            $(".days").contextmenu(function (e) {
                var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
                var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
                $(".dayRightClick").remove();
                var html = "<div class=\"dayRightClick\" style=\"top:" + mouseY + "px;left:" + mouseX + "px;\">";
                html += "<div class=\"menu-item\" id=\"menu-overtime\"><div class=\"menu-ico\"><div class=\"icoText\" style=\"background-color: #53a253\">休</div></div><div class=\"menu-text\">休假</div></div>";
                html += "<div class=\"menu-item\" id=\"menu-vacation\"><div class=\"menu-ico\"><div class=\"icoText\" style=\"background-color: #e15e5e\">班</div></div><div class=\"menu-text\">加班</div></div>";
                html += "<div class=\"menu-item\" id=\"menu-cancel\"><div class=\"menu-ico\"></div><div class=\"menu-text\">取消</div></div>";
                html += "<div class=\"menu-line\"></div>";
                html += "<div class=\"menu-item\" id=\"menu-return\"><div class=\"menu-ico\"></div><div class=\"menu-text\">返回</div></div>";
                html += "</div>";
                $("body").append(html);
                contextmenuClick(options, count, this);
                return false;
            });
        }
        $("body").contextmenu(function () {
            $(".dayRightClick").remove();
        });
        // 年份向前
        $("#YL").click(function () {
            if ((Y - 1) == 1899) Y = 2100;
            else Y -= 1;
            $("#SY").val(Y);
            reDraw(options, e);
        });
        // 年份向后
        $("#YR").click(function () {
            if ((Y + 1) == 2101) Y = 1900;
            else Y += 1;
            $("#SY").val(Y);
            reDraw(options, e);
        });
        // 月份向前
        $("#ML").click(function () {
            if ((M - 1) == 0) {
                M = 12;
                if ((Y - 1) == 1899) Y = 2100;
                else Y -= 1;
            } else M -= 1;
            $("#SM").val(M);
            $("#SY").val(Y);
            reDraw(options, e);
        });
        // 月份向后
        $("#MR").click(function () {
            if ((M + 1) == 13) {
                M = 1;
                if ((Y + 1) == 2101) Y = 1900;
                else Y += 1;
            } else M += 1;
            $("#SM").val(M);
            $("#SY").val(Y);
            reDraw(options, e);
        });
        // 回到今天
        $("#ReturnBtn").click(function () {
            $(e).empty();
            options.date = ToDay;
            createTable(options, e);
        });
    }
    // 重新绘制日历表格
    function reDraw(options, e) {
        var Y = $("#SY").val();
        var M = $("#SM").val();
        $(e).empty();
        options.date = new Date(Y + "/" + M + "/" + ClickDays);
        createTable(options, e);
    }
    // 设置表格样式
    function setLayer(options, count) {
        var width = options.width;
        var height = options.height;
        var rate = options.rate;
        $(".calendar").css("width", width + "px").css("height", height + "px");
        $(".leftArea").css("width", parseInt(width * rate - 16) + "px").css("height", height - 16 + "px");
        $(".rightArea").css("width", parseInt(width * (1 - rate) - 40) + "px").css("height", height - 20 + "px");
        $(".head").css("width", parseInt(width * rate - 16) + "px").css("height", parseInt((height - 16) / 7 * 0.6 - 8 + count / 2) + "px")
            .css("line-height", parseInt((height - 16) / (count + 1) * 0.6 - 8) + "px");
        $(".week").css("width", parseInt((width * rate - 16) / 7) + "px").css("height", parseInt((height - 16) / (count + 1) * 0.4) + "px");
        $(".days").css("width", parseInt((width * rate - 16) / 7 - 2) + "px").css("height", parseInt((height - 16) / (count + 1) - 2.5) + "px");
        $(".days1").css("width", parseInt((width * rate - 16) / 7 - 2) + "px").css("height", parseInt((height - 16) / (count + 1) - 2.5) + "px");
        $(".num").css("line-height", parseInt((height - 16) / (count + 1)) / 2 + "px");
        $("#days" + ClickDays).css("background", "rgb(255, 248, 230);").css("border", "1px solid rgb(255, 203, 64)");
    }

})(this);
