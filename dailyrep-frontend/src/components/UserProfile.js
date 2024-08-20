import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from 'mdb-react-ui-kit';

const UserProfile = ({ profile, handleUserClick, handleLogout }) => {
  return (
    <MDBCard className="mb-4 shadow-sm border-0">
      <div className="position-relative">
        {/* Banner */}
        <div
          style={{
            height: '150px',
            backgroundImage: `url(/banner.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }}
        ></div>

        <MDBCardImage
          src={profile.profilePicture || '/avatar.jpg'}
          alt="User profile"
          className="rounded-circle"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            border: '4px solid white',
          }}
        />
      </div>

      <MDBCardBody className="text-center mt-5 pt-3">
        {/* Informações do usuário */}
        <h5 className="mb-3">{profile.username}</h5>
          <p>Description of the user</p>
        {/* Seguidores e Seguindo */}
        <div className="mb-3">
          <h6>Following</h6>
          <p>{profile.followingCount}asdasd</p>
        </div>
        <div className="mb-3">
          <h6>Followers</h6>
          <p>{profile.followersCount}asdasd</p>
        </div>
        <hr />

        {/* Texto clicável para visualizar o perfil */}
        <div
          className="w-100 mb-3 text-center"
          onClick={() => handleUserClick(profile._id)}
          style={{
            cursor: 'pointer',
            color: '#007bff',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          <p className='view-profile'>View Profile</p>
        </div>

      </MDBCardBody>
    </MDBCard>
  );
};

export default UserProfile;
