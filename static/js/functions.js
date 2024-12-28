//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera.
//<img src="'+ URL_BASE +'/public/img/top.png" class="goTop" />
var templatepath = $("#templatedirectory").html();
var scrolltotop = {
    //startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
    //scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
    setting: {startline: 100, scrollto: 0, scrollduration: 1000, fadeduration: [700, 500]},
    controlHTML: '<i class="ion-chevron-up up-bottom"></i>', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
    controlattrs: {offsetx: 15, offsety: 12}, //offset of control relative to right/ bottom of window corner
    anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

    state: {isvisible: false, shouldvisible: false},

    scrollup: function () {
        if (!this.cssfixedsupport) //if control is positioned using JavaScript
            this.$control.fadeOut() //hide control immediately after clicking it
        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto)
        if (typeof dest == "string" && jQuery('#' + dest).length == 1) //check element set by string exists
            dest = jQuery('#' + dest).offset().top
        else
            dest = 0
        this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
    },

    keepfixed: function () {
        var $window = jQuery(window)
        var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
        var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety
        this.$control.css({left: controlx + 'px', top: controly + 'px'})
    },

    togglecontrol: function () {
        var scrolltop = jQuery(window).scrollTop()
        if (!this.cssfixedsupport)
            this.keepfixed()
        this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true : false
        if (this.state.shouldvisible && !this.state.isvisible) {
            this.$control.stop().animate(this.setting.fadeduration[0]).fadeIn()
            this.state.isvisible = true
        } else if (this.state.shouldvisible == false && this.state.isvisible) {
            this.$control.stop().animate(this.setting.fadeduration[1]).fadeOut()
            this.state.isvisible = false
        }
    },

    init: function () {
        jQuery(document).ready(function ($) {
            var mainobj = scrolltotop
            var iebrws = document.all
            mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
            mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body')
            mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>')
                .css({position: mainobj.cssfixedsupport ? 'fixed' : 'absolute', bottom: 20, right: 10, 'display': 'none', 'z-index': 50, cursor: 'pointer'})
                .click(function () {
                    mainobj.scrollup();
                    return false
                })
                .appendTo('body')
            if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != '') //loose check for IE6 and below, plus whether control contains any text
                mainobj.$control.css({width: mainobj.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
            mainobj.togglecontrol()
            $('a[href="' + mainobj.anchorkeyword + '"]').click(function () {
                mainobj.scrollup()
                return false
            })
            $(window).bind('scroll resize', function (e) {
                mainobj.togglecontrol()
            })
        })
    }
}

scrolltotop.init();

