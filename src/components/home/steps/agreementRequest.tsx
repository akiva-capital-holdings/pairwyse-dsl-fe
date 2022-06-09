/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React, {useState} from 'react';
import { Form, Button, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {createInstance} from '../../../utils/helpers'
import {selectUtils} from '../../../redux/utilsReducer';
import {selectSession} from '../../../redux/sessionReducer';
import './index.css';

const AgreementRequest = () => {
  const {address} = useSelector(selectSession);
  const {provider} = useSelector(selectUtils);
  const [value, setValue] = useState(' ');
  const [lender, setLender] = useState('');
  const navigate = useNavigate();

  const createAgreement = async () => {
    const membershipInstanceIto: any = await createInstance(
   `${process.env.REACT_APP_AGREEMENT_FACTORY}`,
    provider,
   );

   const get = await membershipInstanceIto.methods
     .deployAgreement(process.env.REACT_APP_PARSER).send({from: address});
   const getId = await membershipInstanceIto.methods
   console.log(get);
   console.log(getId);
  }
  
  const menu = (
      <Menu className='menu'>
        <Menu.Item key="0">
          <button 
            onClick={() => {return setValue('Lending agreement with capital stack')}} 
            type="button">
             Lending agreement with capital stack
          </button>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );

 return <div className='agreementRequest'>
      <div className='title'>Agreement Request </div>
      <Form
      name="agreementRequestForm"
      autoComplete="off"
      className="auth-form"
    >
     <div style={{marginTop: '24px'}} className='text'>Requestor</div>
     <div className='value'>{address}</div>
     <div style={{marginTop: '24px'}} className='text'>Requestor label</div>
     <input 
      className='lander' 
      placeholder='Lender' 
      value={lender}
      onChange={(e) => {return setLender(e?.target?.value)}}
     />
     <div style={{marginTop: '24px'}}  className='text'>Agreement model </div>
     <Dropdown overlay={menu}>
        <Button>
            <Space>
              {value}
              <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
     <div style={{marginTop: '24px'}} className='text'>Agreement template</div>
      <div className='value'>
        {value === ' ' ? '' : '0x0000000000000000000000000000000000000000'}
      </div>
     <div className='btns'>
     <div>
     <Button 
      onClick={createAgreement} 
      style={{height: '48px', marginRight: '16px'}} 
      htmlType="button" 
      className="btn"
     >
       Create Agreement
     </Button>
     <Button htmlType="button" className="btnSecondary">
      Validate Contract
     </Button>
     </div>
     <Button onClick={() => {return navigate('/')}} htmlType="button" className="cancel">
      Cancel
     </Button>
     </div>
    </Form>
  </div>
}

export default AgreementRequest