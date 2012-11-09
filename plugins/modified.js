/* A plugin for detecting which form fields have been modified
*/

(function()
{
    /* Returns the form fields which have been modified 
    */
    jqueryForm.fn.modified = function() 
    {

        return $(':input', this.forms).filter(function()
        {           
            var element = this;

            if (!element.name) {
                return false;
            }

            if (element.options && _check_options(element)) {
                return true;
            } else if (
                typeof(element.defaultChecked) != 'undefined' 
                && element.defaultChecked != element.checked
            ) {
                return true;
            } else if (
                typeof(element.defaultValue) != 'undefined'
                && element.defaultValue.replace(/\r|\n/g, '') != element.value.replace(/\r|\n/g, '')
            ) {
                return true;
            }
        });
    }

    /* Return true if form has modified fields
    */
    jqueryForm.fn.hasModified = function() 
    {
        var modified = this.modified();

        return modified.length > 0 ? true : false;
    }

    var _check_options = function(element)
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

})();

