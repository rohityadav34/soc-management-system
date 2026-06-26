import React from 'react'
import { getResidentFlat } from '../redux/slice/flatSlice';
import { useDispatch } from 'react-redux';
;
import { useEffect } from 'react';
function MyFlat() {
const dispatch = useDispatch() ;
useEffect(()=>{
    dispatch(getResidentFlat())
},[]);


  return (
    <div>
      my flats details
    </div>
  )
}

export default MyFlat