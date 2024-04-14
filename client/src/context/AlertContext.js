import React, { createContext, useContext, useState } from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./AlertContext.css";
const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {open && (
        <div className="alert-container">
          <Alert
            severity={severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message}
          </Alert>
        </div>
      )}

      {children}
    </AlertContext.Provider>
  );
};
