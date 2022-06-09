/* eslint-disable arrow-body-style */
import React from 'react'
import {useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { selectSession } from '../../redux/sessionReducer';
import './index.css'

const Header = () => {
 const {address} = useSelector(selectSession);
 const navigate = useNavigate();

 return <div className='headerContainer'>
    <div onClick={() => navigate('/')} className='logo'>Logo</div>
    {address &&  
    <button 
        onClick={() => navigate('/create-agreement')} 
        className='btn' 
        type='button'>
         Create Agreement
    </button>}
    </div>
}


export default Header