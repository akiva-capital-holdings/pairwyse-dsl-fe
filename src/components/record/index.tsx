import React, { useState } from 'react';
import { Table, Empty, notification, Layout, Menu, Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useSelector } from 'react-redux';
import Header from 'components/header';
import { shortenedAddress } from '../../utils/helpers';
import { selectSession } from '../../redux/sessionReducer';
import { ReactComponent as Copy } from '../../images/copy.svg';
import { ReactComponent as CopyWhite } from '../../images/coppyWhite.svg';
import './index.css';

const { Search } = Input;

interface MockType {
  date: string;
  rdID: string;
  agreementAddress: string;
  rdOriginator: string;
  rdType: string;
  rdStatus: string;
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
    title: 'Rd ID',
    dataIndex: 'rdID',
    key: 'rdID',
    render: (rdID) => {
      return (
        <div className="status">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{rdID}</div>
          <Copy
            className="copy"
            onClick={() => {
              return onCopyClick(rdID);
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
    title: 'Rd Originator',
    key: 'rdOriginator',
    dataIndex: 'rdOriginator',
    render: (rdOriginator) => {
      return (
        <div className="status">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hiden' }}>{rdOriginator}</div>
          <Copy
            className="copy"
            onClick={() => {
              return onCopyClick(rdOriginator);
            }}
          />
        </div>
      );
    },
  },
  {
    title: 'Rd Type',
    key: 'rdType',
    dataIndex: 'rdType',
  },
  {
    title: 'Rd Status',
    key: 'rdStatus',
    dataIndex: 'rdStatus',
  },
];

const mock = [
  {
    date: '11.03.2022',
    rdID: '0x7ac8c...',
    agreementAddress: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    rdOriginator: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    rdType: 'Agreement Created',
    rdStatus: 'Approval Requested',
  },
  {
    date: '12.03.2022',
    rdID: '0x7ac9c...',
    agreementAddress: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    rdOriginator: shortenedAddress('0x976EA74026E726554dB657fA54763abd0C3a0aa9'),
    rdType: 'Agreement',
    rdStatus: 'Approval Requested',
  },
];
const Record = () => {
  const [records, setRecords] = useState([mock]);
  const { address } = useSelector(selectSession);
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
              <div className="address">{shortenedAddress(address)}</div>
              <CopyWhite
                className="copy"
                onClick={() => {
                  return onCopyClick(address);
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
