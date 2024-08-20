import React from 'react';
import { MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const AddWorkoutForm = ({ newBookingComment, setNewBookingComment, newBookingStatus, setNewBookingStatus, handleNewBooking }) => {
  return (
    <MDBCard className="mb-4 shadow-sm" style={{ borderTop: '10px solid #37A4C2' }}>
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
        <MDBBtn className="add-workout" onClick={handleNewBooking}>Add Workout</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
};

export default AddWorkoutForm;
