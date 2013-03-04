/* Gives an alert if the form is saved without exiting
*  requires enhancements/modified.js
*/

jqueryForm.fn.setConfirm = function(message)
{
    var self = this;

    this.form.on('submit', function()
    {
        self.form.data('submitting-form', true);
    });

    $(window).on('beforeunload', function()
    {
        if (self.form.data('submitting-form') == true) {
            return;        
        }

        if (self.hasModified()) {
            return message || "Leave without saving?";
        }
    });    
}

