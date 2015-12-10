(function($)
{
    $.fn.formEnhance = function()
    {
        return this.each(function()
        {
            var form = new jqueryForm(this);
            form.enhance();                
        });
    };

    $.fn.submitButtons = function()
    {
        this.filter('FORM');

        var buttons = $('button, input[type="image"], input[type="submit"]');
        var forms = this;

        buttons = buttons.filter(function()
        {
            if (this.type && this.type != "submit") {
                return false;
            }

            var button = $(this);
            if (button.attr('form')) {
                var form = $("#" + $(button).attr('form'));
            } else {
                var form = button.closest('form');
            }
            
            // Remove from set if not in lis tof forms
            if ($(form, forms).length == 0) {
                return false;
            }

            return true;
        });

        
        return buttons;
    }

    
/*
$(document).on("click", 'button, input[type="image"], input[type="submit"]', function(evt)
{
});
*/
})(jQuery);

var jqueryForm = function(selector)
{
    this.form = $(selector).first();

    if (this.form.data('jqueryForm')) {
        return this.form.data('jqueryForm');
    }

    this.form.data('jqueryForm', this);

    this.enhance  = function()
    {
        for (var i = 0, enhancement; enhancement = jqueryForm.enhancements[i]; i++) {
            enhancement.call(this);       
        }

        this.form.data('enhanced', true);

        this.form.on("change", ".is-other-field", function()
        {
            var id = '#' + $(this).data("other-id");
            var input = $(id);
            var cont = input.closest(".other-field");

            if (this.checked) {
                cont.slideDown(function()
                {
                    input.prop('disabled', false);
                    input.focus();
                });
            } else {
                input.prop('disabled', true);
                cont.slideUp();
            }
        });

        this.form.find(".is-other-field").each(function()
        {
            var id = '#' + $(this).data("other-id");
            var input = $(id);
            var cont = input.closest(".other-field");

            if (this.checked) {
                cont.show();
                input.prop('disabled', false);
            } 
        });

/*
        this.permalinks();
        this.calendar();
        
        if (window.sb_markdown) {
            this.form.find('textarea.markdown').each(sb_markdown);
        }
        
        this.form.each(function()
        {
            var e = new sbErrors(this);
            e.actions();
        });

        this.form.find(":input[placeholder]").each(placeholders);
    */
    }
}

jqueryForm.enhancements = [];

jqueryForm.fn = jqueryForm.prototype;

jqueryForm.addEnhancement = function(enhancement)
{
    jqueryForm.enhancements.push(enhancement);
}

