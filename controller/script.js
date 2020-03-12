// PRUEBA ->
const base_url = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?'; // se le agrega el cors a la URL de la API

//Se ejecuta la funcion cuando el evento (.change) seleccionar un tipo de busqueda (ubicacion o latitud)
$('#tipo-busqueda').change(function() {  //El .change detecta el cambio de valor en el select
    let tipoBusqueda = $('#tipo-busqueda').val(); // Obtener el valor seleccionado del select
    if(tipoBusqueda == 'ubicacion') { 
        $('#form2').show();
        $('#form3').hide();
        $('#check').show();
        $('#boton').show();
        
    } else if(tipoBusqueda == 'lat') {
        $('#form2').hide();
        $('#form3').show();
        $('#check').show();
        $('#boton').show();
    } else {   // corresponde a la seccion "seleccione"
        $('#form2').hide();
        $('#form3').hide();
        $('#check').hide();
        $('#boton').hide();
    }
    
});

//reset para borrar los valores ingresados al recargar la página
$('#form1')[0].reset();

let buscar = class dataBusqueda{  // los filtros que el usuario ingresará para la seleccion de su busqueda
    constructor (tipoBusqueda, location, lat, long, onlyFulltime){
        this.tipoBusqueda = tipoBusqueda;
        this.location = location;
        this.lat = lat;
        this.long = long;
        this.onlyFulltime = onlyFulltime;
    }
   
}

const validar = (data) => { // function validar(data) {}
    if(data.tipoBusqueda == 'ubicacion') {
        if(data.location == "") {
            Swal.fire({    //sweet alert
                title: 'Error!',
                text: 'Debe ingresar un lugar a buscar',
                icon: 'error'
              });
              return false;
        }
    } else if(data.tipoBusqueda == 'lat') { 
        if(data.lat == "" || data.long == "") {
            Swal.fire({
                title: 'Error!',
                text: 'Los valores de latitud y longitud no pueden ser vacíos',
                icon: 'error'
              });
              return false;
        }
    }
    return true;
}

let getCardHTML = (element) => {
    let tipo = element.type.replace("\n", '');
    let titulo = element.title;
    let company = element.company;
    let ciudad =  element.location;
    let urlImagen = element.company_logo;
    let descripcion = element.description;
    descripcion = jQuery.trim(descripcion).substring(0, 400).split(" ").slice(0, -1).join(" ") + "...";
    
    
    return '<div class="card">'
            +    '<div class="card-header border-0 text-center font-weight-bold">'
            +        titulo
            +    '</div>'
            +    '<div class="row no-gutters">'
            +        '<div class="col-sm-12 col-md-8">'
            +            '<div class="card-block px-2">'
            +                '<ul class="list-group list-group-flush">'
            +                   '<li class="list-group-item">Compañía: '+company +'</li>'
            +                    '<li class="list-group-item">Ciudad: '+ciudad+'</li>'
            +                    '<li class="list-group-item">Tipo:'+tipo+'</li>'
            +                    '<li class="list-group-item descripcion">'+descripcion+'</li>'
            +                '</ul>'
            +            '</div>'
            +        '</div>'
            +        '<div class="col-sm-12 col-md-4 ">'
            +            '<img src="'+urlImagen+'" class="img-fluid imagen-empresa rounded" alt="">'
            +       ' </div>'
            +    '</div>'
            +    '<div class="card-footer w-100 text-muted">'
            +        element.how_to_apply
            +    '</div>'
            + '</div>';
}


const getEmpleos = async (data) => {
    let url = getUrl(data);
    let response = await fetch(url)
    .then((resp) => resp.json()) // pasa el Json que recibe de la API a un objeto
    .then((jobs) => {
        $('#cargando').hide();
        $('#empleos').empty();
        if(jQuery.isEmptyObject(jobs)) {
            $('#empleos').append('<div class="alert alert-light" role="alert">No hay resultados!</div>'); //bootstrap "no hay resultado"
        } else {
            jobs.forEach(element => {
                htmlCard = getCardHTML(element);
                $('#empleos').append(htmlCard);
            });
        }
        
    }).catch((error) => {
        Swal.fire({
            title: 'Error con la API de Github Jobs',
            text: error,
            icon: 'error'
          });
    });
    
}

$('#button').click( () => { //ejecuta la funcion al hacer click
         
    let tipoBusqueda = $('#tipo-busqueda').val(); //retorna el valor selecionado
    let lat = '';
    let long = '';
    let location = '';

    if(tipoBusqueda == 'ubicacion') {
        location = $('#ubicacion').val(); //trae el formulario con el id ubicacion
    } else if(tipoBusqueda == 'lat') { 
        lat = $('#lat').val(); //trae el formulario con latitud y longitud
        long = $('#long').val();
    }
    let onlyFulltime = $('#fulltime').is(':checked'); // trae el check si se selecciona

    let dataBusqueda = new buscar (
        tipoBusqueda,
        location,
        lat,
        long,
        onlyFulltime,
    );        
    
    if (validar(dataBusqueda)) {
        $('#cargando').show();
        getEmpleos(dataBusqueda);
    }
    
});


const getUrl = (data) => { // const getUrl = function(data){}
    let url = "";
    if(data.location != ""){
        url+= 'location=' + data.location.replace(/\s/g, '+'); //expresion regular que reemplaza los espacios por un +
    }

    if(data.lat != ""){    
        if(url!= "") {
            url+='&';
        }
        url+= 'lat='+data.lat;
    }
    
    if(data.long != ""){
        if(url!="") {
            url+='&';
        }
        url+= 'long='+data.long;
    }

    if(data.onlyFulltime != ""){ //si esta seleccionado añadirlo en la llamada a la API
        if(url!="") {
            url+='&';
        }
        url+= 'full_time='+data.onlyFulltime;
    }
    return base_url+url;
}







