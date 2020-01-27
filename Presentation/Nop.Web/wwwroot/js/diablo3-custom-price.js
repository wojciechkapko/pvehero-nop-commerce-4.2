var customPrices = (function () {
    var paragon_start = $(".currentparagon");
    var paragon_end = $(".targetparagon");
    var price = $(".enter-price-input");
    

    var initCustomPrice = function () {
        $(".huge.add-to-cart-button").removeClass("mt-4");

        paragon_start.attr('placeholder', '1-2999 max').on("keyup", function () {
            customPrices.reCalculate();
        });
        paragon_end.attr('placeholder', '1-3000 max').on("keyup", function () {
            customPrices.reCalculate();
        });

    };

    var reCalculate = function () {
        let start = parseInt(paragon_start.val(), 10);
        let end = parseInt(paragon_end.val(), 10);
        let multi = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3, 4.5];

        let result = calculate(start, end, multi);
        if (result > 0 && result < 11000) {
            result *= Number($('#currency-rate').val());
            price.val(result.toFixed(2));
        } else {
            price.val('Error');
        }

        
    };
    var calculate = function (start, end, multi) {
        let value = 0;

        if (end > 101) {
            let iterations = parseInt((end-1) / 100, 10);

            for (j = 0; j < iterations; j++) {
                if (j + 1 === iterations) {
                    if (iterations !== 1) {
                        value += (end - (j + 1) * 100) * multi[j];
                    } else {
                        value += (end - start) * multi[j];
                    }
                } else if (j === 0) {
                    value += (200 - start) * multi[j];
                } else {
                    value += (((j + 2) * 100) - ((j + 1) * 100)) * multi[j];
                }
            }
        } else {
            value = (end - start) * multi[0];
        }


        if (end > 999) {

            let iter = parseInt((end - 1000) / 100) + 1;

            for (i = 0; i < iter; i++) {
                value = value + (1200 * (iter / 100));
            }
        }

        return value;
    };


    return {
        initCustomPrice: initCustomPrice,
        reCalculate: reCalculate,
        calculate: calculate
    };

})();