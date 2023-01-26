import { useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { createInstance, hex4Bytes, splitDSLString, getWei } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { Contract } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Delete } from '../../../images/delete.svg';
import { ReactComponent as Cloose } from '../../../images/close.svg';
import getRule from '../../../utils/validate';
import { Update } from '../../../types';

const { Item } = Form;

const UpdateRequest = ({
  setUpdateRequest,
  setSignatories,
  setRecord,
  setConditions,
  setAgreement,
  record,
  signatories,
  conditions,
  setLoading,
  setNumbers,
  agreement,
  setDslID,
  numbers,
  loading,
  dslId,
}: Update) => {
  const { account } = useMetaMask();
  const { utilsProvider } = useSelector(selectUtils);
  const [valueRequiredRecords, setValueRequiredRecords] = useState('');
  const [errorRequiredRecords, setErrorRequiredRecords] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  let hash = '';

  type RecordObject = {
    recordId: number;
    requiredRecords: (string | number)[];
    signatories: string[];
    conditions: string[];
    record: string;
  };

  const addSteps = async (agreementContract: Contract, steps: RecordObject[]) => {
    setLoading(true);
    try {
      do {
        await agreementContract.methods
          .parse(process.env.REACT_APP_PREPROCESSOR)
          .send({ from: account });
        console.log({
          parseFinished: await agreementContract.methods.parseFinished().call(),
        });
      } while ((await agreementContract.methods.parseFinished().call()) === false);

      for await (const step of steps) {
        const agrUpdate = await agreementContract.methods
          .update(
            step.recordId,
            step.requiredRecords,
            step.signatories,
            step.record,
            step.conditions
          )
          .send({ from: account });
        if (agrUpdate?.transactionHash) {
          hash = agrUpdate?.transactionHash;
        }
      }
      setUpdateRequest({ hash, submit: true, error: false, message: '' });
      setLoading(false);
    } catch (e) {
      console.error({ e });
      setUpdateRequest({ hash: '', submit: true, error: true, message: JSON.parse(e?.message) });
      setLoading(false);
    }
  };

  // If the record exists 'transferFrom' then auto-approve is activated
  const transferFromApprove = async (agreementContract: Contract, conditionOrRecord: string) => {
    const inputCode = splitDSLString(conditionOrRecord);
    const transferFromIndex = inputCode.indexOf('transferFrom');
    const isTransferFromPresentInInput = transferFromIndex !== -1;

    if (isTransferFromPresentInInput) {
      // Parse DSL input code and get the necessary variables
      const token = inputCode[transferFromIndex + 1];
      const from = inputCode[transferFromIndex + 2];
      const amount = getWei(inputCode[transferFromIndex + 4], setErrorRequiredRecords);

      const fromAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(from)).call();

      if (fromAddress.toLowerCase() === account.toLowerCase()) {
        const tokenAddress = await agreementContract.methods
          .getStorageAddress(hex4Bytes(token))
          .call();
        const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
        const currentAllowance = await tokenContract.methods
          .allowance(fromAddress, agreementContract._address)
          .call();

        if (currentAllowance < amount) {
          // Approve the Agreement to spend ERC20 tokens
          await tokenContract.methods
            .approve(agreementContract._address, amount)
            .send({ from: fromAddress });
        }
      }
    }
  };

  const updateAgreement = async () => {
    try {
      // Input data
      const DSL_ID = parseInt(dslId, 10);
      const AGREEMENT_ADDR = agreement;
      const SIGNATORIES = signatories.map((obj) => obj.value);
      const CONDITIONS = conditions.map((obj) => obj.value);
      const RECORD = record;
      const agreementContract = createInstance('Agreement', AGREEMENT_ADDR, utilsProvider);

      // Call ERC20.approve() if the conditions or the transaction contains a `trasnferFrom` DSL opcode
      CONDITIONS.forEach(async (value) => {
        await transferFromApprove(agreementContract, value);
      });
      await transferFromApprove(agreementContract, record);
      await addSteps(agreementContract, [
        {
          recordId: DSL_ID,
          requiredRecords: [...numbers],
          signatories: [...SIGNATORIES],
          conditions: [...CONDITIONS],
          record: RECORD,
        },
      ]);
    } catch (e) {
      console.error(e);
      setUpdateRequest({ hash: '', submit: true, error: true, message: e?.message });
      setLoading(false);
    }
  };

  const addRecord = () => {
    setErrorRequiredRecords(false);
    form
      .validateFields(['requiredRecords'])
      .then(() => setNumbers([...numbers, +valueRequiredRecords]))
      .catch(() => setErrorRequiredRecords(true));
  };

  const validateRecordId = () => {
    if (numbers?.length === 0) {
      setErrorRequiredRecords(true);
    } else {
      setValueRequiredRecords(numbers[numbers.length - 1].toString());
    }
  };
  return (
    <div className="updateRequest">
      <div className="title">Update Request </div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
          autoComplete="off"
          form={form}
          onFinish={() => {
            return updateAgreement();
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
            {account}
          </div>

          <div style={{ marginTop: '24px' }} className="text">
            ID
          </div>
          <Item name="dsl-id" validateTrigger="onBlur" rules={getRule('dsl-id', 'dsl-id', dslId)}>
            <Input
              className="lender"
              defaultValue={dslId}
              onChange={(e) => {
                return setDslID(e?.target?.value);
              }}
            />
          </Item>

          <div style={{ marginTop: '24px' }} className="text">
            Agreement
          </div>
          <Item
            name="agreement"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', agreement)}
          >
            <Input
              className="lender"
              defaultValue={agreement}
              onChange={(e) => {
                return setAgreement(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Required Records
          </div>
          <Item
            name="requiredRecords"
            validateTrigger="onChange"
            className="requiredRecords"
            rules={getRule('requiredRecords', 'record-value', valueRequiredRecords?.toString())}
            style={{ marginBottom: '8px' }}
          >
            <Input
              className={'lender'}
              placeholder="Type record number here"
              onChange={(e) => {
                if (numbers?.length !== 0 && e?.target?.value === '') {
                  setValueRequiredRecords(e?.target?.value);
                } else {
                  form
                    .validateFields(['requiredRecords'])
                    .then(() => setErrorRequiredRecords(false))
                    .catch(() => setErrorRequiredRecords(true));
                  setValueRequiredRecords(e?.target?.value);
                }
              }}
              value={valueRequiredRecords}
            />
            <button
              onClick={() => addRecord()}
              className="ant-btn ant-btn-default add btnRequiredRecords"
              type="button"
            >
              Add ID
            </button>
          </Item>
          <div
            className={errorRequiredRecords ? 'numRecordCoontainer error' : 'numRecordCoontainer'}
          >
            {numbers?.map((el, elId) => {
              return (
                <div key={elId} className="numRecord">
                  <div className="textNum">{el}</div>
                  <button
                    onClick={() => {
                      return setNumbers(
                        numbers.filter((s, sId) => {
                          return sId !== elId;
                        })
                      );
                    }}
                    className="btnNum"
                    type="button"
                  >
                    <Cloose />
                  </button>
                </div>
              );
            })}
          </div>
          {signatories.map((el) => {
            return (
              <div className="specificationInput" key={el.id}>
                {el?.id === 1 && (
                  <div style={{ marginTop: '24px' }} className="text">
                    Signatories
                  </div>
                )}
                <Item
                  name={`signatories${el.id}`}
                  validateTrigger="onBlur"
                  rules={getRule('signatories', 'signatories', el.value)}
                >
                  <Input
                    onChange={(e) => {
                      return setSignatories(
                        signatories?.map((c) => {
                          return c?.id === el?.id ? { ...c, value: e?.target?.value } : { ...c };
                        })
                      );
                    }}
                    className="lender"
                    defaultValue={el?.value}
                  />
                </Item>
                <Button
                  htmlType="button"
                  onClick={() => {
                    return setSignatories(
                      signatories.filter((s) => {
                        return s?.id !== el?.id;
                      })
                    );
                  }}
                  className="del"
                >
                  {el?.id !== 1 && <Delete />}
                </Button>
              </div>
            );
          })}
          <Button
            htmlType="button"
            className="add"
            onClick={() => {
              return setSignatories([
                ...signatories,
                { title: `Signatory ${signatories?.length}`, value: '', id: uuidv4() },
              ]);
            }}
          >
            Add Signatory
          </Button>
          <div className="specification">
            {conditions.map((el) => {
              return (
                <div className="specificationInput" key={el.id}>
                  {el?.id === 1 && (
                    <div style={{ marginTop: '24px' }} className="text">
                      Conditions
                    </div>
                  )}
                  <Item
                    name={`condition${el.id + 1}`}
                    validateTrigger="onBlur"
                    rules={getRule('condition', 'condition', el.value)}
                  >
                    <Input.TextArea
                      defaultValue={el.value}
                      onChange={(e) => {
                        return setConditions(
                          conditions?.map((c) => {
                            return c?.id === el?.id ? { ...c, value: e?.target.value } : { ...c };
                          })
                        );
                      }}
                      style={{ minHeight: '100px' }}
                      className="lender"
                    />
                  </Item>
                  <button
                    type="button"
                    onClick={() => {
                      return setConditions(
                        conditions.filter((s) => {
                          return s.id !== el.id;
                        })
                      );
                    }}
                    className="del"
                  >
                    {el?.id !== 1 && <Delete />}
                  </button>
                </div>
              );
            })}
            <Button
              className="add"
              htmlType="button"
              onClick={() => {
                return setConditions([
                  ...conditions,
                  { title: `Condition ${conditions?.length}`, value: '', id: uuidv4() },
                ]);
              }}
            >
              Add Condition
            </Button>
          </div>
          <div className="specificationInput">
            <div style={{ marginTop: '24px' }} className="text">
              Record
            </div>
            <Item
              name="record"
              validateTrigger="onBlur"
              rules={getRule('record', 'record', record)}
            >
              <Input.TextArea
                defaultValue={record}
                onChange={(e) => {
                  return setRecord(e.target.value);
                }}
                className="lender"
              />
            </Item>
          </div>
          <div className="btnsContainer">
            <Button
              disabled={loading}
              style={{ height: '48px' }}
              onClick={validateRecordId}
              htmlType="submit"
              className="btn"
            >
              Request Approval
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

export default UpdateRequest;
