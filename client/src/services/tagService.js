import { REACT_APP_API_URL, api, PYTHON_SERVER_URL } from "./config";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

const getTagsWithQuestionNumber = async () => {
  const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);

  return res.data;
};

const getSuggestedTags = async (requestObject) => {
  const res = await api.post(
    `${PYTHON_SERVER_URL}/tag/generateTags/`,
    requestObject
  );
  return res;
};

export { getTagsWithQuestionNumber, getSuggestedTags };
