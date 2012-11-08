/* Gives an alert if the form is saved without exiting
*  requires enhancements/modified.js
*/

Form.fn.setConfirm = function(message)
{
    var self = this;
    var submit = false;

    this.forms.on('submit', function()
    {
            submit = true;
    });

    $(window).on('beforeunload', function()
    {
        if (submit == true) {
            return;
        }

        if (self.hasModified()) {
            return message || "Leave without saving?";
        }
    });    
}

