# Uniquer

Save equal files only once, avoid duplicates.

<br />

## Install

NPM

```
npm install uniquer
```

Yarn

```
yarn add uniquer
```

<br />

## Usage

Synchronously

```js
import Uniquer from 'uniquer';

const fileName = Uniquer.writeSync('./output/', '.txt', 'Hello, world!');

// 315f5bdb...5894edd3.txt
console.log(fileName);
```

Asynchronously

```js
import Uniquer from 'uniquer';

const fileName = await Uniquer.write('./output/', '.txt', 'Hello, world!');

// 315f5bdb...5894edd3.txt
console.log(fileName);
```

<br />

This may be all you need to use Uniquer. For advanced usage, see [API](#API)

<br />

## Advantages

### 📦 Save storage

No duplicates, more storage.

### 💻 Save performance

Only write a file if it doesn't exist.

### 📁 Get unique file names

No need to think of a creative file name.

### 🧹 Keep it clean

No duplicates, less files, cleaner.

<br />

## How it works

The concept is that simple:

1. Create the SHA256 hash of the passed data.
2. Get the file name by appending the file extension.
3. Check if a file with this name already exists. If...
   - ...not, create it.
   - ...yes, do nothing.

This means: Same data, same file name. So, if you try to write the same data multiple times, it will:

- write the data only once.
- only create a single file.

There is no need to worry that there could be a duplicate file name,
as there wasn't any collision with SHA256 **ever**. More [here.](https://crypto.stackexchange.com/questions/47809/why-havent-any-sha-256-collisions-been-found-yet)

<br />

## API

### Uniquer.writeSync(directory, extension, data[, options])

Write data to a unique file synchronously.\
Calling multiple times with the exact same data,
will result in the same file name.

|             |                              |                              |
| ----------- | ---------------------------- | ---------------------------- |
| `directory` | `String`                     | Path to the output directory |
| `extension` | `String`                     | File extension               |
| `data`      | `String \| ArrayBufferView`  | The file's data              |
| [`options`] | `String \| WriteFileOptions` | Encoding or WriteFileOptions |
| _returns_   | `String`                     | File name of created file    |

Example

```javascript
import Uniquer from 'uniquer';
// 315f5bdb...5894edd3.txt
const fileName = Uniquer.writeSync('./output/', '.txt', 'Hello, world!');
```

<br />

### Uniquer.write(directory, extension, data[, options])

Write data to a unique file asynchronously.\
Calling multiple times with the exact same data,
will result in the same file name.

|             |                              |                              |
| ----------- | ---------------------------- | ---------------------------- |
| `directory` | `String`                     | Path to the output directory |
| `extension` | `String`                     | File extension               |
| `data`      | `String \| ArrayBufferView`  | The file's data              |
| [`options`] | `String \| WriteFileOptions` | Encoding or WriteFileOptions |
| _returns_   | `Promise<String>`            | File name of created file    |

Example

```javascript
import Uniquer from 'uniquer';
// 315f5bdb...5894edd3.txt
const fileName = await Uniquer.write('./output/', '.txt', 'Hello, world!');
```

<br />

### Uniquer.getFileName(extension, data)

Resolve the unique file path, based on the file hash + extension.

|             |                             |                    |
| ----------- | --------------------------- | ------------------ |
| `extension` | `String`                    | File extension     |
| `data`      | `String \| ArrayBufferView` | The file's data    |
| _returns_   | `String`                    | Resolved file name |

Example

```javascript
import Uniquer from 'uniquer';
// 315f5bdb...5894edd3.txt
const fileName = Uniquer.getFileName('.txt', 'Hello, world!');
```

<br />

### Uniquer.getFilePath(directory, extension, data)

Resolve the unique file path, based on the file hash + extension.

|             |                             |                              |
| ----------- | --------------------------- | ---------------------------- |
| `directory` | `String`                    | Path to the output directory |
| `extension` | `String`                    | File extension               |
| `data`      | `String \| ArrayBufferView` | The file's data              |
| _returns_   | `String`                    | Resolved file path           |

Example

```javascript
import Uniquer from 'uniquer';

// /home/user/output/315f5bdb...5894edd3.txt
const filePath = Uniquer.getFilePath('/home/user/output/', '.txt', 'Hello, world!');
```

<br />

### Uniquer.getFileHash(data)

Get the SHA256 hash of the data, converted to hex format.

|           |                             |                  |
| --------- | --------------------------- | ---------------- |
| `data`    | `String \| ArrayBufferView` | The file's data  |
| _returns_ | `String`                    | SHA256 file hash |

Example

```javascript
import Uniquer from 'uniquer';

const hash = Uniquer.getFileHash('Hello, world!');

// 315f5bdb...5894edd3
console.log(hash);
```
