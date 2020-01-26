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

    $('.bar-notification-container .close').fadeIn('slow');

    $(htmlcode)
        .fadeIn('slow')
        .on('mouseenter', function() {
            clearTimeout(notificationTimeout);
        });

    //callback for notification removing
    var removeNoteItem = function () {
        htmlcode.remove();
    };

    $('#close-button').on('click', function () {
        $('.bar-notification-container .close').fadeOut('slow');
        $(htmlcode).fadeOut('slow');
    });

    //timeout (if set)
    if (timeout > 0) {
        notificationTimeout = setTimeout(function () {
            $(htmlcode).fadeOut('slow');
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

    var addSpinner = function (id, zindex) {
        if (id.indexOf('#') > -1) {
            id = id.replace('#', '');
        }

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
        if (id.indexOf('#') > -1) {
            id = id.replace('#', '');
        }
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

    var addOverlay = function (spinner) {
        if (!$('#overlay').length) {
            $('#modal-wrapper').append('<div id="overlay" class="overlay"></div>');
            $('#overlay').fadeIn(250);
            $('body').css('overflow', 'hidden');
            $('#overlay').off('click').on('click', function () {
                closeModal();
            });
        }


        if (spinner) {
            //$('#overlay').append('<div id="overlay-spinner" class="spinner" style="position:absolute; top:50%; left:50%; z-index:9999; margin: 0;"></div>');
            console.log('adding spinner');
            utility.addSpinner("overlay", 9999);
        }
    };

    var removeOverlay = function () {
        $('#overlay').fadeOut(250, function () { $('#overlay').remove(); $('body').css('overflow', 'visible'); }); 
    };

    var openModal = function (modalType, guestCheckout) {
        var modal = "#modal";
        addOverlay(true);
        var modalUrl;
        if (modalType === 'login') {
            modalUrl = '/LoginForm';
            $('#flyout-cart').removeClass('active');
        }
        if (modalType === 'register') {
            modalUrl = '/RegisterForm';
        }
        if (modalType === 'forgotpassword') {
            modalUrl = '/PasswordRecoveryForm';
        }
        if (modalType === 'registerresult') {
            modalUrl = '/RegisterResultForm';
        }
        if (modalType === 'forgotpasswordresult') {
            modalUrl = '/PasswordRecoveryForm';
        }

        $(modal).load(modalUrl, function () {

            if (modalType === 'login') {
                if (guestCheckout) {
                    $(modal).find('.checkout-as-guest-or-register-block').show();  
                }
                else {
                    $(modal).find('.checkout-as-guest-or-register-block').hide();
                }
            }
            removeSpinner('overlay');
            console.log('removing spinner');
            $('#modal').fadeIn({ duration: 250, start: function () { $('#modal-wrapper').css('pointer-events', 'all'); } });
        });





        $(document).off('keydown').on("keydown", function (e) {
            if (e.keyCode === 27) {
                closeModal();
            }
        });
        
        
    };

    var closeModal = function () {
        removeOverlay();
        $('#modal').fadeOut({ duration: 250, complete: function () { $('#modal').removeClass("loaded").html(""); $('#modal-wrapper').css('pointer-events', 'none'); $(document).off("keydown"); } });
    };

    var reloadModalContent = function (selector) {
        let modal = '#modal';
        $(modal).fadeOut(250, function () {
            addSpinner('overlay');
            if (selector === '#fnspopuplogin') {
                $(modal).load('/LoginForm', function () { fns_popuplogin_refreshlink(); removeSpinner('overlay'); $(modal).fadeIn(250);});
            }
            if (selector === '#fnspopupregistration') {
                $(modal).load('/RegisterForm', function () { fns_popuplogin_refreshlink(); removeSpinner('overlay'); $(modal).fadeIn(250);});
            }
            if (selector === '#fnspopupforgotpassword') {
                $(modal).load('/PasswordRecoveryForm', function () { fns_popuplogin_refreshlink(); removeSpinner('overlay'); $(modal).fadeIn(250);});
            }
            if (selector === '#fnspopupregistrationresult') {
                $(modal).load('/RegisterResultForm', function () { fns_popuplogin_refreshlink(); removeSpinner('overlay'); $(modal).fadeIn(250); });
            }
            if (selector === '#fnspopupforgotpasswordresult') {
                $(modal).load('/PasswordRecoveryForm', function () { fns_popuplogin_refreshlink(); removeSpinner('overlay'); $(modal).fadeIn(250); });
            }

        });



    };

    return {
        addSpinner: addSpinner,
        addButtonSpinner: addButtonSpinner,
        addSpinnerWithBg: addSpinnerWithBg,
        removeSpinner: removeSpinner,
        isInViewport: isInViewport,
        addOverlay: addOverlay,
        removeOverlay: removeOverlay,
        openModal: openModal,
        closeModal: closeModal,
        reloadModalContent: reloadModalContent
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