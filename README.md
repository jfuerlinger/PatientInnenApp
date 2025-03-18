# PatientInnenApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Features

- **Authentication**: Secure authentication system with auth guards
- **Public Area**: Home component accessible to all users
- **Protected Area**: Secure component with restricted access
- **Responsive Design**: Modern and responsive user interface

## Development server

To start a local development server, run either:

```bash
ng serve
```
or
```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Installation

Before running the application, install all dependencies:

```bash
npm install
```


## Building

To build the project for development, run:

```bash
ng build
```

For production build with optimization:

```bash
ng build --configuration production
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests with [Karma](https://karma-runner.github.io), use one of the following commands:

```bash
ng test
```
or
```bash
npm test
```

Tests will run in watch mode by default, meaning they will rerun whenever you make changes to the code.

## Running end-to-end tests

For end-to-end (e2e) testing, you'll need to first install a testing framework of your choice (e.g., Cypress or Playwright).

## Project Structure

```
src/
  ├── app/
  │   ├── guards/      # Authentication guards
  │   ├── home/        # Public home component
  │   ├── secure/      # Protected component
  │   └── services/    # Authentication services
```

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
