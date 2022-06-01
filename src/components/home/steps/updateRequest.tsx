/* eslint-disable max-len */
import React, {useState} from 'react';
import { Button,
   } from 'antd';
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {selectSession} from '../../../redux/sessionReducer'
import {ReactComponent as Delete} from '../../../images/delete.svg'

const mock = [
    {title: 'Condition 1', value: '((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))', id: 1},
    {title: 'Condition 2', value: '((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))', id: 2},
]

const mockSignatories = [
  {title: 'signatories', value: '0x5ef78de7ac91bc1625eca5c18cf82a', id: 1},
]
const UpdateRequest = () => {
 const {address} = useSelector(selectSession)
 const [condition, setCondition] = useState(mock);
 const [signatories, setSignatories] = useState(mockSignatories);
 const navigate = useNavigate();

    return <div className='updateRequest'>
    <div className='title'>Update Request </div>
    <div style={{marginTop: '24px'}} className='text'>Requestor</div>
    <div
      style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '24px'
        }} 
      className='value'>{address}
    </div>
    <div className='spetification'>
      {condition.map((el) => {
          return <div className='spetificationImput' key={el.id}>
          <div style={{marginTop: '24px'}} className='text'>{el.title} </div>
          <div className='lander'>{el.value}</div>
          <button 
          onClick={() => setCondition(condition.filter((s) => s.id !== el.id))}
          className='del'><Delete/></button>
          </div>
      })}
       <button className='add' onClick={() => setCondition([...condition, 
          {title: 'Agreement', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 }])}
          >Add Condition</button>
    </div>
    <div>
    {signatories.map((el) => {
          return <div className='spetificationImput' key={el.id}>
          <div style={{marginTop: '24px'}} className='text'>{el.title} </div>
          <div className='lander'>{el.value}</div>
          <button 
          onClick={() => setCondition(signatories.filter((s) => s.id !== el.id))}
          className='del'><Delete/></button>
          </div>
      })}
       <button className='add' onClick={() => setSignatories([...signatories, 
          {title: 'Signatory 2', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 }])}
          >Add Signatory</button>
    </div>
    <div className='spetificationImput'>
          <div style={{marginTop: '24px'}} className='text'>Transaction 1</div>
          <div className='lander'>CLAIM BORROWER COLLATERALUPTO (PRINCIPAL + INTEREST - PAYMENTS)</div>
    </div>
     <div className='btnsContainer'>
       <Button style={{height: '48px'}} htmlType="button" className="btn">
         Request Approval
        </Button>
        <Button
         onClick={() => navigate('/')}
         htmlType="button" className="cancel">
         Cancel
        </Button>
    </div>
    </div>
}

export default UpdateRequest