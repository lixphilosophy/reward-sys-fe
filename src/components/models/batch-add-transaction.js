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

export default function BatchAddTransactionModal() {
  const [open, setOpen] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [transactions, setTransactions] = React.useState([createEmptyTransaction()]);

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

  const handleAddTransaction = () => {
    setTransactions([...transactions, createEmptyTransaction()]);
  };

  const handleRemoveTransaction = (index) => {
    setTransactions(transactions.filter((_, idx) => idx !== index));
  };

  const handleChange = (index, field, value) => {
    const newTransactions = [...transactions];
    newTransactions[index][field] = value;
    setTransactions(newTransactions);
  };

  function createEmptyTransaction() {
    return { customerId: "", amount: 0, transactionDate: dayjs(new Date()) };
  }

  const handleSubmit = () => {

    const isValid = transactions.every(
      (t) => t.customerId && t.transactionDate
    );
    if (!isValid) {
      alert("Please complete all fields for all transactions.");
      return;
    }

    const transactionReq = transactions.map((t) => ({
      customerId: t.customerId,
      amount: Number(t.amount),
      transactionTime: t.transactionDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    }));

    const req = {
      "transactions": transactionReq,
    };

    console.log(req);

    axios
      .post(`${process.env.REACT_APP_API_URL}/transaction/api/v1/batch/add`, req)
      .then(() => {
        setOpen(false);
        setTransactions([createEmptyTransaction()]);
      })
      .catch((err) => {
        console.error("Failed to submit transactions", err);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Batch Add Transaction
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{ width: '90%', maxWidth: 'none' }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Batch Add Transaction"}
        </DialogTitle>
        <DialogContent>
          {transactions.map((transaction, index) => (
            <Box
              key={index}
              component="form"
              style={{
                display: "flex",
                flexDirection: "row",
              }}
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
                <FormControl style={{width: 250}} sx={{ m: 1 }}>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    value={transaction.customerId}
                    onChange={(e) =>
                      handleChange(index, "customerId", e.target.value)
                    }
                    label="Customer"
                  >
                    {customers.map((customer) => (
                      <MenuItem
                        key={customer.customerId}
                        value={customer.customerId}
                      >
                        {customer.customerFirstName} {customer.customerLastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Amount"
                  type="number"
                  value={transaction.amount}
                  onChange={(e) =>
                    handleChange(index, "amount", e.target.value)
                  }
                />
              <DatePicker
                label="Transaction Date"
                value={transaction.transactionDate}
                onChange={date => handleChange(index, 'transactionDate', date)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button onClick={() => handleRemoveTransaction(index)}>Remove</Button>
            </Box>
          ))}
          <Button onClick={handleAddTransaction}>
            Add Another Transaction
          </Button>
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
