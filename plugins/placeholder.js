/* Add Placeholder support to older browsers
*/
jqueryForm.addEnhancement(function()
{
    this.forms.find(":input[placeholder]").each(function()
    {
        
        if (typeof(this.placeholder) != 'undefined') {
            return false;
        }

        var field = this;

        var parent = this.parentNode;
        var node = $(this).clone();
        if (node.attr('type') == 'password') {
            node.attr('type', 'text');
        }
        node.removeClass('selected');
        node.removeAttr('name');
        node.removeAttr('id');

        node.removeAttr('placeholder');
        node.addClass('placeholder');
        node.prop('value', $(this).attr('placeholder'));

        var focus = function()
        {        
            node.css('display', 'none');
            $(field).css('display', '');
            $(field).focus();
        }

        node.on('focus', focus);
                                
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

        $(field).on('blur', blur);
        $(field).on('change', blur);
        blur();
        $(field).before(node);
    });
});
