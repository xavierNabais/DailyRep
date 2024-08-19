import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import axios from 'axios';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const navigate = useNavigate(); // Utilize useNavigate
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const { userId } = useParams(); // Retrieve userId from URL
  const [newBookingComment, setNewBookingComment] = useState(''); // For adding a new comment
  const [bookings, setBookings] = useState([]); // For storing bookings
  const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);

  // Dentro do useEffect que faz o fetch do perfil
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        // Fetch profile do usuário logado
        const loggedInProfileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        setLoggedInUserProfile(loggedInProfileResponse.data);
  
        // Fetch perfil do usuário que está sendo visualizado
        const profileResponse = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        setProfile(profileResponse.data);
  
        // Fetch user bookings
        const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBookings(bookingsResponse.data);
        
        // Fetch suggested users
        const suggestedUsersResponse = await axios.get('http://localhost:5000/api/users/suggestions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setRecommendedUsers(suggestedUsersResponse.data);
  
      } catch (error) {
        console.error('Error fetching profile and bookings:', error);
      }
    };
  
    fetchProfileAndPosts();
  }, [userId]);
  
  

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleSearch = async () => {
    try {
      const searchResponse = await axios.get(`http://localhost:5000/api/bookings/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(searchResponse.data);
    } catch (error) {
      console.error('Error searching bookings:', error);
    }
  };
  
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  const handleLike = async (bookingId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/likes/toggle/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId ? { ...booking, likes: response.data.likeCount, userLiked: response.data.userLiked } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error liking booking:', error);
    }
  };
  

  const handleComment = async (bookingId, comment) => {
    if (comment.trim() === '') return;
    try {
      await axios.post(`http://localhost:5000/api/comments`, { bookingId, comment }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId ? {
          ...booking,
          comments: [...(booking.comments || []), { userUsername: profile.username, comment, createdAt: new Date().toISOString() }]
        } : booking
      );
      setBookings(updatedBookings);
  
    } catch (error) {
      console.error('Error commenting on booking:', error);
    }
  };
  

  const handleDeleteComment = async (commentId, bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId
          ? {
              ...booking,
              comments: booking.comments.filter(comment => comment._id !== commentId)
            }
          : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const handleFollow = async (userIdToFollow) => {
    try {
      await axios.post('http://localhost:5000/api/follows', { userIdToFollow }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const updatedRecommendedUsers = recommendedUsers.filter(user => user._id !== userIdToFollow);
      setRecommendedUsers(updatedRecommendedUsers);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  

  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      await axios.post('http://localhost:5000/api/follows/remove', { userIdToUnfollow }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Optionally, update the state or refetch data
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <MDBContainer fluid className="my-5">
      <MDBRow>
        {/* Perfil à esquerda */}
        < MDBCol md="3">
          <div className="text-center">
            <a href="/" className="d-inline-block">
              <img src="/logo.png" alt="App Logo" style={{ maxWidth: '40%', height: 'auto' }} />
            </a>
          </div>
            <MDBCard className="mb-4 shadow-sm">
              <MDBCardBody className="text-center">
              <MDBIcon fas icon="user-circle" size="3x" className="my-3" />
                <h5 className="mb-1">{profile?.username}</h5>
                <MDBBtn color="danger" className="mt-3" onClick={handleLogout}>Logout</MDBBtn>
                <MDBListGroup flush className="mt-3">
                  <MDBListGroupItem className="list-item-spacing d-flex align-items-center" onClick={() => handleUserClick(profile._id)}>
                    <MDBIcon fas icon="user" className="me-2" /> 
                    <span>Profile</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="list-item-spacing d-flex align-items-center">
                    <MDBIcon fas icon="users" className="me-2" /> 
                    <span>Followers</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="list-item-spacing d-flex align-items-center">
                    <MDBIcon fas icon="user-friends" className="me-2" /> 
                    <span>Following</span>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
            </MDBCol>

        {/* Centro: Workouts e Busca */}
        <MDBCol md="6">
          <div className="d-flex flex-column">
            <h4 className="mb-4">Workout Feed</h4>

            <MDBCard className="mb-4 shadow-sm border-0">
                <MDBCardBody>
                <h4 className="mb-4">Profile Details</h4>
                {profile ? (
                    <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                    </div>
                ) : (
                    <p>Loading profile details...</p>
                )}
                </MDBCardBody>
            </MDBCard>
      
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <MDBCard key={booking._id} className="mb-3 shadow-sm border-0">
                        <MDBCardBody className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <MDBIcon fas icon="user" size="2x" className="me-2" />
                              <h5 className="mb-0">{booking.userUsername}</h5>
                            </div>
                            {profile?._id !== booking.userId && (
                                <MDBBtn
                                className="btn btn-danger"
                                onClick={() => handleUnfollow(booking.userId)}
                                >
                                Unfollow
                                </MDBBtn>
                            )}
                          </div>
                          <p className="text-muted mb-2">
                            <strong>{booking.status === 1 ? 'Done' : 'Missed'}</strong>
                          </p>
                          <p className="text-muted mb-2">
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                          <p className="text-muted mb-3">{booking.comment}</p>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <MDBBtn
                              className="btn btn-link"
                              onClick={() => handleLike(booking._id)}
                              style={{ color: booking.userLiked ? '#37a4c2' : 'white', textDecoration: 'none'  }}
                              >
                              <MDBIcon fas icon="heart" className="me-1" /> {booking.likes || 0}
                            </MDBBtn>
                          </div>
                          {booking.comments && booking.comments.length > 0 && (
                            <div className="mt-3">
                              {booking.comments.map((comment, index) => (
                                <div key={index} className="d-flex align-items-start mb-3">
                                  {/* Avatar */}
                                  <div className="me-2">
                                    <MDBIcon fas icon="user-circle" size="lg" />
                                  </div>
                                  {/* Comment Details */}
                                  <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <span className="comment-username">{comment.userUsername}</span>
                                      <small className="text-muted" style={{ marginLeft: '10px' }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
                                      {profile._id === comment.userId && (
                                        <MDBIcon
                                          fas
                                          icon="trash"
                                          size="lg"
                                          className="text-dark ms-2"
                                          style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
                                          onClick={() => handleDeleteComment(comment._id, booking._id, comment.userId)}
                                        />
                                      )}
                                    </div>
                                    <p className="mb-0">{comment.comment}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-3">
                            <MDBInput
                              type="text"
                              placeholder="Add a comment"
                              value={newBookingComment}
                              onChange={(e) => setNewBookingComment(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newBookingComment.trim() !== '') {
                                  handleComment(booking._id, newBookingComment);
                                  setNewBookingComment(''); // Clear input field
                                }
                              }}
                              size="sm"
                            />
                            <MDBBtn className="btn btn-primary mt-2" onClick={() => handleComment(booking._id, newBookingComment)}>
                              Reply
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    ))
                  ) : (
                    <p>No bookings found.</p>
                  )}
                </div>
              </MDBCol>
              <MDBCol md="3">
        <MDBCard className="mb-4 shadow-sm border-0">
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Search people</h5>
            </div>
            <MDBInput
              label="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
            />
            <MDBBtn className="mt-3" onClick={handleSearch} size="sm">Search</MDBBtn>
            
            {/* Seção de Pessoas para seguir */}
            <MDBCard className="mt-4">
              <MDBCardBody>
                <h5 className="mb-4">Follow more people</h5>
                {recommendedUsers.length > 0 ? (
                  <MDBListGroup>
                    {recommendedUsers.map(user => (
                      <MDBListGroupItem key={user._id} className="d-flex justify-content-between align-items-center">
                          <span style={{ cursor: 'pointer' }} onClick={() => handleUserClick(user._id)}>
                            {user.username}
                          </span>
                        <MDBBtn
                          color="primary"
                          onClick={() => handleFollow(user._id)}
                        >
                          Follow
                        </MDBBtn>
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                ) : (
                  <p>No users found.</p>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCardBody>
        </MDBCard>
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
      
      export default ProfilePage;
      