# Agenda de contactos

Aplicación pequeña desarrollada como prueba técnica de frontend. Permite consultar, crear y editar contactos desde una interfaz responsive.

## Funcionalidades

- Carga inicial de contactos desde `public/data/contacts.json`, simulando una API.
- Persistencia de cambios en `localStorage`.
- Creación y edición de contactos.
- Cancelación de cambios sin modificar la información guardada.
- Formulario reactivo con validación.
- Uno o múltiples números de teléfono por contacto.
- Estados de carga, error y lista vacía.
- Pruebas unitarias del servicio y del formulario.

## Tecnologías

- Angular 22
- TypeScript
- Tailwind CSS 4
- Reactive Forms
- Vitest

## Ejecutar localmente

Se necesita una versión de Node.js compatible con Angular 22 y npm.

```bash
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

## Comandos

```bash
npm start          # Servidor de desarrollo
npm run build      # Compilación de producción
npm test -- --watch=false  # Pruebas unitarias en una sola ejecución
```

## Estructura principal

```text
src/app/
├── components/
│   ├── contact-form/   # Formulario reactivo de creación y edición
│   └── contact-list/   # Presentación de los contactos
├── models/             # Contratos de datos
└── services/           # Carga, estado y persistencia
```

## Persistencia

En la primera visita, el servicio obtiene los datos del archivo JSON y los guarda bajo la clave `contacts` de `localStorage`. Las siguientes visitas recuperan esa copia local. Crear o editar un contacto actualiza tanto el estado de la aplicación como el almacenamiento del navegador.
