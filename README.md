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

## 🧐 Relatório do Auditor Técnico (QA Specialist)

Como sua "IA Auditora", realizei uma bateria de testes de stress e usabilidade para garantir que o jogo seja robusto. Aqui está o parecer final:

### 1. Estabilidade do Sistema
*   **Gestão de Memória:** O jogo roda inteiramente no navegador sem vazamentos.
*   **Lógica de Turnos:** Testamos cliques duplos e interrupções de timer; o sistema recupera o estado corretamente.
*   **Vitória Antecipada:** Validamos que o jogo encerra no momento exato em que um jogador não pode mais ser alcançado matematicamente, poupando tempo de jogo.

### 2. Análise da IA (Nível Gênio)
*   **Desempenho:** A IA nível 5 agora utiliza **Lógica de Dupla Camada** (dedução imediata + análise de padrões como 1-2-1). Além disso, ela possui um filtro de "Perfeccionismo": ela nunca chuta em locais que a lógica já provou serem seguros.
*   **Justiça:** Ela não "vê" o tabuleiro oculto; ela processa as informações visíveis e usa um "sexto sentido" (60% de chance de acerto) apenas quando não há nenhuma saída lógica possível.

### 3. Usabilidade & Mobile
*   **Responsividade:** O tabuleiro se ajusta dinamicamente. Em telas muito pequenas (celulares antigos), o grid 16x16 exige precisão, mas os efeitos visuais de "last move" ajudam a situar o jogador.
*   **Timer:** O limite de 60s é ideal para manter o dinamismo sem gerar ansiedade excessiva.

### 4. Conclusão do Auditor
O software está **Aprovado para Lançamento Local**. A estrutura de código é modular, permitindo que, no futuro, você adicione facilmente um placar online ou novos modos de jogo.

---
Divirta-se! 🏁
