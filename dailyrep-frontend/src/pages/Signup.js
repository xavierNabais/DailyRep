import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password
    };

    try {
      const response = await axios.post('http://localhost:5000/api/users', newUser);
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark-mode', newMode);
      document.documentElement.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  // Apply dark mode on initial render
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <MDBContainer className="my-5 sign-up-container" style={{ width: '500px' }}>
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src="/logo.png" style={{ width: '185px' }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Sign up now</h4>
            </div>
            <p>Username</p>
            <MDBInput
              wrapperClass='mb-4'
              id='form1'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='@username'
            />
            <p>Email</p>
            <MDBInput
              wrapperClass='mb-4'
              id='form2'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your.email@example.com'
            />
            <p>Password</p>
            <MDBInput
              wrapperClass='mb-4'
              id='form3'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="w-100 mb-4 sign" onClick={handleSubmit}>Sign Up</MDBBtn>
            </div>
            <div className="text-center pt-1 mb-5 pb-1">
              <p className="mb-0">Already have an account?</p>
              <br></br>
              <a href="/login" className="btn btn-outline-danger">Login</a>
            </div>
          </div>
        </MDBCol>
      </MDBRow>

      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1000 }}
      >
        <button
          onClick={toggleDarkMode}
          className="d-flex align-items-center"
          color="none"
          style={{ borderRadius: '50%', height: '35px', width: '35px' }}
        >
          <MDBIcon fas icon={darkMode ? "sun" : "moon"} size="lg" />
        </button>
      </div>
    </MDBContainer>
  );
}

export default SignUp;
