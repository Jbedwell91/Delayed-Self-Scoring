function loadWordList(asset_url, type) {
    $.getJSON(asset_url, function (data) {

        $(".content-title").html(data.title)
        $(".content").empty()

        if (type == "word_bank") {
            var words = data.word_bank

            words.forEach(function(text) {
                $(".content").addClass("word-bank-content")
                $(".content").append("<div class='word-bank-container'><span class='dr' style='white-space: normal'>"+text+"</span></div>");
                $(".content").append("  ")
            })
        } else {
            data.text.forEach(function(text) {
                $(".content").removeClass("word-bank-content")
                $(".content").append(text);
                $(".content").append("<br><br>")
            })
        }

        $(".dr").draggable({
            revert: true,
            revertDuration: 0,
            cursor: "pointer",
            scroll: false,
            stop: function( event, ui ) {
                var offset = $(".canvas").offset()
                var width = $(".canvas").width()
                var height = $(".canvas").height()
                if (ui.offset.left > offset.left && ui.offset.left < offset.left + width &&
                    ui.offset.top  > offset.top  && ui.offset.top  < offset.top + height) {

                    conceptMap.addNode(new Node(ui.offset.left - offset.left, ui.offset.top - offset.top, this.innerText))
                    $(this).removeClass("dr")
                    $(this).addClass("dragged-word")
                    $(this).draggable("disable")
                }
            }
        });
    });
}

function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
