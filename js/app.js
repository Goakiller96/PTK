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
            title: "Плазмотрон ВПР-402м в сборе",
            article: "FL-12345",
            image: "img/plazmotron/vpr-402m.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Горелка Фламинго для плазменной резки металлов",
            description: "Профессиональная горелка для плазменной резки с увеличенным ресурсом",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-402m.html",
            category: "Плазмотроны"
        }, {
            title: "Плазмотрон ВПР-410 в сборе",
            article: "SP-410011",
            image: "img/plazmotron/vpr-410.webp",
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 410 для плазмотрона",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            hasDetails: true,
            detailsUrl: "plazmotron-vpr-410.html",
            category: "Плазмотроны"
        }, {
            title: "Сопло плазменное 402 для резки алюминия",
            article: "SP-402011",
            image: "img/cards/soplo-402.png",
            price: 242.56,
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 402 для резки цветных металлов",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Сопла"
        }, {
            title: "Электрод для плазмотрона конусный",
            article: "EL-4014",
            image: "img/cards/electrod.png",
            price: 420,
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
            category: "Электроды"
        }, {
            title: "Сопло плазменное 210 для тонколистового металла",
            article: "SP-1512",
            image: "img/cards/soplo-210.png",
            price: 242.56,
            sizes: [ "1.3 мм", "1.5 мм", "1.8 мм", "2.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 210 для тонкой резки",
            description: "Сопла малого диаметра для точной резки тонколистового металла",
            category: "Сопла"
        }, {
            title: "Ремкомплект для горелки Фламинго",
            article: "RK-12350",
            image: "img/cards/flamingo.webp",
            price: 1999,
            sizes: [ "Комплект A", "Комплект B", "Комплект C" ],
            sizeLabel: "Вариант:",
            alt: "Ремкомплект для плазменной горелки",
            description: "Ремонтный комплект для горелок серии Фламинго",
            category: "Комплектующие"
        }, {
            title: "Горелка плазменная Фламинго для резки металла",
            article: "FL-12345-2",
            image: "img/cards/flamingo.webp",
            price: 1999,
            alt: "Горелка Фламинго для плазменной резки металлов",
            description: "Профессиональная горелка для плазменной резки с увеличенным ресурсом",
            category: "Плазмотроны"
        }, {
            title: "Сопло плазменное 410 для резки нержавеющей стали",
            article: "SP-410011-2",
            image: "img/cards/soplo-410.png",
            price: 348.64,
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 410 для плазмотрона",
            description: "Сопла для плазменной резки серии 410 с медным охлаждением",
            category: "Сопла"
        }, {
            title: "Сопло плазменное 402 для резки алюминия",
            article: "SP-402011-2",
            image: "img/cards/soplo-402.png",
            price: 242.56,
            sizes: [ "2.5 мм", "3.0 мм", "3.5 мм", "4.0 мм" ],
            sizeLabel: "Диаметр сопла:",
            alt: "Сопло 402 для резки цветных металлов",
            description: "Износостойкие сопла для резки алюминия и цветных металлов",
            category: "Сопла"
        }, {
            title: "Электрод для плазмотрона конусный",
            article: "EL-4014-2",
            image: "img/cards/electrod.png",
            price: 420,
            sizes: [ "Гафний", "Биметалл" ],
            sizeLabel: "Тип вставки:",
            alt: "Электроды для плазменной резки",
            description: "Катоды для плазмотронов с различными типами вставок",
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
    let uniqueIdCounter = 0;
    const script_isMobile = {
        any: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    window.onload = function() {
        document.addEventListener("click", documentActions);
        function documentActions(e) {
            const targetElement = e.target;
            if (window.innerWidth > 767.98 && script_isMobile.any()) if (targetElement.classList.contains("menu__arrow")) targetElement.closest(".menu__item").classList.toggle("_hover");
            if (targetElement.classList.contains("search-form__btn") && targetElement.classList.contains("_icon-search")) document.querySelector(".search-form__item").classList.toggle("_active"); else if (!targetElement.closest(".search-form__item") && document.querySelector(".search-form__item._active")) document.querySelector(".search-form__item").classList.remove("_active");
        }
        const headerElement = document.querySelector(".header");
        const callback = function(entries, observer) {
            if (entries[0].isIntersecting) headerElement.classList.remove("_scroll"); else headerElement.classList.add("_scroll");
        };
        const headerObserver = new IntersectionObserver(callback);
        headerObserver.observe(headerElement);
    };
    document.addEventListener("DOMContentLoaded", (function() {
        const productsContainer = document.getElementById("products-container");
        const cartModal = document.querySelector(".cart-modal");
        document.getElementById("cart-icon");
        const closeCartBtn = document.querySelector(".close-cart");
        const cartItemsContainer = document.querySelector(".cart-items");
        const cartTotal = document.querySelector(".total-price");
        const cartCount = document.querySelector(".cart-count");
        const cartFooter = document.querySelector(".cart-footer");
        const submitOrderBtn = document.querySelector(".submit-order");
        const searchForm = document.querySelector(".search-form__item");
        const searchInput = document.querySelector(".search-form__input");
        document.querySelector(".search-form__clear");
        const categoryFilter = document.querySelector("#category-filter");
        console.log("productsData:", productsData);
        console.log("productsContainer:", productsContainer);
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
        function initCategoryFilter() {
            if (!categoryFilter) {
                console.warn("Элемент #category-filter не найден");
                return;
            }
            const selectTrigger = categoryFilter.querySelector(".custom-select__trigger");
            const selectValue = categoryFilter.querySelector(".custom-select__value");
            const optionsList = categoryFilter.querySelector(".custom-select__options");
            if (!selectTrigger || !selectValue || !optionsList) {
                console.error("Не найдены элементы кастомного селекта");
                return;
            }
            const categories = [ ...new Set(productsData.map((product => product.category)).filter((category => category))) ];
            console.log("Категории:", categories);
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
            selectTrigger.addEventListener("click", (function(e) {
                e.stopPropagation();
                categoryFilter.classList.toggle("open");
            }));
            optionsList.addEventListener("click", (function(e) {
                const option = e.target.closest("li");
                if (!option) return;
                const value = option.dataset.value;
                currentCategory = value;
                selectValue.textContent = option.textContent;
                optionsList.querySelectorAll("li").forEach((opt => opt.classList.remove("selected")));
                option.classList.add("selected");
                categoryFilter.classList.remove("open");
                console.log("Выбрана категория:", currentCategory);
                resetLazyLoad();
            }));
            document.addEventListener("click", (function(e) {
                if (!categoryFilter.contains(e.target)) categoryFilter.classList.remove("open");
            }));
            selectTrigger.addEventListener("keydown", (function(e) {
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
            console.log("Инициализация ленивой загрузки");
            loadMoreProducts(lazyLoadConfig.initialItems);
            window.addEventListener("scroll", handleScroll);
        }
        function handleScroll() {
            if (isLoading || allProductsLoaded) return;
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const threshold = pageHeight - lazyLoadConfig.scrollThreshold;
            if (scrollPosition >= threshold) {
                console.log("Подгрузка дополнительных товаров");
                loadMoreProducts(lazyLoadConfig.loadMoreItems);
            }
        }
        function loadMoreProducts(count) {
            if (isLoading || allProductsLoaded) return;
            isLoading = true;
            console.log("Загрузка товаров, текущий индекс:", displayedProducts);
            const filteredProducts = getFilteredProducts();
            console.log("Отфильтрованные товары:", filteredProducts.length);
            const endIndex = Math.min(displayedProducts + count, filteredProducts.length);
            const productsToAdd = filteredProducts.slice(displayedProducts, endIndex);
            const fragment = document.createDocumentFragment();
            productsToAdd.forEach((product => {
                const productCard = createProductCard(product);
                fragment.appendChild(productCard);
            }));
            productsContainer.appendChild(fragment);
            displayedProducts = endIndex;
            allProductsLoaded = displayedProducts >= filteredProducts.length;
            console.log("Товары загружены, новый индекс:", displayedProducts, "Все загружено:", allProductsLoaded);
            isLoading = false;
            if (!allProductsLoaded && shouldLoadMoreImmediately()) loadMoreProducts(lazyLoadConfig.loadMoreItems);
        }
        function getFilteredProducts() {
            if (!productsData || !Array.isArray(productsData)) {
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
            const productCards = productsContainer.querySelectorAll(".product__card");
            productCards.forEach((card => card.remove()));
            console.log("Очистка контейнера, перезагрузка товаров");
            loadMoreProducts(lazyLoadConfig.initialItems);
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
                const cartModal = document.querySelector(".cart-modal");
                if (!cartModal || !cartModal.classList.contains("active")) return;
                const isClickInsideCart = cartModal.contains(e.target);
                const isClickOnCartIcon = e.target.closest("#cart-icon");
                if (!isClickInsideCart && !isClickOnCartIcon) closeCart();
            }));
        }
        function openCart() {
            const cartModal = document.querySelector(".cart-modal");
            const closeCartBtn = document.querySelector(".close-cart");
            const cartOverlay = document.querySelector(".cart-overlay");
            if (!cartModal || !closeCartBtn || !cartOverlay) {
                console.error("Не найдены необходимые элементы корзины");
                return;
            }
            cartModal.classList.add("active");
            cartOverlay.classList.add("active");
            document.body.classList.add("body-no-scroll");
            setTimeout((() => {
                closeCartBtn.focus();
            }), 100);
        }
        function closeCart() {
            const cartModal = document.querySelector(".cart-modal");
            const cartOverlay = document.querySelector(".cart-overlay");
            if (cartModal) cartModal.classList.remove("active");
            if (cartOverlay) cartOverlay.classList.remove("active");
            document.body.classList.remove("body-no-scroll");
        }
        function generateProductCards() {
            if (!productsContainer) {
                console.error("Контейнер #products-container не найден");
                productsContainer.innerHTML = "<p>Контейнер для товаров не найден</p>";
                return;
            }
            if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
                console.error("productsData пуст или не является массивом:", productsData);
                productsContainer.innerHTML = "<p>Товары отсутствуют</p>";
                return;
            }
            console.log("Генерация карточек товаров, количество:", productsData.length);
            const existingCartModal = productsContainer.querySelector(".cart-modal");
            productsContainer.innerHTML = "";
            if (existingCartModal) productsContainer.appendChild(existingCartModal);
            initLazyLoad();
        }
        function createProductCard(product) {
            const uniqueSuffix = `${product.article}-${uniqueIdCounter++}`;
            const productCard = document.createElement("article");
            productCard.className = "product__card";
            productCard.dataset.title = product.title;
            productCard.dataset.article = product.article;
            productCard.setAttribute("itemscope", "");
            productCard.setAttribute("itemtype", "http://schema.org/Product");
            let sizeSelectorHTML = "";
            if (product.sizes && product.sizes.length > 0) sizeSelectorHTML = `\n            <div class="product__size-selector">\n                <label for="size-${uniqueSuffix}">${product.sizeLabel || "Размер:"}</label>\n                <select id="size-${uniqueSuffix}" name="size-${uniqueSuffix}" class="product__size-select">\n                    ${product.sizes.map((size => `<option value="${size}">${size}</option>`)).join("")}\n                </select>\n            </div>\n        `;
            const priceHTML = product.price ? `\n        <p class="product__price" itemprop="offers" itemtype="http://schema.org/Offer">\n            <span itemprop="price" content="${product.price}">${formatPrice(product.price)}</span>\n            <span itemprop="priceCurrency" content="RUB">₽</span>\n        </p>\n    ` : "";
            const detailsLinkHTML = product.hasDetails || product.detailsUrl ? `\n        <a href="${product.detailsUrl || "#"}" class="product__details-link" aria-label="Подробнее о товаре ${product.title}">\n            Подробнее\n        </a>\n    ` : "";
            productCard.innerHTML = `\n        <div class="product__image-wrapper">\n            <img src="${product.image}" \n                 alt="${product.alt || product.title}" \n                 class="product__image" \n                 loading="lazy" \n                 width="300" \n                 height="200" \n                 itemprop="image">\n        </div>\n        <div class="product__content">\n            <h3 class="product__title" itemprop="name">${product.title}</h3>\n            <div class="product__meta">\n                <p class="product__subtitle" itemprop="sku">Артикул: ${product.article}</p>\n                ${detailsLinkHTML}\n            </div>\n            <div class="product__bottom-section">\n                ${priceHTML}\n                ${sizeSelectorHTML}\n                <div class="product__footer">\n                    <div class="quantity__controls">\n                        <button type="button" \n                                class="quantity__btn minus" \n                                aria-label="Уменьшить количество">\n                            −\n                        </button>\n                        <input type="number" \n                               class="quantity__input" \n                               id="quantity-${uniqueSuffix}" \n                               name="quantity-${uniqueSuffix}" \n                               value="1" \n                               min="1" \n                               aria-label="Количество товара">\n                        <button type="button" \n                                class="quantity__btn plus" \n                                aria-label="Увеличить количество">\n                            +\n                        </button>\n                    </div>\n                    <button type="button" \n                            class="add-to-cart" \n                            itemprop="offers" \n                            itemtype="http://schema.org/Offer"\n                            aria-label="Добавить ${product.title} в корзину">\n                        Добавить в корзину\n                    </button>\n                </div>\n            </div>\n        </div>\n    `;
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
                cartItemElement.innerHTML = `\n                <img src="${item.image}" alt="${item.title}" class="cart-item-image">\n                <div class="cart-item-details">\n                    <h4 class="cart-item-title">${item.title}</h4>\n                    ${item.optionValue ? `<p class="cart-item-option">${item.optionType}: ${item.optionValue}</p>` : ""}\n                    <p class="cart-item-subtitle">${item.subtitle}</p>\n                    ${item.price > 0 ? `<p class="cart-item-price">${formatPrice(item.price)} ₽</p>` : ""}\n                    <div class="cart-item-quantity">\n                        <div class="quantity__controls">\n                            <button type="button" class="quantity__btn minus" data-id="${item.id}">-</button>\n                            <input type="number" \n                                   class="quantity__input" \n                                   id="cart-quantity-${item.id}" \n                                   name="cart-quantity-${item.id}" \n                                   value="${item.quantity}" \n                                   min="1" \n                                   data-id="${item.id}">\n                            <button type="button" class="quantity__btn plus" data-id="${item.id}">+</button>\n                        </div>\n                        <button class="cart-item-remove" data-id="${item.id}">×</button>\n                    </div>\n                </div>\n            `;
                cartItemsContainer.appendChild(cartItemElement);
            }));
            if (submitOrderBtn) submitOrderBtn.setAttribute("aria-label", `Отправить заказ на сумму ${formatPrice(totalPrice)} руб`);
            cartTotal.textContent = formatPrice(totalPrice);
            const totalItems = cart.reduce(((sum, item) => sum + item.quantity), 0);
            cartCount.textContent = totalItems;
            cartFooter.style.display = cart.length > 0 ? "block" : "none";
            saveCartToStorage();
        }
        function animateCartCounter() {
            if (cartCount) {
                cartCount.classList.add("update");
                setTimeout((() => {
                    cartCount.classList.remove("update");
                }), 500);
            }
        }
        function submitOrder() {
            if (cart.length === 0) {
                alert("Корзина пуста!");
                return;
            }
            const orderData = {
                items: cart,
                total: totalPrice,
                date: (new Date).toISOString()
            };
            console.log("Данные заказа:", orderData);
            alert(`Ваш заказ на сумму ${formatPrice(totalPrice)} ₽ успешно отправлен!`);
            cart = [];
            updateCart();
            closeCart();
            localStorage.removeItem("cart");
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
            if (!searchForm) {
                console.warn("Форма поиска (.search-form__item) не найдена");
                return;
            }
            const searchIcon = searchForm.querySelector(".search-form__btn._icon-search");
            const searchItem = searchForm;
            const searchInput = searchForm.querySelector(".search-form__input");
            const searchClear = searchForm.querySelector(".search-form__clear");
            if (searchInput && !searchInput.id) searchInput.id = "search-input";
            if (searchInput && !searchInput.name) searchInput.name = "search";
            function toggleClearButton() {
                if (searchInput && searchClear) searchClear.style.display = searchInput.value ? "block" : "none";
            }
            if (searchInput) {
                searchInput.addEventListener("input", (function() {
                    toggleClearButton();
                    resetLazyLoad();
                }));
                searchInput.addEventListener("keydown", (function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        resetLazyLoad();
                    }
                }));
            }
            if (searchClear) searchClear.addEventListener("click", (function(e) {
                e.preventDefault();
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                    toggleClearButton();
                    resetLazyLoad();
                }
            }));
            if (searchIcon && searchItem) searchIcon.addEventListener("click", (function(e) {
                e.stopPropagation();
                searchItem.classList.toggle("active");
                if (searchItem.classList.contains("active") && searchInput) searchInput.focus();
            }));
            document.addEventListener("click", (function(e) {
                if (!searchForm.contains(e.target)) searchItem?.classList.remove("active");
            }));
            toggleClearButton();
        }
        function initEventHandlers() {
            document.addEventListener("click", (function(e) {
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
            }));
            if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart); else console.warn("Элемент .close-cart не найден");
            if (submitOrderBtn) submitOrderBtn.addEventListener("click", submitOrder); else console.warn("Элемент .submit-order не найден");
            document.addEventListener("click", (function(e) {
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
            }));
            document.addEventListener("change", (function(e) {
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
            const focusStart = document.querySelector(".focus-trap-start");
            const focusEnd = document.querySelector(".focus-trap-end");
            if (cartModal && focusEnd && focusStart) {
                focusEnd.addEventListener("focus", (() => {
                    if (closeCartBtn) closeCartBtn.focus();
                }));
                focusStart.addEventListener("focus", (() => {
                    if (submitOrderBtn) submitOrderBtn.focus();
                }));
            } else console.warn("Элементы фокус-ловушки (.focus-trap-start, .focus-trap-end) или .cart-modal не найдены");
        }
        function initHeaderTransformation() {
            const header = document.querySelector(".header");
            if (!header) return;
            const logoText = header.querySelector(".header__logo-text");
            const logoTextShort = header.querySelector(".header__logo-text-short");
            const headerBody = header.querySelector(".header__body");
            const phoneItems = header.querySelectorAll(".phones__item");
            const emailItems = header.querySelectorAll(".emails__item");
            const phoneLinks = header.querySelectorAll(".phones__link");
            const emailLinks = header.querySelectorAll(".emails__link");
            const actionsContacts = header.querySelector(".actions__contacts");
            function isDesktop() {
                return window.innerWidth > 991.98;
            }
            function handleScrollStyles() {
                const isScrolled = window.scrollY > 0;
                const shouldApplyStyles = isDesktop() && isScrolled;
                if (logoText && logoTextShort) {
                    if (shouldApplyStyles) {
                        logoText.style.display = "none";
                        logoTextShort.style.display = "block";
                        logoTextShort.style.opacity = "1";
                        logoTextShort.style.visibility = "visible";
                    } else {
                        logoText.style.display = "block";
                        logoText.style.opacity = "1";
                        logoText.style.visibility = "visible";
                        logoTextShort.style.display = "none";
                    }
                    if (!isDesktop()) {
                        logoText.style.display = "none";
                        logoTextShort.style.display = "block";
                        logoTextShort.style.opacity = "1";
                        logoTextShort.style.visibility = "visible";
                    }
                }
                phoneItems.forEach((item => {
                    item.style.display = shouldApplyStyles ? "flex" : "";
                    item.style.flexDirection = shouldApplyStyles ? "row" : "";
                }));
                emailItems.forEach((item => {
                    item.style.display = shouldApplyStyles ? "flex" : "";
                    item.style.flexDirection = shouldApplyStyles ? "row" : "";
                }));
                phoneLinks.forEach((link => {
                    link.style.marginRight = shouldApplyStyles ? "10px" : "";
                }));
                emailLinks.forEach((link => {
                    link.style.marginRight = shouldApplyStyles ? "10px" : "";
                }));
                if (actionsContacts) actionsContacts.style.gap = shouldApplyStyles ? "5px" : "";
                if (headerBody) headerBody.style.padding = shouldApplyStyles ? "5px 0" : "";
                if (shouldApplyStyles) header.classList.add("scrolled"); else header.classList.remove("scrolled");
            }
            let isTicking = false;
            function requestTick() {
                if (!isTicking) {
                    requestAnimationFrame((function() {
                        handleScrollStyles();
                        isTicking = false;
                    }));
                    isTicking = true;
                }
            }
            window.addEventListener("scroll", requestTick);
            window.addEventListener("resize", (function() {
                if (!isDesktop()) {
                    [ logoText, logoTextShort, ...phoneItems, ...emailItems, ...phoneLinks, ...emailLinks, actionsContacts, headerBody ].filter(Boolean).forEach((el => el.style = ""));
                    header.classList.remove("scrolled");
                }
                requestTick();
            }));
            handleScrollStyles();
        }
        function initScrollTopButton() {
            const scrollTopBtn = document.querySelector(".scroll-top");
            if (!scrollTopBtn) {
                console.warn("Элемент .scroll-top не найден на странице:", window.location.pathname);
                return;
            }
            window.addEventListener("scroll", (function() {
                if (window.pageYOffset > window.innerHeight / 2) scrollTopBtn.classList.add("visible"); else scrollTopBtn.classList.remove("visible");
            }));
            scrollTopBtn.addEventListener("click", (function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }));
        }
        function initTableMobileAdaptation() {
            const table = document.querySelector(".specs-table");
            if (table) {
                const headers = Array.from(table.querySelectorAll(".specs-table__header")).map((header => header.textContent));
                table.querySelectorAll(".specs-table__row").forEach((row => {
                    Array.from(row.querySelectorAll("td")).forEach(((cell, index) => {
                        cell.setAttribute("data-label", headers[index]);
                    }));
                }));
            }
        }
        function fixMobileViewportIssues() {
            function setRealViewportHeight() {
                const vh = window.innerHeight * .01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
                const cartModal = document.querySelector(".cart-modal");
                if (cartModal) cartModal.style.height = window.innerHeight + "px";
            }
            setRealViewportHeight();
            window.addEventListener("resize", setRealViewportHeight);
            window.addEventListener("orientationchange", setRealViewportHeight);
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                document.body.style.overflow = "hidden";
                document.body.style.position = "fixed";
                document.body.style.top = "0";
                document.body.style.left = "0";
                document.body.style.right = "0";
                document.body.style.bottom = "0";
            }
        }
        function init() {
            setupCartOverlay();
            initEventHandlers();
            loadCartFromStorage();
            if (productsContainer) {
                generateProductCards();
                if (searchForm) initSearchFunctionality();
                if (categoryFilter) initCategoryFilter();
            } else console.error("Контейнер #products-container не найден на странице");
            initHeaderTransformation();
            initScrollTopButton();
            initTableMobileAdaptation();
            fixMobileViewportIssues();
        }
        init();
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();