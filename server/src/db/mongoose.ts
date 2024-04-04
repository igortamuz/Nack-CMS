import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

export default mongoose.connect(process.env.DB, options).then(() => {
  console.log('Conectado ao Banco de Dados');
});