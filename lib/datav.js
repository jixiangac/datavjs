/*global d3 */
/*!
 * DataV兼容定义
 */
;(function (name, definition) {
    if (typeof define === 'function') { // Module
        define(definition);
    } else { // Assign to common namespaces or simply the global object (window)
        this[name] = definition(function (id) { return this[id];});
    }
})('DataV', function (require) {
    /**
     * DataV全局命名空间对象定义
     */
    var DataV = function () {};

    /**
     * 版本号
     */
    DataV.version = "0.0.1";

    /**
     * 全局主题对象
     */
    DataV.Themes = {};

    /**
     * 获取当前主题的属性
     * @return {Mix} 返回当前主题的属性值
     */
    DataV.Themes.get = function (key) {
        var themeName = DataV.Themes.current || "default";
        if (!DataV.Themes._currentTheme) {
            DataV.Themes._currentTheme = DataV.Themes[themeName];
        }
        return DataV.Themes._currentTheme[key];
    };

    /**
     * 添加自定义主题
     * @param {String} themeName 主题名称
     * @param {Object} theme 主题对象json, contain attribute "COLOR_ARGS", theme.COLOR_ARGS is a 2-d array;
     */
    DataV.Themes.add = function () {
        var args = [].slice.call(arguments, 0);
        theme = args.pop();
        if (arguments.length < 2) {
            throw new Error("Arguments format error. should be: (themsName, theme)");
        } else if (typeof theme !== "object") {
            throw new Error("second argument theme should be a json object");
        } else if (!theme["COLOR_ARGS"]) {
            throw new Error("theme.COLOR_ARGS needed");
        } else if (!theme["COLOR_ARGS"] instanceof Array) {
            throw new Error("theme.COLOR_ARGS should be an array");
        } else if (!(theme["COLOR_ARGS"][0] instanceof Array)) {
            throw new Error("theme.COLOR_ARGS[0] should be an array");
        }
        for (var i = 0, l = args.length; i < l; i++) {
            var _themeName = args[i];
            if (DataV.Themes.hasOwnProperty(_themeName)) {
                throw new Error("The " + _themeName + " has been defined");
            }
            DataV.Themes[_themeName] = theme;
        }
    };

    /*!
     * 默认主题
     */
    DataV.Themes.add('default', 'theme0', {
         COLOR_ARGS: [
            ["#3dc6f4", "#8ce3ff"],
            ["#214fd9", "#7396ff"],
            ["#4f21d9", "#9673ff"],
            ["#c43df2", "#e38cff"],
            ["#d8214f", "#ff7396"],
            ["#f3c53c", "#ffe38c"]
        ]
    });

    /*!
     * 主题1
     */
    DataV.Themes.add('theme1', {
        COLOR_ARGS: [
            ["#e72e8b", "#ff7fbf"],
            ["#d94f21", "#ff9673"],
            ["#f3c53c", "#ffe38c"],
            ["#8be62f", "#bfff7f"],
            ["#14cc14", "#66ff66"],
            ["#2fe68a", "#7fffc0"]
        ]
    });

    /*!
     * 主题2
     */
    DataV.Themes.add('theme2', {
        COLOR_ARGS: [
            ["#2f8ae7", "#7fc0ff"],
            ["#8a2ee7", "#bf7fff"],
            ["#f33dc6", "#ff8ce3"],
            ["#8be62f", "#bfff7f"],
            ["#14cc14", "#66ff66"],
            ["#2fe68a", "#7fffc0"]
        ]
    });

    DataV.Themes.add('theme3', {
        COLOR_ARGS: [
            ["#2f8ae7", "#896DA3"],
            ["#8e34df", "#FFADA6"],
            ["#f738c0", "#65FCFC"],
            ["#84e653", "#555566"],
            ["#0cc53e", "#db3f7c"],
            ["#00e793s", "#db3f7c"]
        ]
    });

    DataV.Themes.add('theme4', {
        COLOR_ARGS: [
            ["#d94f21", "#7a88d1"],
            ["#579ce2", "#87bdf4"],
            ["#3bb4df", "#7fd1ef"],
            ["#a380ff", "#baa0ff"],
            ["#a164c5", "#c28fe1"],
            ["#d93a92", "#ec74b6"],
            ["#b82377", "#d569a7"],
            ["#bb3ca3", "#d381c2"],
            ["#da2d57", "#ec6b8a"],
            ["#4ca716", "#4ca716"],
            ["#5b63c2", "#8e93d7"],
            ["#15a9a3", "#4ecac5"],
            ["#a9ab48", "#e8c670"],
            ["#2aa5f5", "#73c4fa"],
            ["#f67e10", "#feb648"],
            ["#1faa77", "#62c8a2"],
            ["#eb4f20", "#f58563"],
            ["#ffc000", "#ffd659"],
            ["#f16ebc", "#f6a1d3"],
            ["#d23457", "#e27b92"]
        ]
    });

    /**
     * 切换当前主题
     * @param {String} themeName 主题名称
     * @return {Boolean} 返回是否切换成功
     */
    DataV.changeTheme = function (themeName) {
        var ret = DataV.Themes[themeName];
        if (ret) {
            DataV.Themes.current = themeName;
            DataV.Themes._currentTheme = null;
        }
        return !!ret;
    };

    /**
     * 获取当前主题的颜色配置
     * @return {Array} 颜色参数列表
     */
    DataV.getColor = function () {
        var theme = DataV.Themes;
        var color = theme.get("COLOR_ARGS");
        return color;
    };

    /**
     * 根据当前主题的颜色配置方案，获取生成离散颜色的函数
     * @return {Function} 离散函数
     */
    DataV.getDiscreteColor = function () {
        var color = DataV.getColor();
        if (!_.isArray(color)) {
            throw new Error("The color should be Array");
        }
        var colorCount = color.length;
        var gotColor = [];

        if (_.isArray(color[0])) {
            for (var i = 0; i < colorLineCount ; i++) {
                getColor.push(color[i][0]);
            }
        } else {
            gotColor = color;
        }

        return function (num) {
            var thisColor = gotColor;
            var thisColorCount = colorCount;

            return thisColor[num % thisolorCount];
        };
    };

    /**
     * 获取渐变颜色，用于生成渐变效果
     * @param {Array} color 颜色数组
     * @param {String} method 生成渐变色的方法，默认值为normal。如果为normal将采用D3的interpolateRgb算法，如果为special，则用Rapheal的HSB算法
     * @return {Function} 返回生成算法
     */
    DataV.gradientColor = function (color, method) {
        if (!_.isArray(color)) {
            throw new Error("The color should be Array");
        }

        var startColor = color[0];
        var colorColor;
        var colorCount = color.length;

        var hsb;
        if (colorCount === 1) {
            hsb = Raphael.color(color[0]);
            endColor = Raphael.hsb(hsb.h / 360, (hsb.s -30) / 100, 1);
        } else {
            endColor = color[colorCount - 1];
        }

        method = method || "normal ";

        if (method === "special") {
            return function (num) {
                var startHSB = Raphael.color(startColor);
                var endHSB = Raphael.color(endColor);
                var startH = startHSB.h * 360;
                var endH = endHSB.h * 360;
                var startNum = startHSB.h * 20;
                var endNum = endHSB.h * 20;

                var dH;
                var dNum;
                if (startNum >= endNum) {
                    dH = 360 - startH + endH;
                    dNum = colorCount - startNum + endNum;
                } else {
                    dH = endH - startH;
                    dNum = endNum - startNum;
                }
                
                var h = (startH + dH * num) / 360;
                var s = (70 + Math.abs(4 - (startNum + dNum * num) % 8) * 5) / 100;
                var b = (100 - Math.abs(4 - (startNum + dNum * num) % 8) * 5) / 100;

                return Raphael.hsb(h, s, b);
            };
        } else {
            return d3.interpolateRgb.apply(null, [startColor, endColor]);
        }
    };

    /**
     * 请求一个JSON文件
     * @param {String} url JSON文件地址
     * @param {Function} callback 回调函数
     */
    DataV.json = function (url, callback) {
        d3.json(url, callback);
    };

    /**
     * 请求一个CSV文件，并解析
     * @param {String} url CSV文件地址
     * @param {Function} callback 回调函数，得到解析后的结果
     */
    DataV.csv = function (url, callback) {
        d3.text(url, "text/csv", function (text) {
            callback(text && d3.csv.parseRows(text));
        });
    };

    /**
     * 判断输入是否是数字
     * @param {Mix} obj 输入内容
     * @return {Boolean} 返回输入是否是数字
     */
    DataV.isNumeric = function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    };

    /**
     * 继承
     * @param {Function} parent 父类
     * @param {Object} properties 新属性
     * @return {Function} 新的子类
     */
    DataV.extend = function (parent, properties) {
        if (typeof parent !== "function") {
            properties = parent;
            parent = function () {};
        }

        properties = properties || {};
        var sub = function () {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === parent && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };
        sub.prototype = new parent();
        sub.prototype.constructor = parent;
        $.extend(sub.prototype, properties);
        return sub;
    };

    /**
     * 所有Chart的源定义
     * Examples:
     * ```
     *    var Stream = DataV.extend(DataV.Chart, {
     *        initialize: function () {
     *            this.type = "Stream";
     *        },
     *        clearCanvas: function () {
     *            this.canvas.clear();
     *            this.legend.innerHTML = "";
     *        }
     *    });
     * ```
     */
    var Chart = DataV.extend(EventProxy, {
        type: "Chart",
        initialize: function (node, options) {
            this.defaults = {};
            this.plugins = {};
        }
    });

    /**
     * 返回当前Chart的类型
     * @return {String} Chart类型
     */
    Chart.prototype.getType = function () {
        return this.type;
    };
    /**
     * 如果node是字符串，会当作ID进行查找。
     * 如果是DOM元素，直接返回该元素。
     * 如果是jQuery对象，返回对象中的第一个元素。
     * 如果节点不存在，则抛出异常
     * Examples:
     * ```
     * chart.checkContainer("id");
     * chart.checkContainer(document.getElementById("id"));
     * chart.checkContainer($("#id"));
     * ```
     * @param {Mix} node The element Id or Dom element
     * @return {Object} 返回找到的DOM节点
     */
    Chart.prototype.checkContainer = function (node) {
        var ret = null;

        if (typeof node === "string") {
            ret = document.getElementById(node);
        } else if (node.nodeName) { //DOM-element
            ret = node;
        } else if (node instanceof jQuery && node.size() > 0) {
            ret = node[0];
        }
        if (!ret) {
            throw new Error("Please specify which node to render.");
        }
        return ret;
    };

    /**
     * 设置自定义选项
     * Examples:
     * Set width 500px, height 600px;
     * ```
     * {"width": 500, "height": 600}
     * ```
     * @param {Object} options 自定义选项对象
     * @return {Object} 覆盖后的图表选项对象
     */
    Chart.prototype.setOptions = function (options) {
        return _.extend(this.defaults, options);
    };

    /**
     * 添加插件方法到实例对象上
     * @param {String} name plugin name
     * @param {Function} fn plugin function
     * @return {Object} A reference to the host object
     */
    Chart.prototype.plug = function (name, fn) {
        this[name] = fn;
        this.plugins[name] = fn;
        return this;
    };

    /**
     * 从实例上移除插件方法
     * @param {String} plugin The namespace of the plugin
     * @return {Object} A reference to the host object
     */
    Chart.prototype.unplug = function (name) {
        if (this.plugins.hasOwnProperty(name)) {
            delete this.plugins[name];
            delete this[name];
        }
        return this;
    };

    DataV.Chart = Chart;

    /**
     * 浮动标签
     */
    DataV.FloatTag = function () {
        var _mousemove = function (e) {
            var jqNode = e.data.jqNode;
            var container = e.data.container;
            var mouseToFloatTag = {x: 20, y: 20};
            var offset = $(container).offset();
            if (!(e.pageX && e.pageY)) {return false;}
            var x = e.pageX - offset.left,
                y = e.pageY - offset.top;
            var position = $(container).position();

            setContent.call(this);

            //set floatTag location
            floatTagWidth = jqNode.outerWidth();
            floatTagHeight = jqNode.outerHeight();
            if (floatTagWidth + x + 2 * mouseToFloatTag.x <=  $(container).width()) {
                x += mouseToFloatTag.x;
            } else {
                x = x - floatTagWidth - mouseToFloatTag.x;
            }
            if (y >= floatTagHeight + mouseToFloatTag.y) {
                y = y - mouseToFloatTag.y - floatTagHeight;
            } else {
                y += mouseToFloatTag.y;
            }
            jqNode.css("left",  x  + "px");
            jqNode.css("top",  y + "px");
        };

        var setContent = function () {};

        function floatTag(cont) {
            var container = cont;
            var jqNode = $("<div/>").css({
                "border": "1px solid",
                "border-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.8)",
                "background-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.75)",
                "color": "white",
                "border-radius": "2px",
                "padding": "12px 8px",
                //"line-height": "170%",
                //"opacity": 0.7,
                "font-size": "12px",
                "box-shadow": "3px 3px 6px 0px rgba(0,0,0,0.58)",
                "font-familiy": "宋体",
                "z-index": 10000,
                "text-align": "center",
                "visibility": "hidden",
                "position": "absolute"
            });
            $(container).append(jqNode)
                .mousemove({"jqNode": jqNode, "container": container}, _mousemove);
            return jqNode;
        }

        floatTag.setContent = function (sc) {
            if (arguments.length === 0) {
                return setContent;
            }
            setContent = sc;
        };
        return floatTag;
    };

    DataV.sum = function (list, iterator) {
        var count = 0;
        var i, l;
        if (typeof iterator === 'undefined') {
            for (i = 0, l = list.length; i < l; i++) {
                count += list[i];
            }
        } else if (typeof iterator === "function") {
            for (i = 0, l = list.length; i < l; i++) {
                count += iterator(list[i]);
            }
        } else if (typeof iterator === "string" || typeof iterator === 'number') {
            for (i = 0, l = list.length; i < l; i++) {
                count += iterator(list[i][iterator]);
            }
        } else {
            throw new Error("iterator error");
        }
        return count;
    };

    return DataV;
});
