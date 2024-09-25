---
layout: distill
title: Patriot CTF 2024 - Giraffe Notes
date: 2024-09-20
description: An easy, but good warmup web challenge
tags: write-ups
categories: ctf

authors:
  - name: Metassassin
    url: "https://metassassin.github.io"
    affiliations:
      name: Hellbound

toc:
  - name: Introduction
  - name: Steps
  - name: Lessons Learned
---

## Introduction

Giraffe notes was an easy challenge for Patriot CTF 2024, but I thought it was a solid challenge to warmup on. My team performed really well, but these are the challenges that I worked on alone when I had some time. I don't usually do web, but I read the challenge file and realized it would be pretty quick to complete.

Here is the challenge description:
{% include figure.liquid path="assets/img/WEB - Giraffe Notes.png" class="img-fluid rounded z-depth-1" zoomable=false %}

The challenge PHP file contents:
{% details Click here for code %}
  {% highlight php %} 
    {% raw %}
      <?php
      $allowed_ip = ['localhost', '127.0.0.1'];
      
      if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && in_array($_SERVER['HTTP_X_FORWARDED_FOR'], $allowed_ip)) {
          $allowed = true;
      } else {
          $allowed = false;
      }
      ?>
      
      <!DOCTYPE html>
      <html>
      
      <head>
          <title>Giraffe Notes</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
          <script>
              tailwind.config = {
                  darkMode: 'class',
                  theme: {
                      extend: {
                          colors: {
                              primary: {
                                  "50": "#eff6ff",
                                  "100": "#dbeafe",
                                  "200": "#bfdbfe",
                                  "300": "#93c5fd",
                                  "400": "#60a5fa",
                                  "500": "#3b82f6",
                                  "600": "#2563eb",
                                  "700": "#1d4ed8",
                                  "800": "#1e40af",
                                  "900": "#1e3a8a"
                              }
                          }
                      },
                      fontFamily: {
                          'body': [
                              'Inter',
                              'ui-sans-serif',
                              'system-ui',
                              '-apple-system',
                              'system-ui',
                              'Segoe UI',
                              'Roboto',
                              'Helvetica Neue',
                              'Arial',
                              'Noto Sans',
                              'sans-serif',
                              'Apple Color Emoji',
                              'Segoe UI Emoji',
                              'Segoe UI Symbol',
                              'Noto Color Emoji'
                          ],
                          'sans': [
                              'Inter',
                              'ui-sans-serif',
                              'system-ui',
                              '-apple-system',
                              'system-ui',
                              'Segoe UI',
                              'Roboto',
                              'Helvetica Neue',
                              'Arial',
                              'Noto Sans',
                              'sans-serif',
                              'Apple Color Emoji',
                              'Segoe UI Emoji',
                              'Segoe UI Symbol',
                              'Noto Color Emoji'
                          ]
                      }
                  }
              }
          </script>
      </head>
      
      <body class="bg-gray-900 grid h-screen place-items-center">
          <?php
          if (!$allowed) {
          ?>
              <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                  <div class="mx-auto text-center">
                      <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-primary-500">
                      🦒
                      </h1>
                      <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl text-white">
                          Hah! Bet you cant access my notes on giraffes! They're super secure!
                      </p>
                  </div>
              </div>
          <?php
          } else {
          ?>
              <section class="bg-gray-900 antialiased">
                  <div class="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                      <div class="max-w-3xl mx-auto text-center">
                          <h2 class="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 text-white">
                              Notes
                          </h2>
                          <div class="mt-4">
                              <span class="inline-flex items-center text-lg font-medium text-primary-600 dark:text-primary-500">
                                  I like giraffes
                              </span>
                          </div>
                      </div>
                      <div class="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                          <div class="-my-4 divide-y divide-gray-200 divide-gray-700">
                              <div class="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                                  <p class="w-32 text-lg font-normal text-gray-500 sm:text-right text-gray-400 shrink-0">
                                      08:00 - 09:00
                                  </p>
                                  <h3 class="text-lg font-semibold text-gray-900 text-white">
                                      <span>Look at giraffes</span>
                                  </h3>
                              </div>
      
                              <div class="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                                  <p class="w-32 text-lg font-normal text-gray-500 sm:text-right text-gray-400 shrink-0">
                                      09:00 - 10:00
                                  </p>
                                  <h3 class="text-lg font-semibold text-gray-900 text-white">
                                      <span>Think about giraffes</span>
                                  </h3>
                              </div>
      
                              <div class="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                                  <p class="w-32 text-lg font-normal text-gray-500 sm:text-right text-gray-400 shrink-0">
                                      10:00 - 11:00
                                  </p>
                                  <h3 class="text-lg font-semibold text-gray-900 text-white">
                                      <span>Learn about giraffes</span>
                                  </h3>
                              </div>
      
                              <div class="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                                  <p class="w-32 text-lg font-normal text-gray-500 sm:text-right text-gray-400 shrink-0">
                                      11:00 - Infinity
                                  </p>
                                  <h3 class="text-lg font-semibold text-gray-900 text-white">
                                      <span>CACI{placeholder}</span>
                                  </h3>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          <?php
          }
          ?>
      </body>
      
      </html>
    {% endraw %}
  {% endhighlight %} 
{% enddetails %}

