### Front end for API server

## Team members

1. Maha
2. Max Marker
3. Francesco

### live deployment

[https://techjournalserver.herokuapp.com/](https://techjournalserver.herokuapp.com/users)

## API endpoints

##<u>users endpoints</u>

#### /users/signup POST

- requires a body on the request with email, password and name
- returns an object with auth token and created user

#### /users/login POST

- requires a body on the object with email and password
- returns an object with user informations

#### /users GET

- returns all the information about all the users

#### /users/:id

- returns information about a single user
- optional query paramaters:

  **populate**

        - journalEntries
        - skills
        - createdEvents
        - eventsWillAttend

  this option will return the user object with this extra info connected
  avoiding and extra call for them.

  **Eg:** /users/5f5547055b287367b551a187**?populate=skills**

  will return something like this

        {
        "skills": [
            {
                "count": 0,
                "_id": "5f5555b4821d7675b4d3edda",
                "skill": "python",
                "__v": 0
            },
            {
                "count": 0,
                "_id": "5f553987bf15005c8f4d714b",
                "skill": "javascript",
                "__v": 0
            },
            {
                "count": 0,
                "_id": "5f555641de01b076218454c0",
                "skill": "ruby",
                "__v": 0
            }
        ],
        "eventsWillAttend": [],
        "_id": "5f5547055b287367b551a187",
        "email": "verte.fra@gmail.com",
        "name": "francesco",
        "createdAt": "2020-09-06T20:31:01.103Z",
        "updatedAt": "2020-09-06T21:36:01.571Z",
        "__v": 0,
        "journalEntries": "5f5547055b287367b551a188"

  }

#### /users POST

- Create one user with the information provided in the object. Not really useful because there is
  already users/signup that does the same but with authentication

#### /users/:id PUT

- Update the info about a user with an object containing the user property.

  **Eg:** /users/5f5547055b287367b551a187 with a body with
  { name: "Marc" } will update the user document changing the
  name with marc.

  **IMPORTANT:** if you wanna change information like skills or journal entries use the dedicated
  endpoints like **/users/5f5547055b287367b551a187/entries** or **/users/5f5547055b287367b551a187/skills**

#### /users/:id DELETE

- delete an user and the associated entries. **Note:** removing a user wont remove the skills from the skill document because skills are used globally used and don't have a unique relation with the user like the entries do.

##<u>user entries endpoints</u>

#### /users/:id/entries POST

- store a new entry in the entry document related to the user with id **users/:id**
- requires and object in the body with **title** and **content**

#### /users/:id/entries GET

- returns all the entries belonging to the user with id **users/:id** in the form of an array of objects

#### /users/:id/entries/:id GET

- returns the entry with id **entries/:id** belonging to the user with id **users/:id**

#### /users/:id/entries/:id DELETE

- delete the entry with id **entries/:id** belonging to the user with id **users/:id**

#### /users/:id/entries/:id PUT

- modify the entry with id **entries/:id** belonging to the user with id **users/:id**

##<u>user skills endpoints</u>

**This endpoints affects the skills associated with a user**

#### /users/:id/skills GET

- returns all the skills belonging to the user with id **users/:id** in the form of an array of objects

#### /users/:id/skills POST

- store a new skill in the skill document if it's not already present, assign the reference to that skill to the user with id **/users/:id**
- requires and object in the body with **skill** (string value required)

#### /users/:id/skills/:id GET

- returns the skill with id **skills/:id** belonging to the user with id **users/:id**

#### /users/:id/skills/:id DELETE

- delete the reference to the skill object for the skill with id **entries/:id** belonging to the user with id **users/:id** **Important** this will not remove the skill from the skill domcument.

##<u>user events endpoints</u>

#### Creating a new event.

    the creation of a new event is associated with a "user owner".
    the route to create a new event is:

#### /users/:id/events POST

        Needs an object in the body similar to this



    {
    "title":"My second created Event",
    "name":"this event",
    "description":"a fun event",
    "date": "26 april",
    "location": "New York",
    "host":{
    	"name":"francesco",
    	"title":"yep",
    	"email":"verte.fra@gmail.com",
    	"phoneNumber":"3334444545"
    },
    "speaker":{
    	"name":"Max",
    	"title":"Doctor"
    }

}

**the route provides a parse function for the object** that will return missing, invalid or undefined key to ensure data consistency.

#### See all the events <u>users/:id/events GET</u>

    retrieving all the events associated with one user.
    you can choose, as on **option** to retrieve only the one the he will attend
    or the one that he will partecipate. If you don't specify the default option
    returns the events that he will partecipate.

**options**

        `users/:id/events?events=createdEvents` returns all the created events
        `users/:id/events?events=eventsWillAttend` returns all the events that the user will attend

#### Show one event

retrieving the event with id **/events/:id** associated with one user.
you can choose, as on **option** to search between the events that the userr created or that will attend. If you don't specify the default option
will look in both.

#### <u>users/:id/events GET</u>

**options**

    `users/:id/events?events=createdEvents` returns all the created events
    `users/:id/events?events=eventsWillAttend` returns all the events that the user will attend

## Event administrator endpoint

From this endpoint you can controll directly the creation, the show or the deletion of events

#### Show all the events in the database /events GET

**options**
-you can add page and display to your query to paginate the outputs

**eg:** `/events?display=20&page=1` will display **20** reesults per page and **page 1** of the results

#### Show one event from the database /events/:id GET

- shows the event with id = event/:id

#### Update an event /events/:id?user_id=id PUT

- Update an event with an object attached to the body that follows the following structure:

`````{
"title":"My second created Event",
"name":"this event",
"description":"a fun event",
"date": "26 april",
"location": "New York",
"host":{
"name":"francesco",
"title":"yep",
"email":"verte.fra@gmail.com",
"phoneNumber":"3334444545"
},
"speaker":{
"name":"Max",
"title":"Doctor"
}
}````

**Don't miss any key!**

- send the owner id in a query as a control that you are the post owner (very loose controll :( )

#### delete an event events/:id?user_id=id

- delete an event from the database and eliminates the reference from createdEvents in the userModel
- Make sure to include the user_id in your query
`````
