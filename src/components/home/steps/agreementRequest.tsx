import React, {useState} from 'react';
import { Form, Button, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './index.css'

const AgreementRequest = () => {
    const [value, setValue] = useState('Lending agreement with capital stack');
    const menu = (
        <Menu className='menu'>
          <Menu.Item key="0">
            <button onClick={() => setValue('Lending agreement with capital stack')} type="button">
            Lending agreement with capital stack
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

  return <div className='agreementRequest'>
      <div className='title'>Agreement Request </div>
      <Form
      name="agreementRequestForm"
      autoComplete="off"
      className="auth-form"
    >
     <div className='text'>Agreement model </div>
     <Dropdown overlay={menu}>
        <Button>
            <Space>
              {value}
              <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
     <div style={{marginTop: '24px'}} className='text'>Agreement template</div>
     <div className='value'>0x7ac91528cf82aeca5c15efbc168de7</div>
     <div style={{marginTop: '24px'}} className='text'>Requestor</div>
     <div className='lander'>Lander</div>
     <div style={{marginTop: '24px'}} className='text'>Account</div>
     <div className='value'>0x5ef78de7ac91bc1625eca5c18cf82a</div>
     <div style={{marginTop: '24px'}} className='text'>Fee</div>
     <div className='value'> 0.00048385 ETH</div>
     <div className='btns'>
     <Button style={{height: '48px', marginRight: '16px'}} htmlType="button" className="btn">
       Create Agreement
     </Button>
     <Button htmlType="button" className="btnSecondary">
     Validate Contract
     </Button>
     </div>
    </Form>
  </div>
}

export default AgreementRequest