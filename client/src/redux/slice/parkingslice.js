import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  parkings: [],
  loading: false,
  error: null,
  message: null,
};

// ====================
// GET ALL PARKINGS
// ====================

export const fetchParkings = createAsyncThunk(
  "parking/fetchParkings",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/parking`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ====================
// CREATE PARKING
// ====================

export const createParking = createAsyncThunk(
  "parking/createParking",
  async (parkingData, thunkApi) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/parking`,
        parkingData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ====================
// UPDATE PARKING
// ====================

export const updateParking = createAsyncThunk(
  "parking/updateParking",
  async ({ id, parkingData }, thunkApi) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/parking/${id}`,
        parkingData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ====================
// DELETE PARKING
// ====================

export const deleteParking = createAsyncThunk(
  "parking/deleteParking",
  async (id, thunkApi) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/parking/${id}`,
        {
          withCredentials: true,
        }
      );

      return {
        id,
        message: response.data.message,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ====================
// SLICE
// ====================

const parkingSlice = createSlice({
  name: "parking",
  initialState,

  reducers: {
    clearParkingError: (state) => {
      state.error = null;
    },

    clearParkingMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ====================
      // FETCH PARKINGS
      // ====================

      .addCase(fetchParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchParkings.fulfilled,
        (state, action) => {
          state.loading = false;
          state.parkings =
            action.payload.data;
        }
      )

      .addCase(
        fetchParkings.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ====================
      // CREATE PARKING
      // ====================

      .addCase(createParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createParking.fulfilled,
        (state, action) => {
          state.loading = false;

          state.parkings.unshift(
            action.payload.data
          );

          state.message =
            action.payload.message;
        }
      )

      .addCase(
        createParking.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ====================
      // UPDATE PARKING
      // ====================

      .addCase(updateParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        updateParking.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.parkings.findIndex(
              (parking) =>
                parking._id ===
                action.payload.data._id
            );

          if (index !== -1) {
            state.parkings[index] =
              action.payload.data;
          }

          state.message =
            action.payload.message;
        }
      )

      .addCase(
        updateParking.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ====================
      // DELETE PARKING
      // ====================

      .addCase(deleteParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        deleteParking.fulfilled,
        (state, action) => {
          state.loading = false;

          state.parkings =
            state.parkings.filter(
              (parking) =>
                parking._id !== action.payload.id
            );

          state.message =
            action.payload.message;
        }
      )

      .addCase(
        deleteParking.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearParkingError,
  clearParkingMessage,
} = parkingSlice.actions;

export default parkingSlice.reducer;