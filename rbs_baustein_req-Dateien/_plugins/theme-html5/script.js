$(document).ready(function () {
    $('section.live :checkbox, section.live select').on('change', function () {
        var stay = $(this).closest("section").data("live-stay");
        $(document.getElementById(stay)).click();
    });
    $('section.live :radio').on('change', function () {
        if ($(this).is(':checked')) {
            var stay = $(this).closest("section").data("live-stay");
            $(document.getElementById(stay)).click();
        }
    });
});