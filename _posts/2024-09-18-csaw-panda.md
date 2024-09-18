---
layout: distill
title: CSAW CTF 2024 - Authentic Chinese Food
date: 2024-09-18
description: A simple and fun OSINT challenge
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

This challenge from CSAW was a great geolocation challenge, with the added difficulty of discovering additional information about the building and the health grade.

Here is the challenge description:
{% include figure.liquid path="assets/img/OSINT-panda.jpg" class="img-fluid rounded z-depth-1" zoomable=false %}

The original file from the challenge description:
{% include figure.liquid path="assets/img/panda.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}

---

## Steps

1.) The first thing to notice about this challenge is the phone number in the top-right of the image. The area code of this number reveals that the Panda Express we are looking for is in Brooklyn, New York.

{% include figure.liquid path="assets/img/OSINT-brooklyn.jpg" class="img-fluid rounded z-depth-1" zoomable=false %}

2.) With this information, the next clear step is to go to Google Maps, and search for "panda express brooklyn ny."

---

## Lessons Learned

Place holder
