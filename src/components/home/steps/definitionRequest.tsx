/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {definitionInstance} from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { selectUtils } from 'redux/utilsReducer';
import { createInstance, hex4Bytes } from 'utils/helpers';
import { selectSession } from 'redux/sessionReducer';
import getRule from '../../../utils/validate';
import { ReactComponent as Delete } from '../../../images/delete.svg';

const { Item } = Form;
// import {selectUtils} from '../../../redux/utilsReducer'

const mock = [{ title: 'Specification (address)', value: '', id: 1 }];
const DefinitionRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const [definition, setDefinition] = useState('');
  const { provider } = useSelector(selectUtils);
  const [specifications, setspecification] = useState(mock);
  const [agreement, setAgreement] = useState('');
  const navigate = useNavigate();

  const defineVariable = async () => {
    // eslint-disable-next-line
    const _agreementAddr = agreement;
    // eslint-disable-next-line
    const _definition = definition;
    // eslint-disable-next-line
    const _specification = specifications[0].value;

    console.log({
      _agreementAddr,
      _definition,
      _specification,
    });

    const a = await createInstance('Agreement', _agreementAddr, provider);
    const txsAddr = await a.methods.txs().call();
    console.log({ txsAddr });
    const txs = await createInstance('ConditionalTxs', txsAddr, provider);
    const tx = await txs.methods
      .setStorageAddress(hex4Bytes(_definition), _specification)
      .send({ from: userWallet });
    console.log({ tx });
    // Check that the variable was set
    const value = await txs.methods.getStorageAddress(hex4Bytes(_definition)).call();
    console.log({ value });
  };
  
  return (
    <div className="definitionRequest">
      <div className="title">Definition Request</div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={defineVariable}>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor
        </div>
        <div className="value">{userWallet}</div>
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
        <div style={{ marginTop: '24px' }} className="text">
          Definition
        </div>
        <Item name="borrower" validateTrigger="onBlur" rules={getRule('definition', 'definition')}>
          <Input
            maxLength={20}
            placeholder="Borrower"
            className="lander"
            value={definition}
            onChange={(e) => {
              return setDefinition(e?.target?.value);
            }}
          />
        </Item>
        <div className="specification">
          {specifications.map((el) => {
            return (
              <div className="specificationInput" key={el.id}>
                <div style={{ marginTop: '24px' }} className="text">
                  {el.title}{' '}
                </div>
                <Item
                  name={`specification${el.id}`}
                  validateTrigger="onBlur"
                  rules={getRule('specification', 'specification', el.value)}
                >
                  <Input
                    onChange={(e) =>
                      setspecification(
                        specifications?.map((c) =>
                          c?.id === el?.id ? { ...c, value: e?.target.value } : { ...c }
                        )
                      )
                    }
                    className="lander"
                  />
                </Item>
                <Button
                  htmlType="button"
                  onClick={() => setspecification(specifications.filter((s) => s.id !== el.id))}
                  className="del"
                >
                  {el.id !== 1  && <Delete />}
                </Button>
              </div>
            );
          })}
          {specifications?.length === 5 || specifications?.length < 5 &&
           <Button
           htmlType="button"
           className="add"
           onClick={() =>
             setspecification([
               ...specifications,
               {
                 title: `Specification ${specifications?.length}`,
                 value: '',
                 id: specifications?.length + 1,
               },
             ])
           }
         >
           Add Specification
         </Button>
       }
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

export default DefinitionRequest;
