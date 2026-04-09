import { createBrowserRouter } from "react-router-dom";
import { AppProviders } from "../app/providers";
import { AppShell } from "../app/AppShell";
import { AuthPage } from "../features/auth/AuthPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { RequestCreatePage } from "../features/request-create/RequestCreatePage";
import { RequestDetailPage } from "../features/request-detail/RequestDetailPage";

function withProviders(element: React.ReactNode) {
  return <AppProviders>{element}</AppProviders>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: withProviders(<AppShell />),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "requests/new",
        element: <RequestCreatePage />,
      },
      {
        path: "requests/:requestId",
        element: <RequestDetailPage />,
      },
    ],
  },
]);
