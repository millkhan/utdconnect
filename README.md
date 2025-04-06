# utdconnect
Connect and chat with UTD students similar to you!

## Inspiration
Being a senior SE major at UTD, I've come to realize how hard socializing can be, especially at an antisocial school like UTD. I had always taken a liking to online spaces where I could easily find and connect with students similar to myself. Although many of these spaces weren't necessarily intended for meeting people, it was better than staying in your own bubble in real-life. That's why I built an application specifically for UTD students to connect based on similar interests - all on the internet (where we spend 95% of our waking hours). 

## What it does
utdconnect is a platform designed to help UTD students connect with others through meaningful, one-on-one chats. Students provide information about themselves— including major, year, interests, and more — and are matched with someone similar. What separates utdconnect from your typical online chat application is that it tailors connections based on the information you supply and provides an explanation for why it believes you'll get along with its selection.

## How we built it
utdconnect can be logically split into three main subsystems: information gathering, AI matching, and a chat interface. 

Through the use of basic HTTP requests and DOM parsing, utdconnect is able to pull information from the official UTD student directory to validate and obtain information from a UTD student from their email. An additional text form (the most crucial piece of data for the AI matching algorithm), provides the student the opportunity to talk about themselves and what they're searching for - helping the AI algorithm match them with the perfect student.

The AI algorithm is completely powered by Google's Gemini to not only provide structured output for what student should be paired with which student, but also an explanation for why it decided to pick a student - in addition to providing a fun icebreaker prompt to break the silence of a blank online chatroom. Additionally, Gemini is being used to create personalized responses for the user based on who they match with for demonstrative purposes. In the real-world, both ends of the chatroom would be humans.

Finally, through the combination of vanilla js, CSS, HTML, MongoDB Atlas, and an Express webserver, all of these technologies are brought together on a simple and quick interface. MongoDB Atlas powers all chat persistence and student queue pairing and it performed exceptionally well in it's ease of prototyping without sacrificing any functionality. As for the overall frontend design, simplicity was a huge focus for this project to draw maximum attention to the user's responses to prompts and to retain focus on whats important - connecting with a student (also who has time to waste trying to center a div...). 

## Challenges we ran into
One of the biggest time sinks during this hackathon was figuring out how to piece the large number of technologies being used. Because of time constraints, cuts had to be made in the correctness of data passing from the backend to the frontend and from service to service. Additionally, authentication and authorization capabilities were left practically non-existent due to the aforementioned time constraints.

## Accomplishments that we're proud of
Gemini was a huge success in pairing students logically.  The addition of fun features like suggested icebreakers made prototyping and testing this application fun. I'm proud to say it's something I would actually enjoy using in real-life. 

## What we learned
I learned how easy its now become to incorporate tools like generative AI and NoSQL databases using these online services. I'm typically a do everything yourself on baremetal kind of developer, but I'll definitely consider using these or similar services for my next projects.

## What's next for utdconnect
I'm planning on taking utdconnect even further and publishing it for all UTD students to use. With a little polishing and additions to critical services (authorization, authentication, etc), utdconnect is easily in a place to be expanded on. 

