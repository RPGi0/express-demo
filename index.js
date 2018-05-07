const Joi = require('joi'); // Stored in a variable with UpperCaseName because a class is returned from the module
const express = require('express');
const app = express();

app.use(express.json()); // returns middleware

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];
// This is how to specify routes:
app.get('/', (req, res) => {  // use .get method with the path and caller function. Here the path is '/' or the home page
  res.send('Hello world');    // and return a callback function(.send) aka Route Handeler
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
};
  return Joi.validate(course, schema);
}

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); // object destructuring, equvilant to getting result.error
  if (error) return res.status(404).send(error.details[0].message);

  const course = {          // Define a constant, course, that is an object
    id: courses.length + 1, // that has the nuber of items +1 as an id,
    name: req.body.name     // and who's name comes from the body of the request.
  };

  courses.push(course);     // Then push the resulting course object onto the end of the courses array
  res.send(course);         // and send the course added as the result.
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id)); // use .find method to return a boolean value of weather the courses exsists or not,
  if (!course) return res.status(404).send('Course not found ),:'); // if the course doesn't exsist, set status to 404 and return error messasge to client

  const { error } = validateCourse(req.body); // equvilant to getting result.error
  if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found ),:');

  const index = courses.indexOf(course); // use indexOf() to find the course to delete. Store value in a constant
  courses.splice(index, 1); // splice from given index to one item

  res.send(course); // return then new
});

// use a colon (:) so begin specifying a parameter
app.get('/api/courses/:id', (req, res) => {                           // Specify parameter in path,
  const course = courses.find(c => c.id === parseInt(req.params.id)); // use .find method to return a boolean value of weather the courses exsists or not,
  if (!course) return res.status(404).send('Course not found ),:');          // if the course is not found, return 404 and send an error message,
  res.send(course);                                                   // otherwise return the requested course
});

// process is a global object, has a property env. If a port is named use it, else use port 3000. Store result in a constant
// PORT is an environment variable unique to each machine/environment
const port = process.env.PORT || 3000;
// Use Template Literal to make the logged message responsive. Store variable in ${}
app.listen(port, () => console.log(`Listening on port ${port}...`));
