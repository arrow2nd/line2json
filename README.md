# line-talk-parser

LINE のトーク履歴ファイルをパースするやつ

## 使い方

### パースする

```ts
import {
  parse,
  TalkData,
} from "https://github.com/arrow2nd/line-talk-parser/raw/main/mod.ts";

const text = Deno.readTextFileSync("talk_histroy.txt");
const histories: TalkData[] = parse(text);

console.log(histories);
```

### JSON にする

```ts
import { toJson } from "https://github.com/arrow2nd/line-talk-parser/raw/main/mod.ts";

const text = Deno.readTextFileSync("talk_histroy.txt");
const json = toJson(text);

Deno.writeTextFileSync("histroy.json", json);
```
