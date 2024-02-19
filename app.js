import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://heliersoares:MgiV1PVuPYqcrLxR@cluster0.dra4mik.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});


const Conta = mongoose.model('Conta', {
    nome: String,
    saldo: Number
});

app.use(express.json()); 

app.post('/contas', async (req, res) => {
    try {
        const { nome, saldo } = req.body;
        const novaConta = new Conta({ nome, saldo });
        await novaConta.save();
        res.status(201).json(novaConta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/contas/consultar', async (req, res) => {
    try {
        const conta = await Conta.findById(req.query.id);
        if (conta == null) {
            return res.status(404).json({ message: 'Conta não encontrada' });
        }
        res.json(conta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.put('/contas/editar/:id', async (req, res) => {
    try {
        const { nome, saldo } = req.body;
        const { id } = req.params;
        const conta = await Conta.findByIdAndUpdate(id, { nome, saldo }, { new: true });
        if (!conta) {
            return res.status(404).json({ message: 'Conta não encontrada' });
        }
        res.json(conta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/contas/deletar/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const conta = await Conta.findByIdAndDelete(id);
        if (!conta) {
            return res.status(404).json({ message: 'Conta não encontrada' });
        }
        res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
