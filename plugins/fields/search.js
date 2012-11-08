/*------------------------------------*\
    Search as You Type
\*------------------------------------*/
/*
*   A click event can be attached to this object using jQuery to handle what happens when clicked
*/
function SAYT(cont, page, postData)
{
    cont = $(cont);
    var input = $('input[type="text"]', cont);
    var sayt = $('.sayt', cont);

    var self = this;
    this.results = [];
    this.limit = 5;
    this.select = false; // Operate as a select, or a search
    this.selected = null;
    this.last = '';


    input.on('focus', function(evt)
    {
        if (self.select == true) {
            search_as_you_type(true);
            input.removeClass('selected');
        }
    })
    .on('keydown', function(evt)
    {
        if (
            self.select 
            && evt.keyCode == 9 // Tab was pressed
            && input.hasClass('selected') == false 
            && self.results.length == 1
        ) {
            var result = self.results[0];
            sw_sayt_select(field, result);
        }
    })
    .on('keydown', function(evt)
    {
        var code = evt.keyCode;

        var enter = code == 13;
        var down = code == 40;
        var up = code == 38;

        if (!enter && !down && !up) {
            return;
        }

        var selected = $('.selected', sayt);
        if (enter) {
            if (selected.length) {
                selected.trigger('click');        
                selected.trigger('mouseup');        
            } else {
                return;
            }
        }

        evt.preventDefault();
        evt.stopPropagation();

        if ($('li', sayt).length == 0) {
            return;
        }

        if (selected.length == 0) {
            self.selected = up ? $('li', sayt).last() : $('li', sayt).first();
        } else if (down) {
            self.selected = selected.next().length ? selected.next() : selected.first(); 
        } else if (up) {
            self.selected = selected.prev().length ? selected.prev() : selected.last(); 
        }

        selected.removeClass('selected');
        $(self.selected).addClass('selected');

        var height = parseInt(sayt.css('max-height') || parseInt(sayt.css('height')));

        if (self.selected.prop('offsetTop') < sayt.prop('scrollTop')) {
            sayt.prop('scrollTop', self.selected.prop('offsetTop'));
        } else if((self.selected.prop('offsetTop') + self.selected.prop('offsetHeight')) > sayt.prop('scrollTop') + height) {
            sayt.prop('scrollTop',  self.selected.prop('offsetTop') + self.selected.prop('offsetHeight') - height);
        }
    })
    .on('keyup', function(evt)
    {
        var code = evt.keyCode;
        
        if (
            code == 27 
            || code == 16 
            || code == 17 
            || code == 18 
            || code == 20
            || code == 38 // up
            || code == 40 // down
            || code == 13 // enter
        ) {
            return;
        }

        if (this.value.length || self.select == true) {
            search_as_you_type();
        } else {
            sayt_clear();
        }
    })
    .on('blur', function()
    {
        if (self.select && this.value.length && this.value == this.defaultValue) {
            input.addClass('selected');
        }
        sayt_clear();
    });

    var xhr = new XHR();
    var search_as_you_type = function(all_records)
    {
        if (self.last == input.val()) {
            return;
        }
        
        self.last = input.val();

        xhr.abort();
        var post = new FormData();
        
        if (postData) {
            for (var key in postData) {
                post.append(key, postData[key]);
            }
        }

        post.append('keywords', all_records == true ? '' : input.val());

        xhr.onload = function()
        {
            if (!xhr.JSON) {
                return;
            }
            
            var results = self.results = xhr.JSON;
            
            self.seletec = null;
            sayt.children().remove();
          //  sayt.fadeIn();
            
            if (results.length == 0) {
                sayt.append("<strong class=\"no-results\">No Results</strong>");
                sayt.stop();
                sayt.fadeOut();
    /*
            } else if (
                field_name 
                && results.length == 1
                && results[0].title.toLowerCase() == input.prop('value').toLowerCase()
            ) {
                sw_sayt_select(field, results[0]);
                sayt_clear();
                sayt.show();
    */
            } else {
                sayt.fadeIn();
                input.removeClass('selected');
                
                sayt.append("<div class=\"sayt-results\"><ul></ul></div>");
                var ul = $("ul", sayt);
                
                for (var i = 0, result; result = results[i]; i++) {
                    ul.append("<li>" + result.title +  "</li>");
                    ul.children().last().data('result', result)
                    .on('click', function (evt)
                    {
                        $(self).trigger('click', this);
                    })
                    .on('mouseup', function()
                    {
                        input.addClass('selected');
                        self.results = [];
                        prevent_clear = false;
                        sayt_clear();
                    });
                }
            }
        }

        xhr.open('POST', page, true);
        xhr.send(post);
        
    }

    var prevent_clear = false;
    var sayt_clear = function()
    {
        if (prevent_clear == true) {
            return;
        }

        sayt.stop();
        sayt.fadeOut();
    }

    sayt.on('mousedown', function()
    {
        prevent_clear = true;
    })
    .on('mouseleave', function(evt)
    {
        if (prevent_clear == true) {
            prevent_clear = false;
            sayt_clear();
        }
    });
}

function sw_sayt_select(field, result)
{
    var hidden = document.getElementById(field.id + '-hidden');
    hidden.value = result.id;
    field.value = result.title;
    addClass(field, 'selected');
    dispatchEvent(field, 'change');

    if (hidden.dependent) {
        hidden.dependent.value = '';
        hidden.dependent.disabled = false;
    }

}

