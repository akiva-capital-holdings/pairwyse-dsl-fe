import React from 'react';
import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { selectUtils } from 'redux/utilsReducer';
import { createInstance, hex4Bytes } from 'utils/helpers';
import { selectSession } from 'redux/sessionReducer';
import getRule from '../../../utils/validate';
import { ReactComponent as Delete } from '../../../images/delete.svg';

const { Item } = Form;
const DefinitionRequest = ({
  setAgreementDefinition: setAgreement,
  agreementDefinition: agreement,
  setValueDefinitionRequest,
  setspecification,
  specifications,
  setDefinition,
  definition,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const navigate = useNavigate();

  const defineVariable = async () => {
    try {
      const AGREEMENT_ADDR = agreement;
      const DEFINITION = definition;
      const SPETIFICATION = specifications[0].value;

      const a = await createInstance('Agreement', AGREEMENT_ADDR, provider);
      const txsAddr = await a.methods.txs().call();
      const txs = await createInstance('ConditionalTxs', txsAddr, provider);
      const tx = await txs.methods
        .setStorageAddress(hex4Bytes(DEFINITION), SPETIFICATION)
        .send({ from: userWallet });
      // Check that the variable was set
      const value = await txs.methods.getStorageAddress(hex4Bytes(DEFINITION)).call();
      setValueDefinitionRequest({
        value,
        submit: true,
        transactionHash: tx?.transactionHash,
        error: false,
      });
    } catch (e) {
      console.error(e);
      setValueDefinitionRequest({
        value: '',
        submit: true,
        transactionHash: '',
        error: true,
        message: e?.message,
      });
    }
  };

  return (
    <div className="definitionRequest">
      <div className="title">Definition Request</div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={defineVariable}>
        <div className="text">Requestor</div>
        <div className="value">{userWallet}</div>
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
          Definition
        </div>
        <Item
          name="borrower"
          validateTrigger="onBlur"
          rules={getRule('definition', 'definition', definition)}
        >
          <Input
            maxLength={20}
            placeholder="Borrower"
            className="lander"
            defaultValue={definition}
            onChange={(e) => {
              return setDefinition(e?.target?.value);
            }}
          />
        </Item>
        <div className="specification">
          {specifications.map((el) => {
            return (
              <div className="specificationInput" key={el.id}>
                {el?.id === 1 && (
                  <div style={{ marginTop: '24px' }} className="text">
                    Specifications
                  </div>
                )}
                <Item
                  name={`specification${el.id}`}
                  validateTrigger="onBlur"
                  rules={getRule('specification', 'specification', el.value)}
                >
                  <Input
                    defaultValue={el.value}
                    onChange={(e) => {
                      return setspecification(
                        specifications?.map((c) => {
                          return c?.id === el?.id ? { ...c, value: e?.target.value } : { ...c };
                        })
                      );
                    }}
                    className="lander"
                  />
                </Item>
                <Button
                  htmlType="button"
                  onClick={() => {
                    return setspecification(
                      specifications.filter((s) => {
                        return s.id !== el.id;
                      })
                    );
                  }}
                  className="del"
                >
                  {el.id !== 1 && <Delete />}
                </Button>
              </div>
            );
          })}
          {specifications?.length < 5 && (
            <Button
              htmlType="button"
              className="add"
              onClick={() => {
                return setspecification([
                  ...specifications,
                  {
                    title: `Specification ${specifications?.length}`,
                    value: '',
                    id: uuidv4(),
                  },
                ]);
              }}
            >
              Add Specification
            </Button>
          )}
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
