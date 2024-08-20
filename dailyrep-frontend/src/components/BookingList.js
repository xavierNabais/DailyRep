import React from 'react';
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';

const BookingList = ({
  bookings,
  handleUserClick,
  handleUnfollow,
  handleLike,
  handleComment,
  newBookingComment,
  setNewBookingComment,
  handleDeleteComment,
  profile
}) => {
  return (
    <>
      <h4 className="mb-4" style={{marginLeft: '10px', padding:'10px'}}>Workout Feed</h4>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <MDBCard key={booking._id} className="mb-4 shadow-sm border-0 rounded-3">
            <MDBCardBody className="d-flex flex-column p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  {/* Avatar */}
                  <img
                    src="/avatar.jpg" // Substitua pelo caminho correto do avatar
                    alt="User Avatar"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '12px'
                    }}
                  />
                  <h5
                    className="mb-0 text-dark"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUserClick(booking.userId)}
                  >
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
              <div className="d-flex align-items-center mb-3" style={{ marginLeft: '5px' }}>
                <MDBBtn
                  className="btn like d-flex flex-column align-items-center"
                  onClick={() => handleLike(booking._id)}
                  style={{
                    color: booking.userLiked ? '#37a4c2' : 'black',
                    textDecoration: 'none',
                    padding: '0',
                    background: 'none'
                  }}
                >
                  <MDBIcon fas icon="heart" className="me-1" style={{ fontSize: '18px' }} />
                  <span>{booking.likes || 0}</span>
                </MDBBtn>
                <MDBBtn
                  className="btn like comment d-flex flex-column align-items-center ms-3"
                  style={{
                    color: 'black',
                    textDecoration: 'none',
                    padding: '0',
                    background: 'none'
                  }}
                >
                  <MDBIcon fas icon="comment" className="me-1" style={{ fontSize: '18px' }} />
                  <span>{booking.comments ? booking.comments.length : 0}</span>
                </MDBBtn>
              </div>

              <hr />
              {booking.comments && booking.comments.length > 0 && (
                <div className="mt-3">
                  {booking.comments.map((comment, index) => (
                    <div key={index} className="d-flex align-items-start mb-3 position-relative">
                      {/* Avatar */}
                      <img
                        src="/avatar.jpg" // Substitua pelo caminho correto do avatar
                        alt="Comment Avatar"
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '10px'
                        }}
                      />
                      {/* Comment Details */}
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">{comment.userUsername}</span>
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>
                          {profile._id === comment.userId && (
                            <MDBIcon
                              fas
                              icon="trash"
                              size="lg"
                              className="ms-2 text-danger position-absolute end-0"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleDeleteComment(comment._id, booking._id, comment.userId)
                              }
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
                <MDBBtn
                  className="btn btn-primary mt-2"
                  onClick={() => handleComment(booking._id, newBookingComment)}
                >
                  Reply
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </>
  );
};

export default BookingList;
