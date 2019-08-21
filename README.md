A social media app, made with React, GraphQL, Redux

Todo:
- [ ] Backend
  - [x] Be able to create a new user
  - [ ] Posts: Add pagination or offset/limit, possibly sorting
  - [x] API to get a user and see how they relate to the current user. (If they follow them or are followed by them.)
  - [x] Comments: be able to comment on a post
  - [ ] Let users set their display names and profile pictures.



- [ ] Frontend
  - [x] Login/Register page
  - [ ] User profile pages, with a follow button, a feed of their posts, a link to see all of the users they're followedBy/following.
  - [ ] When a user is viewing their own profile page, a button will be on their profile that says "Edit Profile". This will take them to an Edit Profile page where they can change their display name, bio, profile picture, and other info.
  - [ ] Make separate components for UserFollowing and UserFollowers. Have a list of thumbnails for the users of the appropriate category. Maybe each component can contain UserThumbnail component that displays a user profile picture, with the bio and a follow button.
  <!-- - [ ] Posts' authors won't be a link that you can click if you are already on that page. (If the post made by the person's profile that you're on, then you can't click their name to go on their profile.) -->
  - [ ] User search page, with listings of users (with follow buttons).
  - [ ] Add styling and like/reply options to posts.
  - [ ] Post Details page, with a thread of every reply to that post.
- [ ] User authentication with JWT