var GALLERY = function (spec) {
    "use strict";
    var that = {};
    that.slideset = {};
    that.slideset.suppress_car = true;
    that.slideset.first_slide = 1;
    that.slideset.max_num_slides = 4;
    that.slideset.current_index = 1;
    that.slideset.gallery_advance = 1;
    that.slideset.list_orientation = "gal_v";
    that.slideset.content_id = "left_car_img";
    that.slideset.gallery_id = "left_car";
    that.slideset.back_img_src = "";
    that.slideset.fwd_img_src = "";
    that.slideset.zoom_button = "";
    that.slideset.slide_count = 15;
    that.slideset = spec;

    that.markup_slide = function (index) { //Returns an HTML string to be appended into the container
        var list_orientation = that.slideset.list_orientation; //Is the list horizontal or vertical?
        return '<li id="' + that.slideset.prefix + '_slide_' + index + '" class="' + list_orientation + '"><a href="#"><img src="' + that.slideset["slide_" + index].thumb + '" width="75" /></a></li>';
    };

    that.change_content = function (index) { // Changes content when this thumbnail is clicked
        $("#" + that.slideset.content_id).attr('src', that.slideset["slide_" + index].src); //Simple image swap to move the this image to the main image.
    };

    that.check_limits = function () { //See if we're either at the front or back so that we can grey out the controls appropriately
        if (that.slideset.current_index === 0) { //We're at the beginning
            $("#" + that.slideset.prefix + "_back_link").addClass("gal_disable");
            $('#zoom_back').addClass("gal_disable");
        } else {
            $("#" + that.slideset.prefix + "_back_link").removeClass("gal_disable");
            $('#zoom_back').removeClass("gal_disable");
        }
        if (that.slideset.current_index + that.slideset.max_num_slides >= that.slideset.slide_count) { //We're at the end
            $("#" + that.slideset.prefix + "_fwd_link").addClass("gal_disable");
            $('#zoom_forward').addClass("gal_disable");
        } else {
            $("#" + that.slideset.prefix + "_fwd_link").removeClass("gal_disable");
            $('#zoom_forward').removeClass("gal_disable");
        }
    };

    that.advance_slide = function () { //Moves the carousel forward
        var slide_window = 1 + that.slideset.gallery_advance;
        if (!that.slideset.suppress_car) {
            slide_window = that.slideset.current_index + that.slideset.max_num_slides + that.slideset.gallery_advance; //Slide window to determine if we're at the last slide
        }
        if ((that.slideset.current_index + slide_window) < that.slideset.slide_count) { //check forward stop
            that.slideset.current_index = that.slideset.current_index + that.slideset.gallery_advance; //We're not at the end, so go ahead and move the index ahead
        } else {
            that.slideset.current_index = that.slideset.slide_count - that.slideset.max_num_slides; // Advance goes to far, so just display the last slice.
        }
        if (that.slideset.suppress_car) {
            that.change_content(that.slideset.current_index);
            that.check_limits();
        } else {
            that.show_slides(); //Redraw the slides
        }
        return false;
    };

    that.reverse_slide = function () { //Moves the carousel back
        if (that.slideset.current_index !== 0) { //check back stop
            that.slideset.current_index = that.slideset.current_index - that.slideset.gallery_advance; // We're not at the first slide, so go ahead and move the index back
        }
        if (that.slideset.current_index < 0) { //Make sure we didn't go too far back
            that.slideset.current_index = 0;
        }
        if (that.slideset.suppress_car) {
            that.change_content(that.slideset.current_index);
            that.check_limits();
        } else {
            that.show_slides(); //Redraw the slides
        }
        return false;
    };


    that.show_slides = function () {
        var i,
            list = $('#' + that.slideset.gallery_id),
            handler = function (el, index) { //function to add onclick event to carousel images. Removed from loop.
                el.on("click", {value: index}, function (e) {
                    that.change_content(e.data.value);
                    return false;
                });
            },
            temp_img = new Image();
        list.empty(); //Clear out any content
        list.append('<li class="' + that.slideset.list_orientation + '"><a href="#" id="' + that.slideset.prefix + '_back_link"><img src="' + that.slideset.back_img_src + '" /></a></li>'); //Append the back button
        if (that.slideset.suppress_car) {
            list.append('<li class="zoom" id="' + that.slideset.prefix + '_zoom"><img src="' + that.slideset.zoom_button + '" /></li>'); //we're suppressing the carousel, so we just want a zoom button.
        } else {
            for (i = that.slideset.current_index; i < (that.slideset.current_index + that.slideset.max_num_slides); i = i + 1) {  //loop to append the thumbnails currently visible in the carousel
                list.append(that.markup_slide(i)); // Add in the thumbnail
                handler($("#" + that.slideset.prefix + "_slide_" + i), i); //add onclick events
            }
            if (i < that.slideset.slide_count - 1) { //don't pre cache if we're at the end.
                temp_img.src = that.slideset['slide_' + i].thumb; //pre cache next thumbnail to prevent jumping
            }
        }
        list.append('<li class="' + that.slideset.list_orientation + '"><a href="#" id="' + that.slideset.prefix + '_fwd_link"><img src="' + that.slideset.fwd_img_src + '" /></a></li>'); //Append the forward button
        $("#" + that.slideset.prefix + "_back_link").on("click", that.reverse_slide);// attach click events to the back button
        $("#" + that.slideset.prefix + "_fwd_link").on("click", that.advance_slide);// attach click events to the forward button
        that.check_limits(); //Check to see if we're at our limits
    };

    that.init_slides = function () { //Initial draw
        if (that.slideset.suppress_car) {
            that.slideset.max_num_slides = 1;
        }
        that.slideset.current_index = that.slideset.first_slide;
        that.show_slides(); //Show the slides
        that.change_content(that.slideset.first_slide); // Set default content.
    };
    return that;
};
