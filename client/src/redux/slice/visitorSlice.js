import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  visitors: [],
  loading: false,
  error: null,
  message: null,
};

// Fetch visitors logs
export const fetchVisitors = createAsyncThunk(
  'visitor/fetchVisitors',
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visitors`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Register a new visitor (Guard)
export const registerVisitor = createAsyncThunk(
  'visitor/registerVisitor',
  async (visitorData, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visitors`,
        visitorData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update status of visitor (Resident)
export const updateVisitorStatus = createAsyncThunk(
  'visitor/updateVisitorStatus',
  async ({ visitorId, action }, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visitors/status`,
        { visitorId, action },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const visitorSlice = createSlice({
  name: 'visitor',
  initialState,
  reducers: {
    clearVisitorError: (state) => {
      state.error = null;
    },
    clearVisitorMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Visitors
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.visitors = action.payload.data;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Visitor
      .addCase(registerVisitor.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerVisitor.fulfilled, (state, action) => {
        state.loading = false;
        state.visitors.unshift(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(registerVisitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateVisitorStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVisitorStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.visitors.findIndex((v) => v._id === action.payload.data._id);
        if (index !== -1) {
          state.visitors[index] = action.payload.data;
        }
        state.message = action.payload.message;
      })
      .addCase(updateVisitorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVisitorError, clearVisitorMessage } = visitorSlice.actions;
export default visitorSlice.reducer;
