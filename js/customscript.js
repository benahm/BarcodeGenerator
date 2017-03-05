
$(document).ready(function(){
    $("#userInput").on('input',newBarcode);

    $(".text-align").click(function(){
      $(".text-align").removeClass("btn-primary");
      $(this).addClass("btn-primary");

      newBarcode();
    });


    $(".display-text").click(function(){
      $(".display-text").removeClass("btn-primary");
      $(this).addClass("btn-primary");

      if($(this).val() == "true"){
        $("#font-options").slideDown("fast");
      }
      else{
        $("#font-options").slideUp("fast");
      }

      newBarcode();
    });


    $('input[type="range"]').rangeslider({
        polyfill: false,
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        onSlide: newBarcode,
        onSlideEnd: newBarcode
    });

    newBarcode();
});

var newBarcode = function() {
    //Convert to boolean

    var ratioA4=210/297;

    var nbWidth=parseInt($("#bar-width").val());
    var nbHeight=parseInt($("#bar-height").val());
    var margin=parseInt($("#bar-margin").val());

    //Generate grid
    $(".grid").html("");
    for(var i = 0; i < nbWidth; i++){
      var gridCol=$("<div class='grid-col'></div>");
      for(var j = 0; j< nbHeight; j++){
        gridCol.append("<div class='grid-row'></div>");
      }
      $(".grid").append(gridCol);
    }
    
    var gridRowWidth=$(".grid-row").width();
    var gridColHeight=$(".grid-col").height();
    console.log("gridCol",gridColHeight);
    console.log(gridRowWidth);
    $(".grid-row").html("<svg class='barcode'>");
    console.log($(".grid-row").width());

    generateBarcorde(".barcode");


    var gridRow={width:(gridRowWidth-margin),height:(gridRowWidth*ratioA4)-margin};
    var gridCol={width:(((gridColHeight/nbHeight)/ratioA4)-margin),height:(gridColHeight/nbHeight)-margin};

    //Adapt barcode height & width
    $(".barcode").width(gridRow.width);
    $(".barcode").height(gridRow.height);
    if($(".barcode").height()*nbHeight>gridColHeight){
      $(".barcode").height(gridCol.height);
      $(".barcode").width(gridCol.width);
    }
    console.log("barcodeH",$(".barcode").height()*nbHeight);

    

    generateBarcorde("#bigbarcode");
    
    /*$(".grid").print({
      stylesheet : "css/style.print.css"
      title: ''
    });*/
    

    $(".grid-col").css("align-items","center");

    $("#bar-width-display").text($("#bar-width").val());
    $("#bar-height-display").text($("#bar-height").val());
    $("#bar-margin-display").text($("#bar-margin").val());
};


var generateBarcorde=function(selector){
  
  $(selector).JsBarcode(
      $("#userInput").val(),
      {
        "format": "EAN13",
        "margin": parseInt($("#bar-margin").val()),
        "displayValue": $(".display-text.btn-primary").val() == "true",
        "valid":
          function(valid){
            if(valid){
              $("#barcode").show();
              $("#invalid").hide();
            }
            else{
              $("#barcode").hide();
              $("#invalid").show();
            }
          }
      });
}
