import { Client } from '@notionhq/client';

async function getAllPages(notion, databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
}

async function getSelectedPage(notion, databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId,
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

export default defineComponent({
  name: 'Notion Random Item',
  key: 'notion-query-database',
  description: '',
  props: {
    notion: {
      type: 'app',
      app: 'notion',
      description: '',
    },
    databaseId: {
      type: 'string',
      label: 'Target database',
      description: 'Select the database',
      async options({ prevContext }) {
        const notion = new Client({
          auth: this.notion.$auth.oauth_access_token,
        });
        const response = await notion.search({
          filter: {
            value: 'database',
            property: 'object',
          },
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });
        const options = response.results.map((db) => {
          const title = db.title
            .map((title) => title.plain_text)
            .filter((title) => title.length > 0)
            .reduce((prev, next) => prev + next, '');
          return {
            label: title || 'Untitled',
            value: db.id,
          };
        });
        return {
          context: {
            cursor: response.next_cursor,
          },
          options,
        };
      },
    },
  },
  methods: {
    getAllPages,
    getSelectedPage,
    getRandomPage,
  },
  async run() {
    try {
      const notion = new Client({
        auth: this.notion.$auth.oauth_access_token,
      });
      const selectedPage = await this.getSelectedPage(notion, this.databaseId);
      const randomPage = await this.getRandomPage(
        await this.getAllPages(notion, this.databaseId)
      );

      if (selectedPage !== undefined) {
        await notion.pages.update({
          page_id: selectedPage.id,
          properties: {
            Show: {
              checkbox: false,
            },
          },
        });
      }

      await notion.pages.update({
        page_id: randomPage.id,
        properties: {
          Show: {
            checkbox: true,
          },
        },
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  },
});
