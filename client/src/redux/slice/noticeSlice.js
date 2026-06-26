import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  notices: [],
  loading: false,
  error: null,
  message: null,
};

// Fetch all notices
export const fetchNotices = createAsyncThunk(
  'notice/fetchNotices',
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notices`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a notice
export const createNotice = createAsyncThunk(
  'notice/createNotice',
  async (noticeData, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notices`,
        noticeData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a notice
export const deleteNotice = createAsyncThunk(
  'notice/deleteNotice',
  async (id, thunkApi) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/notices/${id}`,
        { withCredentials: true }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    clearNoticeError: (state) => {
      state.error = null;
    },
    clearNoticeMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.data;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Notice
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices.unshift(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Notice
      .addCase(deleteNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = state.notices.filter((n) => n._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNoticeError, clearNoticeMessage } = noticeSlice.actions;
export default noticeSlice.reducer;
