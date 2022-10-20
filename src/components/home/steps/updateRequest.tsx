import { useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { Contract } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Delete } from '../../../images/delete.svg';
import { ReactComponent as Cloose } from '../../../images/close.svg';
import getRule from '../../../utils/validate';

const { Item } = Form;

interface Update{
  setUpdateRequest:React.Dispatch<React.SetStateAction<{
    hash: string;
    submit: boolean;
    error: boolean;
    message: string;
}>>;
  setSignatories:React.Dispatch<React.SetStateAction<{
    title: string;
    value: string;
    id: number;
}[]>>;
  setRecord:React.Dispatch<React.SetStateAction<string>>;
  setConditions:React.Dispatch<React.SetStateAction<{
    title: string;
    value: string;
    id: number;
}[]>>;
  setAgreement:React.Dispatch<React.SetStateAction<string>>;
  record:string;
  signatories:{
    title: string;
    value: string;
    id: number;
}[];
  conditions:{
    title: string;
    value: string;
    id: number;
  }[];
  setLoading:React.Dispatch<React.SetStateAction<boolean>>;
  setNumbers:React.Dispatch<React.SetStateAction<number[]>>;
  agreement:string;
  setDslID:React.Dispatch<React.SetStateAction<string>>;
  numbers: number[];
  loading:boolean;
  dslId:string;
}

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
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [valueRequiredRecords, setValueRequiredRecords] = useState<number>();
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

  const addSteps = async (
    agreementContract: Contract,
    agreementAddr: string,
    contextFactory: Contract,
    steps: RecordObject[]
  ) => {
    setLoading(true);
    try {
      for await (const step of steps) {
        await contextFactory.methods.deployContext(agreementAddr).send({ from: userWallet });
        let contextsLen = parseInt(
          await contextFactory.methods.getDeployedContextsLen().call(),
          10
        );
        const recordContextAddr = await contextFactory.methods
          .deployedContexts(contextsLen - 1)
          .call();
        const conditionsContextAddrs = [];
        for (let j = 0; j < step.conditions.length; j++) {
          await contextFactory.methods.deployContext(agreementAddr).send({ from: userWallet });
          contextsLen = parseInt(await contextFactory.methods.getDeployedContextsLen().call(), 10);
          const conditionContextAddr = await contextFactory.methods
            .deployedContexts(contextsLen - 1)
            .call();
          conditionsContextAddrs.push(conditionContextAddr);
          await agreementContract.methods
            .parse(step.conditions[j], conditionContextAddr, process.env.REACT_APP_PREPROCESSOR)
            .send({ from: userWallet });
          console.log(
            `\n\taddress: \x1b[35m${conditionContextAddr}\x1b[0m\n\tcondition ${
              j + 1
            }:\n\t\x1b[33m${step.conditions[j]}\x1b[0m`
          );
        }

        console.log({
          rd: step.record,
          recordContextAddr,
          preprocessor: process.env.REACT_APP_PREPROCESSOR,
        });
        await agreementContract.methods
          .parse(step.record, recordContextAddr, process.env.REACT_APP_PREPROCESSOR)
          .send({ from: userWallet });
        const agrUpdate = await agreementContract.methods
          .update(
            step.recordId,
            step.requiredRecords,
            step.signatories,
            step.record,
            step.conditions,
            recordContextAddr,
            conditionsContextAddrs
          )
          .send({ from: userWallet });
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

  const updateAgreement = async () => {
    try {
      // Input data
      const DSL_ID = parseInt(dslId, 10);
      const AGREEMENT_ADDR = agreement;
      const SIGNATORY = signatories[0].value;
      const CONDITION = conditions[0].value;
      const RECORD = record;

      const agreementContract = createInstance('Agreement', AGREEMENT_ADDR, provider);

      const contextFactory = createInstance(
        'ContextFactory',
        process.env.REACT_APP_CONTEXT_FACTORY,
        provider
      );
      // const numId = numbers?.map((el) => el?.value);
      await addSteps(agreementContract, AGREEMENT_ADDR, contextFactory, [
        {
          recordId: DSL_ID,
          // requiredRecords: [...numId],
          requiredRecords: [...numbers],
          signatories: [SIGNATORY],
          conditions: [CONDITION],
          record: RECORD,
        },
      ]);
      // console.log(rdsAddr, crddeployedLen);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // .then((v) => setNumbers([...numbers, { value: +valueRequiredRecords, id: uuidv4() }]))
      .then(() => setNumbers([...numbers, +valueRequiredRecords]))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((err) => setErrorRequiredRecords(true));
  };

  const validateRecordId = () => {
    if (numbers?.length === 0) {
      setErrorRequiredRecords(true);
    } else {
      setValueRequiredRecords(numbers[numbers.length - 1]);
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
            {userWallet}
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
            rules={
              // numbers?.length === 0 && valueRequiredRecords?.toString() === ''?
                 getRule('requiredRecords', 'record-value', valueRequiredRecords?.toString())
                // : getRule('requiredRecords', 'requiredRecords', valueRequiredRecords?.toString())
            }
            style={{ marginBottom: '8px' }}
          >
            <Input
              className={'lender'}
              placeholder="Type record number here"
              onChange={(e) => {
                if (numbers?.length !== 0 && e?.target?.value === '') {
                  setValueRequiredRecords(Number(e?.target?.value));
                } else {
                  form
                    .validateFields(['requiredRecords'])
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .then((v) => setErrorRequiredRecords(false))
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .catch((err) => setErrorRequiredRecords(true));
                  setValueRequiredRecords(Number(e?.target?.value));
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
            {numbers?.map((el,elId) => {
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
