const User = require("../models/user");
const Entry = require("../models/entry");

// =========================================== //
//    returnParams(request) return[:id1,:id2]  //
// =========================================== //
//
// in the case of a url like /users/123/entries
// returns the first param 123
// in the case of an url like
// /users/123/entries/456
// returns an array with the two params [123, 456]
// returned value is a string, need to be
// parseInt if you want to use it as integer

const returnParams = (req) => {
  const URL = req.originalUrl.split("/");
  if (URL[4]) {
    URL[4] = URL[4].split("?")[0]; // split the string in case of a query
  }
  return URL[4] ? [URL[2], URL[4]] : [URL[2]];
};

// =========================================== //
//    addEntry(userId) return updatedUser      //
// =========================================== //
//
// create a new Entry document with
// useer_id === userId and add the reference
// User.journalEntries

const addEntryRef = (userId, cb) => {
  Entry.create({ user_id: userId }, (error, createdEntry) => {
    if (createdEntry) {
      User.findByIdAndUpdate(
        userId,
        { journalEntries: createdEntry._id },
        (error, updatedUser) => {
          if (updatedUser) {
            return cb(undefined, updatedUser);
          } else {
            return cb(error, undefined);
          }
        }
      );
    } else {
      return cb(error, undefined);
    }
  });
};

// =========================================== //
//   parseEventObject(eventObj)                //
// =========================================== //
//
// Check an event object for undefined fields
// missing or wrong keys

const parseEventObject = (eventObj = {}) => {
  let errors = false;
  console.log("=====================================");
  console.log("Starting event object parser with ==>", eventObj);
  console.log();
  const requiredKeys = [
    "owner_id",
    "name",
    "title",
    "date",
    "description",
    "location",
    "host",
    "speaker",
  ];
  const errorObj = {
    error: "found one or more errors with your object",
    undefinedKeys: "",
    wrongKeys: "",
    missingKeys: "",
  };
  const eventKeys = Object.keys(eventObj);
  eventKeys.forEach((key) => {
    let errors = false;
    if (requiredKeys.includes(key)) {
      if (eventObj[key]) {
        console.log(key, "seems good to me");
      } else {
        console.log(key, "is undefined!");
        errorObj["undefinedKeys"] += `-${key}-`;
        errors = true;
      }
    } else {
      console.log(key, "is wrong!");
      errorObj["wrongKeys"] += `-${key}-`;
      errors = true;
    }
  });

  requiredKeys.forEach((key) => {
    if (!eventKeys.includes(key)) {
      console.log("you are missing: ", key);
      errorObj["missingKeys"] += `-${key}-`;
      errors = true;
    }
  });
  console.log();
  console.log(errors ? "some errors founded" : "you'are good to go man!");
  return errors === false ? eventObj : errorObj;
};

// =========================================== //
//   paginate(array, maxPerPage, page)         //
// =========================================== //
//

const paginate = (array, page, maxPerPage = 10) => {
  page = page ? page : 1;
  console.log("page is ", page);
  console.log("max per page is", maxPerPage);
  const begin = page * maxPerPage - maxPerPage;
  const end = begin + maxPerPage;
  console.log(begin, end);
  return array.slice(begin, end);
};

// =========================================== //
//   mock event structure                      //
// =========================================== //
//

const mockEvent = {
  title: "Mock Event",
  name: "this event",
  description: "a fun event",
  date: "26 april",
  location: "New York",
  host: {
    name: "francesco",
    title: "yep",
    email: "verte.fra@gmail.com",
    phoneNumber: "3334444545",
  },
  speaker: {
    name: "Max",
    title: "Doctor",
  },
};

const event_filtered_id = "5f57ba0607110e71d1bff7b6";
const skills_filtered_id = "5f57bac3f923067281069ef1";

module.exports = {
  event_filtered_id,
  skills_filtered_id,
  mockEvent,
  parseEventObject,
  returnParams,
  addEntryRef,
  paginate,
};
