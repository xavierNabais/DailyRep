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
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

function HomePage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [newBookingComment, setNewBookingComment] = useState('');
  const [newBookingStatus, setNewBookingStatus] = useState(0); // 0: absent, 1: present
  const navigate = useNavigate(); // Utilize useNavigate
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  
  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        // Fetch profile
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(profileResponse.data);
  
        const userId = profileResponse.data._id;
  
        try {
          // Fetch bookings
          const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/following?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const bookingsWithLikesAndComments = await Promise.all(bookingsResponse.data.map(async (booking) => {
            const likeCountResponse = await axios.get(`http://localhost:5000/api/likes/count/${booking._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
  
            const userLikedResponse = await axios.get(`http://localhost:5000/api/likes/userLikes/${userId}/${booking._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
  
            // Fetch comments for each booking
            const commentsResponse = await axios.get(`http://localhost:5000/api/comments/${booking._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
  
            return { ...booking, likes: likeCountResponse.data.likeCount, userLiked: userLikedResponse.data.userLiked, comments: commentsResponse.data };
          }));
  
          setBookings(bookingsWithLikesAndComments);
        } catch (error) {
          // Se houver um erro ao buscar bookings, você pode optar por tratar de forma específica
          console.error('Error fetching bookings:', error);
          setBookings([]); // Define bookings como vazio se não houver bookings
        }
  
        try {
          // Fetch suggested users
          const suggestedUsersResponse = await axios.get('http://localhost:5000/api/users/suggestions', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setRecommendedUsers(suggestedUsersResponse.data);
        } catch (error) {
          console.error('Error fetching suggested users:', error);
          setRecommendedUsers([]); // Define recommendedUsers como vazio se não houver sugestões
        }
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfileAndBookings();
  }, []);
    


  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    document.documentElement.classList.toggle('light-mode', !darkMode);
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

  const handleNewBooking = async () => {
    try {
      const userId = profile._id;
      const currentDate = new Date().toISOString(); // Data atual
      const newBooking = { userId, date: currentDate, status: newBookingStatus, comment: newBookingComment };
  
      await axios.post('http://localhost:5000/api/bookings', newBooking, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setNewBookingComment('');
      setNewBookingStatus(0);
      const updatedBookingsResponse = await axios.get(`http://localhost:5000/api/bookings/following?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(updatedBookingsResponse.data);
    } catch (error) {
      console.error('Error creating new booking:', error);
    }
  };
  

  const handleLike = async (bookingId) => {
    try {
      const userId = profile._id;
      const response = await axios.post(`http://localhost:5000/api/likes/toggle/${bookingId}`, { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const likeCountResponse = await axios.get(`http://localhost:5000/api/likes/count/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId ? { ...booking, likes: likeCountResponse.data.likeCount, userLiked: response.data.liked } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error liking booking:', error);
    }
  };
  

  const handleComment = async (bookingId, comment) => {
    if (comment.trim() === '') return;
    const userId = profile._id;
    try {
      await axios.post(`http://localhost:5000/api/comments`, { userId, bookingId, comment }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });      
  
      // Atualizar comentários no estado
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId ? {
          ...booking,
          comments: [...(booking.comments || []), { userUsername: profile.username, comment, createdAt: new Date().toISOString() }]
        } : booking
      );
      setBookings(updatedBookings);
      
      // Limpar o campo de novo comentário
      setNewBookingComment('');
    } catch (error) {
      console.error('Error commenting on booking:', error);
    }
  };

    // Função para deletar um comentário
    const handleDeleteComment = async (commentId, bookingId, commentUserId) => {
      try {
        // Verifique se o ID do usuário que está tentando excluir o comentário é o mesmo que o ID do autor do comentário
        if (profile._id !== commentUserId) {
          alert("You are not authorized to delete this comment.");
          return;
        }
    
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        // Atualizar a lista de comentários após a exclusão
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
    
    const handleUserClick = (userId) => {
      navigate(`/profile/${userId}`);
    };
  

  const handleFollow = async (userIdToFollow) => {
    try {
      const userId = profile._id;
      await axios.post('http://localhost:5000/api/follows', { userId, userIdToFollow }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      // Optionally refresh the recommended users list or the profile
      const updatedRecommendedUsers = recommendedUsers.filter(user => user._id !== userIdToFollow);
      setRecommendedUsers(updatedRecommendedUsers);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      const userId = profile._id;
      await axios.delete('http://localhost:5000/api/follows', {
        data: { userId, userIdToUnfollow },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Atualize a lista de publicações para remover as publicações do usuário que foi deixado de seguir
      const updatedBookings = bookings.filter(booking => booking.userId !== userIdToUnfollow);
      setBookings(updatedBookings);
      
      // Opcionalmente, atualize a lista de usuários recomendados
      // (dependendo de como você gerencia o estado dos usuários recomendados)
    } catch (error) {
      console.error('Error unfollowing user:', error);
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
  

  return (
  <MDBContainer fluid className="my-5">
    <MDBRow>
      {/* Perfil à esquerda */}
      <MDBCol md="3">
      <div className="text-center">
        <a href="/" className="d-inline-block">
          <img src="/logo.png" alt="App Logo" style={{ maxWidth: '40%', height: 'auto' }} />
        </a>
      </div>
      <MDBCard className="mb-4 shadow-sm" style={{ border: '0px' }}>
        <MDBCardBody className="text-center">

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
            <MDBBtn color="danger" className="mt-3" onClick={handleLogout}>Logout</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>

      {/* Bookings no centro */}
      <MDBCol md="6">
        <div className="d-flex flex-column">

          <MDBCard className="mb-4 shadow-sm border-0">
            <MDBCardBody>
              <h4 className="mb-4">Add DailyRep</h4>
              <MDBInput
                type="text"
                placeholder="Adicione um comentário"
                value={newBookingComment}
                onChange={(e) => setNewBookingComment(e.target.value)}
                className="mb-3"
              />
              <div className="d-flex justify-content-between mb-3">
              <MDBBtn
                className={`flex-fill me-2 workout-button done ${newBookingStatus === 1 ? 'active' : ''}`}
                onClick={() => setNewBookingStatus(1)}
              >
                <MDBIcon fas icon="check-circle" className="me-2" />
                Workout Done
              </MDBBtn>
              <MDBBtn
                className={`flex-fill workout-button missed ${newBookingStatus === 0 ? 'active' : ''}`}
                onClick={() => setNewBookingStatus(0)}
              >
                <MDBIcon fas icon="times-circle" className="me-2" />
                Missed Workout
              </MDBBtn>
              </div>
              <MDBBtn className='add-workout' onClick={handleNewBooking}>Add Workout</MDBBtn>
              </MDBCardBody>
          </MDBCard>
          <h4 >Workout Feed</h4>

          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <MDBCard key={booking._id} className="mb-3 shadow-sm border-0">
                <MDBCardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <MDBIcon fas icon="user" size="2x" className="me-2" />
                      <h5 className="mb-0" style={{ cursor: 'pointer' }} onClick={() => handleUserClick(booking.userId)}>
                        {booking.userUsername}
                      </h5>
                    </div>
                    <MDBBtn
                      className="btn unfollow"
                      onClick={() => handleUnfollow(booking.userId)}
                    >
                      Unfollow
                    </MDBBtn>
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
                      className="btn btn-link like"
                      onClick={() => handleLike(booking._id)}
                      style={{ color: booking.userLiked ? '#37a4c2' : 'black', textDecoration: 'none'  }}
                    >
                      <MDBIcon fas icon="heart" className="me-1" />  {booking.likes || 0}
                    </MDBBtn>
                  </div>
                  <hr></hr>
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
                            <small className="text-muted" style={{ marginLeft: '10px' }}>{new Date(comment.createdAt).toLocaleDateString()}</small> {/* Ajuste o valor conforme necessário */}
                            {profile._id === comment.userId && (
                              <MDBIcon
                                fas
                                icon="trash"
                                size="lg"
                                className="ms-2 trash"
                                style={{ position: 'absolute', right: 0, cursor: 'pointer'}}
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
              <h5 >Search people</h5>
            </div>
            <MDBInput
              label="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
            />
            <MDBBtn className="mt-3" onClick={handleSearch} size="sm">Search</MDBBtn>
          </MDBCardBody>
        </MDBCard>
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

export default HomePage;
