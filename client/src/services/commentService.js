import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

const reportComment = async (cid) => {
  const res = await api.post(`${COMMENT_API_URL}/reportComment`, { cid });
  return res.data;
};

export { reportComment };
