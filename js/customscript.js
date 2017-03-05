
$(document).ready(function(){
    $("#userInput").on('input',newBarcode);


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

    $("#printA4").click(function(){
      $(".grid.printable").print({
        title: ' ',
      });
    });

    newBarcode();
});

var newBarcode = function() {
    //Convert to boolean

    var nbHeight=parseInt($("#bar-height").val());
    var nbWidth=parseInt($("#bar-width").val());
    var margin=parseInt($("#bar-margin").val());

    
    //generateA4format(".grid.preview",nbHeight,nbWidth,margin);
    generateA4format(".grid.printable",nbHeight,nbWidth,margin);
    

    generateBarcorde("#bigbarcode");
    
    //Align center after rendering
    $(".grid-col").css("align-items","center");

    $("#bar-width-display").text($("#bar-width").val());
    $("#bar-height-display").text($("#bar-height").val());
    $("#bar-margin-display").text($("#bar-margin").val());
};

generateA4format=function(selector,nbHeight,nbWidth,margin){
  var constRatioA4=210/297;
  var heightMarginAjust=5;

  //Generate grid
  $(selector).html("");
  for(var i = 0; i < nbWidth; i++){
    var gridCol=$("<div class='grid-col'></div>");
    for(var j = 0; j< nbHeight; j++){
      gridCol.append("<div class='grid-row'></div>");
    }
    $(selector).append(gridCol);
  }
  
  var gridRowWidth=$(".grid-row").width();
  var gridColHeight=$(".grid-col").height();
  console.log("gridCol",gridColHeight);
  console.log(gridRowWidth);
  $(".grid-row").html("<svg class='barcode'>");
  console.log($(".grid-row").width());

  generateBarcorde(".barcode");


  var gridRow={
    width:gridRowWidth-margin,
    height:(gridRowWidth*constRatioA4)-margin-heightMarginAjust
  };

  var gridCol={
    width:((gridColHeight/nbHeight)/constRatioA4)-margin,
    height:(gridColHeight/nbHeight)-margin-heightMarginAjust
  };

  //Adapt barcode height & width
  $(".barcode").width(gridRow.width);
  $(".barcode").height(gridRow.height);
  if($(".barcode").height()*nbHeight>gridColHeight){
    console.log("height controlling");
    $(".barcode").height(gridCol.height);
    $(".barcode").width(gridCol.width);
  }
  console.log("barcodeH",$(".barcode").height()*nbHeight);
}


var generateBarcorde=function(selector){
  
  $(selector).JsBarcode(
      $("#userInput").val(),
      {
        "format": "EAN13",
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
