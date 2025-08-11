(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    function ssr_window_esm_isObject(obj) {
        return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target, src) {
        if (target === void 0) target = {};
        if (src === void 0) src = {};
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        Object.keys(src).filter((key => noExtend.indexOf(key) < 0)).forEach((key => {
            if (typeof target[key] === "undefined") target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = typeof document !== "undefined" ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if (typeof setTimeout === "undefined") {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if (typeof setTimeout === "undefined") return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = typeof window !== "undefined" ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function utils_classesToTokens(classes) {
        if (classes === void 0) classes = "";
        return classes.trim().split(" ").filter((c => !!c.trim()));
    }
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (delay === void 0) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (axis === void 0) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
    }
    function isNode(node) {
        if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
        return node && (node.nodeType === 1 || node.nodeType === 11);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => dir === "next" && current >= target || dir === "prev" && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (startTime === null) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    function utils_elementChildren(element, selector) {
        if (selector === void 0) selector = "";
        const window = ssr_window_esm_getWindow();
        const children = [ ...element.children ];
        if (window.HTMLSlotElement && element instanceof HTMLSlotElement) children.push(...element.assignedElements());
        if (!selector) return children;
        return children.filter((el => el.matches(selector)));
    }
    function elementIsChildOfSlot(el, slot) {
        const elementsQueue = [ slot ];
        while (elementsQueue.length > 0) {
            const elementToCheck = elementsQueue.shift();
            if (el === elementToCheck) return true;
            elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
        }
    }
    function elementIsChildOf(el, parent) {
        const window = ssr_window_esm_getWindow();
        let isChild = parent.contains(el);
        if (!isChild && window.HTMLSlotElement && parent instanceof HTMLSlotElement) {
            const children = [ ...parent.assignedElements() ];
            isChild = children.includes(el);
            if (!isChild) isChild = elementIsChildOfSlot(el, parent);
        }
        return isChild;
    }
    function showWarning(text) {
        try {
            console.warn(text);
            return;
        } catch (err) {}
    }
    function utils_createElement(tag, classes) {
        if (classes === void 0) classes = [];
        const el = document.createElement(tag);
        el.classList.add(...Array.isArray(classes) ? classes : utils_classesToTokens(classes));
        return el;
    }
    function elementPrevAll(el, selector) {
        const prevEls = [];
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (prev.matches(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return prevEls;
    }
    function elementNextAll(el, selector) {
        const nextEls = [];
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (next.matches(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return nextEls;
    }
    function elementStyle(el, prop) {
        const window = ssr_window_esm_getWindow();
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    function utils_elementIndex(el) {
        let child = el;
        let i;
        if (child) {
            i = 0;
            while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
            return i;
        }
        return;
    }
    function utils_elementParents(el, selector) {
        const parents = [];
        let parent = el.parentElement;
        while (parent) {
            if (selector) {
                if (parent.matches(selector)) parents.push(parent);
            } else parents.push(parent);
            parent = parent.parentElement;
        }
        return parents;
    }
    function elementOuterSize(el, size, includeMargins) {
        const window = ssr_window_esm_getWindow();
        if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
        return el.offsetWidth;
    }
    function utils_makeElementsArray(el) {
        return (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
    }
    function utils_setInnerHTML(el, html) {
        if (html === void 0) html = "";
        if (typeof trustedTypes !== "undefined") el.innerHTML = trustedTypes.createPolicy("html", {
            createHTML: s => s
        }).createHTML(html); else el.innerHTML = html;
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = _temp === void 0 ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = platform === "Win32";
        let macos = platform === "MacIntel";
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (overrides === void 0) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        const device = getDevice();
        let needPerspectiveFix = false;
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        if (isSafari()) {
            const ua = String(window.navigator.userAgent);
            if (ua.includes("Version/")) {
                const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
                needPerspectiveFix = major < 16 || major === 16 && minor < 2;
            }
        }
        const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
        const isSafariBrowser = isSafari();
        const need3dFix = isSafariBrowser || isWebView && device.ios;
        return {
            isSafari: needPerspectiveFix || isSafariBrowser,
            needPerspectiveFix,
            need3dFix,
            isWebView
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (options === void 0) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (swiper.__preventObserver__) return;
                if (mutations.length === 1) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
                characterData: typeof options.characterData === "undefined" ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = utils_elementParents(swiper.hostEl);
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.hostEl, {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.wrapperEl, {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    var eventsEmitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if (typeof args[0] === "string" || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const el = swiper.el;
        if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = el.clientWidth;
        if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = el.clientHeight;
        if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
        width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
        height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {wrapperEl, slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = utils_elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if (typeof swiperSize === "undefined") return;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
        swiper.virtualSize = -spaceBetween;
        slides.forEach((slideEl => {
            if (rtl) slideEl.style.marginLeft = ""; else slideEl.style.marginRight = "";
            slideEl.style.marginBottom = "";
            slideEl.style.marginTop = "";
        }));
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slides); else if (swiper.grid) swiper.grid.unsetSlides();
        let slideSize;
        const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key => typeof params.breakpoints[key].slidesPerView !== "undefined")).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            let slide;
            if (slides[i]) slide = slides[i];
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
            if (slides[i] && elementStyle(slide, "display") === "none") continue;
            if (params.slidesPerView === "auto") {
                if (shouldResetSlideSize) slides[i].style[swiper.getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide);
                const currentTransform = slide.style.transform;
                const currentWebKitTransform = slide.style.webkitTransform;
                if (currentTransform) slide.style.transform = "none";
                if (currentWebKitTransform) slide.style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", true) : elementOuterSize(slide, "height", true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide;
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide.style.transform = currentTransform;
                if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
        if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (isVirtual && params.loop) {
            const size = slidesSizesGrid[0] + spaceBetween;
            if (params.slidesPerGroup > 1) {
                const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
                const groupSize = size * params.slidesPerGroup;
                for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
            }
            for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
                if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
                slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
                swiper.virtualSize += size;
            }
        }
        if (snapGrid.length === 0) snapGrid = [ 0 ];
        if (spaceBetween !== 0) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode || params.loop) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).forEach((slideEl => {
                slideEl.style[key] = `${spaceBetween}px`;
            }));
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (spaceBetween || 0);
            }));
            allSlidesSize -= spaceBetween;
            const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
            snapGrid = snapGrid.map((snap => {
                if (snap <= 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (spaceBetween || 0);
            }));
            allSlidesSize -= spaceBetween;
            const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
            if (allSlidesSize + offsetSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        swiper.emit("slidesUpdated");
        if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
            return swiper.slides[index];
        };
        if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
    const toggleSlideClasses$1 = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
    };
    function updateSlidesProgress(translate) {
        if (translate === void 0) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (slides.length === 0) return;
        if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        let spaceBetween = params.spaceBetween;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
            }
            toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
            toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
    }
    function updateProgress(translate) {
        const swiper = this;
        if (typeof translate === "undefined") {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd, progressLoop} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (translatesDiff === 0) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
            const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
            isBeginning = isBeginningRounded || progress <= 0;
            isEnd = isEndRounded || progress >= 1;
            if (isBeginningRounded) progress = 0;
            if (isEndRounded) progress = 1;
        }
        if (params.loop) {
            const firstSlideIndex = swiper.getSlideIndexByData(0);
            const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
            const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
            const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
            const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
            const translateAbs = Math.abs(translate);
            if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax; else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
            if (progressLoop > 1) progressLoop -= 1;
        }
        Object.assign(swiper, {
            progress,
            progressLoop,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    const toggleSlideClasses = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
    };
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, slidesEl, activeIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        const getFilteredSlide = selector => utils_elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
        let activeSlide;
        let prevSlide;
        let nextSlide;
        if (isVirtual) if (params.loop) {
            let slideIndex = activeIndex - swiper.virtual.slidesBefore;
            if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
            if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
            activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
        } else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else if (gridEnabled) {
            activeSlide = slides.find((slideEl => slideEl.column === activeIndex));
            nextSlide = slides.find((slideEl => slideEl.column === activeIndex + 1));
            prevSlide = slides.find((slideEl => slideEl.column === activeIndex - 1));
        } else activeSlide = slides[activeIndex];
        if (activeSlide) if (!gridEnabled) {
            nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && !nextSlide) nextSlide = slides[0];
            prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && !prevSlide === 0) prevSlide = slides[slides.length - 1];
        }
        slides.forEach((slideEl => {
            toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
            toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
            toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
        }));
        swiper.emitSlidesClasses();
    }
    const processLazyPreloader = (swiper, imageEl) => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
        const slideEl = imageEl.closest(slideSelector());
        if (slideEl) {
            let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`); else requestAnimationFrame((() => {
                if (slideEl.shadowRoot) {
                    lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
                    if (lazyEl) lazyEl.remove();
                }
            }));
            if (lazyEl) lazyEl.remove();
        }
    };
    const unlazy = (swiper, index) => {
        if (!swiper.slides[index]) return;
        const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
        if (imageEl) imageEl.removeAttribute("loading");
    };
    const preload = swiper => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        let amount = swiper.params.lazyPreloadPrevNext;
        const len = swiper.slides.length;
        if (!len || !amount || amount < 0) return;
        amount = Math.min(amount, len);
        const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
        const activeIndex = swiper.activeIndex;
        if (swiper.params.grid && swiper.params.grid.rows > 1) {
            const activeColumn = activeIndex;
            const preloadColumns = [ activeColumn - amount ];
            preloadColumns.push(...Array.from({
                length: amount
            }).map(((_, i) => activeColumn + slidesPerView + i)));
            swiper.slides.forEach(((slideEl, i) => {
                if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
            }));
            return;
        }
        const slideIndexLastInView = activeIndex + slidesPerView - 1;
        if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
            const realIndex = (i % len + len) % len;
            if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
        } else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
    };
    function getActiveIndexByTranslate(swiper) {
        const {slidesGrid, params} = swiper;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        let activeIndex;
        for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
        } else if (translate >= slidesGrid[i]) activeIndex = i;
        if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
        return activeIndex;
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        const getVirtualRealIndex = aIndex => {
            let realIndex = aIndex - swiper.virtual.slidesBefore;
            if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
            if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
            return realIndex;
        };
        if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex && !swiper.params.loop) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
            swiper.realIndex = getVirtualRealIndex(activeIndex);
            return;
        }
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        let realIndex;
        if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (gridEnabled) {
            const firstSlideInColumn = swiper.slides.find((slideEl => slideEl.column === activeIndex));
            let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
            if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
            realIndex = Math.floor(activeSlideIndex / params.grid.rows);
        } else if (swiper.slides[activeIndex]) {
            const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
            if (slideIndex) realIndex = parseInt(slideIndex, 10); else realIndex = activeIndex;
        } else realIndex = activeIndex;
        Object.assign(swiper, {
            previousSnapIndex,
            snapIndex,
            previousRealIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        if (swiper.initialized) preload(swiper);
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) {
            if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
            swiper.emit("slideChange");
        }
    }
    function updateClickedSlide(el, path) {
        const swiper = this;
        const params = swiper.params;
        let slide = el.closest(`.${params.slideClass}, swiper-slide`);
        if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [ ...path.slice(path.indexOf(el) + 1, path.length) ].forEach((pathEl => {
            if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
        }));
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    var update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate(wrapperEl, axis);
        currentTranslate += swiper.cssOverflowAdjustment();
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) {
            if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment(); else y -= swiper.cssOverflowAdjustment();
            wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        }
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (translate === void 0) translate = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (translateBounds === void 0) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (speed === 0) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    swiper.animating = false;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    var translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) {
            swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
            swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
        }
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && dir === "reset") swiper.emit(`slideResetTransition${step}`); else if (runCallbacks && activeIndex !== previousIndex) {
            swiper.emit(`slideChangeTransition${step}`);
            if (dir === "next") swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    var transition = {
        setTransition,
        transitionStart,
        transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (index === void 0) index = 0;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index === "string") index = parseInt(index, 10);
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) return false;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(translate * 100);
            const normalizedGrid = Math.floor(slidesGrid[i] * 100);
            const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
            if (typeof slidesGrid[i + 1] !== "undefined") {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        const isInitialVirtual = isVirtual && initial;
        if (!isInitialVirtual && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if (params.effect !== "slide") swiper.setTranslate(translate);
            if (direction !== "reset") {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (speed === 0) {
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
                    swiper._cssModeVirtualInitialSet = true;
                    requestAnimationFrame((() => {
                        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                    }));
                } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._immediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        const browser = getBrowser();
        const isSafari = browser.isSafari;
        if (isVirtual && !initial && isSafari && swiper.isElement) swiper.virtual.update(false, false, slideIndex);
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (speed === 0) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (index === void 0) index = 0;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index === "string") {
            const indexAsNumber = parseInt(index, 10);
            index = indexAsNumber;
        }
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
        let newIndex = index;
        if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex += swiper.virtual.slidesBefore; else {
            let targetSlideIndex;
            if (gridEnabled) {
                const slideIndex = newIndex * swiper.params.grid.rows;
                targetSlideIndex = swiper.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)).column;
            } else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
            const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
            const {centeredSlides} = swiper.params;
            let slidesPerView = swiper.params.slidesPerView;
            if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
                slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
                if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
            }
            let needLoopFix = cols - targetSlideIndex < slidesPerView;
            if (centeredSlides) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
            if (internal && centeredSlides && swiper.params.slidesPerView !== "auto" && !gridEnabled) needLoopFix = false;
            if (needLoopFix) {
                const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
                swiper.loopFix({
                    direction,
                    slideTo: true,
                    activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
                    slideRealIndex: direction === "next" ? swiper.realIndex : void 0
                });
            }
            if (gridEnabled) {
                const slideIndex = newIndex * swiper.params.grid.rows;
                newIndex = swiper.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)).column;
            } else newIndex = swiper.getSlideIndexByData(newIndex);
        }
        requestAnimationFrame((() => {
            swiper.slideTo(newIndex, speed, runCallbacks, internal);
        }));
        return swiper;
    }
    function slideNext(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {enabled, params, animating} = swiper;
        if (!enabled || swiper.destroyed) return swiper;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        let perGroup = params.slidesPerGroup;
        if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "next"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
            if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
                requestAnimationFrame((() => {
                    swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
                }));
                return true;
            }
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params, snapGrid, slidesGrid, rtlTranslate, enabled, animating} = swiper;
        if (!enabled || swiper.destroyed) return swiper;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "prev"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        const isFreeMode = params.freeMode && params.freeMode.enabled;
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if (typeof prevSnapIndex !== "undefined") prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if (typeof prevSnap !== "undefined") {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
            requestAnimationFrame((() => {
                swiper.slideTo(prevIndex, speed, runCallbacks, internal);
            }));
            return true;
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (runCallbacks === void 0) runCallbacks = true;
        if (threshold === void 0) threshold = .5;
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        if (swiper.destroyed) return;
        const {params, slidesEl} = swiper;
        const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
        let realIndex;
        const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
        const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
            if (params.centeredSlides) swiper.slideToLoop(realIndex); else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
                swiper.loopFix();
                slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    var slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate(slideRealIndex, initial) {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
        const initSlides = () => {
            const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            slides.forEach(((el, index) => {
                el.setAttribute("data-swiper-slide-index", index);
            }));
        };
        const clearBlankSlides = () => {
            const slides = utils_elementChildren(slidesEl, `.${params.slideBlankClass}`);
            slides.forEach((el => {
                el.remove();
            }));
            if (slides.length > 0) {
                swiper.recalcSlides();
                swiper.updateSlides();
            }
        };
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) clearBlankSlides();
        const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
        const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
        const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
        const addBlankSlides = amountOfSlides => {
            for (let i = 0; i < amountOfSlides; i += 1) {
                const slideEl = swiper.isElement ? utils_createElement("swiper-slide", [ params.slideBlankClass ]) : utils_createElement("div", [ params.slideClass, params.slideBlankClass ]);
                swiper.slidesEl.append(slideEl);
            }
        };
        if (shouldFillGroup) {
            if (params.loopAddBlankSlides) {
                const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
                addBlankSlides(slidesToAdd);
                swiper.recalcSlides();
                swiper.updateSlides();
            } else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
            initSlides();
        } else if (shouldFillGrid) {
            if (params.loopAddBlankSlides) {
                const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
                addBlankSlides(slidesToAdd);
                swiper.recalcSlides();
                swiper.updateSlides();
            } else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
            initSlides();
        } else initSlides();
        swiper.loopFix({
            slideRealIndex,
            direction: params.centeredSlides ? void 0 : "next",
            initial
        });
    }
    function loopFix(_temp) {
        let {slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, initial, byController, byMousewheel} = _temp === void 0 ? {} : _temp;
        const swiper = this;
        if (!swiper.params.loop) return;
        swiper.emit("beforeLoopFix");
        const {slides, allowSlidePrev, allowSlideNext, slidesEl, params} = swiper;
        const {centeredSlides, initialSlide} = params;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        if (swiper.virtual && params.virtual.enabled) {
            if (slideTo) if (!params.centeredSlides && swiper.snapIndex === 0) swiper.slideTo(swiper.virtual.slides.length, 0, false, true); else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true); else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
            swiper.allowSlidePrev = allowSlidePrev;
            swiper.allowSlideNext = allowSlideNext;
            swiper.emit("loopFix");
            return;
        }
        let slidesPerView = params.slidesPerView;
        if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
            slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
            if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
        }
        const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
        let loopedSlides = centeredSlides ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
        if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
        loopedSlides += params.loopAdditionalSlides;
        swiper.loopedSlides = loopedSlides;
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"); else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
        const prependSlidesIndexes = [];
        const appendSlidesIndexes = [];
        const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
        const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !centeredSlides;
        let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
        if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.find((el => el.classList.contains(params.slideActiveClass)))); else activeIndex = activeSlideIndex;
        const isNext = direction === "next" || !direction;
        const isPrev = direction === "prev" || !direction;
        let slidesPrepended = 0;
        let slidesAppended = 0;
        const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
        const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
        if (activeColIndexWithShift < loopedSlides) {
            slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
            for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
                const index = i - Math.floor(i / cols) * cols;
                if (gridEnabled) {
                    const colIndexToPrepend = cols - index - 1;
                    for (let i = slides.length - 1; i >= 0; i -= 1) if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
                } else prependSlidesIndexes.push(cols - index - 1);
            }
        } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
            slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
            if (isInitialOverflow) slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
            for (let i = 0; i < slidesAppended; i += 1) {
                const index = i - Math.floor(i / cols) * cols;
                if (gridEnabled) slides.forEach(((slide, slideIndex) => {
                    if (slide.column === index) appendSlidesIndexes.push(slideIndex);
                })); else appendSlidesIndexes.push(index);
            }
        }
        swiper.__preventObserver__ = true;
        requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
        if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
            if (appendSlidesIndexes.includes(activeSlideIndex)) appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
            if (prependSlidesIndexes.includes(activeSlideIndex)) prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
        }
        if (isPrev) prependSlidesIndexes.forEach((index => {
            slides[index].swiperLoopMoveDOM = true;
            slidesEl.prepend(slides[index]);
            slides[index].swiperLoopMoveDOM = false;
        }));
        if (isNext) appendSlidesIndexes.forEach((index => {
            slides[index].swiperLoopMoveDOM = true;
            slidesEl.append(slides[index]);
            slides[index].swiperLoopMoveDOM = false;
        }));
        swiper.recalcSlides();
        if (params.slidesPerView === "auto") swiper.updateSlides(); else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach(((slide, slideIndex) => {
            swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
        }));
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
            if (typeof slideRealIndex === "undefined") {
                const currentSlideTranslate = swiper.slidesGrid[activeIndex];
                const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
                const diff = newSlideTranslate - currentSlideTranslate;
                if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                    swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
                    if (setTranslate) {
                        swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                        swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                    }
                }
            } else if (setTranslate) {
                const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
                swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
                swiper.touchEventsData.currentTranslate = swiper.translate;
            }
        } else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
            const currentSlideTranslate = swiper.slidesGrid[activeIndex];
            const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
            const diff = newSlideTranslate - currentSlideTranslate;
            if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
                if (setTranslate) {
                    swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                    swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                }
            }
        } else {
            const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.controller && swiper.controller.control && !byController) {
            const loopParams = {
                slideRealIndex,
                direction,
                setTranslate,
                activeSlideIndex,
                byController: true
            };
            if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c => {
                if (!c.destroyed && c.params.loop) c.loopFix({
                    ...loopParams,
                    slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
                });
            })); else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix({
                ...loopParams,
                slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
            });
        }
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
        swiper.recalcSlides();
        const newSlidesOrder = [];
        swiper.slides.forEach((slideEl => {
            const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
            newSlidesOrder[index] = slideEl;
        }));
        swiper.slides.forEach((slideEl => {
            slideEl.removeAttribute("data-swiper-slide-index");
        }));
        newSlidesOrder.forEach((slideEl => {
            slidesEl.append(slideEl);
        }));
        swiper.recalcSlides();
        swiper.slideTo(swiper.realIndex, 0);
    }
    var loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    var grabCursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (base === void 0) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function preventEdgeSwipe(swiper, event, startX) {
        const window = ssr_window_esm_getWindow();
        const {params} = swiper;
        const edgeSwipeDetection = params.edgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
            if (edgeSwipeDetection === "prevent") {
                event.preventDefault();
                return true;
            }
            return false;
        }
        return true;
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        const data = swiper.touchEventsData;
        if (e.type === "pointerdown") {
            if (data.pointerId !== null && data.pointerId !== e.pointerId) return;
            data.pointerId = e.pointerId;
        } else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
        if (e.type === "touchstart") {
            preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
            return;
        }
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && e.pointerType === "mouse") return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let targetEl = e.target;
        if (params.touchEventsTarget === "wrapper") if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
        if ("which" in e && e.which === 3) return;
        if ("button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
        const eventPath = e.composedPath ? e.composedPath() : e.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!targetEl.closest(params.swipeHandler)) return;
        touches.currentX = e.pageX;
        touches.currentY = e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        if (!preventEdgeSwipe(swiper, e, startX)) return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        let preventDefault = true;
        if (targetEl.matches(data.focusableElements)) {
            preventDefault = false;
            if (targetEl.nodeName === "SELECT") data.isTouched = false;
        }
        if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) document.activeElement.blur();
        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && event.pointerType === "mouse") return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (e.type === "pointermove") {
            if (data.touchId !== null) return;
            const id = e.pointerId;
            if (id !== data.pointerId) return;
        }
        let targetTouch;
        if (e.type === "touchmove") {
            targetTouch = [ ...e.changedTouches ].find((t => t.identifier === data.touchId));
            if (!targetTouch || targetTouch.identifier !== data.touchId) return;
        } else targetTouch = e;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        const pageX = targetTouch.pageX;
        const pageY = targetTouch.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) return; else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) return;
        if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== "mouse") document.activeElement.blur();
        if (document.activeElement) if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        touches.previousX = touches.currentX;
        touches.previousY = touches.currentY;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if (typeof data.isScrolling === "undefined") {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        let diff = swiper.isHorizontal() ? diffX : diffY;
        let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
        if (params.oneWayMovement) {
            diff = Math.abs(diff) * (rtl ? 1 : -1);
            touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
        }
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) {
            diff = -diff;
            touchesDiff = -touchesDiff;
        }
        const prevTouchesDirection = swiper.touchesDirection;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
        const isLoop = swiper.params.loop && !params.cssMode;
        const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
        if (!data.isMoved) {
            if (isLoop && allowLoopFix) swiper.loopFix({
                direction: swiper.swipeDirection
            });
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) {
                const evt = new window.CustomEvent("transitionend", {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        bySwiperTouchMove: true
                    }
                });
                swiper.wrapperEl.dispatchEvent(evt);
            }
            data.allowMomentumBounce = false;
            if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        let loopFixed;
        (new Date).getTime();
        if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
            Object.assign(touches, {
                startX: pageX,
                startY: pageY,
                currentX: pageX,
                currentY: pageY,
                startTranslate: data.currentTranslate
            });
            data.loopSwapReset = true;
            data.startTranslate = data.currentTranslate;
            return;
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0) {
            if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) swiper.loopFix({
                direction: "prev",
                setTranslate: true,
                activeSlideIndex: 0
            });
            if (data.currentTranslate > swiper.minTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
            }
        } else if (diff < 0) {
            if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) swiper.loopFix({
                direction: "next",
                setTranslate: true,
                activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
            });
            if (data.currentTranslate < swiper.maxTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
            }
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let targetTouch;
        const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
        if (!isTouchEvent) {
            if (data.touchId !== null) return;
            if (e.pointerId !== data.pointerId) return;
            targetTouch = e;
        } else {
            targetTouch = [ ...e.changedTouches ].find((t => t.identifier === data.touchId));
            if (!targetTouch || targetTouch.identifier !== data.touchId) return;
        }
        if ([ "pointercancel", "pointerout", "pointerleave", "contextmenu" ].includes(e.type)) {
            const proceed = [ "pointercancel", "contextmenu" ].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
            if (!proceed) return;
        }
        data.pointerId = null;
        data.touchId = null;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && e.pointerType === "mouse") return;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if (typeof slidesGrid[i + increment] !== "undefined") {
                if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (swipeToLast || currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
                if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && el.offsetWidth === 0) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        const isVirtualLoop = isVirtual && params.loop;
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
            clearTimeout(swiper.autoplay.resizeTimeout);
            swiper.autoplay.resizeTimeout = setTimeout((() => {
                if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
            }), 500);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (swiper.translate === 0) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    function onLoad(e) {
        const swiper = this;
        processLazyPreloader(swiper, e.target);
        if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
        swiper.update();
    }
    function onDocumentTouchStart() {
        const swiper = this;
        if (swiper.documentTouchHandlerProceeded) return;
        swiper.documentTouchHandlerProceeded = true;
        if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
    }
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, el, wrapperEl, device} = swiper;
        const capture = !!params.nested;
        const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!el || typeof el === "string") return;
        document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
            passive: false,
            capture
        });
        el[domMethod]("touchstart", swiper.onTouchStart, {
            passive: false
        });
        el[domMethod]("pointerdown", swiper.onTouchStart, {
            passive: false
        });
        document[domMethod]("touchmove", swiper.onTouchMove, {
            passive: false,
            capture
        });
        document[domMethod]("pointermove", swiper.onTouchMove, {
            passive: false,
            capture
        });
        document[domMethod]("touchend", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerup", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointercancel", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("touchcancel", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerout", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerleave", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("contextmenu", swiper.onTouchEnd, {
            passive: true
        });
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
        el[domMethod]("load", swiper.onLoad, {
            capture: true
        });
    };
    function attachEvents() {
        const swiper = this;
        const {params} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        swiper.onLoad = onLoad.bind(swiper);
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    var events$1 = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {realIndex, initialized, params, el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
        const document = ssr_window_esm_getDocument();
        const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
        const breakpointContainer = [ "window", "container" ].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document.querySelector(params.breakpointsBase);
        const breakpoint = swiper.getBreakpoint(breakpoints, breakpointsBase, breakpointContainer);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasGrabCursor = swiper.params.grabCursor;
        const isGrabCursor = breakpointParams.grabCursor;
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            el.classList.add(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        if (wasGrabCursor && !isGrabCursor) swiper.unsetGrabCursor(); else if (!wasGrabCursor && isGrabCursor) swiper.setGrabCursor();
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            if (typeof breakpointParams[prop] === "undefined") return;
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        const wasLoop = params.loop;
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        const hasLoop = swiper.params.loop;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (initialized) if (needsReLoop) {
            swiper.loopDestroy();
            swiper.loopCreate(realIndex);
            swiper.updateSlides();
        } else if (!wasLoop && hasLoop) {
            swiper.loopCreate(realIndex);
            swiper.updateSlides();
        } else if (wasLoop && !hasLoop) swiper.loopDestroy();
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (base === void 0) base = "window";
        if (!breakpoints || base === "container" && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if (typeof point === "string" && point.indexOf("@") === 0) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if (base === "window") {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    var breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if (typeof item === "object") Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if (typeof item === "string") resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, el, device} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        el.classList.add(...classNames);
        swiper.emitContainerClasses();
    }
    function swiper_core_removeClasses() {
        const swiper = this;
        const {el, classNames} = swiper;
        if (!el || typeof el === "string") return;
        el.classList.remove(...classNames);
        swiper.emitContainerClasses();
    }
    var classes = {
        addClasses,
        removeClasses: swiper_core_removeClasses
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = swiper.snapGrid.length === 1;
        if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
        if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    var checkOverflow$1 = {
        checkOverflow
    };
    var defaults = {
        init: true,
        direction: "horizontal",
        oneWayMovement: false,
        swiperElementNodeName: "SWIPER-CONTAINER",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        eventsPrefix: "swiper",
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 5,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        loop: false,
        loopAddBlankSlides: true,
        loopAdditionalSlides: 0,
        loopPreventsSliding: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-blank",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideFullyVisibleClass: "swiper-slide-fully-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        lazyPreloadPrevNext: 0,
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (obj === void 0) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if (typeof moduleParams !== "object" || moduleParams === null) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (params[moduleParamName] === true) params[moduleParamName] = {
                enabled: true
            };
            if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
            if ([ "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter,
        update,
        translate,
        transition,
        slide,
        loop,
        grabCursor,
        events: events$1,
        breakpoints,
        checkOverflow: checkOverflow$1,
        classes
    };
    const extendedDefaults = {};
    class swiper_core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            const document = ssr_window_esm_getDocument();
            if (params.el && typeof params.el === "string" && document.querySelectorAll(params.el).length > 1) {
                const swipers = [];
                document.querySelectorAll(params.el).forEach((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new swiper_core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    params,
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return swiper.params.direction === "horizontal";
                },
                isVertical() {
                    return swiper.params.direction === "vertical";
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                cssOverflowAdjustment() {
                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
                },
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: 0,
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    pointerId: null,
                    touchId: null
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        getDirectionLabel(property) {
            if (this.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        getSlideIndex(slideEl) {
            const {slidesEl, params} = this;
            const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            const firstSlideIndex = utils_elementIndex(slides[0]);
            return utils_elementIndex(slideEl) - firstSlideIndex;
        }
        getSlideIndexByData(index) {
            return this.getSlideIndex(this.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)));
        }
        getSlideIndexWhenGrid(index) {
            if (this.grid && this.params.grid && this.params.grid.rows > 1) if (this.params.grid.fill === "column") index = Math.floor(index / this.params.grid.rows); else if (this.params.grid.fill === "row") index %= Math.ceil(this.slides.length / this.params.grid.rows);
            return index;
        }
        recalcSlides() {
            const swiper = this;
            const {slidesEl, params} = swiper;
            swiper.slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0)).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.forEach((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (view === void 0) view = "current";
            if (exact === void 0) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (typeof params.slidesPerView === "number") return params.slidesPerView;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += Math.ceil(slides[i].swiperSlideSize);
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if (view === "current") for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl);
            }));
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
                setTranslate();
                if (params.autoHeight) swiper.updateAutoHeight();
            } else {
                if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
                    const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
                    translated = swiper.slideTo(slides.length - 1, 0, false, true);
                } else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (needUpdate === void 0) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
            if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
            swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
            swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.forEach((slideEl => {
                if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
            swiper.rtl = direction === "rtl";
            swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
            if (swiper.rtl) {
                swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(element) {
            const swiper = this;
            if (swiper.mounted) return true;
            let el = element || swiper.params.el;
            if (typeof el === "string") el = document.querySelector(el);
            if (!el) return false;
            el.swiper = swiper;
            if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = el.shadowRoot.querySelector(getWrapperSelector());
                    return res;
                }
                return utils_elementChildren(el, getWrapperSelector())[0];
            };
            let wrapperEl = getWrapper();
            if (!wrapperEl && swiper.params.createElements) {
                wrapperEl = utils_createElement("div", swiper.params.wrapperClass);
                el.append(wrapperEl);
                utils_elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
                    wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                el,
                wrapperEl,
                slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
                hostEl: swiper.isElement ? el.parentNode.host : el,
                mounted: true,
                rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
                rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
                wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (mounted === false) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            if (swiper.params.loop) swiper.loopCreate(void 0, true);
            swiper.attachEvents();
            const lazyElements = [ ...swiper.el.querySelectorAll('[loading="lazy"]') ];
            if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
            lazyElements.forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl); else imageEl.addEventListener("load", (e => {
                    processLazyPreloader(swiper, e.target);
                }));
            }));
            preload(swiper);
            swiper.initialized = true;
            preload(swiper);
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (deleteInstance === void 0) deleteInstance = true;
            if (cleanStyles === void 0) cleanStyles = true;
            const swiper = this;
            const {params, el, wrapperEl, slides} = swiper;
            if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                if (el && typeof el !== "string") el.removeAttribute("style");
                if (wrapperEl) wrapperEl.removeAttribute("style");
                if (slides && slides.length) slides.forEach((slideEl => {
                    slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
                    slideEl.removeAttribute("style");
                    slideEl.removeAttribute("data-swiper-slide-index");
                }));
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (deleteInstance !== false) {
                if (swiper.el && typeof swiper.el !== "string") swiper.el.swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!swiper_core_Swiper.prototype.__modules__) swiper_core_Swiper.prototype.__modules__ = [];
            const modules = swiper_core_Swiper.prototype.__modules__;
            if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => swiper_core_Swiper.installModule(m)));
                return swiper_core_Swiper;
            }
            swiper_core_Swiper.installModule(module);
            return swiper_core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            swiper_core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    swiper_core_Swiper.use([ Resize, Observer ]);
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && params.auto === true) {
                let element = utils_elementChildren(swiper.el, `.${checkProps[key]}`)[0];
                if (!element) {
                    element = utils_createElement("div", checkProps[key]);
                    element.className = checkProps[key];
                    swiper.el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            prevEl: null
        };
        function getEl(el) {
            let res;
            if (el && typeof el === "string" && swiper.isElement) {
                res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
                if (res) return res;
            }
            if (el) {
                if (typeof el === "string") res = [ ...document.querySelectorAll(el) ];
                if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el); else if (res && res.length === 1) res = res[0];
            }
            if (el && !res) return el;
            return res;
        }
        function toggleEl(el, disabled) {
            const params = swiper.params.navigation;
            el = utils_makeElementsArray(el);
            el.forEach((subEl => {
                if (subEl) {
                    subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
                    if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
                    if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
                }
            }));
        }
        function update() {
            const {nextEl, prevEl} = swiper.navigation;
            if (swiper.params.loop) {
                toggleEl(prevEl, false);
                toggleEl(nextEl, false);
                return;
            }
            toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            let nextEl = getEl(params.nextEl);
            let prevEl = getEl(params.prevEl);
            Object.assign(swiper.navigation, {
                nextEl,
                prevEl
            });
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const initButton = (el, dir) => {
                if (el) el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
            };
            nextEl.forEach((el => initButton(el, "next")));
            prevEl.forEach((el => initButton(el, "prev")));
        }
        function destroy() {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const destroyButton = (el, dir) => {
                el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
            };
            nextEl.forEach((el => destroyButton(el, "next")));
            prevEl.forEach((el => destroyButton(el, "prev")));
        }
        on("init", (() => {
            if (swiper.params.navigation.enabled === false) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            if (swiper.enabled) {
                update();
                return;
            }
            [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.add(swiper.params.navigation.lockClass)));
        }));
        on("click", ((_s, e) => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const targetEl = e.target;
            let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
            if (swiper.isElement && !targetIsButton) {
                const path = e.path || e.composedPath && e.composedPath();
                if (path) targetIsButton = path.find((pathEl => nextEl.includes(pathEl) || prevEl.includes(pathEl)));
            }
            if (swiper.params.navigation.hideOnClick && !targetIsButton) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass); else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
                if (isHidden === true) emit("navigationShow"); else emit("navigationHide");
                [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
            }
        }));
        const enable = () => {
            swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
            init();
            update();
        };
        const disable = () => {
            swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function classes_to_selector_classesToSelector(classes) {
        if (classes === void 0) classes = "";
        return `.${classes.trim().replace(/([\.:!+\/()[\]])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
        }
        function setSideBullets(bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            if (!bulletEl) return;
            bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
            if (bulletEl) {
                bulletEl.classList.add(`${bulletActiveClass}-${position}`);
                bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
                if (bulletEl) bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
            }
        }
        function getMoveDirection(prevIndex, nextIndex, length) {
            prevIndex %= length;
            nextIndex %= length;
            if (nextIndex === prevIndex + 1) return "next"; else if (nextIndex === prevIndex - 1) return "previous";
            return;
        }
        function onBulletClick(e) {
            const bulletEl = e.target.closest(classes_to_selector_classesToSelector(swiper.params.pagination.bulletClass));
            if (!bulletEl) return;
            e.preventDefault();
            const index = utils_elementIndex(bulletEl) * swiper.params.slidesPerGroup;
            if (swiper.params.loop) {
                if (swiper.realIndex === index) return;
                const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
                if (moveDirection === "next") swiper.slideNext(); else if (moveDirection === "previous") swiper.slidePrev(); else swiper.slideToLoop(index);
            } else swiper.slideTo(index);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            let el = swiper.pagination.el;
            el = utils_makeElementsArray(el);
            let current;
            let previousIndex;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                previousIndex = swiper.previousRealIndex || 0;
                current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
            } else if (typeof swiper.snapIndex !== "undefined") {
                current = swiper.snapIndex;
                previousIndex = swiper.previousSnapIndex;
            } else {
                previousIndex = swiper.previousIndex || 0;
                current = swiper.activeIndex || 0;
            }
            if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
                    el.forEach((subEl => {
                        subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
                    }));
                    if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
                        dynamicBulletIndex += current - (previousIndex || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.forEach((bulletEl => {
                    const classesToRemove = [ ...[ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)) ].map((s => typeof s === "string" && s.includes(" ") ? s.split(" ") : s)).flat();
                    bulletEl.classList.remove(...classesToRemove);
                }));
                if (el.length > 1) bullets.forEach((bullet => {
                    const bulletIndex = utils_elementIndex(bullet);
                    if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" ")); else if (swiper.isElement) bullet.setAttribute("part", "bullet");
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                        if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
                    }
                })); else {
                    const bullet = bullets[current];
                    if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
                    if (swiper.isElement) bullets.forEach(((bulletEl, bulletIndex) => {
                        bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
                    }));
                    if (params.dynamicBullets) {
                        const firstDisplayedBullet = bullets[firstIndex];
                        const lastDisplayedBullet = bullets[lastIndex];
                        for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                        setSideBullets(firstDisplayedBullet, "prev");
                        setSideBullets(lastDisplayedBullet, "next");
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.forEach((bullet => {
                        bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
                    }));
                }
            }
            el.forEach(((subEl, subElIndex) => {
                if (params.type === "fraction") {
                    subEl.querySelectorAll(classes_to_selector_classesToSelector(params.currentClass)).forEach((fractionEl => {
                        fractionEl.textContent = params.formatFractionCurrent(current + 1);
                    }));
                    subEl.querySelectorAll(classes_to_selector_classesToSelector(params.totalClass)).forEach((totalEl => {
                        totalEl.textContent = params.formatFractionTotal(total);
                    }));
                }
                if (params.type === "progressbar") {
                    let progressbarDirection;
                    if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                    const scale = (current + 1) / total;
                    let scaleX = 1;
                    let scaleY = 1;
                    if (progressbarDirection === "horizontal") scaleX = scale; else scaleY = scale;
                    subEl.querySelectorAll(classes_to_selector_classesToSelector(params.progressbarFillClass)).forEach((progressEl => {
                        progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
                        progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
                    }));
                }
                if (params.type === "custom" && params.renderCustom) {
                    utils_setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
                    if (subElIndex === 0) emit("paginationRender", subEl);
                } else {
                    if (subElIndex === 0) emit("paginationRender", subEl);
                    emit("paginationUpdate", subEl);
                }
                if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
            }));
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
            let el = swiper.pagination.el;
            el = utils_makeElementsArray(el);
            let paginationHTML = "";
            if (params.type === "bullets") {
                let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
            }
            if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
            if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
            swiper.pagination.bullets = [];
            el.forEach((subEl => {
                if (params.type !== "custom") utils_setInnerHTML(subEl, paginationHTML || "");
                if (params.type === "bullets") swiper.pagination.bullets.push(...subEl.querySelectorAll(classes_to_selector_classesToSelector(params.bulletClass)));
            }));
            if (params.type !== "custom") emit("paginationRender", el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let el;
            if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
            if (!el && typeof params.el === "string") el = [ ...document.querySelectorAll(params.el) ];
            if (!el) el = params.el;
            if (!el || el.length === 0) return;
            if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
                el = [ ...swiper.el.querySelectorAll(params.el) ];
                if (el.length > 1) el = el.find((subEl => {
                    if (utils_elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if (Array.isArray(el) && el.length === 1) el = el[0];
            Object.assign(swiper.pagination, {
                el
            });
            el = utils_makeElementsArray(el);
            el.forEach((subEl => {
                if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
                subEl.classList.add(params.modifierClass + params.type);
                subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
                if (params.type === "bullets" && params.dynamicBullets) {
                    subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
                    dynamicBulletIndex = 0;
                    if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
                }
                if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
                if (params.clickable) subEl.addEventListener("click", onBulletClick);
                if (!swiper.enabled) subEl.classList.add(params.lockClass);
            }));
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            let el = swiper.pagination.el;
            if (el) {
                el = utils_makeElementsArray(el);
                el.forEach((subEl => {
                    subEl.classList.remove(params.hiddenClass);
                    subEl.classList.remove(params.modifierClass + params.type);
                    subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
                    if (params.clickable) {
                        subEl.classList.remove(...(params.clickableClass || "").split(" "));
                        subEl.removeEventListener("click", onBulletClick);
                    }
                }));
            }
            if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl => subEl.classList.remove(...params.bulletActiveClass.split(" "))));
        }
        on("changeDirection", (() => {
            if (!swiper.pagination || !swiper.pagination.el) return;
            const params = swiper.params.pagination;
            let {el} = swiper.pagination;
            el = utils_makeElementsArray(el);
            el.forEach((subEl => {
                subEl.classList.remove(params.horizontalClass, params.verticalClass);
                subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            }));
        }));
        on("init", (() => {
            if (swiper.params.pagination.enabled === false) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (typeof swiper.snapIndex === "undefined") update();
        }));
        on("snapIndexChange", (() => {
            update();
        }));
        on("snapGridLengthChange", (() => {
            render();
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            let {el} = swiper.pagination;
            if (el) {
                el = utils_makeElementsArray(el);
                el.forEach((subEl => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass)));
            }
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const el = utils_makeElementsArray(swiper.pagination.el);
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
                if (isHidden === true) emit("paginationShow"); else emit("paginationHide");
                el.forEach((subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass)));
            }
        }));
        const enable = () => {
            swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
            let {el} = swiper.pagination;
            if (el) {
                el = utils_makeElementsArray(el);
                el.forEach((subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass)));
            }
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
            let {el} = swiper.pagination;
            if (el) {
                el = utils_makeElementsArray(el);
                el.forEach((subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass)));
            }
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Parallax(_ref) {
        let {swiper, extendParams, on} = _ref;
        extendParams({
            parallax: {
                enabled: false
            }
        });
        const elementsSelector = "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]";
        const setTransform = (el, progress) => {
            const {rtl} = swiper;
            const rtlFactor = rtl ? -1 : 1;
            const p = el.getAttribute("data-swiper-parallax") || "0";
            let x = el.getAttribute("data-swiper-parallax-x");
            let y = el.getAttribute("data-swiper-parallax-y");
            const scale = el.getAttribute("data-swiper-parallax-scale");
            const opacity = el.getAttribute("data-swiper-parallax-opacity");
            const rotate = el.getAttribute("data-swiper-parallax-rotate");
            if (x || y) {
                x = x || "0";
                y = y || "0";
            } else if (swiper.isHorizontal()) {
                x = p;
                y = "0";
            } else {
                y = p;
                x = "0";
            }
            if (x.indexOf("%") >= 0) x = `${parseInt(x, 10) * progress * rtlFactor}%`; else x = `${x * progress * rtlFactor}px`;
            if (y.indexOf("%") >= 0) y = `${parseInt(y, 10) * progress}%`; else y = `${y * progress}px`;
            if (typeof opacity !== "undefined" && opacity !== null) {
                const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
                el.style.opacity = currentOpacity;
            }
            let transform = `translate3d(${x}, ${y}, 0px)`;
            if (typeof scale !== "undefined" && scale !== null) {
                const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
                transform += ` scale(${currentScale})`;
            }
            if (rotate && typeof rotate !== "undefined" && rotate !== null) {
                const currentRotate = rotate * progress * -1;
                transform += ` rotate(${currentRotate}deg)`;
            }
            el.style.transform = transform;
        };
        const setTranslate = () => {
            const {el, slides, progress, snapGrid, isElement} = swiper;
            const elements = utils_elementChildren(el, elementsSelector);
            if (swiper.isElement) elements.push(...utils_elementChildren(swiper.hostEl, elementsSelector));
            elements.forEach((subEl => {
                setTransform(subEl, progress);
            }));
            slides.forEach(((slideEl, slideIndex) => {
                let slideProgress = slideEl.progress;
                if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== "auto") slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
                slideProgress = Math.min(Math.max(slideProgress, -1), 1);
                slideEl.querySelectorAll(`${elementsSelector}, [data-swiper-parallax-rotate]`).forEach((subEl => {
                    setTransform(subEl, slideProgress);
                }));
            }));
        };
        const setTransition = function(duration) {
            if (duration === void 0) duration = swiper.params.speed;
            const {el, hostEl} = swiper;
            const elements = [ ...el.querySelectorAll(elementsSelector) ];
            if (swiper.isElement) elements.push(...hostEl.querySelectorAll(elementsSelector));
            elements.forEach((parallaxEl => {
                let parallaxDuration = parseInt(parallaxEl.getAttribute("data-swiper-parallax-duration"), 10) || duration;
                if (duration === 0) parallaxDuration = 0;
                parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
            }));
        };
        on("beforeInit", (() => {
            if (!swiper.params.parallax.enabled) return;
            swiper.params.watchSlidesProgress = true;
            swiper.originalParams.watchSlidesProgress = true;
        }));
        on("init", (() => {
            if (!swiper.params.parallax.enabled) return;
            setTranslate();
        }));
        on("setTranslate", (() => {
            if (!swiper.params.parallax.enabled) return;
            setTranslate();
        }));
        on("setTransition", ((_swiper, duration) => {
            if (!swiper.params.parallax.enabled) return;
            setTransition(duration);
        }));
    }
    function Autoplay(_ref) {
        let {swiper, extendParams, on, emit, params} = _ref;
        swiper.autoplay = {
            running: false,
            paused: false,
            timeLeft: 0
        };
        extendParams({
            autoplay: {
                enabled: false,
                delay: 3e3,
                waitForTransition: true,
                disableOnInteraction: false,
                stopOnLastSlide: false,
                reverseDirection: false,
                pauseOnMouseEnter: false
            }
        });
        let timeout;
        let raf;
        let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
        let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
        let autoplayTimeLeft;
        let autoplayStartTime = (new Date).getTime();
        let wasPaused;
        let isTouched;
        let pausedByTouch;
        let touchStartTimeout;
        let slideChanged;
        let pausedByInteraction;
        let pausedByPointerEnter;
        function onTransitionEnd(e) {
            if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
            if (e.target !== swiper.wrapperEl) return;
            swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
            if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) return;
            resume();
        }
        const calcTimeLeft = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (swiper.autoplay.paused) wasPaused = true; else if (wasPaused) {
                autoplayDelayCurrent = autoplayTimeLeft;
                wasPaused = false;
            }
            const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (new Date).getTime();
            swiper.autoplay.timeLeft = timeLeft;
            emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
            raf = requestAnimationFrame((() => {
                calcTimeLeft();
            }));
        };
        const getSlideDelay = () => {
            let activeSlideEl;
            if (swiper.virtual && swiper.params.virtual.enabled) activeSlideEl = swiper.slides.find((slideEl => slideEl.classList.contains("swiper-slide-active"))); else activeSlideEl = swiper.slides[swiper.activeIndex];
            if (!activeSlideEl) return;
            const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
            return currentSlideDelay;
        };
        const run = delayForce => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            cancelAnimationFrame(raf);
            calcTimeLeft();
            let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
            autoplayDelayTotal = swiper.params.autoplay.delay;
            autoplayDelayCurrent = swiper.params.autoplay.delay;
            const currentSlideDelay = getSlideDelay();
            if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
                delay = currentSlideDelay;
                autoplayDelayTotal = currentSlideDelay;
                autoplayDelayCurrent = currentSlideDelay;
            }
            autoplayTimeLeft = delay;
            const speed = swiper.params.speed;
            const proceed = () => {
                if (!swiper || swiper.destroyed) return;
                if (swiper.params.autoplay.reverseDirection) {
                    if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
                        swiper.slidePrev(speed, true, true);
                        emit("autoplay");
                    } else if (!swiper.params.autoplay.stopOnLastSlide) {
                        swiper.slideTo(swiper.slides.length - 1, speed, true, true);
                        emit("autoplay");
                    }
                } else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
                    swiper.slideNext(speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    swiper.slideTo(0, speed, true, true);
                    emit("autoplay");
                }
                if (swiper.params.cssMode) {
                    autoplayStartTime = (new Date).getTime();
                    requestAnimationFrame((() => {
                        run();
                    }));
                }
            };
            if (delay > 0) {
                clearTimeout(timeout);
                timeout = setTimeout((() => {
                    proceed();
                }), delay);
            } else requestAnimationFrame((() => {
                proceed();
            }));
            return delay;
        };
        const start = () => {
            autoplayStartTime = (new Date).getTime();
            swiper.autoplay.running = true;
            run();
            emit("autoplayStart");
        };
        const stop = () => {
            swiper.autoplay.running = false;
            clearTimeout(timeout);
            cancelAnimationFrame(raf);
            emit("autoplayStop");
        };
        const pause = (internal, reset) => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            clearTimeout(timeout);
            if (!internal) pausedByInteraction = true;
            const proceed = () => {
                emit("autoplayPause");
                if (swiper.params.autoplay.waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd); else resume();
            };
            swiper.autoplay.paused = true;
            if (reset) {
                if (slideChanged) autoplayTimeLeft = swiper.params.autoplay.delay;
                slideChanged = false;
                proceed();
                return;
            }
            const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
            autoplayTimeLeft = delay - ((new Date).getTime() - autoplayStartTime);
            if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
            if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
            proceed();
        };
        const resume = () => {
            if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
            autoplayStartTime = (new Date).getTime();
            if (pausedByInteraction) {
                pausedByInteraction = false;
                run(autoplayTimeLeft);
            } else run();
            swiper.autoplay.paused = false;
            emit("autoplayResume");
        };
        const onVisibilityChange = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            const document = ssr_window_esm_getDocument();
            if (document.visibilityState === "hidden") {
                pausedByInteraction = true;
                pause(true);
            }
            if (document.visibilityState === "visible") resume();
        };
        const onPointerEnter = e => {
            if (e.pointerType !== "mouse") return;
            pausedByInteraction = true;
            pausedByPointerEnter = true;
            if (swiper.animating || swiper.autoplay.paused) return;
            pause(true);
        };
        const onPointerLeave = e => {
            if (e.pointerType !== "mouse") return;
            pausedByPointerEnter = false;
            if (swiper.autoplay.paused) resume();
        };
        const attachMouseEvents = () => {
            if (swiper.params.autoplay.pauseOnMouseEnter) {
                swiper.el.addEventListener("pointerenter", onPointerEnter);
                swiper.el.addEventListener("pointerleave", onPointerLeave);
            }
        };
        const detachMouseEvents = () => {
            if (swiper.el && typeof swiper.el !== "string") {
                swiper.el.removeEventListener("pointerenter", onPointerEnter);
                swiper.el.removeEventListener("pointerleave", onPointerLeave);
            }
        };
        const attachDocumentEvents = () => {
            const document = ssr_window_esm_getDocument();
            document.addEventListener("visibilitychange", onVisibilityChange);
        };
        const detachDocumentEvents = () => {
            const document = ssr_window_esm_getDocument();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
        on("init", (() => {
            if (swiper.params.autoplay.enabled) {
                attachMouseEvents();
                attachDocumentEvents();
                start();
            }
        }));
        on("destroy", (() => {
            detachMouseEvents();
            detachDocumentEvents();
            if (swiper.autoplay.running) stop();
        }));
        on("_freeModeStaticRelease", (() => {
            if (pausedByTouch || pausedByInteraction) resume();
        }));
        on("_freeModeNoMomentumRelease", (() => {
            if (!swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
        }));
        on("beforeTransitionStart", ((_s, speed, internal) => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (internal || !swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
        }));
        on("sliderFirstMove", (() => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (swiper.params.autoplay.disableOnInteraction) {
                stop();
                return;
            }
            isTouched = true;
            pausedByTouch = false;
            pausedByInteraction = false;
            touchStartTimeout = setTimeout((() => {
                pausedByInteraction = true;
                pausedByTouch = true;
                pause(true);
            }), 200);
        }));
        on("touchEnd", (() => {
            if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
            clearTimeout(touchStartTimeout);
            clearTimeout(timeout);
            if (swiper.params.autoplay.disableOnInteraction) {
                pausedByTouch = false;
                isTouched = false;
                return;
            }
            if (pausedByTouch && swiper.params.cssMode) resume();
            pausedByTouch = false;
            isTouched = false;
        }));
        on("slideChange", (() => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            slideChanged = true;
        }));
        Object.assign(swiper.autoplay, {
            start,
            stop,
            pause,
            resume
        });
    }
    function initSliders() {
        if (document.querySelector(".slider__slider")) new swiper_core_Swiper(".slider__slider", {
            modules: [ Navigation, Pagination, Parallax, Autoplay ],
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 40,
            watchOverflow: true,
            speed: 800,
            initialSlide: 1,
            autoplay: {
                delay: 9e3,
                disableOnInteraction: true
            },
            parallax: true,
            pagination: {
                el: ".controls-slider-main__dots",
                clickable: true
            },
            navigation: {
                prevEl: ".controls-slider-main__arrows .slider-arrow_prev",
                nextEl: ".controls-slider-main__arrows .slider-arrow_next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    autoHeight: true,
                    spaceBetween: 32
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 32
                },
                992: {
                    slidesPerView: "auto"
                },
                1268: {
                    slidesPerView: "auto"
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function() {
        initSliders();
    }));
    class parallax_Parallax {
        constructor(elements) {
            if (elements.length) this.elements = Array.from(elements).map((el => new parallax_Parallax.Each(el, this.options)));
        }
        destroyEvents() {
            this.elements.forEach((el => {
                el.destroyEvents();
            }));
        }
        setEvents() {
            this.elements.forEach((el => {
                el.setEvents();
            }));
        }
    }
    parallax_Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll("[data-prlx]");
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent
            };
            const centerPoint = this.parent.dataset.prlxCenter ? this.parent.dataset.prlxCenter : "center";
            if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
              case "top":
                this.offset = -1 * topToWindow;
                break;

              case "center":
                this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
                break;

              case "bottom":
                this.offset = heightWindow - (topToWindow + heightParent);
                break;
            }
            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);
            this.elements.forEach((el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : "v",
                    direction: el.dataset.direction ? el.dataset.direction + "1" : "-1",
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : ""
                };
                this.parameters(el, parameters);
            }));
        }
        parameters(el, parameters) {
            if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`; else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    };
    if (document.querySelectorAll("[data-prlx-parent]")) modules_flsModules.parallax = new parallax_Parallax(document.querySelectorAll("[data-prlx-parent]"));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    function createInitialProducts() {
        const initialProducts = [ {
            title: "Плазмотрон ВПР-210м<br> в сборе",
            article: "210-01",
            image: "img/plazmotron/vpr-210m.webp",
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-210m для плазменной резки металлов",
            description: "Ремонтный комплект для горелок серии Фламинго",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-210m.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-402м<br> в сборе",
            article: "402-01",
            image: "img/plazmotron/vpr-402m.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-402м для плазменной резки металлов",
            description: "Профессиональная горелка для плазменной резки с увеличенным ресурсом",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-402m.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-410<br> в сборе",
            article: "410-01",
            image: "img/plazmotron/vpr-410.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-410 для плазменной резки металлов",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-410.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-210м<br> без распределителя",
            article: "210-02",
            image: "img/plazmotron/vpr-210-golovka.webp",
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-210m для плазменной резки металлов",
            description: "Ремонтный комплект для горелок серии Фламинго",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-210m.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-402м<br> без распределителя",
            article: "402-02",
            image: "img/plazmotron/vpr-402-golovka.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-402м для плазменной резки металлов",
            description: "Профессиональная горелка для плазменной резки с увеличенным ресурсом",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-402m.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-410<br> без распределителя",
            article: "410-02",
            image: "img/plazmotron/vpr-410-golovka.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-410 для плазменной резки металлов",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-410.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-150/400<br> в сборе",
            article: "150-01/400-01",
            image: "img/plazmotron/vpr-150-400.webp",
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм", "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Плазмотрон ВПР-410 для плазменной резки металлов",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-150-400.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-450р ручной",
            article: "450-01",
            image: "img/plazmotron/vpr-450.webp",
            sizes: [ "10 м", "20 м" ],
            sizeLabel: "Длина кабеля:",
            alt: "Плазмотрон для ручной резки металлов",
            description: "Плазмотрон для плазменной ручной резки металлов",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-450.html",
            category: "Плазмотроны"
        }, {
            title: "Сопло плазменное 210",
            article: "1512",
            image: "img/cards/soplo-210_2.webp",
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 210 для тонкой резки",
            description: "Сопла малого диаметра для точной резки тонколистового металла",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 402",
            article: "402011",
            image: "img/cards/soplo-402.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 402 для резки цветных металлов",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 410",
            article: "410011",
            image: "img/cards/soplo-410_2.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 410 для плазмотрона",
            description: "Сопла для плазменной резки серии 410",
            category: "Сопла"
        }, {
            title: "Сопло ВПР-400",
            article: "4012",
            image: "img/cards/soplo-400.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло ВПР-400",
            description: "Сопло для плазмотрона ВПР-400",
            category: "Сопла"
        }, {
            title: "Корпус сопла ВПР-210М",
            article: "210020",
            image: "img/cards/korpus-sopla-210.webp",
            alt: "Корпус сопла ВПР-210М",
            description: "Корпус сопла для плазмотрона ВПР-210м",
            category: "Комплектующие"
        }, {
            title: "Электрод для плазмотрона",
            article: "1514",
            image: "img/cards/electrod-ag.webp",
            sizes: [ "Гафний", "Серебро" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Электрод для плазмотрона конусный ЭП-03",
            article: "4014",
            image: "img/cards/electrod.webp",
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Электрод для плазмотрона резьбовой ЭП-05",
            article: "4014",
            image: "img/cards/electrod-rezba.webp",
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Электроды"
        }, {
            title: "Корпус с изоляционной втулкой ВПР-410",
            article: "410008",
            image: "img/cards/korpus-410.webp",
            alt: "Корпус для плазмотрона ВПР-410",
            description: "Корпус с изоляционной втулкой для плазмотрона ВПР-410",
            category: "Комплектующие"
        }, {
            title: "Корпус с изоляционной втулкой ВПР-400/402м",
            article: "4009",
            image: "img/cards/korpus-402-210.webp",
            alt: "Корпус для плазмотрона ВПР-402/400",
            description: "Корпус с изоляционной втулкой для плазмотрона ВПР-402/400",
            category: "Комплектующие"
        }, {
            title: "Гайка сопловая ВПР-210м/400/402м",
            article: "402007",
            image: "img/cards/gaika-402.webp",
            alt: "Гайка сопловая для плазмотронов ВПР-210м/402/400",
            description: "Гайка сопловая для плазмотронов ВПР-210м/402/400",
            category: "Комплектующие"
        }, {
            title: "Гайка изолятора",
            article: "4006",
            image: "img/cards/gaika-izol.webp",
            alt: "Гайка изолятора для плазмотрона",
            description: "Гайка изолятора для плазмотронов ВПР-150/210м/402/400/410",
            category: "Комплектующие"
        }, {
            title: "Гайка сопловая",
            article: "4013",
            image: "img/cards/gaika-150.webp",
            sizes: [ "Основная", "Усиленная", "Угловой рез" ],
            sizeLabel: "Тип:",
            alt: "Гайка",
            description: "Гайка",
            category: "Комплектующие"
        }, {
            title: "Гайка присоединительная",
            article: "4002",
            image: "img/cards/gaika-prisoed.webp",
            alt: "Гайка присоединительная",
            description: "Гайка присоединительная для плазмотрона",
            category: "Комплектующие"
        }, {
            title: "Распределитель (силовой токоподвод)",
            article: "4001",
            image: "img/cards/raspredelitel.webp",
            alt: "Распределитель (силовой токоподвод) для плазмотрона",
            description: "Распределитель для плазмотронов ВПР-150/210м/402/400/410",
            category: "Комплектующие"
        }, {
            title: "Изолятор",
            article: "4007",
            image: "img/cards/izolator.webp",
            alt: "Изолятор для плазмотрона",
            description: "Изолятор для плазмотронов ВПР-150/210м/402/400/410",
            category: "Комплектующие"
        }, {
            title: "Электрододержатель ВПР-400/402м/410",
            article: "4003",
            image: "img/cards/zavihritel.webp",
            sizes: [ "Конус", "Резьба" ],
            sizeLabel: "Тип:",
            alt: "Электрододержатель ВПР-400/402м/410",
            description: "Электрододержатель/Завихритель для плазмотронов ВПР-400/402м/410",
            category: "Комплектующие"
        }, {
            title: "Электрододержатель ВПР-150/210м",
            article: "1503",
            image: "img/cards/zavihritel-210.webp",
            alt: "Электрододержатель ВПР-150/210м",
            description: "Электрододержатель/Завихритель для плазмотронов ВПР-150/210м",
            category: "Комплектующие"
        }, {
            title: "Кольцо изоляционное",
            article: "4005",
            image: "img/cards/kolltso-izolatora.webp",
            alt: "Кольцо изоляционное",
            description: "Кольцо изоляционное для плазмотрона",
            category: "Комплектующие"
        }, {
            title: "Изолятор ВПР-450Р",
            article: "450003",
            image: "img/cards/izolator-450.webp",
            alt: "Изолятор ВПР-450Р",
            description: "Изолятор ВПР-450Р для плазмотрона ВПР-450Р",
            category: "Комплектующие"
        }, {
            title: "Втулка сопла ВПР-450Р",
            article: "450009",
            image: "img/cards/vtulka-sopla-450.webp",
            alt: "Втулка сопла ВПР-450Р",
            description: "Втулка сопла ВПР-450Р для плазмотрона ВПР-450Р",
            category: "Комплектующие"
        }, {
            title: "Втулка сопла ВПР-150/210м",
            article: "1510",
            image: "img/cards/vtulka-sopla-210-150.webp",
            alt: "Втулка сопла для ВПР-150/210м",
            description: "Втулка сопла для плазмотронов ВПР-150/210м",
            category: "Комплектующие"
        }, {
            title: "Втулка сопла ВПР-400/402м",
            article: "4010-01",
            image: "img/cards/vtulka-sopla-402-400.webp",
            alt: "Втулка сопла ВПР-400/402м",
            description: "Втулка сопла для плазмотронов ВПР-400/402м",
            category: "Комплектующие"
        }, {
            title: "Втулка сопла (самоуплотняющаяся) ВПР-410",
            article: "410009-02",
            image: "img/cards/vtulka-sopla-su-410.webp",
            alt: "Втулка сопла (самоуплотняющаяся) ВПР-410",
            description: "Втулка сопла (самоуплотняющаяся) для плазмотрона ВПР-410",
            category: "Комплектующие"
        }, {
            title: "Втулка сопла ВПР-410",
            article: "410009-01",
            image: "img/cards/vtulka-sopla-410.webp",
            alt: "Втулка сопла ВПР-410",
            description: "Втулка сопла для плазмотрона ВПР-410",
            category: "Комплектующие"
        }, {
            title: "Кольцо защитное 450Р",
            article: "450017",
            image: "img/cards/koltso-450.webp",
            alt: "Кольцо защитное 450Р",
            description: "Кольцо защитное для плазмотрона ВПР-450Р",
            category: "Комплектующие"
        }, {
            title: "Втулка изоляционная ВПР-410",
            article: "410010",
            image: "img/cards/vtulka-izol-410.webp",
            alt: "Втулка изоляционная ВПР-410",
            description: "Втулка изоляционная для плазмотрона ВПР-410",
            category: "Комплектующие"
        }, {
            title: "Втулка изоляционная ВПР-150/210м/400/402м",
            article: "4008",
            image: "img/cards/vtulka-izol-402-210.webp",
            alt: "Втулка изоляционная ВПР-150/210м/400/402м",
            description: "Втулка изоляционная для плазмотронов ВПР-150/210м/400/402м",
            category: "Комплектующие"
        }, {
            title: "Прокладка",
            article: "4015",
            image: "img/cards/prokladka.webp",
            alt: "Прокладка",
            description: "Прокладка для плазмотронов ВПР-150/210м/402/400/410",
            category: "Комплектующие"
        }, {
            title: "Кольца уплотнительные",
            article: "4016-4020",
            image: "img/cards/koltsa.webp",
            sizes: [ "09х13", "12х16", "18х22", "20х24", "30х35", "32х38", "36х41" ],
            sizeLabel: "Размер:",
            alt: "Ремкомплект для плазменной горелки",
            description: "Ремонтный комплект для горелок серии Фламинго",
            category: "Комплектующие"
        }, {
            title: "Смазка силиконовая",
            article: "7734",
            image: "img/cards/smazka-silicot.webp",
            alt: "Смазка силиконовая",
            description: "Смазка силиконовая",
            category: "Прочее"
        }, {
            title: "Ключ универсальный",
            article: "7725",
            image: "img/cards/kluch.webp",
            alt: "Ключ универсальный",
            description: "Ключ универсальный для плазмотронов ВПР-150/210м/400/402м",
            category: "Прочее"
        }, {
            title: "Трубка",
            article: "1504-4004",
            image: "img/cards/trubka.webp",
            sizes: [ "ВПР-150/210м", "ВПР-400/402м/410" ],
            sizeLabel: "Тип:",
            alt: "Ремкомплект для плазменной горелки",
            description: "Ремонтный комплект для горелок серии Фламинго",
            category: "Комплектующие"
        } ];
        const productsData = [];
        initialProducts.forEach((product => {
            const newId = productsData.length > 0 ? Math.max(...productsData.map((p => p.id))) + 1 : 1;
            productsData.push({
                id: newId,
                ...product
            });
        }));
        return productsData;
    }
    const productsData = createInitialProducts();
    class EmailJSResponseStatus {
        constructor(_status = 0, _text = "Network Error") {
            this.status = _status;
            this.text = _text;
        }
    }
    const createWebStorage = () => {
        if (typeof localStorage === "undefined") return;
        return {
            get: key => Promise.resolve(localStorage.getItem(key)),
            set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
            remove: key => Promise.resolve(localStorage.removeItem(key))
        };
    };
    const store = {
        origin: "https://api.emailjs.com",
        blockHeadless: false,
        storageProvider: createWebStorage()
    };
    const buildOptions = options => {
        if (!options) return {};
        if (typeof options === "string") return {
            publicKey: options
        };
        if (options.toString() === "[object Object]") return options;
        return {};
    };
    const init = (options, origin = "https://api.emailjs.com") => {
        if (!options) return;
        const opts = buildOptions(options);
        store.publicKey = opts.publicKey;
        store.blockHeadless = opts.blockHeadless;
        store.storageProvider = opts.storageProvider;
        store.blockList = opts.blockList;
        store.limitRate = opts.limitRate;
        store.origin = opts.origin || origin;
    };
    const sendPost = async (url, data, headers = {}) => {
        const response = await fetch(store.origin + url, {
            method: "POST",
            headers,
            body: data
        });
        const message = await response.text();
        const responseStatus = new EmailJSResponseStatus(response.status, message);
        if (response.ok) return responseStatus;
        throw responseStatus;
    };
    const validateParams = (publicKey, serviceID, templateID) => {
        if (!publicKey || typeof publicKey !== "string") throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account";
        if (!serviceID || typeof serviceID !== "string") throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
        if (!templateID || typeof templateID !== "string") throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
    };
    const validateTemplateParams = templateParams => {
        if (templateParams && templateParams.toString() !== "[object Object]") throw "The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/";
    };
    const isHeadless = navigator => navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
    const headlessError = () => new EmailJSResponseStatus(451, "Unavailable For Headless Browser");
    const validateBlockListParams = (list, watchVariable) => {
        if (!Array.isArray(list)) throw "The BlockList list has to be an array";
        if (typeof watchVariable !== "string") throw "The BlockList watchVariable has to be a string";
    };
    const isBlockListDisabled = options => !options.list?.length || !options.watchVariable;
    const getValue = (data, name) => data instanceof FormData ? data.get(name) : data[name];
    const isBlockedValueInParams = (options, params) => {
        if (isBlockListDisabled(options)) return false;
        validateBlockListParams(options.list, options.watchVariable);
        const value = getValue(params, options.watchVariable);
        if (typeof value !== "string") return false;
        return options.list.includes(value);
    };
    const blockedEmailError = () => new EmailJSResponseStatus(403, "Forbidden");
    const validateLimitRateParams = (throttle, id) => {
        if (typeof throttle !== "number" || throttle < 0) throw "The LimitRate throttle has to be a positive number";
        if (id && typeof id !== "string") throw "The LimitRate ID has to be a non-empty string";
    };
    const getLeftTime = async (id, throttle, storage) => {
        const lastTime = Number(await storage.get(id) || 0);
        return throttle - Date.now() + lastTime;
    };
    const isLimitRateHit = async (defaultID, options, storage) => {
        if (!options.throttle || !storage) return false;
        validateLimitRateParams(options.throttle, options.id);
        const id = options.id || defaultID;
        const leftTime = await getLeftTime(id, options.throttle, storage);
        if (leftTime > 0) return true;
        await storage.set(id, Date.now().toString());
        return false;
    };
    const limitRateError = () => new EmailJSResponseStatus(429, "Too Many Requests");
    const send = async (serviceID, templateID, templateParams, options) => {
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const storageProvider = opts.storageProvider || store.storageProvider;
        const blockList = {
            ...store.blockList,
            ...opts.blockList
        };
        const limitRate = {
            ...store.limitRate,
            ...opts.limitRate
        };
        if (blockHeadless && isHeadless(navigator)) return Promise.reject(headlessError());
        validateParams(publicKey, serviceID, templateID);
        validateTemplateParams(templateParams);
        if (templateParams && isBlockedValueInParams(blockList, templateParams)) return Promise.reject(blockedEmailError());
        if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) return Promise.reject(limitRateError());
        const params = {
            lib_version: "4.4.1",
            user_id: publicKey,
            service_id: serviceID,
            template_id: templateID,
            template_params: templateParams
        };
        return sendPost("/api/v1.0/email/send", JSON.stringify(params), {
            "Content-type": "application/json"
        });
    };
    const validateForm = form => {
        if (!form || form.nodeName !== "FORM") throw "The 3rd parameter is expected to be the HTML form element or the style selector of the form";
    };
    const findHTMLForm = form => typeof form === "string" ? document.querySelector(form) : form;
    const sendForm = async (serviceID, templateID, form, options) => {
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const storageProvider = store.storageProvider || opts.storageProvider;
        const blockList = {
            ...store.blockList,
            ...opts.blockList
        };
        const limitRate = {
            ...store.limitRate,
            ...opts.limitRate
        };
        if (blockHeadless && isHeadless(navigator)) return Promise.reject(headlessError());
        const currentForm = findHTMLForm(form);
        validateParams(publicKey, serviceID, templateID);
        validateForm(currentForm);
        const formData = new FormData(currentForm);
        if (isBlockedValueInParams(blockList, formData)) return Promise.reject(blockedEmailError());
        if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) return Promise.reject(limitRateError());
        formData.append("lib_version", "4.4.1");
        formData.append("service_id", serviceID);
        formData.append("template_id", templateID);
        formData.append("user_id", publicKey);
        return sendPost("/api/v1.0/email/send-form", formData);
    };
    const es = {
        init,
        send,
        sendForm,
        EmailJSResponseStatus
    };
    function isString(str) {
        return typeof str === "string" || str instanceof String;
    }
    function core_utils_isObject(obj) {
        var _obj$constructor;
        return typeof obj === "object" && obj != null && (obj == null || (_obj$constructor = obj.constructor) == null ? void 0 : _obj$constructor.name) === "Object";
    }
    function pick(obj, keys) {
        if (Array.isArray(keys)) return pick(obj, ((_, k) => keys.includes(k)));
        return Object.entries(obj).reduce(((acc, _ref) => {
            let [k, v] = _ref;
            if (keys(v, k)) acc[k] = v;
            return acc;
        }), {});
    }
    const DIRECTION = {
        NONE: "NONE",
        LEFT: "LEFT",
        FORCE_LEFT: "FORCE_LEFT",
        RIGHT: "RIGHT",
        FORCE_RIGHT: "FORCE_RIGHT"
    };
    function forceDirection(direction) {
        switch (direction) {
          case DIRECTION.LEFT:
            return DIRECTION.FORCE_LEFT;

          case DIRECTION.RIGHT:
            return DIRECTION.FORCE_RIGHT;

          default:
            return direction;
        }
    }
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    }
    function objectIncludes(b, a) {
        if (a === b) return true;
        const arrA = Array.isArray(a), arrB = Array.isArray(b);
        let i;
        if (arrA && arrB) {
            if (a.length != b.length) return false;
            for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
            return true;
        }
        if (arrA != arrB) return false;
        if (a && b && typeof a === "object" && typeof b === "object") {
            const dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA && dateB) return a.getTime() == b.getTime();
            if (dateA != dateB) return false;
            const regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA && regexpB) return a.toString() == b.toString();
            if (regexpA != regexpB) return false;
            const keys = Object.keys(a);
            for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
            return true;
        } else if (a && b && typeof a === "function" && typeof b === "function") return a.toString() === b.toString();
        return false;
    }
    class ActionDetails {
        constructor(opts) {
            Object.assign(this, opts);
            while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) --this.oldSelection.start;
            if (this.insertedCount) while (this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end)) if (this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end) ++this.oldSelection.end; else ++this.cursorPos;
        }
        get startChangePos() {
            return Math.min(this.cursorPos, this.oldSelection.start);
        }
        get insertedCount() {
            return this.cursorPos - this.startChangePos;
        }
        get inserted() {
            return this.value.substr(this.startChangePos, this.insertedCount);
        }
        get removedCount() {
            return Math.max(this.oldSelection.end - this.startChangePos || this.oldValue.length - this.value.length, 0);
        }
        get removed() {
            return this.oldValue.substr(this.startChangePos, this.removedCount);
        }
        get head() {
            return this.value.substring(0, this.startChangePos);
        }
        get tail() {
            return this.value.substring(this.startChangePos + this.insertedCount);
        }
        get removeDirection() {
            if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
            return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
        }
    }
    function IMask(el, opts) {
        return new IMask.InputMask(el, opts);
    }
    function maskedClass(mask) {
        if (mask == null) throw new Error("mask property should be defined");
        if (mask instanceof RegExp) return IMask.MaskedRegExp;
        if (isString(mask)) return IMask.MaskedPattern;
        if (mask === Date) return IMask.MaskedDate;
        if (mask === Number) return IMask.MaskedNumber;
        if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
        if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
        if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
        if (mask instanceof Function) return IMask.MaskedFunction;
        console.warn("Mask not found for mask", mask);
        return IMask.Masked;
    }
    function normalizeOpts(opts) {
        if (!opts) throw new Error("Options in not defined");
        if (IMask.Masked) {
            if (opts.prototype instanceof IMask.Masked) return {
                mask: opts
            };
            const {mask = void 0, ...instanceOpts} = opts instanceof IMask.Masked ? {
                mask: opts
            } : core_utils_isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
            if (mask) {
                const _mask = mask.mask;
                return {
                    ...pick(mask, ((_, k) => !k.startsWith("_"))),
                    mask: mask.constructor,
                    _mask,
                    ...instanceOpts
                };
            }
        }
        if (!core_utils_isObject(opts)) return {
            mask: opts
        };
        return {
            ...opts
        };
    }
    function createMask(opts) {
        if (IMask.Masked && opts instanceof IMask.Masked) return opts;
        const nOpts = normalizeOpts(opts);
        const MaskedClass = maskedClass(nOpts.mask);
        if (!MaskedClass) throw new Error("Masked class is not found for provided mask " + nOpts.mask + ", appropriate module needs to be imported manually before creating mask.");
        if (nOpts.mask === MaskedClass) delete nOpts.mask;
        if (nOpts._mask) {
            nOpts.mask = nOpts._mask;
            delete nOpts._mask;
        }
        return new MaskedClass(nOpts);
    }
    IMask.createMask = createMask;
    class MaskElement {
        get selectionStart() {
            let start;
            try {
                start = this._unsafeSelectionStart;
            } catch {}
            return start != null ? start : this.value.length;
        }
        get selectionEnd() {
            let end;
            try {
                end = this._unsafeSelectionEnd;
            } catch {}
            return end != null ? end : this.value.length;
        }
        select(start, end) {
            if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
            try {
                this._unsafeSelect(start, end);
            } catch {}
        }
        get isActive() {
            return false;
        }
    }
    IMask.MaskElement = MaskElement;
    const KEY_Z = 90;
    const KEY_Y = 89;
    class HTMLMaskElement extends MaskElement {
        constructor(input) {
            super();
            this.input = input;
            this._onKeydown = this._onKeydown.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onBeforeinput = this._onBeforeinput.bind(this);
            this._onCompositionEnd = this._onCompositionEnd.bind(this);
        }
        get rootElement() {
            var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
            return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null ? void 0 : _this$input$getRootNo2.call(_this$input)) != null ? _this$input$getRootNo : document;
        }
        get isActive() {
            return this.input === this.rootElement.activeElement;
        }
        bindEvents(handlers) {
            this.input.addEventListener("keydown", this._onKeydown);
            this.input.addEventListener("input", this._onInput);
            this.input.addEventListener("beforeinput", this._onBeforeinput);
            this.input.addEventListener("compositionend", this._onCompositionEnd);
            this.input.addEventListener("drop", handlers.drop);
            this.input.addEventListener("click", handlers.click);
            this.input.addEventListener("focus", handlers.focus);
            this.input.addEventListener("blur", handlers.commit);
            this._handlers = handlers;
        }
        _onKeydown(e) {
            if (this._handlers.redo && (e.keyCode === KEY_Z && e.shiftKey && (e.metaKey || e.ctrlKey) || e.keyCode === KEY_Y && e.ctrlKey)) {
                e.preventDefault();
                return this._handlers.redo(e);
            }
            if (this._handlers.undo && e.keyCode === KEY_Z && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                return this._handlers.undo(e);
            }
            if (!e.isComposing) this._handlers.selectionChange(e);
        }
        _onBeforeinput(e) {
            if (e.inputType === "historyUndo" && this._handlers.undo) {
                e.preventDefault();
                return this._handlers.undo(e);
            }
            if (e.inputType === "historyRedo" && this._handlers.redo) {
                e.preventDefault();
                return this._handlers.redo(e);
            }
        }
        _onCompositionEnd(e) {
            this._handlers.input(e);
        }
        _onInput(e) {
            if (!e.isComposing) this._handlers.input(e);
        }
        unbindEvents() {
            this.input.removeEventListener("keydown", this._onKeydown);
            this.input.removeEventListener("input", this._onInput);
            this.input.removeEventListener("beforeinput", this._onBeforeinput);
            this.input.removeEventListener("compositionend", this._onCompositionEnd);
            this.input.removeEventListener("drop", this._handlers.drop);
            this.input.removeEventListener("click", this._handlers.click);
            this.input.removeEventListener("focus", this._handlers.focus);
            this.input.removeEventListener("blur", this._handlers.commit);
            this._handlers = {};
        }
    }
    IMask.HTMLMaskElement = HTMLMaskElement;
    class HTMLInputMaskElement extends HTMLMaskElement {
        constructor(input) {
            super(input);
            this.input = input;
        }
        get _unsafeSelectionStart() {
            return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
        }
        get _unsafeSelectionEnd() {
            return this.input.selectionEnd;
        }
        _unsafeSelect(start, end) {
            this.input.setSelectionRange(start, end);
        }
        get value() {
            return this.input.value;
        }
        set value(value) {
            this.input.value = value;
        }
    }
    IMask.HTMLMaskElement = HTMLMaskElement;
    class HTMLContenteditableMaskElement extends HTMLMaskElement {
        get _unsafeSelectionStart() {
            const root = this.rootElement;
            const selection = root.getSelection && root.getSelection();
            const anchorOffset = selection && selection.anchorOffset;
            const focusOffset = selection && selection.focusOffset;
            if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) return anchorOffset;
            return focusOffset;
        }
        get _unsafeSelectionEnd() {
            const root = this.rootElement;
            const selection = root.getSelection && root.getSelection();
            const anchorOffset = selection && selection.anchorOffset;
            const focusOffset = selection && selection.focusOffset;
            if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) return anchorOffset;
            return focusOffset;
        }
        _unsafeSelect(start, end) {
            if (!this.rootElement.createRange) return;
            const range = this.rootElement.createRange();
            range.setStart(this.input.firstChild || this.input, start);
            range.setEnd(this.input.lastChild || this.input, end);
            const root = this.rootElement;
            const selection = root.getSelection && root.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        get value() {
            return this.input.textContent || "";
        }
        set value(value) {
            this.input.textContent = value;
        }
    }
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    class InputHistory {
        constructor() {
            this.states = [];
            this.currentIndex = 0;
        }
        get currentState() {
            return this.states[this.currentIndex];
        }
        get isEmpty() {
            return this.states.length === 0;
        }
        push(state) {
            if (this.currentIndex < this.states.length - 1) this.states.length = this.currentIndex + 1;
            this.states.push(state);
            if (this.states.length > InputHistory.MAX_LENGTH) this.states.shift();
            this.currentIndex = this.states.length - 1;
        }
        go(steps) {
            this.currentIndex = Math.min(Math.max(this.currentIndex + steps, 0), this.states.length - 1);
            return this.currentState;
        }
        undo() {
            return this.go(-1);
        }
        redo() {
            return this.go(+1);
        }
        clear() {
            this.states.length = 0;
            this.currentIndex = 0;
        }
    }
    InputHistory.MAX_LENGTH = 100;
    class InputMask {
        constructor(el, opts) {
            this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
            this.masked = createMask(opts);
            this._listeners = {};
            this._value = "";
            this._unmaskedValue = "";
            this._rawInputValue = "";
            this.history = new InputHistory;
            this._saveSelection = this._saveSelection.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onChange = this._onChange.bind(this);
            this._onDrop = this._onDrop.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onClick = this._onClick.bind(this);
            this._onUndo = this._onUndo.bind(this);
            this._onRedo = this._onRedo.bind(this);
            this.alignCursor = this.alignCursor.bind(this);
            this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
            this._bindEvents();
            this.updateValue();
            this._onChange();
        }
        maskEquals(mask) {
            var _this$masked;
            return mask == null || ((_this$masked = this.masked) == null ? void 0 : _this$masked.maskEquals(mask));
        }
        get mask() {
            return this.masked.mask;
        }
        set mask(mask) {
            if (this.maskEquals(mask)) return;
            if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
                this.masked.updateOptions({
                    mask
                });
                return;
            }
            const masked = mask instanceof IMask.Masked ? mask : createMask({
                mask
            });
            masked.unmaskedValue = this.masked.unmaskedValue;
            this.masked = masked;
        }
        get value() {
            return this._value;
        }
        set value(str) {
            if (this.value === str) return;
            this.masked.value = str;
            this.updateControl("auto");
        }
        get unmaskedValue() {
            return this._unmaskedValue;
        }
        set unmaskedValue(str) {
            if (this.unmaskedValue === str) return;
            this.masked.unmaskedValue = str;
            this.updateControl("auto");
        }
        get rawInputValue() {
            return this._rawInputValue;
        }
        set rawInputValue(str) {
            if (this.rawInputValue === str) return;
            this.masked.rawInputValue = str;
            this.updateControl();
            this.alignCursor();
        }
        get typedValue() {
            return this.masked.typedValue;
        }
        set typedValue(val) {
            if (this.masked.typedValueEquals(val)) return;
            this.masked.typedValue = val;
            this.updateControl("auto");
        }
        get displayValue() {
            return this.masked.displayValue;
        }
        _bindEvents() {
            this.el.bindEvents({
                selectionChange: this._saveSelection,
                input: this._onInput,
                drop: this._onDrop,
                click: this._onClick,
                focus: this._onFocus,
                commit: this._onChange,
                undo: this._onUndo,
                redo: this._onRedo
            });
        }
        _unbindEvents() {
            if (this.el) this.el.unbindEvents();
        }
        _fireEvent(ev, e) {
            const listeners = this._listeners[ev];
            if (!listeners) return;
            listeners.forEach((l => l(e)));
        }
        get selectionStart() {
            return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
        }
        get cursorPos() {
            return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
        }
        set cursorPos(pos) {
            if (!this.el || !this.el.isActive) return;
            this.el.select(pos, pos);
            this._saveSelection();
        }
        _saveSelection() {
            if (this.displayValue !== this.el.value) console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
            this._selection = {
                start: this.selectionStart,
                end: this.cursorPos
            };
        }
        updateValue() {
            this.masked.value = this.el.value;
            this._value = this.masked.value;
            this._unmaskedValue = this.masked.unmaskedValue;
            this._rawInputValue = this.masked.rawInputValue;
        }
        updateControl(cursorPos) {
            const newUnmaskedValue = this.masked.unmaskedValue;
            const newValue = this.masked.value;
            const newRawInputValue = this.masked.rawInputValue;
            const newDisplayValue = this.displayValue;
            const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue || this._rawInputValue !== newRawInputValue;
            this._unmaskedValue = newUnmaskedValue;
            this._value = newValue;
            this._rawInputValue = newRawInputValue;
            if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
            if (cursorPos === "auto") this.alignCursor(); else if (cursorPos != null) this.cursorPos = cursorPos;
            if (isChanged) this._fireChangeEvents();
            if (!this._historyChanging && (isChanged || this.history.isEmpty)) this.history.push({
                unmaskedValue: newUnmaskedValue,
                selection: {
                    start: this.selectionStart,
                    end: this.cursorPos
                }
            });
        }
        updateOptions(opts) {
            const {mask, ...restOpts} = opts;
            const updateMask = !this.maskEquals(mask);
            const updateOpts = this.masked.optionsIsChanged(restOpts);
            if (updateMask) this.mask = mask;
            if (updateOpts) this.masked.updateOptions(restOpts);
            if (updateMask || updateOpts) this.updateControl();
        }
        updateCursor(cursorPos) {
            if (cursorPos == null) return;
            this.cursorPos = cursorPos;
            this._delayUpdateCursor(cursorPos);
        }
        _delayUpdateCursor(cursorPos) {
            this._abortUpdateCursor();
            this._changingCursorPos = cursorPos;
            this._cursorChanging = setTimeout((() => {
                if (!this.el) return;
                this.cursorPos = this._changingCursorPos;
                this._abortUpdateCursor();
            }), 10);
        }
        _fireChangeEvents() {
            this._fireEvent("accept", this._inputEvent);
            if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
        }
        _abortUpdateCursor() {
            if (this._cursorChanging) {
                clearTimeout(this._cursorChanging);
                delete this._cursorChanging;
            }
        }
        alignCursor() {
            this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
        }
        alignCursorFriendly() {
            if (this.selectionStart !== this.cursorPos) return;
            this.alignCursor();
        }
        on(ev, handler) {
            if (!this._listeners[ev]) this._listeners[ev] = [];
            this._listeners[ev].push(handler);
            return this;
        }
        off(ev, handler) {
            if (!this._listeners[ev]) return this;
            if (!handler) {
                delete this._listeners[ev];
                return this;
            }
            const hIndex = this._listeners[ev].indexOf(handler);
            if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
            return this;
        }
        _onInput(e) {
            this._inputEvent = e;
            this._abortUpdateCursor();
            const details = new ActionDetails({
                value: this.el.value,
                cursorPos: this.cursorPos,
                oldValue: this.displayValue,
                oldSelection: this._selection
            });
            const oldRawValue = this.masked.rawInputValue;
            const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
                input: true,
                raw: true
            }).offset;
            const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
            let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
            if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
            this.updateControl(cursorPos);
            delete this._inputEvent;
        }
        _onChange() {
            if (this.displayValue !== this.el.value) this.updateValue();
            this.masked.doCommit();
            this.updateControl();
            this._saveSelection();
        }
        _onDrop(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        _onFocus(ev) {
            this.alignCursorFriendly();
        }
        _onClick(ev) {
            this.alignCursorFriendly();
        }
        _onUndo() {
            this._applyHistoryState(this.history.undo());
        }
        _onRedo() {
            this._applyHistoryState(this.history.redo());
        }
        _applyHistoryState(state) {
            if (!state) return;
            this._historyChanging = true;
            this.unmaskedValue = state.unmaskedValue;
            this.el.select(state.selection.start, state.selection.end);
            this._saveSelection();
            this._historyChanging = false;
        }
        destroy() {
            this._unbindEvents();
            this._listeners.length = 0;
            delete this.el;
        }
    }
    IMask.InputMask = InputMask;
    class ChangeDetails {
        static normalize(prep) {
            return Array.isArray(prep) ? prep : [ prep, new ChangeDetails ];
        }
        constructor(details) {
            Object.assign(this, {
                inserted: "",
                rawInserted: "",
                tailShift: 0,
                skip: false
            }, details);
        }
        aggregate(details) {
            this.inserted += details.inserted;
            this.rawInserted += details.rawInserted;
            this.tailShift += details.tailShift;
            this.skip = this.skip || details.skip;
            return this;
        }
        get offset() {
            return this.tailShift + this.inserted.length;
        }
        get consumed() {
            return Boolean(this.rawInserted) || this.skip;
        }
        equals(details) {
            return this.inserted === details.inserted && this.tailShift === details.tailShift && this.rawInserted === details.rawInserted && this.skip === details.skip;
        }
    }
    IMask.ChangeDetails = ChangeDetails;
    class ContinuousTailDetails {
        constructor(value, from, stop) {
            if (value === void 0) value = "";
            if (from === void 0) from = 0;
            this.value = value;
            this.from = from;
            this.stop = stop;
        }
        toString() {
            return this.value;
        }
        extend(tail) {
            this.value += String(tail);
        }
        appendTo(masked) {
            return masked.append(this.toString(), {
                tail: true
            }).aggregate(masked._appendPlaceholder());
        }
        get state() {
            return {
                value: this.value,
                from: this.from,
                stop: this.stop
            };
        }
        set state(state) {
            Object.assign(this, state);
        }
        unshift(beforePos) {
            if (!this.value.length || beforePos != null && this.from >= beforePos) return "";
            const shiftChar = this.value[0];
            this.value = this.value.slice(1);
            return shiftChar;
        }
        shift() {
            if (!this.value.length) return "";
            const shiftChar = this.value[this.value.length - 1];
            this.value = this.value.slice(0, -1);
            return shiftChar;
        }
    }
    class Masked {
        constructor(opts) {
            this._value = "";
            this._update({
                ...Masked.DEFAULTS,
                ...opts
            });
            this._initialized = true;
        }
        updateOptions(opts) {
            if (!this.optionsIsChanged(opts)) return;
            this.withValueRefresh(this._update.bind(this, opts));
        }
        _update(opts) {
            Object.assign(this, opts);
        }
        get state() {
            return {
                _value: this.value,
                _rawInputValue: this.rawInputValue
            };
        }
        set state(state) {
            this._value = state._value;
        }
        reset() {
            this._value = "";
        }
        get value() {
            return this._value;
        }
        set value(value) {
            this.resolve(value, {
                input: true
            });
        }
        resolve(value, flags) {
            if (flags === void 0) flags = {
                input: true
            };
            this.reset();
            this.append(value, flags, "");
            this.doCommit();
        }
        get unmaskedValue() {
            return this.value;
        }
        set unmaskedValue(value) {
            this.resolve(value, {});
        }
        get typedValue() {
            return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
        }
        set typedValue(value) {
            if (this.format) this.value = this.format(value, this); else this.unmaskedValue = String(value);
        }
        get rawInputValue() {
            return this.extractInput(0, this.displayValue.length, {
                raw: true
            });
        }
        set rawInputValue(value) {
            this.resolve(value, {
                raw: true
            });
        }
        get displayValue() {
            return this.value;
        }
        get isComplete() {
            return true;
        }
        get isFilled() {
            return this.isComplete;
        }
        nearestInputPos(cursorPos, direction) {
            return cursorPos;
        }
        totalInputPositions(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            return Math.min(this.displayValue.length, toPos - fromPos);
        }
        extractInput(fromPos, toPos, flags) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            return this.displayValue.slice(fromPos, toPos);
        }
        extractTail(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
        }
        appendTail(tail) {
            if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
            return tail.appendTo(this);
        }
        _appendCharRaw(ch, flags) {
            if (!ch) return new ChangeDetails;
            this._value += ch;
            return new ChangeDetails({
                inserted: ch,
                rawInserted: ch
            });
        }
        _appendChar(ch, flags, checkTail) {
            if (flags === void 0) flags = {};
            const consistentState = this.state;
            let details;
            [ch, details] = this.doPrepareChar(ch, flags);
            if (ch) {
                details = details.aggregate(this._appendCharRaw(ch, flags));
                if (!details.rawInserted && this.autofix === "pad") {
                    const noFixState = this.state;
                    this.state = consistentState;
                    let fixDetails = this.pad(flags);
                    const chDetails = this._appendCharRaw(ch, flags);
                    fixDetails = fixDetails.aggregate(chDetails);
                    if (chDetails.rawInserted || fixDetails.equals(details)) details = fixDetails; else this.state = noFixState;
                }
            }
            if (details.inserted) {
                let consistentTail;
                let appended = this.doValidate(flags) !== false;
                if (appended && checkTail != null) {
                    const beforeTailState = this.state;
                    if (this.overwrite === true) {
                        consistentTail = checkTail.state;
                        for (let i = 0; i < details.rawInserted.length; ++i) checkTail.unshift(this.displayValue.length - details.tailShift);
                    }
                    let tailDetails = this.appendTail(checkTail);
                    appended = tailDetails.rawInserted.length === checkTail.toString().length;
                    if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
                        this.state = beforeTailState;
                        consistentTail = checkTail.state;
                        for (let i = 0; i < details.rawInserted.length; ++i) checkTail.shift();
                        tailDetails = this.appendTail(checkTail);
                        appended = tailDetails.rawInserted.length === checkTail.toString().length;
                    }
                    if (appended && tailDetails.inserted) this.state = beforeTailState;
                }
                if (!appended) {
                    details = new ChangeDetails;
                    this.state = consistentState;
                    if (checkTail && consistentTail) checkTail.state = consistentTail;
                }
            }
            return details;
        }
        _appendPlaceholder() {
            return new ChangeDetails;
        }
        _appendEager() {
            return new ChangeDetails;
        }
        append(str, flags, tail) {
            if (!isString(str)) throw new Error("value should be string");
            const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
            if (flags != null && flags.tail) flags._beforeTailState = this.state;
            let details;
            [str, details] = this.doPrepare(str, flags);
            for (let ci = 0; ci < str.length; ++ci) {
                const d = this._appendChar(str[ci], flags, checkTail);
                if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
                details.aggregate(d);
            }
            if ((this.eager === true || this.eager === "append") && flags != null && flags.input && str) details.aggregate(this._appendEager());
            if (checkTail != null) details.tailShift += this.appendTail(checkTail).tailShift;
            return details;
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
            return new ChangeDetails;
        }
        withValueRefresh(fn) {
            if (this._refreshing || !this._initialized) return fn();
            this._refreshing = true;
            const rawInput = this.rawInputValue;
            const value = this.value;
            const ret = fn();
            this.rawInputValue = rawInput;
            if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
                this.append(value.slice(this.displayValue.length), {}, "");
                this.doCommit();
            }
            delete this._refreshing;
            return ret;
        }
        runIsolated(fn) {
            if (this._isolated || !this._initialized) return fn(this);
            this._isolated = true;
            const state = this.state;
            const ret = fn(this);
            this.state = state;
            delete this._isolated;
            return ret;
        }
        doSkipInvalid(ch, flags, checkTail) {
            return Boolean(this.skipInvalid);
        }
        doPrepare(str, flags) {
            if (flags === void 0) flags = {};
            return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
        }
        doPrepareChar(str, flags) {
            if (flags === void 0) flags = {};
            return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
        }
        doValidate(flags) {
            return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
        }
        doCommit() {
            if (this.commit) this.commit(this.value, this);
        }
        splice(start, deleteCount, inserted, removeDirection, flags) {
            if (inserted === void 0) inserted = "";
            if (removeDirection === void 0) removeDirection = DIRECTION.NONE;
            if (flags === void 0) flags = {
                input: true
            };
            const tailPos = start + deleteCount;
            const tail = this.extractTail(tailPos);
            const eagerRemove = this.eager === true || this.eager === "remove";
            let oldRawValue;
            if (eagerRemove) {
                removeDirection = forceDirection(removeDirection);
                oldRawValue = this.extractInput(0, tailPos, {
                    raw: true
                });
            }
            let startChangePos = start;
            const details = new ChangeDetails;
            if (removeDirection !== DIRECTION.NONE) {
                startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
                details.tailShift = startChangePos - start;
            }
            details.aggregate(this.remove(startChangePos));
            if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) if (removeDirection === DIRECTION.FORCE_LEFT) {
                let valLength;
                while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) details.aggregate(new ChangeDetails({
                    tailShift: -1
                })).aggregate(this.remove(valLength - 1));
            } else if (removeDirection === DIRECTION.FORCE_RIGHT) tail.unshift();
            return details.aggregate(this.append(inserted, flags, tail));
        }
        maskEquals(mask) {
            return this.mask === mask;
        }
        optionsIsChanged(opts) {
            return !objectIncludes(this, opts);
        }
        typedValueEquals(value) {
            const tval = this.typedValue;
            return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
        }
        pad(flags) {
            return new ChangeDetails;
        }
    }
    Masked.DEFAULTS = {
        skipInvalid: true
    };
    Masked.EMPTY_VALUES = [ void 0, null, "" ];
    IMask.Masked = Masked;
    class ChunksTailDetails {
        constructor(chunks, from) {
            if (chunks === void 0) chunks = [];
            if (from === void 0) from = 0;
            this.chunks = chunks;
            this.from = from;
        }
        toString() {
            return this.chunks.map(String).join("");
        }
        extend(tailChunk) {
            if (!String(tailChunk)) return;
            tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
            const lastChunk = this.chunks[this.chunks.length - 1];
            const extendLast = lastChunk && (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && tailChunk.from === lastChunk.from + lastChunk.toString().length;
            if (tailChunk instanceof ContinuousTailDetails) if (extendLast) lastChunk.extend(tailChunk.toString()); else this.chunks.push(tailChunk); else if (tailChunk instanceof ChunksTailDetails) {
                if (tailChunk.stop == null) {
                    let firstTailChunk;
                    while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
                        firstTailChunk = tailChunk.chunks.shift();
                        firstTailChunk.from += tailChunk.from;
                        this.extend(firstTailChunk);
                    }
                }
                if (tailChunk.toString()) {
                    tailChunk.stop = tailChunk.blockIndex;
                    this.chunks.push(tailChunk);
                }
            }
        }
        appendTo(masked) {
            if (!(masked instanceof IMask.MaskedPattern)) {
                const tail = new ContinuousTailDetails(this.toString());
                return tail.appendTo(masked);
            }
            const details = new ChangeDetails;
            for (let ci = 0; ci < this.chunks.length; ++ci) {
                const chunk = this.chunks[ci];
                const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
                const stop = chunk.stop;
                let chunkBlock;
                if (stop != null && (!lastBlockIter || lastBlockIter.index <= stop)) {
                    if (chunk instanceof ChunksTailDetails || masked._stops.indexOf(stop) >= 0) details.aggregate(masked._appendPlaceholder(stop));
                    chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
                }
                if (chunkBlock) {
                    const tailDetails = chunkBlock.appendTail(chunk);
                    details.aggregate(tailDetails);
                    const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
                    if (remainChars) details.aggregate(masked.append(remainChars, {
                        tail: true
                    }));
                } else details.aggregate(masked.append(chunk.toString(), {
                    tail: true
                }));
            }
            return details;
        }
        get state() {
            return {
                chunks: this.chunks.map((c => c.state)),
                from: this.from,
                stop: this.stop,
                blockIndex: this.blockIndex
            };
        }
        set state(state) {
            const {chunks, ...props} = state;
            Object.assign(this, props);
            this.chunks = chunks.map((cstate => {
                const chunk = "chunks" in cstate ? new ChunksTailDetails : new ContinuousTailDetails;
                chunk.state = cstate;
                return chunk;
            }));
        }
        unshift(beforePos) {
            if (!this.chunks.length || beforePos != null && this.from >= beforePos) return "";
            const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
            let ci = 0;
            while (ci < this.chunks.length) {
                const chunk = this.chunks[ci];
                const shiftChar = chunk.unshift(chunkShiftPos);
                if (chunk.toString()) {
                    if (!shiftChar) break;
                    ++ci;
                } else this.chunks.splice(ci, 1);
                if (shiftChar) return shiftChar;
            }
            return "";
        }
        shift() {
            if (!this.chunks.length) return "";
            let ci = this.chunks.length - 1;
            while (0 <= ci) {
                const chunk = this.chunks[ci];
                const shiftChar = chunk.shift();
                if (chunk.toString()) {
                    if (!shiftChar) break;
                    --ci;
                } else this.chunks.splice(ci, 1);
                if (shiftChar) return shiftChar;
            }
            return "";
        }
    }
    class PatternCursor {
        constructor(masked, pos) {
            this.masked = masked;
            this._log = [];
            const {offset, index} = masked._mapPosToBlock(pos) || (pos < 0 ? {
                index: 0,
                offset: 0
            } : {
                index: this.masked._blocks.length,
                offset: 0
            });
            this.offset = offset;
            this.index = index;
            this.ok = false;
        }
        get block() {
            return this.masked._blocks[this.index];
        }
        get pos() {
            return this.masked._blockStartPos(this.index) + this.offset;
        }
        get state() {
            return {
                index: this.index,
                offset: this.offset,
                ok: this.ok
            };
        }
        set state(s) {
            Object.assign(this, s);
        }
        pushState() {
            this._log.push(this.state);
        }
        popState() {
            const s = this._log.pop();
            if (s) this.state = s;
            return s;
        }
        bindBlock() {
            if (this.block) return;
            if (this.index < 0) {
                this.index = 0;
                this.offset = 0;
            }
            if (this.index >= this.masked._blocks.length) {
                this.index = this.masked._blocks.length - 1;
                this.offset = this.block.displayValue.length;
            }
        }
        _pushLeft(fn) {
            this.pushState();
            for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) == null ? void 0 : _this$block.displayValue.length) || 0) {
                var _this$block;
                if (fn()) return this.ok = true;
            }
            return this.ok = false;
        }
        _pushRight(fn) {
            this.pushState();
            for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) if (fn()) return this.ok = true;
            return this.ok = false;
        }
        pushLeftBeforeFilled() {
            return this._pushLeft((() => {
                if (this.block.isFixed || !this.block.value) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
                if (this.offset !== 0) return true;
            }));
        }
        pushLeftBeforeInput() {
            return this._pushLeft((() => {
                if (this.block.isFixed) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
                return true;
            }));
        }
        pushLeftBeforeRequired() {
            return this._pushLeft((() => {
                if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
                return true;
            }));
        }
        pushRightBeforeFilled() {
            return this._pushRight((() => {
                if (this.block.isFixed || !this.block.value) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
                if (this.offset !== this.block.value.length) return true;
            }));
        }
        pushRightBeforeInput() {
            return this._pushRight((() => {
                if (this.block.isFixed) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
                return true;
            }));
        }
        pushRightBeforeRequired() {
            return this._pushRight((() => {
                if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
                this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
                return true;
            }));
        }
    }
    class PatternFixedDefinition {
        constructor(opts) {
            Object.assign(this, opts);
            this._value = "";
            this.isFixed = true;
        }
        get value() {
            return this._value;
        }
        get unmaskedValue() {
            return this.isUnmasking ? this.value : "";
        }
        get rawInputValue() {
            return this._isRawInput ? this.value : "";
        }
        get displayValue() {
            return this.value;
        }
        reset() {
            this._isRawInput = false;
            this._value = "";
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this._value.length;
            this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
            if (!this._value) this._isRawInput = false;
            return new ChangeDetails;
        }
        nearestInputPos(cursorPos, direction) {
            if (direction === void 0) direction = DIRECTION.NONE;
            const minPos = 0;
            const maxPos = this._value.length;
            switch (direction) {
              case DIRECTION.LEFT:
              case DIRECTION.FORCE_LEFT:
                return minPos;

              case DIRECTION.NONE:
              case DIRECTION.RIGHT:
              case DIRECTION.FORCE_RIGHT:
              default:
                return maxPos;
            }
        }
        totalInputPositions(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this._value.length;
            return this._isRawInput ? toPos - fromPos : 0;
        }
        extractInput(fromPos, toPos, flags) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this._value.length;
            if (flags === void 0) flags = {};
            return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
        }
        get isComplete() {
            return true;
        }
        get isFilled() {
            return Boolean(this._value);
        }
        _appendChar(ch, flags) {
            if (flags === void 0) flags = {};
            if (this.isFilled) return new ChangeDetails;
            const appendEager = this.eager === true || this.eager === "append";
            const appended = this.char === ch;
            const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
            const details = new ChangeDetails({
                inserted: this.char,
                rawInserted: isResolved ? this.char : ""
            });
            this._value = this.char;
            this._isRawInput = isResolved && (flags.raw || flags.input);
            return details;
        }
        _appendEager() {
            return this._appendChar(this.char, {
                tail: true
            });
        }
        _appendPlaceholder() {
            const details = new ChangeDetails;
            if (this.isFilled) return details;
            this._value = details.inserted = this.char;
            return details;
        }
        extractTail() {
            return new ContinuousTailDetails("");
        }
        appendTail(tail) {
            if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
            return tail.appendTo(this);
        }
        append(str, flags, tail) {
            const details = this._appendChar(str[0], flags);
            if (tail != null) details.tailShift += this.appendTail(tail).tailShift;
            return details;
        }
        doCommit() {}
        get state() {
            return {
                _value: this._value,
                _rawInputValue: this.rawInputValue
            };
        }
        set state(state) {
            this._value = state._value;
            this._isRawInput = Boolean(state._rawInputValue);
        }
        pad(flags) {
            return this._appendPlaceholder();
        }
    }
    class PatternInputDefinition {
        constructor(opts) {
            const {parent, isOptional, placeholderChar, displayChar, lazy, eager, ...maskOpts} = opts;
            this.masked = createMask(maskOpts);
            Object.assign(this, {
                parent,
                isOptional,
                placeholderChar,
                displayChar,
                lazy,
                eager
            });
        }
        reset() {
            this.isFilled = false;
            this.masked.reset();
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.value.length;
            if (fromPos === 0 && toPos >= 1) {
                this.isFilled = false;
                return this.masked.remove(fromPos, toPos);
            }
            return new ChangeDetails;
        }
        get value() {
            return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
        }
        get unmaskedValue() {
            return this.masked.unmaskedValue;
        }
        get rawInputValue() {
            return this.masked.rawInputValue;
        }
        get displayValue() {
            return this.masked.value && this.displayChar || this.value;
        }
        get isComplete() {
            return Boolean(this.masked.value) || this.isOptional;
        }
        _appendChar(ch, flags) {
            if (flags === void 0) flags = {};
            if (this.isFilled) return new ChangeDetails;
            const state = this.masked.state;
            let details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
            if (details.inserted && this.doValidate(flags) === false) {
                details = new ChangeDetails;
                this.masked.state = state;
            }
            if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) details.inserted = this.placeholderChar;
            details.skip = !details.inserted && !this.isOptional;
            this.isFilled = Boolean(details.inserted);
            return details;
        }
        append(str, flags, tail) {
            return this.masked.append(str, this.currentMaskFlags(flags), tail);
        }
        _appendPlaceholder() {
            if (this.isFilled || this.isOptional) return new ChangeDetails;
            this.isFilled = true;
            return new ChangeDetails({
                inserted: this.placeholderChar
            });
        }
        _appendEager() {
            return new ChangeDetails;
        }
        extractTail(fromPos, toPos) {
            return this.masked.extractTail(fromPos, toPos);
        }
        appendTail(tail) {
            return this.masked.appendTail(tail);
        }
        extractInput(fromPos, toPos, flags) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.value.length;
            return this.masked.extractInput(fromPos, toPos, flags);
        }
        nearestInputPos(cursorPos, direction) {
            if (direction === void 0) direction = DIRECTION.NONE;
            const minPos = 0;
            const maxPos = this.value.length;
            const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
            switch (direction) {
              case DIRECTION.LEFT:
              case DIRECTION.FORCE_LEFT:
                return this.isComplete ? boundPos : minPos;

              case DIRECTION.RIGHT:
              case DIRECTION.FORCE_RIGHT:
                return this.isComplete ? boundPos : maxPos;

              case DIRECTION.NONE:
              default:
                return boundPos;
            }
        }
        totalInputPositions(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.value.length;
            return this.value.slice(fromPos, toPos).length;
        }
        doValidate(flags) {
            return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
        }
        doCommit() {
            this.masked.doCommit();
        }
        get state() {
            return {
                _value: this.value,
                _rawInputValue: this.rawInputValue,
                masked: this.masked.state,
                isFilled: this.isFilled
            };
        }
        set state(state) {
            this.masked.state = state.masked;
            this.isFilled = state.isFilled;
        }
        currentMaskFlags(flags) {
            var _flags$_beforeTailSta;
            return {
                ...flags,
                _beforeTailState: (flags == null || (_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.masked) || (flags == null ? void 0 : flags._beforeTailState)
            };
        }
        pad(flags) {
            return new ChangeDetails;
        }
    }
    PatternInputDefinition.DEFAULT_DEFINITIONS = {
        0: /\d/,
        a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        "*": /./
    };
    class MaskedRegExp extends Masked {
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            const mask = opts.mask;
            if (mask) opts.validate = value => value.search(mask) >= 0;
            super._update(opts);
        }
    }
    IMask.MaskedRegExp = MaskedRegExp;
    class MaskedPattern extends Masked {
        constructor(opts) {
            super({
                ...MaskedPattern.DEFAULTS,
                ...opts,
                definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts == null ? void 0 : opts.definitions)
            });
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            opts.definitions = Object.assign({}, this.definitions, opts.definitions);
            super._update(opts);
            this._rebuildMask();
        }
        _rebuildMask() {
            const defs = this.definitions;
            this._blocks = [];
            this.exposeBlock = void 0;
            this._stops = [];
            this._maskedBlocks = {};
            const pattern = this.mask;
            if (!pattern || !defs) return;
            let unmaskingBlock = false;
            let optionalBlock = false;
            for (let i = 0; i < pattern.length; ++i) {
                if (this.blocks) {
                    const p = pattern.slice(i);
                    const bNames = Object.keys(this.blocks).filter((bName => p.indexOf(bName) === 0));
                    bNames.sort(((a, b) => b.length - a.length));
                    const bName = bNames[0];
                    if (bName) {
                        const {expose, repeat, ...bOpts} = normalizeOpts(this.blocks[bName]);
                        const blockOpts = {
                            lazy: this.lazy,
                            eager: this.eager,
                            placeholderChar: this.placeholderChar,
                            displayChar: this.displayChar,
                            overwrite: this.overwrite,
                            autofix: this.autofix,
                            ...bOpts,
                            repeat,
                            parent: this
                        };
                        const maskedBlock = repeat != null ? new IMask.RepeatBlock(blockOpts) : createMask(blockOpts);
                        if (maskedBlock) {
                            this._blocks.push(maskedBlock);
                            if (expose) this.exposeBlock = maskedBlock;
                            if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
                            this._maskedBlocks[bName].push(this._blocks.length - 1);
                        }
                        i += bName.length - 1;
                        continue;
                    }
                }
                let char = pattern[i];
                let isInput = char in defs;
                if (char === MaskedPattern.STOP_CHAR) {
                    this._stops.push(this._blocks.length);
                    continue;
                }
                if (char === "{" || char === "}") {
                    unmaskingBlock = !unmaskingBlock;
                    continue;
                }
                if (char === "[" || char === "]") {
                    optionalBlock = !optionalBlock;
                    continue;
                }
                if (char === MaskedPattern.ESCAPE_CHAR) {
                    ++i;
                    char = pattern[i];
                    if (!char) break;
                    isInput = false;
                }
                const def = isInput ? new PatternInputDefinition({
                    isOptional: optionalBlock,
                    lazy: this.lazy,
                    eager: this.eager,
                    placeholderChar: this.placeholderChar,
                    displayChar: this.displayChar,
                    ...normalizeOpts(defs[char]),
                    parent: this
                }) : new PatternFixedDefinition({
                    char,
                    eager: this.eager,
                    isUnmasking: unmaskingBlock
                });
                this._blocks.push(def);
            }
        }
        get state() {
            return {
                ...super.state,
                _blocks: this._blocks.map((b => b.state))
            };
        }
        set state(state) {
            if (!state) {
                this.reset();
                return;
            }
            const {_blocks, ...maskedState} = state;
            this._blocks.forEach(((b, bi) => b.state = _blocks[bi]));
            super.state = maskedState;
        }
        reset() {
            super.reset();
            this._blocks.forEach((b => b.reset()));
        }
        get isComplete() {
            return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((b => b.isComplete));
        }
        get isFilled() {
            return this._blocks.every((b => b.isFilled));
        }
        get isFixed() {
            return this._blocks.every((b => b.isFixed));
        }
        get isOptional() {
            return this._blocks.every((b => b.isOptional));
        }
        doCommit() {
            this._blocks.forEach((b => b.doCommit()));
            super.doCommit();
        }
        get unmaskedValue() {
            return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce(((str, b) => str += b.unmaskedValue), "");
        }
        set unmaskedValue(unmaskedValue) {
            if (this.exposeBlock) {
                const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                this.exposeBlock.unmaskedValue = unmaskedValue;
                this.appendTail(tail);
                this.doCommit();
            } else super.unmaskedValue = unmaskedValue;
        }
        get value() {
            return this.exposeBlock ? this.exposeBlock.value : this._blocks.reduce(((str, b) => str += b.value), "");
        }
        set value(value) {
            if (this.exposeBlock) {
                const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                this.exposeBlock.value = value;
                this.appendTail(tail);
                this.doCommit();
            } else super.value = value;
        }
        get typedValue() {
            return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
        }
        set typedValue(value) {
            if (this.exposeBlock) {
                const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                this.exposeBlock.typedValue = value;
                this.appendTail(tail);
                this.doCommit();
            } else super.typedValue = value;
        }
        get displayValue() {
            return this._blocks.reduce(((str, b) => str += b.displayValue), "");
        }
        appendTail(tail) {
            return super.appendTail(tail).aggregate(this._appendPlaceholder());
        }
        _appendEager() {
            var _this$_mapPosToBlock;
            const details = new ChangeDetails;
            let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index;
            if (startBlockIndex == null) return details;
            if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
            for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
                const d = this._blocks[bi]._appendEager();
                if (!d.inserted) break;
                details.aggregate(d);
            }
            return details;
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            const blockIter = this._mapPosToBlock(this.displayValue.length);
            const details = new ChangeDetails;
            if (!blockIter) return details;
            for (let block, bi = blockIter.index; block = this._blocks[bi]; ++bi) {
                var _flags$_beforeTailSta;
                const blockDetails = block._appendChar(ch, {
                    ...flags,
                    _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
                });
                details.aggregate(blockDetails);
                if (blockDetails.consumed) break;
            }
            return details;
        }
        extractTail(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            const chunkTail = new ChunksTailDetails;
            if (fromPos === toPos) return chunkTail;
            this._forEachBlocksInRange(fromPos, toPos, ((b, bi, bFromPos, bToPos) => {
                const blockChunk = b.extractTail(bFromPos, bToPos);
                blockChunk.stop = this._findStopBefore(bi);
                blockChunk.from = this._blockStartPos(bi);
                if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
                chunkTail.extend(blockChunk);
            }));
            return chunkTail;
        }
        extractInput(fromPos, toPos, flags) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            if (flags === void 0) flags = {};
            if (fromPos === toPos) return "";
            let input = "";
            this._forEachBlocksInRange(fromPos, toPos, ((b, _, fromPos, toPos) => {
                input += b.extractInput(fromPos, toPos, flags);
            }));
            return input;
        }
        _findStopBefore(blockIndex) {
            let stopBefore;
            for (let si = 0; si < this._stops.length; ++si) {
                const stop = this._stops[si];
                if (stop <= blockIndex) stopBefore = stop; else break;
            }
            return stopBefore;
        }
        _appendPlaceholder(toBlockIndex) {
            const details = new ChangeDetails;
            if (this.lazy && toBlockIndex == null) return details;
            const startBlockIter = this._mapPosToBlock(this.displayValue.length);
            if (!startBlockIter) return details;
            const startBlockIndex = startBlockIter.index;
            const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
            this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b => {
                if (!b.lazy || toBlockIndex != null) {
                    var _blocks2;
                    details.aggregate(b._appendPlaceholder((_blocks2 = b._blocks) == null ? void 0 : _blocks2.length));
                }
            }));
            return details;
        }
        _mapPosToBlock(pos) {
            let accVal = "";
            for (let bi = 0; bi < this._blocks.length; ++bi) {
                const block = this._blocks[bi];
                const blockStartPos = accVal.length;
                accVal += block.displayValue;
                if (pos <= accVal.length) return {
                    index: bi,
                    offset: pos - blockStartPos
                };
            }
        }
        _blockStartPos(blockIndex) {
            return this._blocks.slice(0, blockIndex).reduce(((pos, b) => pos += b.displayValue.length), 0);
        }
        _forEachBlocksInRange(fromPos, toPos, fn) {
            if (toPos === void 0) toPos = this.displayValue.length;
            const fromBlockIter = this._mapPosToBlock(fromPos);
            if (fromBlockIter) {
                const toBlockIter = this._mapPosToBlock(toPos);
                const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
                const fromBlockStartPos = fromBlockIter.offset;
                const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
                fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
                if (toBlockIter && !isSameBlock) {
                    for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
                    fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
                }
            }
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            const removeDetails = super.remove(fromPos, toPos);
            this._forEachBlocksInRange(fromPos, toPos, ((b, _, bFromPos, bToPos) => {
                removeDetails.aggregate(b.remove(bFromPos, bToPos));
            }));
            return removeDetails;
        }
        nearestInputPos(cursorPos, direction) {
            if (direction === void 0) direction = DIRECTION.NONE;
            if (!this._blocks.length) return 0;
            const cursor = new PatternCursor(this, cursorPos);
            if (direction === DIRECTION.NONE) {
                if (cursor.pushRightBeforeInput()) return cursor.pos;
                cursor.popState();
                if (cursor.pushLeftBeforeInput()) return cursor.pos;
                return this.displayValue.length;
            }
            if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
                if (direction === DIRECTION.LEFT) {
                    cursor.pushRightBeforeFilled();
                    if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
                    cursor.popState();
                }
                cursor.pushLeftBeforeInput();
                cursor.pushLeftBeforeRequired();
                cursor.pushLeftBeforeFilled();
                if (direction === DIRECTION.LEFT) {
                    cursor.pushRightBeforeInput();
                    cursor.pushRightBeforeRequired();
                    if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                    cursor.popState();
                    if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                    cursor.popState();
                }
                if (cursor.ok) return cursor.pos;
                if (direction === DIRECTION.FORCE_LEFT) return 0;
                cursor.popState();
                if (cursor.ok) return cursor.pos;
                cursor.popState();
                if (cursor.ok) return cursor.pos;
                return 0;
            }
            if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
                cursor.pushRightBeforeInput();
                cursor.pushRightBeforeRequired();
                if (cursor.pushRightBeforeFilled()) return cursor.pos;
                if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;
                cursor.popState();
                if (cursor.ok) return cursor.pos;
                cursor.popState();
                if (cursor.ok) return cursor.pos;
                return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
            }
            return cursorPos;
        }
        totalInputPositions(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            let total = 0;
            this._forEachBlocksInRange(fromPos, toPos, ((b, _, bFromPos, bToPos) => {
                total += b.totalInputPositions(bFromPos, bToPos);
            }));
            return total;
        }
        maskedBlock(name) {
            return this.maskedBlocks(name)[0];
        }
        maskedBlocks(name) {
            const indices = this._maskedBlocks[name];
            if (!indices) return [];
            return indices.map((gi => this._blocks[gi]));
        }
        pad(flags) {
            const details = new ChangeDetails;
            this._forEachBlocksInRange(0, this.displayValue.length, (b => details.aggregate(b.pad(flags))));
            return details;
        }
    }
    MaskedPattern.DEFAULTS = {
        ...Masked.DEFAULTS,
        lazy: true,
        placeholderChar: "_"
    };
    MaskedPattern.STOP_CHAR = "`";
    MaskedPattern.ESCAPE_CHAR = "\\";
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;
    IMask.MaskedPattern = MaskedPattern;
    class MaskedRange extends MaskedPattern {
        get _matchFrom() {
            return this.maxLength - String(this.from).length;
        }
        constructor(opts) {
            super(opts);
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            const {to = this.to || 0, from = this.from || 0, maxLength = this.maxLength || 0, autofix = this.autofix, ...patternOpts} = opts;
            this.to = to;
            this.from = from;
            this.maxLength = Math.max(String(to).length, maxLength);
            this.autofix = autofix;
            const fromStr = String(this.from).padStart(this.maxLength, "0");
            const toStr = String(this.to).padStart(this.maxLength, "0");
            let sameCharsCount = 0;
            while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
            patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(this.maxLength - sameCharsCount);
            super._update(patternOpts);
        }
        get isComplete() {
            return super.isComplete && Boolean(this.value);
        }
        boundaries(str) {
            let minstr = "";
            let maxstr = "";
            const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
            if (num) {
                minstr = "0".repeat(placeholder.length) + num;
                maxstr = "9".repeat(placeholder.length) + num;
            }
            minstr = minstr.padEnd(this.maxLength, "0");
            maxstr = maxstr.padEnd(this.maxLength, "9");
            return [ minstr, maxstr ];
        }
        doPrepareChar(ch, flags) {
            if (flags === void 0) flags = {};
            let details;
            [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ""), flags);
            if (!ch) details.skip = !this.isComplete;
            return [ ch, details ];
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            if (!this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(ch, flags);
            const fromStr = String(this.from).padStart(this.maxLength, "0");
            const toStr = String(this.to).padStart(this.maxLength, "0");
            const [minstr, maxstr] = this.boundaries(this.value + ch);
            if (Number(maxstr) < this.from) return super._appendCharRaw(fromStr[this.value.length], flags);
            if (Number(minstr) > this.to) {
                if (!flags.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength) return super._appendCharRaw(fromStr[this.value.length], flags).aggregate(this._appendCharRaw(ch, flags));
                return super._appendCharRaw(toStr[this.value.length], flags);
            }
            return super._appendCharRaw(ch, flags);
        }
        doValidate(flags) {
            const str = this.value;
            const firstNonZero = str.search(/[^0]/);
            if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
            const [minstr, maxstr] = this.boundaries(str);
            return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(flags);
        }
        pad(flags) {
            const details = new ChangeDetails;
            if (this.value.length === this.maxLength) return details;
            const value = this.value;
            const padLength = this.maxLength - this.value.length;
            if (padLength) {
                this.reset();
                for (let i = 0; i < padLength; ++i) details.aggregate(super._appendCharRaw("0", flags));
                value.split("").forEach((ch => this._appendCharRaw(ch)));
            }
            return details;
        }
    }
    IMask.MaskedRange = MaskedRange;
    const DefaultPattern = "d{.}`m{.}`Y";
    class MaskedDate extends MaskedPattern {
        static extractPatternOptions(opts) {
            const {mask, pattern, ...patternOpts} = opts;
            return {
                ...patternOpts,
                mask: isString(mask) ? mask : pattern
            };
        }
        constructor(opts) {
            super(MaskedDate.extractPatternOptions({
                ...MaskedDate.DEFAULTS,
                ...opts
            }));
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            const {mask, pattern, blocks, ...patternOpts} = {
                ...MaskedDate.DEFAULTS,
                ...opts
            };
            const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
            if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
            if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
            if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
                patternBlocks.m.from = opts.min.getMonth() + 1;
                patternBlocks.m.to = opts.max.getMonth() + 1;
                if (patternBlocks.m.from === patternBlocks.m.to) {
                    patternBlocks.d.from = opts.min.getDate();
                    patternBlocks.d.to = opts.max.getDate();
                }
            }
            Object.assign(patternBlocks, this.blocks, blocks);
            super._update({
                ...patternOpts,
                mask: isString(mask) ? mask : pattern,
                blocks: patternBlocks
            });
        }
        doValidate(flags) {
            const date = this.date;
            return super.doValidate(flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
        }
        isDateExist(str) {
            return this.format(this.parse(str, this), this).indexOf(str) >= 0;
        }
        get date() {
            return this.typedValue;
        }
        set date(date) {
            this.typedValue = date;
        }
        get typedValue() {
            return this.isComplete ? super.typedValue : null;
        }
        set typedValue(value) {
            super.typedValue = value;
        }
        maskEquals(mask) {
            return mask === Date || super.maskEquals(mask);
        }
        optionsIsChanged(opts) {
            return super.optionsIsChanged(MaskedDate.extractPatternOptions(opts));
        }
    }
    MaskedDate.GET_DEFAULT_BLOCKS = () => ({
        d: {
            mask: MaskedRange,
            from: 1,
            to: 31,
            maxLength: 2
        },
        m: {
            mask: MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2
        },
        Y: {
            mask: MaskedRange,
            from: 1900,
            to: 9999
        }
    });
    MaskedDate.DEFAULTS = {
        ...MaskedPattern.DEFAULTS,
        mask: Date,
        pattern: DefaultPattern,
        format: (date, masked) => {
            if (!date) return "";
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return [ day, month, year ].join(".");
        },
        parse: (str, masked) => {
            const [day, month, year] = str.split(".").map(Number);
            return new Date(year, month - 1, day);
        }
    };
    IMask.MaskedDate = MaskedDate;
    class MaskedDynamic extends Masked {
        constructor(opts) {
            super({
                ...MaskedDynamic.DEFAULTS,
                ...opts
            });
            this.currentMask = void 0;
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            super._update(opts);
            if ("mask" in opts) {
                this.exposeMask = void 0;
                this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((m => {
                    const {expose, ...maskOpts} = normalizeOpts(m);
                    const masked = createMask({
                        overwrite: this._overwrite,
                        eager: this._eager,
                        skipInvalid: this._skipInvalid,
                        ...maskOpts
                    });
                    if (expose) this.exposeMask = masked;
                    return masked;
                })) : [];
            }
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            const details = this._applyDispatch(ch, flags);
            if (this.currentMask) details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
            return details;
        }
        _applyDispatch(appended, flags, tail) {
            if (appended === void 0) appended = "";
            if (flags === void 0) flags = {};
            if (tail === void 0) tail = "";
            const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
            const inputValue = this.rawInputValue;
            const insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
            const tailValue = inputValue.slice(insertValue.length);
            const prevMask = this.currentMask;
            const details = new ChangeDetails;
            const prevMaskState = prevMask == null ? void 0 : prevMask.state;
            this.currentMask = this.doDispatch(appended, {
                ...flags
            }, tail);
            if (this.currentMask) if (this.currentMask !== prevMask) {
                this.currentMask.reset();
                if (insertValue) {
                    this.currentMask.append(insertValue, {
                        raw: true
                    });
                    details.tailShift = this.currentMask.value.length - prevValueBeforeTail.length;
                }
                if (tailValue) details.tailShift += this.currentMask.append(tailValue, {
                    raw: true,
                    tail: true
                }).tailShift;
            } else if (prevMaskState) this.currentMask.state = prevMaskState;
            return details;
        }
        _appendPlaceholder() {
            const details = this._applyDispatch();
            if (this.currentMask) details.aggregate(this.currentMask._appendPlaceholder());
            return details;
        }
        _appendEager() {
            const details = this._applyDispatch();
            if (this.currentMask) details.aggregate(this.currentMask._appendEager());
            return details;
        }
        appendTail(tail) {
            const details = new ChangeDetails;
            if (tail) details.aggregate(this._applyDispatch("", {}, tail));
            return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
        }
        currentMaskFlags(flags) {
            var _flags$_beforeTailSta, _flags$_beforeTailSta2;
            return {
                ...flags,
                _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
            };
        }
        doDispatch(appended, flags, tail) {
            if (flags === void 0) flags = {};
            if (tail === void 0) tail = "";
            return this.dispatch(appended, this, flags, tail);
        }
        doValidate(flags) {
            return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
        }
        doPrepare(str, flags) {
            if (flags === void 0) flags = {};
            let [s, details] = super.doPrepare(str, flags);
            if (this.currentMask) {
                let currentDetails;
                [s, currentDetails] = super.doPrepare(s, this.currentMaskFlags(flags));
                details = details.aggregate(currentDetails);
            }
            return [ s, details ];
        }
        doPrepareChar(str, flags) {
            if (flags === void 0) flags = {};
            let [s, details] = super.doPrepareChar(str, flags);
            if (this.currentMask) {
                let currentDetails;
                [s, currentDetails] = super.doPrepareChar(s, this.currentMaskFlags(flags));
                details = details.aggregate(currentDetails);
            }
            return [ s, details ];
        }
        reset() {
            var _this$currentMask;
            (_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
            this.compiledMasks.forEach((m => m.reset()));
        }
        get value() {
            return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
        }
        set value(value) {
            if (this.exposeMask) {
                this.exposeMask.value = value;
                this.currentMask = this.exposeMask;
                this._applyDispatch();
            } else super.value = value;
        }
        get unmaskedValue() {
            return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
        }
        set unmaskedValue(unmaskedValue) {
            if (this.exposeMask) {
                this.exposeMask.unmaskedValue = unmaskedValue;
                this.currentMask = this.exposeMask;
                this._applyDispatch();
            } else super.unmaskedValue = unmaskedValue;
        }
        get typedValue() {
            return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
        }
        set typedValue(typedValue) {
            if (this.exposeMask) {
                this.exposeMask.typedValue = typedValue;
                this.currentMask = this.exposeMask;
                this._applyDispatch();
                return;
            }
            let unmaskedValue = String(typedValue);
            if (this.currentMask) {
                this.currentMask.typedValue = typedValue;
                unmaskedValue = this.currentMask.unmaskedValue;
            }
            this.unmaskedValue = unmaskedValue;
        }
        get displayValue() {
            return this.currentMask ? this.currentMask.displayValue : "";
        }
        get isComplete() {
            var _this$currentMask2;
            return Boolean((_this$currentMask2 = this.currentMask) == null ? void 0 : _this$currentMask2.isComplete);
        }
        get isFilled() {
            var _this$currentMask3;
            return Boolean((_this$currentMask3 = this.currentMask) == null ? void 0 : _this$currentMask3.isFilled);
        }
        remove(fromPos, toPos) {
            const details = new ChangeDetails;
            if (this.currentMask) details.aggregate(this.currentMask.remove(fromPos, toPos)).aggregate(this._applyDispatch());
            return details;
        }
        get state() {
            var _this$currentMask4;
            return {
                ...super.state,
                _rawInputValue: this.rawInputValue,
                compiledMasks: this.compiledMasks.map((m => m.state)),
                currentMaskRef: this.currentMask,
                currentMask: (_this$currentMask4 = this.currentMask) == null ? void 0 : _this$currentMask4.state
            };
        }
        set state(state) {
            const {compiledMasks, currentMaskRef, currentMask, ...maskedState} = state;
            if (compiledMasks) this.compiledMasks.forEach(((m, mi) => m.state = compiledMasks[mi]));
            if (currentMaskRef != null) {
                this.currentMask = currentMaskRef;
                this.currentMask.state = currentMask;
            }
            super.state = maskedState;
        }
        extractInput(fromPos, toPos, flags) {
            return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : "";
        }
        extractTail(fromPos, toPos) {
            return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : super.extractTail(fromPos, toPos);
        }
        doCommit() {
            if (this.currentMask) this.currentMask.doCommit();
            super.doCommit();
        }
        nearestInputPos(cursorPos, direction) {
            return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : super.nearestInputPos(cursorPos, direction);
        }
        get overwrite() {
            return this.currentMask ? this.currentMask.overwrite : this._overwrite;
        }
        set overwrite(overwrite) {
            this._overwrite = overwrite;
        }
        get eager() {
            return this.currentMask ? this.currentMask.eager : this._eager;
        }
        set eager(eager) {
            this._eager = eager;
        }
        get skipInvalid() {
            return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
        }
        set skipInvalid(skipInvalid) {
            this._skipInvalid = skipInvalid;
        }
        get autofix() {
            return this.currentMask ? this.currentMask.autofix : this._autofix;
        }
        set autofix(autofix) {
            this._autofix = autofix;
        }
        maskEquals(mask) {
            return Array.isArray(mask) ? this.compiledMasks.every(((m, mi) => {
                if (!mask[mi]) return;
                const {mask: oldMask, ...restOpts} = mask[mi];
                return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
            })) : super.maskEquals(mask);
        }
        typedValueEquals(value) {
            var _this$currentMask5;
            return Boolean((_this$currentMask5 = this.currentMask) == null ? void 0 : _this$currentMask5.typedValueEquals(value));
        }
    }
    MaskedDynamic.DEFAULTS = {
        ...Masked.DEFAULTS,
        dispatch: (appended, masked, flags, tail) => {
            if (!masked.compiledMasks.length) return;
            const inputValue = masked.rawInputValue;
            const inputs = masked.compiledMasks.map(((m, index) => {
                const isCurrent = masked.currentMask === m;
                const startInputPos = isCurrent ? m.displayValue.length : m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
                if (m.rawInputValue !== inputValue) {
                    m.reset();
                    m.append(inputValue, {
                        raw: true
                    });
                } else if (!isCurrent) m.remove(startInputPos);
                m.append(appended, masked.currentMaskFlags(flags));
                m.appendTail(tail);
                return {
                    index,
                    weight: m.rawInputValue.length,
                    totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT)))
                };
            }));
            inputs.sort(((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions));
            return masked.compiledMasks[inputs[0].index];
        }
    };
    IMask.MaskedDynamic = MaskedDynamic;
    class MaskedEnum extends MaskedPattern {
        constructor(opts) {
            super({
                ...MaskedEnum.DEFAULTS,
                ...opts
            });
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            const {enum: enum_, ...eopts} = opts;
            if (enum_) {
                const lengths = enum_.map((e => e.length));
                const requiredLength = Math.min(...lengths);
                const optionalLength = Math.max(...lengths) - requiredLength;
                eopts.mask = "*".repeat(requiredLength);
                if (optionalLength) eopts.mask += "[" + "*".repeat(optionalLength) + "]";
                this.enum = enum_;
            }
            super._update(eopts);
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            const matchFrom = Math.min(this.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
            const matches = this.enum.filter((e => this.matchValue(e, this.unmaskedValue + ch, matchFrom)));
            if (matches.length) {
                if (matches.length === 1) this._forEachBlocksInRange(0, this.value.length, ((b, bi) => {
                    const mch = matches[0][bi];
                    if (bi >= this.value.length || mch === b.value) return;
                    b.reset();
                    b._appendChar(mch, flags);
                }));
                const d = super._appendCharRaw(matches[0][this.value.length], flags);
                if (matches.length === 1) matches[0].slice(this.unmaskedValue.length).split("").forEach((mch => d.aggregate(super._appendCharRaw(mch))));
                return d;
            }
            return new ChangeDetails({
                skip: !this.isComplete
            });
        }
        extractTail(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            return new ContinuousTailDetails("", fromPos);
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            if (fromPos === toPos) return new ChangeDetails;
            const matchFrom = Math.min(super.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
            let pos;
            for (pos = fromPos; pos >= 0; --pos) {
                const matches = this.enum.filter((e => this.matchValue(e, this.value.slice(matchFrom, pos), matchFrom)));
                if (matches.length > 1) break;
            }
            const details = super.remove(pos, toPos);
            details.tailShift += pos - fromPos;
            return details;
        }
        get isComplete() {
            return this.enum.indexOf(this.value) >= 0;
        }
    }
    MaskedEnum.DEFAULTS = {
        ...MaskedPattern.DEFAULTS,
        matchValue: (estr, istr, matchFrom) => estr.indexOf(istr, matchFrom) === matchFrom
    };
    IMask.MaskedEnum = MaskedEnum;
    class MaskedFunction extends Masked {
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            super._update({
                ...opts,
                validate: opts.mask
            });
        }
    }
    IMask.MaskedFunction = MaskedFunction;
    var _MaskedNumber;
    class MaskedNumber extends Masked {
        constructor(opts) {
            super({
                ...MaskedNumber.DEFAULTS,
                ...opts
            });
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            super._update(opts);
            this._updateRegExps();
        }
        _updateRegExps() {
            const start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
            const mid = "\\d*";
            const end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
            this._numberRegExp = new RegExp(start + mid + end);
            this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
            this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
        }
        _removeThousandsSeparators(value) {
            return value.replace(this._thousandsSeparatorRegExp, "");
        }
        _insertThousandsSeparators(value) {
            const parts = value.split(this.radix);
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
            return parts.join(this.radix);
        }
        doPrepareChar(ch, flags) {
            if (flags === void 0) flags = {};
            const [prepCh, details] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && (flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags);
            if (ch && !prepCh) details.skip = true;
            if (prepCh && !this.allowPositive && !this.value && prepCh !== "-") details.aggregate(this._appendChar("-"));
            return [ prepCh, details ];
        }
        _separatorsCount(to, extendOnSeparators) {
            if (extendOnSeparators === void 0) extendOnSeparators = false;
            let count = 0;
            for (let pos = 0; pos < to; ++pos) if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
                ++count;
                if (extendOnSeparators) to += this.thousandsSeparator.length;
            }
            return count;
        }
        _separatorsCountFromSlice(slice) {
            if (slice === void 0) slice = this._value;
            return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
        }
        extractInput(fromPos, toPos, flags) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
            return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
            const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
            this._value = this._removeThousandsSeparators(this.value);
            const oldValue = this._value;
            this._value += ch;
            const num = this.number;
            let accepted = !isNaN(num);
            let skip = false;
            if (accepted) {
                let fixedNum;
                if (this.min != null && this.min < 0 && this.number < this.min) fixedNum = this.min;
                if (this.max != null && this.max > 0 && this.number > this.max) fixedNum = this.max;
                if (fixedNum != null) if (this.autofix) {
                    this._value = this.format(fixedNum, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
                    skip || (skip = oldValue === this._value && !flags.tail);
                } else accepted = false;
                accepted && (accepted = Boolean(this._value.match(this._numberRegExp)));
            }
            let appendDetails;
            if (!accepted) {
                this._value = oldValue;
                appendDetails = new ChangeDetails;
            } else appendDetails = new ChangeDetails({
                inserted: this._value.slice(oldValue.length),
                rawInserted: skip ? "" : ch,
                skip
            });
            this._value = this._insertThousandsSeparators(this._value);
            const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
            const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
            appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
            return appendDetails;
        }
        _findSeparatorAround(pos) {
            if (this.thousandsSeparator) {
                const searchFrom = pos - this.thousandsSeparator.length + 1;
                const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
                if (separatorPos <= pos) return separatorPos;
            }
            return -1;
        }
        _adjustRangeWithSeparators(from, to) {
            const separatorAroundFromPos = this._findSeparatorAround(from);
            if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
            const separatorAroundToPos = this._findSeparatorAround(to);
            if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
            return [ from, to ];
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
            const valueBeforePos = this.value.slice(0, fromPos);
            const valueAfterPos = this.value.slice(toPos);
            const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
            this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
            const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
            return new ChangeDetails({
                tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
            });
        }
        nearestInputPos(cursorPos, direction) {
            if (!this.thousandsSeparator) return cursorPos;
            switch (direction) {
              case DIRECTION.NONE:
              case DIRECTION.LEFT:
              case DIRECTION.FORCE_LEFT:
                {
                    const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
                    if (separatorAtLeftPos >= 0) {
                        const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
                        if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) return separatorAtLeftPos;
                    }
                    break;
                }

              case DIRECTION.RIGHT:
              case DIRECTION.FORCE_RIGHT:
                {
                    const separatorAtRightPos = this._findSeparatorAround(cursorPos);
                    if (separatorAtRightPos >= 0) return separatorAtRightPos + this.thousandsSeparator.length;
                }
            }
            return cursorPos;
        }
        doCommit() {
            if (this.value) {
                const number = this.number;
                let validnum = number;
                if (this.min != null) validnum = Math.max(validnum, this.min);
                if (this.max != null) validnum = Math.min(validnum, this.max);
                if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
                let formatted = this.value;
                if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
                if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
                this._value = formatted;
            }
            super.doCommit();
        }
        _normalizeZeros(value) {
            const parts = this._removeThousandsSeparators(value).split(this.radix);
            parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, ((match, sign, zeros, num) => sign + num));
            if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
            if (parts.length > 1) {
                parts[1] = parts[1].replace(/0*$/, "");
                if (!parts[1].length) parts.length = 1;
            }
            return this._insertThousandsSeparators(parts.join(this.radix));
        }
        _padFractionalZeros(value) {
            if (!value) return value;
            const parts = value.split(this.radix);
            if (parts.length < 2) parts.push("");
            parts[1] = parts[1].padEnd(this.scale, "0");
            return parts.join(this.radix);
        }
        doSkipInvalid(ch, flags, checkTail) {
            if (flags === void 0) flags = {};
            const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
            return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
        }
        get unmaskedValue() {
            return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
        }
        set unmaskedValue(unmaskedValue) {
            super.unmaskedValue = unmaskedValue;
        }
        get typedValue() {
            return this.parse(this.unmaskedValue, this);
        }
        set typedValue(n) {
            this.rawInputValue = this.format(n, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
        }
        get number() {
            return this.typedValue;
        }
        set number(number) {
            this.typedValue = number;
        }
        get allowNegative() {
            return this.min != null && this.min < 0 || this.max != null && this.max < 0;
        }
        get allowPositive() {
            return this.min != null && this.min > 0 || this.max != null && this.max > 0;
        }
        typedValueEquals(value) {
            return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === "");
        }
    }
    _MaskedNumber = MaskedNumber;
    MaskedNumber.UNMASKED_RADIX = ".";
    MaskedNumber.EMPTY_VALUES = [ ...Masked.EMPTY_VALUES, 0 ];
    MaskedNumber.DEFAULTS = {
        ...Masked.DEFAULTS,
        mask: Number,
        radix: ",",
        thousandsSeparator: "",
        mapToRadix: [ _MaskedNumber.UNMASKED_RADIX ],
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        scale: 2,
        normalizeZeros: true,
        padFractionalZeros: false,
        parse: Number,
        format: n => n.toLocaleString("en-US", {
            useGrouping: false,
            maximumFractionDigits: 20
        })
    };
    IMask.MaskedNumber = MaskedNumber;
    const PIPE_TYPE = {
        MASKED: "value",
        UNMASKED: "unmaskedValue",
        TYPED: "typedValue"
    };
    function createPipe(arg, from, to) {
        if (from === void 0) from = PIPE_TYPE.MASKED;
        if (to === void 0) to = PIPE_TYPE.MASKED;
        const masked = createMask(arg);
        return value => masked.runIsolated((m => {
            m[from] = value;
            return m[to];
        }));
    }
    function pipe(value, mask, from, to) {
        return createPipe(mask, from, to)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;
    class RepeatBlock extends MaskedPattern {
        get repeatFrom() {
            var _ref;
            return (_ref = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === 1 / 0 ? 0 : this.repeat) != null ? _ref : 0;
        }
        get repeatTo() {
            var _ref2;
            return (_ref2 = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? _ref2 : 1 / 0;
        }
        constructor(opts) {
            super(opts);
        }
        updateOptions(opts) {
            super.updateOptions(opts);
        }
        _update(opts) {
            var _ref3, _ref4, _this$_blocks;
            const {repeat, ...blockOpts} = normalizeOpts(opts);
            this._blockOpts = Object.assign({}, this._blockOpts, blockOpts);
            const block = createMask(this._blockOpts);
            this.repeat = (_ref3 = (_ref4 = repeat != null ? repeat : block.repeat) != null ? _ref4 : this.repeat) != null ? _ref3 : 1 / 0;
            super._update({
                mask: "m".repeat(Math.max(this.repeatTo === 1 / 0 && ((_this$_blocks = this._blocks) == null ? void 0 : _this$_blocks.length) || 0, this.repeatFrom)),
                blocks: {
                    m: block
                },
                eager: block.eager,
                overwrite: block.overwrite,
                skipInvalid: block.skipInvalid,
                lazy: block.lazy,
                placeholderChar: block.placeholderChar,
                displayChar: block.displayChar
            });
        }
        _allocateBlock(bi) {
            if (bi < this._blocks.length) return this._blocks[bi];
            if (this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo) {
                this._blocks.push(createMask(this._blockOpts));
                this.mask += "m";
                return this._blocks[this._blocks.length - 1];
            }
        }
        _appendCharRaw(ch, flags) {
            if (flags === void 0) flags = {};
            const details = new ChangeDetails;
            for (let block, allocated, bi = (_this$_mapPosToBlock$ = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index) != null ? _this$_mapPosToBlock$ : Math.max(this._blocks.length - 1, 0); block = (_this$_blocks$bi = this._blocks[bi]) != null ? _this$_blocks$bi : allocated = !allocated && this._allocateBlock(bi); ++bi) {
                var _this$_mapPosToBlock$, _this$_mapPosToBlock, _this$_blocks$bi, _flags$_beforeTailSta;
                const blockDetails = block._appendChar(ch, {
                    ...flags,
                    _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
                });
                if (blockDetails.skip && allocated) {
                    this._blocks.pop();
                    this.mask = this.mask.slice(1);
                    break;
                }
                details.aggregate(blockDetails);
                if (blockDetails.consumed) break;
            }
            return details;
        }
        _trimEmptyTail(fromPos, toPos) {
            var _this$_mapPosToBlock2, _this$_mapPosToBlock3;
            if (fromPos === void 0) fromPos = 0;
            const firstBlockIndex = Math.max(((_this$_mapPosToBlock2 = this._mapPosToBlock(fromPos)) == null ? void 0 : _this$_mapPosToBlock2.index) || 0, this.repeatFrom, 0);
            let lastBlockIndex;
            if (toPos != null) lastBlockIndex = (_this$_mapPosToBlock3 = this._mapPosToBlock(toPos)) == null ? void 0 : _this$_mapPosToBlock3.index;
            if (lastBlockIndex == null) lastBlockIndex = this._blocks.length - 1;
            let removeCount = 0;
            for (let blockIndex = lastBlockIndex; firstBlockIndex <= blockIndex; --blockIndex, 
            ++removeCount) if (this._blocks[blockIndex].unmaskedValue) break;
            if (removeCount) {
                this._blocks.splice(lastBlockIndex - removeCount + 1, removeCount);
                this.mask = this.mask.slice(removeCount);
            }
        }
        reset() {
            super.reset();
            this._trimEmptyTail();
        }
        remove(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos === void 0) toPos = this.displayValue.length;
            const removeDetails = super.remove(fromPos, toPos);
            this._trimEmptyTail(fromPos, toPos);
            return removeDetails;
        }
        totalInputPositions(fromPos, toPos) {
            if (fromPos === void 0) fromPos = 0;
            if (toPos == null && this.repeatTo === 1 / 0) return 1 / 0;
            return super.totalInputPositions(fromPos, toPos);
        }
        get state() {
            return super.state;
        }
        set state(state) {
            this._blocks.length = state._blocks.length;
            this.mask = this.mask.slice(0, this._blocks.length);
            super.state = state;
        }
    }
    IMask.RepeatBlock = RepeatBlock;
    try {
        globalThis.IMask = IMask;
    } catch {}
    es.init("75OW2t6IQ_6Orzxue");
    let uniqueIdCounter = 0;
    let isModalOpen = false;
    let headerScrollState = false;
    let savedHeaderState = false;
    const header = document.querySelector(".header");
    const logoText = header ? header.querySelector(".header__logo-text") : null;
    const logoTextShort = header ? header.querySelector(".header__logo-text-short") : null;
    const headerBody = header ? header.querySelector(".header__body") : null;
    const phoneItems = header ? header.querySelectorAll(".phones__item") : [];
    const emailItems = header ? header.querySelectorAll(".emails__item") : [];
    const phoneLinks = header ? header.querySelectorAll(".phones__link") : [];
    const emailLinks = header ? header.querySelectorAll(".emails__link") : [];
    const actionsContacts = header ? header.querySelector(".actions__contacts") : null;
    function isDesktop() {
        return window.innerWidth > 991.98;
    }
    function handleScrollStyles() {
        if (isModalOpen) return;
        if (!header) {
            console.error("Элемент .header не найден");
            return;
        }
        const isScrolled = window.scrollY > 0;
        const shouldApplyStyles = isDesktop() && isScrolled;
        headerScrollState = shouldApplyStyles;
        if (logoText && logoTextShort) {
            logoText.style.display = shouldApplyStyles ? "none" : "block";
            logoTextShort.style.display = shouldApplyStyles ? "block" : "none";
            if (shouldApplyStyles) {
                logoTextShort.style.opacity = "1";
                logoTextShort.style.visibility = "visible";
            } else {
                logoText.style.opacity = "1";
                logoText.style.visibility = "visible";
            }
            if (!isDesktop()) {
                logoText.style.display = "none";
                logoTextShort.style.display = "block";
                logoTextShort.style.opacity = "1";
                logoTextShort.style.visibility = "visible";
            }
        }
        phoneItems.forEach((item => {
            item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
        }));
        emailItems.forEach((item => {
            item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
        }));
        phoneLinks.forEach((link => {
            link.style.marginRight = shouldApplyStyles ? "10px" : "";
        }));
        emailLinks.forEach((link => {
            link.style.marginRight = shouldApplyStyles ? "10px" : "";
        }));
        if (actionsContacts) actionsContacts.style.gap = shouldApplyStyles ? "5px" : "";
        if (headerBody) headerBody.style.padding = shouldApplyStyles ? "5px 0" : "";
        header.classList.toggle("scrolled", shouldApplyStyles);
    }
    function restoreHeaderState() {
        if (!header) {
            console.error("Элемент .header не найден");
            return;
        }
        const shouldApplyStyles = savedHeaderState && isDesktop();
        if (logoText && logoTextShort) {
            logoText.style.display = shouldApplyStyles ? "none" : "block";
            logoTextShort.style.display = shouldApplyStyles ? "block" : "none";
            if (shouldApplyStyles) {
                logoTextShort.style.opacity = "1";
                logoTextShort.style.visibility = "visible";
            } else {
                logoText.style.opacity = "1";
                logoText.style.visibility = "visible";
            }
            if (!isDesktop()) {
                logoText.style.display = "none";
                logoTextShort.style.display = "block";
                logoTextShort.style.opacity = "1";
                logoTextShort.style.visibility = "visible";
            }
        }
        phoneItems.forEach((item => {
            item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
        }));
        emailItems.forEach((item => {
            item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
        }));
        phoneLinks.forEach((link => {
            link.style.marginRight = shouldApplyStyles ? "10px" : "";
        }));
        emailLinks.forEach((link => {
            link.style.marginRight = shouldApplyStyles ? "10px" : "";
        }));
        if (actionsContacts) actionsContacts.style.gap = shouldApplyStyles ? "5px" : "";
        if (headerBody) headerBody.style.padding = shouldApplyStyles ? "5px 0" : "";
        header.classList.toggle("scrolled", shouldApplyStyles);
    }
    const script_isMobile = {
        any: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    function getScrollbarWidth() {
        const outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.overflow = "scroll";
        outer.style.msOverflowStyle = "scrollbar";
        document.body.appendChild(outer);
        const inner = document.createElement("div");
        outer.appendChild(inner);
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    }
    function hasScrollbar() {
        return document.documentElement.scrollHeight > window.innerHeight;
    }
    window.onload = function() {
        document.addEventListener("click", documentActions);
        function documentActions(e) {
            const targetElement = e.target;
            if (window.innerWidth > 767.98 && script_isMobile.any()) if (targetElement.classList.contains("menu__arrow")) targetElement.closest(".menu__item").classList.toggle("_hover");
        }
        const headerElement = document.querySelector(".header");
        if (headerElement) {
            const callback = function(entries) {
                if (entries[0].isIntersecting) headerElement.classList.remove("_scroll"); else headerElement.classList.add("_scroll");
            };
            const headerObserver = new IntersectionObserver(callback);
            headerObserver.observe(headerElement);
        }
    };
    document.addEventListener("DOMContentLoaded", (function() {
        console.log("EmailJS:", typeof es);
        console.log("IMask:", IMask);
        const productsContainer = document.getElementById("products-container");
        const cartModal = document.querySelector(".cart-modal");
        document.getElementById("cart-icon");
        const closeCartBtn = document.querySelector(".close-cart");
        const cartItemsContainer = document.querySelector(".cart-items");
        const cartTotal = document.querySelector(".cart-total");
        const cartCount = document.querySelector(".cart-count");
        const cartFooter = document.querySelector(".cart-footer");
        const submitOrderBtn = document.querySelector(".submit-order");
        const searchForm = document.querySelector(".search-form__item");
        const searchInput = document.querySelector(".search-form__input");
        const searchClear = document.querySelector(".search-form__clear");
        const categoryFilter = document.querySelector("#category-filter");
        const lazyLoadConfig = {
            initialItems: 10,
            loadMoreItems: 5,
            scrollThreshold: 300
        };
        let cart = [];
        let totalPrice = 0;
        let displayedProducts = 0;
        let isLoading = false;
        let allProductsLoaded = false;
        let currentCategory = "all";
        hasScrollbar() && getScrollbarWidth();
        function initCategoryFilter() {
            if (!categoryFilter) return;
            const selectTrigger = categoryFilter.querySelector(".custom-select__trigger");
            const selectValue = categoryFilter.querySelector(".custom-select__value");
            const optionsList = categoryFilter.querySelector(".custom-select__options");
            if (!selectTrigger || !selectValue || !optionsList) return;
            const categories = [ ...new Set(productsData.map((product => product.category)).filter((category => category))) ];
            const allOption = document.createElement("li");
            allOption.textContent = "Все товары";
            allOption.dataset.value = "all";
            optionsList.appendChild(allOption);
            categories.forEach((category => {
                const option = document.createElement("li");
                option.textContent = category;
                option.dataset.value = category;
                optionsList.appendChild(option);
            }));
            selectTrigger.addEventListener("click", (e => {
                e.stopPropagation();
                categoryFilter.classList.toggle("open");
            }));
            optionsList.addEventListener("click", (e => {
                const option = e.target.closest("li");
                if (!option) return;
                currentCategory = option.dataset.value;
                selectValue.textContent = option.textContent;
                optionsList.querySelectorAll("li").forEach((opt => opt.classList.remove("selected")));
                option.classList.add("selected");
                categoryFilter.classList.remove("open");
                resetLazyLoad();
            }));
            document.addEventListener("click", (e => {
                if (!categoryFilter.contains(e.target)) categoryFilter.classList.remove("open");
            }));
            selectTrigger.addEventListener("keydown", (e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    categoryFilter.classList.toggle("open");
                }
            }));
        }
        function initLazyLoad() {
            if (!productsContainer) {
                console.error("Контейнер #products-container не найден");
                return;
            }
            loadMoreProducts(lazyLoadConfig.initialItems);
            window.addEventListener("scroll", handleScroll);
        }
        function handleScroll() {
            if (isLoading || allProductsLoaded) return;
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const threshold = pageHeight - lazyLoadConfig.scrollThreshold;
            if (scrollPosition >= threshold) loadMoreProducts(lazyLoadConfig.loadMoreItems);
        }
        function loadMoreProducts(count) {
            if (isLoading || allProductsLoaded) return;
            isLoading = true;
            const filteredProducts = getFilteredProducts();
            const endIndex = Math.min(displayedProducts + count, filteredProducts.length);
            const productsToAdd = filteredProducts.slice(displayedProducts, endIndex);
            const fragment = document.createDocumentFragment();
            productsToAdd.forEach(((product, index) => {
                const productCard = createProductCard(product, displayedProducts + index < lazyLoadConfig.initialItems);
                fragment.appendChild(productCard);
            }));
            productsContainer.appendChild(fragment);
            displayedProducts = endIndex;
            allProductsLoaded = displayedProducts >= filteredProducts.length;
            isLoading = false;
            if (!allProductsLoaded && shouldLoadMoreImmediately()) loadMoreProducts(lazyLoadConfig.loadMoreItems);
        }
        function getFilteredProducts() {
            if (!Array.isArray(productsData)) {
                console.error("productsData не является массивом:", productsData);
                return [];
            }
            let filtered = productsData;
            if (currentCategory !== "all") filtered = filtered.filter((product => product.category === currentCategory));
            if (searchInput && searchInput.value.trim()) {
                const searchTerm = searchInput.value.trim().toLowerCase();
                filtered = filtered.filter((product => product.title && product.title.toLowerCase().includes(searchTerm) || product.article && product.article.toLowerCase().includes(searchTerm)));
            }
            return filtered;
        }
        function shouldLoadMoreImmediately() {
            const pageHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            return pageHeight - viewportHeight - scrollPosition < lazyLoadConfig.scrollThreshold;
        }
        function resetLazyLoad() {
            displayedProducts = 0;
            allProductsLoaded = false;
            isLoading = false;
            if (productsContainer) {
                productsContainer.innerHTML = "";
                loadMoreProducts(lazyLoadConfig.initialItems);
            }
        }
        function setupCartOverlay() {
            let cartOverlay = document.querySelector(".cart-overlay");
            if (!cartOverlay) {
                cartOverlay = document.createElement("div");
                cartOverlay.className = "cart-overlay";
                document.body.appendChild(cartOverlay);
            }
            cartOverlay.addEventListener("click", closeCart);
            document.addEventListener("click", (e => {
                if (!cartModal || !cartModal.classList.contains("active")) return;
                if (!cartModal.contains(e.target) && !e.target.closest("#cart-icon")) closeCart();
            }));
        }
        function openCart() {
            if (!cartModal || !closeCartBtn || !document.querySelector(".cart-overlay")) {
                console.error("Не найдены необходимые элементы для корзины");
                return;
            }
            const scrollPosition = window.scrollY;
            document.body.dataset.scrollPosition = scrollPosition;
            savedHeaderState = headerScrollState;
            closeOtherModals();
            cartModal.classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
            document.body.classList.add("body-no-scroll");
            isModalOpen = true;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = "100%";
            document.body.style.overflowY = "scroll";
            setTimeout((() => closeCartBtn.focus()), 100);
        }
        function closeCart() {
            if (cartModal) cartModal.classList.remove("active");
            if (document.querySelector(".cart-overlay")) document.querySelector(".cart-overlay").classList.remove("active");
            const scrollPosition = parseInt(document.body.dataset.scrollPosition || "0");
            document.body.classList.remove("body-no-scroll");
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflowY = "";
            delete document.body.dataset.scrollPosition;
            window.scrollTo({
                top: scrollPosition,
                behavior: "instant"
            });
            isModalOpen = false;
            restoreHeaderState();
        }
        function generateProductCards() {
            if (!productsContainer) {
                console.error("Контейнер #products-container не найден");
                productsContainer.innerHTML = "<p>Контейнер для товаров не найден</p>";
                return;
            }
            if (!Array.isArray(productsData) || productsData.length === 0) {
                console.error("productsData не является массивом или пуст:", productsData);
                productsContainer.innerHTML = "<p>Товары отсутствуют</p>";
                return;
            }
            productsContainer.innerHTML = "";
            productsContainer.style.opacity = "0";
            initLazyLoad();
            const checkImagesLoaded = () => {
                const images = productsContainer.querySelectorAll(".product__image");
                let loadedImages = 0;
                const totalImages = images.length;
                if (totalImages === 0) {
                    productsContainer.style.opacity = "1";
                    return;
                }
                images.forEach((img => {
                    if (img.complete) {
                        loadedImages++;
                        if (loadedImages === totalImages) productsContainer.style.opacity = "1";
                    } else {
                        img.addEventListener("load", (() => {
                            loadedImages++;
                            if (loadedImages === totalImages) productsContainer.style.opacity = "1";
                        }));
                        img.addEventListener("error", (() => {
                            console.error(`Ошибка загрузки изображения: ${img.src}`);
                            loadedImages++;
                            if (loadedImages === totalImages) productsContainer.style.opacity = "1";
                        }));
                    }
                }));
            };
            setTimeout(checkImagesLoaded, 0);
        }
        function createProductCard(product, isInitial = false) {
            const uniqueSuffix = `${product.article}-${uniqueIdCounter++}`;
            const productCard = document.createElement("article");
            productCard.className = "product__card";
            productCard.dataset.title = product.title;
            productCard.dataset.article = product.article;
            productCard.setAttribute("itemscope", "");
            productCard.setAttribute("itemtype", "http://schema.org/Product");
            let sizeSelectorHTML = "";
            if (product.sizes && product.sizes.length > 0) sizeSelectorHTML = `\n                <div class="product__size-selector">\n                    <label for="size-${uniqueSuffix}">${product.sizeLabel || "Размер:"}</label>\n                    <select id="size-${uniqueSuffix}" name="size-${uniqueSuffix}" class="product__size-select">\n                        ${product.sizes.map((size => `<option value="${size}">${size}</option>`)).join("")}\n                    </select>\n                </div>\n            `;
            const priceHTML = product.price ? `\n            <p class="product__price" itemprop="offers" itemtype="http://schema.org/Offer">\n                <span itemprop="price" content="${product.price}">${formatPrice(product.price)}</span>\n                <span itemprop="priceCurrency" content="RUB">₽</span>\n            </p>\n        ` : "";
            const detailsLinkHTML = product.hasDetails || product.detailsUrl ? `\n            <a href="${product.detailsUrl || "#"}" class="product__details-link" aria-label="Подробнее о товаре ${product.title}">\n                Подробнее\n            </a>\n        ` : "";
            productCard.innerHTML = `\n            <div class="product__image-wrapper">\n                <img src="${product.image}" \n                     alt="${product.alt || product.title}" \n                     class="product__image" \n                     loading="${isInitial ? "eager" : "lazy"}" \n                     width="300" \n                     height="200" \n                     itemprop="image">\n            </div>\n            <div class="product__content">\n                <h3 class="product__title" itemprop="name">${product.title}</h3>\n                <div class="product__meta">\n                    <p class="product__subtitle" itemprop="sku">Артикул: ${product.article}</p>\n                    ${detailsLinkHTML}\n                </div>\n                <div class="product__bottom-section">\n                    ${priceHTML}\n                    ${sizeSelectorHTML}\n                    <div class="product__footer">\n                        <div class="quantity__controls">\n                            <button type="button" class="quantity__btn minus" aria-label="Уменьшить количество">−</button>\n                            <input type="number" class="quantity__input" id="quantity-${uniqueSuffix}" name="quantity-${uniqueSuffix}" value="1" min="1" aria-label="Количество товара">\n                            <button type="button" class="quantity__btn plus" aria-label="Увеличить количество">+</button>\n                        </div>\n                        <button type="button" class="add-to-cart" itemprop="offers" itemtype="http://schema.org/Offer" aria-label="Добавить ${product.title} в корзину">Добавить в корзину</button>\n                    </div>\n                </div>\n            </div>\n        `;
            return productCard;
        }
        function formatPrice(price) {
            return new Intl.NumberFormat("ru-RU").format(price);
        }
        function addToCart(productCard) {
            const productSubtitle = productCard.querySelector(".product__subtitle");
            const productTitle = productCard.querySelector(".product__title");
            const productPriceElement = productCard.querySelector('.product__price span[itemprop="price"]');
            const quantityInput = productCard.querySelector(".quantity__input");
            const productImage = productCard.querySelector(".product__image");
            const sizeSelect = productCard.querySelector(".product__size-select");
            if (!productSubtitle || !productTitle || !quantityInput || !productImage) return;
            const productPriceValue = productPriceElement ? parseFloat(productPriceElement.getAttribute("content")) || 0 : 0;
            const productId = productSubtitle.textContent.split(": ")[1] || Date.now().toString();
            const productTitleText = productTitle.textContent || "Без названия";
            const productQuantity = parseInt(quantityInput.value) || 1;
            const productImageSrc = productImage.src || "";
            const optionValue = sizeSelect ? sizeSelect.value : null;
            const optionType = sizeSelect ? productCard.querySelector(".product__size-selector label")?.textContent.replace(":", "").trim() : null;
            const existingItem = cart.find((item => item.baseId === productId && item.optionValue === optionValue));
            if (existingItem) existingItem.quantity += productQuantity; else {
                const uniqueProductId = `${productId}-${optionValue || "default"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                cart.push({
                    id: uniqueProductId,
                    baseId: productId,
                    title: productTitleText,
                    price: productPriceValue,
                    quantity: productQuantity,
                    image: productImageSrc,
                    subtitle: productSubtitle.textContent,
                    optionType,
                    optionValue
                });
            }
            updateCart();
            animateCartCounter();
        }
        function updateCart() {
            if (!cartItemsContainer || !cartTotal || !cartCount || !cartFooter) return;
            cartItemsContainer.innerHTML = "";
            totalPrice = 0;
            cart.forEach((item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                const cartItemElement = document.createElement("div");
                cartItemElement.className = "cart-item";
                cartItemElement.innerHTML = `\n                <img src="${item.image}" alt="${item.title}" class="cart-item-image">\n                <div class="cart-item-details">\n                    <h4 class="cart-item-title">${item.title}</h4>\n                    ${item.optionValue ? `<p class="cart-item-option">${item.optionType}: ${item.optionValue}</p>` : ""}\n                    <p class="cart-item-subtitle">${item.subtitle}</p>\n                    ${item.price > 0 ? `<p class="cart-item-price">${formatPrice(item.price)} ₽</p>` : ""}\n                    <div class="cart-item-quantity">\n                        <div class="quantity__controls">\n                            <button type="button" class="quantity__btn minus" data-id="${item.id}">-</button>\n                            <input type="number" class="quantity__input" id="cart-quantity-${item.id}" name="cart-quantity-${item.id}" value="${item.quantity}" min="1" data-id="${item.id}">\n                            <button type="button" class="quantity__btn plus" data-id="${item.id}">+</button>\n                        </div>\n                        <button class="cart-item-remove" data-id="${item.id}">×</button>\n                    </div>\n                </div>\n            `;
                cartItemsContainer.appendChild(cartItemElement);
            }));
            if (submitOrderBtn) submitOrderBtn.setAttribute("aria-label", `Отправить заказ на сумму ${formatPrice(totalPrice)} руб`);
            cartTotal.textContent = formatPrice(totalPrice);
            cartCount.textContent = cart.reduce(((sum, item) => sum + item.quantity), 0);
            cartFooter.style.display = cart.length > 0 ? "block" : "none";
            saveCartToStorage();
        }
        function animateCartCounter() {
            if (cartCount) {
                cartCount.classList.add("update");
                setTimeout((() => cartCount.classList.remove("update")), 500);
            }
        }
        function openOrderForm() {
            const orderFormModal = document.querySelector(".order-form-modal");
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            const closeOrderFormBtn = document.querySelector(".close-order-form");
            if (!orderFormModal || !orderFormOverlay || !closeOrderFormBtn) return;
            const scrollPosition = window.scrollY;
            document.body.dataset.scrollPosition = scrollPosition;
            savedHeaderState = headerScrollState;
            closeOtherModals();
            orderFormModal.classList.add("active");
            orderFormOverlay.classList.add("active");
            document.body.classList.add("body-no-scroll");
            isModalOpen = true;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = "100%";
            document.body.style.overflowY = "scroll";
            setTimeout((() => closeOrderFormBtn.focus()), 100);
        }
        function closeOrderForm() {
            const orderFormModal = document.querySelector(".order-form-modal");
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            if (orderFormModal) orderFormModal.classList.remove("active");
            if (orderFormOverlay) orderFormOverlay.classList.remove("active");
            const scrollPosition = parseInt(document.body.dataset.scrollPosition || "0");
            document.body.classList.remove("body-no-scroll");
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflowY = "";
            delete document.body.dataset.scrollPosition;
            window.scrollTo({
                top: scrollPosition,
                behavior: "instant"
            });
            isModalOpen = false;
            restoreHeaderState();
        }
        function closeOtherModals() {
            const cartModal = document.querySelector(".cart-modal");
            const cartOverlay = document.querySelector(".cart-overlay");
            const orderFormModal = document.querySelector(".order-form-modal");
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            const callBackModal = document.querySelector(".call-back-modal");
            const callBackOverlay = document.querySelector(".call-back-overlay");
            const orderFormWillRemainOpen = orderFormModal && orderFormModal.classList.contains("active");
            if (cartModal) cartModal.classList.remove("active");
            if (cartOverlay) cartOverlay.classList.remove("active");
            if (orderFormModal && !orderFormWillRemainOpen) orderFormModal.classList.remove("active");
            if (orderFormOverlay && !orderFormWillRemainOpen) orderFormOverlay.classList.remove("active");
            if (callBackModal) callBackModal.classList.remove("active");
            if (callBackOverlay) callBackOverlay.classList.remove("active");
            if (!orderFormWillRemainOpen && document.body.classList.contains("body-no-scroll")) {
                const scrollPosition = parseInt(document.body.dataset.scrollPosition || "0");
                document.body.classList.remove("body-no-scroll");
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                document.body.style.overflowY = "";
                delete document.body.dataset.scrollPosition;
                window.scrollTo({
                    top: scrollPosition,
                    behavior: "instant"
                });
                isModalOpen = false;
                restoreHeaderState();
            }
        }
        function validateForm(name, phone, email) {
            const errors = [];
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\+?\d{10,15}$/;
            if (!name.trim()) errors.push({
                field: "order-name",
                message: "Пожалуйста, введите ваше имя."
            });
            if (!phone.trim() || !phonePattern.test(phone.replace(/\D/g, ""))) errors.push({
                field: "order-phone",
                message: "Пожалуйста, введите корректный номер телефона."
            });
            if (!email.trim() || !emailPattern.test(email)) errors.push({
                field: "order-email",
                message: "Пожалуйста, введите корректный email."
            });
            document.querySelectorAll(".error-message").forEach((span => span.textContent = ""));
            errors.forEach((error => {
                const errorSpan = document.getElementById(`${error.field}-error`);
                if (errorSpan) errorSpan.textContent = error.message;
            }));
            return errors.length === 0;
        }
        function submitOrder() {
            if (cart.length === 0) {
                showErrorMessage("Корзина пуста!");
                return;
            }
            openOrderForm();
        }
        function handleOrderFormSubmit(e) {
            e.preventDefault();
            if (cart.length === 0) {
                showErrorMessage("Корзина пуста!");
                closeOrderForm();
                return;
            }
            if (typeof es === "undefined") {
                console.error("EmailJS не загружен. Проверьте импорт и инициализацию библиотеки.");
                showErrorMessage("Ошибка: EmailJS не загружен. Пожалуйста, попробуйте позже.");
                return;
            }
            const nameInput = document.getElementById("order-name");
            const phoneInput = document.getElementById("order-phone");
            const emailInput = document.getElementById("order-email");
            if (!validateForm(nameInput.value, phoneInput.value, emailInput.value)) return;
            const orderItems = cart.map((item => `\n            Товар: ${item.title}\n            Артикул: ${item.subtitle}\n            ${item.optionValue ? `Опция: ${item.optionType}: ${item.optionValue}` : ""}\n            Количество: ${item.quantity}\n            Цена за единицу: ${formatPrice(item.price)} ₽\n            Общая стоимость: ${formatPrice(item.price * item.quantity)} ₽\n        `)).join("\n--------------------------------\n");
            const orderData = {
                items: orderItems,
                total: formatPrice(totalPrice),
                date: (new Date).toLocaleString("ru-RU")
            };
            const templateParams = {
                from_name: nameInput.value || "Интернет-магазин",
                to_email: "kiseleffav@gmail.com",
                order_details: orderData.items,
                total_price: orderData.total,
                order_date: orderData.date,
                user_email: emailInput.value || "",
                user_phone: phoneInput.value || ""
            };
            es.send("service_oozomec", "template_3gx3kyp", templateParams).then((function(response) {
                console.log("Заказ успешно отправлен:", response.status, response.text);
                showSuccessMessage(`Ваш заказ на сумму ${formatPrice(totalPrice)} ₽ успешно отправлен!`);
                cart = [];
                updateCart();
                closeCart();
                closeOrderForm();
                localStorage.removeItem("cart");
                document.getElementById("order-form").reset();
            }), (function(error) {
                console.error("Ошибка EmailJS:", JSON.stringify(error, null, 2));
                showErrorMessage("Произошла ошибка при отправке заказа");
            }));
        }
        function loadCartFromStorage() {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) try {
                cart = JSON.parse(savedCart);
                updateCart();
            } catch (e) {
                console.error("Ошибка при загрузке корзины:", e);
                localStorage.removeItem("cart");
            }
        }
        function saveCartToStorage() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        function initSearchFunctionality() {
            if (!searchForm || !searchInput || !searchClear) return;
            if (!searchInput.id) searchInput.id = "search-input";
            if (!searchInput.name) searchInput.name = "search";
            function toggleClearButton() {
                searchClear.style.display = searchInput.value ? "block" : "none";
            }
            searchInput.addEventListener("input", (() => {
                toggleClearButton();
                resetLazyLoad();
            }));
            searchInput.addEventListener("keydown", (e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    resetLazyLoad();
                }
            }));
            searchClear.addEventListener("click", (e => {
                e.preventDefault();
                searchInput.value = "";
                searchInput.focus();
                toggleClearButton();
                resetLazyLoad();
            }));
            const searchIcon = document.querySelector(".search-form__icon._icon-search");
            if (searchIcon) searchIcon.addEventListener("click", (e => {
                e.stopPropagation();
                searchForm.classList.toggle("active");
                if (searchForm.classList.contains("active")) searchInput.focus();
            }));
            document.addEventListener("click", (e => {
                if (!searchForm.contains(e.target) && !e.target.closest(".search-form__icon")) searchForm.classList.remove("active");
            }));
            toggleClearButton();
        }
        function initCallBackForm() {
            const callBackBtn = document.querySelector(".footer__call-back-btn");
            let callBackModal = document.querySelector(".call-back-modal");
            let callBackOverlay = document.querySelector(".call-back-overlay");
            const closeCallBackBtn = document.querySelector(".call-back-close");
            const callBackForm = document.querySelector("#call-back-form");
            if (!callBackBtn) {
                console.error("Кнопка .footer__call-back-btn не найдена. Проверьте _footer.htm");
                return;
            }
            if (!callBackModal || !closeCallBackBtn || !callBackForm) {
                console.error("Элементы формы обратного звонка не найдены:", {
                    callBackModal: !!callBackModal,
                    closeCallBackBtn: !!closeCallBackBtn,
                    callBackForm: !!callBackForm
                });
                return;
            }
            if (!callBackOverlay) {
                console.warn("Оверлей .call-back-overlay не найден, создаем новый");
                callBackOverlay = document.createElement("div");
                callBackOverlay.className = "call-back-overlay";
                document.body.appendChild(callBackOverlay);
            }
            callBackBtn.addEventListener("click", (() => {
                const scrollPosition = window.scrollY;
                document.body.dataset.scrollPosition = scrollPosition;
                savedHeaderState = headerScrollState;
                closeOtherModals();
                callBackModal.classList.add("active");
                callBackOverlay.classList.add("active");
                document.body.classList.add("body-no-scroll");
                isModalOpen = true;
                document.body.style.position = "fixed";
                document.body.style.top = `-${scrollPosition}px`;
                document.body.style.width = "100%";
                document.body.style.overflowY = "scroll";
                setTimeout((() => document.querySelector("#call-back-name")?.focus()), 100);
            }));
            const closeModal = () => {
                callBackModal.classList.remove("active");
                callBackOverlay.classList.remove("active");
                const scrollPosition = parseInt(document.body.dataset.scrollPosition || "0");
                document.body.classList.remove("body-no-scroll");
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                document.body.style.overflowY = "";
                delete document.body.dataset.scrollPosition;
                window.scrollTo({
                    top: scrollPosition,
                    behavior: "instant"
                });
                isModalOpen = false;
                restoreHeaderState();
            };
            closeCallBackBtn.addEventListener("click", closeModal);
            callBackOverlay.addEventListener("click", closeModal);
            document.addEventListener("click", (e => {
                if (callBackModal.classList.contains("active") && !callBackModal.contains(e.target) && !e.target.closest(".footer__call-back-btn")) closeModal();
            }));
            document.addEventListener("keydown", (e => {
                if (e.key === "Escape" && callBackModal.classList.contains("active")) closeModal();
            }));
            callBackForm.addEventListener("submit", (e => {
                e.preventDefault();
                const nameInput = document.querySelector("#call-back-name");
                const phoneInput = document.querySelector("#call-back-phone");
                const nameError = document.querySelector("#call-back-name-error");
                const phoneError = document.querySelector("#call-back-phone-error");
                let isValid = true;
                nameError.textContent = "";
                phoneError.textContent = "";
                nameInput.classList.remove("error");
                phoneInput.classList.remove("error");
                nameError.classList.remove("active");
                phoneError.classList.remove("active");
                if (!nameInput.value.trim()) {
                    nameError.textContent = "Пожалуйста, введите имя";
                    nameInput.classList.add("error");
                    nameError.classList.add("active");
                    isValid = false;
                }
                const phonePattern = /^\+?\d{10,15}$/;
                if (!phonePattern.test(phoneInput.value.replace(/\D/g, ""))) {
                    phoneError.textContent = "Пожалуйста, введите корректный номер телефона";
                    phoneInput.classList.add("error");
                    phoneError.classList.add("active");
                    isValid = false;
                }
                if (isValid) {
                    const templateParams = {
                        from_name: nameInput.value || "Запрос звонка",
                        to_email: "kiseleffav@gmail.com",
                        user_phone: phoneInput.value,
                        message: `Запрос обратного звонка от ${nameInput.value}, телефон: ${phoneInput.value}`,
                        request_date: (new Date).toLocaleString("ru-RU")
                    };
                    es.send("service_oozomec", "template_3gx3kyp", templateParams).then((response => {
                        console.log("Запрос звонка отправлен:", response.status, response.text);
                        showSuccessMessage("Заявка на звонок успешно отправлена!");
                        callBackForm.reset();
                        closeModal();
                    }), (error => {
                        console.error("Ошибка EmailJS:", error);
                        showErrorMessage("Произошла ошибка при отправке заявки");
                    }));
                }
            }));
        }
        function initEventHandlers() {
            document.addEventListener("click", (e => {
                if (e.target.classList.contains("quantity__btn")) {
                    const controls = e.target.closest(".quantity__controls");
                    if (!controls) return;
                    const input = controls.querySelector(".quantity__input");
                    if (!input) return;
                    let value = parseInt(input.value) || 1;
                    if (e.target.classList.contains("minus") && value > 1) value--; else if (e.target.classList.contains("plus")) value++;
                    input.value = value;
                }
                if (e.target.classList.contains("add-to-cart")) {
                    const productCard = e.target.closest(".product__card");
                    if (productCard) addToCart(productCard);
                }
                if (e.target.closest("#cart-icon")) {
                    e.preventDefault();
                    openCart();
                }
                if (e.target.classList.contains("quantity__btn") && e.target.closest(".cart-item")) {
                    const id = e.target.getAttribute("data-id");
                    const item = cart.find((item => item.id === id));
                    if (!item) return;
                    if (e.target.classList.contains("minus") && item.quantity > 1) item.quantity--; else if (e.target.classList.contains("plus")) item.quantity++;
                    updateCart();
                }
                if (e.target.classList.contains("cart-item-remove")) {
                    const id = e.target.getAttribute("data-id");
                    cart = cart.filter((item => item.id !== id));
                    updateCart();
                }
                if (e.target.classList.contains("close-order-form")) closeOrderForm();
            }));
            if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
            if (submitOrderBtn) submitOrderBtn.addEventListener("click", submitOrder);
            const orderForm = document.getElementById("order-form");
            if (orderForm) orderForm.addEventListener("submit", handleOrderFormSubmit);
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            if (orderFormOverlay) orderFormOverlay.addEventListener("click", closeOrderForm);
            document.addEventListener("change", (e => {
                if (e.target.classList.contains("quantity__input") && e.target.closest(".cart-item")) {
                    const id = e.target.getAttribute("data-id");
                    const newQuantity = parseInt(e.target.value) || 1;
                    const item = cart.find((item => item.id === id));
                    if (item && newQuantity >= 1) {
                        item.quantity = newQuantity;
                        updateCart();
                    }
                }
            }));
            document.addEventListener("keydown", (e => {
                if (e.key === "Escape" && document.querySelector(".order-form-modal.active")) closeOrderForm();
            }));
        }
        function initHeaderTransformation() {
            if (!header) {
                console.error("Элемент .header не найден");
                return;
            }
            let isTicking = false;
            function requestTick() {
                if (!isTicking) {
                    requestAnimationFrame((() => {
                        handleScrollStyles();
                        isTicking = false;
                    }));
                    isTicking = true;
                }
            }
            window.addEventListener("scroll", requestTick);
            window.addEventListener("resize", (() => {
                if (!isDesktop()) {
                    [ logoText, logoTextShort, ...phoneItems, ...emailItems, ...phoneLinks, ...emailLinks, actionsContacts, headerBody ].filter(Boolean).forEach((el => el.style.cssText = ""));
                    header.classList.remove("scrolled");
                    headerScrollState = false;
                    savedHeaderState = false;
                }
                requestTick();
            }));
            handleScrollStyles();
        }
        function initScrollTopButton() {
            const scrollTopBtn = document.querySelector(".scroll-top");
            if (!scrollTopBtn) return;
            window.addEventListener("scroll", (() => {
                scrollTopBtn.classList.toggle("visible", window.pageYOffset > window.innerHeight / 2);
            }));
            scrollTopBtn.addEventListener("click", (e => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }));
        }
        function initTableMobileAdaptation() {
            const table = document.querySelector(".specs-table");
            if (!table) return;
            const headers = Array.from(table.querySelectorAll(".specs-table__header")).map((header => header.textContent));
            table.querySelectorAll(".specs-table__row").forEach((row => {
                Array.from(row.querySelectorAll("td")).forEach(((cell, index) => {
                    cell.setAttribute("data-label", headers[index]);
                }));
            }));
        }
        function fixMobileViewportIssues() {
            function setRealViewportHeight() {
                const vh = window.innerHeight * .01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
                if (cartModal) cartModal.style.height = window.innerHeight + "px";
                const orderFormModal = document.querySelector(".order-form-modal");
                if (orderFormModal) orderFormModal.style.height = window.innerHeight + "px";
            }
            setRealViewportHeight();
            window.addEventListener("resize", setRealViewportHeight);
            window.addEventListener("orientationchange", setRealViewportHeight);
        }
        function initInputMask() {
            const phoneInput = document.getElementById("order-phone");
            if (phoneInput) IMask(phoneInput, {
                mask: "+7 (000) 000-00-00"
            });
            const callBackPhoneInput = document.getElementById("call-back-phone");
            if (callBackPhoneInput) IMask(callBackPhoneInput, {
                mask: "+7 (000) 000-00-00"
            });
        }
        function showErrorMessage(message) {
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.textContent = message;
            errorMessage.style.background = "#e74c3c";
            document.body.appendChild(errorMessage);
            setTimeout((() => errorMessage.remove()), 2500);
        }
        function showSuccessMessage(message) {
            const successMessage = document.createElement("div");
            successMessage.className = "success-message";
            successMessage.textContent = message;
            document.body.appendChild(successMessage);
            setTimeout((() => successMessage.remove()), 2500);
        }
        function init() {
            console.log("Инициализация приложения");
            setupCartOverlay();
            initEventHandlers();
            loadCartFromStorage();
            if (productsContainer) {
                generateProductCards();
                if (searchForm) initSearchFunctionality();
                if (categoryFilter) initCategoryFilter();
            }
            initHeaderTransformation();
            initScrollTopButton();
            initTableMobileAdaptation();
            fixMobileViewportIssues();
            initInputMask();
            initCallBackForm();
            document.querySelectorAll(".order-form input").forEach((input => {
                input.addEventListener("click", (event => {
                    event.stopPropagation();
                }));
            }));
        }
        init();
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const infoIcon = document.querySelector(".info-icon");
        if (infoIcon) {
            infoIcon.addEventListener("click", (e => {
                e.preventDefault();
                infoIcon.classList.toggle("active");
                setTimeout((() => {
                    infoIcon.classList.remove("active");
                }), 5e3);
            }));
            document.addEventListener("click", (e => {
                if (!infoIcon.contains(e.target)) infoIcon.classList.remove("active");
            }));
        }
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();