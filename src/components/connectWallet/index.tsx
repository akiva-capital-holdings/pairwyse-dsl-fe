import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    // createInstance,
      connectWallet } from '../../utils/helpers';
import {connect, selectSession} from '../../redux/sessionReducer'
import '../home/index.css'
import './index.css'


const ConnectWallet = () => {
 const dispatch = useDispatch();
 const { onboarding
        //  provider 
   } = useSelector(selectSession);

 return  <div className="connectForm">
   <div  className="title">Please connect your wallet</div>
     <button className="btn" onClick={() => connectWallet(onboarding, dispatch, connect)}>
         connectWallet
     </button>
     <button className="btnSecondary">
         cancel
     </button>
     {/* <div style={{
       marginRight: 'auto', 
       marginBottom: '30px', 
       marginTop: '30px',
       display: 'flex',
       alignItems: 'center'
       }}>
         <button  className='btn' onClick={() => getX()}>get x:</button>
         {xValue && <div style={{marginLeft: '20px'}}>{xValue}</div>}
     </div>
     <div style={{
       display: 'flex', 
       marginBottom: '20px', 
       flexDirection: 'row-reverse', 
       justifyContent: 'flex-end'
       }}>
         <input  
         onChange={(e) => setIncrementNumber(e.target.value)}
         type='number' placeholder='Enter number'/>
       <button 
       style={{marginRight: '10px'}}
       className='btn' 
       disabled={!incrementNumber} 
       onClick={conectContract}>incrementBy</button>
     </div> */}
 </div>
}

export default ConnectWallet;