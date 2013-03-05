/* A plugin for detecting which form fields have been modified
*/

(function($)
{
    /* Returns the form fields which have been modified 
    */
    $.fn.modified = function() 
    {
        return this.find(':input').addBack().filter(":input").filter(function()
        {           
            var element = $(this);

            if (!element.prop('name')) {
                return false;
            }

            switch(element.prop('type')) {
            case 'select-one':
            case 'select-multiple':
                return checkOptions(this)                
                break;
            case 'checkbox':
            case 'radio':
                return this.defaultChecked != this.checked;
                break;
            case 'textarea':
                // CKEditor Support
                if (this.id && typeof(CKEDITOR) != "undefined" && typeof(CKEDITOR.instances[this.id]) != "undefined") {
                    return CKEDITOR.instances[this.id].checkDirty();
                }
            default:
                if (
                    typeof(this.defaultValue) != 'undefined'
                    && this.defaultValue.replace(/\r|\n/g, '') != element.val().replace(/\r|\n/g, '')
                ) {
                    return true;
                }
                break;
            }
        });
    }

    /* Return true if form has modified fields
    */
    $.fn.hasModified = function() 
    {
        var modified = $(this).modified();

        return modified.length > 0 ? true : false;
    }

    var checkOptions = function(element)
    {
        if (element.options.length == 0) {
            return;
        }

        var no_default = true;
        for (var i = 0; i < element.options.length; i++) {
            var option = element.options[i];
            if (option.defaultSelected) {
                no_default = false;
                break;
            }
        }

        /* defaultSelected is not defined if field is in starting position 
        */
        if (no_default && element.options[0].selected) {
            return false;
        }

        for (var i = 0; i < element.options.length; i++) {
            var option = element.options[i];
            if (option.selected != option.defaultSelected) {
                return true;
            }
        }
    }

})(jQuery);

