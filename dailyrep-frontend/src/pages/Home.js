import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AddWorkoutForm from '../components/AddWorkoutForm';
import BookingList from '../components/BookingList';
import SearchPeople from '../components/SearchPeople';
import UserProfile from '../components/UserProfile.js';
import Menu from '../components/Menu.js';

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

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  

  return (
    <>
    <Menu userId={profile ? profile._id : ''} /> {/* Passa o userId para o Menu */}
    <MDBContainer fluid className="my-5">
    <MDBRow>
      {/* Perfil à esquerda */}
      <MDBCol md="3">


        {profile && (
          <UserProfile
            profile={profile}
            handleUserClick={handleUserClick}
          />
        )}



      </MDBCol>

      {/* Bookings no centro */}
      <MDBCol md="6">
        <div className="d-flex flex-column">


        <AddWorkoutForm 
          newBookingComment={newBookingComment}
          setNewBookingComment={setNewBookingComment}
          newBookingStatus={newBookingStatus}
          setNewBookingStatus={setNewBookingStatus}
          handleNewBooking={handleNewBooking}
        />



          <BookingList 
            bookings={bookings} 
            handleUserClick={handleUserClick} 
            handleUnfollow={handleUnfollow} 
            handleLike={handleLike} 
            handleComment={handleComment}
            newBookingComment={newBookingComment}
            setNewBookingComment={setNewBookingComment}
            handleDeleteComment={handleDeleteComment}
            profile={profile}
          />

        </div>
      </MDBCol>

      <MDBCol md="3">

      <SearchPeople
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        recommendedUsers={recommendedUsers}
        handleUserClick={handleUserClick}
        handleFollow={handleFollow}
      />

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
  </>
);

}

export default HomePage;
