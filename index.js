import {
    boardSize,
    ships,
    placedShips,
    board,
    showMessage,
    playBoomSound,
    showBoomAnimation,
    createBoard,
    placeShipsRandomly,
    updateShipCounter
} from './functions.js'; // ייבוא פונקציות ומשתנים מקובץ functions.js

document.addEventListener('DOMContentLoaded', function() {
    // כאשר הדף נטען
    document.querySelector('.game-container').style.display = 'none';
     // הסתרת אזור המשחק עד שהמשתמש מתחיל

    
      // פונקציה שמופעלת כאשר לוחצים על תא בלוח
    function cellClick(event) {
        const row = parseInt(event.target.dataset.row); // קבלת מספר שורה מהתא
        const col = parseInt(event.target.dataset.col); // קבלת מספר עמודה מהתא
        if (board[row][col].isHit) { // אם כבר נלחץ התא הזה בעבר
            showMessage('You Have Clicked Her Before.');
            return;
        }

        board[row][col].isHit = true; // סימון התא כנפגע

        if (board[row][col].hasShip) {  // אם יש ספינה בתא הזה
            const shipId = board[row][col].shipId; // קבלת מזהה הספינה
             
              // חיפוש הספינה במערך הספינות שהונחו
            for (let i = 0; i < placedShips.length; i++) {
                if (placedShips[i].id === shipId) {
                    placedShips[i].hits++; // הגדלת מונה הפגיעות בספינה
                    if (placedShips[i].hits === placedShips[i].size) { // אם כל חלקי הספינה נפגעו
                        ships[placedShips[i].size]--; // עדכון מונה הספינות מסוג זה
                        updateShipCounter(); // עדכון מונה הספינות בממשק
                        showMessage(` A Ship Size Of ${placedShips[i].size}!`); // הודעה על השמדת ספינה
                    } else {
                        showMessage('Hit!'); // הודעה על פגיעה בלבד
                    }
                    break;
                }
            }
            playBoomSound(); // הפעלת צליל
            showBoomAnimation(event.target); // אפקט פיצוץ חזותי על התא
            event.target.classList.add('hit'); // הוספת עיצוב "פגיעה" לתא
            checkWin(); // בדיקה אם כל הספינות הושמדו
        } else {
            showMessage('Error! Try Again.'); // הודעה על פספוס
            event.target.classList.add('miss'); // הוספת עיצוב "פספוס" לתא
        }
    }

    // المرور على كل نوع سفينة // פונקציה שבודקת אם כל הספינות הושמדו
    function checkWin() {
        let totalShips = 0;
        for (const size in ships) {
            totalShips += ships[size]; // סכימת כל הספינות שנותרו
        }
        if (totalShips === 0) {
            setTimeout(() => {
                alert('Congratulations. You`ve Won.All Ships Have Sunk.');
                resetGame(); // איפוס המשחק
            }, 1000);
        }
    }

    // פונקציה לאיפוס המשחק
     // دالة لإعادة تعيين اللعبة
    function resetGame() {
        let newBoardSize = parseInt(document.querySelector('input[name="gridSize"]:checked').value);
        // גודל לוח חדש מהמשתמש
        ships["2"] = parseInt(document.getElementById('ship2').value);
        // עדכון כמות ספינות בגודל 2
        ships["3"] = parseInt(document.getElementById('ship3').value);
        ships["4"] = parseInt(document.getElementById('ship4').value);
        ships["5"] = parseInt(document.getElementById('ship5').value);
        createBoard(newBoardSize, cellClick);  // יצירת לוח חדש
        placeShipsRandomly(updateShipCounter); // הנחת ספינות באקראי
    }
     
     // התחלת משחק בלחיצה על כפתור "התחל משחק"
    document.getElementById('startGame').addEventListener('click', function() {
        let newBoardSize = parseInt(document.querySelector('input[name="gridSize"]:checked').value);
        // קבלת גודל לוח מהמשתמש
        ships["2"] = parseInt(document.getElementById('ship2').value);
        ships["3"] = parseInt(document.getElementById('ship3').value);
        ships["4"] = parseInt(document.getElementById('ship4').value);
        ships["5"] = parseInt(document.getElementById('ship5').value);

        const totalShips = ships["2"] + ships["3"] + ships["4"] + ships["5"]; // סכימת כל הספינות
        if (totalShips === 0) {
            showMessage('At Least One Ship Must Be Selected.'); // חייב לבחור לפחות ספינה אחת
            return;
        }
        createBoard(newBoardSize, cellClick);  // יצירת לוח חדש
        placeShipsRandomly(updateShipCounter); // הנחת ספינות באקראי
        document.querySelector('.setup-container').style.display = 'none'; // إخفاء واجهة الإعدادات  // הסתרת מסך ההגדרות
        document.querySelector('.game-container').style.display = 'flex'; // إظهار واجهة اللعب // הצגת מסך המשחק
        showMessage('The Game Has Started. Click On The Squares To Search For Ships'); // הודעה על תחילת המשחק
    });
});
