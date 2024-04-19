import { constants } from "../config";
import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (
  order = constants.ORDER_NEWEST,
  search = ""
) => {
  const res = await api.get(
    `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
  );

  return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

  return res.data;
};

// To add Questions
const addQuestion = async (q) => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  return res.data;
};

const reportQuestion = async (qid) => {
  const res = await api.post(`${QUESTION_API_URL}/reportQuestion`, { qid });
  return res.data;
};

const getReportedQuestions = async () => {
  const res = await api.get(`${QUESTION_API_URL}/getReportedQuestions`);

  return res.data;
};

const deleteQuestion = async (qid) => {
  const res = await api.delete(`${QUESTION_API_URL}/deleteQuestion/${qid}`);

  return res.data;
};

const resolveQuestion = async (qid) => {
  const res = await api.post(`${QUESTION_API_URL}/resolveQuestion/${qid}`);

  return res.data;
};

const getTrendingQuestions = async () => {
  const res = await api.get(`${QUESTION_API_URL}/getTrendingQuestions`);
  return res.data;
};

export {
  getQuestionsByFilter,
  reportQuestion,
  getQuestionById,
  addQuestion,
  getReportedQuestions,
  deleteQuestion,
  resolveQuestion,
  getTrendingQuestions,
};
