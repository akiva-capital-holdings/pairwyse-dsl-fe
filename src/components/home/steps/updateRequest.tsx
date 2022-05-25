/* eslint-disable max-len */
import React, {useState} from 'react';
import { Button, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {ReactComponent as Delete} from '../../../images/delete.svg'

const mock = [
    {title: 'Condition 1', value: '((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))', id: 1},
    {title: 'Condition 2', value: '((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))', id: 2},
]

const UpdateRequest = () => {
 const [condition, setCondition] = useState(mock);
 const [value, setValue] = useState('Lending agreement with capital stack');
 const [transaction, setTransaction] = useState(true);

 const menu = (
    <Menu className='menu'>
      <Menu.Item key="0">
        <button onClick={() => setValue('Lending agreement with capital stack')} type="button">
         Lender account  <span className='text'>0x5ef78de7ac91bc1625eca5c18cf82a</span>
        </button>
      </Menu.Item>
      <Menu.Item key="1">
        <button onClick={() => setValue('Lending')} type="button">
        Lending
        </button>
      </Menu.Item>
      <Menu.Item key="2">
        <button onClick={() => setValue('Lending agreement')} type="button">
        Lending agreement
        </button>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

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
      className='value'>Lender account
        <div className='text'>0x7ac91528cf82aeca5c15efbc168de7</div>
    </div>
    <Dropdown overlay={menu}>
        <Button>
            <Space>
              {value}
              <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
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
   {transaction &&  <div className='spetificationImput'>
          <div style={{marginTop: '24px'}} className='text'>Transaction 1</div>
          <div className='lander'>CLAIM BORROWER COLLATERALUPTO (PRINCIPAL + INTEREST - PAYMENTS)</div>
          <button 
          onClick={() => setTransaction(false)}
          className='del'><Delete/></button>
    </div>}
     <div className='btnsContainer'>
       <Button style={{height: '48px'}} htmlType="button" className="btn">
        Request Approval
        </Button>
        <Button
         htmlType="button" className="cancel">
        Cancel
        </Button>
    </div>
    </div>
}

export default UpdateRequest