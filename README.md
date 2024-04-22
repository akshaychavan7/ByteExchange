[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tekr69j1)
# Final Project CS5610

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EVgJQzqalH9LlZQtMVDxz5kB7eZv2nBwIKFDFYxDMzgohg?e=EPjgIF).

## List of features

For each feature give a name and a one line description.

Clearly indicate which feature is an additional feature for extra credit.

- Feature 1: Allowing user to sign up with first name, last name, email, password, location, and profile picture.

- Feature 2: Allowing user to login with email and password.

- Feature 3: Allowing user to view all questions ordered by trending, newest, active, and unanswered.

- Feature 4: Allowing user to post a question with title, body, and tags.

- Feature 5: AI suggestion for tags when posting a question based on title and description. (Additional Feature - Extra Credit)

- Feature 6: Allowing user to post an answer to a question.

- Feature 7: Allowing user to post a comment to a question or answer.

- Feature 8: Allowing user to upvote or downvote a question, answer, or comment.

- Feature 9: Allowing user to report a question, answer, or comment.

- Feature 10: ALlowing user to search for questions by title, body, or tags.

- Feature 11: Allowing user to view all tags and view all questions with a specific tag.

- Feature 12: Allowing user to view all other users and their profile information, including questions, answers.

- Feature 13: Allowing user to navigate each page with the sidebar.

- Feature 14: Allowing moderator to delete reported questions, answers, or comments.

- Feature 15: Allowing moderator to ignore reported questions, answers, or comments. 

- Feature 16: If page is not found, display a 404 page.

- Feature 17: Display question posted time in a human readable format.

## For each feature indicate the test

- Feature 1: testing/cypress/e2e/signUp.cy.js

- Feature 2: testing/cypress/e2e/signIn.cy.js

- Feature 3: testing/cypress/e2e/questionSequence.cy.js

- Feature 4: testing/cypress/e2e/askQuestion.cy.js

- Feature 5: testing/cypress/e2e/askQuestion.cy.js (Additional Feature - Extra Credit)

- Feature 6: testing/cypress/e2e/answerQuestion.cy.js

- Feature 7: testing/cypress/e2e/comment.cy.js

- Feature 8: testing/cypress/e2e/upvoteDownvote.cy.js

- Feature 9: testing/cypress/e2e/report.cy.js

- Feature 10: testing/cypress/e2e/search.cy.js

- Feature 11: testing/cypress/e2e/tags.cy.js

- Feature 12: testing/cypress/e2e/userProfile.cy.js

- Feature 13: testing/cypress/e2e/sidebar.cy.js

- Feature 14: testing/cypress/e2e/moderatorDelete.cy.js

- Feature 15: testing/cypress/e2e/moderatorIgnore.cy.js

- Feature 16: testing/cypress/e2e/notFoundPage.cy.js

- Feature 17: testing/cypress/e2e/duration.cy.js

## List of server endpoints

- Endpoint 1: GET /isUserAuthenticated

- Endpoint 2: GET /isUserModeratorAuthenticated

- Endpoint 3: POST /login/authenticate

- Endpoint 4: POST /login/register

- Endpoint 5: GET /question/getQuestion

- Endpoint 6: GET /question/getQuestionById/:questionId

- Endpoint 7: GET /question/getReportedQuestions

- Endpoint 8: POST /question/addQuestion

- Endpoint 9: POST /question/reportQuestion

- Endpoint 10: POST /question/resolveQuestion/:questionId

- Endpoint 11: DELETE /question/deleteQuestion/:questionId

- Endpoint 12: GET /question/getTrendingQuestions

- Endpoint 13: GET /tag/getTagsWithQuestionNumber

- Endpoint 14: GET /answer/getReportedAnswers

- Endpoint 15: POST /answer/addAnswer

- Endpoint 16: POST /answer/reportAnswer

- Endpoint 17: POST /answer/resolveAnswer/:answerId

- Endpoint 18: DELETE /answer/deleteAnswer/:answerId

- Endpoint 19: GET /comment/getReportedComments

- Endpoint 20: POST /comment/addComment

- Endpoint 21: POST /comment/reportComment

- Endpoint 22: DELETE /comment/deleteComment/:commentId

- Endpoint 23: POST /comment/resolveComment/:commentId

- Endpoint 24: POST /user/getUsersList

- Endpoint 25: GET /user/getUserDetails/:username

- Endpoint 26: POST /vote/upvote

- Endpoint 27: POST /vote/downvote


## For each server endpoint indicate the test

- Endpoint 1: server/tests/server.test.js

- Endpoint 2: server/tests/server.test.js

- Endpoint 3: server/tests/login.test.js

- Endpoint 4: server/tests/login.test.js

- Endpoint 5: server/test/newQuestion.test.js, server/tests/question.test.js

- Endpoint 6: server/test/newQuestion.test.js

- Endpoint 7: server/test/newQuestion.test.js

- Endpoint 8: server/test/newQuestion.test.js

- Endpoint 9: server/test/newQuestion.test.js

- Endpoint 10: server/test/newQuestion.test.js

- Endpoint 11: server/test/newQuestion.test.js

- Endpoint 12: server/test/newQuestion.test.js, server/tests/question.test.js

- Endpoint 13: server/tests/tags.test.js

- Endpoint 14: server/tests/newAnswer.test.js

- Endpoint 15: server/tests/newAnswer.test.js

- Endpoint 16: server/tests/newAnswer.test.js

- Endpoint 17: server/tests/newAnswer.test.js

- Endpoint 18: server/tests/newAnswer.test.js

- Endpoint 19: server/tests/newComment.test.js

- Endpoint 20: server/tests/newComment.test.js

- Endpoint 21: server/tests/newComment.test.js

- Endpoint 22: server/tests/newComment.test.js

- Endpoint 23: server/tests/newComment.test.js

- Endpoint 24: server/tests/user.test.js

- Endpoint 25: server/tests/user.test.js

- Endpoint 26: server/tests/vote.test.js

- Endpoint 27: server/tests/vote.test.js

## Instructions to generate and view coverage report 

This counts for extra credit. Ignore if you haven't implemented it.

- Step 1: Run the following command to generate coverage report for backend code
```
cd server
npx jest --coverage
```

- Step 2: Find the coverage report in the following directory
```
open coverage/lcov-report/index.html
```

- Step 3: Run the following command to generate coverage report for frontend code
```
cd testing
npx cypress run
```

- Step 4: Find the coverage report in the following directory
```
open coverage/lcov-report/index.html
```

