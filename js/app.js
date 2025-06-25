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
        const cartIcon = document.getElementById("cart-icon");
        const cartModal = document.querySelector(".cart-modal");
        const closeCartBtn = document.querySelector(".close-cart");
        const cartItemsContainer = document.querySelector(".cart-items");
        const cartTotal = document.querySelector(".total-price");
        const cartCount = document.querySelector(".cart-count");
        const addToCartButtons = document.querySelectorAll(".add-to-cart");
        const submitOrderBtn = document.querySelector(".submit-order");
        const cartFooter = document.querySelector(".cart-footer");
        const cartOverlay = document.createElement("div");
        cartOverlay.className = "cart-overlay";
        document.body.appendChild(cartOverlay);
        let cart = [];
        let totalPrice = 0;
        function parsePrice(priceString) {
            const cleaned = priceString.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
            return parseFloat(cleaned) || 0;
        }
        if (submitOrderBtn) submitOrderBtn.addEventListener("click", submitOrder);
        document.querySelectorAll(".quantity__btn").forEach((button => {
            button.addEventListener("click", (function(e) {
                e.preventDefault();
                const controls = this.closest(".quantity__controls");
                if (!controls) return;
                const input = controls.querySelector(".quantity__input");
                if (!input) return;
                let value = parseInt(input.value) || 1;
                if (this.classList.contains("minus") && value > 1) value--; else if (this.classList.contains("plus")) value++;
                input.value = value;
            }));
        }));
        if (cartIcon) cartIcon.addEventListener("click", (function(e) {
            e.preventDefault();
            cartModal.classList.add("active");
            cartOverlay.classList.add("active");
        }));
        if (closeCartBtn) closeCartBtn.addEventListener("click", (function() {
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
        }));
        if (cartOverlay) cartOverlay.addEventListener("click", (function() {
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
        }));
        addToCartButtons.forEach((button => {
            button.addEventListener("click", (function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productCard = this.closest(".product__card");
                if (!productCard) return;
                const productSubtitle = productCard.querySelector(".product__subtitle");
                const productTitle = productCard.querySelector(".product__title");
                const productPrice = productCard.querySelector(".product__price");
                const quantityInput = productCard.querySelector(".quantity__input");
                const productImage = productCard.querySelector(".product__image");
                if (!productSubtitle || !productTitle || !productPrice || !quantityInput || !productImage) {
                    console.error("Не найдены необходимые элементы в карточке товара");
                    return;
                }
                const productId = productSubtitle.textContent.split(": ")[1] || Date.now().toString();
                const productTitleText = productTitle.textContent || "Без названия";
                const productPriceValue = parsePrice(productPrice.textContent);
                const productQuantity = parseInt(quantityInput.value) || 1;
                const productImageSrc = productImage.src || "";
                const existingItem = cart.find((item => item.id === productId));
                if (existingItem) existingItem.quantity += productQuantity; else cart.push({
                    id: productId,
                    title: productTitleText,
                    price: productPriceValue,
                    quantity: productQuantity,
                    image: productImageSrc,
                    subtitle: productSubtitle.textContent
                });
                updateCart();
                if (cartCount) {
                    cartCount.classList.add("update");
                    setTimeout((() => {
                        cartCount.classList.remove("update");
                    }), 500);
                }
            }));
        }));
        function updateCart() {
            if (!cartItemsContainer || !cartTotal || !cartCount || !cartFooter) return;
            cartItemsContainer.innerHTML = "";
            totalPrice = 0;
            cart.forEach((item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                const cartItemElement = document.createElement("div");
                cartItemElement.className = "cart-item";
                cartItemElement.innerHTML = `\n                <img src="${item.image}" alt="${item.title}" class="cart-item-image">\n                <div class="cart-item-details">\n                    <h3 class="cart-item-title">${item.title}</h3>\n                    <p class="cart-item-subtitle">${item.subtitle}</p>\n                    <p class="cart-item-price">${formatPrice(item.price)} ₽</p>\n                    <div class="cart-item-quantity">\n                        <button class="quantity-btn minus" data-id="${item.id}" aria-label="Уменьшить количество">-</button>\n                        <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" \n                               data-id="${item.id}" aria-label="Количество товара">\n                        <button class="quantity-btn plus" data-id="${item.id}" aria-label="Увеличить количество">+</button>\n                        <button class="cart-item-remove" data-id="${item.id}" aria-label="Удалить товар">×</button>\n                    </div>\n                </div>\n            `;
                cartItemsContainer.appendChild(cartItemElement);
            }));
            cartTotal.textContent = formatPrice(totalPrice);
            const totalItems = cart.reduce(((sum, item) => sum + item.quantity), 0);
            cartCount.textContent = totalItems;
            cartFooter.style.display = cart.length > 0 ? "block" : "none";
            document.querySelectorAll(".cart-item-quantity .minus").forEach((btn => {
                btn.addEventListener("click", (function() {
                    const id = this.getAttribute("data-id");
                    const item = cart.find((item => item.id === id));
                    if (item && item.quantity > 1) {
                        item.quantity--;
                        updateCart();
                    }
                }));
            }));
            document.querySelectorAll(".cart-item-quantity .plus").forEach((btn => {
                btn.addEventListener("click", (function() {
                    const id = this.getAttribute("data-id");
                    const item = cart.find((item => item.id === id));
                    if (item) {
                        item.quantity++;
                        updateCart();
                    }
                }));
            }));
            document.querySelectorAll(".cart-quantity-input").forEach((input => {
                input.addEventListener("change", (function() {
                    const id = this.getAttribute("data-id");
                    const item = cart.find((item => item.id === id));
                    const newQuantity = parseInt(this.value) || 1;
                    if (item && newQuantity >= 1) {
                        item.quantity = newQuantity;
                        updateCart();
                    } else this.value = item.quantity;
                }));
                input.addEventListener("input", (function() {
                    this.value = this.value.replace(/[^0-9]/g, "");
                }));
            }));
            document.querySelectorAll(".cart-item-remove").forEach((btn => {
                btn.addEventListener("click", (function() {
                    const id = this.getAttribute("data-id");
                    cart = cart.filter((item => item.id !== id));
                    updateCart();
                }));
            }));
        }
        function formatPrice(price) {
            return new Intl.NumberFormat("ru-RU").format(price);
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
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
        }
        const searchForm = document.querySelector(".search-form");
        if (searchForm) {
            const searchIcon = searchForm.querySelector(".search-form__icon");
            const searchItem = searchForm.querySelector(".search-form__item");
            const searchInput = searchForm.querySelector(".search-form__input");
            const searchClear = searchForm.querySelector(".search-form__clear");
            const productCards = document.querySelectorAll(".product__card");
            if (searchIcon && searchItem && searchInput && searchClear) {
                searchIcon.addEventListener("click", (function(e) {
                    e.stopPropagation();
                    searchItem.classList.toggle("active");
                    if (searchItem.classList.contains("active")) searchInput.focus();
                }));
                searchClear.addEventListener("click", (function() {
                    searchInput.value = "";
                    searchInput.focus();
                    performSearch();
                }));
                document.addEventListener("click", (function(e) {
                    if (!searchForm.contains(e.target)) searchItem.classList.remove("active");
                }));
                searchInput.addEventListener("input", (function() {
                    searchClear.style.display = this.value ? "block" : "none";
                    performSearch();
                }));
                function performSearch() {
                    const searchTerm = searchInput.value.trim().toLowerCase();
                    productCards.forEach((function(card) {
                        const title = card.querySelector(".product__title")?.textContent.toLowerCase() || "";
                        const article = card.querySelector(".product__subtitle")?.textContent.toLowerCase() || "";
                        const isVisible = title.includes(searchTerm) || article.includes(searchTerm);
                        card.style.display = isVisible ? "block" : "none";
                    }));
                }
            }
        }
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();