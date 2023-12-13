$(document).ready(load);
let base = [];
let prodList = [];
let target = [];
let dlogSel = '';
let fadeOutTime = 5700;

function load() {

  fetch('dai').then(response => response.text())
    .then((data) => process(data));
  /* $.ajax({
    type: 'POST',
    url: 'dai',
    dataType: 'text',
    success: (data)=>{
      process(data);
    },
    error: (jqXHR, textStatus, errotThrow)=>{
      console.log(jqXHR['responseText']);
    }
  }); */

  $('#del').mouseup(() => {
    $('#msgs').html('');
    $('#msgs').append('<div class="msgd" id="d' + dlogSel + '">' + prodList[dlogSel].name + '.    fue elininado!!</div>');
    prodList.splice(dlogSel, 1);
    fillTab();
    $('#dlg').css('display', 'none');
    $('#msgs').css('display', 'flex');
    $('#d' + dlogSel + '').fadeOut(fadeOutTime);
  });

  let notify = () => {
    $('#msgs').html('<div class="msgi" id="i' + dlogSel + '">' + prodList[dlogSel].name + '.    modificado!!</div>');
    $('#dlg').css('display', 'none');
    $('#msgs').css('display', 'flex');
    $('#i' + dlogSel + '').fadeOut(fadeOutTime);
  };

  $('#close').click(() => {
    $('#moder').addClass('d-none');
    $('#moder').removeClass('ovr');
  });

  $('#edi').click(() => {
    fillMod();
    $('#moder').addClass('ovr');
    $('#moder').removeClass('d-none');
  });

  $('#mod').click((event) => {
    event.preventDefault();
    makeMod();
    notify();
  });

  $('#exit').click(() => {
    $('#dlg').css('display', 'none');
  });


  $('#name').change(() => {
    target = base.filter((obj) => {
      for (key in obj) {
        if (obj[key].includes($('#name').val())) {
          return obj;
        }
      }
    });
    fillPrice();
  });

  // alters();

  $('#qty').keyup(() => {
    prices();
  });
  $('#unitPrice').keyup(() => {
    prices();
  });
  $('#priceType').mouseup(() => {
    fillPrice();
    prices();
  });

  $('#buttn').click((event) => {
    if (($('#name').val() != '') && (Number($('#unitPrice').val()) > 0) && (Number($('#qty').val()) > 0)) {
      event.preventDefault();
      let nam = '';
      if (target[0] != undefined) {
        nam = target[0].name;
      } else {
        nam = $('#name').val();
      }
      let prod = {
        code: $('#name').val(),
        name: nam,
        q: $('#qty').val(),
        p: $('#unitPrice').val()
      };
      prodList.push(prod);
      fillTab();
      $('input').val('');
    } else {
      $('#msgs').html('<div class="msgi" id="i">  NO Estan Completos Los Datos</div>');
      $('#msgs').css('display', 'flex');
      $('#i').fadeOut(fadeOutTime);
    }
  });

  $('#cl-Name').keyup(() => {
    $('#clN').html($('#cl-Name').val());
  });
  $('#cl-Phone').keyup(() => {
    $('#clP').html($('#cl-Phone').val());
  });
  $('#cl-Nit').keyup(() => {
    $('#clNt').html($('#cl-Nit').val());
  });
  $('#tChanger').click(() => {
    if ($('#headT').val() == 'Proforma') {
      $('#headT').val('Cotización');
    } else {
      $('#headT').val('Proforma');
    }
  });

  //date for heder
  let tm = new Date();
  $('.t1').html('<div class="htm">Dia</div>' + tm.getDate());
  $('.t2').html('<div class="htm">Mes</div>' + (tm.getMonth() + 1));
  $('.t3').html('<div class="htm">Año</div>' + tm.getFullYear());
}

function fillTab() {
  $('#bdy').html('');
  let indx = 1;
  let tot = 0;
  prodList.forEach(elem => {
    //code &name needs some fix for save them
    tot = ((elem.q * elem.p) + tot);
    $('#bdy').append('<tr id=' + (indx - 1) + '><td scope="row">' + indx + '</td><td scope="row">' + elem.q + '</td><td>' + elem.name + '</td><td>Q.  ' + elem.p + '</td><td>Q.  ' + (elem.q * elem.p) + '</td></tr>');
    indx++;
  });
  //add zero to toto if is integer
  $('#fot').html('<th colspan="2">Total</th><th colspan="2" >' + toLetters(tot) + '</th><th>Q.  ' + tot + '</th>');
  // $('#fot').html('<th colspan="2">Total</th><th colspan="2"></th><th>Q.  '+tot+'</th>');
  $('#bdy tr').click((event) => {
    dlogSel = event.currentTarget.getAttribute('id');
    $('#dlg').css('display', 'flex');
    $('#dlg').css('top', event.clientY + 'px');
    $('#dlg').css('left', event.clientX + 'px');
  });

}

