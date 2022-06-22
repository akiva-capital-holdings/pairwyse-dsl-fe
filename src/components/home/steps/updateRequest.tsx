/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import {updateInstance} from '../../../utils/helpers';
import { Button, Form, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'ethers/lib/utils';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { Contract } from 'ethers';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Delete } from '../../../images/delete.svg';
import  getRule from '../../../utils/validate'
// import {selectUtils} from '../../../redux/utilsReducer'

const {Item} = Form;

const mock = [
  {
    title: 'Condition',
    value: '',
    id: 1,
  },
];

// ((RISK IS TRUE) AND (TIME < EXPIRY)) OR 
//       ((TIME >= EXPIRY) AND (PRINCIPAL + INTEREST  > PAYMENTS))
//       ((RISK IS TRUE) AND (TIME < EXPIRY))OR((TIME >= EXPIRY)
//       AND (PRINCIPAL + INTEREST  > PAYMENTS))

const mockSignatories = [
  { title: 'Signatory', value: '0x5ef78de7ac91bc1625eca5c18cf82a', id: 1 },
];

const UpdateRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [condition, setCondition] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('')
  const navigate = useNavigate();

  type TxObject = {
    txId: number;
    requiredTxs: number[];
    signatories: string[];
    conditions: string[];
    transaction: string;
  };

  const addSteps = async (a: Contract, contextFactory: Contract, steps: TxObject[]) => {
    console.log('`addSteps` function call');

    for await (const step of steps) {
      console.log(`\n---\n\n🧩 Adding Term #${step.txId} to Agreement`);
      await contextFactory.methods.deployContext().send({ from: userWallet });
      let contextsLen = parseInt(await contextFactory.methods.getDeployedLen().call(), 10);
      console.log({ contextsLen });
      const transactionContextAddr = await contextFactory.methods
        .deployedContexts(contextsLen - 1)
        .call();
      console.log({ transactionContextAddr });
      const conditionsContextAddrs = [];

      console.log('\nTerm Conditions');

      for (let j = 0; j < step.conditions.length; j++) {
        console.log({ j });
        const deployCtxTx = await contextFactory.methods.deployContext().send({ from: userWallet });
        console.log({ deployCtxTx });
        contextsLen = parseInt(await contextFactory.methods.getDeployedLen().call(), 10);
        console.log({ contextsLen });
        const conditionContextAddr = await contextFactory.methods
          .deployedContexts(contextsLen - 1)
          .call();
        console.log({ conditionContextAddr });
        conditionsContextAddrs.push(conditionContextAddr);

        console.log(`Parsing a condition #${j}`);
        const agrParseTx = await a.methods
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
      await a.methods
        .parse(step.transaction, transactionContextAddr)
        .send({ from: userWallet });
      console.log('\nTerm transaction');
      console.log(`\n\taddress: \x1b[35m${transactionContextAddr}\x1b[0m`);
      console.log(`\t\x1b[33m${step.transaction}\x1b[0m`);
      const { hash } = await a.methods
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
      console.log(`\nAgreement update transaction hash: \n\t\x1b[35m${hash}\x1b[0m`);
    }
  };

  const updateAgreement = async () => {
    console.log('`updateAgreement` function call');
    // Input data
    const alice = '0x764E1431Bc7f0D2351Daf2e771729F5D230493A0';
    const bob = '0x7e57B32aCB1FE54Ae92F8aDe15Fa026512b80819';
    const oneEth = parseEther('1');
    const tenTokens = parseEther('10');

    // TODO: get agreementAddr from the input field
    const agreementAddr = '0xfB990B0cBa54a19C109D1Eb0C890C20a7F856AF7';
    const a = await createInstance('Agreement', agreementAddr, provider);

    const conditionalTxs = [
      // Alice deposits 1 ETH to SC
      {
        txId: 21,
        requiredTxs: [],
        signatories: [alice],
        transaction: `msgValue == uint256 ${oneEth}`,
        conditions: ['bool true'],
      },
      // Bob lends 10 tokens to Alice
      {
        txId: 22,
        requiredTxs: [21],
        signatories: [bob],
        transaction: `transferFrom TOKEN_ADDR BOB ALICE ${tenTokens.toString()}`,
        conditions: ['bool true'],
      },
      // Alice returns 10 tokens to Bob and collects 1 ETH
      {
        txId: 23,
        requiredTxs: [22],
        signatories: [alice],
        transaction: `
              (transferFrom TOKEN_ADDR ALICE BOB ${tenTokens.toString()})
          and (sendEth ALICE ${oneEth})
        `,
        conditions: ['bool true'],
      },
    ];

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

    console.log({ txsAddr: await a.methods.txs().call() });
    console.log({ agrdeployedLen: await agrFactory.methods.getDeployedLen().call() });
    console.log({ ctxdeployedLen: await contextFactory.methods.getDeployedLen().call() });

    await addSteps(a, contextFactory, conditionalTxs);
  };

  return   <div className="updateRequest">
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
      </div>         <div style={{ marginTop: '24px' }} className="text">
          Agreement
      </div>
      <Item name='agreement' validateTrigger="onBlur" rules={getRule('agreement', 'agreement')}>
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
          <div className="spetificationImput" key={el.id}>
            <div style={{ marginTop: '24px' }} className="text">
              {el.title}{' '}
            </div>
            <Item name={`signatories${el.id}`} validateTrigger="onBlur" rules={getRule('signatories', 'signatories', el.value)}>
              <Input
                onChange={e => setSignatories(signatories?.map(c => c?.id === el?.id ? {...c} : {...c, value: e?.target.value}))}
                className="lander"
              />
            </Item>
            <Button
              htmlType='button'
              onClick={() => setSignatories(signatories.filter((s) => s.id !== el.id))}
              className="del"
            >
             {signatories?.length > 1 &&  <Delete />}
            </Button>
          </div>
        );
      })}
          <Button
           htmlType='button'
           className="add"
           onClick={() =>
             setSignatories([
               ...signatories,
               { title: `Signatory ${signatories?.length}`, value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 },
             ])
           }
         >
           Add Signatory
         </Button>
      <div className="spetification">
       {condition.map((el) => {
        return (
          <div className="spetificationImput" key={el.id}>
            <div style={{ marginTop: '24px' }} className="text">
              {el.title}{' '}
            </div>
            <Item name={`condition${el.id + 1}`} validateTrigger="onBlur" rules={getRule('condition', 'condition', el.value)}>
              <Input.TextArea
                onChange={e => setCondition(condition?.map(c => c?.id === el?.id ? {...c} : {...c, value: e?.target.value}))}
                style={{minHeight: '100px'}}
                className="lander"
              />
            </Item>
            <button
              onClick={() => setCondition(condition.filter((s) => s.id !== el.id))}
              className="del"
            >
            {condition?.length > 1 &&  <Delete />}
            </button>
          </div>
        );
      })}
      <Button
        className="add"
        htmlType='button'
        onClick={() =>
          setCondition([
            ...condition,
            { title: `Condition ${condition?.length}`, value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: condition?.length + 1},
          ])
        }
      >
        Add Condition
      </Button>
    </div>
         <div className="spetificationImput">
         <div style={{ marginTop: '24px' }} className="text">
           Transaction 
         </div>
         <Item name='transaction' validateTrigger="onBlur" rules={getRule('transaction', 'transaction')}>
          <Input
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
};

export default UpdateRequest;
