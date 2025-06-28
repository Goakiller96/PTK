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
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
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
    const productsData = [ {
        id: 1,
        title: "Фламинго",
        article: "12345",
        image: "img/cards/flamingo.png",
        price: 1999,
        sizeLabel: "Размер:"
    }, {
        id: 2,
        title: "Сопло 410",
        article: "410011",
        image: "img/cards/soplo-410.png",
        sizes: [ "2.5", "3.0", "3.5", "4.0" ],
        sizeLabel: "Размер:"
    }, {
        id: 3,
        title: "Сопло 402",
        article: "402011",
        image: "img/cards/soplo-402.png",
        sizes: [ "2.5", "3.0", "3.5", "4.0" ],
        sizeLabel: "Размер:"
    }, {
        id: 4,
        title: "Электрод",
        article: "4014",
        image: "img/cards/electrod.png",
        sizes: [ "Гафний", "Биметалл" ],
        sizeLabel: "Вставка:"
    }, {
        id: 5,
        title: "Сопло 210",
        article: "1512",
        image: "img/cards/soplo-210.png",
        price: 242.56,
        sizes: [ "1.3", "1.5", "1.8", "2.0" ],
        sizeLabel: "Размер:"
    }, {
        id: 6,
        title: "Сопло 402",
        article: "12350",
        image: "img/cards/flamingo.png",
        price: 1999,
        sizes: [ "2.5", "3.0", "3.5", "4.0" ],
        sizeLabel: "Размер:"
    } ];
    const products = productsData;
    window.onload = function() {
        document.addEventListener("click", documentActions);
        function documentActions(e) {
            const targetElement = e.target;
            if (window.innerWidth > 767.98 && isMobile.any()) if (targetElement.classList.contains("menu__arrow")) targetElement.closest(".menu__item").classList.toggle("_hover");
            if (targetElement.classList.contains("search-form__icon")) document.querySelector(".search-form").classList.toggle("_active"); else if (!targetElement.closest(".search-form") && document.querySelector(".search-form._active")) document.querySelector(".search-form").classList.remove("_active");
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
        const searchForm = document.querySelector(".search-form");
        const searchInput = document.querySelector(".search-form__input");
        const searchClear = document.querySelector(".search-form__clear");
        let cart = [];
        let totalPrice = 0;
        let searchTimeout;
        function setupCartOverlay() {
            const cartOverlay = document.createElement("div");
            cartOverlay.className = "cart-overlay";
            document.body.appendChild(cartOverlay);
            cartOverlay.addEventListener("click", closeCart);
            document.addEventListener("click", (e => {
                if (!cartModal.contains(e.target) && !e.target.closest("#cart-icon") && cartModal.classList.contains("active")) closeCart();
            }));
        }
        function openCart() {
            cartModal.classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
            document.body.classList.add("body-no-scroll");
            setTimeout((() => {
                closeCartBtn.focus();
            }), 100);
        }
        function closeCart() {
            cartModal.classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
            document.body.classList.remove("body-no-scroll");
        }
        function generateProductCards() {
            if (!productsContainer) return;
            const existingCartModal = productsContainer.querySelector(".cart-modal");
            productsContainer.innerHTML = "";
            if (existingCartModal) productsContainer.appendChild(existingCartModal);
            products.forEach((product => {
                const productCard = createProductCard(product);
                productsContainer.insertBefore(productCard, existingCartModal);
            }));
        }
        function createProductCard(product) {
            const uniqueSuffix = Date.now();
            const productCard = document.createElement("article");
            productCard.className = "product__card";
            productCard.dataset.title = product.title;
            productCard.dataset.article = product.article;
            productCard.setAttribute("itemscope", "");
            productCard.setAttribute("itemtype", "http://schema.org/Product");
            let sizeSelectorHTML = "";
            if (product.sizes) sizeSelectorHTML = `\n                <div class="product__size-selector">\n                    <label for="size-${product.article}-${uniqueSuffix}">${product.sizeLabel}</label>\n                    <select id="size-${product.article}-${uniqueSuffix}" class="product__size-select">\n                        ${product.sizes.map((size => `<option value="${size}">${size}</option>`)).join("")}\n                    </select>\n                </div>\n            `;
            const priceHTML = product.price ? `\n            <p class="product__price" itemprop="offers" itemtype="http://schema.org/Offer">\n                <span itemprop="price" content="${product.price}">${formatPrice(product.price)}</span>\n                <span itemprop="priceCurrency" content="RUB">₽</span>\n            </p>\n        ` : "";
            productCard.innerHTML = `\n            <img src="${product.image}" alt="${product.title}" class="product__image" loading="lazy" width="300" height="200" itemprop="image">\n            <div class="product__content">\n                <h3 class="product__title" itemprop="name">${product.title}</h3>\n                <p class="product__subtitle" itemprop="sku">Артикул: ${product.article}</p>\n                ${sizeSelectorHTML}\n                <div class="product__footer">\n                    ${priceHTML}\n                    <div class="quantity__controls">\n                        <button type="button" class="quantity__btn minus" aria-label="Уменьшить количество" data-target="quantity-${product.article}-${uniqueSuffix}">-</button>\n                        <input type="number" id="quantity-${product.article}-${uniqueSuffix}" class="quantity__input" value="1" min="1" aria-label="Количество товара">\n                        <button type="button" class="quantity__btn plus" aria-label="Увеличить количество" data-target="quantity-${product.article}-${uniqueSuffix}">+</button>\n                    </div>\n                    <button type="button" class="add-to-cart" itemprop="offers" itemtype="http://schema.org/Offer">\n                        Добавить в корзину\n                        <span class="visually-hidden">товар ${product.title}</span>\n                    </button>\n                </div>\n            </div>\n        `;
            return productCard;
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
            const uniqueProductId = `${productId}-${optionValue || "default"}`;
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
                cartItemElement.innerHTML = `\n                <img src="${item.image}" alt="${item.title}" class="cart-item-image">\n                <div class="cart-item-details">\n                    <h3 class="cart-item-title">${item.title}</h3>\n                    ${item.optionValue ? `<p class="cart-item-option">${item.optionType}: ${item.optionValue}</p>` : ""}\n                    <p class="cart-item-subtitle">${item.subtitle}</p>\n                    ${item.price > 0 ? `<p class="cart-item-price">${formatPrice(item.price)} ₽</p>` : ""}\n                    <div class="cart-item-quantity">\n                        <div class="quantity__controls">\n                            <button type="button" class="quantity__btn minus" data-id="${item.id}">-</button>\n                            <input type="number" class="quantity__input" value="${item.quantity}" min="1" data-id="${item.id}">\n                            <button type="button" class="quantity__btn plus" data-id="${item.id}">+</button>\n                        </div>\n                        <button class="cart-item-remove" data-id="${item.id}">×</button>\n                    </div>\n                </div>\n            `;
                cartItemsContainer.appendChild(cartItemElement);
            }));
            if (submitOrderBtn) submitOrderBtn.setAttribute("aria-label", `Отправить заказ на сумму ${formatPrice(totalPrice)} руб`);
            cartTotal.textContent = formatPrice(totalPrice);
            const totalItems = cart.reduce(((sum, item) => sum + item.quantity), 0);
            cartCount.textContent = totalItems;
            cartFooter.style.display = cart.length > 0 ? "block" : "none";
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
        }
        function performSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout((() => {
                if (!searchInput || !productsContainer) return;
                const searchTerm = searchInput.value.trim().toLowerCase();
                const productCards = document.querySelectorAll(".product__card");
                let hasMatches = false;
                const existingNoResults = document.querySelector(".no-results-message");
                if (existingNoResults) existingNoResults.remove();
                productsContainer.classList.add("searching");
                productCards.forEach((card => {
                    const title = card.dataset.title.toLowerCase();
                    const article = card.dataset.article.toLowerCase();
                    const matches = title.includes(searchTerm) || article.includes(searchTerm);
                    if (matches || !searchTerm) {
                        hasMatches = true;
                        card.classList.remove("hidden");
                    } else card.classList.add("hidden");
                }));
                setTimeout((() => {
                    productsContainer.classList.remove("searching");
                    if (!hasMatches && searchTerm) showNoResultsMessage();
                }), 300);
            }), 300);
        }
        function showNoResultsMessage() {
            const noResults = document.createElement("div");
            noResults.className = "no-results-message";
            noResults.innerHTML = `<p>Товары не найдены</p>`;
            productsContainer.appendChild(noResults);
        }
        function initSearchFunctionality() {
            if (!searchForm) return;
            const searchIcon = searchForm.querySelector(".search-form__icon");
            const searchItem = searchForm.querySelector(".search-form__item");
            function toggleClearButton() {
                if (searchInput && searchClear) searchClear.style.display = searchInput.value ? "block" : "none";
            }
            if (searchInput) {
                searchInput.addEventListener("input", (function() {
                    toggleClearButton();
                    performSearch();
                }));
                searchInput.addEventListener("keydown", (function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        performSearch();
                    }
                }));
            }
            if (searchClear) searchClear.addEventListener("click", (function(e) {
                e.preventDefault();
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                    toggleClearButton();
                    performSearch();
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
            if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
            if (submitOrderBtn) submitOrderBtn.addEventListener("click", submitOrder);
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
                    closeCartBtn.focus();
                }));
                focusStart.addEventListener("focus", (() => {
                    submitOrderBtn.focus();
                }));
            }
        }
        function formatPrice(price) {
            return new Intl.NumberFormat("ru-RU").format(price);
        }
        function init() {
            generateProductCards();
            setupCartOverlay();
            initEventHandlers();
            if (searchForm) initSearchFunctionality();
            fixMobileViewportIssues();
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
        init();
    }));
    document.addEventListener("DOMContentLoaded", (function() {
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
            if (logoText) {
                logoText.style.display = shouldApplyStyles ? "none" : "";
                if (!isDesktop()) logoText.style.display = "";
            }
            if (logoTextShort) {
                logoTextShort.style.opacity = shouldApplyStyles ? "1" : "";
                logoTextShort.style.visibility = shouldApplyStyles ? "visible" : "";
                if (!isDesktop()) {
                    logoTextShort.style.opacity = "";
                    logoTextShort.style.visibility = "";
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
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();