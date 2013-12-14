// El interprete usado es "node.js"
// Hace uso de "CommonJS", y por tanto, hace uso de "exports"

// Definicion de la clase "Persona"
exports.Persona = function(dni, nombre, apellido1, apellido2, edad)
{
    // Miembros de la clase
    this.dni = dni;
    this.nombre = nombre;
    this.apellido1 = apellido1;
    this.apellido2 = apellido2;
    this.edad = edad;
    
    // Funciones de la clase
    this.toString = _toString;
}

// Funcion para obtener los datos de una persona formateados en una cadena de caracteres
function _toString()
{
    var salida = new String;
    
    salida = "DNI: " + this.dni;
    salida += "\nNombre y apellidos: " + this.nombre + " " + this.apellido1 + " " + this.apellido2;
    salida += "\nEdad: " + this.edad;
    
    return salida;
}
