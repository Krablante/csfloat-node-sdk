export interface CursorPage {
  cursor?: string;
}

export interface PaginateCursorOptions<TPage extends CursorPage, TItem> {
  loadPage: (cursor?: string) => Promise<TPage>;
  getItems: (page: TPage) => TItem[];
  getCursor?: (page: TPage) => string | undefined;
}

export async function* paginateCursor<TPage extends CursorPage, TItem>(
  options: PaginateCursorOptions<TPage, TItem>,
): AsyncGenerator<TItem, void, undefined> {
  let cursor: string | undefined;

  while (true) {
    const page = await options.loadPage(cursor);
    const items = options.getItems(page);

    for (const item of items) {
      yield item;
    }

    const nextCursor = options.getCursor?.(page) ?? page.cursor;
    if (!nextCursor) {
      return;
    }

    cursor = nextCursor;
  }
}
