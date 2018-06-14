var popUpWindow = (function() {
    "use strict";
    var data = new Object();
    var element = new Object();
    var closingButton = new Object();
    var button = new Object();
    var title = new Object();
    var link = new Object();
    var message = new Object();
    var elementClassName = "pop-up";
    var closingButtonClassName = "closing-button";
    var buttonClassName = "copy-button";
    var titleClassName = "title";
    var activeClassName = "active";
    var animationClassName = "opacity-change";
    var delay = 500;
    var copy = function(value) {
        var additoryVariable = new Object();
        if (!(message instanceof Element)) {
            additoryVariable = document.createElement("textarea");
            additoryVariable.style.opacity = 0;
            additoryVariable.style.position = "absolute";
            additoryVariable.textContent = value;
            element.appendChild(additoryVariable);
            additoryVariable.select();
            document.execCommand("copy");
            element.removeChild(additoryVariable);
            appendMessage();
            window.setTimeout(function() {
                message.className = animationClassName;
            }, delay);
        }
    };
    var appendMessage = function() {
        message = document.createElement("p");
        message.textContent = "Email скопирован...";
        if (element) element.appendChild(message);
        message.addEventListener("transitionend", deleteMessage, true);
        message.addEventListener("webkittransitionend", deleteMessage, true);
    };
    var deleteMessage = function() {
        element.removeChild(message);
        message = new Object();
    };
    var setData = function() {
        resetData();
        title.innerHTML = data.name + "<span>" + data.email + "</span>";
        link.href = "https://lms.fazarosta.com/admin/students/" + data.id + "/edit-view";
    };
    var resetData = function () {
        title.innerHTML = "";
        link.href = "#";
    };
    return {
        Data: function(value) {
            if (!arguments.length) return data;
            else {
                data = value;
                if (element instanceof Element) {
                    setData();
                }
            }
        },
        Element: function(value) {
            if (!arguments.length) return element;
            else element = value;
        },
        initialize: function() {
            var additoryVariable = new Object();
            if (element && testClassName(element, elementClassName)) {
                //Поиск кнопки для копирования 
                additoryVariable = selectElementByClassName(buttonClassName, element);
                if (additoryVariable.status) {
                    button = additoryVariable.element;
                    //Поиск кнопки для сокрытия всплывающего окна;
                    additoryVariable = selectElementByClassName(closingButtonClassName, element);
                    if (additoryVariable.status) {
                        closingButton = additoryVariable.element;
                        additoryVariable = selectElementByClassName(titleClassName, element);
                        if (additoryVariable.status) {
                            title = additoryVariable.element;
                            additoryVariable = element.getElementsByTagName("a");
                            if (additoryVariable.length) {
                                link = additoryVariable[0];
                                if (checkObject(data)) {
                                    setData();
                                }
                                document.body.addEventListener("click", this, true);
                            }
                        }
                    } else notify(closingButtonClassName, 2);
                } else notify(buttonClassName, 2);
            } else notify(elementClassName, 1);
        },
        show: function() {
            addClassName(element, activeClassName);
        },
        hide: function() {
            clearClassName(element, activeClassName);
        },
        handleEvent: function(event) {
            event = event || window.event;
            var additoryVariable = new Object();
            if (event.type === "click") {
                switch (event.target) {
                    case closingButton:
                        this.hide();
                        break;
                    case button:
                        copy(data.email);
                        break;
                    default:
                        additoryVariable = searchContainer(event.target, "class", closingButtonClassName);
                        //Найдена закрывающая кнопка
                        if (additoryVariable.status) {
                            this.hide();
                        } else {
                            additoryVariable = searchContainer(event.target, "class", elementClassName);
                            //Пользователь нажал на область за пределами всплывающего окна;
                            if (!additoryVariable.status) {
                                this.hide();
                            }
                        }
                        break;
                }
            }
        }
    };
})();