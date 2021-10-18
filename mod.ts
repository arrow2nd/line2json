const regexp = {
  date: /^\d{4}[\/\.]\d{1,2}[\/\.]\d{1,2}/,
  time: /\d{1,2}:\d{1,2}/,
  talk: /^(.*\d{1,2}:\d{1,2})\t(.*)\t(.*)/,
};

export type TalkData = {
  date: string;
  time: string;
  user: string;
  message: string;
};

function isMessage(text: string): boolean {
  text = text.trim();
  if (text === "") return false;

  const ignoreList = [
    /^\[LINE\].+とのトーク履歴/,
    /^\[.+\]$/,
    /通話時間 \d{1,2}:\d{1,2}/,
    /通話をキャンセルしました$/,
    /不在着信$/,
    /^.+がメッセージの送信を取り消しました$/,
    /.+を作成しました$/,
    /^イベント.+が.{2}されました/,
    /⁩アルバムを.{2}しました/,
    /ノート[をに].{2}しました/,
    /アルバムに写真を追加しました/,
    /^\(emoji\)/,
    /https?:\/\//,
  ];

  for (const ignore of ignoreList) {
    if (ignore.test(text)) return false;
  }

  return true;
}

function to24Hour(time: string): string {
  const t = time.match(regexp.time)?.toString();
  if (!t) return "";

  if (/^午後/.test(time)) {
    return t
      .split(":")
      .map((e, i) => {
        const n = parseInt(e.trim());
        return String(i === 0 ? n + 12 : n).padStart(2, "0");
      })
      .join(":");
  }

  return t;
}

function fmtDate(date: string): string {
  const d = date.match(regexp.date)?.toString();
  if (!d) return "";

  return d.replaceAll(".", "/");
}

/**
 * LINEトーク履歴をパース
 *
 * @param text トーク履歴文字列
 */
export function parse(text: string): TalkData[] {
  const lines = text.split(/[\r\n]/).filter((e) => e !== "");
  const results: TalkData[] = [];

  let date = "";
  let time = "";
  let user = "";
  let message = "";

  for (const line of lines) {
    // 日付を抽出
    if (regexp.date.test(line)) {
      date = fmtDate(line);
      continue;
    }

    // トークを分割
    const splited = line.match(regexp.talk)?.map((e) => e.trim());

    if (splited) {
      if (isMessage(message)) {
        results.push({
          date,
          time,
          user,
          message: message.replace(/(^\"|\"$)/g, ""), // ダブルクオートを削除
        });
      }

      time = to24Hour(splited[1]);
      user = splited[2].replace(/\t.*$/g, ""); // 引用元の名前を削除
      message = splited[3];
    } else if (!regexp.time.test(line)) {
      // 複数行をまとめる
      message += ` ${line}`;
    }
  }

  return results;
}

/**
 * LINEトーク履歴をJSON文字列に変換
 *
 * @param text トーク履歴文字列
 */
export function toJson(text: string) {
  return JSON.stringify(parse(text), null, "\t");
}