//************* READMORE
(function (c) {
    function g(b, a) {
        this.element = b;
        this.options = c.extend({}, h, a);
        c(this.element).data("max-height", this.options.maxHeight);
        c(this.element).data("height-margin", this.options.heightMargin);
        delete this.options.maxHeight;
        if (this.options.embedCSS && !k) {
            var d = ".readmore-js-toggle, .readmore-js-section { " + this.options.sectionCSS + " } .readmore-js-section { overflow: hidden; }", e = document.createElement("style");
            e.type = "text/css";
            e.styleSheet ? e.styleSheet.cssText = d : e.appendChild(document.createTextNode(d));
            document.getElementsByTagName("head")[0].appendChild(e);
            k = !0
        }
        this._defaults = h;
        this._name = f;
        this.init()
    }

    var f = "readmore", h = {
        speed: 100,
        maxHeight: 200,
        heightMargin: 16,
        moreLink: '<a href="#">Read More</a>',
        lessLink: '<a href="#">Close</a>',
        embedCSS: !0,
        sectionCSS: "display: block; width: 100%;",
        startOpen: !1,
        expandedClass: "readmore-js-expanded",
        collapsedClass: "readmore-js-collapsed",
        beforeToggle: function () {
        },
        afterToggle: function () {
        }
    }, k = !1;
    g.prototype = {
        init: function () {
            var b = this;
            c(this.element).each(function () {
                var a =
                    c(this), d = a.css("max-height").replace(/[^-\d\.]/g, "") > a.data("max-height") ? a.css("max-height").replace(/[^-\d\.]/g, "") : a.data("max-height"), e = a.data("height-margin");
                "none" != a.css("max-height") && a.css("max-height", "none");
                b.setBoxHeight(a);
                if (a.outerHeight(!0) <= d + e) return !0;
                a.addClass("readmore-js-section " + b.options.collapsedClass).data("collapsedHeight", d);
                a.after(c(b.options.startOpen ? b.options.lessLink : b.options.moreLink).on("click", function (c) {
                    b.toggleSlider(this, a, c)
                }).addClass("readmore-js-toggle"));
                b.options.startOpen || a.css({height: d})
            });
            c(window).on("resize", function (a) {
                b.resizeBoxes()
            })
        }, toggleSlider: function (b, a, d) {
            d.preventDefault();
            var e = this;
            d = newLink = sectionClass = "";
            var f = !1;
            d = c(a).data("collapsedHeight");
            c(a).height() <= d ? (d = c(a).data("expandedHeight") + "px", newLink = "lessLink", f = !0, sectionClass = e.options.expandedClass) : (newLink = "moreLink", sectionClass = e.options.collapsedClass);
            e.options.beforeToggle(b, a, f);
            c(a).animate({height: d}, {
                duration: e.options.speed, complete: function () {
                    e.options.afterToggle(b,
                        a, f);
                    c(b).replaceWith(c(e.options[newLink]).on("click", function (b) {
                        e.toggleSlider(this, a, b)
                    }).addClass("readmore-js-toggle"));
                    c(this).removeClass(e.options.collapsedClass + " " + e.options.expandedClass).addClass(sectionClass)
                }
            })
        }, setBoxHeight: function (b) {
            var a = b.clone().css({height: "auto", width: b.width(), overflow: "hidden"}).insertAfter(b), c = a.outerHeight(!0);
            a.remove();
            b.data("expandedHeight", c)
        }, resizeBoxes: function () {
            var b = this;
            c(".readmore-js-section").each(function () {
                var a = c(this);
                b.setBoxHeight(a);
                (a.height() > a.data("expandedHeight") || a.hasClass(b.options.expandedClass) && a.height() < a.data("expandedHeight")) && a.css("height", a.data("expandedHeight"))
            })
        }, destroy: function () {
            var b = this;
            c(this.element).each(function () {
                var a = c(this);
                a.removeClass("readmore-js-section " + b.options.collapsedClass + " " + b.options.expandedClass).css({"max-height": "", height: "auto"}).next(".readmore-js-toggle").remove();
                a.removeData()
            })
        }
    };
    c.fn[f] = function (b) {
        var a = arguments;
        if (void 0 === b || "object" === typeof b) return this.each(function () {
            if (c.data(this,
                "plugin_" + f)) {
                var a = c.data(this, "plugin_" + f);
                a.destroy.apply(a)
            }
            c.data(this, "plugin_" + f, new g(this, b))
        });
        if ("string" === typeof b && "_" !== b[0] && "init" !== b) return this.each(function () {
            var d = c.data(this, "plugin_" + f);
            d instanceof g && "function" === typeof d[b] && d[b].apply(d, Array.prototype.slice.call(a, 1))
        })
    }
})(jQuery);


//<--------- waiting -------//>
(function ($) {
    $.fn.waiting = function (p_delay) {
        var $_this = this.first();
        var _return = $.Deferred();
        var _handle = null;

        if ($_this.data('waiting') != undefined) {
            $_this.data('waiting').rejectWith($_this);
            $_this.removeData('waiting');
        }
        $_this.data('waiting', _return);

        _handle = setTimeout(function () {
            _return.resolveWith($_this);
        }, p_delay);

        _return.fail(function () {
            clearTimeout(_handle);
        });

        return _return.promise();
    };
})(jQuery);

jQuery.fn.reset = function () {
    $(this).each(function () {
        this.reset();
    });
}

function scrollElement(element) {
    var offset = $(element).offset().top;
    $('html, body').animate({scrollTop: offset}, 500);
};


