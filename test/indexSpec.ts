import * as assert from "assert";

import * as fs from "fs";
import * as path from "path";

import { fromYAMLFilePaths, fromYAMLFilePath, fromYAML, getRuleFilePath } from "../lib/";

import "./engineSpec";
import "./ruleSpec";
import "./paragraphSpec";
import "./changeset/changesetSpec";
import "./changeset/diffSpec";
import "./utils/regexpSpec";
import "./utils/contentSpec";

describe("index", () => {
    describe("fromYAMLFilePaths", () => {
        it("parse yaml files to Config", () => {
            fromYAMLFilePaths("./rules/media/WEB+DB_PRESS.yml", "./rules/files/markdown.yml");
        });
    });
    describe("fromYAMLFilePath", () => {
        it("parse yaml file to Config", () => {
            fromYAMLFilePath("./rules/media/WEB+DB_PRESS.yml");
        });
    });
    describe("fromYAML", () => {
        it("parse yaml string to Config", () => {
            const configPath = "./rules/media/WEB+DB_PRESS.yml";
            const yamlContent = fs.readFileSync(configPath, { encoding: "utf8" });
            fromYAML(configPath, yamlContent);
        });
    });
    describe("getRuleFilePath", () => {
        it("can find prh.yml", () => {
            assert(getRuleFilePath("./misc") === path.join(process.cwd(), "misc/prh.yml"));
        });
    });
    describe("try all yml files in misc", () => {
        const targetDir = path.resolve(__dirname, "..", "misc");
        fs
            .readdirSync(targetDir)
            .filter(file => /\.yml$/.test(file))
            .forEach(file => {
                it(`try ${file}`, () => {
                    const configPath = `${targetDir}/${file}`;
                    const yamlContent = fs.readFileSync(configPath, { encoding: "utf8" });
                    fromYAML(configPath, yamlContent);
                });
            });
    });
    it("can import other yaml file", () => {
        const miscPrhEngine = fromYAMLFilePath("./misc/imports-a.yml");
        const miscSampleEngine = fromYAMLFilePath("./misc/imports-b.yml");

        const engine = fromYAMLFilePath("./misc/imports.yml");

        assert(engine.rules.length === miscPrhEngine.rules.length + miscSampleEngine.rules.length);
    });
});
