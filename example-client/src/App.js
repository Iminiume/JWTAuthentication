import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const loginUrl = "http://localhost:3001/api/authencication/login";
const signupUrl = "http://localhost:3001/api/authencication/signup";

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  useEffect(() => {
    // Use useEffect to update token state
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignUp = async (username, password) => {
    try {
      const response = await axios.post(signupUrl, {
        username,
        password,
      });
      if (response?.data?.error) {
        console.log("Sign Up failed", response?.data?.error);
      } else {
        console.log("Sign Up completed");
      }
    } catch (err) {
      console.error("Sign Up failed", err);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(loginUrl, {
        username,
        password,
      });
      const { token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setToken(token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      setToken(null);
      console.log("Token removed");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Authentication Demo</h1>
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <p>You are not logged in.</p>
          )}
        </header>

        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/signup"
            element={
              token ? (
                <Dashboard />
              ) : (
                <SignUpPage token={token} handleSignUp={handleSignUp} />
              )
            }
          />
          <Route
            path="/login"
            element={
              token ? (
                <Dashboard />
              ) : (
                <LoginPage token={token} handleLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function SignUpPage({ token, handleSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(username, password);
  };

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">signup</button>
      </form>
    </div>
  );
}

function LoginPage({ token, handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the authenticated dashboard!</p>
    </div>
  );
}

export default App;
