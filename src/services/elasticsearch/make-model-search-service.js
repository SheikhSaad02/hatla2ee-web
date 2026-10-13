import { capitalizeFirstLetter } from '@/utils/general';
import client from './client';

/*
The search query work in the followign way:
1. First, try exact-ish autocomplete matches for makes, then models.
2. If no good match, try prefix search (typing "Toy" matches "Toyota").
3. If still no match, try fuzzy search (fixing typos like "Toyta").
4. Always prefer makes over models when ranking.
5. Return max 10 cleaned suggestions.

Priority Table:

| Priority | Clause               | Match Type                     | Field               | Boost | Filter          |
| -------- | -------------------- | ------------------------------ | ------------------- | ----- | --------------- |
| 1        | **Highest priority** | `match` with `operator: 'and'` | `text.autocomplete` | 20    | `type == make`  |
| 2        | Second               | `match` with `operator: 'and'` | `text.autocomplete` | 15    | `type == model` |
| 3        | Third                | `prefix` match                 | `text`              | 12    | `type == make`  |
| 4        | Fourth               | `prefix` match                 | `text`              | 10    | `type == model` |
| 5        | Fifth                | `match` with `fuzziness: 2`    | `text`              | 8     | `type == make`  |
| 6        | Lowest priority      | `match` with `fuzziness: 2`    | `text`              | 5     | `type == model` |

*/
export class MakeModelSearchService {
  static async getSuggestions(query = '', size = 10, locale = 'en') {
    const textField = locale === 'ar' ? 'text_l1' : 'text';
    const autocompleteField = `${textField}.autocomplete`;

    const results = await client.search({
      body: {
        size,
        query: {
          bool: {
            should: [
              // 1. Make - autocomplete match
              {
                bool: {
                  must: [
                    {
                      match: {
                        [autocompleteField]: {
                          query,
                          operator: 'and',
                          boost: 20,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'make' } }],
                },
              },
              // 2. Model - autocomplete match
              {
                bool: {
                  must: [
                    {
                      match: {
                        [autocompleteField]: {
                          query,
                          operator: 'and',
                          boost: 15,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'model' } }],
                },
              },
              // 3. Make - prefix match
              {
                bool: {
                  must: [
                    {
                      prefix: {
                        [textField]: {
                          value: query,
                          boost: 12,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'make' } }],
                },
              },
              // 4. Model - prefix match
              {
                bool: {
                  must: [
                    {
                      prefix: {
                        [textField]: {
                          value: query,
                          boost: 10,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'model' } }],
                },
              },
              // 5. Make - fuzzy match
              {
                bool: {
                  must: [
                    {
                      match: {
                        [textField]: {
                          query,
                          fuzziness: 2,
                          boost: 8,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'make' } }],
                },
              },
              // 6. Model - fuzzy match
              {
                bool: {
                  must: [
                    {
                      match: {
                        [textField]: {
                          query,
                          fuzziness: 2,
                          boost: 5,
                        },
                      },
                    },
                  ],
                  filter: [{ term: { type: 'model' } }],
                },
              },
            ],
          },
        },
        sort: [{ _score: { order: 'desc' } }],
      },
    });

    // Post-process results
    const processedResults = results.hits?.hits
      .map((hit, index) => {
        const source = hit._source;
        return {
          id: source.id || index,
          label: source.text,
          label_l1: source.text_l1,
          value: source.text?.toLowerCase(),
          suffix: capitalizeFirstLetter(source.type),
          make: source.make,
          model: source.model,
          _score: hit._score,
          _type: source.type,
        };
      })
      .sort((a, b) => {
        // Score first
        if (b._score !== a._score) return b._score - a._score;
        // Makes before models
        if (a._type !== b._type) return a._type === 'make' ? -1 : 1;
        // Alphabetical fallback
        return a.label.localeCompare(b.label);
      })
      .map(({ _score, _type, ...item }) => item);

    return processedResults;
  }
}
