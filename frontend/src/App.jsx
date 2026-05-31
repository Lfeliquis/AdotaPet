import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PetDetails from "./pages/PetDetails";
import CreatePet from "./pages/CreatePet";
import EditPet from "./pages/EditPet";
import MyPets from "./pages/MyPets";
import MyAdoptions from "./pages/MyAdoptions";
import AdoptionRequests from "./pages/AdoptionRequests";
import Auth from "./pages/Auth";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#2f3140",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#62b562",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Auth />} />

          <Route path="/pets/:id" element={<PetDetails />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cadastrar-pet"
            element={
              <ProtectedRoute>
                <CreatePet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-pet/:id"
            element={
              <ProtectedRoute>
                <EditPet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-pets"
            element={
              <ProtectedRoute>
                <MyPets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-adoptions"
            element={
              <ProtectedRoute>
                <MyAdoptions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adoption-requests"
            element={
              <ProtectedRoute>
                <AdoptionRequests />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
