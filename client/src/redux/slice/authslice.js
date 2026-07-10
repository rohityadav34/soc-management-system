import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

const initialState = {
  loading: false,
  message: null,
  isAuthenticated: Cookies.get('isAuthenticated') || null,
  name: Cookies.get('name') || null,
  email: Cookies.get('email') || null,
  role: Cookies.get('role') || null,
  error: null
};

export const login = createAsyncThunk(
  '/auth_login',
  async ({ formData }, thunkApi) => {
    try {
      console.log(formData);
      console.log(thunkApi);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      const token = res.data?.token;
      if (token) {
        Cookies.set('token', token);
      }

      const verifyRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        null,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(res.data);
      return { ...res.data, ...verifyRes.data, token };
    } catch (error) {
      console.log(error.response?.data);
      return thunkApi.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const setupInitialPassword = createAsyncThunk(
  '/auth_setupInitialPassword',
  async ({ email, tempPassword, newPassword }, thunkApi) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/setup-initial-password`,
        { email, tempPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      const token = res.data?.token;
      if (token) {
        Cookies.set('token', token);
      }

      const verifyRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        null,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return { ...res.data, ...verifyRes.data, token };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const Signout = createAsyncThunk('/auth_logout', async (_, thunkApi) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, null,
      {
        withCredentials: true,
      });
    return res.data
  } catch (error) {

  }
})

const authSlice = createSlice({
  initialState,
  name: 'auth',
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isAuthenticated = action.payload.authenticated;
        const { name, email, role, id } = action.payload.data;
        state.name = name;
        state.role = role;
        state.email = email;
        Cookies.set('name', name);
        Cookies.set('email', email);
        Cookies.set('id', id)
        Cookies.set('role', role);
        Cookies.set('isAuthenticated', action.payload.authenticated);
        if (action.payload.token) {
          Cookies.set('token', action.payload.token);
        }
        console.log(state.email, state.role, state.isAuthenticated, state.name);
        console.log(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(setupInitialPassword.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupInitialPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isAuthenticated = action.payload.authenticated;
        const { name, email, role, id } = action.payload.data;
        state.name = name;
        state.role = role;
        state.email = email;
        Cookies.set('name', name);
        Cookies.set('email', email);
        Cookies.set('id', id);
        Cookies.set('role', role);
        Cookies.set('isAuthenticated', action.payload.authenticated);
        if (action.payload.token) {
          Cookies.set('token', action.payload.token);
        }
      })
      .addCase(setupInitialPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password configuration failed";
      })
      .addCase(Signout.rejected, (state, action) => {
        state.loading = false
        console.log(action.payload);
      }).addCase(Signout.pending, (state, action) => {

      }).addCase(Signout.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isAuthenticated = action.payload.authenticated;
        Cookies.remove('isAuthenticated')
        state.name = null;
        state.email = null;
        state.role = null;

        Cookies.remove('name');
        Cookies.remove('email');
        Cookies.remove('role');
        Cookies.remove('token');
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;