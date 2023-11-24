import { Routes, Route, Navigate } from "react-router-dom";
// layouts
import routes from "./pages";

export default function Router({ isAuthenticated }) {
  // let renderRoutes = routes.filter(
  // 	(route) => route.public === !isAuthenticated,
  // );

  let renderRoutes = [
    // ...renderRoutes,
    ...routes,
    // {
    // 	path: '*',
    // 	component: Page404,
    // 	layout: LogoOnlyLayout,
    // },
  ];

  return (
    <Routes>
      {renderRoutes.map((route, index) => {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              // <route.layout>
              <route.component></route.component>
              // </route.layout>
            }
          ></Route>
        );
      })}
      <Route
        path="*"
        element={<Navigate to={renderRoutes[0].path}></Navigate>}
      />
    </Routes>
  );

  // return useRoutes(routes);
}
