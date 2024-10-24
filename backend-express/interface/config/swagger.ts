import swaggerJSDoc from "swagger-jsdoc";
// import path from "path";

// Opciones para Swagger JSDoc
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Estructura de puertos y adaptadores',
            version: '1.0.0',
            description: 'Documentación de la API usada como ejemplo de desarrollo para arquitectura de puertos y adaptadores',
            contact: {
                name: "SKRTEEEEEE",
                url: "https://profile-skrt.vercel.app",
                email: "adanreh.m@gmail.com"
            }
        },
        servers: [
            {
              url: process.env.NODE_ENV === 'production' 
                ? 'https://hexa-backend-deploy.vercel.app'  // URL de producción
                : 'http://localhost:3000',                 // URL local
              description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor local'
            }
          ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Opcional, pero recomendado
                },
            },
        },
    },
    apis: ["./interface/routes/*.ts", "./interface/controllers/*.ts"]
};


// Generar la especificación Swagger
export const swaggerDocs = swaggerJSDoc(swaggerOptions);