import data from '../data/questions.json';
import getMappedQuestions from './getMappedQuestions';

getMappedQuestions(data.questions);

const parseNumberAnswer = (number_answer, default_value = 0) => {
  if (!number_answer) {
    return default_value;
  }
  return parseFloat(number_answer.replace(/[^\d\.]/g,''));
}

const validators = {
  'email': (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value),
  'number': (value) => {
    let number = parseNumberAnswer(value);
    return !isNaN(number);
  },
  'max_length': (value, maxLength) => {
    return value !== undefined && value.length <= maxLength;
  },
  'select_range': (value, minSelect, maxSelect) => {
    const selected = countSelected(value);
    return minSelect <= selected && selected <= maxSelect;
  },
};

export function getSubName(question, subQuestion) {
  return `${question.name}-${subQuestion.name}`;
}

export function getSelected(values) {
  if (!values) {
    return [];
  }
  return Object.keys(values).filter(val => values[val]);
}

export function countSelected(values) {
  return getSelected(values).length;
}

function validateSubQuestions(values, question) {
  let errors = {};
  question.subQuestions.forEach(subQuestion => {
    let subName = getSubName(question, subQuestion);
    let testQuestion = {...subQuestion, name: subName};
    errors = {...errors, ...validateValuesForQuestion(values, testQuestion)};
  });
  return errors;
}

function validateQuestion(values, question) {
  let errors = {};
  let value = values[question.path];
  if (question.required && !value) {
    errors[question.path] = question.requiredMessage;
  } else if (question.validate) {
    if(question.validate in validators) {
      if(!validators[question.validate](value, ...question.validate_args)) {
        errors[question.path] = question.invalid_message;
      }
    } else {
      console.error('Unknown validate found', question.validate)
    }
  }
  return errors;
}

function validateValuesForQuestion(values, question) {
    let errors = {};
    errors = validateQuestion(values, question);
    if (question.subQuestions) {
      errors = {...errors, ...validateSubQuestions(values, question)};
    }
    return errors;
}

const validate = values => {
  let errors = {};
  data.questions.forEach(question => {
    let questionErrors = validateValuesForQuestion(values, question);
    errors = {...errors, ...questionErrors};
  });
  return errors;
}

export default validate;
