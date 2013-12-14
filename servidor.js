#!/home/zerosk8/bin/node

/********    SERVIDOR BASADO EN 'EXPRESS' PARA BASE DE DATOS DE PERSONAS     ********
 * 
 * Este programa es el servidor para la base de datos no persistente de tipo de datos "Persona" y hace uso
 * de la librerias:
 * - "Express", para atender peticiones HTTP desde un cliente. (http://expressjs.com/)
 * - "lib_persona_2", implementa el tipo de dato "Persona".
 * 
 * El tipo de dato "Persona" viene definido en el fichero "lib_persona_2.js", y consta de los campos:
 * 
 * - 'dni': Almacena el DNI de la persona.
 * - 'nombre': Almacena el nombre de la persona.
 * - 'apellido1': Almacena el primer apellido de la persona.
 * - 'apellido2': Almacena el segundo apellido de la persona.
 * - 'edad': Almadena la edad de la persona.
 * 
 * Las operaciones que pueden enviarse al servidor y que siguen el protocolo HTTP son las siguientes:
 * 
 * 1. Crear una nueva persona con la operacion PUT y sus datos: '/persona/<dni>/<nombre>/<apellido1>/<apellido2>/<edad>'
 * 
 * 2. Consultar los datos de una persona con la operacion GET y su DNI: '/persona/<dni>'
 *      O bien, consultar los datos de todas las personas con la operacion GET y el caracter '*': '/persona/*'
 * 
 * 3. Actualizar el dato de una persona con la operacion POST, su DNI, el atributo y el nuevo valor:
 *      '/persona/<dni>/<atributo>/<valor>' donde <atributo> puede ser: 'nombre', 'apellido1', 'apellido2' o 'edad'
 * 
 * 4. Buscar datos de personas, segun un atributo dado, con la operacion GET, el atributo y el valor:
 *      '/persona/<atributo>/<valor>' donde <atributo> puede ser: 'dni', 'nombre', 'apellido1', 'apellido2' o 'edad'
 * 
 * El mensaje enviado por el servidor siempre contiene 2 campos dentro de la estructura JSON:
 * 
 * - status: su valor es "200" en caso de que se haya producido con éxito la operación solicitada, y el valor es "404" en caso de error.
 *      No debe confundirse con el protocolo HTTP, aunque utilice la misma nomenclatura, ya que su uso es meramente informativo y sirve 
 *      para informar de los mensajes de error dentro de la web, sin que intervenga el protocolo HTTP.
 * 
 * - content: su valor puede contener un mensaje de éxito, un diccionario con objetos de tipo "Persona" o un mensaje de error.
 *      No debe confundirse con el protocolo HTTP, aunque utilice la misma nomenclatura.
 * 
 * La base de datos esta implementada en un diccionario, el cual, utiliza el DNI de la persona como identificativo
 * unico para cada persona. Las respuestas servidas al cliente siguen la estructura JSON.
 * La direccion URL raiz para realizar peticiones a la base de datos, cuando el servidor esta en ejecucion, es:
 * 
 * http://127.0.0.1:8080/persona/
 * 
 * El programa cliente se encuentra implementado en el fichero "cliente.js".
 * 
 * 
 ************************************************************************************/

var puerto = process.argv[2]?process.argv[2]:8080;
var ip = "127.0.0.1";

var express = require('express');
var lib_persona = require("./lib_persona_2.js");

// var app = express.createServer(); // Esta funcion esta en desuso
var app = express();

var personas = new Object;
var puerto = process.argv[2]?process.argv[2]:8080;
var persona_aux;
var cadena_aux;

// Imprimir el menu de operaciones
app.get('/', function (req, res)
{
    var mensaje = new Object();
    
    mensaje.status = 200;
    
    mensaje.content = "\n--------------------------------------------------\n";
    mensaje.content += "Bienvenido a la Mini-base de datos de Personas\n";
    mensaje.content += "--------------------------------------------------\n\n";
    mensaje.content += "Las operaciones que puede realizar son:\n\n";
    mensaje.content += "1. Crear una nueva persona con la operación PUT y sus datos: '/persona/<dni>/<nombre>/<apellido1>/<apellido2>/<edad>'\n\n";
    mensaje.content += "2. Consultar los datos de una persona con la operación GET y su DNI: '/persona/<dni>'\n";
    mensaje.content += "     O bien, consultar los datos de todas las personas con la operación GET y el carácter '*': '/persona/*'\n\n";
    mensaje.content += "3. Actualizar el dato de una persona con la operación POST, su DNI, el atributo y el nuevo valor:";
    mensaje.content += "'/persona/<dni>/<atributo>/<valor>'\n";
    mensaje.content += "     donde <atributo> puede ser: 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
    mensaje.content += "4. Buscar datos de personas, según un atributo dado, con la operación GET, el atributo y el valor:"; 
    mensaje.content += "'/persona/<atributo>/<valor>'\n";
    mensaje.content += "     donde <atributo> puede ser: 'dni', 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
    
    cadena_aux = JSON.stringify(mensaje);
    
    res.contentType('application/json');
    res.send(cadena_aux);
    
    console.log('\n');
    console.log(cadena_aux);
});