function process(brute) {
  let allLines = brute.split(/\r\n|\n/);
  // let hders = allLines[0].split[';'];
  for (var i = 1; i < allLines.length; i++) {
    let temp = allLines[i].split(';');
    if (temp.length == 4) {
      base.push({
        code: String(temp[0]),
        name: String(temp[1]),
        p1: String(temp[2]),
        p2: String(temp[3])
      });
    }
  }
  //addsugestions
  base.forEach((item, i) => {
    $('#sugestions').append('<option value="' + item.name + '">');
  });
}

function prices() {
  let q = $('#qty').val();
  let p = $('#unitPrice').val();
  $('#total').val(() => {
    if (p != '') {
      return p * q;
    } else {
      return q * 1;
    }
  });
}

function fillPrice() {
  if ($('#priceType').val() == '0') {
    if (target[0] != undefined) {
      $('#unitPrice').val(target[0].p1.replace('Q', ''));
    } else {
      $('#unitPrice').val('');
    }
  } else if ($('#priceType').val() == '1') {
    if (target[0] != undefined) {
      if (target[0].p2.replace('Q', '') == '0.00') {
        $('#unitPrice').val(target[0].p1.replace('Q', ''));
      } else {
        $('#unitPrice').val(target[0].p2.replace('Q', ''));
      }
    } else {
      $('#unitPrice').val('');
    }
  } else {
    $('#unitPrice').val(target[0].p1.replace('Q', ''));
  }
}

function fillMod() {
  $('#pName').val(prodList[dlogSel].name);
  $('#pQuanty').val(prodList[dlogSel].q);
  $('#pPrice').val(prodList[dlogSel].p);
}

function makeMod() {
  prodList[dlogSel].name = $('#pName').val();
  prodList[dlogSel].q = $('#pQuanty').val();
  prodList[dlogSel].p = $('#pPrice').val();
  fillTab();
  $('#moder').addClass('d-none');
  $('#moder').removeClass('ovr');
}

function alters() {
  let inps = document.querySelectorAll('input,select');
  for (var i = 0; i < inps.length; i++) {
    inps[i].addEventListener('keypress', (e) => {
      if (e.wich == 13) {
        e.preventDefault();
        console.log('impstarts');
        let nxtInp = document.querySelectorAll('[tabIndex="' + (this.tabIndex + 1) + '"]');
        if (nxtInp.length === 0) {
          console.log('inp0' + nxtInp.length);
          nxtInp = document.querySelectorAll('[tabIndex="1"]');
        }
      }
    });
  }
}

