var isPhoneGapApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
var rowH;
$(document).ready(function() {
    // define available background images
    var bgImages = [
        { file: 'images/01.jpg', w: 1536, h: 1024 },
        { file: 'images/02.jpg', w: 1536, h: 1024 },
        { file: 'images/03.jpg', w: 1280, h: 853 },
        { file: 'images/04.jpg', w: 1536, h: 1024 },
        { file: 'images/05.jpg', w: 1538, h: 1024 },
        { file: 'images/06.jpg', w: 1820, h: 1024 },
        { file: 'images/07.jpg', w: 1535, h: 1024 },
        { file: 'images/08.jpg', w: 1542, h: 1024 },
        { file: 'images/09.jpg', w: 1280, h: 850 },
        { file: 'images/10.jpg', w: 1541, h: 1024 },
        { file: 'images/11.jpg', w: 1536, h: 1024 },
        { file: 'images/12.jpg', w: 672, h: 448 },
        { file: 'images/13.jpg', w: 1280, h: 960 },
        { file: 'images/14.jpg', w: 1341, h: 1159 }
    ];
    // pick one randomly
    var bgImage = bgImages[Math.floor(Math.random() * bgImages.length)];
    var bgHorizontality = bgImage.w / bgImage.h;
    // get body dimensions
    var bodyW = $('body').width();
    var bodyH = $('body').height();
    var bodyHorizontality = bodyW / bodyH;
    // calculate the row height (minimum 48)
    rowH = bodyH / 11;
    if (rowH < 48) {
        rowH = 48;
        bodyH = 10 * rowH;
    }
    // calculate the fontsize
    var fontS = 14 / 48 * rowH;
    // calculate the size and offset of the image
    var bgX = 0;
    var bgY = 0;
    if (bgHorizontality > bodyHorizontality) { // like e.g. on a portait phone screen
        var bgScale = bodyH / bgImage.h;
        var bgH = bodyH;
        var bgX = - 1/2 * (bgScale * bgImage.w - bodyW);
        var bgSize = 'auto' + ' ' + bgH + 'px';
    } else { // like e.g. on a widescreen monitor
        var bgScale = bodyW / bgImage.w;
        var bgW = bodyW;
        var bgY = - 1/2 * (bgScale * bgImage.h - bodyH);
        var bgSize = bgW + 'px auto';
    }
    // set the rows with the row height and fontsize
    $('header,.ruimte,h1.init').css('height', rowH + 'px');
    $('header,h1').css('line-height', rowH + 'px').css('font-size', fontS + 'pt');
    // set the background image  
    $('header,.ruimte,h1')
//        .css('background', '#607D8B')
        .css('background-image', 'url(' + bgImage.file + ')')
        .css('background-size', bgSize)
        .css('background-position-x', bgX + 'px');
    // set the variable Y-offset
    var bgOffsets = [
        { q: 'header', y: bgY },
        { q: '.ruimte.boven', y: bgY - rowH },
        { q: '.gregoriaanse-liederen h1', y: bgY - 2*rowH },
        { q: '.gemeenschappelijke-gebeden h1', y: bgY - 3*rowH },
        { q: '.drie-eenheid h1', y: bgY - 4*rowH },
        { q: '.aanbidding h1', y: bgY - 5*rowH },
        { q: '.heilige-geest h1', y: bgY - 6*rowH },
        { q: '.maria h1', y: bgY - 7*rowH },
        { q: '.voor-de-mis h1', y: bgY - 8*rowH },
        { q: '.na-de-mis h1', y: bgY - 9*rowH },
        { q: '.ruimte.beneden', y: bgY - 10*rowH }
    ];
    $.each(bgOffsets, function(index, value) {
        $(value.q).css('background-position-y', value.y + 'px');    
    });
    if (!isPhoneGapApp) {
        // something to do only on web
        $('footer').show();
//    } else {
        // something to do only on app
//        document.addEventListener("deviceready", function(){
//      		navigator.splashscreen.hide();
//        }, false);
    }
}); 
var Webflow = Webflow || [];
Webflow.push(function () { 
    var speed = 0.90;
    var speedLast = 1.00;
    $('h1').on('click', function() {
        var scrollReference = $(document).scrollTop();
        var scrollCorrection = 0;
        // find the h1 for which the toc is shown
        var openH1 = $('h1.selected'); 
        var onlyCollapse = $(this).hasClass('selected');
        if (openH1.length) {
            var before = $('h1').index(openH1) < $('h1').index(this);
            var showingH2s = openH1.parent().find('h2.listed,h2.selected');
            if (showingH2s.length) {
                if (before) 
                    showingH2s.each(function() {
                        scrollCorrection -= this.scrollHeight;
                    });
                var showingContent = openH1.parent().find('.content.showing');
                if (showingContent.length) {
                    if (before) scrollCorrection -= showingContent.height();
                    // hide the contents in that h1
                    showingContent.removeClass('showing').animate({
                        height: 0
                    }, speed * 1000);
                }
                // hide the h2's in that h1
                showingH2s.removeClass('listed').removeClass('selected').animate({
                    height: 0
                }, speed * 1000);
            }
            openH1.removeClass('selected')
            if (before) scrollCorrection += openH1.height();
        }
        if (!onlyCollapse) {
            $(this).addClass('selected');
            var contentToShow = $(this).parent().find('h2');
            // show the h2's in this h1
            contentToShow.addClass('listed').animate({
                height: "48px"
            }, speed * 1000);
            // align to top of the screen
            $('html, body').animate({
                scrollTop: (Math.max(0, scrollReference + scrollCorrection))
            }, speedLast * 1000, function() {
                $('body').css('display', 'table').height();
                $('body').css('display', 'block'); 
            });
        }
    });
    $('h2').on('click', function() {
        var scrollReference = $(this).offset().top /*+ this.scrollHeight*/;
        var scrollCorrection = 0;
        // find the h2 for which content is shown
        var openH2 = $(this).parents('.toc').find('h2.selected');
        var onlyCollapse = $(this).hasClass('selected');
        if (openH2.length) {
            var before = $('h2').index(openH2) < $('h2').index(this);
            var contentToHide = openH2.siblings('.content');
            if (contentToHide.length) {
                if (before) scrollCorrection -= contentToHide.get(0).scrollHeight; 
                // hide the content in that h2
                contentToHide.removeClass('showing').animate({
                    height: 0
                }, speed * 1000); 
            }
            // change that h2 to listed
            openH2.removeClass('selected').addClass('listed');
        }
        // only do the following if the clicked h2 was not the open one
        if (!onlyCollapse) {
            // change this h2 to selected
            $(this).removeClass('listed').addClass('selected');
            var contentToShow = $(this).siblings('.content');
            var contentToShowHeight = contentToShow.get(0).scrollHeight;
            var screenHeight = $(window).innerHeight();
            // show the content
            contentToShow.addClass('showing').animate({
                height: Math.max(contentToShowHeight, screenHeight) + "px"
            }, speed * 1000);
            // align to top of the screen
            $('html, body').animate({
                scrollTop: (scrollReference + scrollCorrection)
            }, speedLast * 1000);
        }
        /* h2 moves up because elements before h2 are hiding
         * the page scrolls up to h2's new position 
         * if the scrolling is faster than the moving, h2 appears to move down */
    });
    $('header').on('click', function() {
        // hide the h2's in that h1
        // hide the contents in that h1
        var scrollReference = $(document).scrollTop();
        var scrollCorrection = 0;
        // find the h1 for which the toc is shown
        var openH1 = $('h1.selected');
        if (openH1.length) {
            var before = $('h1').index(openH1) < $('h1').index(this);
            var showingH2s = openH1.parent().find('.toc');
            if (showingH2s.length) {
                if (before) 
                    showingH2s.each(function() {
                        scrollCorrection -= this.scrollHeight;
                    });
                showingH2s.removeClass('listed').removeClass('selected').animate({
                    height: 0
                }, speed * 1000);
                var showingContent = openH1.parent().find('.content.showing');
                if (showingContent.length) {
                    if (before) scrollCorrection -= showingContent.height();
                    showingContent.removeClass('showing').animate({
                        height: 0
                    }, speed * 1000);
                }
            }
            openH1.removeClass('selected').animate({
                height: rowH + "px"
            }, speed * 1000);
            if (before) scrollCorrection += openH1.height();
        }
        // align to top of the screen
        $('html, body').animate({
            scrollTop: (Math.max(0, scrollReference + scrollCorrection))
        }, speedLast * 1000);
    });
    $('.content').on('click', function() {
        // workaround for webflow sliders not being aligned properly
        // when being rendered while part of hidden content.
        // after testing numberous workarounds, I found out that a
        // window resize triggers proper realigning of the slider
        // so this one ends up as most elegant.
        $(window).trigger('resize');
    });
//    $('.content').hide();
});
