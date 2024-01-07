import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Slide from '@mui/material/Slide';

import "./Alert.css";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const DescriptionAlerts = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    props.setMessage("");
  };
  const vertical = "bottom";
  const horizontal = "right"; 
  return (
    <Box sx={{ width: "30%" }} className="alert">
      <Snackbar
        open={open || !!props.message}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity={props.type.toLowerCase()}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                props.setMessage("");
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>{props.message}</AlertTitle>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DescriptionAlerts;
