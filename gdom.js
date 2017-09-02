/**
* gdom library (v1.0.0)
* Licensed under the MIT License.
* http://www.cnblogs.com/ghostwu/
*
* Copyright ghostwu
* Licensed under the MIT License
* https://github.com/ghostwu/gdom
*/
(function (window, undefined) {
    function bindEvent(obj, event, fn) {
        if (obj.attachEvent) { //ie
            obj.attachEvent('on' + event, function () {
                fn.call(obj);
            });
        } else {
            //chrome&ff
            obj.addEventListener(event, fn, false);
        }
    }
    function getStyle(obj, attr, value) {
        if (obj.currentStyle) { //ie
            return obj.currentstyle[attr];
        } else {
            //chrome&&FF
            return getComputedStyle(obj, false)[attr];
        }
    }
    var G = function (selector, context) {
        return new G.fn.init(selector, context);
    };
    G.fn = G.prototype = {
        constructor: G,
        init: function (selector, context) {
            this.length = 0;
            context = context || document;
            if (typeof selector === 'string' && selector.indexOf('#') == 0) {
                this[0] = document.getElementById(selector.substring(1));
                this.length = 1;
            } else if (typeof selector === 'string') {
                //事件委托时 把G类型的context对象转成dom对象
                if (context instanceof G) {
                    context = context.getDom();
                    if (context[0]) {
                        context = context[0];
                    }
                }
                var aNode = context.querySelectorAll(selector);
                for (var i = 0, len = aNode.length; i < len; i++) {
                    this[i] = aNode[i];
                }
                this.length = len;
            } else if (typeof selector === 'function') {
                bindEvent(window, 'load', selector);
            } else if (typeof selector === 'object') {
                this[0] = selector;
                this.length = 1;
            }
            this.selector = selector;
            this.context = context;
            return this;
        },
        length: 0,
        version : 'v1.0.0',
        size: function () {
            return this.length;
        },
        on: function (type, fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                bindEvent(this[i], type, fn);
            }
            return this;
        },
        delegate: function (subEle, evType, fn) {
            var curObj = null;
            for (var i = 0, len = this.length; i < len; i++) {
                curObj = this[i];
                bindEvent(curObj, evType, function (ev) {
                    var oEvent = ev || event;
                    var target = oEvent.target || oEvent.srcElement;
                    if (target.nodeName.toLowerCase() == subEle) {
                        //纠正this, 这里的this很复杂
                        fn.apply(this.querySelector(subEle), arguments);
                    }
                }.bind(curObj));
            }
        },
        hide: function () {
            for (var i = 0, len = this.length; i < len; i++) {
                this[i].style.display = 'none';
            }
            return this;
        },
        show: function () {
            for (var i = 0, len = this.length; i < len; i++) {
                this[i].style.display = 'block';
            }
            return this;
        },
        toggle: function () {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i].style.display == 'block' || this[i].style.display == '') {
                    this[i].style.display = 'none';
                } else {
                    this[i].style.display = 'block';
                }
            }
            return this;
        },
        hover: function (fnOver, fnOut) {
            for (var i = 0, len = this.length; i < len; i++) {
                bindEvent(this[i], 'mouseover', fnOver);
                bindEvent(this[i], 'mouseout', fnOut);
            }
        },
        addClass: function () {
            var args = [].slice.call(arguments),
                list = '';
            list = args.join("").split(" ");
            for (var i = 0, len = this.length; i < len; i++) {
                for (var j = 0, cLen = list.length; j < cLen; j++) {
                    this[i].classList.add(list[j]);
                }
            }
            return this;
        },
        hasClass: function () {
            if (arguments[0] === undefined) {
                return false;
            }
            return this[0].classList.contains(arguments[0]);
        },
        removeClass: function () {
            var args = [].slice.call(arguments),
                list = '';
            list = args.join("").split(" ");
            if (arguments[0] === undefined) return;
            for (var i = 0, len = this.length; i < len; i++) {
                for (var j = 0, cLen = list.length; j < len; j++) {
                    this[i].classList.remove(list[j]);
                }
            }
            return this;
        },
        toggleClass: function (cName) {
            for (var i = 0, len = this.length; i < len; i++) {
                this[i].classList.toggle(cName);
            }
        },
        css: function (attr, value) {
            if (arguments.length == 2) {
                for (var i = 0; i < this.length; i++) {
                    this[i].style[attr] = value;
                }
            } else {
                if (typeof arguments[0] === 'object') {
                    for (var i = 0; i < this.length; i++) {
                        for (var key in arguments[0]) {
                            this[i].style[key] = arguments[0][key];
                        }
                    }
                } else {
                    return getStyle(this[0], attr);
                }
            }
            return this;
        },
        attr: function (attr, value) {
            if (arguments.length == 2) {
                for (var i = 0; i < this.length; i++) {
                    // this[i][attr] = value;
                    this[i].setAttribute(attr, value);
                }
            } else {
                if (typeof arguments[0] === 'object') {
                    for (var i = 0; i < this.length; i++) {
                        for (var key in arguments[0]) {
                            // this[i][key] = arguments[0][key];
                            this[i].setAttribute(key, arguments[0][key]);
                        }
                    }
                } else {
                    // return this[0][attr];
                    return this[0].getAttribute(attr);
                }
            }
            return this;
        },
        each: function (fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                fn.call(this[i], i);
            }
        },
        val: function () {
            if (arguments.length == 1) {
                for (var i = 0, len = this.length; i < len; i++) {
                    this[i].value = arguments[0];
                }
            } else {
                return this[0].value;
            }
            return this;
        },
        html: function () {
            if (arguments.length == 1) {
                for (var i = 0, len = this.length; i < len; i++) {
                    this[i].innerHTML = arguments[0];
                }
            } else {
                return this[0].innerHTML;
            }
            return this;
        },
        eq: function (index) {
            return G(this[index]);
        },
        lt: function (index) {
            if (index <= 0) {
                this.empty();
                return this;
            }
            if (index >= this.length) {
                index = this.length;
            }
            for (var len = this.length, i = len - 1; i >= index; i--) {
                delete (this[i]);
                this.length--;
            }
            return this;
        },
        gt: function (index) {
            var restNode = []
            count = 0;
            if (index > this.length) {
                this.empty();
                return this;
            }
            for (var i = 0; i <= index; i++) {
                delete (this[i]);
                this.length--;
            }
            for (var key in this) {
                if (G.isNum(key)) {
                    restNode.push(this[key]);
                    delete (this[key]);
                    this.length--;
                }
            }
            for (var i = 0, len = restNode.length; i < len; i++) {
                this[this.length++] = restNode[i];
            }
            return this;
        },
        empty: function () {
            for (var i = 0, len = this.length; i < len; i++) {
                delete this[i];
            }
            this.length = 0;
        },
        find: function (selector) {
            var allNode = [], tmpArr = [];
            for (var i = 0, len = this.length; i < len; i++) {
                allNode.push(this[i].querySelectorAll(selector));
            }
            if (allNode) tmpArr = G.flatten(allNode);
            if (tmpArr) {
                this.empty();
                G.fn.extend(this, tmpArr);
            }
            return this;
        },
        parent: function () {
            return G(this[0].parentNode);
        },
        children: function (tag) {
            var allNode = [], tmpArr = [], curNode = null;
            for (var i = 0, len = this.length; i < len; i++) {
                for (var j = 0, cLen = this[i].children.length; j < cLen; j++) {
                    curNode = this[i].children[j];
                    if (tag !== undefined) {
                        if (curNode.tagName.toLowerCase() === tag)
                            allNode.push(curNode);
                    } else {
                        allNode.push(curNode);
                    }
                }
            }
            if (allNode) {
                this.empty();
                G.fn.extend(this, allNode);
            }
            return this;
        },
        parents: function (tag) {
            var allNode = [], pNode = null, curNode = null;
            curNode = this[0];
            while (pNode = curNode.parentNode) {
                if (tag !== undefined) {
                    if (pNode.tagName.toLowerCase() === tag) {
                        allNode.push(pNode);
                        break;
                    }
                }
                curNode = pNode;
            }
            if (allNode) {
                this.empty();
                G.fn.extend(this, allNode);
            }
            return this;
        },
        siblings: function (tag) {
            var allNode = [], tmpArr = [],
                curNode = null, allSiblings = [];
            curNode = this[0];
            allSiblings = curNode.parentNode.children;
            for (var i = 0, len = allSiblings.length; i < len; i++) {
                curSibNode = allSiblings[i];
                if (tag !== undefined) {
                    if (curSibNode.tagName.toLowerCase() === tag && curNode !== curSibNode)
                        allNode.push(curSibNode);
                } else {
                    allNode.push(curSibNode);
                }
            }
            if (allNode) {
                this.empty();
                G.fn.extend(this, allNode);
            }
            return this;
        },
        next: function () {
            var nextNode = null;
            nextNode = this[0].nextElementSibling || this[0].nextSibling;
            while (nextNode.nodeType != 1) {
                nextNode = nextNode.nextElementSibling || nextNode.nextSibling;
                if (nextNode === null) break;
            }
            return (!nextNode ? null : G(nextNode));
        },
        prev: function () {
            var prevNode = null;
            prevNode = this[0].previousElementSibling || this[0].previousSibling;
            while (prevNode.nodeType != 1) {
                prevNode = prevNode.previousElementSibling || prevNode.previousSibling;
                if (prevNode == null) break;
            }
            return (!prevNode ? null : G(prevNode));
        },
        get: function (index) {
            return this[index];
        },
        getDom: function () {
            var elements = [];
            for (var i = 0, len = this.length; i < len; i++) {
                elements.push(this[i]);
            }
            return elements;
        },
        index: function (tag) {
            var elements = this[0].parentNode.children,
                allNode = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                if (tag !== undefined) {
                    if (elements[i].tagName.toLowerCase() === tag) {
                        allNode.push(elements[i]);
                    }
                } else {
                    allNode.push(elements[i]);
                }
            }
            for (var i = 0, len = allNode.length; i < len; i++) {
                if (this[0] === allNode[i]) {
                    return i;
                }
            }
            return -1;
        },
        append: function (obj) {
            var cloneNode = null;
            if (typeof obj === 'object') {
                for (var i = 0, len = this.length; i < len; i++) {
                    cloneNode = obj.cloneNode(true);
                    this[i].appendChild(cloneNode);
                }
            } else if (typeof obj === 'string') {
                for (var i = 0, len = this.length; i < len; i++) {
                    this[i].innerHTML += obj;
                }
            }
        },
        prepend: function (obj) {
            var cloneNode = firstNode = null;
            if (typeof obj === 'object') {
                for (var i = 0, len = this.length; i < len; i++) {
                    cloneNode = obj.cloneNode(true);
                    if (this[i].children.length === 0) {
                        this[i].insertBefore(cloneNode, null);
                    } else {
                        this[i].insertBefore(cloneNode, this[i].children[0]);
                    }
                }
            } else if (typeof obj === 'string') {
                for (var i = 0, len = this.length; i < len; i++) {
                    this[i].innerHTML = obj + this[i].innerHTML;
                }
            }
        },
        after: function (obj) {
            var referNode = cloneNode = tmpObj = null;
            if (typeof obj === 'object') {
                for (var i = 0, len = this.length; i < len; i++) {
                    cloneNode = obj.cloneNode(true);
                    referNode = G(this[i]).next();
                    if (!referNode) {
                        this[i].parentNode.appendChild(cloneNode);
                    } else {
                        referNode[0].parentNode.insertBefore(cloneNode, referNode[0]);
                    }
                }
            } else if (typeof obj === 'string') {
                tmpObj = G.parseHtmlTag(obj);
                for (var i = 0, len = this.length; i < len; i++) {
                    referNode = G(this[i]).next();
                    cloneNode = tmpObj.cloneNode(true);
                    if (!referNode) {
                        this[i].parentNode.appendChild(cloneNode);
                    } else {
                        referNode[0].parentNode.insertBefore(cloneNode, referNode[0]);
                    }
                }
            }
        },
        before: function (obj) {
            var referNode = cloneNode = tmpObj = null;
            if (typeof obj === 'object') {
                for (var i = 0, len = this.length; i < len; i++) {
                    cloneNode = obj.cloneNode(true);
                    this[i].parentNode.insertBefore(cloneNode, this[i]);
                }
            } else if (typeof obj === 'string') {
                tmpObj = G.parseHtmlTag(obj);
                for (var i = 0, len = this.length; i < len; i++) {
                    cloneNode = tmpObj.cloneNode(true);
                    this[i].parentNode.insertBefore(cloneNode, this[i]);
                }
            }
        },
        animate: function ( attr, fn ) {
            obj = this[0], that = this;
            clearInterval( obj.timer );
            var cur = 0;
            var speed = 0;
            obj.timer = setInterval(function () {
                var bFlag = true;
                for (var key in attr) {
                    if ( key == 'opacity' ) {
                        cur = that.css( obj, 'opacity' ) * 100;
                    } else {
                        cur = parseInt( that.css( key ) );
                    }
                    var target = attr[key];
                    speed = (target - cur) / 6;
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                    if (cur != target) {
                        bFlag = false;
                        if (key == 'opacity') {
                            obj.style.opacity = (cur + speed) / 100;
                            obj.style.filter = "alpha(opacity:" + (cur + speed) + ")";
                        } else {
                            obj.style[key] = cur + speed + "px";
                        }
                    }
                }
                if (bFlag) {
                    clearInterval(obj.timer);
                    fn && fn.call(obj);
                }
            }, 30);
            return this;
        },
    }

    G.fn.init.prototype = G.fn;

    var sProto = String.prototype;
    G.isNum = function (n) {
        var n = Number(n);
        return (isNaN(n) ? false : true);
    }
    G.trimLeft = function (s) {
        if (sProto.trimLeft !== undefined)
            s = s.trimLeft();
        else
            s = s.replace(/^\s+/g, '');
        return s;
    }
    G.trimRight = function (s) {
        if (sProto.trimRight !== undefined)
            s = s.trimRight();
        else
            s = s.replace(/\s+$/g, '');
        return s;
    }
    G.trim = function (s) {
        if (typeof sProto.trim !== undefined) {
            s = s.trim();
        } else {
            s = s.replace(/^\s+|\s+$/g, '');
        }
        return s;
    }
    G.parseHtmlTag = function (str) {
        var re = /<(\w+\s*)(\w+[=][\'\"](.*)?[\'\"]\s*)*>(.*)?<\/\w+>/,
            // var str = '<div onclick="test();" style="color:red;background:green;" name="test" id="test">this is a test string</div><div>123</div>';
            res = str.match(re),
            tagName = null, attrList = [], arr = [], obj = {};
        if (res[1]) {
            tagName = G.trim(res[1]);
            obj['tag'] = tagName;
        }
        if (res[4]) {
            obj['inner'] = res[4];
        }
        if (res[2]) {
            attrList = res[2].split(/\s+/);
            for (var i = 0, len = attrList.length; i < len; i++) {
                arr = attrList[i].split("=");
                arr[0] = G.trim(arr[0]);
                obj[arr[0]] = G.trim(arr[1]).replace(/(^[\'\"]+|[\'\"]$)/g, function () {
                    return '';
                });
            }
        }
        var o = document.createElement(obj['tag']);
        o.innerHTML = obj['inner'];
        delete obj['inner'];
        delete obj['tag'];
        for (var key in obj) {
            o.setAttribute(key, obj[key]);
        }
        return o;
    }
    G.isArray = function (obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }
    }
    G.toArray = function (nodes) {
        try {
            return Array.prototype.slice.call(nodes);
        } catch (e) {
            var arr = [];
            for (var i = 0, l = nodes.length; i < l; i++) {
                arr.push(nodes[i]);
            }
            return arr;
        }
    }
    G.flatten = function (arr) {
        var res = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length) arr[i] = G.toArray(arr[i]);
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (G.isArray(arr[i])) {
                for (var j = 0, sLen = arr[i].length; j < sLen; j++) {
                    res.push(arr[i][j]);
                }
            } else {
                res.push(arr[i]);
            }
        }
        return res;
    }
    G.extend = G.fn.extend = function () {
        var i = 1,
            len = arguments.length,
            dst = arguments[0],
            j;
        if (dst.length === undefined) {
            dst.length = 0;
        }
        if (i == len) {
            dst = this;
            i--;
        }
        for (; i < len; i++) {
            for (j in arguments[i]) {
                dst[j] = arguments[i][j];
                dst.length++;
            }
        }
        return dst;
    }
    window.G = window.$ = G;
})(window);