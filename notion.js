require('dotenv').config();
import { Client } from '@notionhq/client';

async function getAllPages(notion) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return response.results;
}

async function getSelectedPage(notion) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      or: [
        {
          property: 'Show',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });
  return response.results[0];
}

async function getRandomPage(pages) {
  return pages[Math.floor(Math.random() * pages.length)];
}

async function updatePage(notion, pageId, properties) {
  await notion.pages.update({
    page_id: pageId,
    properties,
  });
}

async function run() {
  try {
    const notion = new Client({
      auth: this.notion$auth.oauth_access_token,
    });

    const pages = await getAllPages(notion);
    const selectedPage = await getSelectedPage(notion);
    const randomPage = await getRandomPage(pages);

    if (selectedPage !== undefined) {
      await updatePage(notion, selectedPage.id, {
        Show: {
          checkbox: false,
        },
      });
    }
    await updatePage(notion, randomPage.id, {
      Show: {
        checkbox: true,
      },
    });
  } catch (error) {
    console.error(error.body);
  }
}

run();
