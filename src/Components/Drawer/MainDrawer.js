import React from 'react';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { useMediaQuery } from 'react-responsive';

function MainDrawer({ children, drawerOpen, closeDrawer }) {
  const isMobile = useMediaQuery({ maxWidth: 767 }); 
  const drawerWidth = isMobile ? '100%' : '50%'; 

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      level={null}
      handler={false}
      placement="right"
      width={drawerWidth}
    >
      {children}
    </Drawer>
  );
}

export default MainDrawer;