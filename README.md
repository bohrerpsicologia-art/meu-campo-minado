# 💣 Campo Minado Flags - Estilo MSN (Versão Moderna)

Este projeto é uma recriação do clássico jogo **Minesweeper Flags** do MSN Messenger, com um toque visual moderno (Neon) e inteligência artificial para jogar contra a máquina.

## 🚀 Como Abrir o Jogo
Como você é iniciante e o projeto foi feito para rodar na sua máquina de forma simples, basta seguir estes passos:
1. Localize a pasta onde você baixou estes arquivos.
2. Encontre o arquivo chamado `index.html`.
3. Clique duas vezes nele ou arraste-o para dentro do seu navegador (Chrome, Edge ou Firefox).
4. O jogo abrirá instantaneamente!

## 🎮 Regras do Jogo
Diferente do Campo Minado tradicional, aqui o objetivo é **encontrar as minas**:
*   **Seu objetivo:** Clique onde você acha que tem uma mina.
*   **Acertou?** Você ganha 1 ponto e joga novamente.
*   **Errou?** A vez passa para o outro jogador (ou para a máquina).
*   **Vazio (0):** Se clicar em um local sem minas próximas, uma área será revelada para você.
*   **Bomba Grande (Estrela ⭐):** Cada jogador tem 1 uso especial. Clique no botão da estrela e depois em um local do tabuleiro. Ele revelará uma área de 3x3 e você ganhará os pontos de todas as minas escondidas ali!

## 🤖 Níveis da Máquina (IA)
Ao escolher "Humano vs Máquina", você pode definir a dificuldade:
*   **Nível 1:** A máquina é bem distraída e erra muito.
*   **Nível 3:** Joga de forma casual e equilibrada.
*   **Nível 5 (Gênio):** Usa lógica matemática avançada. Se ela não conseguir deduzir com 100% de certeza, ela tem 60% de chance de "chutar" o local correto da mina.

## 🛠️ Para o Desenvolvedor Futuro (Ganchos)
O código em `script.js` possui comentários marcados com `GANCHO:` que facilitam:
1.  **Ranking Online:** Integração com bancos de dados (Firebase/MySQL) na função `updateScores`.
2.  **Monetização:** Espaço pronto para exibir anúncios (AdMob/Adsense) na função `endGame`.
3.  **Responsividade:** O CSS em `style.css` já trata layouts para celulares e tablets de forma flexível.

---
Divirta-se! 🏁
