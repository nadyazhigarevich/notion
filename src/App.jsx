import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import UserContextProvider from './components/UserContextProvider';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/NotFound';
import Notes from './pages/Notes';
import CreateNotePage from './pages/CreatePage'; // Импорт страницы создания заметки
import EditNotePage from './pages/EditPage'; // Импорт страницы редактирования заметки
import NotePage from './pages/Note';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/', // Главная страница по адресу /
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: '/notes', // Страница со списком заметок
        element: (
          <RequireAuth>
            <Notes />
          </RequireAuth>
        ),
      },
      {
        path: '/create-note', // Страница создания новой заметки
        element: (
          <RequireAuth>
            <CreateNotePage />
          </RequireAuth>
        ),
      },
      {
        path: '/edit-note/:id', // Страница редактирования заметки
        element: (
          <RequireAuth>
            <EditNotePage />
          </RequireAuth>
        ),
      },
      {
        path: '/note/:id', // Страница редактирования заметки
        element: (
          <RequireAuth>
            <NotePage />
          </RequireAuth>
        ),
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
};

export default App;