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

var express = require('./express');
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
    cadena_aux = "\n--------------------------------------------------\n";
    cadena_aux += "Bienvenido a la Mini-base de datos de Personas\n";
    cadena_aux += "--------------------------------------------------\n\n";
    cadena_aux += "Las operaciones que puede realizar son:\n\n";
    cadena_aux += "1. Crear una nueva persona con la operación PUT y sus datos: '/persona/<dni>/<nombre>/<apellido1>/<apellido2>/<edad>'\n\n";
    cadena_aux += "2. Consultar los datos de una persona con la operación GET y su DNI: '/persona/<dni>'\n";
    cadena_aux += "     O bien, consultar los datos de todas las personas con la operación GET y el carácter '*': '/persona/*'\n\n";
    cadena_aux += "3. Actualizar el dato de una persona con la operación POST, su DNI, el atributo y el nuevo valor:";
    cadena_aux += "'/persona/<dni>/<atributo>/<valor>'\n";
    cadena_aux += "     donde <atributo> puede ser: 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
    cadena_aux += "4. Buscar datos de personas, según un atributo dado, con la operación GET, el atributo y el valor:"; 
    cadena_aux += "'/persona/<atributo>/<valor>'\n";
    cadena_aux += "     donde <atributo> puede ser: 'dni', 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
    
    res.send(cadena_aux);
});

// Crear una nueva persona en la base de datos
app.put('/persona/:dni/:nombre/:apellido1/:apellido2/:edad',function(req,res)
{
    persona_aux = new lib_persona.Persona(req.params.dni,req.params.nombre,req.params.apellido1,req.params.apellido2,req.params.edad);
    
    if(!(req.params.dni in personas))
    {
        personas[req.params.dni] = persona_aux;
        
        cadena_aux = "{\n\"creado\": \"" + req.params.dni + "\"\n}\n";
    }
    else
    {
        cadena_aux = "{\n\"error\": \"Ya existe una persona con ese número de DNI en la base de datos.\"\n}\n";
    }
    
    res.send(cadena_aux);
});

// Obtener datos de una persona segun el DNI especificado, o bien, los datos de todas las personas
app.get('/persona/:dni',function(req,res)
{
    if(req.params.dni == '*')
    {
        var contador = 1;
        
        cadena_aux = "{\n";
        
        for(i in personas)
        {
            if(contador > 1)
            {
                cadena_aux += ",";
            }
            
            cadena_aux += "\"" + personas[i].dni + "\":\n{\n\"dni\": \"" + personas[i].dni + "\",\n\"nombre\": \"" + personas[i].nombre;
            cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
            cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
            cadena_aux += "\"\n}\n";
            
            contador++;
        }
        
        cadena_aux += "}\n";
        
        if(cadena_aux.length == 4)
        {
            cadena_aux = "{\n\"informacion\": \"La base de datos está vacía.\"\n}\n";
        }
    }
    else{
        if(req.params.dni in personas)
        {
            persona_aux = personas[req.params.dni];
            
            cadena_aux = "{\n\"" + persona_aux.dni + "\":\n{\n\"dni\": \"" + persona_aux.dni + "\",\n\"nombre\": \"";
            cadena_aux += persona_aux.nombre + " \",\n\"apellido1\": \"" + persona_aux.apellido1;
            cadena_aux += "\",\n\"apellido2\": \"" + persona_aux.apellido2 + "\",\n\"edad\": \"" + persona_aux.edad;
            cadena_aux += "\"\n}\n}\n";
        }
        else
        {
            cadena_aux = "{\n\"error\": \"No existe ninguna persona con ese número de DNI en la base de datos.\"\n}\n";
        }
    }
    
    res.send(cadena_aux);
});

// Actualizar un atributo dado de una persona especificada en la base de datos
app.post('/persona/:dni/:atributo/:valor',function(req,res)
{
    if(req.params.dni in personas)
    {
        switch(req.params.atributo)
        {
            case 'nombre':  personas[req.params.dni].nombre = req.params.valor;
                            cadena_aux = "{\n\"actualizado\": \"" + req.params.dni + "\"\n}\n";
                            break;
            
            case 'apellido1':   personas[req.params.dni].apellido1 = req.params.valor;
                                cadena_aux = "{\n\"actualizado\": \"" + req.params.dni + "\"\n}\n";
                                break;
            
            case 'apellido2':   personas[req.params.dni].apellido2 = req.params.valor;
                                cadena_aux = "{\n\"actualizado\": \"" + req.params.dni + "\"\n}\n";
                                break;
            
            case 'edad':    personas[req.params.dni].edad = req.params.valor;
                            cadena_aux = "{\n\"actualizado\": \"" + req.params.dni + "\"\n}\n";
                            break;
            
            default:    cadena_aux = "{\n\"error\": \"No existe el atributo especificado.\"\n}\n";
                        break;
        }
    }
    else
    {
        cadena_aux = "{\n\"error\": \"No existe ninguna persona con ese número de DNI en la base de datos.\"\n}\n";
    }
    
    res.send(cadena_aux);
});

