//הגדרת גודל ברירת מחדל של הלוח (מספר שורות ועמודות).
export let boardSize = 10;
// הגדרת סוגי וכמות הספינות הנדרשות במשחק (המפתח הוא גודל הספינה, הערך הוא מספר הספינות).
export let ships = { "2": 1, "3": 1, "4": 1, "5": 1 };
// מערך לאחסון נתוני הספינות שהונחו על הלוח.
export let placedShips = [];
// מערך דו-ממדי שמייצג את לוח המשחק, כל תא הוא אובייקט שמייצג את מצב התא.
export let board = [];


// פונקציה שמציגה הודעה זמנית למשתמש ומסתירה אותה אחרי שתי שניות.
export function showMessage(text) {
    const msgDiv = document.getElementById('msg'); // קבלת אלמנט ההודעה מה-HTML
    msgDiv.textContent = text; // הצגת הטקסט בהודעה
    msgDiv.style.display = 'block'; // הצגת ההודעה
    setTimeout(() => {
        msgDiv.style.display = 'none'; // הסתרת ההודעה אחרי 2 שניות
    }, 2000);
}


 // פונקציה שמפעילה קול
export function playBoomSound() {
    document.getElementById('boomSound').play();  // הפעלת קול מה-HTML
}
// פונקציה שמציגה אפקט פיצוץ על תא
export function showBoomAnimation(cell) {
    cell.classList.add('boom-animation');  // הוספת מחלקה לאפקט
    setTimeout(() => {
        cell.classList.remove('boom-animation');
    }, 800); // הסרת האפקט אחרי 0.8 שניות
}


// יצירת לוח משחק חדש
export function createBoard(size, cellClick) {
    boardSize = size; // עדכון גודל הלוח
    board = []; // איפוס הלוח
    const boardElement = document.getElementById('board'); // קבלת אלמנט הלוח
    boardElement.innerHTML = ''; // ניקוי תוכן הלוח
      // יצירת מערך דו-ממדי
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                hasShip: false, // האם יש ספינה בתא
                shipId: null, // מזהה הספינה (אם יש)
                isHit: false   // האם התא נורה
            };
        }
    }
      // יצירת טבלת HTML
    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');// יצירת שורה
        for (let j = 0; j < size; j++) {
            const td = document.createElement('td'); // יצירת תא
            td.dataset.row = i;  // שמירת מספר השורה
            td.dataset.col = j;  // שמירת מספר העמודה
            td.addEventListener('click', cellClick); // הוספת אירוע לחיצה
            tr.appendChild(td); // הוספת התא לשורה
        }
        table.appendChild(tr);  // הוספת השורה לטבלה
    }
    boardElement.appendChild(table);  // הוספת הטבלה ללוח בדף
}



// בדיקה אם אפשר להניח ספינה
export function canPlaceShip(row, col, size, isHorizontal) {
    // בדיקת גבולות אופקית
    if (isHorizontal) {
        if (col + size > boardSize) return false;
    } else {
        // בדיקת גבולות אנכית
        if (row + size > boardSize) return false;
    }
     
     // בדיקת חפיפה או צמידות לספינות אחרות
    for (let i = -1; i <= size; i++) {
        // j يمثل الاتجاه العمودي أو الأفقي حول كل جزء من السفينة (فوق، على، تحت أو يسار، على، يمين).
        for (let j = -1; j <= 1; j++) {
            // السطران يحسبان موقع كل خلية حول السفينة (وأيضًا السفينة نفسها) حسب اتجاهها.
            // الهدف: التأكد من أن هذه الخلايا كلها فارغة (لا يوجد بها سفن أخرى).
            let r = row + (isHorizontal ? j : i);
            let c = col + (isHorizontal ? i : j);
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                if (board[r][c].hasShip) {
                    return false;  // יש ספינה בסביבה - אי אפשר להניח כאן
                }
            }
        }
    }
    return true; // אפשר להניח ספינה כאן
}


 // הנחת ספינה על הלוח
export function placeShip(row, col, size, isHorizontal, shipId) {
    for (let i = 0; i < size; i++) {
        let r = row + (isHorizontal ? 0 : i);
        let c = col + (isHorizontal ? i : 0);
        board[r][c].hasShip = true; // وضع السفينة // סימון שהתא מכיל ספינה
        board[r][c].shipId = shipId; // تعيين رقم السفينة // שמירת מזהה הספינה בתא
    }
}

// הנחת כל הספינות באקראי
export function placeShipsRandomly(updateShipCounter) {
    placedShips = [];
    let shipId = 0;
    for (let size = 2; size <= 5; size++) {
        const count = ships[size];
        for (let i = 0; i < count; i++) {
            let placed = false; // متغير placed لنعرف هل تم وضع السفينة بنجاح أم لا.
            let attempts = 0; // متغير attempts لعدّ عدد المحاولات (حتى لا ندخل في حلقة لا نهائية).
            while (!placed && attempts < 100) {  // עד 100 ניסיונות להניח ספינה
                attempts++;
                const isHorizontal = Math.random() < 0.5;
                const row = Math.floor(Math.random() * boardSize);
                const col = Math.floor(Math.random() * boardSize);
                if (canPlaceShip(row, col, size, isHorizontal)) {
                    placeShip(row, col, size, isHorizontal, shipId);
                    placedShips.push({
                        id: shipId,
                        size: size,
                        hits: 0
                    });
                    shipId++;
                    placed = true;
                }
            }
        }
    }
    updateShipCounter(); // עדכון מונה הספינות בממשק
}

// עדכון מונה הספינות בממשק המשתמש
// دالة لتحديث عداد السفن المتبقية في واجهة المستخدم
// تقوم بإعادة بناء جدول أنواع وعدد السفن المتبقية
export function updateShipCounter() {
    const tbody = document.querySelector('#shipsRemaining tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const shipSizes = Object.keys(ships).sort((a, b) => a - b);
    for (const size of shipSizes) {
        if (ships[size] > 0) {
            const tr = document.createElement('tr');
            const tdType = document.createElement('td');
            tdType.textContent = `Ship Size  ${size}`;
            tr.appendChild(tdType);
            const tdCount = document.createElement('td');
            tdCount.textContent = ships[size];
            tdCount.className = 'ship-count';
            tr.appendChild(tdCount);
            tbody.appendChild(tr);
        }
    }
}
