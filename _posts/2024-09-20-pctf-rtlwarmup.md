---
layout: distill
title: Patriot CTF 2024 - RTL Warmup
date: 2024-09-20
description: An easy, but new-to-me misc challenge involving RTL
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

This challenge....

RTL.... more to come here

Here is the challenge description:
{% include figure.liquid path="assets/img/MISC - Rtl Warmup.png" class="img-fluid rounded z-depth-1" zoomable=false %}

The challenge 'flag.vcd' file contents:

{% details Click here for code %}
  {% highlight php %} 
    {% raw %}
      $timescale 1 ps $end
      $scope module uut $end
      $var wire 1 ! clock $end
      $var wire 8 " dout $end
      $var wire 8 # din $end
      $upscope $end
      $enddefinitions $end
      $dumpvars
      0!
      b01010000 "
      b01010000 #
      $end
      #50000000
      1!
      #50000000
      #100000000
      0!
      #100000000
      b01000011 "
      b01000011 #
      #150000000
      1!
      #150000000
      #200000000
      0!
      #200000000
      b01010100 "
      b01010100 #
      #250000000
      1!
      #250000000
      #300000000
      0!
      #300000000
      b01000110 "
      b01000110 #
      #350000000
      1!
      #350000000
      #400000000
      0!
      #400000000
      b01111011 "
      b01111011 #
      #450000000
      1!
      #450000000
      #500000000
      0!
      #500000000
      b01010010 "
      b01010010 #
      #550000000
      1!
      #550000000
      #600000000
      0!
      #600000000
      b01010100 "
      b01010100 #
      #650000000
      1!
      #650000000
      #700000000
      0!
      #700000000
      b01001100 "
      b01001100 #
      #750000000
      1!
      #750000000
      #800000000
      0!
      #800000000
      b01011111 "
      b01011111 #
      #850000000
      1!
      #850000000
      #900000000
      0!
      #900000000
      b01101001 "
      b01101001 #
      #950000000
      1!
      #950000000
      #1000000000
      0!
      #1000000000
      b00100100 "
      b00100100 #
      #1050000000
      1!
      #1050000000
      #1100000000
      0!
      #1100000000
      b01011111 "
      b01011111 #
      #1150000000
      1!
      #1150000000
      #1200000000
      0!
      #1200000000
      b01000100 "
      b01000100 #
      #1250000000
      1!
      #1250000000
      #1300000000
      0!
      #1300000000
      b01000000 "
      b01000000 #
      #1350000000
      1!
      #1350000000
      #1400000000
      0!
      #1400000000
      b01000100 "
      b01000100 #
      #1450000000
      1!
      #1450000000
      #1500000000
      0!
      #1500000000
      b01011111 "
      b01011111 #
      #1550000000
      1!
      #1550000000
      #1600000000
      0!
      #1600000000
      b00110000 "
      b00110000 #
      #1650000000
      1!
      #1650000000
      #1700000000
      0!
      #1700000000
      b01000110 "
      b01000110 #
      #1750000000
      1!
      #1750000000
      #1800000000
      0!
      #1800000000
      b01011111 "
      b01011111 #
      #1850000000
      1!
      #1850000000
      #1900000000
      0!
      #1900000000
      b01001000 "
      b01001000 #
      #1950000000
      1!
      #1950000000
      #2000000000
      0!
      #2000000000
      b01000000 "
      b01000000 #
      #2050000000
      1!
      #2050000000
      #2100000000
      0!
      #2100000000
      b01110010 "
      b01110010 #
      #2150000000
      1!
      #2150000000
      #2200000000
      0!
      #2200000000
      b01100100 "
      b01100100 #
      #2250000000
      1!
      #2250000000
      #2300000000
      0!
      #2300000000
      b01110111 "
      b01110111 #
      #2350000000
      1!
      #2350000000
      #2400000000
      0!
      #2400000000
      b01000000 "
      b01000000 #
      #2450000000
      1!
      #2450000000
      #2500000000
      0!
      #2500000000
      b01110010 "
      b01110010 #
      #2550000000
      1!
      #2550000000
      #2600000000
      0!
      #2600000000
      b00110011 "
      b00110011 #
      #2650000000
      1!
      #2650000000
      #2700000000
      0!
      #2700000000
      b01111101 "
      b01111101 #
      #2750000000
      1!
      #2750000000
      #2800000000
      0!
      #2800000000
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
