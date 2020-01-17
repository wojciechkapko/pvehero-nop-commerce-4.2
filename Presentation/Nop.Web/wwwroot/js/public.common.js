/*
** nopCommerce custom js functions
*/



function OpenWindow(query, w, h, scroll) {
    var l = (screen.width - w) / 2;
    var t = (screen.height - h) / 2;

    winprops = 'resizable=0, height=' + h + ',width=' + w + ',top=' + t + ',left=' + l + 'w';
    if (scroll) winprops += ',scrollbars=1';
    var f = window.open(query, "_blank", winprops);
}

function setLocation(url) {
    window.location.href = url;
}

function displayAjaxLoading(display) {
    if (display) {
        $('.ajax-loading-block-window').show();
    }
    else {
        $('.ajax-loading-block-window').hide('slow');
    }
}

function displayPopupNotification(message, messagetype, modal) {
    //types: success, error, warning
    var container;
    if (messagetype == 'success') {
        //success
        container = $('#dialog-notifications-success');
    }
    else if (messagetype == 'error') {
        //error
        container = $('#dialog-notifications-error');
    }
    else if (messagetype == 'warning') {
        //warning
        container = $('#dialog-notifications-warning');
    }
    else {
        //other
        container = $('#dialog-notifications-success');
    }

    //we do not encode displayed message
    var htmlcode = '';
    if ((typeof message) == 'string') {
        htmlcode = '<p>' + message + '</p>';
    } else {
        for (var i = 0; i < message.length; i++) {
            htmlcode = htmlcode + '<p>' + message[i] + '</p>';
        }
    }

    container.html(htmlcode);

    var isModal = (modal ? true : false);
    container.dialog({
        modal: isModal,
        width: 350
    });
}
function displayJoinedPopupNotifications(notes) {
    if (Object.keys(notes).length === 0) return;

    var container = $('#dialog-notifications-success');
    var htmlcode = document.createElement('div');

    for (var note in notes) {
        if (notes.hasOwnProperty(note)) {
            var messages = notes[note];

            for (var i = 0; i < messages.length; ++i) {
                var elem = document.createElement("div");
                elem.innerHTML = messages[i];
                elem.classList.add('popup-notification');
                elem.classList.add(note);

                htmlcode.append(elem);
            }
        }
    }

    container.html(htmlcode);
    container.dialog({
        width: 350,
        modal: true
    });
}
function displayPopupContentFromUrl(url, title, modal, width) {
    var isModal = (modal ? true : false);
    var targetWidth = (width ? width : 550);
    var maxHeight = $(window).height() - 20;

    $('<div></div>').load(url)
        .dialog({
            modal: isModal,
            width: targetWidth,
            maxHeight: maxHeight,
            title: title,
            close: function(event, ui) {
                $(this).dialog('destroy').remove();
            }
        });
}

