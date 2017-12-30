var rowH;
var isphone = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

document.addEventListener("deviceready", function(){
    console.log("DEBUG in deviceready handler now");
});

$(function() {
    console.log("DEBUG in jQuery ready handler now")
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
    rowCount = $('footer').prevAll().length;
    rowH = bodyH / rowCount;
    if (rowH < 48) {
        rowH = 48;
        bodyH = (rowCount - 1) * rowH;
    }
    // calculate the fontsize
    var fontS = 14 / 48 * rowH;
    // calculate the size and offset of the image
    var bgX = 0;
    var bgY = 0;
    if (bgHorizontality > bodyHorizontality) { // like e.g. on a portait phone screen
        var bgScale = bodyH / bgImage.h;
        var bgH = bodyH;
        bgX = - 1/2 * (bgScale * bgImage.w - bodyW);
        var bgSize = 'auto' + ' ' + bgH + 'px';
    } else { // like e.g. on a widescreen monitor
        var bgScale = bodyW / bgImage.w;
        var bgW = bodyW;
        bgY = - 1/2 * (bgScale * bgImage.h - bodyH);
        var bgSize = bgW + 'px auto';
    }
    // set the rows with the row height and fontsize
    $('header,.ruimte,h1.init').css('height', rowH + 'px');
    $('header,.ruimte,h1').css('line-height', rowH + 'px').css('font-size', fontS + 'pt');
    // set the background image  
    $('header,.ruimte,.item:has(h1)')
//        .css('background', '#607D8B')
        .css('background-image', 'url(' + bgImage.file + ')')
        .css('background-size', bgSize)
        .css('background-position-x', bgX + 'px');
    // set the variable Y-offset
    $('footer').prevAll().each(function(index) {
      var actualIndex = rowCount - index - 1;
      $(this).css('background-position-y', (bgY - actualIndex * rowH) + 'px');
    });
    if (!isphone) {
        // something to do only on web
        $('footer').show();
//    } else {
        // something to do only on app
//        document.addEventListener("deviceready", function(){
//      		navigator.splashscreen.hide();
//        }, false);
    }
}); 
function headerOnClick(header) {
  // hide the h2's in the selected h1
  // hide the contents in that h1
  // align to top of the screen
  TweenLite.to(window,1,0);
  // find the h1 for which the toc is shown
  var openH1 = $('h1.selected');
  var showingH2s = $('h2.listed,h2.selected');
  // hide the h2's in that h1
  TweenLite.to(showingH2s,1,{height:0});
  showingH2s.removeClass('listed').removeClass('selected');
  var openContent = $('.content.showing');
  // hide the contents in that h1
  TweenLite.to(openContent,1,{height:0});
  openContent.removeClass('showing');
  TweenLite.to(openH1,1,{height:rowH});
  openH1.removeClass('selected');
}
function h1OnClick(h1) {
  // show all child h2's and hide all contents
  // if this h1 is open, hide all contents
  // else (this h1 is closed), close the open h1 and show all h2's
  if ($(h1).is('.selected')) {
    var openContent = $('.content.showing');
    // hide the open contents in that h1
    TweenLite.to(openContent,1,{height:0});
  } else {
    var scrollTargetHash = '#' + $(h1).attr('id');
    // align to top of the screen
    TweenLite.to(window,1,{
      scrollTo: scrollTargetHash,
      onComplete: function() {
        TweenLite.set(window, {scrollTo: scrollTargetHash});
      }
    });
    // find the h1 for which the toc is shown
    var openH1 = $('h1.selected'); 
    var showingH2s = $('h2.listed,h2.selected');
    var openContent = $('.content.showing');
    // hide the contents in that h1
    TweenLite.to(openContent,1,{height:0});
    openContent.removeClass('showing');
    // hide the h2's in that h1
    TweenLite.to(showingH2s,1,{height:0});
    showingH2s.removeClass('listed').removeClass('selected');
    openH1.removeClass('selected')
    $(h1).addClass('selected');
  }
  var h2sToShow = $(h1).parent().find('h2');
  // show the h2's in this h1
  h2sToShow.addClass('listed');
  TweenLite.to(h2sToShow,1,{height:48});
}
function h2OnClick(h2) {
  // show this content and hide all other
  // (assumption: the parent h1 is already selected)
  // only do the following if the clicked h2 was not the open one
  if (!$(h2).is('.selected')) {
    var scrollTargetHash = '#' + $(h2).attr('id');
    // find the h2 and content for which content is shown (do it now, because in the onComplete it will be too late)
    var openH2 = $('h2.selected');
    var openContent = $('.content.showing');
    // align to top of the screen
    TweenLite.to(window,1,{
      scrollTo: scrollTargetHash,
      onComplete: function() {
        // hide the content in the open h2
        TweenLite.set(openContent, {height: 0});
        openContent.removeClass('showing');
        // change that h2 to listed
        openH2.removeClass('selected').addClass('listed');
        // align to top of the screen (based on advise from TweenLite forum)
        TweenLite.set(window, {scrollTo: scrollTargetHash});
      }
    });
    // change this h2 to selected
    $(h2).removeClass('listed').addClass('selected');
    var contentToShow = $(h2).siblings('.content');
    var contentToShowHeight = contentToShow.get(0).scrollHeight;
    var screenHeight = $(window).innerHeight();
    // show the content
    contentToShow.addClass('showing');
    TweenLite.to(contentToShow,1,{height:Math.max(contentToShowHeight, screenHeight)});
  } else {
    // select the next h2 (if any)
    nextH2 = $(h2).parent().next().find('h2');
    if (nextH2.length) h2OnClick();
  }
}
var Webflow = Webflow || [];
Webflow.push(function () { 
  var speed = 0.90;
  var speedLast = 0.90;
  $('header').on('click', function() {
    headerOnClick(this);
    window.history.pushState({}, "Katholieke Gebeden", "#");
  });
  $('h1').on('click', function() {
    h1OnClick(this);
    window.history.pushState({}, "Katholieke Gebeden" + $(this).text(), "#" + $(this).attr('id'));
  });
  $('h2').on('click', function() {
    h2OnClick(this);
    window.history.pushState({}, "Katholieke Gebeden" + $(this).text(), "#" + $(this).attr('id'));
  });
  $('.content').on('click', function() {
      // workaround for webflow sliders not being aligned properly
      // when being rendered while part of hidden content.
      // after testing numberous workarounds, I found out that a
      // window resize triggers proper realigning of the slider
      // so this one ends up as most elegant.
      $(window).trigger('resize');
  });
  var navigateToHash = function() {
    var preset = window.location.hash;
    if (preset) {
      var presetHeader = $(preset);
      if (presetHeader.is('h1')) {
        h1OnClick(presetHeader);
      } else {
        var presetH1 = presetHeader.parents().children('h1');
        h1OnClick(presetH1);
        window.setTimeout(function() {
          h2OnClick(presetHeader);
        }, 1400); // based on experimenting
      }
    } else {
      headerOnClick($('header'));
    }
  };
  navigateToHash();
  $(window).on('hashchange', navigateToHash);
  /* ** Web Share API only active on https sites **
  if (navigator.share) {
    $('#share').on('click', function() {
      var anchor = window.location.hash;
      if (anchor) {
        var title = $('div' + anchor).children('h2').text();
        var text = $('div' + anchor).children('div.content').find('p').first().text();
      } else {
        var title = "Katholieke Gebeden";
        var text = "Traditionele gebeden en gregoriaanse liederen, ook speciaal voor of na de mis.";
      }
      navigator.share({
          title: title,
          text: text,
          url: document.location.href
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    });
  } else {
    $('#share').hide();
  }
  */
//    $('.content').hide();
});
