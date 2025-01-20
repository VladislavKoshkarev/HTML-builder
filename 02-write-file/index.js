const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rLine = readline.createInterface({ input: stdin, output: stdout });
const info = 'Enter text\nType exit or press ctrl + c to leave\n';

fs.writeFile(path.join(__dirname, 'text.txt'), '', (error) => {
  if (error) throw error;
});
stdout.write(info);

rLine.on('line', (data) => {
  if (data === 'exit') {
    console.log('Work ended after keyword typing. Have a nice day!');
    rLine.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), data + '\n', (error) => {
      if (error) throw error;
      console.log(`text.txt file updated
${info}`);
    });
  }
});
rLine.on('SIGINT', () => {
  console.log('Work ended after pressing ctrl + c. Have a nice day!');
  rLine.close();
});
