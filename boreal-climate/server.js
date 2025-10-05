// 🌐 Boreal Climate Refrigeração — Servidor principal
// Desenvolvido por Anderson Seabra e GPT-5

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// 🔧 Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🧊 Banco de dados simulado (JSON local)
const dbPath = path.join(__dirname, "servicos.json");

// Função para carregar serviços do arquivo
function carregarServicos() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(
        [
          {
            id: 1,
            nome: "Instalação de Ar-Condicionado",
            descricao: "Instalação profissional e segura de aparelhos split e janela.",
            preco: "350,00",
            imagem: "/assets/instalacao.jpg",
          },
          {
            id: 2,
            nome: "Manutenção Preventiva",
            descricao: "Limpeza completa e verificação de desempenho do equipamento.",
            preco: "180,00",
            imagem: "/assets/manutencao.jpg",
          },
          {
            id: 3,
            nome: "Reparo de Sistemas",
            descricao: "Diagnóstico e conserto de falhas em sistemas de refrigeração.",
            preco: "250,00",
            imagem: "/assets/reparo.jpg",
          },
        ],
        null,
        2
      )
    );
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// Função para salvar serviços
function salvarServicos(servicos) {
  fs.writeFileSync(dbPath, JSON.stringify(servicos, null, 2));
}

// 🏠 Página inicial
app.get("/", (req, res) => {
  res.render("index", { title: "Boreal Climate Refrigeração" });
});

// 📋 API: listar serviços
app.get("/api/servicos", (req, res) => {
  const servicos = carregarServicos();
  res.json(servicos);
});

// ➕ API: adicionar serviço
app.post("/api/servicos", (req, res) => {
  const servicos = carregarServicos();
  const novo = { id: Date.now(), ...req.body };
  servicos.push(novo);
  salvarServicos(servicos);
  res.json({ message: "Serviço adicionado com sucesso!", servico: novo });
});

// ✏️ API: editar serviço
app.put("/api/servicos/:id", (req, res) => {
  const servicos = carregarServicos();
  const id = parseInt(req.params.id);
  const idx = servicos.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });
  servicos[idx] = { ...servicos[idx], ...req.body };
  salvarServicos(servicos);
  res.json({ message: "Serviço atualizado com sucesso!" });
});

// ❌ API: deletar serviço
app.delete("/api/servicos/:id", (req, res) => {
  const servicos = carregarServicos();
  const id = parseInt(req.params.id);
  const novos = servicos.filter((s) => s.id !== id);
  salvarServicos(novos);
  res.json({ message: "Serviço removido com sucesso!" });
});

// ✉️ API: formulário de contato (simulado)
app.post("/api/contato", (req, res) => {
  const { nome, email, mensagem } = req.body;
  console.log("📨 Novo contato recebido:", { nome, email, mensagem });

  // Aqui você poderia enviar por e-mail via Nodemailer
  res.json({
    message: `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`,
  });
});

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Boreal Climate rodando em http://localhost:${PORT}`);
});