// Crear una nueva persona en la base de datos
app.put('/persona/:dni/:nombre/:apellido1/:apellido2/:edad',function(req,res)
{
    var mensaje = new Object();
    
    persona_aux = new lib_persona.Persona(req.params.dni,req.params.nombre,req.params.apellido1,req.params.apellido2,req.params.edad);
    
    if(!(req.params.dni in personas))
    {
        personas[req.params.dni] = persona_aux;
        
        mensaje.status = 200;
        mensaje.content = "Creado DNI " + req.params.dni;
    }
    else
    {
        mensaje.status = 404;
        mensaje.content = "Ya existe una persona con ese número de DNI en la base de datos.";
    }
    
    cadena_aux = JSON.stringify(mensaje);
    
    res.contentType('application/json');
    res.send(cadena_aux);
    
    console.log('\n');
    console.log(cadena_aux);
});

// Obtener datos de una persona segun el DNI especificado, o bien, los datos de todas las personas
app.get('/persona/:dni',function(req,res)
{
    var mensaje = new Object();
    
    if(req.params.dni == '*')
    {
        if(Object.keys(personas).length > 0)
        {
            mensaje.status = 200;
            mensaje.content = personas;
        }
        else
        {
            mensaje.status = 200;
            mensaje.content = "La base de datos está vacía.";
        }
    }
    else{
        if(req.params.dni in personas)
        {
            var resultado = new Object();
            
            resultado[req.params.dni] = personas[req.params.dni];
            
            mensaje.status = 200;
            mensaje.content = resultado;
        }
        else
        {
            mensaje.status = 404;
            mensaje.content = "No existe ninguna persona con ese número de DNI en la base de datos.";
        }
    }
    
    cadena_aux = JSON.stringify(mensaje);
    
    res.contentType('application/json');
    res.send(cadena_aux);
    
    console.log('\n');
    console.log(cadena_aux);
});

// Actualizar un atributo dado de una persona especificada en la base de datos
app.post('/persona/:dni/:atributo/:valor',function(req,res)
{
    var mensaje = new Object();
    var existe_atributo = true;
    
    if(req.params.dni in personas)
    {
        switch(req.params.atributo)
        {
            case 'nombre':  personas[req.params.dni].nombre = req.params.valor;
                            break;
            
            case 'apellido1':   personas[req.params.dni].apellido1 = req.params.valor;
                                break;
            
            case 'apellido2':   personas[req.params.dni].apellido2 = req.params.valor;
                                break;
            
            case 'edad':    personas[req.params.dni].edad = req.params.valor;
                            break;
            
            default:    existe_atributo = false;
                        break;
        }
        
        if(existe_atributo)
        {
            mensaje.status = 200;
            mensaje.content = "Actualizado DNI " + req.params.dni;
        }
        else
        {
            mensaje.status = 404;
            mensaje.content = "No existe el atributo especificado.";
        }
    }
    else
    {
        mensaje.status = 404;
        mensaje.content = "No existe ninguna persona con ese número de DNI en la base de datos.";
    }
    
    cadena_aux = JSON.stringify(mensaje);
    
    res.contentType('application/json');
    res.send(cadena_aux);
    
    console.log('\n');
    console.log(cadena_aux);
});

// Buscar datos de personas segun un atributo dado
app.get('/persona/:atributo/:valor',function(req,res)
{
    var mensaje = new Object();
    var resultado = new Object();
    var existe_atributo = true;
    
    switch(req.params.atributo)
    {
        case 'dni': for(i in personas)
                    {
                        if(personas[i].dni == req.params.valor)
                        {
                            resultado[personas[i].dni] = personas[i];
                        }
                    }
                    
                    break;
        
        case 'nombre':  for(i in personas)
                        {
                            if(personas[i].nombre == req.params.valor)
                            {
                                resultado[personas[i].dni] = personas[i];
                            }
                        }
                        
                        break;
        
        case 'apellido1':   for(i in personas)
                            {
                                if(personas[i].apellido1 == req.params.valor)
                                {
                                    resultado[personas[i].dni] = personas[i];
                                }
                            }
                            
                            break;
        
        case 'apellido2':   for(i in personas)
                            {
                                if(personas[i].apellido2 == req.params.valor)
                                {
                                    resultado[personas[i].dni] = personas[i];
                                }
                            }
                            
                            break;
        
        case 'edad':    for(i in personas)
                        {
                            if(personas[i].edad == req.params.valor)
                            {
                                resultado[personas[i].dni] = personas[i];
                            }
                        }
                        
                        break;
        
        default:    existe_atributo = false;
                    break;
    }
    
    if(existe_atributo)
    {
        if(Object.keys(resultado).length > 0)
        {
            mensaje.status = 200;
            mensaje.content = resultado;
        }
        else
        {
            mensaje.status = 200;
            mensaje.content = "No se ha encontrado ningún resultado.";
        }
    }
    else
    {
        mensaje.status = 404;
        mensaje.content = "No existe el atributo especificado.";
    }
    
    cadena_aux = JSON.stringify(mensaje);
    
    res.contentType('application/json');
    res.send(cadena_aux);
    
    console.log('\n');
    console.log(cadena_aux);
});

app.listen(puerto,ip);

console.log('Servidor ejecutandose en ' + ip + ':' + puerto + '/');
