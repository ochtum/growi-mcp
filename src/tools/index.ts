import { ALL_TOOLS } from './definitions.js';
import { handleListPages } from './list-pages.js';
import { handleGetPage } from './get-page.js';
import { handleCreatePage } from './create-page.js';
import { handleUpdatePage } from './update-page.js';
import { handleSearchPages } from './search-pages.js';
import { ApiClient } from '../api/index.js';
import { 
  isListPagesArgs, 
  isGetPageArgs, 
  isCreatePageArgs, 
  isUpdatePageArgs, 
  isSearchPagesArgs 
} from '../utils/index.js';

export { ALL_TOOLS };

export async function handleToolCall(apiClient: ApiClient, name: string, args: any) {
  try {
    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "growi_list_pages") {
      if (!isListPagesArgs(args)) {
        throw new Error("Invalid arguments for growi_list_pages");
      }
      return handleListPages(apiClient, args);
    }

    if (name === "growi_get_page") {
      if (!isGetPageArgs(args)) {
        throw new Error("Invalid arguments for growi_get_page");
      }
      return handleGetPage(apiClient, args);
    }

    if (name === "growi_create_page") {
      if (!isCreatePageArgs(args)) {
        throw new Error("Invalid arguments for growi_create_page");
      }
      return handleCreatePage(apiClient, args);
    }

    if (name === "growi_update_page") {
      if (!isUpdatePageArgs(args)) {
        throw new Error("Invalid arguments for growi_update_page");
      }
      return handleUpdatePage(apiClient, args);
    }

    if (name === "growi_search_pages") {
      if (!isSearchPagesArgs(args)) {
        throw new Error("Invalid arguments for growi_search_pages");
      }
      return handleSearchPages(apiClient, args);
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}
