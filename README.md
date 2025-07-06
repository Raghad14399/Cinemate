# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About Cinemate

Cinemate is a lightweight **React + Tailwind CSS** admin panel that talks to an **ASP.NET Core** REST API.  Its primary goal is to give cinema owners a single place to manage every piece of data that flows through their business—from movies and halls to employees and end-users.

### Key Features

• **Movie Management** – Create, edit and remove movies, upload posters & trailers, and set show dates.

• **Hall Scheduler** – Define screening halls, adjust seating capacities, and quickly disable halls for maintenance.

• **User & Employee Directory** – Add new accounts, update profiles, block / unblock, or permanently delete users with confirmation dialogs to avoid mistakes.

• **Dashboard Metrics** – Quick stats (total users, movies, halls …) loaded via dedicated count endpoints.

• **Responsive UI** – Built with Tailwind utility classes; works great on laptops, tablets and mobile devices.

• **Re-usable Components** – Generic tables (`Table`), modals, image loaders, and form elements shared across screens.

### Tech Stack

- **React 18** with functional components & hooks
- **React Router** for page navigation
- **Axios** instance with interceptors (`src/api/config.js`) for authenticated API calls and token refresh
- **React-Toastify** for non-blocking notifications
- **Tailwind CSS** + custom colors for a dark theme look & feel

### Core Folders

| Path | Purpose |
|------|---------|
| `src/api/` | Low-level API utilities (`config.js`) and high-level service wrappers (`services.js`). |
| `src/Screens/` | Top-level pages (Dashboard, Admin, Public…). Each sub-folder represents a route. |
| `src/Components/` | Shared UI widgets (tables, buttons, promos, image loaders, modals…). |
| `src/Layout/` | Global layout primitives (sidebar, navbar). |

With this structure you can jump straight to a feature, update its helper in `services.js`, tweak the accompanying screen, and instantly see the change with hot-reload.

## Available Scripts

In the project directory, you can run:

### `npm i`

Installs all project dependencies listed in `package.json`.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.



## Project Structure Overview

Below is a high-level overview of the most important folders & files to help you navigate the codebase quickly:

- `src/` – all application source code.
  - `api/`
    - `config.js` – Axios instance with base URL, interceptors, and auth token handling.
    - `services.js` – Centralised API wrapper functions (auth, movies, halls, etc.).
  - `Components/` – Re-usable UI pieces.
    - `Table2.js` – Generic table used in admin dashboards.
    - `Modals/` – Dialog components such as `EditeEmploye.js`.
    - `Single/`, `Home/`, etc. – Feature-specific widgets (e.g., `MovieInfo.js`, `Promos.js`).
  - `Screens/` – Top-level pages routed by React Router.
    - `Dashboard/Admin/` – Admin pages like `Users.js`, `Halls.js`, `Employes.js` with CRUD logic.
    - `Dashboard/UpdateProfile.js` – User profile edit screen.
  - `Layout/` – Global UI pieces (e.g., `NavBar`, `SideBar`).
- `public/` – Static assets served directly.
- `.env` – Environment variables such as `REACT_APP_API_URL`.

### Development Flow
1. Clone the repo & run `npm i` to install dependencies.
2. Start the dev server with `npm start` (served at `http://localhost:3000`).
3. Most business logic lives in `src/api/services.js` and corresponding page in `src/Screens/…`.
4. Styling is done with Tailwind CSS utility classes defined inline.
5. Build for production using `npm run build`.

Happy coding! :rocket:


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---