function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//var safe = $('<span></span>').text(unsafe).html();
$(window).bind("load", function () {

    $("#attach_file").val('');
    $('#fileShot').val('');

    $("#uploadFile").val('');
    $("#uploadImage").val('');

    if ($('.imgColor').length) {
        colorChange();
        $(".colorPalette").first().css({"border-bottom-left-radius": "3px", "border-top-left-radius": "3px"});
        $(".colorPalette").last().css({"border-bottom-right-radius": "3px", "border-top-right-radius": "3px"});
    }
});

//<-------- * TRIM * ----------->
function trim(string) {
    return string.replace(/^\s+/g, '').replace(/\s+$/g, '')
}

//<--------- * Search * ----------------->
$('#buttonSearch, #btnSearch').click(function (e) {
    var search = $('#btnItems').val();
    if (trim(search).length < 2 || trim(search).length == 0 || trim(search).length > 100) {
        return false;
    } else {
        return true;
    }
});//<---

$('#btnSearch_2').click(function (e) {
    var search = $('#btnItems_2').val();
    if (trim(search).length < 2 || trim(search).length == 0 || trim(search).length > 100) {
        return false;
    } else {
        return true;
    }
});//<---

$(document).ready(function () {

    // jQuery(".timeAgo").timeago();

//================= * Remove focus on click * ===================//
    $('.btn, li.dropdown a').click(function () {
        $(this).blur();
    });
//================= * Dropdown Click * ===================//
    $('.dropdown-menu').not('.nav-session').on({
        "click": function (e) {
            e.stopPropagation();
        }
    });

//================= * Input Click * ===================//
    $(document).on('click', '#avatar_file', function () {
        var _this = $(this);
        $("#uploadAvatar").trigger('click');
        _this.blur();
    });

    $('#cover_file').click(function () {
        var _this = $(this);
        $("#uploadCover").trigger('click');
        _this.blur();
    });

//======== INPUT CLICK ATTACH MESSAGES =====//
    $(document).on('click', '#upload_image', function () {
        var _this = $(this);
        $("#uploadImage").trigger('click');
        _this.blur();
    });

    $(document).on('click', '#upload_file', function () {
        var _this = $(this);
        $("#uploadFile").trigger('click');
        _this.blur();
    });

    $(document).on('click', '#shotPreview', function () {
        var _this = $(this);
        $("#fileShot").not('.edit_post').trigger('click');
        _this.blur();
    });

    $(document).on('click', '#attachFile', function () {
        var _this = $(this);
        $("#attach_file").trigger('click');
        _this.blur();
    });

    $(document).on('mouseenter', '.deletePhoto, .deleteCover, .deleteBg', function () {

        var _this = $(this);
        $(_this).html('<div class="photo-delete"></div>');
    });

    $(document).on('mouseleave', '.deletePhoto, .deleteCover, .deleteBg', function () {

        var _this = $(this);
        $(_this).html('');
    });


    /*---------
     *
     * Credit : http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
     * --------
     **/

//<---------- * Avatar * ------------>>
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#upload-avatar').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }//<------ End Function ---->

    //<---- * Avatar * ----->
    $("#file-avatar").change(function () {
        readURL(this);
    });

    //<---------- * Cover * ------------>>
    function readURL2(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#upload-cover').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }//<------ End Function ---->

    //<---- * Avatar * ----->
    $("#file-cover").change(function () {
        readURL2(this);
    });

    //<**** - Tooltip
    $('.showTooltip').tooltip();

    $('.delete-attach-image').click(function () {
        $('.imageContainer').fadeOut(100);
        $('#previewImage').css({backgroundImage: 'none'});
        $('.file-name').html('');
        $('#uploadImage').val('');

    });

    $('.delete-attach-file').click(function () {
        $('.fileContainer').fadeOut(100);
        $('#previewFile').css({backgroundImage: 'none'});
        $('.file-name-file').html('');
        $('#uploadFile').val('');
    });

    $('.delete-attach-file-2').click(function () {
        $('.fileContainer').fadeOut(100);
        $('.file-name-file').html('');
        $('#attach_file').val('');
    });

    $("#saveUpdate").on('click', function () {
        $(this).css({'display': 'none'})
    });

    $("#paypalPay").on('click', function () {
        $(this).css({'display': 'none'})
    });


    // Miscellaneous Functions

    /*= Like =*/
    $(".likeButton").on('click', function (e) {
        var element = $(this);
        var id = element.attr("data-id");
        var like = element.attr('data-like');
        var like_active = element.attr('data-unlike');
        var data = 'id=' + id;

        e.preventDefault();

        element.blur();

        element.find('i').addClass('icon-spinner2 fa-spin');

        if (element.hasClass('active')) {
            element.removeClass('active');
            element.find('i').removeClass('fa fa-heart').addClass('fa fa-heart-o');
            element.find('.textLike').html(like);

        } else {
            element.addClass('active');
            element.find('i').removeClass('fa fa-heart-o').addClass('fa fa-heart');
            element.find('.textLike').html(like_active);

        }

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: "POST",
            url: URL_BASE + "/ajax/like",
            data: data,
            success: function (result) {

                if (result == '') {
                    window.location.reload();
                    element.removeClass('likeButton');
                    element.removeClass('active');
                } else {
                    //element.parents('.actions').find('.like_count').html( result );
                    element.find('i').removeClass('icon-spinner2 fa-spin');
                    $('#countLikes').html(result);
                }
            }//<-- RESULT
        });//<--- AJAX


    });//<----- CLICK

    function toggleNavbarMethod() {
        if ($(window).width() > 768) {
            $('.dropdown').hover(function () {
                $(this).addClass('open');
            }, function () {
                $(this).removeClass('open');
            });
        } else {
            $('.navbar .dropdown').off('mouseover').off('mouseout');
        }
    }

    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);


    // ====== FOLLOW HOVER ============
    $(document).on('mouseenter', '.activeFollow', function () {

        var following = $(this).attr('data-following');

        // Unfollow
        $(this).html('<i class="glyphicon glyphicon-remove myicon-right"></i> ' + following);
    })

    $(document).on('mouseleave', '.activeFollow', function () {
        var following = $(this).attr('data-following');
        $(this).html('<i class="glyphicon glyphicon-ok myicon-right"></i> ' + following);
    });

    /*========= FOLLOW =============*/
    $(document).on('click', ".followBtn", function () {
        var element = $(this);
        var id = element.attr("data-id");
        var _follow = element.attr("data-follow");
        var _following = element.attr("data-following");
        var info = 'id=' + id;

        element.removeClass('followBtn');

        if (element.hasClass('follow_active activeFollow')) {
            element.addClass('followBtn');
            element.removeClass('follow_active activeFollow');
            element.html('<i class="glyphicon glyphicon-plus myicon-right"></i> ' + _follow);
            element.blur();

        } else {

            element.addClass('followBtn');
            element.removeClass('follow_active activeFollow');
            element.addClass('followBtn');
            element.addClass('follow_active activeFollow');
            element.html('<i class="glyphicon glyphicon-ok myicon-right"></i> ' + _following);
            element.blur();
        }

        $.ajax({
            type: "POST",
            url: URL_BASE + "/ajax/follow",
            dataType: 'json',
            data: info,
            success: function (result) {

                if (result.status == false) {
                    element.addClass('followBtn');
                    element.removeClass('follow_active followBtn activeFollow');
                    element.html('<i class="glyphicon glyphicon-plus myicon-right"></i> ' + _follow);
                    element.html(type);
                    window.location.reload();
                    element.blur();
                }
            }//<-- RESULT
        });//<--- AJAX


    });//<----- CLICK

