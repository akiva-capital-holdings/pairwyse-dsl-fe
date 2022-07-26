import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { Contract } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Delete } from '../../../images/delete.svg';
import getRule from '../../../utils/validate';

const { Item } = Form;

const UpdateRequest = ({
  setUpdateRequest,
  setSignatories,
  setTransaction,
  setConditions,
  setAgreement,
  transaction,
  signatories,
  conditions,
  agreement,
  setDslID,
  dslId,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const navigate = useNavigate();
  let hash = '';

  type TxObject = {
    txId: number;
    requiredTxs: number[];
    signatories: string[];
    conditions: string[];
    transaction: string;
  };

  const addSteps = async (
    agreementContract: Contract,
    contextFactory: Contract,
    steps: TxObject[]
  ) => {
   try {
  for await (const step of steps) {
    await contextFactory.methods.deployContext().send({ from: userWallet });
    let contextsLen = parseInt(await contextFactory.methods.getDeployedContextsLen().call(), 10);
    const transactionContextAddr = await contextFactory.methods
      .deployedContexts(contextsLen - 1)
      .call();
    const conditionsContextAddrs = [];
    for (let j = 0; j < step.conditions.length; j++) {
      const deployCtxTx = await contextFactory.methods.deployContext().send({ from: userWallet });
      console.log({ deployCtxTx });
      contextsLen = parseInt(await contextFactory.methods.getDeployedContextsLen().call(), 10);
      const conditionContextAddr = await contextFactory.methods
        .deployedContexts(contextsLen - 1)
        .call();
      conditionsContextAddrs.push(conditionContextAddr);
      const agrParseTx = await agreementContract.methods
        .parse(step.conditions[j], conditionContextAddr)
        .send({ from: userWallet });
      console.log({ agrParseTx });
      console.log(
        `\n\taddress: \x1b[35m${conditionContextAddr}\x1b[0m\n\tcondition ${j + 1}:\n\t\x1b[33m${
          step.conditions[j]
        }\x1b[0m`
      );
    }

    await agreementContract.methods
      .parse(step.transaction, transactionContextAddr)
      .send({ from: userWallet });
    const agrUpdate = await agreementContract.methods
      .update(
        step.txId,
        step.requiredTxs,
        step.signatories,
        step.transaction,
        step.conditions,
        transactionContextAddr,
        conditionsContextAddrs
      )
      .send({ from: userWallet });
      if(agrUpdate?.transactionHash){
        hash = agrUpdate?.transactionHash
      }
  } 
  setUpdateRequest({hash,  submit: true, error: false, message: '',  })
} catch (e) {
  setUpdateRequest({hash: '', submit: true, error: true, message: JSON.parse(e?.message) })
  }
};

  const updateAgreement = async () => {
   try {
    // Input data
    const DSL_ID = parseInt(dslId, 10);
    const AGREEMENT_ADDR = agreement;
    const SIGNATORY = signatories[0].value;
    const CONDITION = conditions[0].value;
    const TRANSACTION = transaction;

    const agreementContract = await createInstance('Agreement', AGREEMENT_ADDR, provider);

    const contextFactory = await createInstance(
      'ContextFactory',
      process.env.REACT_APP_CONTEXT_FACTORY,
      provider
    );
   const txsAddr = await agreementContract.methods.txs().call() 
   const ctxdeployedLen = await contextFactory.methods.getDeployedContextsLen().call()

    await addSteps(agreementContract, contextFactory, [
      {
        txId: DSL_ID,
        requiredTxs: [],
        signatories: [SIGNATORY],
        conditions: [CONDITION],
        transaction: TRANSACTION,
      },
    ]);
    console.log(txsAddr, ctxdeployedLen);
   } catch (e){
    console.dir(e);
    setUpdateRequest({hash: '', submit: true, error: true, message: e?.message })
   }
  };

  return (
    <div className="updateRequest">
      <div className="title">Update Request </div>
      <Form
        name="agreementRequestForm"
        autoComplete="off"
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
          <InputNumber
            className="lander"
            defaultValue={dslId}
            onChange={(e) => {
              return setDslID(e);
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
            className="lander"
            defaultValue={agreement}
            onChange={(e) => {
              return setAgreement(e?.target?.value);
            }}
          />
        </Item>
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
                  className="lander"
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
                    className="lander"
                  />
                </Item>
                <button
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
            Transaction
          </div>
          <Item
            name="transaction"
            validateTrigger="onBlur"
            rules={getRule('transaction', 'transaction', transaction)}
          >
            <Input.TextArea
              defaultValue={transaction}
              onChange={(e) => {
                return setTransaction(e.target.value);
              }}
              className="lander"
            />
          </Item>
        </div>
        <div className="btnsContainer">
          <Button style={{ height: '48px' }} htmlType="submit" className="btn">
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
    </div>
  );
};

export default UpdateRequest;
