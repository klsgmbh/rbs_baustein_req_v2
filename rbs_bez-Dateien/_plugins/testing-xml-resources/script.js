$(document).ready(function () {
    function close($panels) {
        $panels.removeClass("open");
        $("body").removeClass("no-scroll");
    }

    $(document).keyup(function (event) {
        if (event.which == 27) {
            var $p = $(".panel.open");
            if ($p.length > 0) {
                close($p);
                event.stopPropagation();
            }
        }
    });
    $(".panel .close").click(function () {
        close($(this).parent());

    });
    $(".open-panel").click(function () {
        var panelId = $(this).attr("data-panel-id");
        $(document.getElementById(panelId)).addClass("open");
        $("body").addClass("no-scroll");
    });
});
