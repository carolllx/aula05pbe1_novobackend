const express = require("express");
const fs = require("fs");

const app = express();
const porta = 3001;

const arquivo = "./dados.json";

app.use(express.json());

const lerDados = () => {
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
};

const salvarDados = (dados) => {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
};

app.get("/inventario", (req, res) => {
    const dados = lerDados();
    res.status(200).json(dados);
});

app.get("/inventario/:id", (req, res) => {
    const dados = lerDados();
    const id = Number(req.params.id);

    const item = dados.find((item) => item.id === id);

    if (!item) {
        return res.status(404).json({
            mensagem: "Item não encontrado"
        });
    }

    res.status(200).json(item);
});

app.post("/inventario", (req, res) => {
    const dados = lerDados();

    const novoId = dados.length > 0
        ? Math.max(...dados.map((item) => item.id)) + 1
        : 1;

    const novoItem = {
        id: novoId,
        item: req.body.item,
        local: req.body.local,
        dataRegistro: req.body.dataRegistro,
        valor: Number(req.body.valor),
        patrimonio: req.body.patrimonio
    };

    dados.push(novoItem);
    salvarDados(dados);

    res.status(201).json(novoItem);
});

app.put("/inventario/:id", (req, res) => {
    const dados = lerDados();
    const id = Number(req.params.id);

    const indice = dados.findIndex((item) => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Item não encontrado"
        });
    }

    const itemAtualizado = {
        id: id,
        item: req.body.item,
        local: req.body.local,
        dataRegistro: req.body.dataRegistro,
        valor: Number(req.body.valor),
        patrimonio: req.body.patrimonio
    };

    dados[indice] = itemAtualizado;
    salvarDados(dados);

    res.status(200).json(itemAtualizado);
});

app.delete("/inventario/:id", (req, res) => {
    const dados = lerDados();
    const id = Number(req.params.id);

    const indice = dados.findIndex((item) => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Item não encontrado"
        });
    }

    dados.splice(indice, 1);
    salvarDados(dados);

    res.status(200).json({
        mensagem: "Item excluído com sucesso"
    });
});

app.listen(porta, () => {
    console.log(`Servidor funcionando em http://localhost:${porta}`);
})