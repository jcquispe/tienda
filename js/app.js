var db = firebase.database();
var productos_ref = db.ref('productos');
var table = $('table tbody');


function getFormData() {
  var codigo = $('#codigo').val();
  var descripcion = $('#descripcion').val();
  var cantidad = $('#cantidad').val();
  var unidad = $('#unidad').val();
  var precio = $('#precio').val();
  
  return {
    codigo: codigo,
    descripcion: descripcion,
    cantidad: cantidad,
    unidad: unidad,
    precio: precio
  };
}


function addProd(event) {
  event.preventDefault();
  var prod = getFormData();
  
  productos_ref.push(prod);
  $('form input').val('');
}


function addProdToDOM(is_update, prod, key, row) {
  var el = 
    '<tr data-key="' + key + '">' + 
      '<td>' + prod.codigo + '</td>' +
      '<td>' + prod.descripcion + '</td>' + 
      '<td>' + prod.cantidad + '</td>' +
      '<td>' + prod.unidad + '</td>' +
      '<td>' + prod.precio + '</td>' +
      '<td>' +
        '<button class="btn btn-sm update">Actualizar</button>' +
        '<button class="btn btn-sm grey darken-1 delete">Eliminar</button>' +
      '</td>' +
    '</tr>';
  
  if ( is_update ) {
    row.after(el);
    row.remove();
  } else table.append(el);
}


function updateProd(key, row) {
  var prod = getFormData();
  addProdToDOM(true, prod, key, row);
  
  productos_ref.child(key).set(prod);
  $('form input').val('');
  $('#submit')
    .unbind()
    .text('GUARDAR')
    .on('click', addProd);
    $('#cancel').hide();
}


function getProd() {
  var row = $(this).parents('tr');
  var key = row.data('key');
  var producto_ref = productos_ref.child(key);
  var submit = $('#submit');
  
  producto_ref.once('value')
  .then(function(prod) {
    prod = prod.val();
    
    $('#codigo').val(prod.codigo);
    $('#descripcion').val(prod.descripcion);
    $('#cantidad').val(prod.cantidad);
    $('#unidad').val(prod.unidad);
    $('#precio').val(prod.precio);
    
    submit.text('ACTUALIZAR');
    submit.unbind().on('click', function(e) {
      e.preventDefault();
      
      updateProd(key, row);
    });
  });
  
  $('#cancel')
    .unbind()
    .show()
    .on('click', function(e) {
      e.preventDefault();
      $('form input').val('');
      $(this).hide();
      submit.text('GUARDAR');
      submit.unbind().on('click', addProd);
    });
}


function deleteProd() {
  var row = $(this).parents('tr');
  var key = row.data('key');
  
  row.remove();
  productos_ref.child(key).remove();
}


function getProds() {  
  productos_ref.on('child_added', function(prod) {
    var key = prod.key;
    prod = prod.val();
    
    addProdToDOM(false, prod, key);
  });
}

function init() {
  getProds();
  
  $("#submit").on("click", addProd);
  table.on('click', 'button.update', getProd);
  table.on('click', 'button.delete', deleteProd);
}

init();

