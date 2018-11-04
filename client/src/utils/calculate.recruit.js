import results from '../data/results.json';
import data from '../data/questions.json';
const round = require('lodash/round');
const mean = require('lodash/mean');

const categorizeAnswers = answers => {
  const valueNames = Object.keys(answers);
  const getAnswers = category => valueNames.filter(value => value.includes(category));

  const isReversed = questionName => {
    const selectedQuestion = data.questions.filter(question => question.name === questionName)[0];
    return selectedQuestion.reversed === 'true';
  };

  const getQuestionValue = questionName => {
    const answerValues = {
      Consistently: 5,
      Often: 4,
      Sometimes: 3,
      Rarely: 2,
      Never: 1
    }

    let value = answerValues[answers[questionName]];
    if (isReversed(questionName)) {
      value = 6 - value;
    }
    return value;
  };

  const categories = [
    "TM",
    "CM",
    "CO",
    "SL",
    "AO",
    "AD",
    "GR",
    "PR",
    "SA",
    "SC",
    "PA",
    "IM",
    "LP",
  ];

  const categorizedAnswers = categories.map(category => getAnswers(category).map(getQuestionValue));

  return categorizedAnswers;
}

const getAverage = array => {
  let num = 0, length = array.length;
  if (!length) return 0;
  for (let i = 0; i < length; i++) {
    if (array[i] != undefined) {
      num += parseInt(array[i], 10);
    }
  }
  return num/length;
}

const calculateScore = (array, getAverage) => {
  let score;
  let average = getAverage(array);

  if (average >= 4) {
    score = 'High';
  } else if (average <= 2) {
    score = 'Low';
  } else {
    score = 'Medium';
  }

  return { score, average };
}

const calculateLeadershipScore = (answers, array, getAverage) => {
  let score;
  let average = getAverage(array);

  if ((answers['LP0'] === 'Leadership' || answers['LP0'] === 'I don\'t know') && average >= 3.5) {
    score = 'Transformation Leader';
  } else {
    score = 'Transactional Leadership';
  }
  return { score, average };
}

const getMessage = (results, score, category) => {
  let message;
  results.results.forEach(object => {
    if (object.category === category) {
      object.messages.forEach(element => {
        if (element.score === score) {
          message = element.message
        }
      })
    }
  });
  return message;
}

