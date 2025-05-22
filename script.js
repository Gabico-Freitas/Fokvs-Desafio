document.addEventListener('DOMContentLoaded', () => {
  const flashcards = [
    { question: 'Quanto é 1 + 1?', answer: '2' },
    { question: 'Qual a cor do céu?', answer: 'Azul' },
    { question: 'Quanto é 5 × 3?', answer: '15' },
    { question: 'Capital do Brasil?', answer: 'Brasília' }
  ];

  let currentCard = 0;

  const flashcardElement = document.getElementById('card');
  const questionElement = document.getElementById('question');
  const answerElement = document.getElementById('answer');
  const cardListElement = document.getElementById('card-list');

  function displayCard() {
    const card = flashcards[currentCard];
    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    flashcardElement.classList.remove('is-flipped');
  }

  function renderCardList() {
    cardListElement.innerHTML = ''; // limpa lista

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

  document.getElementById('flip-card').addEventListener('click', () => {
    flashcardElement.classList.toggle('is-flipped');
  });

  document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newQuestion = document.getElementById('new-question').value.trim();
    const newAnswer = document.getElementById('new-answer').value.trim();

    if (newQuestion && newAnswer) {
      flashcards.push({ question: newQuestion, answer: newAnswer });
      currentCard = flashcards.length - 1;
      displayCard();
      renderCardList();

      document.getElementById('new-question').value = '';
      document.getElementById('new-answer').value = '';
    }
  });

  // Inicialização
  renderCardList();
  displayCard();
});
