const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rLine = readline.createInterface({ input: stdin, output: stdout });
const info = 'Введите текст\nДля выхода введите exit или нажмите ctrl + c\n';

fs.writeFile(path.join(__dirname, 'text.txt'), '', (error) => {
  if (error) throw error;
});
stdout.write(info);

rLine.on('line', (data) => {
  if (data === 'exit') {
    console.log('Работа завершена после ввода ключевого слова. Хорошего дня!');
    rLine.close();
  }
  else {
    fs.appendFile(path.join(__dirname, 'text.txt'), data + '\n', (error) => {
      if (error) throw error;
      console.log(`Файл text.txt обновлен 
${info}`);
    });
  }
});
rLine.on('SIGINT', () => {
  console.log('Работа завершена после нажатия ctrl + c. Хорошего дня!');
  rLine.close();
});