---
layout: distill
title: A Dip in the Pool as an Aspiring Social Engineer
date: 2024-09-23
description: The first mid-course capstone box for the PNPT course
tags: general
categories: hacking

authors:
  - name: Metassassin
    url: "https://metassassin.github.io"
    affiliations:
      name: Hellbound

toc:
  - name: Introduction
  - name: Planning and Execution
  - name: Results
  - name: Lessons Learned
---

## Introduction

Last week, for the first time ever, I got to embark on what would become my first face-to-face social engineering engagement.

The company I work for, a large international meat manufacturer, maintains several processing plants in the United States. One of the glaring holes that I have always seen was the ability for any random person to walk into a plant and wreak whatever havoc because the physical security and employee awareness is lacking. Yeah, yeah, yeah... we have security awareness training and this isn't the first time the plant has had a surprise visit, so we didn't do anything novel.

Our purpose for this engagement was to understand which network ports were available in lobbies and breakrooms. We needed to understand what systems we could communicate with if we found active ports, so that we could create the right narritive about the risks faced today. Ultimately, social engineering got thrown in as an additional audit factor, and my leadership knows this is something that fires me up, so they included me.

---

## Planning and Execution

The morning started very typical: Wake up, check email, make sure any pending incidents are handled, etc. My coworker and I hit the road shortly after making sure we had a laptop, ethernet cable, and of course the famed 'get out of jail free' card from Human Resources. We kinda hoped we would need it...

It was a relatively short drive to our location. We had previously scoped it out on Google Earth to understand the buildings we would be checking before actually being onsite - an activity that really helps you look like you belong there. We only knew about this engagement a week prior, so we didn't have time to obtain any cool vendor outfits or company swag that we found from the online stores used by the company. All of that is to say we went in classic attire for what we thought an IT person or Network admin would appear as.

Upon arriving to the building, the unknowns that we were dealing with were:
1.) Is there a badge reader at the main entrance, and if yes, how do we get in?
2.) Is someone going to challenge us? How do we push back if they do? 
3.) Are we going to say anything to anyone, or are we entering the site and just acting like we belong?

Neither of us had been on an official audit like this, so we wanted to make sure that we crossed our t's and dotted our i's. I have consumed a lot of content from famous social engineers via books and competitions, such as the elite DEF CON competition held by the Social Engineering Community.

What we decided was:
1.) If there is a badge reader, we will try the door anyway, usher a receptionist, look for other entrances, or tailgate someone in.
2.) If someone challenged us, we wouldn't put up a huge fight. Smile, explain we are with the network team checking the ports, and worst case scenario was reveal our letter from HR.
3.) We decided to present the greatest opportunity for challenging us, and we opted to just begin working unless told otherwise.

The other small detail that we planned to contribute to our success was going on a Friday, because we assumed it would be when people cared the least about causing a fuss, and they would generally be in a more upbeat mood.

We initially planned to take a laptop that was off the company network, but when I forgot this device, my coworker just turned off the Wi-Fi connection and we used that device. We did this all in the parking lot, and then gave eachother the nod of "let's do this."

We got out of the car, nerves starting to elevate, and approached the door of building one of three (housing HR and plant supervisors for the location). Immediately we are hit in the face with the reality that there is a badge reader... rats... not as easy as we thought... When we looked in and saw a receptionist who was waving at us, inviting us inside! YES, IT ACTUALLY WAS AS EASY AS WE HAD HOPED!

The receptionist waited a moment before quietly asking if we were with the company, which I promptly replied, "yes, we are with the company." My coworked chimed in, "we are just here to look at the network ports," which was enough for her because she responded with a smile and an "okay!"

Awesome, the hardest part of the engagement was over. We had someone on board, so everyone else began to put any resemblance of a gate down, and we were off to the races. I was so excited at the end of that interaction, I was fighting to retail the slight tremble in my hands so that there would be no reason for us to be questioned any further. Eventually I calmed myself, and we went to work.

Out of the gate, we found open network ports all over the place... by the printers, plugged into the receptionists computer, by lobby seating, etc. Something good was that we discovered we could not ping to Google, which at least proved we didn't get access to the entire company network. The downside was we discovered that every port in that first building was on the same switch and VLAN, so we could access anything on that network if we were authorized to probe further (we weren't).

We walked all over that building without a single other person acknowledging we were there... conference rooms, copy rooms, lobby, break room, and more. We could have walked into the physical plant if we so desired, but that is a safety risk and outside of scope. Having checked each port in the building that we could find open, we headed for the door and building two. The most important thing to me was smiling, and graciously thanking the receptionist for their help and time so they were better off than we had left them... Chris Hadnagy taught me this was critical.

The receptionist seemed to appreciate the warm thank you, and we approached door two. This particular building was dedicated to training drivers, but there was a total of five people inside, and none of them were interested in what we were doing there. One person asked if they could help us, but ushered us on as soon as we mentioned being with the network team. This gave us unlimited access to 10+ computers that had direct access to the corporate network, which was our biggest finding. This may not traditionally be a bad thing to a user, but these machines were never locked, and signed in with a generic account. This means that any random person could walk into that building and do whatever they wanted... very bad.

Despite that glaring security risk, we didn't find any open ports and decided to move on to building three. Again, we made sure to thank and smile at those we just PWNed, and we moved on.

Building three was right next door, and we had already breached two of the three targets, so our confidence was soaring. We walked in smooth as butter, delivered our "we are with the network team and need to check some ports," and again were allowed right in to another building full of employees. This building did have more open ports, but our discovery was the same. We Nmapped the network to see what ports and services were being used, and we closed out the engagment with more smiles and 'thank yous.'

As you can imagine, we were thrilled and disappointed. This was our first engagement, and we absolutely crushed; however, on the flip-side this is a plant location that we support, and they have horrible gaps in security. These employees made life-threatening mistakes if the wrong people approached the buildings in the same manner as we did, which was truely horrifing. Ultimately, all of this is to be assembled into a report and delivered to the correct leadership members to ensure that these gaps are addressed.

---

## Results

We completed all actions on objective with very minimal resistance. We completed the network assessment as prescribed to my coworker, and I completed my personal goal of having breached a building that, to others, I should not have been allowed so easily inside of.

At the end of the day, these are just people that we interacted with, and I think it is immensely valuable that we were able to complete this engagement ourselves, so that the employees at the plant can productively learn from any mistakes to sharpen their security practices.

---

## Lessons Learned

1.) Social engineering is definitely the most effective way to breach logical and physical boundaries. It is critical that people understand, and are comfortable detecting and deflecting these problems.

2.) I have nerves that produce physical reactions in my body, which is something I need to control and be more aware of in the moment as I embark on these engagements.

3.) I will do this for the rest of my life if I may be allowed to. This experience was thrilling, and I await my next opportunity very eagerly.
