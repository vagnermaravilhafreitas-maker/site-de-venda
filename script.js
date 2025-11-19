// --- Variáveis Globais do Jogo ---
let budget = 50000; // Orçamento inicial
let salesCount = 0;
let inventory = []; // Array para armazenar motos compradas

// Lista de motos disponíveis para o mercado
const marketBikes = [
    { id: 1, name: "xj6", cost: 50000, maxProfit: 20000 },
    { id: 2, name: "Honda Biz", cost: 15000, maxProfit: 4500 },
    { id: 3, name: "Kawasaki Ninja", cost: 62000, maxProfit: 31000 },
    { id: 4, name: "BMW S1000RR", cost: 57900, maxProfit: 22000 }
];

// --- Funções Auxiliares ---

// Formata um número para o formato de moeda Real (R$)
function formatCurrency(number) {
    return `R$ ${number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Atualiza a exibição de orçamento e vendas
function updateStats() {
    document.getElementById('budget').textContent = formatCurrency(budget);
    document.getElementById('sales-count').textContent = salesCount;
}

// Exibe uma mensagem de feedback
function showMessage(text) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = text;
    // Limpa a mensagem após 5 segundos
    setTimeout(() => {
        messageArea.textContent = '';
    }, 5000);
}

// --- Funções de Renderização ---

// Renderiza a lista de motos disponíveis para compra
function renderMarket() {
    const marketDiv = document.getElementById('market');
    let html = '<h2>Motos Disponíveis para Compra</h2>';
    
    marketBikes.forEach(bike => {
        html += `
            <div class="motorcycle-item">
                <p>
                    <strong>${bike.name}</strong> - Custo: ${formatCurrency(bike.cost)} 
                    <small>(Lucro Estimado: até ${formatCurrency(bike.maxProfit)})</small>
                </p>
                <button class="buy-btn" onclick="buyBike(${bike.id})">Comprar</button>
            </div>
        `;
    });
    
    marketDiv.innerHTML = html;
}

// Renderiza o inventário de motos compradas
function renderInventory() {
    const inventoryDiv = document.getElementById('inventory');
    let html = '<h2>Seu Estoque</h2>';

    if (inventory.length === 0) {
        inventoryDiv.innerHTML = '<h2>Seu Estoque</h2><p id="inventory-message">Nenhuma moto no estoque.</p>';
        return;
    }

    inventory.forEach(bike => {
        // Calcula o preço de venda: Custo + Lucro Aleatório (até o maxProfit)
        const minSalePrice = bike.cost + bike.cost * 0.1; // Garante um lucro mínimo de 10%
        const maxSalePrice = bike.cost + bike.maxProfit;
        
        // Define um preço de venda aleatório dentro de uma faixa razoável
        const salePrice = Math.floor(Math.random() * (maxSalePrice - minSalePrice + 1)) + minSalePrice;
        
        html += `
            <div class="motorcycle-item">
                <p>
                    <strong>${bike.name}</strong> - Compra: ${formatCurrency(bike.cost)} 
                    <small>(Preço de Venda Sugerido: ${formatCurrency(salePrice)})</small>
                </p>
                <button class="sell-btn" onclick="sellBike(${bike.uniqueId}, ${salePrice})">Vender por ${formatCurrency(salePrice)}</button>
            </div>
        `;
    });
    
    inventoryDiv.innerHTML = html;
}

// --- Funções de Ação do Jogo ---

// Função para comprar uma moto
function buyBike(bikeId) {
    const bike = marketBikes.find(b => b.id === bikeId);

    if (!bike) return; // Moto não encontrada

    if (budget >= bike.cost) {
        budget -= bike.cost;
        
        // Adiciona a moto ao inventário com um ID único para venda
        inventory.push({ 
            uniqueId: Date.now() + Math.random(), // ID único para rastrear a instância
            ...bike // Copia as propriedades da moto
        });
        
        showMessage(`Você comprou a ${bike.name} por ${formatCurrency(bike.cost)}!`);
        updateStats();
        renderInventory();
    } else {
        showMessage(`Orçamento insuficiente para comprar a ${bike.name}. Você precisa de mais ${formatCurrency(bike.cost - budget)}.`);
    }
}

// Função para vender uma moto
function sellBike(uniqueId, salePrice) {
    const bikeIndex = inventory.findIndex(b => b.uniqueId === uniqueId);

    if (bikeIndex === -1) return; // Moto não encontrada no inventário

    const bike = inventory[bikeIndex];
    const profit = salePrice - bike.cost;
    
    budget += salePrice;
    salesCount++;
    
    // Remove a moto do inventário
    inventory.splice(bikeIndex, 1);

    showMessage(`A ${bike.name} foi vendida por ${formatCurrency(salePrice)}! Lucro: ${formatCurrency(profit)}.`);
    updateStats();
    renderInventory();
}

// --- Inicialização do Jogo ---

function startGame() {
    // Reset ou inicialização
    budget = 50000; 
    salesCount = 0;
    inventory = [];
    
    updateStats();
    renderMarket();
    renderInventory();
    showMessage("O jogo começou! Use seu orçamento para comprar motos e tente vendê-las por um preço maior.");
}

// Inicia o jogo assim que a página é carregada
window.onload = startGame;