import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, deleteBlog, fetchBlog } from '../Reducers/BlogReducers'
import {logout} from '../Reducers/AuthReducer'

function Blog() {
    const [myBlog, setBlog] = useState('')
    const dispatch = useDispatch()
    const Blogs = useSelector(state => state.Blogs)
    const AddBlog = () => {
        dispatch(createBlog({ Blog: myBlog }))
    }
    useEffect(() => {
        dispatch(fetchBlog())
    }, [])
    return (
        <div>
            <input
                placeholder='Add Blog'
                value={myBlog}
                onChange={(e) => setBlog(e.target.value)}
            />

            <button className='btn #ff4081 pink accent-2' 
                onClick={() => AddBlog()}> Add Blog</button>

            <ul className="collection">
                {Blogs.map(item => {
                  return <li className="collection-item" key={item._id}
                  onClick = {()=>dispatch(deleteBlog(item._id))}>{item.Blog}</li>

                })
                }

            </ul>
            <button className='btn #ff4081 pink accent-2' 
            onClick={()=> dispatch(logout())}>logout</button>
        </div>
    )
}

export default Blog
