const getMappedQuestions = (questions, result={}, parentId='') => {
  questions.forEach(question => {
    const id = parentId ? `${parentId}/${question.id}` : question.id; 
    question.path = id;
    result[id] = question;
    if (question.subQuestions) {
      getMappedQuestions(question.subQuestions, result, id);
    }
    if (question.type === "drag-and-drop" && question.options) {
      getMappedQuestions(question.options, result, id);
    }
  })
  return result;
}

export default getMappedQuestions;
