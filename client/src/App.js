import React, { useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import { useSelector, useDispatch } from 'react-redux';
import { addToken } from './Reducers/AuthReducer'
import Blog from './components/Blog';



function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(addToken())
  }, [])
 

  const Token = useSelector(state => state.user.token)
  return (

    <div className="App">
      {
        Token ? <Blog /> : <Auth />
      }



    </div>
  );
}

export default App;
