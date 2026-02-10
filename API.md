# JM-News Server API Documentation

Base URL: `http://localhost:3000/api`

## Vocabulary

### Add Vocabulary
Add a new word to the user's persistent vocabulary list. The `dictKey` should match a JMDict headword or reading.

**POST** `/vocabularies`

**Body:**
```json
{
  "dictKey": "食べる",       // Required: The word/kanji to track
  "level": 5,              // Optional: Difficulty level (e.g., JLPT N5)
  "note": "Don't forget",  // Optional
  "tags": "verb,food"      // Optional: Comma-separated tags
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "dictKey": "食べる",
  "level": 5,
  "createdAt": "2026-02-10T..."
}
```

### List Vocabularies
Get a paginated list of active (non-deleted) vocabularies.

**GET** `/vocabularies?page=1&limit=20`

**Response:**
```json
{
  "items": [ ... ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Get Random Vocabulary
Get random words from the vocabulary list (e.g., for spacing review or article generation).

**GET** `/vocabularies/random?n=5`

**Response:** Array of vocabulary objects.

### Delete Vocabulary
Soft-delete a vocabulary item. It will no longer appear in valid lists or be used for generation matches.

**DELETE** `/vocabularies/:id`

---

## Articles

### Generate Article
Submit raw text to be tokenized and processed. The server cleans the text, runs it through the tokenizer, looks up words in JMDict, and matches against the provided `vocabIds`.

**POST** `/articles/generate`

**Body:**
```json
{
  "title": "My Daily Journal",
  "text": "今日は美味しい果物を食べました。", // Raw Japanese text
  "vocabIds": ["uuid-1", "uuid-2"]      // Optional: IDs of vocab to highlight/target
}
```

**Response:** `201 Created`
```json
{
  "id": "article-uuid",
  "title": "My Daily Journal",
  "previewText": "今日は...",
  "targetVocabIds": ["uuid-1"]
}
```

### Get Feed
Get a lightweight list of articles for the timeline. Does NOT include the heavy token data.

**GET** `/articles/feed?page=1&limit=20`

**Response:**
```json
{
  "items": [
    {
      "id": "article-uuid",
      "title": "My Daily Journal",
      "previewText": "今日は美味しい果物を食べました。",
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

### Get Full Article
Get the full article content including the tokenized analysis.

**GET** `/articles/:id`

**Response:**
```json
{
  "id": "article-uuid",
  "title": "My Daily Journal",
  "tokens": [
    {
      "surface": "食べ",        // The word as it appears in text
      "base": "食べる",         // Dictionary form
      "reading": "たべる",      // Reading (Furigana)
      "pos": "v1, vt",        // Part of speech
      "meanings": ["to eat"], // English definitions
      "isTarget": true,       // True if matched against User's Vocabulary
      "index": 5
    },
    ...
  ]
}
```
