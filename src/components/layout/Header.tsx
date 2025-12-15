import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Help as HelpIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick }) => {
  const { state, logout, setLanguage, setAccessibilityMode } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [languageEl, setLanguageEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleLanguageChange = (language: 'en' | 'ar') => {
    setLanguage(language);
    handleLanguageMenuClose();
  };

  const renderLanguageSwitch = () => (
    <>
      <IconButton
        color="inherit"
        onClick={handleLanguageMenuOpen}
        aria-label={state.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        aria-haspopup="true"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={languageEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(languageEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={state.language === 'en'}
        >
          <ListItemIcon>
            <Typography variant="body2" style={{ fontWeight: state.language === 'en' ? 'bold' : 'normal' }}>
              EN
            </Typography>
          </ListItemIcon>
          <ListItemText primary="English" />
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('ar')}
          selected={state.language === 'ar'}
        >
          <ListItemIcon>
            <Typography variant="body2" style={{ fontWeight: state.language === 'ar' ? 'bold' : 'normal' }}>
              ع
            </Typography>
          </ListItemIcon>
          <ListItemText primary="العربية" />
        </MenuItem>
      </Menu>
    </>
  );

  const renderProfileMenu = () => (
    <>
      <IconButton
        color="inherit"
        onClick={handleProfileMenuOpen}
        aria-label={state.language === 'en' ? 'Profile menu' : 'قائمة الملف الشخصي'}
        aria-haspopup="true"
      >
        {state.user?.profilePicture ? (
          <Avatar
            src={state.user.profilePicture}
            alt={state.user.fullName}
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <AccountCircleIcon />
        )}
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={state.language === 'en' ? 'Profile' : 'الملف الشخصي'} />
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={state.language === 'en' ? 'Settings' : 'الإعدادات'} />
        </MenuItem>
        <MenuItem onClick={() => { navigate('/accessibility'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccessibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={state.language === 'en' ? 'Accessibility' : 'إمكانية الوصول'} />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={state.language === 'en' ? 'Logout' : 'تسجيل الخروج'} />
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              pl: { xs: 0, sm: 2 }
            }}
          >
            NUJJUM
          </Typography>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button */}
          {state.isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={onSearchClick}
              aria-label={state.language === 'en' ? 'Search' : 'البحث'}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Language Switch */}
          {renderLanguageSwitch()}

          {/* Help Button */}
          <IconButton
            color="inherit"
            aria-label={state.language === 'en' ? 'Help & Tutorials' : 'المساعدة والبرامج التعليمية'}
          >
            <HelpIcon />
          </IconButton>

          {/* Profile Menu */}
          {state.isAuthenticated && renderProfileMenu()}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
