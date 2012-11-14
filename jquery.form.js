var jqueryForm = function(selector)
{
    this.forms = this.form = $(selector).first();

    this.enhance  = function()
    {
        for (var i = 0, enhancement; enhancement = jqueryForm.enhancements[i]; i++) {
            enhancement.call(this);       
        }

/*
        this.permalinks();
        this.calendar();
        
        if (window.sb_markdown) {
            this.forms.find('textarea.markdown').each(sb_markdown);
        }
        
        this.forms.each(function()
        {
            var e = new sbErrors(this);
            e.actions();
        });

        this.forms.find(":input[placeholder]").each(placeholders);
    */
    }
}

jqueryForm.enhancements = [];

jqueryForm.fn = jqueryForm.prototype;

jqueryForm.addEnhancement = function(enhancement)
{
    jqueryForm.enhancements.push(enhancement);
}


