import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const navigate = useNavigate(); // Utilize useNavigate

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the user object
    const user = {
      username,
      password
    };

    try {
      // Send POST request to the backend for login
      const response = await axios.post('http://localhost:5000/api/users/login', user);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    localStorage.setItem('darkMode', !darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    document.documentElement.classList.toggle('dark-mode', !darkMode);
  };

  // Apply dark mode on initial render
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <MDBContainer className="my-5 login-container" style={{ width: '500px' }}>
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src="/logo.png" style={{ width: '185px' }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Did you Hit your Rep Today?</h4>
            </div>
            <p>Please login to your account</p>
            <p>Username</p>
            <MDBInput
              wrapperClass='mb-4'
              id='form1'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>Password</p>
            <MDBInput
              wrapperClass='mb-4'
              id='form2'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 sign" onClick={handleSubmit}>Sign in</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>

            <div className="text-center pt-1 mb-5 pb-1">
              <p className="mb-0">Don't have an account?</p>
              <br />
              <MDBBtn outline className='btn' color='danger' tag='a' href="/signup">
                Register
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>

      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1000 }}
      >
        <MDBBtn
          onClick={toggleDarkMode}
          className="d-flex align-items-center"
          color="none"
          style={{ borderRadius: '50%', height: '35px', width: '35px' }}
        >
          <MDBIcon fas icon={darkMode ? "sun" : "moon"} size="lg" />
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}

export default Login;
