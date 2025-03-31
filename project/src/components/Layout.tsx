import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  IconButton, 
  Button, 
  useTheme as useMuiTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { 
  Menu, 
  LogOut, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Sair', icon: <LogOut size={20} />, onClick: logout }
  ];

  const BrandLogo = ({ size = 'normal' }) => (
    <Link
      to="/"
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src="/desenvolver-coworking-logo.svg"
        alt="Desenvolver Coworking"
        sx={{ 
          height: size === 'large' ? '48px' : size === 'small' ? '28px' : '40px',
          filter: mode === 'light' ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)',
        }}
      />
    </Link>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky"
        sx={{
          backgroundColor: mode === 'light' 
            ? muiTheme.palette.primary.main
            : muiTheme.palette.primary.dark,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <BrandLogo />
              </Box>
            </>
          ) : (
            <>
              <BrandLogo size="large" />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton 
                color="inherit" 
                onClick={toggleColorMode} 
                sx={{ mr: 1 }}
                aria-label="toggle dark mode"
              >
                {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </IconButton>
              <Button 
                color="inherit"
                startIcon={<LogOut size={20} />}
                onClick={logout}
              >
                Sair
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            backgroundColor: mode === 'light' 
              ? muiTheme.palette.primary.main
              : muiTheme.palette.primary.dark,
            color: muiTheme.palette.primary.contrastText
          }
        }}
      >
        <Box onClick={toggleDrawer} sx={{ width: 250 }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrandLogo />
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          <List>
            {navItems.map((item) => (
              <ListItem 
                key={item.text} 
                component={item.path ? Link : 'button'} 
                to={item.path} 
                onClick={item.onClick}
                sx={{ 
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem 
              button 
              onClick={toggleColorMode}
              sx={{ 
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </ListItemIcon>
              <ListItemText primary={mode === 'light' ? 'Modo Escuro' : 'Modo Claro'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Paper 
        component="footer" 
        square 
        elevation={0}
        sx={{ 
          py: 3, 
          mt: 'auto',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          borderTop: '1px solid',
          borderColor: mode === 'light' 
            ? 'rgba(226, 232, 240, 0.8)'
            : 'rgba(30, 41, 59, 0.8)',
        }}
      >
        <Container>
          <Box 
            component="img"
            src="/desenvolver-coworking-logo.svg"
            alt="Desenvolver Coworking"
            sx={{ 
              height: '48px',
              display: 'block',
              margin: '0 auto',
              mb: 2,
              filter: mode === 'light' ? 'brightness(0)' : 'brightness(0) invert(0.7)',
              opacity: 0.7
            }}
          />
          <Box 
            sx={{ 
              textAlign: 'center',
              color: mode === 'light' ? 'text.secondary' : 'text.disabled'
            }}
          >
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Layout;