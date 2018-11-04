import messages from '../data/messages';
import data from '../data/questions';
import getMappedQuestions from './getMappedQuestions';

import round from 'lodash/round';
import mean from 'lodash/mean';

const notEmpty = x => !!x;

const getFlattenedQuestions = (questions, result = []) => {
  questions.forEach(question => {
    result.push(question);
    if (question.subQuestions) {
      getFlattenedQuestions(question.subQuestions, result);
    }
    if (question.type !== "likert" &&  question.type !== "checkbox" && question.options) {
      getFlattenedQuestions(question.options, result);
    }
  });
  return result;
};

const answerValues = {
  Always: 5,
  Often: 4,
  Sometimes: 3,
  Rarely: 2,
  Never: 1
};

const calculateResults = (questions, answers) => {
  const questionMap = getMappedQuestions(questions);
  const categoryValues = {};
  const categoryModifiers = {};

  Object.keys(answers).forEach(path => {
    const question = questionMap[path];
    const { category } = question;
    const answer = answers[path];
    let value = answerValues[answer];

    if (question.type === 'eitherOr') {
      question.options.forEach(option => {
        categoryModifiers[option.category] = categoryModifiers[option.category] || 0;
        if (answer === option.category) {
          categoryModifiers[option.category] += 1;
        } else {
          categoryModifiers[option.category] -= 1;
        }
      })
    }

    if (!category) {
      return;
    }

    categoryValues[category] = categoryValues[category] || [];
    if (value) {
      if (question.reversed) {
        value = 6 - value;
      }
      categoryValues[category].push(value);
    }
  });

  return Object.keys(categoryValues).reduce((acc, key) => {
    const array = categoryValues[key];
    let average = mean(array);
    const modifier = categoryModifiers[key];

    if (modifier) {
      average += modifier > 0 ? modifier * 0.5 : modifier * 0.25;
    }
    let score = average >= 4 ? 0 : average <= 2 ? 2 : 1;

    acc[key] = { score, average }
    return acc;
  }, {});
};

const calculateLeadershipScore = array => {
  const transactional = array.slice(2, 4);
  const transformational = [...array.slice(0, 2), ...array.slice(4)];

  const transactionalAverage = mean(transactional);
  const transformationalAverage = mean(transformational);

  const score = transactionalAverage > transformationalAverage ? 0 : 1;
  const profile = score === 0 ? "Transformational" : "Transactional";
  return { score, profile };
};

const getMessage = (messages, score, category) => {
  return messages[category].messages[score];
};

const getResults = answers => {
  const mappedQuestions = getMappedQuestions(data.questions);

  const leadershipOptions = Object.keys(mappedQuestions).map(key => {
    return mappedQuestions[key];
  }).filter(question => question.category === "LP").sort((a, b) => {
    return a - b;
  } ).map(question => {
    return answers[question.path];
  });

  const { profile: leadershipProfile, score: leadershipScore } = calculateLeadershipScore(leadershipOptions);

  const results = calculateResults(data.questions, answers);
  results.LP.score = leadershipScore;

  const categories = [ "TW", "CM", "CO", "SO", "AO", "GR", "SA", "PA", "SC", "PR", "LP" ];
  const scores = categories.map(category => results[category] ? results[category].score : null);
  const averages = categories.map(category => results[category] ? results[category].average : null).filter(notEmpty);

  scores[scores.length-1] = leadershipScore;

  const returnedMessages = Object.keys(results).reduce((acc, category) => {
    const key = `message${category}`;
    const { score } = results[category];

    acc[key] = getMessage(messages, score, category);
    return acc;
  }, {});


  let motivators = {
    Collaboration: {},
    Empathy: {},
    Drive: {},
    Focus: {},
    Judgment: {}
  };

  let motivatorScores = {
    Collaboration: 0,
    Empathy: 0,
    Drive: 0,
    Focus: 0,
    Judgment: 0
  };

  motivators.Collaboration.mainMessage = `${returnedMessages.messageTW} ${
    returnedMessages.messageCM
  } ${returnedMessages.messageCO}`;
  motivators.Collaboration.mainScale = round(
    mean([averages[0], averages[1], averages[2]]),
    2
  );
  motivatorScores.Collaboration = motivators.Collaboration.mainScale;

  motivators.Collaboration.options = [
    {
      title: "Teamwork",
      message: returnedMessages.messageTW,
      scale: round(averages[0], 2)
    },
    {
      title: "Conflict Management",
      message: returnedMessages.messageCM,
      scale: round(averages[1], 2)
    },
    {
      title: "Coaching/Mentoring",
      message: returnedMessages.messageCO,
      scale: round(averages[2], 2)
    }
  ];

  motivators.Empathy.mainMessage = `${returnedMessages.messageSO}`;
  motivators.Empathy.mainScale = round(mean([averages[3]]), 2);
  motivatorScores.Empathy = motivators.Empathy.mainScale;
  motivators.Empathy.options = [
    {
      title: "Social Awareness",
      message: returnedMessages.messageSO,
      scale: round(averages[3], 2)
    }
  ];

  motivators.Drive.mainMessage = `${returnedMessages.messageAO} ${returnedMessages.messageAD} ${
    returnedMessages.messageGR
  }`;
  motivators.Drive.mainScale = round(
    mean([averages[4], averages[5], averages[6]]),
    2
  );
  motivatorScores.Drive = motivators.Drive.mainScale;
  motivators.Drive.options = [
    {
      title: "Achievement Orientation",
      message: returnedMessages.messageAO,
      scale: round(averages[4], 2)
    },
    {
      title: "Adaptability",
      message: returnedMessages.messageAD,
      scale: round(averages[5], 2)
    },
    {
      title: "Grit",
      message: returnedMessages.messageGR,
      scale: round(averages[6], 2)
    }
  ];

  motivators.Focus.mainMessage = `${returnedMessages.messageSA} ${returnedMessages.messagePA}`;
  motivators.Focus.mainScale = round(mean([averages[7], averages[8]]), 2);
  motivatorScores.Focus = motivators.Focus.mainScale;
  motivators.Focus.options = [
    {
      title: "Self-Awareness",
      message: returnedMessages.messageSA,
      scale: round(averages[7], 2)
    },
    {
      title: "Positive Attitude",
      message: returnedMessages.messagePA,
      scale: round(averages[8], 2)
    }
  ];

  motivators.Judgment.mainMessage = `${returnedMessages.messageSC} ${
    returnedMessages.messagePR
  }`;
  motivators.Judgment.mainScale = round(mean([averages[9], averages[10]]), 2);
  motivatorScores.Judgment = motivators.Judgment.mainScale;
  motivators.Judgment.options = [
    {
      title: "Self-Control",
      message: returnedMessages.messageSC,
      scale: round(averages[9], 2)
    },
    {
      title: "Professionalism",
      message: returnedMessages.messagePR,
      scale: round(averages[10], 2)
    }
  ];

  return {
    messages: returnedMessages,
    scores,
    averages,
    leadershipProfile,
    motivators,
    motivatorScores
  };
};

export default getResults;
