// Setup database with initial test data.
const mongoose = require("mongoose");

const { MONGO_URL } = require("./config");

mongoose.connect(MONGO_URL);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let Tag = require("./models/tags");
let Answer = require("./models/answers");
let Question = require("./models/questions");
let User = require("./models/users");
let Comment = require("./models/comments");

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(
  text,
  ans_by,
  ans_date_time,
  comments,
  vote_count,
  upvoted_by,
  downvoted_by,
  flag
) {
  let answerdetail = {
    description: text,
    vote_count: vote_count,
  };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (comments != false) answerdetail.comments = comments;
  if (upvoted_by != false) answerdetail.upvoted_by = upvoted_by;
  if (downvoted_by != false) answerdetail.downvoted_by = downvoted_by;
  if (flag != false) answerdetail.flag = flag;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(
  title,
  description,
  asked_by,
  ask_date_time,
  views,
  tags,
  answers,
  comments,
  vote_count,
  upvoted_by,
  downvoted_by,
  flag
) {
  let questiondetail = {
    title: title,
    description: description,
    asked_by: asked_by,
    vote_count: vote_count,
    tags: tags,
  };

  if (ask_date_time != false) questiondetail.ask_date_time = ask_date_time;
  if (views != false) questiondetail.views = views;
  if (answers != false) questiondetail.answers = answers;
  if (comments != false) questiondetail.comments = comments;
  if (upvoted_by != false) questiondetail.upvoted_by = upvoted_by;
  if (downvoted_by != false) questiondetail.downvoted_by = downvoted_by;
  if (flag != false) questiondetail.flag = flag;

  let question = new Question(questiondetail);
  return question.save();
}

function userCreate(user) {
  let userdetail = {
    username: user.username,
    password: user.password,
    firstname: user.firstName,
    lastname: user.lastName,
    userRole: user.role,
    profilePic: user.profilePic,
    technologies: user.technologies,
    location: user.location,
  };

  let userObj = new User(userdetail);
  return userObj.save();
}

function commentCreate(
  description,
  commented_by,
  comment_date_time,
  vote_count,
  upvoted_by,
  flag
) {
  let commentdetail = {
    description: description,
    commented_by: commented_by,
    comment_date_time: comment_date_time,
    vote_count: vote_count,
    flag: flag,
  };
  if (upvoted_by != false) commentdetail.upvoted_by = upvoted_by;

  let comment = new Comment(commentdetail);
  return comment.save();
}

const init = async () => {
  const users = [
    {
      username: "akshay",
      password: "$2b$10$ai5DvtSJZ9v8N7flii2f4unKMUHROUaiMoEgufocl/jnkD7MEQ/tS",
      firstName: "Akshay",
      lastName: "Chavan",
      role: "moderator",
      profilePic:
        "https://media.licdn.com/dms/image/D4D03AQF9WmGdmqrJMQ/profile-displayphoto-shrink_800_800/0/1692618347676?e=1718236800&v=beta&t=hVfMg8BIwFp429SB8_fKtBGMsw4pppqNpoJQRPnUBVI",
      technologies: ["JavaScript", "React", "TypeScript"],
      location: "Boston, MA",
    },
    {
      username: "hamkalo",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      role: "general",
      profilePic: null,
      technologies: ["Java", "Python"],
      location: "Stony Brook, NY",
    },
    {
      username: "shawn",
      password: "password",
      firstName: "Shiu",
      lastName: "Chen",
      role: "general",
      profilePic:
        "https://media.licdn.com/dms/image/D5635AQF6RnnnfLnHKg/profile-framedphoto-shrink_800_800/0/1704817671459?e=1713466800&v=beta&t=4JeVmgx6iTPpVXl9XklrUZMybK8xrFO7K_v8PU0DFdM",
      technologies: ["Angular", "Android", "Swift"],
      location: "Boston, MA",
    },
    {
      username: "vedant",
      password: "password",
      firstName: "Vedant Rishi",
      lastName: "Das",
      role: "general",
      profilePic:
        "https://media.licdn.com/dms/image/D4E35AQG8Yfomd408IA/profile-framedphoto-shrink_800_800/0/1704981593017?e=1713466800&v=beta&t=BQSjkAoBNo-AY8OeH17e3sxfLMiotPI076sXouEFask",
      technologies: ["Machine Learning", "Python"],
      location: "Boston, MA",
    },
    {
      username: "sam",
      password: "password",
      firstName: "Sameer",
      lastName: "Ahire",
      role: "general",
      profilePic:
        "https://media.licdn.com/dms/image/D4D03AQEuWmah1ZwmqQ/profile-displayphoto-shrink_800_800/0/1702163845668?e=1718236800&v=beta&t=jmnYmqQXxwOt9CJxdDIL-Br8yPt_fk67M64XT2Q9mTo",
      technologies: ["SQL", "Flutter"],
      location: "San Francisco, CA",
    },
    {
      username: "jane",
      password: "password",
      firstName: "Jane",
      lastName: "Doe",
      role: "general",
      profilePic: null,
      technologies: ["Android", "Flutter"],
      location: "Chicago, IL",
    },
    {
      username: "john",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      role: "general",
      profilePic: null,
      technologies: ["Ruby", "Go"],
      location: "Sunnyvale, CA",
    },
    {
      username: "sudhanva",
      password: "password",
      firstName: "Sudhanva",
      lastName: "Paturkar",
      role: "general",
      profilePic: null,
      technologies: ["Spring", "Java"],
      location: "Nagpur, India",
    },
    {
      username: "aditya",
      password: "password",
      firstName: "Aditya",
      lastName: "Deshpande",
      role: "general",
      profilePic: null,
      technologies: ["Typescript", "React"],
      location: "Pune, India",
    },
  ];

  let t1 = await tagCreate("react");
  let t2 = await tagCreate("javascript");
  let t3 = await tagCreate("android-studio");
  let t4 = await tagCreate("shared-preferences");
  let t5 = await tagCreate("storage");
  let t6 = await tagCreate("website");

  let user1 = await userCreate(users[0]);
  let user2 = await userCreate(users[1]);
  let user3 = await userCreate(users[2]);
  let user4 = await userCreate(users[3]);
  let user5 = await userCreate(users[4]);
  let user6 = await userCreate(users[5]);
  let user7 = await userCreate(users[6]);

  let comment1 = await commentCreate(
    "Nice!",
    user1,
    new Date("2023-11-23T08:24:00"),
    0,
    [],
    false,
    "https://media.licdn.com/dms/image/D4D03AQEuWmah1ZwmqQ/profile-displayphoto-shrink_800_800/0/1702163845668?e=1718236800&v=beta&t=jmnYmqQXxwOt9CJxdDIL-Br8yPt_fk67M64XT2Q9mTo"
  );
  let comment2 = await commentCreate(
    "This is very helpful",
    user2,
    new Date("2023-11-23T08:24:00"),
    0,
    [],
    false
  );
  let comment3 = await commentCreate(
    "Thank you! this helps a lot",
    user3,
    new Date("2023-11-23T08:24:00"),
    0,
    [],
    false
  );
  let comment4 = await commentCreate(
    "Does this works?",
    user4,
    new Date("2023-11-23T08:24:00"),
    0,
    [],
    false
  );

  let a1 = await answerCreate(
    "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
    user1,
    new Date("2023-11-23T01:02:00"),
    [comment2, comment3],
    2,
    [user2, user3, user4, user5],
    [user5],
    false
  );
  let a2 = await answerCreate(
    "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    user2,
    new Date("2023-11-23T01:02:00"),
    [comment1],
    3,
    [user1, user3, user4, user6],
    [],
    false
  );
  let a3 = await answerCreate(
    "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
    user3,
    new Date("2023-11-23T03:03:00"),
    [],
    0,
    [],
    [],
    false
  );
  let a4 = await answerCreate(
    "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
    user4,
    new Date("2023-11-23T03:24:00"),
    [],
    0,
    [],
    [],
    false
  );
  let a5 = await answerCreate(
    "I just found all the above examples just too confusing, so I wrote my own. ",
    user5,
    new Date("2023-11-23T04:24:00"),
    [],
    0,
    [],
    [],
    false
  );
  let a6 = await answerCreate(
    "Storing content as BLOBs in databases.",
    user3,
    new Date("2023-11-24T08:50:00"),
    [],
    -1,
    [],
    [user1],
    false
  );
  let a7 = await answerCreate(
    "Using GridFS to chunk and store content.",
    user2,
    new Date("2023-11-25T08:24:00"),
    [],
    0,
    [],
    [],
    false
  );
  let a8 = await answerCreate(
    "Store data in a SQLLite database.",
    user1,
    new Date("2023-11-25T11:24:00"),
    [],
    0,
    [],
    [],
    false
  );

  await questionCreate(
    "Programmatically navigate using React router",
    "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
    user3,
    new Date("2022-01-20T03:00:00"),
    23,
    [t1, t2],
    [a1, a2],
    [comment4],
    1,
    [user1, user2],
    [user4],
    false
  );
  await questionCreate(
    "android studio save string shared preference, start activity and load the saved string",
    "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
    user1,
    new Date("2023-01-10T11:24:30"),
    55,
    [t3, t4, t2],
    [a3, a4, a5],
    [],
    2,
    [user1, user2],
    [],
    false
  );
  await questionCreate(
    "Object storage for a web application",
    "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
    user1,
    new Date("2023-02-18T01:02:15"),
    200,
    [t5, t6],
    [a6, a7],
    [],
    -1,
    [],
    [user5],
    false
  );
  await questionCreate(
    "Quick question about storage on android",
    "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
    user2,
    new Date("2023-03-10T14:28:01"),
    103,
    [t3, t4, t5],
    [a8],
    [],
    0,
    [],
    [],
    false
  );
  if (db) {
    db.close();
  }
  console.log("done");
};

init().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
