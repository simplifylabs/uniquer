import { resolve, join } from 'path';
import fs from 'fs';
import { writeSync, write } from '../index';

const dExtension = 'txt';
const dEncoding = 'utf8';
const dData = 'Hello, world!';

const testDir = resolve(__dirname, '..', '..', 'tests/');
if (fs.existsSync(testDir)) removeTestDir();
fs.mkdirSync(testDir);

it('should write file sync', () => {
  const path = setupDir('sync');

  const output = writeSync(path, dExtension, dData, dEncoding);
  expect(fs.readFileSync(join(path, output), dEncoding)).toBe(dData);
});

it('should write file async', async () => {
  const path = setupDir('async');

  const output = await write(path, dExtension, dData, dEncoding);
  expect(fs.readFileSync(join(path, output), dEncoding)).toBe(dData);
});

it('should write same file once', async () => {
  const path = setupDir('once');

  const output = await writeSync(path, dExtension, dData, dEncoding);
  writeSync(path, dExtension, dData, dEncoding);

  expect(fs.readFileSync(join(path, output), dEncoding)).toBe(dData);
  expect(fs.readdirSync(path).length).toBe(1);
});

it('should write different files seperately', async () => {
  const path = setupDir('different');

  const data1 = 'Data 1';
  const data2 = 'Data 2';

  const output1 = writeSync(path, dExtension, data1, dEncoding);
  const output2 = writeSync(path, dExtension, data2, dEncoding);

  expect(fs.readFileSync(join(path, output1), dEncoding)).toBe(data1);
  expect(fs.readFileSync(join(path, output2), dEncoding)).toBe(data2);

  expect(fs.readdirSync(path).length).toBe(2);
});

it('should fail when file passed', async () => {
  const path = setupDir('fail');
  const filePath = join(path, 'file.txt');

  expect(() => writeSync(path, filePath, dData, dEncoding)).toThrow(/ENOENT/);
});

it('should use right file name', async () => {
  const path = setupDir('filename');

  const output1 = writeSync(path, '.test', dData, dEncoding);
  const output2 = writeSync(path, 'test', dData, dEncoding);

  expect(output1).toMatch(/([0-9a-fA-F]+).test/g);
  expect(output2).toMatch(/([0-9a-fA-F]+).test/g);
});

it('should support relative paths', async () => {
  const path = 'tests/';

  const output = writeSync(path, dExtension, dData, dEncoding);
  expect(fs.readFileSync(join(path, output), dEncoding)).toBe(dData);
});

afterAll(async () => {
  removeTestDir();
});

function setupDir(name: string) {
  const path = join(testDir, name);
  fs.mkdirSync(path);
  return path;
}

function removeTestDir() {
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
}
