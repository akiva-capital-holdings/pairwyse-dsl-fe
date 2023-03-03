import { Contract } from 'ethers';

export const parseRecords = async (agreement: Contract, sender: string) => {
  do {
    await agreement.methods.parse(process.env.REACT_APP_PREPROCESSOR).send({ from: sender });
    console.log({
      agreementParseFinished: await agreement.methods.parseFinished().call(),
    });
  } while ((await agreement.methods.parseFinished().call()) === false);
};
