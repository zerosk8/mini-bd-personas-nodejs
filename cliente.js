#!/home/zerosk8/bin/node

/********    CLIENTE BASADO EN 'RESTLER' PARA BASE DE DATOS DE PERSONAS     ********
 * 
 * Este programa es el cliente para la base de datos no persistente de tipos de dato "Persona" y hace uso
 * de la librerias:
 * - "Restler", para realizar peticiones HTTP al servidor. (http://nodejs.org/api/readline.html)
 * - "Readline", para leer datos introducidos por el usuario en la consola de comandos. (https://github.com/danwrong/restler)
 * 
 * El tipo de dato "Persona" viene definido en el fichero "lib_persona_2.js" y consta de los campos:
 * 
 * - 'dni': Almacena el DNI de la persona.
 * - 'nombre': Almacena el nombre de la persona.
 * - 'apellido1': Almacena el primer apellido de la persona.
 * - 'apellido2': Almacena el segundo apellido de la persona.
 * - 'edad': Almadena la edad de la persona.
 * 
 * Las operaciones que pueden realizarse desde el lado del cliente son las siguientes:
 * 
 * 1. Crear una nueva persona a partir de los datos: <dni>,<nombre>,<apellido1>,<apellido2>,<edad>
 * 
 * 2.  Consultar los datos de una persona a partir de su DNI, o bien,
 *      consultar los datos de todas las personas a partir del caracter '*'
 * 
 * 3. Actualizar el dato de una persona a partir de su DNI, el atributo y el nuevo valor: <dni>,<atributo>,<valor>
 *      donde <atributo> puede ser: 'nombre', 'apellido1', 'apellido2' o 'edad'
 * 
 * 4. Buscar datos de personas, segun un atributo dado y el valor: <atributo>,<valor>
 *      donde <atributo> puede ser: 'dni', 'nombre', 'apellido1', 'apellido2' o 'edad'
 * 
 * El mensaje recibido por el servidor siempre contiene 2 campos dentro de la estructura JSON:
 * 
 * - status: su valor es "200" en caso de que se haya producido con éxito la operación solicitada, y el valor es "404" en caso de error.
 *      No debe confundirse con el protocolo HTTP, aunque utilice la misma nomenclatura, ya que su uso es meramente informativo y sirve 
 *      para informar de los mensajes de error dentro de la web, sin que intervenga el protocolo HTTP.
 * 
 * - content: su valor puede contener un mensaje de éxito, un diccionario con objetos de tipo "Persona" o un mensaje de error.
 *      No debe confundirse con el protocolo HTTP, aunque utilice la misma nomenclatura.
 * 
 * La base de datos esta implementada en un diccionario, el cual, utiliza el DNI de la persona como identificativo
 * unico para cada persona. Las respuestas recibidas por el servidor siguen la estructura JSON.
 * 
 * El programa servidor se encuentra implementado en el fichero "servidor.js"
 * y la direccion URL raiz para realizar peticiones a la base de datos, cuando el servidor esta en ejecucion, es:
 * 
 * http://127.0.0.1:8080/persona/
 * 
 * 
 ***********************************************************************************/

var restler = require('restler');
var readline = require('readline');

var URL_PERSONA = 'http://127.0.0.1:8080/persona/'; // Url para la base de datos
var menu, cadena_aux;

var datos_entrada = readline.createInterface(
{
    input: process.stdin,
    output: process.stdout
});

menu = "\n--------------------------------------------------\n";
menu += "Bienvenido a la Mini-base de datos de Personas\n";
menu += "--------------------------------------------------\n\n";
menu += "Las operaciones que puede realizar son:\n\n";
menu += "1. Crear una nueva persona a partir de los datos: <dni>,<nombre>,<apellido1>,<apellido2>,<edad>\n\n";
menu += "2. Consultar los datos de una persona a partir de su DNI,\n";
menu += "   o bien, consultar los datos de todas las personas a partir del carácter '*'\n\n";
menu += "3. Actualizar el dato de una persona a partir de su DNI, el atributo y el nuevo valor: <dni>,<atributo>,<valor>\n";
menu += "     donde <atributo> puede ser: 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
menu += "4. Buscar datos de personas, según un atributo dado y el valor: <atributo>,<valor>\n";
menu += "     donde <atributo> puede ser: 'dni', 'nombre', 'apellido1', 'apellido2' o 'edad'\n\n";
menu += "0. Salir\n\n"

console.log(menu);

datos_entrada.question("Por favor, seleccione una opción: ",function(opcion)
{
    switch(opcion.toString().trim()) // Convertimos el valor leido a tipo 'String' y borramos los espacios en blanco y saltos de linea
    {
        case '1':   cadena_aux = "Introduzca los datos de la nueva persona (<dni>,<nombre>,<apellido1>,<apellido2>,<edad>): ";
                    
                    datos_entrada.question(cadena_aux,function(datos_persona)
                    {
                        cadena_aux = datos_persona.toString();
                        cadena_aux = cadena_aux.replace(/,/g,'/');
                        
                        restler.put(URL_PERSONA + cadena_aux).on('complete',function(data)
                        {
                            console.log("\n****************************************");
                            console.log("               RESPUESTA                ");
                            console.log("****************************************\n");
                            console.log(data);
                            console.log('\n');
                        });
                        
                        datos_entrada.close();
                    });
                    
                    break;
        
        case '2':   cadena_aux = "Introduzca el DNI de la persona o el carácter '*' (sin comillas) para todas las personas: ";
                    
                    datos_entrada.question(cadena_aux,function(datos_persona)
                    {
                        cadena_aux = datos_persona.toString();
                        
                        restler.get(URL_PERSONA + cadena_aux).on('complete',function(data)
                        {
                            console.log("\n****************************************");
                            console.log("               RESPUESTA                ");
                            console.log("****************************************\n");
                            console.log(data);
                            console.log('\n');
                        });
                        
                        datos_entrada.close();
                    });
                    
                    break;
        
        case '3':   cadena_aux = "Introduzca los datos de la persona a actualizar (<dni>,<atributo>,<valor>): ";
                    
                    datos_entrada.question(cadena_aux,function(datos_persona)
                    {
                        cadena_aux = datos_persona.toString();
                        cadena_aux = cadena_aux.replace(/,/g,'/');
                        
                        restler.post(URL_PERSONA + cadena_aux).on('complete',function(data)
                        {
                            console.log("\n****************************************");
                            console.log("               RESPUESTA                ");
                            console.log("****************************************\n");
                            console.log(data);
                            console.log('\n');
                        });
                        
                        datos_entrada.close();
                    });
                    
                    break;
        
        case '4':   cadena_aux = "Introduzca el criterio y el valor de búsqueda (<atributo>,<valor>): ";
                    
                    datos_entrada.question(cadena_aux,function(datos_persona)
                    {
                        cadena_aux = datos_persona.toString();
                        cadena_aux = cadena_aux.replace(/,/g,'/');
                        
                        restler.get(URL_PERSONA + cadena_aux).on('complete',function(data)
                        {
                            console.log("\n****************************************");
                            console.log("               RESPUESTA                ");
                            console.log("****************************************\n");
                            console.log(data);
                            console.log('\n');
                        });
                        
                        datos_entrada.close();
                    });
                    
                    break;
        
        case '0':   
        default:    datos_entrada.close();
                    break;
    }
});
