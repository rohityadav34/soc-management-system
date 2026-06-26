import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authslice.js'
import roleReducer from './slice/roleSlice.js'
import flatReducer from './slice/flatSlice.js'
import userReducer from './slice/userSlice.js'
import complaintReducer from './slice/complaintSlice.js'
import noticeReducer from './slice/noticeSlice.js'
import billReducer from './slice/billSlice.js'
import visitorReducer from './slice/visitorSlice.js'
import parkingReducer from "./slice/parkingslice.js"


const store = configureStore({
    reducer : {
    auth : authReducer,
    role : roleReducer,
    flat : flatReducer,
    user : userReducer,
    complaint : complaintReducer,
    notice : noticeReducer,
    bill : billReducer,
    visitor : visitorReducer,
    parking :parkingReducer
    }
})


export default store;