---

## Steps

1.) The first thing to notice about this challenge is the phone number in the top-right of the image. The area code of this number reveals that the Panda Express we are looking for is in Brooklyn, New York.

{% include figure.liquid path="assets/img/OSINT-brooklyn.png" class="img-fluid rounded z-depth-1" zoomable=false %}

2.) With this information, the next clear step is to go to Google Maps, and search for "panda express brooklyn ny." There were a lot less than one may expect, so it was easy to streetview and identify the one in the challenge: 423 Fulton St, Brooklyn, NY 11201.

{% include figure.liquid path="assets/img/OSINT-panda-locations-brooklyn.png" class="img-fluid rounded z-depth-1" zoomable=false %}
{% include figure.liquid path="assets/img/OSINT-panda-streetview.png" class="img-fluid rounded z-depth-1" zoomable=false %}

3.) Now that we have the address, we need to find the owner (LLC) of the building and the year the building was built. <a href="https://www.compass.com/building/423-fulton-st-brooklyn-ny-11201/293532309167074133/">Compass.com</a> proved to be a fantastic resource and revealed a bunch of information including that the build date was 1920, and the <a href="https://www.bldup.com/organizations/bnn-fulton-flushing-owner-llc">owner</a> is "BNN Fulton Flushing Owner." I looked the company up to be sure this was correct because the LLC name was strange. I also spent an unreasonable amount of time digging through New York building records, which all revealed nothing about the owner, albeit I was able to acquire the build year.

{% include figure.liquid path="assets/img/OSINT-panda-building-info.png" class="img-fluid rounded z-depth-1" zoomable=false %}
{% include figure.liquid path="assets/img/OSINT-panda-owner.png" class="img-fluid rounded z-depth-1" zoomable=false %}

4.) NYC maintains good record of health ratings for applicable establishments, so I Googled for the health rating and came across this site, <a href="https://a816-health.nyc.gov/ABCEatsRestaurants/#!/Search/50055636">health.nyc.gov</a> and found that the grade was 'pending.'

{% include figure.liquid path="assets/img/OSINT-panda-health.png" class="img-fluid rounded z-depth-1" zoomable=false %}

5.) With all of this information combined, I submitted my flag and got the solve: `csawctf{pending_1920_bnn_fulton_flushing_owner}`

---

## Lessons Learned

1.) Compass.com is an excellent resource for building records. New York building records are terrible to dig through.

2.) This challenge was unique, and it gives me great inspiration for challenges of my own that don't limit you to simple geolocation.

3.) Maybe consider other restaurant options if you are in the area looking for authentic Chinese food ;).
