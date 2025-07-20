import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import { UserContext } from '../UserContext';

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Network', path: '/network' },
];

function ResponsiveAppBar({ openLoginModal }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, logout } = useContext(UserContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2f2f2f' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <MusicNoteIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Music App
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
            </IconButton>

            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {user ? (
                [
                  <MenuItem
                    key="profile"
                    component={Link}
                    to={`/user/${user._id}`}
                    onClick={handleCloseUserMenu}
                  >
                    Profile
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    Logout
                  </MenuItem>,
                ]
              ) : (
                <MenuItem
                  onClick={() => {
                    openLoginModal();
                    handleCloseUserMenu();
                  }}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
