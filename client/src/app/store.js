import { configureStore } from '@reduxjs/toolkit';
import reducerSlice from '../Reducers/AuthReducer';
import BlogReducers from '../Reducers/BlogReducers';


export const store = configureStore({
  reducer: {
    user: reducerSlice,
    todos: BlogReducers
  },
});
