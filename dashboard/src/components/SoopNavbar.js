import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { TbDragDrop } from "react-icons/tb";
import loadingSpinner from "../assets/images/loadingSpinner.svg";

const SoopNavbar = ({ isEditing, handleIsEditing, currentTab, handleCurrentTab, tabs }) => {
  const [state, setState] = useState({
    left: false,
  });

  const muiTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "rgba(255, 255, 255, 1)",
        contrastText: "#737373",
      },
    },
  });

  const toggleDrawer = (anchor, isOpen) => event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setState({ [anchor]: isOpen });
  };

  const sideBar = anchor => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {Array.isArray(tabs) &&
            tabs.map((tab, index) => (
              <ListItem key={tab.tabId} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleCurrentTab(index);
                  }}
                >
                  <div style={{ height: 36, display: "flex", alignItems: "center" }}>{tab.tabName}</div>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    );
  };

  const LoadingSpinner = () => <img src={loadingSpinner} />

  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <AppBar position="static" sx={{ mb: 2, boxShadow: "rgba(149, 157, 165, 0.2) 0px 3px 10px" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <RiMenuUnfoldFill />
            </IconButton>
            <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
              {sideBar("left")}
            </Drawer>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "Pretendard-Bold" }}>
              {Array.isArray(tabs) && tabs[currentTab] && tabs[currentTab].tabName}
            </Typography>

            {!isEditing ? (
              <IconButton
                onClick={() => {
                  handleIsEditing(true);
                }}
              >
                <TbDragDrop />
              </IconButton>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <LoadingSpinner />
                <IconButton
                  onClick={() => {
                    handleIsEditing(false);
                  }}
                >
                  <TbDragDrop color="navy" />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default SoopNavbar;
