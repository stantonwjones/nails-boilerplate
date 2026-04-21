import { Link, Outlet, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from "@mui/material/Container";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Layout() {

  let navigate = useNavigate();
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h5"
            component="div"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Nails App
          </Typography>
          <Stack spacing={2} direction="row"
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "end",
            }}>
            <Typography variant="subtitle1" component="div" >
              User
            </Typography>
            <IconButton onClick={signOut}>
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <footer>
        <BottomNavigation
          showLabels
          onChange={(event, newValue) => {
            navigate(`/${newValue}`);
          }}
        >
          <BottomNavigationAction value="" label="Home" icon={<HomeOutlinedIcon />} />
          <BottomNavigationAction value="readme" label="ReadMe" icon={<MenuBookIcon />} />
          <BottomNavigationAction value="about" label="About Nails" icon={<InfoIcon />} />
        </BottomNavigation>
      </footer>
    </>
  );
}

function signOut() {
  alert("Signing out");
}