export const chunkItems = (items = [], rows) => {
  const chunks = [];
  for (let i = 0; i < items?.length; i += rows) {
    const filteredItems = items.slice(i, i + rows); //get all items for a chunk based on number of rows e.g 3 rows means 3 items in a chunk
    const key = filteredItems.map((item) => item?.slug).join('-'); //make key by joining slug for all itmes with a - e.g a-b-c
    chunks.push({ items: filteredItems, index: key });
  }

  return chunks;
};