// Buscar datos de personas segun un atributo dado
app.get('/persona/:atributo/:valor',function(req,res)
{
    var contador = 1;
    
    switch(req.params.atributo)
    {
        case 'dni': cadena_aux = '';
                    
                    for(i in personas)
                    {
                        if(personas[i].dni == req.params.valor)
                        {
                            cadena_aux = "{\n\"" + personas[i].dni + "\": {\n\"dni\": \"" + personas[i].dni;
                            cadena_aux += "\",\n\"nombre\": \"" + personas[i].nombre;
                            cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
                            cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
                            cadena_aux += "\"\n}\n}\n";
                        }
                    }
                    
                    if(cadena_aux.length == 0)
                    {
                        cadena_aux = "{\n\"informacion\": \"No se ha encontrado ningún resultado.\"\n}\n";
                    }
                    
                    break;
        
        case 'nombre':  cadena_aux = "{\n";
                        
                        for(i in personas)
                        {
                            if(personas[i].nombre == req.params.valor)
                            {
                                if(contador > 1)
                                {
                                    cadena_aux += ",";
                                }
                                
                                cadena_aux += "\"" + personas[i].dni + "\":\n{\n\"dni\": \"" + personas[i].dni;
                                cadena_aux += "\",\n\"nombre\": \"" + personas[i].nombre;
                                cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
                                cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
                                cadena_aux += "\"\n}\n";
                                
                                contador++;
                            }
                        }
                        
                        cadena_aux += "}\n";
                        
                        if(cadena_aux.length == 4)
                        {
                            cadena_aux = "{\n\"informacion\": \"No se ha encontrado ningún resultado.\"\n}\n";
                        }
                        
                        break;
        
        case 'apellido1':   cadena_aux = "{\n";
                            
                            for(i in personas)
                            {
                                if(personas[i].apellido1 == req.params.valor)
                                {
                                    if(contador > 1)
                                    {
                                        cadena_aux += ",";
                                    }
                                    
                                    cadena_aux += "\"" + personas[i].dni + "\":\n{\n\"dni\": \"" + personas[i].dni;
                                    cadena_aux += "\",\n\"nombre\": \"" + personas[i].nombre;
                                    cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
                                    cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
                                    cadena_aux += "\"\n}\n";
                                    
                                    contador++;
                                }
                            }
                            
                            cadena_aux += "}\n";
                            
                            if(cadena_aux.length == 4)
                            {
                                cadena_aux = "{\n\"informacion\": \"No se ha encontrado ningún resultado.\"\n}\n";
                            }
                            
                            break;
        
        case 'apellido2':   cadena_aux = "{\n";
                            
                            for(i in personas)
                            {
                                if(personas[i].apellido2 == req.params.valor)
                                {
                                    if(contador > 1)
                                    {
                                        cadena_aux += ",";
                                    }
                                    
                                    cadena_aux += "\"" + personas[i].dni + "\":\n{\n\"dni\": \"" + personas[i].dni;
                                    cadena_aux += "\",\n\"nombre\": \"" + personas[i].nombre;
                                    cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
                                    cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
                                    cadena_aux += "\"\n}\n";
                                    
                                    contador++;
                                }
                            }
                            
                            cadena_aux += "}\n";
                            
                            if(cadena_aux.length == 4)
                            {
                                cadena_aux = "{\n\"informacion\": \"No se ha encontrado ningún resultado.\"\n}\n";
                            }
                            
                            break;
        
        case 'edad':    cadena_aux = "{\n";
                        
                        for(i in personas)
                        {
                            if(personas[i].edad == req.params.valor)
                            {
                                if(contador > 1)
                                {
                                    cadena_aux += ",";
                                }
                                
                                cadena_aux += "\"" + personas[i].dni + "\":\n{\n\"dni\": \"" + personas[i].dni;
                                cadena_aux += "\",\n\"nombre\": \"" + personas[i].nombre;
                                cadena_aux += "\",\n\"apellido1\": \"" + personas[i].apellido1;
                                cadena_aux += "\",\n\"apellido2\": \"" + personas[i].apellido2 + "\",\n\"edad\": \"" + personas[i].edad;
                                cadena_aux += "\"\n}\n";
                                
                                contador++;
                            }
                        }
                        
                        cadena_aux += "}\n";
                        
                        if(cadena_aux.length == 4)
                        {
                            cadena_aux = "{\n\"informacion\": \"No se ha encontrado ningún resultado.\"\n}\n";
                        }
                        
                        break;
        
        default:    cadena_aux = "{\n\"error\": \"No existe el atributo especificado.\"\n}\n";
                    break;
    }
    
    res.send(cadena_aux);
});

app.listen(puerto);

console.log('Servidor ejecutandose en http://127.0.0.1:' + puerto + '/');
