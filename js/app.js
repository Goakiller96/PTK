(() => {
    "use strict";
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
            alt: "Плазмотрон ВПР-410 для плазменной резки металлов",
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
            image: "img/plazmotron/vpr-450.png",
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
            image: "img/cards/soplo-210.png",
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 210 для тонкой резки",
            description: "Сопла малого диаметра для точной резки тонколистового металла",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 402",
            article: "402011",
            image: "img/cards/soplo-402.png",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 402 для резки цветных металлов",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 410",
            article: "410011",
            image: "img/cards/soplo-410.png",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 410 для плазмотрона",
            description: "Сопла для плазменной резки серии 410",
            category: "Сопла"
        }, {
            title: "Электрод для плазмотрона",
            article: "1514",
            image: "img/cards/electrod-ag.png",
            sizes: [ "Гафний", "Серебро" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Электрод для плазмотрона конусный ЭП-03",
            article: "4014",
            image: "img/cards/electrod.png",
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Электрод для плазмотрона резьбовой ЭП-05",
            article: "4014",
            image: "img/cards/electrod-rezba.png",
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Электроды"
        }, {
            title: "Сопло плазменное 210 для тонколистового металла",
            article: "SP-1512-2",
            image: "img/cards/soplo-210.png",
            price: 242.56,
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 210 для тонкой резки",
            description: "Сопла малого диаметра для точной резки тонколистового металла",
            category: "Сопла"
        }, {
            title: "Ремкомплект для горелки Фламинго",
            article: "RK-12350-2",
            image: "img/cards/flamingo.webp",
            price: 1999,
            sizes: [ "Комплект A", "Комплект B", "Комплект C" ],
            sizeLabel: "Вариант:",
            alt: "Ремкомплект для плазменной горелки",
            description: "Ремонтный комплект для горелок серии Фламинго",
            category: "Комплектующие"
        }, {
            title: "Горелка плазменная Фламинго для резки металла",
            article: "FL-12345-3",
            image: "img/cards/flamingo.webp",
            price: 1999,
            alt: "Горелка Фламинго для плазменной резки металлов",
            description: "Профессиональная горелка для плазменной резки с увеличенным ресурсом",
            category: "Плазмотроны"
        }, {
            title: "Сопло плазменное 410 для резки нержавеющей стали",
            article: "SP-410011-3",
            image: "img/cards/soplo-410.png",
            price: 348.64,
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 410 для плазмотрона",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 402 для резки алюминия",
            article: "SP-402011-3",
            image: "img/cards/soplo-402.png",
            price: 242.56,
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 402 для резки цветных металлов",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Сопла"
        }, {
            title: "Электрод для плазмотрона конусный",
            article: "EL-4014-3",
            image: "img/cards/electrod.png",
            price: 420,
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Сопло плазменное 210 для тонколистового металла",
            article: "SP-1512-3",
            image: "img/cards/soplo-210.png",
            price: 242.56,
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 210 для тонкой резки",
            description: "Сопла малого диаметра для точной резки тонколистового металла",
            category: "Сопла"
        }, {
            title: "Ремкомплект для горелки Фламинго",
            article: "RK-12350-3",
            image: "img/cards/flamingo.webp",
            price: 1999,
            sizes: [ "Комплект A", "Комплект B", "Комплект C" ],
            sizeLabel: "Вариант:",
            alt: "Ремкомплект для плазменной горелки",
            description: "Ремонтный комплект для горелок серии Фламинго",
            category: "Комплектующие"
        }, {
            title: "Ремкомплект для горелки Фламинго",
            article: "RK-12350-4",
            image: "img/cards/flamingo.webp",
            price: 1999,
            sizes: [ "Комплект A", "Комплект B", "Комплект C" ],
            sizeLabel: "Вариант:",
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
    function isObject(obj) {
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
            } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
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
        if (!isObject(opts)) return {
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
        const scrollbarWidth = hasScrollbar() ? getScrollbarWidth() : 0;
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
                filtered = filtered.filter((product => product.title?.toLowerCase().includes(searchTerm) || product.article?.toLowerCase().includes(searchTerm)));
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
            closeOtherModals();
            cartModal.classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
            document.body.classList.add("body-no-scroll");
            if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
            setTimeout((() => closeCartBtn.focus()), 100);
            console.log("Состояние .cart-overlay:", {
                hasActiveClass: document.querySelector(".cart-overlay").classList.contains("active"),
                computedStyle: window.getComputedStyle(document.querySelector(".cart-overlay")).opacity
            });
        }
        function closeCart() {
            if (cartModal) cartModal.classList.remove("active");
            if (document.querySelector(".cart-overlay")) document.querySelector(".cart-overlay").classList.remove("active");
            document.body.classList.remove("body-no-scroll");
            document.body.style.paddingRight = "";
            console.log("Закрытие .cart-modal");
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
            const uniqueProductId = `${productId}-${optionValue || "default"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const existingItem = cart.find((item => item.id === uniqueProductId));
            if (existingItem) existingItem.quantity += productQuantity; else cart.push({
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
            closeOtherModals();
            orderFormModal.classList.add("active");
            orderFormOverlay.classList.add("active");
            document.body.classList.add("body-no-scroll");
            if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
            setTimeout((() => closeOrderFormBtn.focus()), 100);
            console.log("Состояние .order-form-overlay:", {
                hasActiveClass: orderFormOverlay.classList.contains("active"),
                computedStyle: window.getComputedStyle(orderFormOverlay).opacity
            });
        }
        function closeOrderForm() {
            const orderFormModal = document.querySelector(".order-form-modal");
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            if (orderFormModal) orderFormModal.classList.remove("active");
            if (orderFormOverlay) orderFormOverlay.classList.remove("active");
            document.body.classList.remove("body-no-scroll");
            document.body.style.paddingRight = "";
            console.log("Закрытие .order-form-modal");
        }
        function closeOtherModals() {
            const cartModal = document.querySelector(".cart-modal");
            const cartOverlay = document.querySelector(".cart-overlay");
            const orderFormModal = document.querySelector(".order-form-modal");
            const orderFormOverlay = document.querySelector(".order-form-overlay");
            const callBackModal = document.querySelector(".call-back-modal");
            const callBackOverlay = document.querySelector(".call-back-overlay");
            if (cartModal) cartModal.classList.remove("active");
            if (cartOverlay) cartOverlay.classList.remove("active");
            if (orderFormModal) orderFormModal.classList.remove("active");
            if (orderFormOverlay) orderFormOverlay.classList.remove("active");
            if (callBackModal) callBackModal.classList.remove("active");
            if (callBackOverlay) callBackOverlay.classList.remove("active");
            document.body.classList.remove("body-no-scroll");
            document.body.style.paddingRight = "";
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
                const errorMessage = document.createElement("div");
                errorMessage.className = "error-message";
                errorMessage.textContent = "Корзина пуста!";
                errorMessage.style.background = "#e74c3c";
                document.body.appendChild(errorMessage);
                setTimeout((() => errorMessage.remove()), 2500);
                return;
            }
            openOrderForm();
        }
        function handleOrderFormSubmit(e) {
            e.preventDefault();
            if (cart.length === 0) {
                const errorMessage = document.createElement("div");
                errorMessage.className = "error-message";
                errorMessage.textContent = "Корзина пуста!";
                errorMessage.style.background = "#e74c3c";
                document.body.appendChild(errorMessage);
                setTimeout((() => errorMessage.remove()), 2500);
                closeOrderForm();
                return;
            }
            if (typeof es === "undefined") {
                console.error("EmailJS не загружен. Проверьте импорт и инициализацию библиотеки.");
                const errorMessage = document.createElement("div");
                errorMessage.className = "error-message";
                errorMessage.textContent = "Ошибка: EmailJS не загружен. Пожалуйста, попробуйте позже.";
                errorMessage.style.background = "#e74c3c";
                document.body.appendChild(errorMessage);
                setTimeout((() => errorMessage.remove()), 2500);
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
                const successMessage = document.createElement("div");
                successMessage.className = "success-message";
                successMessage.textContent = `Ваш заказ на сумму ${formatPrice(totalPrice)} ₽ успешно отправлен!`;
                document.body.appendChild(successMessage);
                setTimeout((() => successMessage.remove()), 2500);
                cart = [];
                updateCart();
                closeCart();
                closeOrderForm();
                localStorage.removeItem("cart");
                document.getElementById("order-form").reset();
            }), (function(error) {
                console.error("Ошибка EmailJS:", JSON.stringify(error, null, 2));
                const errorMessage = document.createElement("div");
                errorMessage.className = "error-message";
                errorMessage.textContent = "Произошла ошибка при отправке заказа";
                errorMessage.style.background = "#e74c3c";
                document.body.appendChild(errorMessage);
                setTimeout((() => errorMessage.remove()), 2500);
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
                console.log("Клик по .footer__call-back-btn");
                closeOtherModals();
                console.log("Открытие call-back-modal, добавление .active к .call-back-overlay");
                callBackModal.classList.add("active");
                callBackOverlay.classList.add("active");
                document.body.classList.add("body-no-scroll");
                if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
                setTimeout((() => document.querySelector("#call-back-name")?.focus()), 100);
                console.log("Состояние .call-back-overlay:", {
                    hasActiveClass: callBackOverlay.classList.contains("active"),
                    computedStyle: window.getComputedStyle(callBackOverlay).opacity
                });
            }));
            const closeModal = () => {
                console.log("Закрытие call-back-modal");
                callBackModal.classList.remove("active");
                callBackOverlay.classList.remove("active");
                document.body.classList.remove("body-no-scroll");
                document.body.style.paddingRight = "";
            };
            closeCallBackBtn.addEventListener("click", closeModal);
            callBackOverlay.addEventListener("click", (e => {
                console.log("Клик по .call-back-overlay, закрытие");
                closeModal();
            }));
            document.addEventListener("click", (e => {
                if (callBackModal.classList.contains("active") && !callBackModal.contains(e.target) && !e.target.closest(".footer__call-back-btn")) {
                    console.log("Клик вне call-back-modal, закрытие");
                    closeModal();
                }
            }));
            document.addEventListener("keydown", (e => {
                if (e.key === "Escape" && callBackModal.classList.contains("active")) {
                    console.log("Нажата клавиша Esc, закрытие call-back-modal");
                    closeModal();
                }
            }));
            callBackForm.querySelectorAll("input").forEach((input => {
                input.addEventListener("click", (event => {
                    event.stopPropagation();
                }));
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
                        const successMessage = document.createElement("div");
                        successMessage.className = "success-message";
                        successMessage.textContent = "Заявка на звонок успешно отправлена!";
                        document.body.appendChild(successMessage);
                        setTimeout((() => successMessage.remove()), 2500);
                        callBackForm.reset();
                        closeModal();
                    }), (error => {
                        console.error("Ошибка EmailJS:", error);
                        const errorMessage = document.createElement("div");
                        errorMessage.className = "error-message";
                        errorMessage.textContent = "Произошла ошибка при отправке заявки";
                        errorMessage.style.background = "#e74c3c";
                        document.body.appendChild(errorMessage);
                        setTimeout((() => errorMessage.remove()), 2500);
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
            const header = document.querySelector(".header");
            if (!header) {
                console.error("Элемент .header не найден");
                return;
            }
            const logoText = header.querySelector(".header__logo-text");
            const logoTextShort = header.querySelector(".header__logo-text-short");
            const headerBody = header.querySelector(".header__body");
            const phoneItems = header.querySelectorAll(".phones__item");
            const emailItems = header.querySelectorAll(".emails__item");
            const phoneLinks = header.querySelectorAll(".phones__link");
            const emailLinks = header.querySelectorAll(".emails__link");
            const actionsContacts = header.querySelector(".actions__contacts");
            console.log("initHeaderTransformation: Элементы найдены:", {
                header: !!header,
                logoText: !!logoText,
                logoTextShort: !!logoTextShort,
                headerBody: !!headerBody,
                phoneItems: phoneItems.length,
                emailItems: emailItems.length,
                phoneLinks: phoneLinks.length,
                emailLinks: emailLinks.length,
                actionsContacts: !!actionsContacts
            });
            function isDesktop() {
                return window.innerWidth > 991.98;
            }
            function handleScrollStyles() {
                const isScrolled = window.scrollY > 0;
                const shouldApplyStyles = isDesktop() && isScrolled;
                console.log("handleScrollStyles:", {
                    isDesktop: isDesktop(),
                    isScrolled,
                    shouldApplyStyles
                });
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
                } else console.warn("logoText или logoTextShort не найдены");
                phoneItems.forEach((item => {
                    item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
                    console.log(".phones__item style:", item.style.cssText);
                }));
                emailItems.forEach((item => {
                    item.style.cssText = shouldApplyStyles ? "display: flex; flex-direction: row;" : "";
                    console.log(".emails__item (header) style:", item.style.cssText);
                }));
                phoneLinks.forEach((link => {
                    link.style.marginRight = shouldApplyStyles ? "10px" : "";
                    console.log(".phones__link marginRight:", link.style.marginRight);
                }));
                emailLinks.forEach((link => {
                    link.style.marginRight = shouldApplyStyles ? "10px" : "";
                    console.log(".emails__link (header) marginRight:", link.style.marginRight);
                }));
                if (actionsContacts) {
                    actionsContacts.style.gap = shouldApplyStyles ? "5px" : "";
                    console.log(".actions__contacts gap:", actionsContacts.style.gap);
                }
                if (headerBody) {
                    headerBody.style.padding = shouldApplyStyles ? "5px 0" : "";
                    console.log(".header__body padding:", headerBody.style.padding);
                }
                header.classList.toggle("scrolled", shouldApplyStyles);
                console.log(".header classList:", header.classList.toString());
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
                    console.log("resize: Стили сброшены, .header.scrolled удалён");
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
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) document.body.style.cssText = "overflow: hidden; position: fixed; top: 0; left: 0; right: 0; bottom: 0;";
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