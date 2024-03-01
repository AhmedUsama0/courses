import { Header } from "./components";
import { AuthenticatedRoutes } from "./js";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  Courses, Course, NotFound, SearchResults, AddCourse,
  Episode, Register, Login,
  Settings,
  LandingPage
} from "./pages";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthenticatedRoutes />}>
      <Route index element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<Header />}>
        <Route path="courses" element={<Courses />} />
        <Route path="course/:course_id" element={<Course />} />
        <Route path="home" element={<LandingPage />} />
        <Route path="searchresults/:pattern" element={<SearchResults />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="add-episode/:course_id" element={<Episode />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
)
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
