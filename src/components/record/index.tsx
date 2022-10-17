import React, { useState } from 'react';
import { Table, Empty, notification, Layout, Menu, Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useMetaMask } from 'metamask-react';
import Header from 'components/header';
import { shortenedAddress } from '../../utils/helpers';
import { ReactComponent as Copy } from '../../images/copy.svg';
import { ReactComponent as CopyWhite } from '../../images/coppyWhite.svg';
import './index.css';

const { Search } = Input;

interface MockType {
  date: string;
  recordID: string;
  agreementAddress: string;
  recordOriginator: string;
  recordType: string;
  recordStatus: string;
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
    title: 'Record ID',
    dataIndex: 'recordID',
    key: 'recordID',
    render: (recordID) => {
      return (
        <div className="status">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{recordID}</div>
          <Copy
            className="copy"
            onClick={() => {
              return onCopyClick(recordID);
            }}
          />
        </div>
      );
    },
  },
  {
    title: 'Agreement Address',
    dataIndex: 'agreementAddress',
    key: 'agreementAddress',
    render: (agreementAddress) => {
      return (
        <div className="status">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{agreementAddress}</div>
          <Copy
            className="copy"
            onClick={() => {
              return onCopyClick(agreementAddress);
            }}
          />
        </div>
      );
    },
  },
  {
    title: 'Record Originator',
    key: 'recordOriginator',
    dataIndex: 'recordOriginator',
    render: (recordOriginator) => {
      return (
        <div className="status">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{recordOriginator}</div>
          <Copy
            className="copy"
            onClick={() => {
              return onCopyClick(recordOriginator);
            }}
          />
        </div>
      );
    },
  },
  {
    title: 'Record Type',
    key: 'recordType',
    dataIndex: 'recordType',
  },
  {
    title: 'Record Status',
    key: 'recordStatus',
    dataIndex: 'recordStatus',
  },
];

const mock = [
  {
    date: '11.03.2022',
    recordID: '0x7ac8c...',
    agreementAddress: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    recordOriginator: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    recordType: 'Agreement Created',
    recordStatus: 'Approval Requested',
  },
  {
    date: '12.03.2022',
    recordID: '0x7ac9c...',
    agreementAddress: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    recordOriginator: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    recordType: 'Agreement',
    recordStatus: 'Approval Requested',
  },
];
const Record = () => {
  const [records, setRecords] = useState([mock]);
  const { account } = useMetaMask();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Header
        onClick={() => {
          return setRecords([mock]);
        }}
      />
      <Layout style={{ minHeight: '700px' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => {
            return setCollapsed(!collapsed);
          }}
        >
          <div className="addressContainer">
            <div className="img" />
            <div style={{ display: 'flex', maxWidth: '150px', margin: '0 auto' }}>
              <div className="address">{shortenedAddress(account)}</div>
              <CopyWhite
                className="copy"
                onClick={() => {
                  return onCopyClick(account);
                }}
              />
            </div>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} accessKey={'1'}>
            <Menu.Item key="1">Records</Menu.Item>
            <Menu.Item key="2">Payments</Menu.Item>
            <Menu.Item key="3">Users</Menu.Item>
            <Menu.Item key="4">Settings</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <div className="header">
            <div className="ahLeft">
              <span className="title">Records</span>
            </div>
            <div className="ahRight">
              <Search className="searchInput" placeholder="Search" />
            </div>
          </div>
          <Content style={{ display: 'block', margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {records?.length ? (
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
    </>
  );
};

export default Record;
