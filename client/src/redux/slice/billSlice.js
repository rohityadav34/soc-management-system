import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  bills: [],
  loading: false,
  error: null,
  message: null,
};

// Fetch all bills
export const fetchBills = createAsyncThunk(
  'bill/fetchBills',
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bills`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Generate a bill (Admin)
export const createBill = createAsyncThunk(
  'bill/createBill',
  async (billData, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bills`,
        billData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Pay a bill (Resident)
export const payBill = createAsyncThunk(
  'bill/payBill',
  async (id, thunkApi) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bills/${id}/pay`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a bill (Admin)
export const deleteBill = createAsyncThunk(
  'bill/deleteBill',
  async (id, thunkApi) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/bills/${id}`,
        { withCredentials: true }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    clearBillError: (state) => {
      state.error = null;
    },
    clearBillMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload.data;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Bill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.unshift(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay Bill
      .addCase(payBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(payBill.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bills.findIndex((b) => b._id === action.payload.data._id);
        if (index !== -1) {
          state.bills[index] = action.payload.data;
        }
        state.message = action.payload.message;
      })
      .addCase(payBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Bill
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter((b) => b._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBillError, clearBillMessage } = billSlice.actions;
export default billSlice.reducer;
