import * as React from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";

export default function AddTransactionModal() {
  const [open, setOpen] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [transactionDate, setTransactionDate] = React.useState(
    dayjs(new Date())
  );
  const [selectCustomerId, setSelectCustomerId] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  const [amountError, setAmountError] = React.useState(false);
  const [customerError, setCustomerError] = React.useState(false);

  const handleClickOpen = () => {
    const url = `${process.env.REACT_APP_API_URL}/customer/api/v1/getAll`;

    axios({
      url: url,
      method: "GET",
    })
      .then((res) => res.data)
      .then((data) => {
        setCustomers(data.data.ent.customers);
        setOpen(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const inputCheck = () => {
    let check = true;

    if(amount === '') {
      setAmountError(true);
      check = check & false;
    }
    if(selectCustomerId === '') {
      setCustomerError(true);
      check = check & false;
    }
    return check;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if(!inputCheck()) return;

    const req = {
      transactionTime: dayjs(transactionDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      ),
      amount: amount,
      customerId: selectCustomerId,
    };
    axios({
      url: `${process.env.REACT_APP_API_URL}/transaction/api/v1/add`,
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
        setAmount(0);
        setOpen(false);
      });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Transaction
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add New Transaction"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  label="Customer"
                  value={selectCustomerId}
                  onChange={(event) => {
                    setSelectCustomerId(event.target.value)
                    if(event.target.value === '') setCustomerError(true)
                    else setCustomerError(false)
                  }}
                  error={customerError}
                >
                  {customers.map((customer, idx) => (
                    <MenuItem key={`customer-${idx}`} value={customer.customerId}>
                      {customer.customerFirstName} {customer.customerLastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <TextField
                id="transaction-amount"
                label="Amount"
                type="number"
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (e.target.value === "") setAmountError(true);
                  else setAmountError(false);
                }}
                defaultValue={0}
                error={amountError}
                helperText={amountError ? "Amount is required" : ""}
              />
            </div>
            
            <div>
              <DatePicker
                defaultValue={dayjs(new Date())}
                value={transactionDate}
                onChange={(newValue) => setTransactionDate(newValue)}
                label="Transaction Date"
              />
            </div>
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
