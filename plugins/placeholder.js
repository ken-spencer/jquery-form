/* Add Placeholder support to older browsers
*/
jqueryForm.addEnhancement(function()
{
    if (this.form.data('enhanced')) {
        return;
    }

    var input = document.createElement('input');

    if (typeof(input.placeholder) != 'undefined') {
        return false;
    }

    this.form.find(":input[placeholder]").each(function()
    {
        if ($(this).attr('placeholder').length == 0) {
            return;
        }

        var field = $(this);

        var parent = this.parentNode;

        var input = document.createElement(field.prop('nodeName'));
        var node = $(input);
        
  //      var node = $(this).clone();
        node.prop('className', field.prop('className')).removeClass('selected').addClass('placeholder');
        node.attr('style', field.attr('style'));
        node.css({
            'border' : 'none',
            'background' : 'none',
            'color' : ''
        });

        if (field.prop('nodeName') == "TEXTAREA") {
            node.prop('rows', field.prop('rows'));
            node.prop('cols', field.prop('cols'));
        } else {
            node.prop('type', 'text');
            node.prop('size', field.prop('size'));
        }

        if (node.attr('type') == 'password') {
            node.prop('type', 'text');
        }
        node.removeClass('selected');

/*
        node.removeAttr('name');
        node.removeAttr('id');
        node.attr('novalidate', true);
        node.removeAttr('placeholder');
*/

        node.prop('value', $(this).attr('placeholder'));
        if (field.val().length) {
            node.hide();
        }

        var pos = field.offset();
        var setPos = function()
        {
            node.css({
                'margin-left' : - field.outerWidth(true),
        /*
                'position' : 'absolute',
                'z-index' : parseInt(field.css('z-index')) + 1,
                'left' : pos.left + parseInt(field.css('padding-left')) + parseInt(field.css('border-left-width')),
                'top' : pos.top + parseInt(field.css('padding-top')) + parseInt(field.css('border-top-width')),
        */
            });
        }

        setInterval(setPos, 150); // adapt to changes in the DOM
        setTimeout(setPos, 10); // give error based classes a chance to go into effect for sizing

        field.after(node);
        node.on('focus', function()
        {
            field.focus();
        });

        field.on('focus input keyup', function()
        {
            if (this.value.length > 0) {
                node.hide();
            } else {
                node.show();
            }
        });
        

return;
        node.on('focus', function()
        {
            node.css('display', 'none');
            $(field).css('display', '');
            $(field).focus();
        });

        $(field).on('focus', function()
        {
            node.css('display', 'none');
            $(field).css('display', '');
        });
                                
        var blur = function()
        {
            if ($(field).prop('value').length == 0) {
                $(field).css('display', 'none');
                node.css('display', '');
            } else {
                node.css('display', 'none');
                $(field).css('display', '');
            }
        }                                                                

        $(field).on('blur change', blur);
//        blur();
        $(field).before(node);
    });
});
