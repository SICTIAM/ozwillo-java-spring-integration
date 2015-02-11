$(document).ready(function () {


    $("a.nav-link").hover(
        function () {
            var image_purple = $(this).find("img.purple");
            image_purple.fadeIn(250);
        },
        function () {
            var image_purple = $(this).find("img.purple");
            image_purple.fadeOut(250);
        }
    );


    var updateNotifications = function () {

        $.get($(".my-oasis").attr("data").toString(),
                function (notifData) {
                    var element = $(".my-oasis span.badge.badge-notifications");
                    if (notifData.notificationsCount > 0) {
                        element.html(notifData.notificationsCount);
                        element.show();

                        element.data("popover", null).popover({
                                placement:"bottom",
                                trigger:"hover",
                                container:"body",
                                content:notifData.notificationsMessage
                            });

                        element.attr("data-content", notifData.notificationsMessage);

                    } else {
                        element.hide();
                    }
                    setTimeout(updateNotifications, 2000);
                }
        );

    }

    if ($(".my-oasis").attr("data")) {
        updateNotifications();
    }

});