// function toLetters(numrc){
//   let numericData=[['Un ','Dos ','Tres ','Cuatro ','Cinco ','Seis ','Siete ','Ocho ','Nueve '],[['Once ','Doce ','Trece ','Catorce ','Quince ','Dieci'],'Veinti','Treinta y ','Cuarenta y ','Cincuenta y ','Sesenta y ','Setenta y ','Ochenta y ','Noventa y '],['Ciento ','Doscientos ','Trescientos ','Cuatrocientos ','Quinientos ','Seicientos ','Setecientos ','Ochocientos ','Novecientos ']]
//   let text = ['',''];
//   let temp1 = numrc.toString();
//   let dot = 77;
//   let temp2 = temp1.split('.');
//   let fix = temp2[0].length;
//   for (var i = 0; i < temp2[0].length; i++) {
//     console.log(fix);
//     if (fix <= 2) {
//       if (((temp2[0][temp2[0].length-2]+temp2[0][temp2[0].length-1])<=15) && (fix !=0)) {
//         text[0]+=numericData[1][0][temp2[0][temp2[0].length-1]-1];
//         console.log('catched -2');
//         fix -=2;
//       }else if (fix != 0) {
//         if (temp2[0][(temp2[0].length-fix)-1] == 1) {
//           text[0]+=numericData[(temp2[0].length-i)-1][0][5];
//           fix -=1;
//           console.log('xclussion10');
//         } else {
//           if (temp2[0][temp2[0].length-1] ==0) {
//             text[0]+=numericData[(temp2[0].length-i)-1][temp2[0][i]-1];
//             text[0]=text[0].slice(0,-2);
//             fix-=2;
//             console.log('xcluss20-20');
//           }else {
//             text[0]+=numericData[(temp2[0].length-i)-1][temp2[0][i]-1];
//             console.log('xcluss30&&');
//             fix--;
//           }
//         }
//       }
//     } else if (fix != 0){
//       text[0]+=numericData[(temp2[0].length-i)-1][temp2[0][i]-1];
//       fix--;
//       console.log('cathced normal');
//     }
//   }
//   return text
// }
function toLetters(num) {
  let parts = num.toLocaleString().split(',');
  // let parts = num.toString();
  function conversion(strNum) {
    let numericData = [['', 'Un ', 'Dos ', 'Tres ', 'Cuatro ', 'Cinco ', 'Seis ', 'Siete ', 'Ocho ', 'Nueve '], ['', 'Diez ', 'Veinti', 'Treinta y ', 'Cuarenta y ', 'Cincuenta y ', 'Sesenta y ', 'Setenta y ', 'Ochenta y ', 'Noventa y '], ['', 'Un ciento ', 'Doscientos ', 'Trescientos ', 'Cuatrocientos ', 'Quinientos ', 'Seicientos ', 'Setecientos ', 'Ochocientos ', 'Novecientos ']];
    let splitted = [];
    let tmp = [];
    let phrase = '';
    console.log('strNum ' + strNum);
    // for (var i = (strNum.length-1); i >= 0; i--) {
    //   // tmp.unshift(strNum[i]);
    //   // if (tmp.length == 3){
    //   //   splitted.unshift(tmp.join());
    //   //   tmp = [];
    //   // }
    //   // if (((strNum.length % 3) != 0)&& (i == 0)) {
    //   //   splitted.unshift(tmp.join());
    //   //   tmp = [];
    //   // }
    // }
    for (var i = strNum.length; i > 0; i--) {
      let standard = 0;
      if (strNum.length >= 3) {
        standard = 3;
      } else {
        standard = strNum.length;
      }
      console.log(standard + ' standard');
      for (var i2 = 1; i2 <= standard; i2++) {
        tmp.unshift(strNum[strNum.length - i2]);
      }
      splitted.unshift(tmp.join(''));
      tmp = [];
      if (strNum.length >= 3) {
        strNum = strNum.slice(0, strNum.length - 3);
        i -= 2;
      } else {
        i = 0;
      }
      console.log(strNum + ' strNum');
      console.log(strNum.length + ' length');
    }
    console.log('splitted ' + splitted[0] + '&& ' + splitted[1]);
    let thousand = 0;
    for (var currnt of splitted) {
      for (var single of currnt) {
        if ((currnt.length == 3) && (Number(currnt) >= 500)) {
          phrase += numericData[2][single];
          if (Number(currnt) == 500) {
            currnt = ''
            break
          } else if (Number(currnt) < 510) {
            currnt = currnt.slice(2, 3);
          } else {
            currnt = currnt.slice(1, 3);
          }
        } else if ((currnt.length) == 2 && Number(currnt[currnt.length - 1]) == 0) {
          phrase += numericData[1][Number(single)];
          if (Number(single) == 2) {
            phrase = phrase.slice(0, phrase.length - 1);
            phrase += 'e ';
          } else if (Number(single) >= 3) {
            phrase = phrase.slice(0, phrase.length - 3);
          }
          break
        } else if ((Number(currnt) >= 11) && (Number(currnt) <= 19)) {
          switch (currnt) {
            case '11':
              console.log('once');
              phrase += 'Once ';
              break;
            case '12':
              phrase += 'Doce ';
              break;
            case '13':
              phrase += 'Trece ';
              break;
            case '14':
              phrase += 'Catorce ';
              break;
            case '15':
              phrase += 'Quince ';
              break;
            default:
              phrase += 'Dieci' + numericData[0][Number(currnt[1])].toLowerCase();
              break;
          }
          currnt = ''
          break
        } else {
          if (Number(single) != 0) {
            phrase += numericData[currnt.length - 1][Number(single)]
            currnt = currnt.slice(1, currnt.length);
          }
        }
      }
      if (splitted.length > 1 && thousand == 0) {
        phrase += 'mil ';
        thousand++;
      }
    }
    return phrase
  }
  decs = 'Cero';

  if (parts.length > 1) {
    if (parts[1].length == 1) {
      parts[1] += '0';
    } else if (parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
    decs = conversion(parts[1]);
  }
  return conversion(parts[0]) + ' Quetzales con ' + decs + ' Centavos'
}
