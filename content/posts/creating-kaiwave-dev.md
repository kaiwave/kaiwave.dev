---
title: My experience creating kaiwave.dev
date: 2026-09-20
---

Hello!

This is my first proper post on kaiwave.dev since I created the site. As of making this post, I haven't officially made it public, but I have been testing and updating it quite a lot ahead of the launch of Boardsteals on Tuesday, since that's probably when most people will find out that this exists.

I've learned quite a bit in making this site. Yes, it was originally completely vibecoded by me just asking Claude for a portfolio website and it spitting out something functional. In fact, the original code it gave me doesn't *look* all too different from the site right now. However, much of how it's structured in the background has been significantly overhauled, and the only thing it really has in common with the true original is the way it looks.

It was a random Wednesday night when I decided I wanted a portfolio. I'd just come home from uni, where I had a couple meetings (Shoutout to the C3 outreach team and NGTC pubs), and I realised that it would just be cool to have my own little thing to display my projects. But, I had a problem. I had no projects. This didn't stop me, since I think that now that I have this thing going on, I'll be more motivated to finish a lot more things on time and to a high enough standard to publish here.

That didn't stop me from whipping something up quickly though. I got the files from Claude, chucked it in this repo, bought the domain, and published it to pages almost immediately. It was already 2am the next Thursday by this point, and I was already sending it out to a couple friends to test out. As I alluded to earlier, however, there were many problems. Among them, everything was hard-coded into the HTML files... Even the posts and the projects, which I'd be needing to update frequently and easily. I ended up having to restructure the backend over the following few days so it just reads out of a database, as it should.

On top of this, the original file structure was completely flat. All the pages were just html files sitting in the root directory, which also had the side effect of having ugly links when navigating around. Changing the folder structure to something much closer to I have now, (and eventually moving it all to a subfolder, and deploying with GitHub actions), allowed for cleaner links and future expandability, including the ability to make posts like these.

Another challenge was creating the bilingual support. As someone who has learned French academically since starting high school, I thought it would be a cool, important, and easy feature to add to a site showcasing all things me. While it did end up being cool and important, it certainly wasn't easy. I ended up using a data-i18n method which my main.js looks at and switches tags, which works.

Finally, and this is something that I am still working on as of posting this, I'm creating a python script which makes creating and modifying posts a lot easier. Even though it's all in a database, creating posts and projects still requires me to manually go into the .json file and add things normally. This python script, which is possible because of the folder restructuring I did earlier, acceses these databases and turns them into simple, functional, and intuitive text boxes to make posting much, much easier.

Overall, I've definitely learned a bunch from making this, in terms of both technical processes and troubleshooting/creator mentality, and there's still a long way to go. But I'm one step more proficient than I was before, and that's what is most important. My new catchphrase, as my mate Caleb put it,

*"Larping and being goated is like the chicken and the egg."*

Until next time.
