// Estado do jogador
let playerHp = 100;

// Elementos do DOM
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const storyTextElement = document.getElementById('story-text');
const choicesContainer = document.getElementById('choices-container');
const hpBar = document.getElementById('hp-bar');
const hpText = document.getElementById('hp-text');

// Elementos da Tela de Loading
const loadingScreen = document.getElementById('loading-screen');
const loadingBarProgress = document.getElementById('loading-bar-progress');
const loadingText = document.getElementById('loading-text');

// Áudios
const introMusic = document.getElementById('intro-music');
const loadingMusic = document.getElementById('loading-music');
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const gameoverMusic = document.getElementById('gameover-music');
const winMusic = document.getElementById('win-music');

const volumeSlider = document.getElementById('volume-slider');
const clickVolumeSlider = document.getElementById('click-volume-slider');

// Telas de Fim e Botões
const gameOverScreen = document.getElementById('game-over-screen');
const retryBtn = document.getElementById('retry-btn');
const goToMenuLostBtn = document.getElementById('go-to-menu-lost-btn');

const winScreen = document.getElementById('win-screen');
const winMessage = document.getElementById('win-message');
const winRetryBtn = document.getElementById('win-retry-btn');
const goToMenuWinBtn = document.getElementById('go-to-menu-win-btn');

// Configura os volumes iniciais
introMusic.volume = volumeSlider.value;
loadingMusic.volume = volumeSlider.value;
bgMusic.volume = volumeSlider.value;
gameoverMusic.volume = volumeSlider.value;
winMusic.volume = volumeSlider.value;
clickSound.volume = clickVolumeSlider.value;

// Lógica de Autoplay Seguro da Introdução
function iniciarIntro() {
    introMusic.play().catch(() => {
        document.addEventListener('click', () => {
            if (!startScreen.classList.contains('hidden')) {
                introMusic.play().catch(err => console.log("Erro ao tocar intro:", err));
            }
        }, { once: true });
    });
}
iniciarIntro();

// Botão "Iniciar Jogo" - CORRIGIDO (Com tratamento de erro seguro)
startBtn.addEventListener('click', () => {
    playClick();
    
    // Pausa a introdução de forma segura
    introMusic.pause();
    introMusic.currentTime = 0;

    // Transição para tela de loading
    startScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');
    
    // Tenta tocar a música de loading, mas não trava o jogo caso dê erro de caminho/arquivo
    loadingMusic.play().catch(err => console.log("Aviso: Áudio de loading não encontrado ou bloqueado."));
    
    // O loading vai rodar de forma independente e segura agora
    executarLoading(() => {
        loadingMusic.pause();
        loadingMusic.currentTime = 0;

        loadingScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        bgMusic.play().catch(err => console.log("Erro ao tocar música medieval:", err));
        goToStoryNode('start');
    });
});

// Função de Loading CORRIGIDA (Garante o fluxo sem travar)
function executarLoading(onComplete) {
    let progresso = 0;
    loadingBarProgress.style.width = '0%';
    loadingText.innerText = '0%';

    // Remove qualquer intervalo órfão anterior por segurança
    if (window.loadingInterval) {
        clearInterval(window.loadingInterval);
    }

    // Executa a contagem de forma limpa
    window.loadingInterval = setInterval(() => {
        progresso += 1;
        loadingBarProgress.style.width = progresso + '%';
        loadingText.innerText = progresso + '%';

        if (progresso >= 100) {
            clearInterval(window.loadingInterval);
            setTimeout(onComplete, 300); // Dá um tempo suave para a transição sumir visualmente
        }
    }, 30); // ~3 segundos totais de animação
}

// Som do clique do botão
function playClick() {
    clickSound.currentTime = 0; 
    clickSound.volume = clickVolumeSlider.value; 
    clickSound.play().catch(err => console.log("Áudio do clique bloqueado."));
}

// Controle deslizante de Volume de Música
volumeSlider.addEventListener('input', (e) => {
    const volumeValue = e.target.value;
    introMusic.volume = volumeValue;
    loadingMusic.volume = volumeValue;
    bgMusic.volume = volumeValue;
    gameoverMusic.volume = volumeValue;
    winMusic.volume = volumeValue;
    
    if (volumeValue > 0) {
        if (!startScreen.classList.contains('hidden') && introMusic.paused) {
            introMusic.play();
        } else if (!loadingScreen.classList.contains('hidden') && loadingMusic.paused) {
            loadingMusic.play();
        } else if (!gameContainer.classList.contains('hidden') && bgMusic.paused && gameOverScreen.classList.contains('hidden') && winScreen.classList.contains('hidden')) {
            bgMusic.play();
        } else if (!gameOverScreen.classList.contains('hidden') && gameoverMusic.paused) {
            gameoverMusic.play();
        } else if (!winScreen.classList.contains('hidden') && winMusic.paused) {
            winMusic.play();
        }
    }
});

// =========================================
// INTERAÇÕES DA TELA DE GAME OVER
// =========================================
retryBtn.addEventListener('click', () => {
    playClick();
    gameoverMusic.pause();
    gameoverMusic.currentTime = 0;
    
    gameOverScreen.classList.add('hidden'); 
    bgMusic.play().catch(err => console.log("Erro ao retomar música medieval:", err));
    goToStoryNode('reset'); 
});

