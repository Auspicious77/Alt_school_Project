import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetch2, fetch3 } from "../helpers/fetch2";
const initialState = []

export const createBlog = createAsyncThunk(
    'createBlog', async(body)=>{
     const result = await fetch2('/createblog', body)
     return result
    }
)

export const fetchBlog = createAsyncThunk(
    'fetchBlog', async(body)=>{
     const result = await fetch3('/getblogs', body)
     return result
    }
)

export const deleteBlog = createAsyncThunk(
    'deleteBlog', async(id)=>{
     const result = await fetch3(`remove/${id}`, "delete")
     return result
    }
)

const BlogReducers = createSlice({
name: 'blog',
initialState, 
reducers: {},
extraReducers: (builder) => {
    builder.addCase(createBlog.fulfilled, (state, {payload:{message}}) => {
     if(message){
        state.push(message)
     }    
    })

    builder.addCase(fetchBlog.fulfilled, (state, {payload: {message}}) => {
        return message
    })

    builder.addCase(deleteBlog.fulfilled, (state, {payload: {message}}) => {
      const removeBlog =  state.filter(item => {
            return item._id !== message._id
        })

        return removeBlog
    })
}
})


export default BlogReducers.reducer