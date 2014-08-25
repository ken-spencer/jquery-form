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