goToMenuLostBtn.addEventListener('click', () => {
    playClick();
    gameoverMusic.pause();
    gameoverMusic.currentTime = 0;
    
    gameOverScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    iniciarIntro();
});

// =========================================
// INTERAÇÕES DA TELA DE VITÓRIA
// =========================================
winRetryBtn.addEventListener('click', () => {
    playClick();
    winMusic.pause();
    winMusic.currentTime = 0;
    
    winScreen.classList.add('hidden'); 
    bgMusic.play().catch(err => console.log("Erro ao retomar música medieval:", err));
    goToStoryNode('reset'); 
});

goToMenuWinBtn.addEventListener('click', () => {
    playClick();
    winMusic.pause();
    winMusic.currentTime = 0;
    
    winScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    iniciarIntro();
});

const storyNodes = {
    start: {
        text: "Você é Lauriki, um jovem aventureiro do reino de Valoria. Durante séculos, o Cristal Celestial protegeu estas terras, mas há três noites ele foi roubado. Sem sua energia, monstros surgem por toda parte. O rei prometeu uma recompensa lendária para quem recuperar o artefato. Sua jornada começa nos portões da capital.",
        choices: [
            { text: "Seguir pela Estrada Real", damage: 0, nextNode: 'estradaReal' },
            { text: "Atalhar pela Floresta Sombria", damage: 10, nextNode: 'florestaSombria' }
        ]
    },

    estradaReal: {
        text: "A Estrada Real está quase deserta. Mercadores abandonaram suas carroças por medo das criaturas. Ao longe, você encontra um viajante ferido pedindo ajuda.",
        choices: [
            { text: "Ajudar o viajante", damage: 0, nextNode: 'viajante' },
            { text: "Ignorar e continuar", damage: 0, nextNode: 'ponteAntiga' }
        ]
    },

    viajante: {
        text: "O viajante agradece e revela que viu soldados sombrios carregando o Cristal Celestial em direção às Montanhas Negras.",
        choices: [
            { text: "Seguir para as montanhas", damage: 0, nextNode: 'montanhas' },
            { text: "Investigar uma vila próxima primeiro", damage: 0, nextNode: 'vilaAbandonada' }
        ]
    },

    florestaSombria: {
        text: "A floresta é tomada por névoa. Sons estranhos ecoam entre as árvores. Uma matilha de lobos corrompidos bloqueia sua passagem.",
        choices: [
            { text: "Lutar contra os lobos", damage: 25, nextNode: 'aposLobos' },
            { text: "Escalar uma colina para evitar o combate", damage: 5, nextNode: 'colina' }
        ]
    },

    aposLobos: {
        text: "Após uma batalha difícil, você derrota os lobos. Entre os corpos encontra um medalhão com o símbolo da Ordem Negra.",
        choices: [
            { text: "Guardar o medalhão", damage: 0, nextNode: 'ruinasAntigas' }
        ]
    },

    colina: {
        text: "Do topo da colina você avista ruínas antigas escondidas pela vegetação.",
        choices: [
            { text: "Explorar as ruínas", damage: 0, nextNode: 'ruinasAntigas' },
            { text: "Continuar viagem", damage: 0, nextNode: 'ponteAntiga' }
        ]
    },

    vilaAbandonada: {
        text: "A vila parece deserta. Casas queimadas e ruas vazias revelam sinais de um ataque recente.",
        choices: [
            { text: "Entrar na taverna destruída", damage: 0, nextNode: 'taverna' },
            { text: "Investigar a igreja", damage: 0, nextNode: 'igreja' }
        ]
    },

    taverna: {
        text: "Nos escombros da taverna você encontra um mapa indicando um caminho secreto para as Montanhas Negras.",
        choices: [
            { text: "Usar o mapa", damage: 0, nextNode: 'passagemSecreta' }
        ]
    },

    igreja: {
        text: "Na igreja abandonada, um sacerdote sobrevivente conta que o Cristal foi levado para uma fortaleza escondida.",
        choices: [
            { text: "Seguir para a fortaleza", damage: 0, nextNode: 'fortaleza' }
        ]
    },

    ruinasAntigas: {
        text: "As ruínas pertenciam a uma civilização esquecida. No centro existe uma porta de pedra coberta por runas.",
        choices: [
            { text: "Abrir a porta", damage: 15, nextNode: 'bibliotecaPerdida' },
            { text: "Voltar", damage: 0, nextNode: 'ponteAntiga' }
        ]
    },

    bibliotecaPerdida: {
        text: "Você encontra uma biblioteca subterrânea. Um livro antigo revela que o Cristal Celestial pode tanto salvar quanto destruir o reino.",
        choices: [
            { text: "Levar o conhecimento consigo", damage: 0, nextNode: 'montanhas' }
        ]
    },

    ponteAntiga: {
        text: "Uma ponte de pedra atravessa um enorme desfiladeiro. No meio dela surge um cavaleiro espectral.",
        choices: [
            { text: "Enfrentar o cavaleiro", damage: 35, nextNode: 'vitoriaCavaleiro' },
            { text: "Tentar negociar", damage: 5, nextNode: 'segredoCavaleiro' }
        ]
    },

    vitoriaCavaleiro: {
        text: "O cavaleiro cai derrotado. Sua espada se transforma em luz e revela a entrada das Montanhas Negras.",
        choices: [
            { text: "Entrar nas montanhas", damage: 0, nextNode: 'montanhas' }
        ]
    },

    segredoCavaleiro: {
        text: "O espectro revela que servia ao antigo guardião do Cristal. Antes de desaparecer, ele alerta sobre uma traição dentro do reino.",
        choices: [
            { text: "Continuar jornada", damage: 0, nextNode: 'montanhas' }
        ]
    },

    passagemSecreta: {
        text: "O mapa leva você por cavernas escondidas sob as montanhas.",
        choices: [
            { text: "Seguir pela escuridão", damage: 15, nextNode: 'fortaleza' }
        ]
    },

    montanhas: {
        text: "As Montanhas Negras são frias e perigosas. Após horas de escalada, você avista uma fortaleza cercada por relâmpagos.",
        choices: [
            { text: "Invadir pela entrada principal", damage: 20, nextNode: 'fortaleza' },
            { text: "Procurar uma entrada secreta", damage: 5, nextNode: 'fortalezaSecreta' }
        ]
    },

    fortalezaSecreta: {
        text: "Você encontra um túnel escondido que leva ao interior da fortaleza.",
        choices: [
            { text: "Avançar", damage: 0, nextNode: 'salaCristal' }
        ]
    },

    fortaleza: {
        text: "Guardas da Ordem Negra patrulham os corredores. Após escapar deles, você chega à sala central.",
        choices: [
            { text: "Entrar na sala", damage: 10, nextNode: 'salaCristal' }
        ]
    },

    salaCristal: {
        text: "O Cristal Celestial flutua acima de um altar. Ao seu lado está Malgor, líder da Ordem Negra.",
        choices: [
            { text: "Lutar contra Malgor", damage: 45, nextNode: 'batalhaFinal' },
            { text: "Ouvir sua versão da história", damage: 0, nextNode: 'verdadeOculta' }
        ]
    },

    verdadeOculta: {
        text: "Malgor revela que o rei pretende usar o Cristal para dominar outros reinos. Talvez o verdadeiro vilão não seja quem você imaginava.",
        choices: [
            { text: "Acreditar em Malgor", damage: 0, nextNode: 'fimRebelde' },
            { text: "Permanecer leal ao rei", damage: 20, nextNode: 'batalhaFinal' }
        ]
    },

    batalhaFinal: {
        text: "A batalha é brutal. Raios mágicos atravessam a sala enquanto você e Malgor disputam o controle do Cristal.",
        choices: [
            { text: "Tomar o Cristal para si", damage: 0, nextNode: 'fimPoder' },
            { text: "Devolver o Cristal ao reino", damage: 0, nextNode: 'fimHeroico' }
        ]
    },

    fimHeroico: {
        text: "Você devolve o Cristal Celestial ao reino. A paz retorna e você é celebrado como o maior herói da história de Valoria.",
    },

    fimPoder: {
        text: "O poder do Cristal corre por suas veias. Você derrota todos os seus inimigos e se torna o governante mais poderoso do continente.",
    },

    fimRebelde: {
        text: "Você descobre a corrupção do rei e ajuda a derrubá-lo. Um novo conselho assume o reino e uma era de liberdade começa.",
    },

    gameOver: {
        text: "Seus ferimentos foram graves demais. Sua aventura termina antes que o destino do Cristal seja decidido.",
    }
};

