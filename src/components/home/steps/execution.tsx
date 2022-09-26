import { Button, Form, Input, Spin } from 'antd';
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
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const ExecutionSubmit = async () => {
    setLoading(true);
    try {
      const agreementContract = createInstance('Agreement', agreement, provider);
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

  return (
    <div className="updateRequest">
      <div className="title">Execution</div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
          form = {form}
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
          <Item name="dsl-id" validateTrigger="onBlur" rules={getRule('dsl-id', 'dsl-id', dslId)}>
            <Input
              className="lander"
              defaultValue={dslId}
              onChange={(e) => {
                form.validateFields(['dsl-id'])
                setDslID(e?.target?.value)
              }}
            />
          </Item>
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
                form.validateFields(['transaction-value-in-wei'])
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .then(v => {
                    const valueАormatting = String(e?.target?.value.replace(/,/gi, '')).replace(/(.)(?=(\d{3})+$)/g, '$1,');
                    form.setFieldsValue({
                      'transaction-value-in-wei': valueАormatting,
                  });
                  })
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                setTxValue(e?.target?.value.replace(/[\s.,%]/g, ''))
              }}
          />
          </Item>
          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
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
