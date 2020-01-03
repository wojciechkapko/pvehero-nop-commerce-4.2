var AjaxReviews = (function () {

    var initRating = function () {
        $('#rating.hover .star.rate').click(function () {
            var rate = $(this).data('rating') - 1;
            $(this).parent().attr('data-stars', $(this).data('rating'));
            $("#addproductrating_" + rate).prop("checked", true);
        });
    };

    return {
        initRating: initRating
    };
})();