// Função para gerenciar a navegação do jogo
function goToStoryNode(nodeKey) {
    if (nodeKey === 'reset') {
        playerHp = 100;
        nodeKey = 'start';
    }

    if (nodeKey === 'gameOver') {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        gameoverMusic.play().catch(err => console.log("Erro ao tocar música de game over:", err));
        
        gameOverScreen.classList.remove('hidden');
        return; 
    }

    if (nodeKey.startsWith('fim')) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        winMusic.play().catch(err => console.log("Erro ao tocar música de vitória:", err));
        
        const node = storyNodes[nodeKey];
        winMessage.innerText = node.text;
        winScreen.classList.remove('hidden');
        return;
    }

    const node = storyNodes[nodeKey];
    storyTextElement.innerText = node.text;
    choicesContainer.innerHTML = '';
    
    hpBar.value = playerHp;
    hpText.innerText = playerHp + "%";
    
    node.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice.text;
        
        button.addEventListener('click', () => {
            playClick();

            playerHp -= choice.damage;
            if (playerHp < 0) playerHp = 0;
            
            hpBar.value = playerHp;
            hpText.innerText = playerHp + "%";
            
            if (playerHp <= 0) {
                goToStoryNode('gameOver');
            } else {
                goToStoryNode(choice.nextNode);
            }
        });
        
        choicesContainer.appendChild(button);
    });
}