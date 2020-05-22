import React from 'react';
import Button from './Button.js';

const QuestionList = ({ list, onDismiss }) => (
  <div>
    {list.map((item, index) => (
      <div className="question-container" key={item.id}>
        <div className="question-header">
          <Button title="Delete Question" onClick={() => onDismiss(item.id)}>
            x
          </Button>
          Question {index + 1} of {list.length}
        </div>
        <div className="question">{item.question}</div>
        {item.answers.map((answer, i) => {
          return i === item.correctAnswer ? (
            <div className="answer correct" key={i}>
              {answer}
            </div>
          ) : (
            <div className="answer" key={i}>
              {answer}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

export default QuestionList;
