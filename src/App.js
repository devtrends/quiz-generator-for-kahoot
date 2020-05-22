import React, { Component } from 'react';
import Button from './Button.js';
import QuestionList from './QuestionList.js';
import XLSX from 'xlsx';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      isLoaded: false,
      error: null,
      list: [],
    };
    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.createQuiz = this.createQuiz.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  createQuiz() {
    let { list } = this.state;

    const template_url =
      'https://kahoot.com/files/2019/08/Kahoot-Quiz-Spreadsheet-Template.xlsx';

    var req = new XMLHttpRequest();
    req.open('GET', template_url, true);
    req.responseType = 'arraybuffer';

    req.onload = function (e) {
      var data = new Uint8Array(req.response);
      var workbook = XLSX.read(data, { type: 'array' });
      var worksheet = workbook.Sheets['Sheet1'];
      XLSX.utils.sheet_add_json(
        worksheet,
        list.map(item => {
          const question = {};

          question.question = item.question;
          question.answer1 = item.answers[0];
          question.answer2 = item.answers[1];
          question.answer3 = item.answers[2];
          question.answer4 = item.answers[3];
          question.timeout = 20;
          question.correct_answer = item.correctAnswer + 1;

          return question;
        }),
        { skipHeader: true, origin: { r: 8, c: 1 } }
      );

      XLSX.writeFile(workbook, 'quiz.xlsx');
    };

    req.send();
  }

  fetchQuestions() {
    let { counter } = this.state;

    fetch('https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986')
      .then(res => res.json())
      .then(
        result => {
          const questions = result.results.map(result => {
            const question = {
              id: counter++,
              question: decodeURIComponent(result.question),
              answers: [
                decodeURIComponent(result.incorrect_answers[0]),
                decodeURIComponent(result.incorrect_answers[1]),
                decodeURIComponent(result.incorrect_answers[2]),
              ],
            };
            question.correctAnswer = Math.floor(Math.random() * 4);
            question.answers.splice(
              question.correctAnswer,
              0,
              decodeURIComponent(result.correct_answer)
            );
            return question;
          });

          this.setState(prevState => ({
            isLoaded: true,
            counter,
            list: [...questions, ...prevState.list],
          }));
        },
        error => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter(x => x.id !== id);

    this.setState({ list: updatedList });
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  render() {
    const { error, isLoaded, list } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="App">
          <div className="header">
            <h2>
              Kahoot Quiz Generator - {list.length}{' '}
              {list.length === 1 ? 'Question' : 'Questions'}
            </h2>

            <p>
              This page retrieves random questions from the{' '}
              <a href="https://opentdb.com/">Open Trivia DB</a> and allows users
              to generate an Excel file (XLSX) that is compatible with the{' '}
              <a href="https://kahoot.com">Kahoot Quiz Platform</a>.
            </p>
            <Button onClick={this.fetchQuestions}>Add More Questions</Button>
            {list.length ? (
              <Button onClick={this.createQuiz}>Download Kahoot XLSX</Button>
            ) : null}
          </div>
          <QuestionList list={list} onDismiss={this.onDismiss} />
        </div>
      );
    }
  }
}

export default App;
