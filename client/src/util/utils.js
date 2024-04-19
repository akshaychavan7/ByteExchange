export const imageDataToImage = (dataURL) => {
  const image = new Image();
  image.src = dataURL;
  return image;
};

export const isValidEmail = (email) => {
  // regex to validate email
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};

export const getDurationPassed = (date) => {
  date = new Date(date);
  let now = new Date();
  let diff = now - date;
  diff /= 1000;
  if (diff < 60) {
    return Math.floor(diff) + " seconds ago";
  }
  diff /= 60;
  if (diff < 60) {
    return Math.floor(diff) + " minutes ago";
  }
  diff /= 60;
  if (diff < 24) {
    return Math.floor(diff) + " hours ago";
  }
  diff /= 24;
  if (diff < 30) {
    return Math.floor(diff) + " days ago";
  }
  diff /= 30;
  if (diff < 12) {
    return Math.floor(diff) + " months ago";
  }
  return Math.floor(diff / 12) + " years ago";
};

export const memberSince = (date) => {
  let duration = getDurationPassed(date);
  duration = duration.slice(0, duration.length - 4);
  return duration;
};

export const sortByActiveOrder = (qList) => {
  // sort each questions answers so that newest answer is at 0th position
  qList = qList.map((question) => {
    question.answers.sort((a, b) => {
      const dateA = new Date(a.ans_date_time);
      const dateB = new Date(b.ans_date_time);
      return dateB - dateA;
    });
    return question;
  });

  // finally sort based on most recent answer
  qList.sort((a, b) => {
    if (a.answers.length == 0) return 1;
    if (b.answers.length == 0) return -1;
    const dateA = new Date(a.answers[0]?.ans_date_time);
    const dateB = new Date(b.answers[0]?.ans_date_time);
    return dateB - dateA;
  });

  console.log("qList after sorting", qList);

  return qList;
};
