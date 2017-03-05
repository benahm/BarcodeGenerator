
$(document).ready(function(){
    //Generate new barcode on user input
    $("#userInput").on('input',newBarcode);

    //Show or Hide barcode number
    $(".display-text").click(function(){
      $(".display-text").removeClass("btn-primary");
      $(this).addClass("btn-primary");

      newBarcode();
    });

    //Generate rangeSliders
    $('input[type="range"]').rangeslider({
        polyfill: false,
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        onSlide: newBarcode,
        onSlideEnd: newBarcode
    });

    //Print in A4 format
    $("#printA4").click(function(){
      $(".grid.printable").print();
    });

    newBarcode();
});

var LOG_FLAG=true;

var consoleLog = function(){
    if(LOG_FLAG){
      console.log(arguments);
    }
}

var newBarcode = function() {

    var nbHeight=parseInt($("#bar-height").val());
    var nbWidth=parseInt($("#bar-width").val());
    var margin=parseInt($("#bar-margin").val());

    //Generate the preview and the printable A4 page
    generateA4format(".grid.preview",nbHeight,nbWidth,margin);
    generateA4format(".grid.printable",nbHeight,nbWidth,margin);

    //Generate the big preview barcode
    generateBarcorde("#bigbarcode");
    
    //Align center after rendering
    $(".grid-col").css("align-items","center");

    //Update diplay
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
      var gridRow=$("<div class='grid-row'></div>");
      gridCol.append(gridRow);
    }
    $(selector).append(gridCol);
  }
  
  var gridRowWidth=$(selector+" .grid-row").width();
  var gridColHeight=$(selector+" .grid-col").height();
  consoleLog("gridCol",gridColHeight);
  consoleLog(gridRowWidth);
  $(selector+" .grid-row").html("<svg class='barcode'>");
  consoleLog($(selector+" .grid-row").width());

  generateBarcorde(selector+" .barcode");


  var gridRow={
    width:gridRowWidth-margin,
    height:(gridRowWidth*constRatioA4)-margin-heightMarginAjust
  };

  var gridCol={
    width:((gridColHeight/nbHeight)/constRatioA4)-margin,
    height:(gridColHeight/nbHeight)-margin-heightMarginAjust
  };

  //Adapt barcode height & width
  $(selector+" .barcode").width(gridRow.width);
  $(selector+" .barcode").height(gridRow.height);
  if($(selector+" .barcode").height()*nbHeight>gridColHeight){
    consoleLog("Height is controlling");
    $(selector+" .barcode").height(gridCol.height);
    $(selector+" .barcode").width(gridCol.width);
  }
}


/*Generate bar code on a given selector*/
var generateBarcorde=function(selector){
  
  $(selector).JsBarcode(
      $("#userInput").val(),
      {
        "format": "EAN13",
        "displayValue": $(".display-text.btn-primary").val() == "true",
        "valid":
          function(valid){
            if(valid){
              $("#bigbarcode").show();
              $("#invalid").hide();
            }
            else{
              $("#bigbarcode").hide();
              $("#invalid").show();
            }
          }
      });
}
