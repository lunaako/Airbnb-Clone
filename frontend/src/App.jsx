import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotsIndex from './components/SpotsIndex';
import { getAllSpotsThunk } from './store/spots';
import SpotDetails from './components/SpotDetails/SpotDetails';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });

    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex />,
      },
      {
        path: 'spots/:id',
        element: <SpotDetails />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;