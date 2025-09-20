# Overview
PitchForge is a web app that turns a short founder intake (voice or text) into a VC-ready, cited pitch deck. 
It performs lightweight competitor/market research, generates 10–12 slides (Problem, Solution, Product, Market, GTM, Competition, Business Model, Traction, Team, Roadmap, Ask) and shows a realtime deck preview.
It also lets you practice with a mock VC via browser voice. Decks export to PDF. 

# Stack

## Frontend

React Typescript
Tailwind CSS + shadcn/ui components

## Realtime & Data
Convex (database, serverless functions, live queries/presence)

## AI
OpenAI

## Web Scraping / Live Data
Firecrawl (search + scrape; optional Actions for simple booking/pricing pages)

## Voice (in-browser)
Vapi (web voice sessions for the mock-VC; no phone calls)

## Export & Delivery
HTML → PDF via Playwright/Puppeteer

## Resend for emailing the deck & notes

## Auth 
Better-Auth (OAuth/social login)



## Hackathon Overview
Link: https://www.convex.dev/hackathons/modernstack
Modern Stack Hackathon by Convex + Firecrawl + Vapi + Better-Auth + Autumn + Resend + OpenAI.


## App Flow and Pages/Structure
1. Welcome page that display what the app is about and allows the user to login
2. Then an overview page that shows the user all the pitch decks created as well as options to make a pitch deck and practice pitch 
3. The pitch deck creation page with slides and chat that allows the user to make pitch dekh with chatting with ai
4. The practice pitch which allows the user to practice the pitch based on the pitch dekh created