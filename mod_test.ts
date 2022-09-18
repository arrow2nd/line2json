import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { toJson } from "./mod.ts";

const expected = Deno.readTextFileSync("./testdata/expected.txt");

Deno.test("Parse LINE Talk File (mobile)", () => {
  const text = Deno.readTextFileSync("./testdata/talk-mobile.txt");
  const json = toJson(text);

  assertEquals(json, expected);
});

Deno.test("Parse LINE Talk File (PC)", () => {
  const text = Deno.readTextFileSync("./testdata/talk-pc.txt");
  const json = toJson(text);

  assertEquals(json, expected);
});
