import React, {useState} from 'react';
import {Button} from 'antd'
import { useNavigate } from 'react-router-dom';
import {ReactComponent as Delete} from '../../../images/delete.svg'

const mock = [
    {title: 'Definition', value: 'Borrower', id: 1},
    {title: 'Agreement', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2}
]
const DefinitionRequest = () => {
    const [spetification, setSpetification] = useState(mock);
    const navigate = useNavigate();

    return <div className='definitionRequest'>
    <div className='title'>DefinitionRequest</div>
    <div style={{marginTop: '24px'}} className='text'>Requestor</div>
    <div
      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} 
      className='value'>0x7ac91528cf82aeca5c15efbc168de7
    </div>
    <div style={{marginTop: '24px'}} className='text'>Agreement </div>
    <div className='lander'>0x25eca5c18cf82a5ef7ac91bc168de7</div>
    <div className='spetification'>
      {spetification.map((el) => {
          return <div className='spetificationImput' key={el.id}>
          <div style={{marginTop: '24px'}} className='text'>{el.title} </div>
          <div className='lander'>{el.value}</div>
          <button 
          onClick={() => setSpetification(spetification.filter((s) => s.id !== el.id))}
          className='del'><Delete/></button>
          </div>
      })}
       <button className='add' onClick={() => setSpetification([...spetification, 
          {title: 'Agreement', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 }])}
          >Add Specification </button>
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

export default DefinitionRequest