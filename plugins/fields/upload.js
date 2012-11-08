function sw_uploader()
{
    // User Settings
    this.multiple = null;
    this.record_id = null;
    this.field_name = null;
    this.uploadPath = null;

    var self = this;
    this.HTML5 = window.FileReader ? true : false;

    this.HTML_uploader = function()
    {
        var input = $('<input type="file" />')
    	.prop('multiple', self.multiple)
        .on("change", function()
        {
            var max = self.multiple ? this.files.length : 1;
            for (var i = 0; i < max; i++) {
                var file = this.files[i];
                self.upload(file);
           //     sblib_queue_upload.call(that, file);
            }
            this.value = '';

        })
        .appendTo(this.node.find(".image-uploader-input"));

        this.node.on("mousemove", function(evt)
        {
            var node = $(this);
            var offset = node.offset();
            var width = node.width();
            input.css("right",  width - (evt.pageX - offset.left) - 10 + 'px');
        });

    }

    this.upload = function(file)
    {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('field_name', this.field_name);
        formData.append('record_id', this.record_id || null);

        var size = file.size;
        var filename = file.name;
        var type = file.type;

        var img = $(".image-uploader-thumb > img", this.node);
        var progress = $(".image-uploader-progress", this.node);
        var percenter = $(".image-uploader-percenter", this.node);
        var button = $(".image-uploader-browse", this.node);

        percenter.css('width', 0);
        button.fadeOut(200, function()
        {
            progress.fadeIn(200);
        });

        var reader = new FileReader();
        reader.onload = function(evt)
        {
            img.prop('src', evt.target.result);
        }

        img.fadeOut(function()
        {
            reader.readAsDataURL(file);
            img.fadeIn();
        }); 



        var xhr = new XMLHttpRequest();
        xhr.onload = function(evt)
        {
            if (xhr.status != 200) {
                alert("There was an error uploading your file");
                return;
            }

            if (this.getResponseHeader("Content-Type") == 'application/json') {
                var data = JSON.parse(this.responseText);                
            } else {
                alert(this.responseText || "Error uploading File");
                return;
            }

            progress.stop().fadeOut(200, function()
            {
                button.stop().fadeIn();
            });
        }
    
        xhr.upload.onprogress = function(evt)
        {

            var percent = (evt.position / evt.totalSize) * 100;
            percenter.css('width', percent + '%');
        }
                            
        xhr.open('POST', this.uploadPath, true);
        xhr.send(formData);  
    }


    this.append = function(query)
    {
        this.node = $(query);
        
        if (this.HTML5) {
            this.HTML_uploader();
        }
        
    
    }
}

