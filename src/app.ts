import { connectRabbit } from './rabbit/rabbit';

const start = async () => {
  await connectRabbit();
};

start();
