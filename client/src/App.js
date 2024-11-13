import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import Chat from "./pages/Chat/Chat";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { logout } from "./actions/AuthActions";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const isTokenExpired = (token) => {
      if (!token) return true;
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    };

    if (user?.token && isTokenExpired(user.token)) {
      dispatch(logout());
    }
  }, [user, dispatch]);

  return (
    <div className="App">
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="../auth" />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="../auth" />}
        />
      </Routes>
    </div>
  );
}

export default App;
