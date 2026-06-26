import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  complaints: [],
  complaint: null,
  loading: false,
  error: null,
  message: null,
};

// Fetch all complaints
export const fetchComplaints = createAsyncThunk(
  'complaint/fetchComplaints',
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/complaints`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a complaint
export const createComplaint = createAsyncThunk(
  'complaint/createComplaint',
  async (complaintData, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaints`,
        complaintData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a complaint status
export const updateComplaint = createAsyncThunk(
  'complaint/updateComplaint',
  async ({ id, status }, thunkApi) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/complaints/${id}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a complaint
export const deleteComplaint = createAsyncThunk(
  'complaint/deleteComplaint',
  async (id, thunkApi) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/complaints/${id}`,
        { withCredentials: true }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    clearComplaintError: (state) => {
      state.error = null;
    },
    clearComplaintMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Complaints
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.data;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Complaint
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.complaints.findIndex(
          (c) => c._id === action.payload.data._id
        );
        if (index !== -1) {
          state.complaints[index] = action.payload.data;
        }
        state.message = action.payload.message;
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Complaint
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = state.complaints.filter(
          (c) => c._id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComplaintError, clearComplaintMessage } = complaintSlice.actions;
export default complaintSlice.reducer;
