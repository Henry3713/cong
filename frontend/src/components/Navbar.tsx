// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* "CONG"-Text als Link zur Startseite */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            CONG
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/templates">
          Templates
        </Button>
        <Button color="inherit" component={Link} to="/create-template">
          Neues Template
        </Button>
        <Button color="inherit" component={Link} to="/trash">
          Papierkorb
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
