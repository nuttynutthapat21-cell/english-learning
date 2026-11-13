
        if (!answered) {
          score.quiz++;
          saveScore();
          markPracticed();   
        }


              score.speak++;
      saveScore();
      markPracticed();       
      setTimeout(goNext, 1500);

