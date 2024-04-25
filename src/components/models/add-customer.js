import * as React from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddCustomerModal() {
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [fnError, setFnError] = React.useState(false);
  const [lnError, setLnError] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if(!inputCheck()) return;

    const req = {
      'customerFirstName': firstName,
      'customerLastName': lastName
    }
    
    axios({
      url: `${process.env.REACT_APP_API_URL}/customer/api/v1/add`,
      method: "POST",
      data: req
    })
      .then((res) => {
        console.log(res);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setFirstName('');
        setLastName('');
        setOpen(false);
      });
  };

  const inputCheck = () => {
    let check = true;

    if(firstName === '') {
      setFnError(true);
      check = check & false;
    }
    if(lastName === '') {
      setLnError(true);
      check = check & false;
    }
    return check;
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Customer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">{"Add New Customer"}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField style={{ marginRight: 12 }} label="First Name" variant="outlined"
              error={fnError}
              helperText={fnError ? 'First Name is required' : ''}
              onInput={(e) => {
                setFirstName(e.target.value)
                if(e.target.value === '') setFnError(true)
                else setFnError(false)
              }}
            />
            <TextField label="Last Name" variant="outlined" 
              error={lnError}
              helperText={lnError ? 'Last Name is required' : ''}
              onInput={(e) => {
                setLastName(e.target.value)
                if(e.target.value === '') setLnError(true)
                else setLnError(false)
              }} 
              
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
