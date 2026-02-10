# JM-News Server

The server is implemented as a **NestJS** application using **SQLite** (via TypeORM) and **Kuromoji** for tokenization.

## 1. Setup & Startup

### Dependencies
JMDict is required for the server to run. A script is provided to download the latest version.

```bash
# Download JMDict (100MB+)
pnpm download:jmdict

# Start Server
pnpm start:dev
```

### Architecture
- **JMDictService**: Loads dictionary into memory on startup (~450k entries).
- **TokenizerService**: Wraps Kuromoji, stems words, and attaches JMDict definitions.
- **SQLite**: Stores `articles` (with tokens) and `vocabulary_references`.

---

## 2. API Verification Results

### 1. Create Vocabulary
We choose words the user wants to study.

**Request:** `POST /api/vocabularies`
```json
{ "dictKey": "食べる", "level": 5 }
```

### 2. Generate Article
Simulating the "AI" step by posting raw text. The server tokenizes it and finds our target vocab.

**Request:** `POST /api/articles/generate`
```json
{
  "title": "Test Article",
  "text": "今日は美味しい果物を食べました。",
  "vocabIds": ["<UUID_FROM_STEP_1>"]
}
```

**Response (excerpt):**
```json
{
  "tokensJson": [
    {
      "surface": "食べ",
      "base": "食べる",
      "reading": "たべる",
      "meanings": ["to eat", ...],
      "isTarget": true  // <-- Correctly matched!
    }
  ]
}
```

### 3. Doomscroll Feed
Lightweight preview for the timeline.

**Request:** `GET /api/articles/feed`
**Response:**
```json
[
  {
    "id": "...",
    "title": "Test Article",
    "previewText": "今日は美味しい果物を食べました。" // No heavy tokens
  }
]
```

### 4. Full Article
Rich data for the reader view.

**Request:** `GET /api/articles/{id}`
**Response:**
```json
{
  "title": "Test Article",
  "tokens": [
    { "surface": "今日", "base": "今日", ... },
    { "surface": "は", "base": "は", ... },
    ...
  ]
}
```

---

## 3. Key Files

| File | Purpose |
|------|---------|
| [jmdict.service.ts](file:///home/irlan/dev/irlan-dev/jpnfads-dev/jm-news/jm-news-server/src/jmdict/jmdict.service.ts) | Dictionary loader & indexer |
| [tokenizer.service.ts](file:///home/irlan/dev/irlan-dev/jpnfads-dev/jm-news/jm-news-server/src/tokenizer/tokenizer.service.ts) | Pipeline: Text → Kuromoji → JMDict |
| [article.service.ts](file:///home/irlan/dev/irlan-dev/jpnfads-dev/jm-news/jm-news-server/src/article/article.service.ts) | Article generation logic |
| [download-jmdict.ts](file:///home/irlan/dev/irlan-dev/jpnfads-dev/jm-news/jm-news-server/scripts/download-jmdict.ts) | Robust download script |
