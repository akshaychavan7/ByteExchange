import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

const reportComment = async (cid) => {
  const res = await api.post(`${COMMENT_API_URL}/reportComment`, { cid });
  return res.data;
};

const postComment = async (data) => {
  const res = await api.post(`${COMMENT_API_URL}/addComment`, data);

  return res.data;
};

const ANSWER_API_URL = `${REACT_APP_API_URL}/comment`;


const getReportedComments = async () => {
    const res = await api.get(`${ANSWER_API_URL}/getReportedComments`);

    return res.data;
}

const deleteComment = async (cid) => {
    const res = await api.delete(`${ANSWER_API_URL}/deleteComment/${cid}`);

    return res.data;
}

const resolveComment = async (cid) => {
    const res = await api.post(`${ANSWER_API_URL}/resolveComment/${cid}`);

    return res.data;
}

export {reportComment, postComment, getReportedComments, deleteComment, resolveComment }
