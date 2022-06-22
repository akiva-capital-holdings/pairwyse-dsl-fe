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
import getRule from '../../../utils/validate'
import { ReactComponent as Delete } from '../../../images/delete.svg';

const {Item} = Form;
// import {selectUtils} from '../../../redux/utilsReducer'

const mock = [
  { title: 'Spetification', value: '0x25eca5c18cf82asdfs91bc168de7', id: 1 },
];
const DefinitionRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const [definition, setDefinition] = useState('');
  const { provider } = useSelector(selectUtils);
  const [spetification, setSpetification] = useState(mock);
  const [agreement, setAgreement] = useState('')
  const navigate = useNavigate();

  //  const onSubmit = async () => {
  //     const membershipInstance: any = await definitionInstance(
  //    `${process.env.REACT_APP_AGREEMENT_FACTORY}`,
  //     provider,
  //    );
  //    const get = await membershipInstance.methods  // @Misha call method
  //   }

  const defineVariable = async () => {
    // TODO: get `Agreement` (agreementAddr), `Definition` (varName), and `Specification` (varValue) from the
    //       corresponding input fields
    const agreementAddr = '0xfB990B0cBa54a19C109D1Eb0C890C20a7F856AF7';
    const varName = hex4Bytes('ALICE');
    const varValue = '0x6d82eB95C3c3468E1815242AB375327903E5261e';

    const a = await createInstance('Agreement', agreementAddr, provider);
    const txsAddr = await a.methods.txs().call();
    console.log({ txsAddr });
    const txs = await createInstance('ConditionalTxs', txsAddr, provider);
    const tx = await txs.methods.setStorageAddress(varName, varValue).send({ from: userWallet });
    console.log({ tx });

    // Check that the variable was set
    const value = await txs.methods.getStorageAddress(varName).call();
    console.log({ value });
  };

  return (
    <div className="definitionRequest">
      <div className="title">DefinitionRequest</div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={defineVariable}>
      <div style={{ marginTop: '24px' }} className="text">
          Requestor
        </div>
        <div className="value">{userWallet}</div>
        <div style={{ marginTop: '24px' }} className="text">
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
        <div style={{ marginTop: '24px' }} className="text">
          Definition
        </div>
        <Item name='borrower' validateTrigger="onBlur" rules={getRule('definition', 'definition')}>
            <Input
              placeholder='Borrower'
              className="lander"
              value={definition}
              onChange={(e) => {
                return setDefinition(e?.target?.value);
              }}
            />
        </Item>
        <div className="spetification">
        {spetification.map((el) => {
        return (
          <div className="spetificationImput" key={el.id}>
            <div style={{ marginTop: '24px' }} className="text">
              {el.title}{' '}
            </div>
            <Item name={`specification${el.id}`} validateTrigger="onBlur" rules={getRule('specification', 'specification', el.value)}>
              <Input
                onChange={e => setSpetification(spetification?.map(c => c?.id === el?.id ? {...c} : {...c, value: e?.target.value}))}
                className="lander"
              />
            </Item>
            <Button
              htmlType='button'
              onClick={() => setSpetification(spetification.filter((s) => s.id !== el.id))}
              className="del"
            >
             {spetification?.length > 1 &&  <Delete />}
            </Button>
          </div>
        );
      })}
          <Button
           htmlType='button'
           className="add"
           onClick={() =>
            setSpetification([
               ...spetification,
               { title: `Spetification ${spetification?.length}`, value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 },
             ])
           }
         >
           Add Specification
         </Button>
        </div>
        <div className="btnsContainer">
          <Button
            style={{ height: '48px' }}
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
    </div>
  );
};

export default DefinitionRequest;
