import React, { useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {definitionInstance} from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { selectUtils } from 'redux/utilsReducer';
import { createInstance, hex4Bytes } from 'utils/helpers';
import { selectSession } from 'redux/sessionReducer';
import { ReactComponent as Delete } from '../../../images/delete.svg';
// import {selectUtils} from '../../../redux/utilsReducer'

const mock = [
  { title: 'Definition', value: 'Borrower', id: 1 },
  { title: 'Spetification', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 },
];
const DefinitionRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [spetification, setSpetification] = useState(mock);
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

    const agreement = await createInstance('Agreement', agreementAddr, provider);
    const txsAddr = await agreement.methods.txs().call();
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
      <div style={{ marginTop: '24px' }} className="text">
        Requestor
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        className="value"
      >
        0x7ac91528cf82aeca5c15efbc168de7
      </div>
      <div style={{ marginTop: '24px' }} className="text">
        Agreement{' '}
      </div>
      <div className="lander">0x25eca5c18cf82a5ef7ac91bc168de7</div>
      <div className="spetification">
        {spetification.map((el) => {
          return (
            <div className="spetificationImput" key={el.id}>
              <div style={{ marginTop: '24px' }} className="text">
                {el.title}{' '}
              </div>
              <div className="lander">{el.value}</div>
              <button
                onClick={() => {
                  return setSpetification(
                    spetification.filter((s) => {
                      return s.id !== el.id;
                    })
                  );
                }}
                className="del"
              >
                <Delete />
              </button>
            </div>
          );
        })}
        <button
          className="add"
          onClick={() => {
            return setSpetification([
              ...spetification,
              { title: 'Agreement', value: '0x25eca5c18cf82a5ef7ac91bc168de7', id: 2 },
            ]);
          }}
        >
          Add Specification{' '}
        </button>
      </div>
      <div className="btnsContainer">
        <Button
          onClick={defineVariable}
          style={{ height: '48px' }}
          htmlType="button"
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
    </div>
  );
};

export default DefinitionRequest;