function displayBarNotification(message, messagetype, timeout) {
    var notificationTimeout;

    var messages = typeof message === 'string' ? [message] : message;
    if (messages.length === 0)
        return;

    //types: success, error, warning
    var cssclass = ['success', 'error', 'warning'].indexOf(messagetype) !== -1 ? messagetype : 'success';

    //remove previous CSS classes and notifications
    $('#bar-notification')
      .removeClass('success')
      .removeClass('error')
      .removeClass('warning');
    $('.bar-notification').remove();

    //add new notifications
    var htmlcode = document.createElement('div');
    htmlcode.classList.add('bar-notification', cssclass);

    for (var i = 0; i < messages.length; i++) {
        var content = document.createElement('p');
        content.classList.add('content');
        content.innerHTML = messages[i];

        htmlcode.append(content);
    }
    


    $('#bar-notification')
        .append(htmlcode);

    $('.bar-notification-container .close').velocity("transition.expandIn", { delay: 100, duration: 200 });

    $(htmlcode)
        .velocity('transition.slideDownIn', { duration: 200, display: 'block' })
        .on('mouseenter', function() {
            clearTimeout(notificationTimeout);
        });

    //callback for notification removing
    var removeNoteItem = function () {
        htmlcode.remove();
    };

    $('#close-button').on('click', function () {
        $('.bar-notification-container .close').velocity("transition.expandOut", { duration: 200 });
        $(htmlcode).velocity('transition.slideUpOut', { duration: 200, complete: function () { removeNoteItem(); } });
    });

    //timeout (if set)
    if (timeout > 0) {
        notificationTimeout = setTimeout(function () {
            $(htmlcode).velocity('transition.slideUpOut', { duration: 200 });
        }, timeout);
    }
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


// CSRF (XSRF) security
function addAntiForgeryToken(data) {
    //if the object is undefined, create a new one.
    if (!data) {
        data = {};
    }
    //add token
    var tokenInput = $('input[name=__RequestVerificationToken]');
    if (tokenInput.length) {
        data.__RequestVerificationToken = tokenInput.val();
    }
    return data;
}

var utility = (function () {

    var ScrolltoElement = function (el, offset) {
        $(el).velocity('scroll', {
            duration: 500,
            offset: offset,
            easing: 'ease-in-out'
        });
    };

    var addSpinner = function (id, zindex) {
        var top = $("#" + id).offset().top + $("#" + id).outerHeight() / 2 - 50;
        var left = $("#" + id).offset().left + $("#" + id).outerWidth() / 2 - 50;

        $('body').append("<div class='spinner-wrapper' id='" + id + "_spinner' style='top: " + top + "px; left: " + left + "px; position: absolute;' ><div class='spinner'></div></div>");
        if (zindex) { $('#' + id + '_spinner').css('z-index', zindex); }
    };

    var addSpinnerWithBg = function (id, zindex) {
        var height = $("#" + id).outerHeight();
        var width = $("#" + id).outerWidth();
        var top = $("#" + id).offset().top;
        var left = $("#" + id).offset().left;


        $('body').append("<div id='" + id + "_spinner_bg' class='spinner-bg' style='width:" + width + "px; height:" + height + "px; top: " + top + "px; left: " + left + "px; position: absolute;'></div>");
        if (zindex) { $('#' + id + '_spinner_bg').css('z-index', zindex); }
        utility.addSpinner(id);
    };

    var removeSpinner = function (id) {
        $("#" + id + "_spinner_bg").remove();
        $("#" + id + "_spinner").remove();
    };

    var addButtonSpinner = function (el, zindex) {
        el.css("width", el.css("width")).css("height", el.css("height"));
        el.html("<div class='spinner-wrapper'><div class='spinner small'></div></div>");
        if (zindex) { el.children('.spinner-wrapper').css('z-index', zindex); }
    };

    var isInViewport = function (el) {

        var elementTop = $(el).offset().top;
        var elementBottom = elementTop + $(el).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    return {
        ScrolltoElement: ScrolltoElement,
        addSpinner: addSpinner,
        addButtonSpinner: addButtonSpinner,
        addSpinnerWithBg: addSpinnerWithBg,
        removeSpinner: removeSpinner,
        isInViewport: isInViewport
    };
})();

var selectList = (function () {
    var initSelect2 = function () {

        [].forEach.call(document.querySelectorAll("select:not(.w-100)"), function (el) {
            $(el).dropdown();
        });

        [].forEach.call(document.querySelectorAll("select.w-100"), function (el) {
            $(el).dropdown({
                customClass: 'w-100'
            });
        });

    };

    var initDropdowns = function () {

        [].forEach.call(document.querySelectorAll('.dropdown-toggle'), function (el) {
            new Dropdown(el);
        });
    };


    return {
        initSelect2: initSelect2,
        initDropdowns: initDropdowns
    };

})();

var loader = (function () {
    var reloadContent = function (attributes) {
        var element = $("#" + attributes.id);
        var url = attributes.url;
        if (url === undefined) {
            url = document.location;
        }

        element.load(url + ' #' + attributes.id + ' > *', function () {
            $('#' + attributes.id + '_spinner').remove();
            $("#" + attributes.id + '_spinner_bg').remove();
            if (attributes.callback) {
                attributes.callback();
            }
        });
    };

    return {
        reloadContent: reloadContent
    };
})();