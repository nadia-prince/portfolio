import { boradNumbers, oldManMumbers, strikes } from "./global.js";
// מייבא שלושה מערכים מהקובץ global.js: 
// boradNumbers - המספרים שעל הלוח
// oldManMumbers - המספרים שהוגרלו ע"י "הזקן"
// strikes - כמות הפסילות


export function getoldManNumber() {
     // פונקציה שמגרילה מספר חדש לזקן
    let n = getRandomNumber();
      // מגרילה מספר אקראי ושומרת אותו ב-n

    while(oldManMumbers.some((num) => num == n))
        n = getRandomNumber();
 // כל עוד המספר כבר הוגרל, מגרילה שוב עד שמוצאת מספר שלא הוגרל
    oldManMumbers.push(n);
    // מוסיפה את המספר החדש למערך ההגרלות של הזקן
    document.querySelector('#oldMan').innerHTML = `<p>${oldManMumbers.join(', ')}</p>`;
     // מציגה את כל המספרים שהוגרלו עד כה בתיבת oldMan בדף
}

function getRandomNumber(){
    // פונקציה שמחזירה מספר אקראי בין 1 ל-99
    let num = Math.floor(Math.random() * (100-1) + 1);
     // מחשבת מספר אקראי שלם בין 1 ל-99
    return num;
    // מחזירה את המספר
}


// יוצרת לוח משחק בגודל 7x7 ומכניסה אותו ל-#board
export function startGame(){
    let board = document.querySelector('#board');
     // מוצאת את האלמנט של הלוח בדף
    let table = createTable(7, 7);
    board.appendChild(table);
    // מוסיפה את הטבלה ללוח בדף
}

function createTable(rows, cols){
    // פונקציה שיוצרת טבלת משחק בגודל rows x cols
    let table = document.createElement('table');
    // יוצרת אלמנט טבלה חדש
    for(let i = 0; i < rows; i++){
        let tr = document.createElement('tr');
         // יוצרת שורה חדשה
        for(let j = 0; j < cols; j++){
            let td = document.createElement('td');
              // יוצרת תא חדש
            let n = getRandomNumber();
            // מגרילה מספר אקראי
            //בדיקה שהמספר לא קיים-נרתה להגריל מספר חדש
            while(boradNumbers.some((num) => num == n))
                n = getRandomNumber();

            //הוספת המספר החדש למערך
            boradNumbers.push(n);
            td.textContent = n;
            // שמה את המספר בתא
            td.addEventListener('click', checkvalue);
             // מוסיפה אירוע לחיצה על התא לבדיקת המספר

            tr.appendChild(td);
             // מוסיפה את התא לשורה
        }
        table.appendChild(tr);
          // מוסיפה את השורה לטבלה
    }
    return table;
     // מחזירה את הטבלה שנוצרה

}

// event.target -->שלחתי עליו td 
function checkvalue(event){
    // פונקציה שבודקת מה קורה כשלוחצים על תא
    let tdNum = Number(event.target.textContent);
    // לוקחת את המספר שבתא שנלח
    if (oldManMumbers.some((num) => num == tdNum)){
        // אם המספר מופיע בין המספרים שהוגרלו ע"י הזקן
        event.target.classList.add('marked');
        // מסמנת את התא כ"מסומן"
        event.target.removeEventListener('click', checkvalue);
        // מבטלת אפשרות ללחוץ שוב על התא הזה
        checkWin(event.target);
         // בודקת אם יש ניצחון (שורה/עמודה מלאה)
    }  

    else {
        strikes.push(1);
        // מוסיפה פסילה למערך הפסילות
        let totalstrikes = strikes.reduce((total, num) => total + num, 0);
        if(totalstrikes == 3){
            alert("You Are Disqualified! Try Next Time.");
            // סופרת את סך כל הפסילות
        } else{
            alert(`The number was not drawn! Strike ${strikes.reduce((total, num) => total + num, 0)}`);
            // אחרת - מודיעה כמה פסילות יש
        }
    }
}



function checkWin(td){
    // פונקציה שבודקת אם יש ניצחון (שורה או עמודה מלאה)
    const tr = td.parentElement;
     // מוצאת את השורה של התא
    const table = tr.parentElement;
    // מוצאת את הטבלה
    const colIndex = td.cellIndex;
      // מוצאת את מספר העמודה של התא
    // בדיקת שורה
    // Check row
    let rowWin = true;
    for(let cell of tr.children){
        if(!cell.classList.contains('marked')){
            rowWin = false;
            break;
        }
    }
     // בדיקת עמודה
    // Check column
    let colWin = true;
    for(let row of table.children){
        let cell = row.children[colIndex];
        if(!cell.classList.contains('marked')){
            colWin = false;
            break;
        }
    }

    if(rowWin || colWin){
        setTimeout(() => { alert("Victory!"); }, 100); // Slight delay for visual effect
        // הודעת ניצחון אחרי השהיה קצרה
    }
}






