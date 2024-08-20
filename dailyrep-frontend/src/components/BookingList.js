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
      <h4>Workout Feed</h4>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <MDBCard key={booking._id} className="mb-3 shadow-sm border-0">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <MDBIcon fas icon="user" size="2x" className="me-2" />
                  <h5
                    className="mb-0"
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <MDBBtn
                  className="btn btn-link like"
                  onClick={() => handleLike(booking._id)}
                  style={{
                    color: booking.userLiked ? '#37a4c2' : 'black',
                    textDecoration: 'none',
                  }}
                >
                  <MDBIcon fas icon="heart" className="me-1" /> {booking.likes || 0}
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
                          <small
                            className="text-muted"
                            style={{ marginLeft: '10px' }}
                          >
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>{' '}
                          {/* Ajuste o valor conforme necessário */}
                          {profile._id === comment.userId && (
                            <MDBIcon
                              fas
                              icon="trash"
                              size="lg"
                              className="ms-2 trash"
                              style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
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
