const axios = require("axios");
const { Client } = require("@notionhq/client");
require('dotenv').config()

const notion = new Client({ auth: process.env.NOTION_KEY });

async function listItems() {
  try {
    // get all pages in the database
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // adding all pages in pages array
    let pages = [];
    response.results.forEach((e) => pages.push(e.id));

    // get pages with checkbox true
    const responseSelected = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        or: [
          {
            property: "Show",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    // adding checked pages in selectPages array
    let selectPages = [];
    responseSelected.results.forEach((e) => selectPages.push(e.id));

    // uncheck checked pages
    const updatePromises = selectPages.map((page_id) => {
      return notion.pages.update({
        page_id: page_id,
        properties: {
          Show: {
            checkbox: false,
          },
        },
      });
    });
    await Promise.all(updatePromises);

    // check a random page
    async function checker() {
      let item = pages[Math.floor(Math.random() * pages.length)];
      await notion.pages.update({
        page_id: item,
        properties: {
          Show: {
            checkbox: true,
          },
        },
      });
    }
    await checker(); // calling the checker function
  } catch (error) {
    console.error(error.body);
  }
}

listItems();