// ====== FOLLOW HOVER BUTTONS SMALL ============
    $(document).on('mouseenter', '.btnFollowActive', function () {

        var following = $(this).attr('data-following');

        // Unfollow
        $(this).html('<i class="glyphicon glyphicon-remove myicon-right"></i> ' + following);
        $(this).addClass('btn-danger').removeClass('btn-info');
    })

    $(document).on('mouseleave', '.btnFollowActive', function () {
        var following = $(this).attr('data-following');
        $(this).html('<i class="glyphicon glyphicon-ok myicon-right"></i> ' + following);
    });

    /*========= FOLLOW BUTTONS SMALL =============*/
    $(document).on('click', ".btnFollow", function () {
        var element = $(this);
        var id = element.attr("data-id");
        var _follow = element.attr("data-follow");
        var _following = element.attr("data-following");
        var info = 'id=' + id;

        element.removeClass('btnFollow');

        if (element.hasClass('btnFollowActive')) {
            element.addClass('btnFollow');
            element.removeClass('btnFollowActive');
            element.html('<i class="glyphicon glyphicon-plus myicon-right"></i> ' + _follow);
            element.blur();

        } else {

            element.addClass('btnFollow');
            element.removeClass('btnFollowActive');
            element.addClass('btnFollow');
            element.addClass('btnFollowActive');
            element.html('<i class="glyphicon glyphicon-ok myicon-right"></i> ' + _following);
            element.blur();
        }


        $.ajax({
            type: "POST",
            url: URL_BASE + "/ajax/follow",
            dataType: 'json',
            data: info,
            success: function (result) {

                if (result.status == false) {
                    element.addClass('btnFollow');
                    element.removeClass('btnFollowActive followBtn');
                    element.html('<i class="glyphicon glyphicon-plus myicon-right"></i> ' + _follow);
                    element.html(type);
                    bootbox.alert(result.error);
                    window.location.reload();
                    element.blur();
                }
            }//<-- RESULT
        });//<--- AJAX
    });//<----- CLICK


    //<---------- * Remove Reply * ---------->
    $(document).on('click', '.removeMsg', function () {

        var element = $(this);
        var data = element.attr('data');
        var deleteMsg = element.attr('data-delete');
        var query = 'message_id=' + data;

        bootbox.confirm(deleteMsg, function (r) {

            if (r == true) {

                element.parents('li').fadeTo(200, 0.00, function () {
                    element.parents('li').slideUp(200, function () {
                        element.parents('li').remove();
                    });
                });

                $.ajax({
                    type: 'POST',
                    url: URL_BASE + '/message/delete',
                    dataType: 'json',
                    data: query,

                }).done(function (data) {

                    if (data.total == 0) {
                        var location = URL_BASE + "/messages";
                        window.location.href = location;
                    }

                    if (data.status != true) {
                        bootbox.alert(data.error);
                        return false;
                    }

                    if (data.session_null) {
                        window.location.reload();
                    }
                });//<--- Done
            }//END IF R TRUE
        }); //Jconfirm
    });//<---- * End click * ---->


    //<------------- * AUTOCOMPLETE * ---------->
    $(window).bind("load", function () {

        $('#btnAdd').keyup(function (e) {

            e.preventDefault();
            e.stopPropagation();


            var valueClean = $(this).val().replace(/\#+/gi, '%23');
            var _valueClean = $(this).val().replace(/<(?=\/?script)/ig, "&lt;");


            //$('.searchGlobal').html( '<a href="search/?q='+trim( valueClean )+'">'+trim( escapeHtml(_valueClean) )+'</a>' );

            //$(this).waiting( 500 ).done(function() {
            if (e.which != 16
                && e.which != 17
                && e.which != 18
                && e.which != 20
                && e.which != 32
                && e.which != 37
                && e.which != 38
                && e.which != 39
                && e.which != 40
            ) {

                $('.searchGlobal').html('<i class="fa fa-spinner fa-spin"></i>');
                $('.toogle_search > li.list').remove();

            }

            var $element = $(this);
            var inputOutput = $element.val();
            var value = inputOutput.replace(/\s+/gi, ' ');


            // || e == ''
            if (trim(value).length == 0 || trim(value).length >= 50) {
                $('.boxSearch').slideUp(1);
            } else if (e.which == 16
                || e.which == 17
                || e.which == 18
                || e.which == 20
                || e.which == 32
                || e.which == 37
                || e.which == 38
                || e.which == 39
                || e.which == 40
            ) {
                return false;
            } else {

                $(this).waiting(500).done(function () {

                    $.get(URL_BASE + "/ajax/addmembers", {search: trim(value)}, function (sql) {

                        if (sql != '') {
                            $('.searchGlobal').html('');
                            $('.toogle_search > li.list').remove();
                            $(sql).hide().appendTo('.toogle_search').slideDown(1);


                        }
                        //<-- * TOTAL LI * -->
                        var total = $('.toogle_search > li').length;

                        $('.boxSearch').slideDown(1);

                    });
                });//<----- * WAITING * ---->
            }
            //});//<----- * WAITING * ---->

            $(document).bind('click', function (ev) {
                var $clicked = $(ev.target);
                if (!$clicked.hasClass("searchMember")) {
                    $(".boxSearch").slideUp(5);
                }
            });//<-------- * FIN CLICK * --------->

        });//<--------- * END KEYUP * ------>
    });//<----------- * DOM LOAD  * --------->

    // $('button[type=submit], input[type=submit]').not('.btn_search,.actionDelete').click(function () {
    //     $('.wrap-loader').show();
    // });

    $('button[type=submit], input[type=submit]').not('.btn_search,.actionDelete').submit(function () {
        $('.wrap-loader').show();
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        e.target // newly activated tab
        e.relatedTarget // previous active tab
    });

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

//<---------------- Create Campaign ----------->>>>
    $(document).on('click', '#buttonFormSubmit', function (s) {

        s.preventDefault();
        var element = $(this);
        element.attr({'disabled': 'true'});

        (function () {
            $("#formUpload").ajaxForm({
                dataType: 'json',
                success: function (result) {

                    //===== SUCCESS =====//
                    if (result.success === true) {
                        window.location.href = result.target;
                    }//<-- e
                    else {
                        var error = '';
                        for ($key in result.errors) {
                            console.log($key);
                            error += '<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + capitalize($key) + ": " + result.errors[$key] + '</li>';
                        }
                        $('#showErrors').html(error);
                        $('#dangerAlert').fadeIn(500);
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                    }
                }//<----- SUCCESS
            }).submit();
        })(); //<--- FUNCTION %
    });//<<<-------- * END FUNCTION CLICK * ---->>>>
    //<---------------- End Create Campaign ----------->>>>


    //<<<<<---------------- Contact Organizer ----------->>>>
    $(document).on('click', '#buttonFormSubmit', function (s) {

        s.preventDefault();
        var element = $(this);
        element.attr({'disabled': 'true'});

        (function () {
            $("#formContactOrganizer").ajaxForm({
                dataType: 'json',
                success: function (result) {

                    if (result.error_fatal) {
                        $('#showErrors').html('<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + error + '</li>');
                        $('#dangerAlert').fadeIn(500)
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                        return false;
                    }

                    //===== SUCCESS =====//
                    if (result.success != false) {
                        $('#formContactOrganizer').remove();
                        $('#showSuccess').html('<i class="fa fa-check myicon-right"></i>  ' + result.msg);
                        $('#successAlert').fadeIn(500)
                        $('.wrap-loader').hide();

                        setTimeout(function () {
                            $('#sendEmail').modal('hide');
                        }, 3000);

                    }//<-- e
                    else {
                        var error = '';
                        for ($key in result.errors) {
                            error += '<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + result.errors[$key] + '</li>';
                        }
                        $('#showErrors').html(error);
                        $('#dangerAlert').fadeIn(500)
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                    }
                }//<----- SUCCESS
            }).submit();
        })(); //<--- FUNCTION %
    });//<<<-------- * END FUNCTION CLICK * ---->>>>


    //<---------------- Donate ----------->>>>
    $(document).on('click', '#buttonDonation', function (s) {

        s.preventDefault();
        var element = $(this);
        element.attr({'disabled': 'true'});

        (function () {
            $("#formDonation").ajaxForm({
                dataType: 'json',
                success: function (result) {

                    if (result.success === true) {
                        window.location.href = result.url;
                    }
                    else if (result.success != false && result.stripeTrue == true) {

                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                        $('#errorDonation').fadeOut();
                    } else if (result.success != false && result.stripeSuccess == true) {
                        window.location.href = result.url;
                    } else if (result.success != false && result.bankTransfer == true) {
                        window.location.href = result.url;
                    } else {
                        let error = '';
                        for ($key in result.errors) {
                            error += '<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + $key + ': ' + result.errors[$key] + '</li>';
                        }
                        $('#showErrorsDonation').html(error);
                        $('#errorDonation').fadeIn(500);
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                    }
                }//<----- SUCCESS
            }).submit();
        })(); //<--- FUNCTION %
    });//<<<-------- * END FUNCTION CLICK * ---->>>>
    //<---------------- End Donate ----------->>>>

    //<---------------- Edit Campaign ----------->>>>
    $(document).on('click', '#buttonFormUpdate', function (s) {

        s.preventDefault();
        var element = $(this);
        element.attr({'disabled': 'true'});

        (function () {
            $("#formUpdate").ajaxForm({
                dataType: 'json',
                success: function (result) {

                    if (result.fatalError == true) {
                        window.location.href = result.target;
                        return false;
                    }

                    //===== SUCCESS =====//
                    if (result.success != false) {

                        if (result.finish_campaign == true) {
                            window.location.href = result.target;
                        } else {
                            $('.wrap-loader').hide();
                            $('#dangerAlert').fadeOut();
                            element.removeAttr('disabled');
                            $('#successAlert').fadeIn(500);
                        }

                    }//<-- e
                    else {
                        var error = '';
                        for ($key in result.errors) {
                            error += '<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + result.errors[$key] + '</li>';
                        }
                        $('#showErrors').html(error);
                        $('#successAlert').fadeOut();
                        $('#dangerAlert').fadeIn(500)
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                    }
                }//<----- SUCCESS
            }).submit();
        })(); //<--- FUNCTION %
    });//<<<-------- * END FUNCTION CLICK * ---->>>>
    //<---------------- End Edit Campaign ----------->>>>

    //<<<-------- * FUNCTION CLICK * ---->>>>
    $(document).on('click', '#buttonUpdateForm', function (s) {

        s.preventDefault();
        var element = $(this);
        element.attr({'disabled': 'true'});

        (function () {
            $("#formUpdateCampaign").ajaxForm({
                dataType: 'json',
                success: function (result) {

                    //===== SUCCESS =====//
                    if (result.success != false) {

                        if (result.rewards == true) {
                            $('#successAlert').fadeIn();
                            $('#dangerAlert').fadeOut();
                            $("#formUpdateCampaign").reset();
                            element.removeAttr('disabled');
                            $('.wrap-loader').hide();
                        } else {
                            window.location.href = result.target;
                        }

                    }//<-- e
                    else {
                        var error = '';
                        for ($key in result.errors) {
                            error += '<li><i class="glyphicon glyphicon-remove myicon-right"></i> ' + result.errors[$key] + '</li>';
                        }
                        $('#showErrors').html(error);
                        $('#successAlert').fadeOut();
                        $('#dangerAlert').fadeIn(500)
                        $('.wrap-loader').hide();
                        element.removeAttr('disabled');
                    }
                }//<----- SUCCESS
            }).submit();
        })(); //<--- FUNCTION %
    });//<<<-------- * END FUNCTION CLICK * ---->>>>

}); //*************** End DOM ***************************//

$(function () {
    $('a[href="#search"]').on('click', function (event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
        $('body').css({overflow: 'hidden'})
    });

    $('#search, #search button.close').on('click keyup', function (event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
            $('body').css({overflow: 'auto'});
            $('#search > form > input[type="search"]').blur();
        }
    });

});

function textTruncate(element, text) {
    var descHeight = $(element).outerHeight();

    if (descHeight > 500) {
        $(element).addClass('truncate').append('<span class="btn-block text-center color-default font-default readmoreBtn"><strong>' + text + '</strong></span>');
    }

    $(document).on('click', '.readmoreBtn', function () {
        $(element).removeClass('truncate');
        $(this).remove();
    });
}//<<--- End
