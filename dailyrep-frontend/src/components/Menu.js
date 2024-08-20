import React, { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import '../Menu.css'; // Adicione o CSS para o menu aqui

const Menu = ({ userId }) => { // Recebe userId como prop
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <MDBNavbar expand="lg" className="bg-light p-3">
      <MDBContainer fluid>
        {/* Logo à esquerda */}
        <MDBNavbarBrand href="/">
          <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
        </MDBNavbarBrand>

        {/* Itens do Menu */}
        <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
          <MDBNavbarItem>
            <MDBNavbarLink href="/">Home</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href={`/profile/${userId}`}>Profile</MDBNavbarLink> {/* Ajusta o link para incluir o userId */}
          </MDBNavbarItem>
        </MDBNavbarNav>

        {/* Avatar com Dropdown */}
        <MDBDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <MDBDropdownToggle tag="a" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
            <img src="/avatar.jpg" alt="Avatar" className="rounded-circle" style={{ height: '40px', width: '40px' }} />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem href={`/profile/${userId}`}>View Profile</MDBDropdownItem> {/* Ajusta o link para incluir o userId */}
            <MDBDropdownItem href="/logout">Logout</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Menu;