const getResults = (answers, categorizeAnswers) => {
  const categorizedAnswers = categorizeAnswers(answers);

  const scores = [];
  const averages = [];
  const leadershipScore = calculateLeadershipScore(answers, categorizedAnswers[12], getAverage);
  const leadershipProfile = leadershipScore.score;

  const getScores = categorizedAnswers => {
    for (let i = 0; i < categorizedAnswers.length -1; i++) {
      let score = calculateScore(categorizedAnswers[i], getAverage);
      scores.push(score.score);
      averages.push(score.average);
    }
    scores.push(leadershipProfile);
    averages.push(leadershipScore.average);
  }

  getScores(categorizedAnswers);

  const messageTM = getMessage(results, scores[0], "TM");
  const messageCM = getMessage(results, scores[1], "CM");
  const messageCO = getMessage(results, scores[2], "CO");
  const messageSL = getMessage(results, scores[3], "SL");
  const messageAO = getMessage(results, scores[4], "AO");
  const messageAD = getMessage(results, scores[5], "AD");
  const messageGR = getMessage(results, scores[6], "GR");
  /* const messagePR = getMessage(results, scores[7], "PR"); -- This answer set is not being evaluated at this time */
  const messageSA = getMessage(results, scores[8], "SA");
  const messageSC = getMessage(results, scores[9], "SC");
  const messagePA = getMessage(results, scores[10], "PA");
  const messageIM = getMessage(results, scores[11], "IM");
  const messageLP = getMessage(results, scores[12], "LP");

  const messages = {
    messageTM,
    messageCM,
    messageCO,
    messageSL,
    messageAO,
    messageAD,
    messageGR,
    messageSA,
    messageSC,
    messagePA,
    messageIM,
    messageLP
  }

  let motivators = {
    'Collaboration' : {},
    'Empathy': {},
    'Drive': {},
    'Focus': {},
    'Inspiration': {}
  }
  motivators.Collaboration.mainMessage = `${messageTM} ${messageCM} ${messageCO}`;
  motivators.Collaboration.mainScale = _.round(_.mean([averages[0], averages[1], averages[2]]), 2);
  motivators.Collaboration.questions = {
    mainTitle: 'Question lorem ipsum',
    mainMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus ea, error tempore ducimus, repellat veniam amet dicta ipsum, vel eos aut praesentium porro neque, ipsam minus autem tenetur! Eum!?',
    subTitle: 'How to lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, excepturi.?',
    subMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod magnam architecto et, nemo, distinctio quas tenetur facere sapiente reprehenderit, necessitatibus ab. Molestias doloribus, neque natus!?',
  }
  motivators.Collaboration.options = [{
    title: 'Teamwork',
    message: messageTM,
    scale: _.round(averages[0], 2)
  }, {
    title: 'Conflict Management',
    message: messageCM,
    scale: _.round(averages[1], 2)
  }, {
    title: 'Coaching/Mentoring',
    message: messageCO,
    scale: _.round(averages[2], 2)
  }];

  motivators.Empathy.mainMessage = `${messageSL}`;
  motivators.Empathy.mainScale = _.round(_.mean([averages[3]]), 2);
  motivators.Empathy.questions = {
    mainTitle: 'Question lorem ipsum',
    mainMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus ea, error tempore ducimus, repellat veniam amet dicta ipsum, vel eos aut praesentium porro neque, ipsam minus autem tenetur! Eum!?',
    subTitle: 'How to lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, excepturi.?',
    subMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod magnam architecto et, nemo, distinctio quas tenetur facere sapiente reprehenderit, necessitatibus ab. Molestias doloribus, neque natus!?',
  }
  motivators.Empathy.options = [{
    title: 'Social Awareness',
    message: messageSL,
    scale: _.round(averages[3], 2)
  }];

  motivators.Drive.mainMessage = `${messageAO} ${messageAD} ${messageGR}`;
  motivators.Drive.mainScale = _.round(_.mean([averages[4], averages[5], averages[6]]), 2);
  motivators.Drive.questions = {
    mainTitle: 'Question lorem ipsum',
    mainMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus ea, error tempore ducimus, repellat veniam amet dicta ipsum, vel eos aut praesentium porro neque, ipsam minus autem tenetur! Eum!?',
    subTitle: 'How to lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, excepturi.?',
    subMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod magnam architecto et, nemo, distinctio quas tenetur facere sapiente reprehenderit, necessitatibus ab. Molestias doloribus, neque natus!?',
  }
  motivators.Drive.options = [{
    title: 'Achievement Orientation',
    message: messageAO,
    scale: _.round(averages[4], 2)
  }, {
    title: 'Adaptability',
    message: messageAD,
    scale: _.round(averages[5], 2)
  }, {
    title: 'Grit',
    message: messageGR,
    scale: _.round(averages[6], 2)
  }];

  motivators.Focus.mainMessage = `${messageSA} ${messageSC} ${messagePA}`;
  motivators.Focus.mainScale = _.round(_.mean([averages[8], averages[9], averages[10]]), 2);
  motivators.Focus.questions = {
    mainTitle: 'Question lorem ipsum',
    mainMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus ea, error tempore ducimus, repellat veniam amet dicta ipsum, vel eos aut praesentium porro neque, ipsam minus autem tenetur! Eum!?',
    subTitle: 'How to lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, excepturi.?',
    subMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod magnam architecto et, nemo, distinctio quas tenetur facere sapiente reprehenderit, necessitatibus ab. Molestias doloribus, neque natus!?',
  }
  motivators.Focus.options = [{
    title: 'Self-Awareness',
    message: messageSA,
    scale: _.round(averages[8], 2)
  }, {
    title: 'Self-Control',
    message: messageSC,
    scale: _.round(averages[9], 2)
  }, {
    title: 'Positive Attitude',
    message: messagePA,
    scale: _.round(averages[10], 2)
  }];

  motivators.Inspiration.mainMessage = `${messageIM}`;
  motivators.Inspiration.mainScale = _.round(_.mean([averages[11]]), 2);
  motivators.Inspiration.questions = {
    mainTitle: 'Question lorem ipsum',
    mainMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus ea, error tempore ducimus, repellat veniam amet dicta ipsum, vel eos aut praesentium porro neque, ipsam minus autem tenetur! Eum!?',
    subTitle: 'How to lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, excepturi.?',
    subMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod magnam architecto et, nemo, distinctio quas tenetur facere sapiente reprehenderit, necessitatibus ab. Molestias doloribus, neque natus!?',
  }
  motivators.Inspiration.options = [{
    title: 'Inspiration/Motivation',
    message: messageIM,
    scale: _.round(averages[11], 2)
  }];

  return { messages, scores, averages, leadershipProfile, motivators };
}

module.exports.getResults = getResults;
module.exports.categorizeAnswers = categorizeAnswers;

