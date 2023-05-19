class StarWarsQuiz {
    constructor() {
      this.baseURL = 'https://swapi.py4e.com/api'; // Bas-URL för att hämta data från SWAPI
      this.currentQuestion = 0; // Aktuell fråga
      this.score = 0; // Poäng
      this.questions = []; // Array för att lagra frågor
      this.choices = []; // Array för att lagra svarsalternativ
      this.correctAnswer = null; // Rätt svar
      this.fetchData(); // Metod för att hämta data från SWAPI
    }
  
    async fetchData() {
      try {
        const charactersResponse = await fetch(`${this.baseURL}/people/`);
        const charactersData = await charactersResponse.json();
        this.questions = charactersData.results.map((character) => character.name); // Hämtar karaktärernas namn och lägger till dem i frågearrayen
  
        const filmsResponse = await fetch(`${this.baseURL}/films/`);
        const filmsData = await filmsResponse.json();
        filmsData.results.forEach((film) => {
          this.choices.push(film.title); // Lägger till filmtitlar i svarsalternativsarrayen
          if (film.characters.includes(charactersData.results[this.currentQuestion].url)) {
            this.correctAnswer = film.title; // Sparar det korrekta svaret baserat på karaktärens URL
          }
        });
  
        this.showQuestion(); // Visar första frågan
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    }
  
    showQuestion() {
      if (this.currentQuestion < this.questions.length) {
        const questionElement = document.getElementById('question');
        const choicesElement = document.getElementById('choices');
        const submitButton = document.getElementById('submit-btn');
        const scoreElement = document.getElementById('score');
  
        questionElement.textContent = `Who appeared in the movie "${this.choices[this.currentQuestion]}"?`; // Visar frågan med aktuell filmtitel
  
        choicesElement.innerHTML = '';
        this.choices.forEach((choice) => {
          const li = document.createElement('li');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'choice';
          input.value = choice;
          li.appendChild(input);
          li.appendChild(document.createTextNode(choice));
          choicesElement.appendChild(li);
        });
  
        submitButton.disabled = true;
  
        scoreElement.textContent = `Score: ${this.score}/${this.currentQuestion}`;
  
        const radios = document.querySelectorAll('input[name="choice"]');
        radios.forEach((radio) => {
          radio.addEventListener('change', () => {
            submitButton.disabled = false;
          });
        });
  
        submitButton.addEventListener('click', () => {
          this.checkAnswer();
        });
      } else {
        this.showResult();
      }
    }
  
    checkAnswer() {
      const selectedAnswer = document.querySelector('input[name="choice"]:checked').value; // Hämtar det valda svaret
  
      if (selectedAnswer === this.correctAnswer) {
        this.score++; // Ökar poängen om svaret är korrekt
      }
  
      this.currentQuestion++; // Ökar indexet för aktuell fråga
      this.showQuestion(); // Visar nästa fråga
    }
  
    showResult() {
      const quizContainer = document.getElementById('quiz-container');
      quizContainer.innerHTML = `
        <h1>Quiz Result</h1>
        <p>Your score: ${this.score}/${this.questions.length}</p>
        <button onclick="location.reload()">Restart Quiz</button>
      `;
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const quiz = new StarWarsQuiz(); // Skapar en ny instans av StarWarsQuiz när sidan har laddats
  });
  