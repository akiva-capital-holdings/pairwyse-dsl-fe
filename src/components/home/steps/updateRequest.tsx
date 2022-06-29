/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { Contract } from 'ethers';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Delete } from '../../../images/delete.svg';
import getRule from '../../../utils/validate';

const { Item } = Form;

const mock = [
  {
    title: 'Condition',
    value: '',
    id: 1,
  },
];

const mockSignatories = [{ title: 'Signatory', value: '', id: 1 }];

const UpdateRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  const navigate = useNavigate();

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
    console.log('`addSteps` function call');

    for await (const step of steps) {
      console.log(`\n---\n\n🧩 Adding Term #${step.txId} to Agreement`);
      await contextFactory.methods.deployContext().send({ from: userWallet });
      let contextsLen = parseInt(await contextFactory.methods.getDeployedLen().call(), 10);
      console.log({ contextsLen });
      const transactionContextAddr = await contextFactory.methods.deployed(contextsLen - 1).call();
      console.log({ transactionContextAddr });
      const conditionsContextAddrs = [];

      console.log('\nTerm Conditions');

      for (let j = 0; j < step.conditions.length; j++) {
        console.log({ j });
        const deployCtxTx = await contextFactory.methods.deployContext().send({ from: userWallet });
        console.log({ deployCtxTx });
        contextsLen = parseInt(await contextFactory.methods.getDeployedLen().call(), 10);
        console.log({ contextsLen });
        const conditionContextAddr = await contextFactory.methods.deployed(contextsLen - 1).call();
        console.log({ conditionContextAddr });
        conditionsContextAddrs.push(conditionContextAddr);

        console.log(`Parsing a condition #${j}`);
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

      console.log('Parsing transaction');
      await agreementContract.methods
        .parse(step.transaction, transactionContextAddr)
        .send({ from: userWallet });
      console.log('\nTerm transaction');
      console.log(`\n\taddress: \x1b[35m${transactionContextAddr}\x1b[0m`);
      console.log(`\t\x1b[33m${step.transaction}\x1b[0m`);
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
      console.log(`\nAgreement update transaction hash: \n\t\x1b[35m${agrUpdate}\x1b[0m`);
    }
  };

  const updateAgreement = async () => {
    console.log('`updateAgreement` function call');
    // Input data
    // eslint-disable-next-line
    const _dslId = parseInt(dslId, 10);
    // eslint-disable-next-line
    const _agreementAddr = agreement;
    // eslint-disable-next-line
    const _signatory = signatories[0].value;
    // eslint-disable-next-line
    const _condition = conditions[0].value;
    // eslint-disable-next-line
    const _transaction = transaction;

    console.log({
      _dslId,
      _agreementAddr,
      _signatory,
      _condition,
      _transaction,
    });

    const agreementContract = await createInstance('Agreement', _agreementAddr, provider);

    const contextFactory = await createInstance(
      'ContextFactory',
      process.env.REACT_APP_CONTEXT_FACTORY,
      provider
    );
    const agrFactory = await createInstance(
      'AgreementFactory',
      `${process.env.REACT_APP_AGREEMENT_FACTORY}`,
      provider
    );

    console.log({ txsAddr: await agreementContract.methods.txs().call() });
    console.log({ agrdeployedLen: await agrFactory.methods.getDeployedLen().call() });
    console.log({ ctxdeployedLen: await contextFactory.methods.getDeployedLen().call() });

    await addSteps(agreementContract, contextFactory, [
      {
        txId: _dslId,
        requiredTxs: [],
        signatories: [_signatory],
        conditions: [_condition],
        transaction: _transaction,
      },
    ]);
  };

  return (
    <div className="updateRequest">
      <div className="title">Update Request </div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={() => updateAgreement()}>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor
        </div>
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
        <Item name="dsl-id" validateTrigger="onBlur" rules={getRule('dsl-id', 'dsl-id')}>
          <Input
            className="lander"
            value={dslId}
            onChange={(e) => {
              return setDslID(e?.target?.value);
            }}
          />
        </Item>

        <div style={{ marginTop: '24px' }} className="text">
          Agreement
        </div>
        <Item name="agreement" validateTrigger="onBlur" rules={getRule('agreement', 'agreement')}>
          <Input
            className="lander"
            value={agreement}
            onChange={(e) => {
              return setAgreement(e?.target?.value);
            }}
          />
        </Item>

        {signatories.map((el) => {
          return (
            <div className="specificationInput" key={el.id}>
              <div style={{ marginTop: '24px' }} className="text">
                {el.title}{' '}
              </div>
              <Item
                name={`signatories${el.id}`}
                validateTrigger="onBlur"
                rules={getRule('signatories', 'signatories', el.value)}
              >
                <Input
                  onChange={(e) =>
                    setSignatories(
                      signatories?.map((c) =>
                        c?.id === el?.id ? { ...c, value: e?.target.value } : { ...c }
                      )
                    )
                  }
                  className="lander"
                  value={el?.value}
                />
              </Item>
              <Button
                htmlType="button"
                onClick={() => setSignatories(signatories.filter((s) => s.id !== el.id))}
                className="del"
              >
                {signatories?.length > 1 && <Delete />}
              </Button>
            </div>
          );
        })}
        <Button
          htmlType="button"
          className="add"
          onClick={() =>
            setSignatories([
              ...signatories,
              { title: `Signatory ${signatories?.length}`, value: '', id: signatories?.length + 1 },
            ])
          }
        >
          Add Signatory
        </Button>
        <div className="specification">
          {conditions.map((el) => {
            return (
              <div className="specificationInput" key={el.id}>
                <div style={{ marginTop: '24px' }} className="text">
                  {el.title}{' '}
                </div>
                <Item
                  name={`condition${el.id + 1}`}
                  validateTrigger="onBlur"
                  rules={getRule('condition', 'condition', el.value)}
                >
                  <Input.TextArea
                    onChange={(e) =>
                      setConditions(
                        conditions?.map((c) =>
                          c?.id === el?.id ? { ...c, value: e?.target.value } : { ...c }
                        )
                      )
                    }
                    style={{ minHeight: '100px' }}
                    className="lander"
                  />
                </Item>
                <button
                  onClick={() => setConditions(conditions.filter((s) => s.id !== el.id))}
                  className="del"
                >
                  {conditions?.length > 1 && <Delete />}
                </button>
              </div>
            );
          })}
          <Button
            className="add"
            htmlType="button"
            onClick={() =>
              setConditions([
                ...conditions,
                { title: `Condition ${conditions?.length}`, value: '', id: conditions?.length + 1 },
              ])
            }
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
            rules={getRule('transaction', 'transaction')}
          >
            <Input
              value={transaction}
              onChange={(e) => setTransaction(e.target.value)}
              className="lander"
            />
          </Item>
        </div>
        <div className="btnsContainer">
          <Button style={{ height: '48px' }} htmlType="submit" className="btn">
            Request Approval
          </Button>
          <Button onClick={() => navigate('/')} htmlType="button" className="cancel">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateRequest;
