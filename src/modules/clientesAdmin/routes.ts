import { ClienteAdminService } from './services/ClienteAdminService';
import { Router } from 'express';
import { ClienteAdminController } from './controller/ClienteAdminController';


const clientesAdminRouter = Router();

const clientesAdminController = new ClienteAdminController();

clientesAdminRouter.post('/clientes', async (req, res) => {
    const cliente = req.body;
    const createdCliente = await clientesAdminController.create(cliente);
    res.status(201).json(createdCliente);
});

clientesAdminRouter.get('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id);
    const cliente = await clientesAdminController.findById(id);
    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ message: 'Cliente not found' });
    }
});

clientesAdminRouter.put('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id);
    const cliente = req.body;
    const updatedCliente = await clientesAdminController.update(id, cliente);
    if (updatedCliente) {
        res.json(updatedCliente);
    } else {
        res.status(404).json({ message: 'Cliente not found' });
    }
});

clientesAdminRouter.delete('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id);
    await clientesAdminController.delete(id);
    res.status(204).send();
});

export { clientesAdminRouter };



