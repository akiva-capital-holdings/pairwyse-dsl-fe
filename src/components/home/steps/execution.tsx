import { Button, Form, Menu, Dropdown, Space, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { selectSession } from '../../../redux/sessionReducer';
import getRule from '../../../utils/validate';

const { Item } = Form;

const ExecutionRequest = ({
  setExecitionValue,
  setAgreement,
  setTxValue,
  setLoading,
  agreement,
  setDslID,
  txValue,
  loading,
  dslId,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [ recordIds, setrecordIds] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const agreementContract = createInstance('Agreement', agreement, provider);
  const ExecutionSubmit = async () => {
    setLoading(true);
    try {
      const executeTx = await agreementContract.methods
        .execute(dslId)
        .send({ from: userWallet, value: txValue?.replace(/,/gi, '') });
      setExecitionValue({
        hash: executeTx.transactionHash,
        submit: true,
        error: false,
        message: '',
      });
    } catch (err) {
      console.error(err);
      setExecitionValue({ hash: '', submit: true, error: true, message: err?.message });
    }
    setLoading(false);
  };

  const GetActiveRecordIds = async () => {
    try {
      const array = await agreementContract.methods
        .getActiveRecords()
        .call();
      setrecordIds(array);
    } catch (err) {
      console.error(err);
    }
  };

  const menu = (
    <Menu className="menu">
      {recordIds.map((v, i) => {
       return <Menu.Item key={i}>
        <button
          onClick={() => {
            return setDslID(v);
          }}
              type="button"
              className="dropdownButton"
        >
          {v}
        </button>
      </Menu.Item>
     })}
      <Menu.Divider />
    </Menu>
  );

  const dropDown = () => {
    return (
      <Item name="agreementModel">
        {recordIds.length === 0 ? <div className="lander">You have not created any record</div> :
          <Dropdown className="dropdown" overlay={menu}>
            <Button>
              <Space>
                {dslId}
                <DownOutlined className="iconDropDown" />
              </Space>
            </Button>
          </Dropdown>}
      </Item>
    );
  };
  useEffect(() => {
    GetActiveRecordIds();
  }, []);

  return (
    <div className="updateRequest">
      <div className="title">Execution</div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
          form={form}
          autoComplete="off"
          onFinish={() => {
            return ExecutionSubmit();
          }}
        >
          <div className="text">Requestor</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
            className="value"
          >
            {userWallet}
          </div>
          <div style={{ marginTop: '24px' }} className="text">
            Agreement
          </div>
          <Item
            name="agreement"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', agreement)}
          >
            <Input
              className="lander"
              defaultValue={agreement}
              onChange={(e) => {
                return setAgreement(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            ID
          </div>
          {dropDown()}
          <div style={{ marginTop: '24px' }} className="text">
            Transaction Value (in Wei)
          </div>
          <Item
            name="transaction-value-in-wei"
            validateTrigger="onChange"
            rules={getRule('transaction-value-in-wei', 'transaction-value-in-wei', txValue)}
          >
            <Input
              className={'ant-input lander'}
              onChange={(e) => {
                form
                  .validateFields(['transaction-value-in-wei'])
                  .then(() => {
                    const valueАormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                      /(.)(?=(\d{3})+$)/g,
                      '$1,'
                    );
                    form.setFieldsValue({
                      'transaction-value-in-wei': valueАormatting,
                    });
                  });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                setTxValue(e?.target?.value.replace(/[\s.,%]/g, ''));
              }}
            />
          </Item>
          <div className="btnsContainer">
            <Button disabled={recordIds.length===0} style={{ height: '48px' }} htmlType="submit" className="btn">
              Execute
            </Button>
            <Button
              onClick={() => {
                return navigate('/');
              }}
              htmlType="button"
              className="cancel"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default ExecutionRequest;
