# Notion randomizer

> Vision: I've always struggled to make a notion database pick a random page everyday. It has many applications like quotes, flashcards. But for me it was vocabulary, which is very important and thus as the saying goes _"Necessity is the mother of invention"_ , I also made this workflow.

## Notion locally

- [x] fill the .env file

- [x] database id will be in the link which you see in the url

- [x] for randomizer key, make an integration and paste the secret key there

```
npm init
npm install @notionhq/client --save
npm install dotenv --save-dev

npm run notion.js
```

## Notion with pipedream (recommended)

- [x] click [here](https://pipedream.com/new?h=tch_m1Afrn) to use this workflow

- [x] just connect notion account to pipedream give access to required pages

- [x] choose the database to work upon

- [x] set the time

- [x] Deploy the workflow, and Done!
