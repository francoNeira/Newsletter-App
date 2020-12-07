# Newsletter Service

## Set-up del proyecto

### Instalación de dependencias

#### Luego de clonarse el repositorio se deben instalar las dependencias necesarias para el proyecto mediante el comando: _npm install_

### Edición de credenciales

#### Debe editarse el archivo _unqfyConnection.json_ ubicado en el directorio _resources_ e indicar una url válida correspondiente al servicio de Unqfy.

#### Deben editarse los archivos _credentials.json_ y _token.json_ ubicados en el directorio _src/clients/_ con datos que habiliten el uso de la api de gmail.

## Comandos rest disponibles

### Suscribirse a un artista

#### POST /api/subscribe

#### Body:

{
"artistId": arstistID,
"email": "unemail@unDominio.com"
}

### Desuscribirse a un artista

#### POST /api/unsubscribe

#### Body:

{
"artistId": arstistID,
"email": "unemail@unDominio.com"
}

### Notificar a usuarios suscriptos

#### POST /api/notify

#### Body:

{
"artistId": artistID,
"subject": "asuntoDelEmail",
"message": "cuerpoDelEmail"
}

### Obtener suscriptores de un artista

#### GET /api/subscriptions

#### Debe agregarse el id de artista por _query param_ mediante el parámetro _artistId_

### Eliminar suscriptores de un artista

#### DELETE /api/subscriptions

#### Body:

{
"artistId": artistID,
}
