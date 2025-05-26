document.addEventListener('DOMContentLoaded', () => {
  const storedFlashcards = localStorage.getItem('flashcards');
  const  flashcards = storedFlashcards ? JSON.parse(storedFlashcards) : [];

  let currentCard = 0;
  let guessesRight = 0;

  let practiceCards = [];
  let practiceIndex;
  let practiceRight;
  let practiceWrong;


  const flashcardElement = document.getElementById('card');
  const questionElement = document.getElementById('question');
  const answerElement = document.getElementById('answer');
  const cardListElement = document.getElementById('card-list');
  const toggleBtn = document.getElementById('toggle-card-list');
  const listContainer = document.getElementById('card-list-container');
  

  function displayCard() {
    const card = flashcards[currentCard];
    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    flashcardElement.classList.remove('is-flipped');
  }

  function showScore(){
    guessesRight=0;
    for (let index = 0; index < flashcards.length; index++){
      if (flashcards[index].check) {
        guessesRight++; 
      }
    }
    document.getElementById('score').innerText=guessesRight+'/'+flashcards.length;
  }

  function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }

  function renderCardList() {
    cardListElement.innerHTML = '';

    flashcards.forEach((card, index) => {
      const btn = document.createElement('button');
      btn.className = 'card-button';
      btn.textContent = card.question;
      btn.addEventListener('click', () => {
        currentCard = index;
        displayCard();
      });
      cardListElement.appendChild(btn);
    });
  }

  function displayPracticeCard() { 
    const card = practiceCards[practiceIndex];
    card.check=null;
    document.getElementById('practice-question').textContent = card.question;
    document.getElementById('practice-card').classList.remove('is-flipped');
    document.getElementById('practice-answer').textContent = '';
    setTimeout(()=>{
      document.getElementById('practice-answer').textContent = card.answer;
    }, 500)
  }

  function disableFeedbackButtons() {
    document.getElementById('practice-right').disabled = true;
    document.getElementById('practice-wrong').disabled = true;
  }

  function enableFeedbackButtons() {
    document.getElementById('practice-right').disabled = false;
    document.getElementById('practice-wrong').disabled = false;
  }

  //Botão Praticar para iniciar a revisão espaçada
  document.getElementById('practice').addEventListener('click', () => {
    if (flashcards.length === 0){ 
      return alert("Nenhum card para praticar.");
    }

    practiceCards = [...flashcards];
    practiceIndex = 0;
    practiceRight = 0;
    practiceWrong = 0;
    
    document.getElementById('bottom-buttons').style.display = 'none';
    document.getElementById('toggle-card-list').style.display = 'none';
    document.getElementById('card-list-container').style.display = 'none';
    document.getElementById('card').style.display = 'none';
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('practice-section').style.display = 'block';
    displayPracticeCard();
  });

  //Botão Acertou da revisão espaçada, o tratamento diferente por isso outro botão foi criado
  document.getElementById('practice-right').addEventListener('click', () => {
    practiceCards[practiceIndex].check=true;
    practiceRight++;
    disableFeedbackButtons();
  });

  //Botão Errou da revisão espaçada, o tratamento diferente por isso outro botão foi criado
  document.getElementById('practice-wrong').addEventListener('click', () => {
    practiceCards[practiceIndex].check=false;
    practiceWrong++;
    disableFeedbackButtons();
  });

  //Botão Próxima da revisão espaçada que passa para o próximo card
  document.getElementById('next-practice-card').addEventListener('click', () => {
    if (practiceIndex < practiceCards.length - 1) {
      if (practiceCards[practiceIndex].check!=null) { 
        practiceIndex++;
        enableFeedbackButtons();
        displayPracticeCard(); 
      }
    } else {
      if (practiceCards[practiceIndex].check!=null) {
        document.getElementById('practice-section').style.display = 'none';
        document.getElementById('practice-summary').style.display = 'block';
        document.getElementById('practice-stats').textContent ='Acertos: '+practiceRight +', Erros: '+practiceWrong+', Total: '+practiceCards.length;
      }
    }
  });

  //Botão Virar Card da revisão espaçada
  document.getElementById('practice-flip-card').addEventListener('click', () => {
    document.getElementById('practice-card').classList.toggle('is-flipped');
  });

  //Botão Acertou
  document.getElementById('right').addEventListener('click', () => {
    if (flashcards.length>0) {
      document.getElementById('score-container').style.visibility='visible'
    }
    flashcards[currentCard].check = true;
    saveFlashcards();
    showScore();
  });

  //Botão Errou
  document.getElementById('wrong').addEventListener('click', () => {
    if (flashcards.length>0) {
      document.getElementById('score-container').style.visibility='visible'
    }
    flashcards[currentCard].check = false;
    saveFlashcards();
    showScore();
  });

  //Botão Virar card
  document.getElementById('flip-card').addEventListener('click', () => {
    flashcardElement.classList.toggle('is-flipped');
  });

  //Botão Adicionar
  document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newQuestion = document.getElementById('new-question').value.trim();
    const newAnswer = document.getElementById('new-answer').value.trim();

    if (newQuestion && newAnswer) {
      flashcards.push({ question: newQuestion, answer: newAnswer, check: null });
      currentCard = flashcards.length - 1;
      saveFlashcards();
      displayCard();
      renderCardList();

      document.getElementById('new-question').value = '';
      document.getElementById('new-answer').value = '';
    }
  });

  //Botão ✏️ de editar card
  document.getElementById('edit').addEventListener('click', () => {
    if (flashcards.length === 0) return;

    const editedQuestion = prompt('Editar pergunta:', flashcards[currentCard].question);
    const editedAnswer = prompt('Editar resposta:', flashcards[currentCard].answer);

    if (editedQuestion !== null && editedAnswer !== null) {
      flashcards[currentCard].question = editedQuestion.trim();
      flashcards[currentCard].answer = editedAnswer.trim();
      saveFlashcards();
      displayCard();
      renderCardList();
    }
  });

  //Botão Selecionar Card
  toggleBtn.addEventListener('click', () => {
    listContainer.classList.toggle('expanded');
    toggleBtn.textContent = listContainer.classList.contains('expanded')
      ? 'Selecionar Card ⇧'
      : 'Selecionar Card ⇩';
      renderCardList();
  });

  //Botão ❌ de deletar uma carta
  document.getElementById('delete').addEventListener('click', () => {
    if (flashcards.length === 0) return;

    const confirmDelete = confirm('Tem certeza que deseja excluir este cartão?');
    if (confirmDelete) {
      flashcards.splice(currentCard, 1);
      currentCard = 0;
      saveFlashcards();
      renderCardList();
      if (flashcards.length > 0) {
        displayCard();
      } else {
        questionElement.textContent = 'Pergunta';
        answerElement.textContent = 'Resposta';
      }
      showScore();
    }
  });

  //Botão ❔ de mostrar como funciona o App
  document.getElementById('help').addEventListener('click',()=>{
    var howToUse;
    if(practiceCards.length==0){
      howToUse= 'Como Usar: \n1. Clique em Adicionar para criar um novo flashcard;';
      howToUse=howToUse+'\n2. Clique em Virar card para ver a resposta;';
      howToUse=howToUse+'\n3. Clique em Selecionar card para ver, editar e/ou excluir os cards existentes;';
      howToUse=howToUse+'\n4. Clique em ✏️ em um card para editá-lo;';
      howToUse=howToUse+'\n5. Clique em ❌ em um card para deletá-lo;';
      howToUse=howToUse+'\n6. Use o botão Praticar para iniciar uma revisão espaçada;';
    }
    else{
      howToUse= 'Como funciona a prática: \n1. Aparecerá um flashcard com uma pergunta;';
      howToUse=howToUse+'\n2. Pense um pouco sobre a respota e depois clique em Virar card para ver se acertou;';
      howToUse=howToUse+'\n3. Clique em Acertou ou Errou;';
      howToUse=howToUse+'\n4. Clique Próximo para ver um novo card, mas você só poderá passar pra um próximo caso tenha respondido o card atual;';
      howToUse=howToUse+'\n5. Ao final, poderá ver quantas você acertou e quantas errou;';
      
    }
    confirm(howToUse);
  });

  renderCardList();
  displayCard();
});
