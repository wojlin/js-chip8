import { CHIP8 } from './src/chip8.js';

window.chip8 = null;


document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const hexString = e.target.result;
            if(!(window.chip8 == null || window.chip8.length === 0))
            {
              window.chip8.stopExecution()
            }    
            window.chip8 = new CHIP8(hexString, "emulator-display", true, true);
            window.chip8.printMemory()
        };
        reader.readAsArrayBuffer(file);
    }
});


function httpGetAsync(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            const ret = xmlHttp.response
            const hexString = ret;
            if(!(window.chip8 == null || window.chip8.length === 0))
            {
              window.chip8.stopExecution()
            }    
            window.chip8 = new CHIP8(hexString, "emulator-display", true, true);
            window.chip8.printMemory()
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.responseType = 'arraybuffer'; // Set response type to arraybuffer
    xmlHttp.send(null);
}



window.selectProgram = function(elem)
{
    const val = document.getElementsByTagName("select")[0].options[elem].value
    console.log(val)

    httpGetAsync(val)
}


function listenKeyboard()
{
    setTimeout(function()
    {
        if(window.chip8 !== null)
        {
            console.log(chip8.await)
            document.getElementById("screen-tooltip").style.opacity = "1"
            document.getElementById("screen-tooltip").innerHTML = "Used Keys: " + chip8.await;
        }else
        {
            document.getElementById("screen-tooltip").style.opacity = "0"
        }
        listenKeyboard();
    }, 10); 
}

listenKeyboard()






var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
x.selectedIndex = 0;

l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  selElmnt.selectedIndex = 0;
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            selectProgram(s.selectedIndex)
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */

  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect); 