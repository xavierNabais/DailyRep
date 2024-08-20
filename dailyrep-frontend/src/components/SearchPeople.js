import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';

const SearchPeople = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  recommendedUsers,
  handleUserClick,
  handleFollow,
}) => {
  return (
    <>
      <MDBCard className="mb-4 shadow-sm border-0">
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Search people</h5>
          </div>
          <MDBInput
            label="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
          <MDBBtn className="mt-3" onClick={handleSearch} size="sm">
            Search
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>

      <MDBCard className="mt-4">
        <MDBCardBody>
          <h5 className="mb-4">Follow more people</h5>
          {recommendedUsers.length > 0 ? (
            <MDBListGroup>
              {recommendedUsers.map((user) => (
                <MDBListGroupItem
                  key={user._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUserClick(user._id)}
                  >
                    {user.username}
                  </span>
                  <MDBBtn color="primary" onClick={() => handleFollow(user._id)}>
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
    </>
  );
};

export default SearchPeople;
