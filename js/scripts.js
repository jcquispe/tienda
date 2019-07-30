$(document).ready(function(){
    $("#formulario").hide();
    
    $("#nuevo").click(function() {
      $("#listado").hide();
      $("#formulario").show();
    });
});