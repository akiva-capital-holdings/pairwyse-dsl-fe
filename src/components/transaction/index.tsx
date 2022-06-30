/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Table, Empty, notification, Layout, Menu, Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useSelector } from 'react-redux';
import { selectSession } from '../../redux/sessionReducer';
import { ReactComponent as Copy } from '../../images/copy.svg';
import { ReactComponent as CopyWhite } from '../../images/coppyWhite.svg';
import './index.css';

const { Search } = Input;

interface MockType {
  date: string;
  txID: string;
  agreementAddress: string;
  txOriginator: string;
  txType: string;
  txStatus: string;
}

const onCopyClick = (e) => {
  notification.info({
    message: 'Copied',
    icon: <Copy className="notificationIcon" />,
  });
  navigator.clipboard.writeText(`${e}`);
};

const { Content, Sider } = Layout;

const columns: ColumnsType<MockType> = [
  {
    title: 'Creation Date',
    key: 'date',
    dataIndex: 'date',
  },
  {
    title: 'Tx ID',
    dataIndex: 'txID',
    key: 'txID',
    render: (txID) => (
      <div className="status">
        <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{txID}</div>
        <Copy className='copy'  onClick={() => onCopyClick(txID)} />
      </div>
    ),
  },
  {
    title: 'Agreement Address',
    dataIndex: 'agreementAddress',
    key: 'agreementAddress',
    render: (agreementAddress) => (
      <div className="status">
        <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{agreementAddress}</div>
        <Copy className='copy'  onClick={() => onCopyClick(agreementAddress)} />
      </div>
    ),
  },
  {
    title: 'Tx Originator',
    key: 'txOriginator',
    dataIndex: 'txOriginator',
    render: (txOriginator) => (
      <div className="status">
        <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{txOriginator}</div>
        <Copy  className='copy' onClick={() => onCopyClick(txOriginator)} />
      </div>
    ),
  },
  {
    title: 'Tx Type',
    key: 'txType',
    dataIndex: 'txType',
  },
  {
    title: 'Tx Status',
    key: 'txStatus',
    dataIndex: 'txStatus',
  },
];

const mock = [
  {
    date: '11.03.2022',
    txID: '0x7ac8c...',
    agreementAddress: '0x7ac91528cf...',
    txOriginator: '0x25eca5c18c...',
    txType: 'Agreement Created',
    txStatus: 'Approval Requested',
  },
  {
    date: '12.03.2022',
    txID: '0x7ac9c...',
    agreementAddress: '1x7ac91528cf...',
    txOriginator: '0x20eca5c18c...',
    txType: 'Agreement',
    txStatus: 'Approval Requested',
  },
];
const Transaction = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions] = useState([mock]);
  const { address } = useSelector(selectSession);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '700px' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
        <div className="addressContainer">
          <div className="img" />
          <div style={{display: 'flex', maxWidth: '150px', margin: '0 auto'}}>
            <div className="address">
             {address}
            </div>
            <CopyWhite className='copy' onClick={() => onCopyClick(address)} />
          </div>
         
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} accessKey={'1'}>
          <Menu.Item key="1">Transactions</Menu.Item>
          <Menu.Item key="2">Payments</Menu.Item>
          <Menu.Item key="3">Users</Menu.Item>
          <Menu.Item key="4">Settings</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <div className="header">
          <div className="ahLeft">
            <span className="title">Transactions</span>
          </div>
          <div className="ahRight">
            <Search
              // onSearch={onSubmit}
              className="searchInput"
              // value={search}
              // onChange={(v: any) => setSearch(v?.target?.value)}
              placeholder="Search"
            />
          </div>
        </div>
        <Content style={{ display: 'block', margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {transactions?.length ? (
              <div className="userList">
                <Table dataSource={mock} columns={columns} rowKey="id" />
              </div>
            ) : (
              <Empty />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Transaction;
